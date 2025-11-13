// src/routes/contratoRoutes.js
const express = require('express');
const router = express.Router();

const contratoController = require('../controllers/contratoController');
let validate;
try { validate = require('../middlewares/validate'); } catch (e) { validate = (schema) => (req,res,next)=>next(); }
let createContratoDto, updateContratoDto;
try { ({ createContratoDto, updateContratoDto } = require('../dtos/contratoDto')); } catch (e) {
  createContratoDto = { parse: ()=>({}) };
  updateContratoDto = { parse: ()=>({}) };
}

/**
 * @swagger
 * tags:
 *   name: Contratos
 *   description: CRUD de Contratos
 */

/**
 * @swagger
 * /contratos:
 *   get:
 *     tags: [Contratos]
 *     summary: Listar contratos
 *     responses:
 *       200:
 *         description: Lista de contratos
 */
router.get('/', contratoController.findAll);

/**
 * @swagger
 * /contratos/{id}:
 *   get:
 *     tags: [Contratos]
 *     summary: Buscar contrato por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Ok }
 *       404: { description: Não encontrado }
 */
router.get('/:id', contratoController.findById);

/**
 * @swagger
 * /contratos:
 *   post:
 *     tags: [Contratos]
 *     summary: Criar contrato
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               proposta_id: { type: integer }
 *               empresa_id:   { type: integer }
 *               valor_final:  { type: number }
 *               data_assinatura: { type: string, format: date-time }
 *               status: { type: string, enum: [rascunho,ativo,suspenso,encerrado] }
 *               observacoes: { type: string }
 *     responses:
 *       201: { description: Criado }
 *       400: { description: Erro de validação }
 */
router.post('/', validate(createContratoDto), contratoController.create);

/**
 * @swagger
 * /contratos/{id}:
 *   delete:
 *     tags: [Contratos]
 *     summary: Remover contrato
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Removido }
 *       404: { description: Não encontrado }
 */
router.delete('/:id', contratoController.remove);

/**
 * @swagger
 * /contratos/{id}:
 *   put:
 *     tags: [Contratos]
 *     summary: Atualizar contrato
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               valor_final: { type: number }
 *               data_assinatura: { type: string, format: date-time }
 *               status: { type: string, enum: [rascunho,ativo,suspenso,encerrado] }
 *               observacoes: { type: string }
 *     responses:
 *       200: { description: Atualizado }
 *       400: { description: Erro }
 */
router.put('/:id', validate(updateContratoDto), contratoController.update);

module.exports = router;
