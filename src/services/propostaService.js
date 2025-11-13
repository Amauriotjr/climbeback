const Proposta = require('../models/Proposta');

class PropostaService {
  async create(propostaData) {
    return await Proposta.create(propostaData);
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
    await proposta.update(updateData);
    return proposta;
  }
  async delete(id) {
    const proposta = await this.getById(id);
    await proposta.destroy();
    return { message: "Proposta deletada com sucesso" };
  }
}

module.exports = PropostaService;