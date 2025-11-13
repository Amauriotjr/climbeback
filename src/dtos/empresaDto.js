const { z } = require("zod");
const validateCNPJ = require("../utils/validateCNPJ");

/**
 * @swagger
 * components:
 *   schemas:
 *     Empresa:
 *       type: object
 *       required:
 *         - nome_fantasia
 *         - cnpj
 *       properties:
 *         nome_fantasia:
 *           type: string
 *           description: Nome fantasia da empresa.
 *         cnpj:
 *           type: string
 *           description: CNPJ da empresa (único).
 *         razao_social:
 *           type: string
 *           description: Razão social da empresa.
 *         logradouro:
 *           type: string
 *           description: Logradouro da sede da empresa.
 *         numero:
 *           type: string
 *           description: Número do endereço da sede da empresa.
 *         bairro:
 *           type: string
 *           description: Bairro da sede da empresa.
 *         cidade:
 *           type: string
 *           description: Cidade da sede da empresa.
 *         uf:
 *           type: string
 *           description: UF da sede da empresa.
 *         cep:
 *           type: string
 *           description: CEP da sede da empresa.
 *         telefone:
 *           type: string
 *           description: Telefone de contato da empresa.
 *         email:
 *           type: string
 *           format: email
 *           description: E-mail de contato da empresa.
 *       example:
 *         nome_fantasia: "Climbe Soluções"
 *         cnpj: "12.345.678/0001-90"
 *         razao_social: "Climbe Soluções LTDA"
 */
const empresaDto = z.object({
  nome_fantasia: z.string({
    required_error: "Nome fantasia é obrigatório",
  }),
  cnpj: z.string({
    required_error: "CNPJ é obrigatório",
  }).refine(validateCNPJ, {
    message: "CNPJ inválido",
  }),
  razao_social: z.string().optional(),
  logradouro: z.string().optional(),
  numero: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  uf: z.string().optional(),
  cep: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email().optional(),
});

module.exports = { empresaDto };