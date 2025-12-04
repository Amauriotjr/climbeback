const { oauth2Client } = require('../services/googleUserClient');
const GoogleToken = require('../models/GoogleToken');

const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/spreadsheets'
];

module.exports = {

  authUrl: async (req, res) => {
    const userId = (req.user && req.user.id) || Number(req.query.userId);
    if (!userId) return res.status(400).json({ error: 'userId ausente' });
    const client = oauth2Client();
    const url = client.generateAuthUrl({
      access_type: process.env.GOOGLE_ACCESS_TYPE || 'offline',
      prompt: process.env.GOOGLE_PROMPT || 'consent',
      scope: SCOPES,
      state: String(userId),
    });
    return res.json({ url });
  },
  
  authStart: async (req, res) => {
    const userId = (req.user && req.user.id) || Number(req.query.userId);
    if (!userId) return res.status(400).json({ error: 'userId ausente' });
    const client = oauth2Client();
    const url = client.generateAuthUrl({
      access_type: process.env.GOOGLE_ACCESS_TYPE || 'offline',
      prompt: process.env.GOOGLE_PROMPT || 'consent',
      scope: SCOPES,
      state: String(userId),
    });
    res.redirect(url);
  },

  authCallback: async (req, res) => {
    try {
      const code = req.query.code;
      const userId = Number(req.query.state);
      const client = oauth2Client();
      const { tokens } = await client.getToken(code);
      await GoogleToken.upsert({
        user_id: userId,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        scope: tokens.scope,
        token_type: tokens.token_type,
        expiry_date: tokens.expiry_date,
      });
      res.send('Google Drive conectado com sucesso. Você já pode fechar esta aba.');
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }
};