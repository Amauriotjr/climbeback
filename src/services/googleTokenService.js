const GoogleToken = require('../models/GoogleToken');
const { google } = require('googleapis');

/**
 * Obtém o cliente OAuth 2.0 configurado com os tokens do Google para um determinado user_id.
 * @param {number} userId - O ID do usuário da aplicação.
 * @returns {Promise<google.auth.OAuth2 | null>} O cliente OAuth 2.0 configurado ou null se não houver token.
 */
async function getOAuthClient(userId) {
    const tokenRecord = await GoogleToken.findOne({ where: { user_id: userId } });

    if (!tokenRecord) {
        return null;
    }

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        `${process.env.BASE_URL}/api/auth/google/callback`
    );

    oauth2Client.setCredentials({
        access_token: tokenRecord.access_token,
        refresh_token: tokenRecord.refresh_token,
        scope: tokenRecord.scope,
        token_type: tokenRecord.token_type,
        expiry_date: tokenRecord.expiry_date,
    });

    // Adiciona um listener para renovar o token automaticamente
    oauth2Client.on('tokens', async (tokens) => {
        if (tokens.access_token) {
            tokenRecord.access_token = tokens.access_token;
        }
        if (tokens.refresh_token) {
            tokenRecord.refresh_token = tokens.refresh_token;
        }
        if (tokens.expiry_date) {
            tokenRecord.expiry_date = tokens.expiry_date;
        }
        await tokenRecord.save();
    });

    return oauth2Client;
}

module.exports = {
    getOAuthClient
};
