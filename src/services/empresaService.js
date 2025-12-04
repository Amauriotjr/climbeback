const Empresa = require('../models/Empresa');

class EmpresaService {
  async create(empresaData) {
    const { cnpj } = empresaData;
    const exists = await Empresa.findOne({ where: { cnpj } });
    if (exists) {
      throw new Error("Empresa já cadastrada com esse CNPJ");
    }
    return await Empresa.create(empresaData);
  }

  async getAll() {
    return await Empresa.findAll();
  }

  async getById(id) {
    const empresa = await Empresa.findByPk(id);
    if (!empresa) {
      throw new Error("Empresa não encontrada");
    }
    return empresa;
  }

  async update(id, updateData) {
    const empresa = await this.getById(id);
    await empresa.update(updateData);
    return empresa;
  }

  async delete(id) {
    const empresa = await this.getById(id);
    await empresa.destroy();
    return { message: "Empresa deletada com sucesso" };
  }
}

module.exports = EmpresaService;