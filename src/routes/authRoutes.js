const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const googleOAuthController = require("../controllers/googleOAuthController");
const validate = require('../middlewares/validate');
const { userDto } = require('../dtos/userDto');
/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: Endpoints de autenticação
 */

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Faz login (Google ou email/senha) e retorna JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             oneOf:
 *               - properties:
 *                   googleToken:
 *                     type: string
 *               - properties:
 *                   email:
 *                     type: string
 *                   senha:
 *                     type: string
 *     responses:
 *       200:
 *         description: Token retornado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Requisição inválida
 *       401:
 *         description: Credenciais inválidas
 *       403:
 *         description: Usuário não aprovado / criado e pendente aprovação
 */
router.post("/login", authController.login);

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Registra um novo usuário (pendente aprovação)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome_completo, cpf, email, senha]
 *             properties:
 *               nome_completo:
 *                 type: string
 *               cpf:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado (sem senha no retorno)
 *       400:
 *         description: Usuário já cadastrado / dados inválidos
 */
router.post("/register", validate(userDto), authController.register);

/**
 * @openapi
 * /auth/google:
 *   get:
 *     tags: [Integrações do Google]
 *     summary: Inicia o fluxo OAuth 2.0 do Google (Login + Autorização)
 *     responses:
 *       302:
 *         description: Redireciona para a tela de consentimento do Google
 */
router.get("/google", googleOAuthController.authStart);

/**
 * @openapi
 * /auth/google/callback:
 *   get:
 *     tags: [Integrações do Google]
 *     summary: Callback do OAuth 2.0 do Google
 *     responses:
 *       200:
 *         description: Login e autorização concluídos. Retorna o JWT da aplicação.
 *       403:
 *         description: Usuário não aprovado ou criado e pendente de aprovação.
 *       500:
 *         description: Erro no callback.
 */
router.get("/google/callback", googleOAuthController.authCallback);

/**
 * @openapi
 * /auth/set-password:
 *   post:
 *     tags: [Auth]
 *     summary: Define senha para usuário criado via Google
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, senha]
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Senha definida com sucesso
 *       400:
 *         description: Dados inválidos ou usuário já com senha
 *       403:
 *         description: Usuário não aprovado
 *       404:
 *         description: Usuário não encontrado
 */
router.post("/set-password", authController.setPassword);

/**
 * @openapi
 * /auth/approve/{id}:
 *   get:
 *     tags: [Auth]
 *     summary: Aprova usuário pendente (administrador)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário aprovado
 *       404:
 *         description: Usuário não encontrado
 */
router.get("/approve/:id", authController.approveUser);

/**
 * @openapi
 * /auth/reject/{id}:
 *   get:
 *     tags: [Auth]
 *     summary: Rejeita usuário pendente (administrador)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário rejeitado
 *       404:
 *         description: Usuário não encontrado
 */
router.get("/reject/:id", authController.rejectUser);

module.exports = router;