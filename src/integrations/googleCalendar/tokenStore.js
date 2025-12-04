const { getOAuthClient } = require("../../services/googleTokenService");

/**
 * Adaptador para o tokenStore do Calendar, que agora usa o googleTokenService
 * para obter o cliente OAuth 2.0 configurado a partir do banco de dados.
 */
class TokenStoreDB {
  /**
   * Retorna o cliente OAuth 2.0 configurado para o usuário.
   * @param {number} userId - O ID do usuário da aplicação.
   * @returns {Promise<google.auth.OAuth2 | null>} O cliente OAuth 2.0 configurado.
   */
  async getClient(userId) {
    return await getOAuthClient(userId);
  }

  /**
   * (Não implementado) A gravação é feita pelo fluxo OAuth centralizado.
   */
  async set(userId, token) {
    // A gravação agora é centralizada no googleOAuthController
    console.warn("TokenStore.set não deve ser chamado diretamente. O token é salvo no fluxo OAuth.");
  }
}

module.exports = { TokenStore: new TokenStoreDB() };
