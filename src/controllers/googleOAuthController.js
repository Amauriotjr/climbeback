const { OAuth2Client } = require('google-auth-library');
const { google } = require('googleapis');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const GoogleToken = require('../models/GoogleToken');

// Serviços
const { notifyAdmins } = require('../services/emailService');

// --- Configurações ---

const SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/drive.file',      // Acesso a arquivos criados pelo app
  'https://www.googleapis.com/auth/spreadsheets',    // Acesso a Google Sheets
  'https://www.googleapis.com/auth/calendar'         // Acesso a Google Calendar
];

const redirectUri =
  process.env.GOOGLE_CALLBACK_URL ||
  (process.env.BASE_URL
    ? `${process.env.BASE_URL}/api/auth/google/callback`
    : 'http://localhost:3000/api/auth/google/callback');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  redirectUri
);

// --- Controladores ---

/**
 * @route GET /api/auth/google
 * @desc Inicia o fluxo de autenticação OAuth 2.0 do Google.
 */
exports.authStart = (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: process.env.GOOGLE_ACCESS_TYPE || 'offline',
    prompt: process.env.GOOGLE_PROMPT || 'consent',
    scope: SCOPES,
    state: req.query.state || 'default', // Pode ser usado para passar informações de estado
  });

  return res.redirect(authUrl);
};

/**
 * @route GET /api/auth/google/callback
 * @desc Endpoint de callback do Google após a autenticação.
 */
exports.authCallback = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).send('Código de autorização ausente na URL de callback.');
    }

    // 1. Troca o código de autorização por tokens de acesso e refresh
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // 2. Obtém informações do usuário autenticado
    const oauth2 = google.oauth2({ auth: oauth2Client, version: 'v2' });
    const userInfoResponse = await oauth2.userinfo.get();
    const { email: emailGoogle, name: nomeGoogle } = userInfoResponse.data;

    // 3. Busca ou cria o usuário no banco de dados local
    let user = await User.findOne({ where: { email: emailGoogle } });

    if (!user) {
      // Cria novo usuário com status 'pendente'
      user = await User.create({
        nome_completo: nomeGoogle || 'Usuário Google',
        cargo_id: 2, // Cargo padrão
        cpf: '00000000000', // CPF placeholder
        email: emailGoogle,
        contato: 'N/A',
        senha_hash: '',
        situacao: 'pendente',
      });

      await notifyAdmins(user);
      return res
        .status(403)
        .send('Usuário criado. Aguardando aprovação de administrador. Pode fechar esta aba.');
    }

    if (user.situacao !== 'ativo') {
      return res.status(403).send('Usuário não aprovado. Pode fechar esta aba.');
    }

    // 4. Salva ou atualiza os tokens do Google no banco de dados
    const [googleToken, created] = await GoogleToken.findOrCreate({
      where: { user_id: user.id_usuario },
      defaults: {
        user_id: user.id_usuario,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        scope: tokens.scope,
        token_type: tokens.token_type,
        expiry_date: tokens.expiry_date,
      },
    });

    if (!created) {
      googleToken.access_token = tokens.access_token;
      // Mantém o refresh token se o Google não fornecer um novo (comum em fluxos subsequentes)
      googleToken.refresh_token = tokens.refresh_token || googleToken.refresh_token;
      googleToken.scope = tokens.scope;
      googleToken.token_type = tokens.token_type;
      googleToken.expiry_date = tokens.expiry_date;
      await googleToken.save();
    }

    // 5. Gera JWT para o login na aplicação
    const appToken = jwt.sign(
      { id: user.id_usuario, email: user.email, cargo_id: user.cargo_id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    // 6. Redireciona para o frontend com o token JWT da aplicação
    //    (não mostra nenhuma página HTML de sucesso)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const normalizedFrontendUrl = frontendUrl.replace(/\/$/, '');
    const redirectUrl = `${normalizedFrontendUrl}/google-auth/callback?token=${encodeURIComponent(
      appToken
    )}`;

    return res.redirect(302, redirectUrl);
  } catch (error) {
    console.error('Erro no callback do Google:', error);

    // HTML apenas para caso de ERRO (não para sucesso)
    const errorHtml = (message, details) => `
      <html>
        <head>
          <title>Erro no Login Google</title>
          <style>
            body { font-family: sans-serif; text-align: center; padding: 50px; }
            h1 { color: #d9534f; }
            code { background-color: #eee; padding: 2px 4px; border-radius: 3px; }
          </style>
        </head>
        <body>
          <h1>❌ Erro no Login Google</h1>
          <p>${message}</p>
          <p>Detalhes: ${details}</p>
          ${
            error.message.includes('redirect_uri_mismatch')
              ? `<p><strong>Atenção:</strong> Se o erro for 'redirect_uri_mismatch', verifique se a URL <code>${redirectUri}</code> está configurada no Google Cloud Console.</p>`
              : ''
          }
          <p>Pode fechar esta aba.</p>
        </body>
      </html>
    `;

    return res.status(500).send(
      errorHtml('Ocorreu um erro durante o processo de autenticação.', error.message)
    );
  }
};
