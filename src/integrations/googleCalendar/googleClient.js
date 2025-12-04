const { google } = require('googleapis');

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL,
} = process.env;

function makeOAuthClient() {
  return new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL
  );
}

function generateAuthUrl() {
  const oauth2Client = makeOAuthClient();
  const scopes = [
    'https://www.googleapis.com/auth/calendar.events'
  ];
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: scopes,
  });
}

async function getAuthedClientForUser(userId, tokenStore) {
  const oauth2Client = makeOAuthClient();
  const token = await tokenStore.get(userId);
  if (!token) {
    throw new Error('Missing Google token for user');
  }
  oauth2Client.setCredentials(token);
  return oauth2Client;
}

module.exports = { makeOAuthClient, generateAuthUrl, getAuthedClientForUser };
