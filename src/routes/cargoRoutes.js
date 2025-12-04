const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cargos
 *   description: Gerenciamento de cargos e permissões
 */

const cargoController = require('../controllers/cargoController');
const validate = require('../middlewares/validate');
const { cargoDto } = require('../dtos/cargoDto');

/**
 * @swagger
 * /cargos:
 *   post:
 *     summary: Cria um novo cargo
 *     tags: [Cargos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cargo'
 *     responses:
 *       201:
 *         description: Cargo criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/', validate(cargoDto), cargoController.create);
/**
 * @swagger
 * /cargos:
 *   get:
 *     summary: Retorna a lista de todos os cargos
 *     tags: [Cargos]
 *     responses:
 *       200:
 *         description: Lista de cargos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cargo'
 */
router.get('/', cargoController.getAll);

module.exports = router;