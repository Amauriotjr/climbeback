// src/routes/contratosIntegrationRoutes.js
const express = require('express');
const router = express.Router();
const contratoController = require('../controllers/contratoController');

/**
 * @swagger
 * /propostas/{id}/gerar-contrato:
 *   post:
 *     tags: [Contratos]
 *     summary: Gerar contrato a partir de uma proposta aprovada
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       201: { description: Contrato gerado }
 *       400: { description: Regras não atendidas }
 */
router.post('/propostas/:id/gerar-contrato', contratoController.generateFromProposta);

/**
 * @swagger
 * /empresas/{id}/contratos:
 *   get:
 *     tags: [Contratos]
 *     summary: Listar contratos de uma empresa
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Ok }
 */
router.get('/empresas/:id/contratos', contratoController.findByEmpresa);

module.exports = router;
