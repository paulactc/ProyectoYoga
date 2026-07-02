const { executeQuery } = require('../config/database');

let _stripe;
function getStripe() {
  if (!_stripe) _stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  return _stripe;
}

const PRICE_CENTS = 1900; // 19 €
const TRIAL_DAYS  = 7;

class SuscripcionController {
  static async getEstado(req, res) {
    try {
      const result = await executeQuery(
        `SELECT id, estado, fecha_inicio, fecha_fin
         FROM suscripciones
         WHERE usuario_id = ? AND estado = 'activa' AND fecha_fin >= CURDATE()
         ORDER BY fecha_fin DESC LIMIT 1`,
        [req.user.id]
      );

      const activa = result.success && result.data.length > 0;
      res.json({
        success: true,
        data: { subscribed: activa, suscripcion: activa ? result.data[0] : null },
      });
    } catch (err) {
      console.error('Error en getEstado:', err);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }

  static async createCheckout(req, res) {
    try {
      const { id: usuarioId, email, nombre } = req.user;

      // Comprobar si ya tiene suscripción activa
      const existing = await executeQuery(
        `SELECT id FROM suscripciones WHERE usuario_id = ? AND estado = 'activa' AND fecha_fin >= CURDATE()`,
        [usuarioId]
      );
      if (existing.success && existing.data.length > 0) {
        return res.status(409).json({ success: false, message: 'Ya tienes una suscripción activa' });
      }

      // Obtener o crear cliente en Stripe
      const userRow = await executeQuery(
        'SELECT stripe_customer_id FROM usuarios WHERE id = ?',
        [usuarioId]
      );
      let stripeCustomerId = userRow.success && userRow.data[0]?.stripe_customer_id;

      if (!stripeCustomerId) {
        const customer = await getStripe().customers.create({
          email,
          name: nombre,
          metadata: { usuario_id: String(usuarioId) },
        });
        stripeCustomerId = customer.id;
        await executeQuery(
          'UPDATE usuarios SET stripe_customer_id = ? WHERE id = ?',
          [stripeCustomerId, usuarioId]
        );
      }

      const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

      const session = await getStripe().checkout.sessions.create({
        mode: 'subscription',
        customer: stripeCustomerId,
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'eur',
            product_data: { name: 'Yoga Tierra Viva · Plan Mensual' },
            unit_amount: PRICE_CENTS,
            recurring: { interval: 'month' },
          },
          quantity: 1,
        }],
        subscription_data: {
          trial_period_days: TRIAL_DAYS,
          metadata: { usuario_id: String(usuarioId) },
        },
        success_url: `${baseUrl}/suscripcion?exito=1`,
        cancel_url:  `${baseUrl}/suscripcion`,
        metadata: { usuario_id: String(usuarioId) },
        locale: 'es',
      });

      res.json({ success: true, url: session.url });
    } catch (err) {
      console.error('Error en createCheckout:', err);
      res.status(500).json({ success: false, message: 'Error al iniciar el pago' });
    }
  }

  static async handleWebhook(req, res) {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = getStripe().webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Webhook firma inválida:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      switch (event.type) {

        case 'checkout.session.completed': {
          const session = event.data.object;
          const usuarioId = parseInt(session.metadata?.usuario_id);
          const subscriptionId = session.subscription;
          if (!usuarioId || !subscriptionId) break;

          const sub = await getStripe().subscriptions.retrieve(subscriptionId);
          const fechaInicio = new Date(sub.current_period_start * 1000).toISOString().slice(0, 10);
          const fechaFin    = new Date(sub.current_period_end   * 1000).toISOString().slice(0, 10);

          await executeQuery(
            `UPDATE suscripciones SET estado = 'cancelada', updated_at = NOW()
             WHERE usuario_id = ? AND estado = 'activa'`,
            [usuarioId]
          );
          await executeQuery(
            `INSERT INTO suscripciones
               (usuario_id, estado, importe, fecha_inicio, fecha_fin, stripe_subscription_id)
             VALUES (?, 'activa', ?, ?, ?, ?)`,
            [usuarioId, PRICE_CENTS / 100, fechaInicio, fechaFin, subscriptionId]
          );
          break;
        }

        case 'customer.subscription.updated': {
          const sub = event.data.object;
          const isActive = ['active', 'trialing'].includes(sub.status);
          const fechaFin  = new Date(sub.current_period_end * 1000).toISOString().slice(0, 10);

          if (isActive) {
            await executeQuery(
              `UPDATE suscripciones SET fecha_fin = ?, updated_at = NOW()
               WHERE stripe_subscription_id = ?`,
              [fechaFin, sub.id]
            );
          } else {
            await executeQuery(
              `UPDATE suscripciones SET estado = 'cancelada', updated_at = NOW()
               WHERE stripe_subscription_id = ?`,
              [sub.id]
            );
          }
          break;
        }

        case 'customer.subscription.deleted': {
          const sub = event.data.object;
          await executeQuery(
            `UPDATE suscripciones SET estado = 'cancelada', updated_at = NOW()
             WHERE stripe_subscription_id = ?`,
            [sub.id]
          );
          break;
        }

        case 'invoice.payment_failed': {
          const invoice = event.data.object;
          if (invoice.subscription) {
            await executeQuery(
              `UPDATE suscripciones SET estado = 'expirada', updated_at = NOW()
               WHERE stripe_subscription_id = ? AND estado = 'activa'`,
              [invoice.subscription]
            );
          }
          break;
        }
      }

      res.json({ received: true });
    } catch (err) {
      console.error('Error procesando webhook:', err);
      res.status(500).json({ error: 'Error interno' });
    }
  }

  static async cancelar(req, res) {
    try {
      const result = await executeQuery(
        `SELECT id, stripe_subscription_id FROM suscripciones
         WHERE usuario_id = ? AND estado = 'activa'`,
        [req.user.id]
      );

      if (!result.success || result.data.length === 0) {
        return res.status(404).json({ success: false, message: 'No tienes ninguna suscripción activa' });
      }

      const { id: subId, stripe_subscription_id } = result.data[0];

      if (stripe_subscription_id) {
        await getStripe().subscriptions.cancel(stripe_subscription_id);
      }

      await executeQuery(
        `UPDATE suscripciones SET estado = 'cancelada', updated_at = NOW() WHERE id = ?`,
        [subId]
      );

      res.json({ success: true, message: 'Suscripción cancelada correctamente' });
    } catch (err) {
      console.error('Error en cancelar:', err);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }
}

module.exports = SuscripcionController;
