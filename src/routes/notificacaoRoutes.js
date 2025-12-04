const express = require('express');
const router = express.Router();

const controller = require('../controllers/notificacaoController');
//const authMiddleware = require('../middlewares/authMiddleware'); 

/**
 * @swagger
 * tags:
 *   name: Notificações
 *   description: Endpoints para gerenciamento de notificações
 */

/**
 * @swagger
 * /notificacoes/minhas:
 *   get:
 *     summary: Lista todas as notificações não lidas do usuário autenticado
 *     tags: [Notificações]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de notificações não lidas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notificacao'
 *       401:
 *         description: Token inválido ou ausente
 */
router.get('/minhas', controller.minhas);

/**
 * @swagger
 * /notificacoes:
 *   post:
 *     summary: Cria uma notificação (padrão)
 *     tags: [Notificações]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuarioId
 *               - mensagem
 *             properties:
 *               usuarioId:
 *                 type: integer
 *               mensagem:
 *                 type: string
 *               email:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Notificação criada
 */
router.post('/', async (req, res) => {
  // optional wrapper to use criarNotificacao directly from service:
  const { usuarioId, mensagem, email = true } = req.body;
  try {
    const notificacaoService = require('../services/notificacaoService');
    const n = await notificacaoService.criarNotificacao(Number(usuarioId), mensagem, { email });
    res.status(201).json(n);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/**
 * @swagger
 * /notificacoes/test:
 *   post:
 *     summary: "Endpoint de teste: cria notificação, envia email e notifica via websocket"
 *     tags: [Notificações]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuarioId
 *               - mensagem
 *             properties:
 *               usuarioId:
 *                 type: integer
 *               mensagem:
 *                 type: string
 *               email:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: "Notificação criada e enviada via websockets/e-mail"
 */
router.post('/test', controller.test);

/**
 * @swagger
 * /notificacoes/{id}/lida:
 *   put:
 *     summary: Marca uma notificação como lida
 *     tags: [Notificações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da notificação a ser marcada como lida
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notificação marcada como lida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notificacao'
 *       404:
 *         description: Notificação não encontrada
 *       401:
 *         description: Token inválido ou ausente
 */
router.put('/:id/lida', controller.marcarComoLida);

module.exports = router;
