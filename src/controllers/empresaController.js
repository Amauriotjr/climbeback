const EmpresaService = require('../services/empresaService');
const empresaService = new EmpresaService();

const empresaController = {
  async create(req, res) {
    try {
      const novaEmpresa = await empresaService.create(req.body);
      return res.status(201).json(novaEmpresa);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async getAll(req, res) {
    try {
      const empresas = await empresaService.getAll();
      return res.status(200).json(empresas);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  
  async getById(req, res) {
    try {
      const empresa = await empresaService.getById(req.params.id);
      return res.status(200).json(empresa);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const empresaAtualizada = await empresaService.update(req.params.id, req.body);
      return res.status(200).json(empresaAtualizada);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const result = await empresaService.delete(req.params.id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }
};

module.exports = empresaController;