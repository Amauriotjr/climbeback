// src/services/googleClient.js
const { google } = require('googleapis');

function auth() {
  // aceita GOOGLE_CLIENT_EMAIL/PRIVATE_KEY e GOOGLE_SA_EMAIL/PRIVATE_KEY
  const clientEmail =
    process.env.GOOGLE_CLIENT_EMAIL || process.env.GOOGLE_SA_EMAIL;
  const privateKeyRaw =
    process.env.GOOGLE_PRIVATE_KEY || process.env.GOOGLE_SA_PRIVATE_KEY || '';

  if (!clientEmail || !privateKeyRaw) {
    throw new Error('Google Service Account envs ausentes: defina GOOGLE_CLIENT_EMAIL/PRIVATE_KEY ou GOOGLE_SA_EMAIL/PRIVATE_KEY');
  }

  const privateKey = privateKeyRaw.replace(/\\n/g, '\n');

  return new google.auth.JWT(
    clientEmail,
    null,
    privateKey,
    [
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/spreadsheets',
    ]
  );
}

function clients() {
  const jwt = auth();
  return {
    drive: google.drive({ version: 'v3', auth: jwt }),
    sheets: google.sheets({ version: 'v4', auth: jwt }),
  };
}

module.exports = { auth, clients };
