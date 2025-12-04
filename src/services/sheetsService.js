const Documento = require('../models/Documento');
const { google } = require('googleapis');
const { auth } = require('./googleClient');
const { getUserDrive } = require('./googleUserClient');

// Helper: get Drive and Sheets clients
function clients() {
  const jwt = auth();
  const drive = google.drive({ version: 'v3', auth: jwt });
  const sheets = google.sheets({ version: 'v4', auth: jwt });
  return { drive, sheets };
}

// src/services/sheetsService.js
async function copyTemplateToContrato({ templateFileId, nome, contratoId, userId, empresaId }) {
  let driveRef = null;
  if (userId) {
    const userDrive = await getUserDrive(userId);
    if (userDrive) driveRef = userDrive;
  }
  const { drive } = clients();
  const usedDrive = driveRef || drive;
  const destParent = process.env.GOOGLE_DRIVE_FOLDER_ID_CONTRACTS;

const copyRes = await usedDrive.files.copy({
    fileId: templateFileId,
    supportsAllDrives: true,                 // <— importante mesmo no Meu Drive (não atrapalha)
    requestBody: {
      name: nome,
      parents: destParent ? [destParent] : undefined
    },
    fields: 'id, name'
  });
  const fileId = copyRes.data.id;


    await usedDrive.files.update({
    fileId,
    supportsAllDrives: true,           
    requestBody: {
      viewersCanCopyContent: false,
      copyRequiresWriterPermission: true
    },
    fields: 'id'
  });


  const created = await Documento.create({
    nome,
    tipo: 'planilha',
    url: `https://docs.google.com/spreadsheets/d/${fileId}`,
    empresa_id: 1,                  // se quiser, mantenha a empresa padrão ou passe no body num próximo ajuste
    contrato_id: contratoId ?? null, // <— aqui é o importante
    google_file_id: fileId,
    google_spreadsheet_id: fileId
  });

  return created;
}


async function setPermissions({ documentoId, userId, viewers=[], commenters=[], editors=[] }) {
  let driveRef = null;
  if (userId) {
    const userDrive = await getUserDrive(userId);
    if (userDrive) driveRef = userDrive;
  }
  const { drive } = clients();
  const usedDrive = driveRef || drive;
  const doc = await Documento.findByPk(documentoId);
  if (!doc) throw new Error('Documento não encontrado');
  const fileId = doc.google_file_id || doc.google_spreadsheet_id;
  if (!fileId) throw new Error('Documento não possui integração Google');

  async function grant(list, role) {
    for (const email of list) {
      await drive.permissions.create({
        fileId,
        requestBody: { type: 'user', role, emailAddress: email },
        sendNotificationEmail: false
      });
    }
  }
  await grant(viewers, 'reader');
  await grant(commenters, 'commenter');
  await grant(editors, 'writer');
  return { ok: true };
}
module.exports = { copyTemplateToContrato, setPermissions /*...*/ };
