const ServicoService = require('../services/servicoService');
const servicoService = new ServicoService();

const servicoController = {
  async create(req, res) {
    try {
      const novo = await servicoService.create(req.body);
      return res.status(201).json(novo);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async getAll(req, res) {
    try {
      const lista = await servicoService.getAll();
      return res.json(lista);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const item = await servicoService.getById(req.params.id);
      return res.json(item);
    } catch (error) {
      const status = /não encontrado/i.test(error.message) ? 404 : 400;
      return res.status(status).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const atualizado = await servicoService.update(req.params.id, req.body);
      return res.json(atualizado);
    } catch (error) {
      const status = /não encontrado/i.test(error.message) ? 404 : 400;
      return res.status(status).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const resp = await servicoService.delete(req.params.id);
      return res.json(resp);
    } catch (error) {
      const status = /não encontrado/i.test(error.message) ? 404 : 400;
      return res.status(status).json({ error: error.message });
    }
  },

  async getByTipo(req, res) {
    try {
      const { tipo } = req.params;
      const lista = await servicoService.getByTipo(tipo);
      return res.json({ total: lista.length, servicos: lista });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
};

module.exports = servicoController;
