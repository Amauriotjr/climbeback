const express = require('express');

const { TokenStore } = require('./tokenStore');
const { listWeekly, listMonthly, createMeeting, updateMeeting, deleteMeeting } = require('./calendarService');
const authMiddleware = require('../../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Integrações do Google
 *     description: Integrações com Google Calendar via OAuth unificado (Auth Google).
 */

/**
 * @swagger
 * /google-calendar/agenda/weekly:
 *   get:
 *     summary: Lista eventos da semana do usuário autenticado
 *     tags: [Integrações do Google]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Data de referência (YYYY-MM-DD). Se omitida, usa a semana atual.
 *     responses:
 *       200:
 *         description: Lista de eventos semanais
 *       401:
 *         description: Não autenticado
 *       500:
 *         description: Erro ao buscar eventos
 */
router.get('/agenda/weekly', authMiddleware, async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    const items = await listWeekly({
      userId,
      date: req.query.date,
      tokenStore: TokenStore,
    });
    res.json(items);
  } catch (err) {
    console.error('[Google Calendar] Erro ao listar eventos semanais:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /google-calendar/agenda/monthly:
 *   get:
 *     summary: Lista eventos do mês do usuário autenticado
 *     tags: [Integrações do Google]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         required: false
 *         description: "Ano para buscar os eventos (padrão: ano atual)."
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *         required: false
 *         description: "Mês para buscar os eventos (1 a 12, padrão: mês atual)."
 *     responses:
 *       200:
 *         description: Lista de eventos mensais
 *       401:
 *         description: Não autenticado
 *       500:
 *         description: Erro ao buscar eventos
 */
router.get('/agenda/monthly', authMiddleware, async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    const items = await listMonthly({
      userId,
      year: req.query.year,
      month: req.query.month,
      tokenStore: TokenStore,
    });
    res.json(items);
  } catch (err) {
    console.error('[Google Calendar] Erro ao listar eventos mensais:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /google-calendar/meetings:
 *   post:
 *     summary: Cria um evento no Google Calendar para o usuário autenticado
 *     tags: [Integrações do Google]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Payload compatível com a API de eventos do Google Calendar.
 *             properties:
 *               summary:
 *                 type: string
 *                 description: Título do evento
 *               description:
 *                 type: string
 *                 description: Descrição do evento
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
 *               colorId:
 *                 type: string
 *                 description: ID da cor (1-11)
 *               extendedProperties:
 *                 type: object
 *                 properties:
 *                   private:
 *                     type: object
 *                     properties:
 *                       tipo:
 *                         type: string
 *                         enum: [Entrega, Pagamento, Reunião, Vencimento, online, presencial]
 *                       cliente:
 *                         type: string
 *                       status:
 *                         type: string
 *           example:
 *             summary: 'Reunião de alinhamento'
 *             description: 'Discussão sobre o projeto.'
 *             start:
 *               dateTime: '2025-12-10T10:00:00'
 *               timeZone: 'America/Sao_Paulo'
 *             end:
 *               dateTime: '2025-12-10T11:00:00'
 *               timeZone: 'America/Sao_Paulo'
 *             colorId: '6'
 *             extendedProperties:
 *               private:
 *                 tipo: 'online'
 *                 cliente: 'Cliente X'
 *                 status: 'agendada'
 *     responses:
 *       201:
 *         description: Evento criado com sucesso
 *       401:
 *         description: Não autenticado
 *       500:
 *         description: Erro ao criar evento
 */
router.post('/meetings', authMiddleware, async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    
    console.log('[Google Calendar] Criando evento:', {
      userId,
      summary: req.body.summary,
      tipo: req.body.extendedProperties?.private?.tipo
    });

    const created = await createMeeting({
      userId,
      payload: req.body,
      tokenStore: TokenStore,
    });
    
    console.log('[Google Calendar] Evento criado com sucesso:', created.id);
    res.status(201).json(created);
  } catch (err) {
    console.error('[Google Calendar] Erro ao criar evento:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /google-calendar/meetings/{eventId}:
 *   put:
 *     summary: Atualiza um evento no Google Calendar do usuário autenticado
 *     tags: [Integrações do Google]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do evento no Google Calendar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Evento atualizado com sucesso
 *       401:
 *         description: Não autenticado
 *       500:
 *         description: Erro ao atualizar evento
 */
router.put('/meetings/:eventId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    
    console.log('[Google Calendar] Atualizando evento:', req.params.eventId);

    const updated = await updateMeeting({
      userId,
      eventId: req.params.eventId,
      payload: req.body,
      tokenStore: TokenStore,
    });
    
    console.log('[Google Calendar] Evento atualizado com sucesso');
    res.json(updated);
  } catch (err) {
    console.error('[Google Calendar] Erro ao atualizar evento:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /google-calendar/meetings/{eventId}:
 *   delete:
 *     summary: Exclui um evento do Google Calendar do usuário autenticado
 *     tags: [Integrações do Google]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do evento no Google Calendar.
 *     responses:
 *       200:
 *         description: Evento excluído com sucesso
 *       401:
 *         description: Não autenticado
 *       500:
 *         description: Erro ao excluir evento
 */
router.delete('/meetings/:eventId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    
    console.log('[Google Calendar] Excluindo evento:', req.params.eventId);

    const result = await deleteMeeting({
      userId,
      eventId: req.params.eventId,
      tokenStore: TokenStore,
    });
    
    console.log('[Google Calendar] Evento excluído com sucesso');
    res.json(result);
  } catch (err) {
    console.error('[Google Calendar] Erro ao excluir evento:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;