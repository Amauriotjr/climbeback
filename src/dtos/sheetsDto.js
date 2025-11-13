const { z } = require('zod');

/**
 * @swagger
 * components:
 *   schemas:
 *     SheetsCopyRequest:
 *       type: object
 *       required: [templateFileId, nome]
 *       properties:
 *         templateFileId: { type: string, description: "ID do arquivo template no Drive" }
 *         contratoId: { type: integer }
 *         nome: { type: string }
 *     SheetsPermissionRequest:
 *       type: object
 *       required: [documentoId]
 *       properties:
 *         documentoId: { type: integer }
 *         viewers: { type: array, items: { type: string, format: email } }
 *         commenters: { type: array, items: { type: string, format: email } }
 *         editors: { type: array, items: { type: string, format: email } }
 */

const copyDto = z.object({
  templateFileId: z.string(),
  contratoId: z.number().int().optional().nullable(),
  nome: z.string().min(3),
  userId: z.number().int().optional().nullable(),
  empresaId: z.number().int().optional().nullable()
});

const permissionsDto = z.object({
  documentoId: z.number().int(),
  viewers: z.array(z.string().email()).optional().default([]),
  commenters: z.array(z.string().email()).optional().default([]),
  editors: z.array(z.string().email()).optional().default([])
});

module.exports = { copyDto, permissionsDto };