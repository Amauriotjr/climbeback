const express = require("express");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Empresas
 *   description: Gerenciamento de empresas
 */

const empresaController = require("../controllers/empresaController");
const validate = require('../middlewares/validate');
const { empresaDto } = require('../dtos/empresaDto');

/**
 * @swagger
 * /empresas:
 *   post:
 *     summary: Cria uma nova empresa
 *     tags: [Empresas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Empresa'
 *     responses:
 *       201:
 *         description: Empresa criada com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post("/", validate(empresaDto), empresaController.create);
/**
 * @swagger
 * /empresas:
 *   get:
 *     summary: Retorna a lista de todas as empresas
 *     tags: [Empresas]
 *     responses:
 *       200:
 *         description: Lista de empresas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Empresa'
 */
router.get("/", empresaController.getAll);
/**
 * @swagger
 * /empresas/{id}:
 *   get:
 *     summary: Retorna uma empresa pelo ID
 *     tags: [Empresas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da empresa
 *     responses:
 *       200:
 *         description: Dados da empresa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Empresa'
 *       404:
 *         description: Empresa não encontrada
 */
router.get("/:id", empresaController.getById);
/**
 * @swagger
 * /empresas/{id}:
 *   put:
 *     summary: Atualiza uma empresa pelo ID
 *     tags: [Empresas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da empresa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Empresa'
 *     responses:
 *       200:
 *         description: Empresa atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Empresa não encontrada
 */
router.put("/:id", validate(empresaDto.partial()), empresaController.update);
/**
 * @swagger
 * /empresas/{id}:
 *   delete:
 *     summary: Deleta uma empresa pelo ID
 *     tags: [Empresas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da empresa
 *     responses:
 *       200:
 *         description: Empresa deletada com sucesso
 *       404:
 *         description: Empresa não encontrada
 */
router.delete("/:id", empresaController.delete);

module.exports = router;