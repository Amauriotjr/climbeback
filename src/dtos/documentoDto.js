const { z } = require('zod');

/**
 * @swagger
 * components:
 *   schemas:
 *     Documento:
 *       type: object
 *       required:
 *         - nome
 *         - tipo
 *         - url
 *         - empresa_id
 *       properties:
 *         nome:
 *           type: string
 *           description: Nome do documento.
 *         tipo:
 *           type: string
 *           enum: [planilha, relatorio, pdf, imagem, outro]
 *           description: Tipo do documento.
 *         url:
 *           type: string
 *           format: url
 *           description: URL de acesso ao documento.
 *         empresa_id:
 *           type: integer
 *           description: ID da empresa associada ao documento.
 *         contrato_id:
 *           type: integer
 *           description: ID do contrato associado (opcional).
 *         cargo_id:
 *           type: integer
 *           description: ID do cargo associado (opcional).
 *         tarefa_id:
 *           type: integer
 *           description: ID da tarefa associada (opcional).
 *         is_bloqueado:
 *           type: boolean
 *           description: Indica se o documento está bloqueado (apenas para PUT).
 *       example:
 *         nome: "Relatório Mensal"
 *         tipo: "relatorio"
 *         url: "https://storage.com/relatorio.pdf"
 *         empresa_id: 1
 *         is_bloqueado: false
 */
const createDocumentoDto = z.object({
  nome: z.string({
    required_error: 'O nome do documento é obrigatório.',
    invalid_type_error: 'O nome do documento deve ser um texto.',
  }).min(3, { message: 'O nome deve ter no mínimo 3 caracteres.' }),

  tipo: z.enum(['planilha', 'relatorio', 'pdf', 'imagem', 'outro'], {
    required_error: 'O tipo do documento é obrigatório.',
    invalid_type_error: 'O tipo do documento é inválido.',
  }),

  url: z.string({
    required_error: 'A URL do documento é obrigatória.',
  }).url({ message: 'A URL fornecida é inválida.' }),

  empresa_id: z.number({
    required_error: 'O ID da empresa é obrigatório.',
    invalid_type_error: 'O ID da empresa deve ser um número.',
  }),

  contrato_id: z.number().optional(),
  cargo_id: z.number().optional(),
  tarefa_id: z.number().optional(),
});

const updateDocumentoDto = z.object({
  nome: z.string().min(3).optional(),
  tipo: z.enum(['planilha', 'relatorio', 'pdf', 'imagem', 'outro']).optional(),
  url: z.string().url().optional(),
  is_bloqueado: z.boolean().optional(),
});

module.exports = {
  createDocumentoDto,
  updateDocumentoDto,
};