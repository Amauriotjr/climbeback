const { z } = require('zod');

const comentarioCreateDto = z.object({
  tarefa_id: z.number().int().positive(),
  autor_id: z.number().int().positive(),
  texto: z.string().min(1).max(5000)
});

module.exports = { comentarioCreateDto };
