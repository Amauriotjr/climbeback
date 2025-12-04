const { z } = require("zod");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - nome_completo
 *         - cargo_id
 *         - cpf
 *         - email
 *         - contato
 *         - senha
 *       properties:
 *         nome_completo:
 *           type: string
 *           description: Nome completo do usuário.
 *         cargo_id:
 *           type: integer
 *           description: ID do cargo do usuário.
 *         cpf:
 *           type: string
 *           description: CPF do usuário.
 *         email:
 *           type: string
 *           format: email
 *           description: Endereço de e-mail do usuário (único).
 *         contato:
 *           type: string
 *           description: Número de contato do usuário.
 *         senha:
 *           type: string
 *           format: password
 *           description: Senha do usuário.
 *       example:
 *         nome_completo: "João da Silva"
 *         cargo_id: 1
 *         cpf: "123.456.789-00"
 *         email: "joao.silva@example.com"
 *         contato: "11987654321"
 *         senha: "senhaSegura123"
 */
const userDto = z.object({
  nome_completo: z.string({
    required_error: "O nome completo é obrigatório.",
    invalid_type_error: "O nome completo deve ser um texto.",
  }).min(2, { message: "O nome deve ter no mínimo 2 caracteres." }),

  cargo_id: z.number({
    required_error: "O ID do cargo é obrigatório.",
    invalid_type_error: "O ID do cargo deve ser um número.",
  }),

  cpf: z.string({ required_error: "O CPF é obrigatório." }).min(11).max(14),
  email: z.string({ required_error: "O e-mail é obrigatório." }).email(),
  contato: z.string({ required_error: "O contato é obrigatório." }).min(10).max(15),
  senha: z.string({ required_error: "A senha é obrigatória." }).min(6),
});

module.exports = { userDto };