const { google } = require('googleapis');
const GoogleToken = require('../models/GoogleToken');

function oauth2Client() {
  const redirectUri =
    process.env.GOOGLE_DRIVE_CALLBACK_URL || process.env.GOOGLE_CALLBACK_URL;

  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUri
  );
  return client;
}

async function getUserDrive(userId) {
  const row = await GoogleToken.findOne({ where: { user_id: userId } });
  if (!row) return null;

  const client = oauth2Client();
  client.setCredentials({
    access_token: row.access_token,
    refresh_token: row.refresh_token,
    scope: row.scope,
    token_type: row.token_type,
    expiry_date: row.expiry_date,
  });

  client.on('tokens', async (tokens) => {
    if (!tokens) return;
    await GoogleToken.update({
      access_token: tokens.access_token ?? row.access_token,
      refresh_token: tokens.refresh_token ?? row.refresh_token,
      scope: tokens.scope ?? row.scope,
      token_type: tokens.token_type ?? row.token_type,
      expiry_date: tokens.expiry_date ?? row.expiry_date,
    }, { where: { user_id: userId } });
  });

  return google.drive({ version: 'v3', auth: client });
}

module.exports = { oauth2Client, getUserDrive };