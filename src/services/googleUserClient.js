const { google } = require('googleapis');
const { getOAuthClient } = require('./googleTokenService');

/**
 * Obtém o cliente do Google Drive autenticado para um usuário.
 * @param {number} userId - O ID do usuário da aplicação.
 * @returns {Promise<google.drive.Drive | null>} O cliente do Google Drive ou null se não houver token.
 */
async function getUserDrive(userId) {
  const auth = await getOAuthClient(userId);
  if (!auth) return null;

  return google.drive({ version: 'v3', auth });
}

module.exports = { getUserDrive };