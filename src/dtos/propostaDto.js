const { z } = require("zod");

/**
 * @swagger
 * components:
 *   schemas:
 *     Proposta:
 *       type: object
 *       required:
 *         - titulo
 *         - valor
 *         - usuario_id
 *         - empresa_id
 *       properties:
 *         titulo:
 *           type: string
 *           description: Título da proposta.
 *         descricao:
 *           type: string
 *           description: Descrição detalhada da proposta.
 *         valor:
 *           type: number
 *           format: float
 *           description: Valor total da proposta.
 *         status:
 *           type: string
 *           enum: [rascunho, enviada, aprovada, rejeitada]
 *           description: Status atual da proposta.
 *         usuario_id:
 *           type: integer
 *           description: ID do usuário criador da proposta.
 *         empresa_id:
 *           type: integer
 *           description: ID da empresa para a qual a proposta foi criada.
 *       example:
 *         titulo: "Proposta de Serviços Contábeis"
 *         descricao: "Proposta completa para serviços de contabilidade e BPO."
 *         valor: 5000.00
 *         status: "rascunho"
 *         usuario_id: 1
 *         empresa_id: 2
 */
const propostaDto = z.object({
  titulo: z.string({ required_error: "O título é obrigatório." }),
  descricao: z.string().optional(),
  valor: z.number({ required_error: "O valor é obrigatório." }).positive(),
  status: z.enum(['rascunho', 'enviada', 'aprovada', 'rejeitada']).default('rascunho'),
  usuario_id: z.number({ required_error: "O ID do usuário criador é obrigatório." }),
  empresa_id: z.number({ required_error: "O ID da empresa é obrigatório." })
});

const updatePropostaDto = propostaDto.partial();

module.exports = { 
  propostaDto,
  updatePropostaDto
};