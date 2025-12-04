const { z } = require("zod");

/**
 * @swagger
 * components:
 *   schemas:
 *     Servico:
 *       type: object
 *       required:
 *         - nome_servico
 *         - tipo_servico
 *         - preco_base
 *       properties:
 *         nome_servico:
 *           type: string
 *           description: Nome do serviço.
 *         tipo_servico:
 *           type: string
 *           enum: [Contabilidade, Valuation, BPO, CFO, M&A]
 *           description: Tipo de serviço.
 *         descricao:
 *           type: string
 *           description: Descrição detalhada do serviço.
 *         preco_base:
 *           type: number
 *           format: float
 *           description: Preço base do serviço.
 *         duracao_estimada:
 *           type: integer
 *           description: Duração estimada em horas do serviço.
 *         situacao:
 *           type: string
 *           enum: [Ativo, Inativo]
 *           description: Situação do serviço.
 *       example:
 *         nome_servico: "Assessoria Contábil Mensal"
 *         tipo_servico: "Contabilidade"
 *         descricao: "Serviço completo de contabilidade mensal."
 *         preco_base: 1500.00
 *         duracao_estimada: 40
 *         situacao: "Ativo"
 */
const servicoDto = z.object({
  nome_servico: z.string({ required_error: "nome_servico é obrigatório" }).min(1),
  tipo_servico: z.enum(["Contabilidade", "Valuation", "BPO", "CFO", "M&A"], {
    required_error: "tipo_servico é obrigatório"
  }),
  descricao: z.string().optional(),
  preco_base: z.number({ required_error: "preco_base é obrigatório" }),
  duracao_estimada: z.number().int().positive().optional(),
  situacao: z.enum(["Ativo", "Inativo"]).optional()
});

module.exports = { servicoDto };
