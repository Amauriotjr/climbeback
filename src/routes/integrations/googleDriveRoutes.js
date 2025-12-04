const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Integrações do Google
 *     description: Integrações com serviços Google (OAuth unificado, Calendar, Drive, Sheets).
 */

// As rotas de autenticação do Google (login + permissões de Calendar/Drive/Sheets)
// agora estão centralizadas em:
//   GET /auth/google
//   GET /auth/google/callback
//
// Este arquivo permanece apenas para manter a estrutura de /routes/integrations,
// mas não expõe rotas próprias.

module.exports = router;
