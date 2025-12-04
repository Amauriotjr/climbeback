const Proposta = require('../models/Proposta');
const { notificarGerentes } = require('./notificacaoService');

class PropostaService {
  async create(propostaData) {
    const proposta = await Proposta.create(propostaData);
    try {
      const msg = `Nova proposta criada #${proposta.id_proposta || proposta.id}.`;
      await notificarGerentes(msg);
    } catch {}
    return proposta;
  }
  async getAll() {
    return await Proposta.findAll();
  }
  async getById(id) {
    const proposta = await Proposta.findByPk(id);
    if (!proposta) {
      throw new Error("Proposta não encontrada");
    }
    return proposta;
  }
  async update(id, updateData) {
    const proposta = await this.getById(id);
    const statusAntes = String(proposta.status || '').toLowerCase();
    await proposta.update(updateData);
    const statusDepois = String(proposta.status || '').toLowerCase();
    if (updateData.status && statusAntes !== 'aprovada' && statusDepois === 'aprovada') {
      const msg = `Proposta #${proposta.id_proposta || id} foi aprovada.`;
      try { await notificarGerentes(msg); } catch {}
    }
    return proposta;
  }
  async delete(id) {
    const proposta = await this.getById(id);
    await proposta.destroy();
    return { message: "Proposta deletada com sucesso" };
  }
}

module.exports = PropostaService;