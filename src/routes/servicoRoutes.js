const express = require("express");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Serviços
 *   description: Gerenciamento de serviços
 */

const servicoController = require("../controllers/servicoController");
const validate = require('../middlewares/validate');
const { servicoDto } = require('../dtos/servicoDto');

/**
 * @swagger
 * /servicos:
 *   post:
 *     summary: Cria um novo serviço
 *     tags: [Serviços]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Servico'
 *     responses:
 *       201:
 *         description: Serviço criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post("/", validate(servicoDto), servicoController.create);
/**
 * @swagger
 * /servicos:
 *   get:
 *     summary: Retorna a lista de todos os serviços
 *     tags: [Serviços]
 *     responses:
 *       200:
 *         description: Lista de serviços
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Servico'
 */
router.get("/", servicoController.getAll);
/**
 * @swagger
 * /servicos/{id}:
 *   get:
 *     summary: Retorna um serviço pelo ID
 *     tags: [Serviços]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do serviço
 *     responses:
 *       200:
 *         description: Dados do serviço
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Servico'
 *       404:
 *         description: Serviço não encontrado
 */
router.get("/:id", servicoController.getById);
/**
 * @swagger
 * /servicos/{id}:
 *   put:
 *     summary: Atualiza um serviço pelo ID
 *     tags: [Serviços]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do serviço
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Servico'
 *     responses:
 *       200:
 *         description: Serviço atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Serviço não encontrado
 */
router.put("/:id", validate(servicoDto.partial()), servicoController.update);
/**
 * @swagger
 * /servicos/{id}:
 *   delete:
 *     summary: Deleta um serviço pelo ID
 *     tags: [Serviços]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do serviço
 *     responses:
 *       200:
 *         description: Serviço deletado com sucesso
 *       404:
 *         description: Serviço não encontrado
 */
router.delete("/:id", servicoController.delete);
/**
 * @swagger
 * /servicos/tipo/{tipo}:
 *   get:
 *     summary: Retorna serviços por tipo
 *     tags: [Serviços]
 *     parameters:
 *       - in: path
 *         name: tipo
 *         schema:
 *           type: string
 *         required: true
 *         description: Tipo do serviço
 *     responses:
 *       200:
 *         description: Lista de serviços por tipo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Servico'
 */
router.get("/tipo/:tipo", servicoController.getByTipo);

module.exports = router;
