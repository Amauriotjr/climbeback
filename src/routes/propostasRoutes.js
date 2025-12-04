const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Propostas
 *   description: Gerenciamento de propostas
 */

const propostaController = require('../controllers/propostaController');
const validate = require('../middlewares/validate');
const { propostaDto, updatePropostaDto } = require('../dtos/propostaDto');

/**
 * @swagger
 * /propostas:
 *   post:
 *     summary: Cria uma nova proposta
 *     tags: [Propostas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Proposta'
 *     responses:
 *       201:
 *         description: Proposta criada com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/', validate(propostaDto), propostaController.create);
/**
 * @swagger
 * /propostas:
 *   get:
 *     summary: Retorna a lista de todas as propostas
 *     tags: [Propostas]
 *     responses:
 *       200:
 *         description: Lista de propostas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Proposta'
 */
router.get('/', propostaController.getAll);
/**
 * @swagger
 * /propostas/{id}:
 *   get:
 *     summary: Retorna uma proposta pelo ID
 *     tags: [Propostas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da proposta
 *     responses:
 *       200:
 *         description: Dados da proposta
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Proposta'
 *       404:
 *         description: Proposta não encontrada
 */
router.get('/:id', propostaController.getById);
/**
 * @swagger
 * /propostas/{id}:
 *   put:
 *     summary: Atualiza uma proposta pelo ID
 *     tags: [Propostas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da proposta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Proposta'
 *     responses:
 *       200:
 *         description: Proposta atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Proposta não encontrada
 */
router.put('/:id', validate(updatePropostaDto), propostaController.update);
/**
 * @swagger
 * /propostas/{id}:
 *   delete:
 *     summary: Deleta uma proposta pelo ID
 *     tags: [Propostas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da proposta
 *     responses:
 *       200:
 *         description: Proposta deletada com sucesso
 *       404:
 *         description: Proposta não encontrada
 */
router.delete('/:id', propostaController.delete);

module.exports = router;