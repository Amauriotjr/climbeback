const { z } = require("zod");

const createContratoDto = z.object({
  proposta_id: z.number().int().optional(),
  empresa_id: z.number().int({ required_error: "O ID da empresa é obrigatório" }),
  documento_id: z.number().int().optional(),
  valor_final: z.number({ required_error: "O valor final é obrigatório" }),
  data_assinatura: z.string().datetime().optional().or(z.date().optional()),
  status: z.enum(['rascunho', 'ativo', 'suspenso', 'encerrado']).optional(),
  observacoes: z.string().optional()
});

const updateContratoDto = createContratoDto.partial();

module.exports = { createContratoDto, updateContratoDto };