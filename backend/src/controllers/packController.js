const { executeQuery } = require('../config/database');

let _stripe;
function getStripe() {
  if (!_stripe) _stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  return _stripe;
}

const PACK_SLUG    = 'pack-raiz';
const PACK_NOMBRE  = 'Yoga Tierra Viva · Pack Raíz (10 clases)';
const PRICE_CENTS  = 1599; // 15,99 €

class PackController {
  static async getEstado(req, res) {
    try {
      const result = await executeQuery(
        `SELECT id, created_at FROM compras_pack WHERE usuario_id = ? AND pack_slug = ? LIMIT 1`,
        [req.user.id, PACK_SLUG]
      );
      const owns = result.success && result.data.length > 0;
      res.json({ success: true, data: { owns, packSlug: PACK_SLUG } });
    } catch (err) {
      console.error('Error en getEstado (pack):', err);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }

  static async createCheckout(req, res) {
    try {
      const { id: usuarioId, email, nombre } = req.user;

      const existing = await executeQuery(
        `SELECT id FROM compras_pack WHERE usuario_id = ? AND pack_slug = ?`,
        [usuarioId, PACK_SLUG]
      );
      if (existing.success && existing.data.length > 0) {
        return res.status(409).json({ success: false, message: 'Ya tienes el Pack Raíz' });
      }

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
      } else {
        // El pago pudo completarse ya en Stripe sin que el webhook haya llegado
        // todavía a nuestra BD (compras_pack). Preguntamos a Stripe directamente
        // antes de abrir un segundo cobro para el mismo pack.
        const recentSessions = await getStripe().checkout.sessions.list({
          customer: stripeCustomerId,
          limit: 10,
        });
        const paidSession = recentSessions.data.find(s =>
          s.metadata?.pack_slug === PACK_SLUG && s.payment_status === 'paid'
        );
        if (paidSession) {
          await PackController.registrarCompra(paidSession);
          return res.status(409).json({ success: false, message: 'Ya tienes el Pack Raíz' });
        }
      }

      const baseUrl = process.env.FRONTEND_URL
        || (process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : null)
        || 'http://localhost:5173';

      const session = await getStripe().checkout.sessions.create({
        mode: 'payment',
        customer: stripeCustomerId,
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'eur',
            product_data: { name: PACK_NOMBRE },
            unit_amount: PRICE_CENTS,
          },
          quantity: 1,
        }],
        success_url: `${baseUrl}/suscripcion?pack_exito=1`,
        cancel_url:  `${baseUrl}/suscripcion`,
        metadata: { usuario_id: String(usuarioId), tipo: 'pack', pack_slug: PACK_SLUG },
        locale: 'es',
      });

      res.json({ success: true, url: session.url });
    } catch (err) {
      console.error('Error en createCheckout (pack):', err);
      res.status(500).json({ success: false, message: 'Error al iniciar el pago' });
    }
  }

  // Llamado desde el webhook de Stripe compartido cuando la sesión es de tipo 'pack'
  static async registrarCompra(session) {
    const usuarioId = parseInt(session.metadata?.usuario_id);
    if (!usuarioId) return;
    const packSlug = session.metadata?.pack_slug || PACK_SLUG;
    const importe  = (session.amount_total ?? PRICE_CENTS) / 100;
    await executeQuery(
      `INSERT IGNORE INTO compras_pack (usuario_id, pack_slug, stripe_session_id, importe) VALUES (?, ?, ?, ?)`,
      [usuarioId, packSlug, session.id, importe]
    );
  }
}

module.exports = PackController;
