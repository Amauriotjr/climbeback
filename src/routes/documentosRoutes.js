const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }
});

const documentoController = require('../controllers/documentoController');
const validate = require('../middlewares/validate');
const { createDocumentoDto, updateDocumentoDto } = require('../dtos/documentoDto');
const { copyDto: sheetsCopyDto, permissionsDto: sheetsPermDto } = require('../dtos/sheetsDto');

/**
 * @swagger
 * tags:
 *   - name: Documentos
 *     description: Gerenciamento de documentos (inclui integração com Google Sheets)
 * components:
 *   schemas:
 *     Documento:
 *       type: object
 *       properties:
 *         id_documento:
 *           type: integer
 *         nome:
 *           type: string
 *         tipo:
 *           type: string
 *           enum: [planilha, relatorio, pdf, imagem, outro]
 *         url:
 *           type: string
 *         contrato_id:
 *           type: integer
 *           nullable: true
 *         google_file_id:
 *           type: string
 *           nullable: true
 *         google_spreadsheet_id:
 *           type: string
 *           nullable: true
 *     CreateDocumentoRequest:
 *       type: object
 *       required:
 *         - nome
 *         - tipo
 *         - url
 *         - empresa_id
 *       properties:
 *         nome:
 *           type: string
 *         tipo:
 *           type: string
 *           enum: [planilha, relatorio, pdf, imagem, outro]
 *         url:
 *           type: string
 *         empresa_id:
 *           type: integer
 *         contrato_id:
 *           type: integer
 *           nullable: true
 *     UpdateDocumentoRequest:
 *       type: object
 *       properties:
 *         nome:
 *           type: string
 *         tipo:
 *           type: string
 *           enum: [planilha, relatorio, pdf, imagem, outro]
 *         url:
 *           type: string
 *         contrato_id:
 *           type: integer
 *           nullable: true
 *     SheetsCopyRequest:
 *       type: object
 *       required:
 *         - templateFileId
 *         - contratoId
 *         - nome
 *       properties:
 *         templateFileId:
 *           type: string
 *           description: ID do arquivo template do Google Drive (Sheets)
 *         contratoId:
 *           type: integer
 *         nome:
 *           type: string
 *         userId:
 *           type: integer
 *           nullable: true
 *         empresaId:
 *           type: integer
 *           nullable: true
 *     SheetsPermissionRequest:
 *       type: object
 *       required:
 *         - documentoId
 *       properties:
 *         documentoId:
 *           type: integer
 *         viewers:
 *           type: array
 *           items:
 *             type: string
 *             format: email
 *         commenters:
 *           type: array
 *           items:
 *             type: string
 *             format: email
 *         editors:
 *           type: array
 *           items:
 *             type: string
 *             format: email
 */

/**
 * @swagger
 * /documentos/upload:
 *   post:
 *     tags:
 *       - Documentos
 *     summary: Faz upload de um arquivo físico
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               arquivo:
 *                 type: string
 *                 format: binary
 *               nome:
 *                 type: string
 *               contratoId:
 *                 type: integer
 *               tarefaId:
 *                 type: integer
 *               empresaId:
 *                 type: integer
 *     responses:
 *       '201':
 *         description: Arquivo salvo
 *       '400':
 *         description: Erro no envio
 */
router.post('/upload', upload.single('arquivo'), documentoController.upload);

/**
 * @swagger
 * /documentos/download/{id}:
 *   get:
 *     tags:
 *       - Documentos
 *     summary: Baixa o arquivo físico
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Arquivo
 *       '404':
 *         description: Não encontrado
 */
router.get('/download/:id', documentoController.download);

/**
 * @swagger
 * /documentos:
 *   post:
 *     tags:
 *       - Documentos
 *     summary: Cria metadados de documento (JSON)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDocumentoRequest'
 *     responses:
 *       '201':
 *         description: Criado
 */
router.post('/', validate(createDocumentoDto), documentoController.create);

/**
 * @swagger
 * /documentos:
 *   get:
 *     tags:
 *       - Documentos
 *     summary: Lista todos os documentos
 *     responses:
 *       '200':
 *         description: Lista de documentos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Documento'
 */
router.get('/', documentoController.getAll);

/**
 * @swagger
 * /documentos/{id}:
 *   get:
 *     tags:
 *       - Documentos
 *     summary: Busca documento por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Documento'
 *       '404':
 *         description: Não encontrado
 */
router.get('/:id', documentoController.getById);

/**
 * @swagger
 * /documentos/{id}:
 *   put:
 *     tags:
 *       - Documentos
 *     summary: Atualiza documento
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateDocumentoRequest'
 *     responses:
 *       '200':
 *         description: Atualizado
 */
router.put('/:id', validate(updateDocumentoDto), documentoController.update);

/**
 * @swagger
 * /documentos/{id}:
 *   delete:
 *     tags:
 *       - Documentos
 *     summary: Deleta documento
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Deletado
 */
router.delete('/:id', documentoController.delete);

/**
 * @swagger
 * /documentos/sheets/copy:
 *   post:
 *     tags:
 *       - Documentos
 *     summary: Copia planilha Google Sheets
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SheetsCopyRequest'
 *     responses:
 *       '201':
 *         description: Criado
 */
router.post('/sheets/copy', validate(sheetsCopyDto), documentoController.copySheet);

/**
 * @swagger
 * /documentos/sheets/permissions:
 *   post:
 *     tags:
 *       - Documentos
 *     summary: Define permissões no Drive
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SheetsPermissionRequest'
 *     responses:
 *       '200':
 *         description: OK
 */
router.post('/sheets/permissions', validate(sheetsPermDto), documentoController.setSheetPermissions);

module.exports = router;