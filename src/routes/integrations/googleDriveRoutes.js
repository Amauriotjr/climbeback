const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/googleDriveController');

/**
 * @swagger
 * tags:
 *   - name: Integrações
 *     description: Integrações com serviços externos
 */

/**
 * @swagger
 * /integrations/google-drive/auth/url:
 *   get:
 *     summary: Retorna a URL de login do Google Drive (OAuth)
 *     tags: [Integrações]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema: { type: integer }
 *         required: true
 *         description: ID do usuário da sua aplicação que autorizará o Drive
 *     responses:
 *       200:
 *         description: URL gerada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 */
router.get('/auth/url', ctrl.authUrl);

/**
 * @swagger
 * /integrations/google-drive/auth:
 *   get:
 *     summary: Inicia o OAuth do Google Drive (redirect)
 *     tags: [Integrações]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema: { type: integer }
 *         required: true
 *     responses:
 *       302: { description: Redireciona para o Google }
 */
router.get('/auth', ctrl.authStart);

/**
 * @swagger
 * /integrations/google-drive/auth/callback:
 *   get:
 *     summary: Callback do OAuth do Google Drive
 *     tags: [Integrações]
 *     responses:
 *       200: { description: Conectado com sucesso }
 */
router.get('/auth/callback', ctrl.authCallback);

module.exports = router;
