const nodemailer = require('nodemailer');

const smtpPort = parseInt(process.env.SMTP_PORT) || 587;

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST || 'smtp.gmail.com',
  port:   smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS || process.env.SMTP_PASSWORD,
  },
  // rejectUnauthorized solo se deshabilita en desarrollo local
  tls: process.env.NODE_ENV === 'production' ? {} : { rejectUnauthorized: false },
  connectionTimeout: 5000,
  socketTimeout:     5000,
});

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const FROM = process.env.SMTP_FROM || process.env.SMTP_USER;

async function sendVerificationEmail(email, nombre, verifyUrl) {
  const safeName = escapeHtml(nombre);
  await transporter.sendMail({
    from:    `"Yoga Tierra Viva" <${FROM}>`,
    to:      email,
    subject: 'Confirma tu cuenta · Yoga Tierra Viva',
    html: `
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#2c2c2c;">
        <h1 style="font-size:1.8rem;font-weight:400;color:#8b5e3c;margin-bottom:0.25rem">Yoga Tierra Viva</h1>
        <hr style="border:none;border-top:1px solid #e8e2da;margin:1rem 0 2rem"/>
        <p style="font-size:1.05rem;margin-bottom:0.5rem">Hola, <strong>${safeName}</strong> 🌿</p>
        <p style="color:#555;line-height:1.7;margin-bottom:2rem">
          Gracias por unirte a Yoga Tierra Viva. Haz clic en el botón para confirmar tu cuenta y activar tu suscripción.
        </p>
        <div style="text-align:center;margin:2rem 0">
          <a href="${verifyUrl}"
             style="background:#8b5e3c;color:#fff;padding:14px 32px;text-decoration:none;border-radius:50px;font-family:Raleway,sans-serif;font-size:0.9rem;letter-spacing:0.06em;text-transform:uppercase;display:inline-block">
            Confirmar cuenta
          </a>
        </div>
        <p style="color:#999;font-size:0.82rem;line-height:1.6">
          El enlace caduca en <strong>24 horas</strong>. Si no has creado esta cuenta, ignora este email.
        </p>
        <p style="color:#bbb;font-size:0.78rem;margin-top:1rem">
          Si el botón no funciona, copia este enlace en tu navegador:<br/>
          <a href="${verifyUrl}" style="color:#8b5e3c">${verifyUrl}</a>
        </p>
      </div>
    `,
  });
  console.log('Email de verificación enviado a:', email);
}

async function sendPasswordResetEmail(email, resetUrl) {
  await transporter.sendMail({
    from:    `"Yoga Tierra Viva" <${FROM}>`,
    to:      email,
    subject: 'Recuperar contraseña · Yoga Tierra Viva',
    html: `
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#2c2c2c;">
        <h1 style="font-size:1.8rem;font-weight:400;color:#8b5e3c;margin-bottom:0.25rem">Yoga Tierra Viva</h1>
        <hr style="border:none;border-top:1px solid #e8e2da;margin:1rem 0 2rem"/>
        <p style="color:#555;line-height:1.7;margin-bottom:2rem">
          Has solicitado restablecer tu contraseña. Haz clic en el botón para crear una nueva:
        </p>
        <div style="text-align:center;margin:2rem 0">
          <a href="${resetUrl}"
             style="background:#8b5e3c;color:#fff;padding:14px 32px;text-decoration:none;border-radius:50px;font-family:Raleway,sans-serif;font-size:0.9rem;letter-spacing:0.06em;text-transform:uppercase;display:inline-block">
            Restablecer contraseña
          </a>
        </div>
        <p style="color:#999;font-size:0.82rem;line-height:1.6">
          El enlace caduca en <strong>1 hora</strong>. Si no solicitaste este cambio, ignora este email.
        </p>
      </div>
    `,
  });
  console.log('Email de recuperación enviado a:', email);
}

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
