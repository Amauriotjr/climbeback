const express = require('express');
const { makeOAuthClient, generateAuthUrl } = require('./googleClient');
const { TokenStore } = require('./tokenStore');
const { listWeekly, listMonthly, createMeeting } = require('./calendarService');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Google Calendar
 *   description: Integração com o Google Calendar para agendamento e visualização de eventos.
 */


// start oauth
/**
 * @swagger
 * /google-calendar/auth/url:
 *   get:
 *     summary: Gera a URL de autenticação para o Google Calendar
 *     tags: [Google Calendar]
 *     responses:
 *       200:
 *         description: URL de autenticação gerada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   format: url
 *                   description: URL para o usuário autorizar o acesso ao Google Calendar.
 */
router.get('/auth/url', (req, res) => {
  const url = generateAuthUrl();
  res.json({ url });
});

// callback
/**
 * @swagger
 * /google-calendar/auth/callback:
 *   get:
 *     summary: Callback de autenticação do Google Calendar
 *     tags: [Google Calendar]
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: Código de autorização retornado pelo Google.
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: false
 *         description: ID do usuário (email) para armazenar o token.
 *     responses:
 *       200:
 *         description: Autenticação concluída com sucesso
 *       500:
 *         description: Erro no callback
 */
router.get('/auth/callback', async (req, res) => {
  try {
    const { code } = req.query;
    const userId = req.query.userId || (process.env.EMAIL_USER || 'climbeinvestimentos@gmail.com');

    const oauth2Client = makeOAuthClient();
    const { tokens } = await oauth2Client.getToken(code);
    await TokenStore.set(userId, tokens);
    res.send('✅ Google Calendar conectado. Pode fechar esta aba.');
  } catch (err) {
    res.status(500).send(`Erro no callback: ${err.message}`);
  }
});

// list weekly
/**
 * @swagger
 * /google-calendar/agenda/weekly:
 *   get:
 *     summary: Lista eventos da semana
 *     tags: [Google Calendar]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: false
 *         description: ID do usuário (email) para buscar os eventos.
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Data de início da semana (formato YYYY-MM-DD). Se omitido, usa a semana atual.
 *     responses:
 *       200:
 *         description: Lista de eventos semanais
 *       500:
 *         description: Erro ao buscar eventos
 */
router.get('/agenda/weekly', async (req, res) => {
  try {
    const userId = req.query.userId || (process.env.EMAIL_USER || 'climbeinvestimentos@gmail.com');
    const items = await listWeekly({ userId, date: req.query.date, tokenStore: TokenStore });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// list monthly
/**
 * @swagger
 * /google-calendar/agenda/monthly:
 *   get:
 *     summary: Lista eventos do mês
 *     tags: [Google Calendar]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: false
 *         description: ID do usuário (email) para buscar os eventos.
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         required: true
 *         description: Ano para buscar os eventos.
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *         required: true
 *         description: Mês para buscar os eventos (1 a 12).
 *     responses:
 *       200:
 *         description: Lista de eventos mensais
 *       500:
 *         description: Erro ao buscar eventos
 */
router.get('/agenda/monthly', async (req, res) => {
  try {
    const userId = req.query.userId || (process.env.EMAIL_USER || 'climbeinvestimentos@gmail.com');
    const items = await listMonthly({ userId, year: req.query.year, month: req.query.month, tokenStore: TokenStore });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// create meeting
/**
 * @swagger
 * /google-calendar/meetings:
 *   post:
 *     summary: Cria um novo evento/reunião no Google Calendar
 *     tags: [Google Calendar]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: false
 *         description: ID do usuário (email) para criar o evento.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               summary:
 *                 type: string
 *               description:
 *                 type: string
 *               start:
 *                 type: object
 *                 properties:
 *                   dateTime:
 *                     type: string
 *                     format: date-time
 *                   timeZone:
 *                     type: string
 *               end:
 *                 type: object
 *                 properties:
 *                   dateTime:
 *                     type: string
 *                     format: date-time
 *                   timeZone:
 *                     type: string
 *               attendees:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *             example:
 *               summary: "Reunião de Alinhamento"
 *               description: "Discussão sobre o projeto Climbe."
 *               start:
 *                 dateTime: "2025-11-01T10:00:00-03:00"
 *                 timeZone: "America/Sao_Paulo"
 *               end:
 *                 dateTime: "2025-11-01T11:00:00-03:00"
 *                 timeZone: "America/Sao_Paulo"
 *               attendees:
 *                 - email: "usuario1@empresa.com"
 *                 - email: "usuario2@empresa.com"
 *     responses:
 *       201:
 *         description: Evento criado com sucesso
 *       500:
 *         description: Erro ao criar evento
 */
router.post('/meetings', async (req, res) => {
  try {
    const userId = req.query.userId || (process.env.EMAIL_USER || 'climbeinvestimentos@gmail.com');
    const created = await createMeeting({ userId, payload: req.body, tokenStore: TokenStore });
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
