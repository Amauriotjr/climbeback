const Servico = require('../models/Servico');

class ServicoService {
  async create(data) {
    return await Servico.create(data);
  }

  async getAll() {
    return await Servico.findAll();
  }

  async getById(id) {
    const servico = await Servico.findByPk(id);
    if (!servico) {
      throw new Error("Serviço não encontrado");
    }
    return servico;
  }

  async update(id, updateData) {
    const servico = await this.getById(id);
    await servico.update(updateData);
    return servico;
  }

  async delete(id) {
    const servico = await this.getById(id);
    await servico.destroy();
    return { message: "Serviço deletado com sucesso" };
  }

  async getByTipo(tipo) {
    return await Servico.findAll({ where: { tipo_servico: tipo } });
  }
}

module.exports = ServicoService;
