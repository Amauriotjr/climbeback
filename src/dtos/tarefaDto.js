const { z } = require("zod");

/**
 * @swagger
 * components:
 *   schemas:
 *     Tarefa:
 *       type: object
 *       required:
 *         - titulo
 *         - responsavel_id
 *       properties:
 *         titulo:
 *           type: string
 *           description: Título da tarefa.
 *         descricao:
 *           type: string
 *           description: Descrição detalhada da tarefa.
 *         tipo:
 *           type: string
 *           enum: [atividade, reuniao]
 *           description: Tipo de tarefa.
 *         status:
 *           type: string
 *           enum: [a_fazer, em_andamento, concluida, agendada, realizada, cancelada]
 *           description: Status atual da tarefa.
 *         data_inicio:
 *           type: string
 *           format: date-time
 *           description: Data e hora de início da tarefa (opcional).
 *         data_fim:
 *           type: string
 *           format: date-time
 *           description: Data e hora de fim da tarefa (opcional).
 *         responsavel_id:
 *           type: integer
 *           description: ID do usuário responsável pela tarefa.
 *         empresa_id:
 *           type: integer
 *           description: ID da empresa associada (opcional).
 *         contrato_id:
 *           type: integer
 *           description: ID do contrato associado (opcional).
 *         proposta_id:
 *           type: integer
 *           description: ID da proposta associada (opcional).
 *       example:
 *         titulo: "Reunião de Kickoff"
 *         descricao: "Reunião inicial com o novo cliente X."
 *         tipo: "reuniao"
 *         status: "agendada"
 *         responsavel_id: 1
 */
const createTarefaDto = z.object({
  titulo: z.string({ required_error: "O título é obrigatório." }).min(3),
  descricao: z.string().optional(),
  tipo: z.enum(['atividade', 'reuniao']).default('atividade'),
  status: z.enum(['a_fazer', 'em_andamento', 'concluida', 'agendada', 'realizada', 'cancelada']).default('a_fazer'),
  data_inicio: z.string().datetime().optional(),
  data_fim: z.string().datetime().optional(),
  responsavel_id: z.number({ required_error: "O ID do responsável é obrigatório." }),
  empresa_id: z.number().optional(),
  contrato_id: z.number().optional(),
  proposta_id: z.number().optional(),
});

const updateTarefaDto = createTarefaDto.partial(); // .partial() torna todos os campos opcionais

module.exports = { 
  createTarefaDto,
  updateTarefaDto,
 };