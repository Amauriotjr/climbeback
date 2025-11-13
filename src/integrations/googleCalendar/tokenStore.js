class TokenStoreMemory {
  constructor() { this.tokens = new Map(); }
  async get(userId) { return this.tokens.get(userId) || null; }
  async set(userId, token) { this.tokens.set(userId, token); }
}
module.exports = { TokenStore: new TokenStoreMemory() };
