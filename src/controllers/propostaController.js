const PropostaService = require('../services/propostaService');
const propostaService = new PropostaService();

const propostaController = {
  async create(req, res) {
    try {
      const novaProposta = await propostaService.create(req.body);
      return res.status(201).json(novaProposta);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },
  async getAll(req, res) {
    try {
      const propostas = await propostaService.getAll();
      return res.status(200).json(propostas);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  async getById(req, res) {
    try {
      const proposta = await propostaService.getById(req.params.id);
      return res.status(200).json(proposta);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  },
  async update(req, res) {
    try {
      const propostaAtualizada = await propostaService.update(req.params.id, req.body);
      return res.status(200).json(propostaAtualizada);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  },
  async delete(req, res) {
    try {
      const result = await propostaService.delete(req.params.id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  },
};

module.exports = propostaController;