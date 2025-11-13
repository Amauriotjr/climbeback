const { z } = require("zod");

/**
 * @swagger
 * components:
 *   schemas:
 *     Cargo:
 *       type: object
 *       required:
 *         - nome_cargo
 *       properties:
 *         nome_cargo:
 *           type: string
 *           description: Nome do cargo.
 *       example:
 *         nome_cargo: "Analista Financeiro"
 */
const cargoDto = z.object({
  nome_cargo: z.string({
    required_error: "O nome do cargo é obrigatório.",
  }).min(3, { message: "O nome do cargo deve ter no mínimo 3 caracteres." }),
});

module.exports = { cargoDto };