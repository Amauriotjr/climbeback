const express = require("express");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Representantes
 *   description: Gerenciamento de representantes de empresas
 */

const representanteController = require("../controllers/representanteController");

/**
 * @swagger
 * /representantes:
 *   post:
 *     summary: Cria um novo representante
 *     tags: [Representantes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               telefone:
 *                 type: string
 *               empresa_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Representante criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post("/", representanteController.createRepresentante);
/**
 * @swagger
 * /representantes:
 *   get:
 *     summary: Retorna a lista de todos os representantes
 *     tags: [Representantes]
 *     responses:
 *       200:
 *         description: Lista de representantes
 */
router.get("/", representanteController.getRepresentantes);
/**
 * @swagger
 * /representantes/{id}:
 *   get:
 *     summary: Retorna um representante pelo ID
 *     tags: [Representantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do representante
 *     responses:
 *       200:
 *         description: Dados do representante
 *       404:
 *         description: Representante não encontrado
 */
router.get("/:id", representanteController.getRepresentanteById);
/**
 * @swagger
 * /representantes/{id}:
 *   put:
 *     summary: Atualiza um representante pelo ID
 *     tags: [Representantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do representante
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               telefone:
 *                 type: string
 *               empresa_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Representante atualizado com sucesso
 *       404:
 *         description: Representante não encontrado
 */
router.put("/:id", representanteController.updateRepresentante);
/**
 * @swagger
 * /representantes/{id}:
 *   delete:
 *     summary: Deleta um representante pelo ID
 *     tags: [Representantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do representante
 *     responses:
 *       200:
 *         description: Representante deletado com sucesso
 *       404:
 *         description: Representante não encontrado
 */
router.delete("/:id", representanteController.deleteRepresentante);

module.exports = router;