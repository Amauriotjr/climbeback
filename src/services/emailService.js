const nodemailer = require('nodemailer');
function buildTransport() {
  const host = process.env.EMAIL_HOST;
  const port = Number(process.env.EMAIL_PORT || 587);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  const secure = Boolean(process.env.EMAIL_SECURE === 'true' || port === 465);

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass }
  });
}

async function enviarEmail(destinatarios, assunto, texto, html) {
  const transport = buildTransport();
  if (!transport) {
    console.log('[emailService] Sem configuração SMTP, e-mail não enviado. Assunto:', assunto);
    return { skipped: true };
  }

  // Usa o EMAIL_FROM do .env, ou o EMAIL_USER como backup
  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;
  const mailOptions = { from, to: destinatarios, subject: assunto, text: texto, html };
  const info = await transport.sendMail(mailOptions);
  return { messageId: info.messageId };
}

async function notifyAdmins(newUser) {
  const approveLink = `https://climbe-backend-mz1c.onrender.com/api/auth/approve/${newUser.id_usuario}`;
  const rejectLink = `https://climbe-backend-mz1c.onrender.com/api/auth/reject/${newUser.id_usuario}`;

  const destinatarios = "nilton.linhares.n@gmail.com"; // email teste
  const assunto = "Novo usuário aguardando aprovação";
  const html = `
     <p>Usuário: ${newUser.nome_completo} (${newUser.email})</p>
     <a href="${approveLink}">Aprovar</a> | <a href="${rejectLink}">Rejeitar</a>
   `;
  const texto = `Usuário: ${newUser.nome_completo} (${newUser.email}). Aprovar: ${approveLink} Rejeitar: ${rejectLink}`;

  await enviarEmail(destinatarios, assunto, texto, html);
}

module.exports = { enviarEmail, notifyAdmins };