const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Documentos
 *   description: Gerenciamento de documentos (inclui integração com Google Sheets)
 *
 * components:
 *   schemas:
 *     Documento:
 *       type: object
 *       properties:
 *         id_documento: { type: integer }
 *         nome: { type: string }
 *         tipo: { type: string, enum: [planilha, relatorio, pdf, imagem, outro] }
 *         url: { type: string }
 *         contrato_id: { type: integer, nullable: true }
 *         google_file_id: { type: string, nullable: true }
 *         google_spreadsheet_id: { type: string, nullable: true }
 *     CreateDocumentoRequest:
 *       type: object
 *       required: [nome, tipo, url, empresa_id]
 *       properties:
 *         nome: { type: string }
 *         tipo: { type: string, enum: [planilha, relatorio, pdf, imagem, outro] }
 *         url: { type: string }
 *         empresa_id: { type: integer }
 *         contrato_id: { type: integer, nullable: true }
 *     UpdateDocumentoRequest:
 *       type: object
 *       properties:
 *         nome: { type: string }
 *         tipo: { type: string, enum: [planilha, relatorio, pdf, imagem, outro] }
 *         url: { type: string }
 *         contrato_id: { type: integer, nullable: true }
 *     SheetsCopyRequest:
 *       type: object
 *       required: [templateFileId, contratoId, nome]
 *       properties:
 *         templateFileId:
 *           type: string
 *           description: ID do arquivo template do Google Drive (Sheets)
 *         contratoId:
 *           type: integer
 *           description: ID do contrato que receberá a cópia
 *         nome:
 *           type: string
 *           description: Nome do novo arquivo/copiar
 *     SheetsPermissionRequest:
 *       type: object
 *       required: [documentoId]
 *       properties:
 *         documentoId: { type: integer }
 *         viewers:
 *           type: array
 *           items: { type: string, format: email }
 *         commenters:
 *           type: array
 *           items: { type: string, format: email }
 *         editors:
 *           type: array
 *           items: { type: string, format: email }
 */

const documentoController = require('../controllers/documentoController');
const validate = require('../middlewares/validate');
const { createDocumentoDto, updateDocumentoDto } = require('../dtos/documentoDto');
const { copyDto: sheetsCopyDto, permissionsDto: sheetsPermDto } = require('../dtos/sheetsDto');


/**
 * @swagger
 * /documentos:
 *   post:
 *     summary: Cria um novo documento
 *     tags: [Documentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDocumentoRequest'
 *     responses:
 *       201: { description: Documento criado }
 */
router.post('/', validate(createDocumentoDto), documentoController.create);

/**
 * @swagger
 * /documentos:
 *   get:
 *     summary: Retorna a lista de todos os documentos
 *     tags: [Documentos]
 *     responses:
 *       200:
 *         description: Lista de documentos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Documento' }
 */
router.get('/', documentoController.getAll);

/**
 * @swagger
 * /documentos/{id}:
 *   get:
 *     summary: Retorna um documento pelo ID
 *     tags: [Documentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Dados do documento
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Documento'
 *       404: { description: Documento não encontrado }
 */
router.get('/:id', documentoController.getById);

/**
 * @swagger
 * /documentos/{id}:
 *   put:
 *     summary: Atualiza um documento
 *     tags: [Documentos]
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
 *             $ref: '#/components/schemas/UpdateDocumentoRequest'
 *     responses:
 *       200: { description: Documento atualizado }
 */
router.put('/:id', validate(updateDocumentoDto), documentoController.update);

/**
 * @swagger
 * /documentos/{id}:
 *   delete:
 *     summary: Deleta um documento
 *     tags: [Documentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Documento deletado }
 */
router.delete('/:id', documentoController.delete);

/**
 * @swagger
 * /documentos/sheets/copy:
 *   post:
 *     summary: Cria cópia de planilha (Google Sheets)
 *     tags: [Documentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [templateFileId, nome]
 *             properties:
 *               templateFileId:
 *                 type: string
 *                 description: ID do template no Drive (entre /d/ e /edit)
 *               nome:
 *                 type: string
 *                 description: Nome da cópia
 *               userId:
 *                 type: integer
 *                 nullable: true
 *                 description: Se informado, usa o OAuth do usuário (cota do usuário)
 *               contratoId:
 *                 type: integer
 *                 nullable: true
 *               empresaId:
 *                 type: integer
 *                 nullable: true
 *     responses:
 *       201: { description: Criado }
 *       400: { description: Erro de validação/interno }
 */
router.post('/sheets/copy', validate(sheetsCopyDto), documentoController.copySheet);

/**
 * @swagger
 * /documentos/sheets/permissions:
 *   post:
 *     summary: Define permissões (view/comment/edit) no arquivo do Drive
 *     tags: [Documentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SheetsPermissionRequest'
 *     responses:
 *       200: { description: OK }
 *       400: { description: Erro de validação/interno }
 */
router.post('/sheets/permissions', validate(sheetsPermDto), documentoController.setSheetPermissions);

module.exports = router;




