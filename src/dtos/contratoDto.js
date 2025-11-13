// src/dtos/contratoDto.js
const z = require('zod');

exports.createContratoDto = z.object({
    proposta_id: z.number().int().positive(),
    empresa_id: z.number().int().positive(),
    valor_final: z.number(),
    data_assinatura: z.string().datetime().optional(),
    status: z.enum(['rascunho','ativo','suspenso','encerrado']).optional(),
    observacoes: z.string().optional()
});

exports.updateContratoDto = z.object({
    valor_final: z.number().optional(),
    data_assinatura: z.string().datetime().optional(),
    status: z.enum(['rascunho','ativo','suspenso','encerrado']).optional(),
    observacoes: z.string().optional()
});
