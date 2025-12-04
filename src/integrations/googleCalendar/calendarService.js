const { google } = require('googleapis');

/**
 * Utilitário interno para obter um cliente do Google Calendar
 * já autenticado para o usuário da aplicação.
 */
async function getCalendar({ userId, tokenStore }) {
  const auth = await tokenStore.getClient(userId);
  if (!auth) {
    throw new Error('Usuário não autenticado com o Google.');
  }
  return google.calendar({ version: 'v3', auth });
}

/**
 * Lista eventos da semana (segunda a domingo) contendo a data informada.
 * Se nenhuma data for enviada, considera a semana atual.
 */
async function listWeekly({ userId, date, tokenStore }) {
  const calendar = await getCalendar({ userId, tokenStore });

  let baseDate;
  try {
    baseDate = date ? new Date(date) : new Date();
    if (isNaN(baseDate.getTime())) throw new Error('Data inválida');
  } catch {
    baseDate = new Date();
  }

  const start = new Date(baseDate);
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(start);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  const resp = await calendar.events.list({
    calendarId: 'primary',
    timeMin: monday.toISOString(),
    timeMax: sunday.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
    maxResults: 100,
  });

  return resp.data.items || [];
}

/**
 * Lista eventos de um mês (intervalo completo do mês).
 * Se ano/mês não forem enviados, usa o mês/ano atuais.
 */
async function listMonthly({ userId, year, month, tokenStore }) {
  const calendar = await getCalendar({ userId, tokenStore });

  const now = new Date();
  const y = Number(year) || now.getFullYear();
  const m = Number(month) || now.getMonth() + 1;

  const start = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0));
  const end = new Date(Date.UTC(y, m, 0, 23, 59, 59));

  const resp = await calendar.events.list({
    calendarId: 'primary',
    timeMin: start.toISOString(),
    timeMax: end.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
    maxResults: 250,
  });

  return resp.data.items || [];
}

/**
 * Detecta se deve criar Google Meet baseado no tipo do evento.
 * Cria Meet APENAS para reuniões marcadas como 'online'.
 */
function shouldCreateMeet(payload) {
  // Verifica se já tem conferenceData (não sobrescrever)
  if (payload.conferenceData) {
    return false;
  }

  // Extrai o tipo do evento das propriedades estendidas
  const tipo = payload.extendedProperties?.private?.tipo || '';
  
  // Cria Meet apenas se for explicitamente 'online'
  return tipo.toLowerCase() === 'online';
}

/**
 * Adiciona configuração do Google Meet ao payload se necessário.
 */
function addMeetIfNeeded(payload) {
  if (shouldCreateMeet(payload)) {
    payload.conferenceData = {
      createRequest: {
        requestId: `meet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    };
  }
}

/**
 * Cria um evento no calendário.
 * 
 * COMPORTAMENTO:
 * - Eventos do tipo "Entrega", "Pagamento", "Vencimento": NÃO gera Meet
 * - Eventos do tipo "Reunião" presencial: NÃO gera Meet
 * - Eventos do tipo "Reunião" online: GERA Meet automaticamente
 */
async function createMeeting({ userId, payload, tokenStore }) {
  const calendar = await getCalendar({ userId, tokenStore });

  // Clona o payload para não modificar o objeto original
  const body = { ...payload };

  // Adiciona Google Meet apenas se for reunião online
  addMeetIfNeeded(body);

  const res = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: body,
    conferenceDataVersion: body.conferenceData ? 1 : 0,
    sendUpdates: body.sendUpdates || 'none',
  });

  return res.data;
}

/**
 * Atualiza um evento existente no calendário.
 */
async function updateMeeting({ userId, eventId, payload, tokenStore }) {
  if (!eventId) {
    throw new Error('eventId é obrigatório para atualizar o evento.');
  }

  const calendar = await getCalendar({ userId, tokenStore });

  // Clona o payload
  const body = { ...payload };

  // Adiciona Google Meet se necessário
  addMeetIfNeeded(body);

  const res = await calendar.events.update({
    calendarId: 'primary',
    eventId,
    requestBody: body,
    conferenceDataVersion: body.conferenceData ? 1 : 0,
    sendUpdates: body.sendUpdates || 'none',
  });

  return res.data;
}

/**
 * Remove um evento do calendário do usuário.
 */
async function deleteMeeting({ userId, eventId, tokenStore }) {
  if (!eventId) {
    throw new Error('eventId é obrigatório para excluir o evento.');
  }

  const calendar = await getCalendar({ userId, tokenStore });

  await calendar.events.delete({
    calendarId: 'primary',
    eventId,
    sendUpdates: 'none',
  });

  return { success: true };
}

module.exports = {
  listWeekly,
  listMonthly,
  createMeeting,
  updateMeeting,
  deleteMeeting,
};