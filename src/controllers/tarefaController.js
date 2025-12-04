const TarefaService = require('../services/tarefaService');
const tarefaService = new TarefaService();

const tarefaController = {
  async create(req, res) {
    try {
      const novaTarefa = await tarefaService.create(req.body);
      return res.status(201).json(novaTarefa);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },
  async getAll(req, res) {
    try {
      const tarefas = await tarefaService.getAll();
      return res.status(200).json(tarefas);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  async getById(req, res) {
    try {
      const tarefa = await tarefaService.getById(req.params.id);
      return res.status(200).json(tarefa);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  },
  async update(req, res) {
    try {
      const tarefaAtualizada = await tarefaService.update(req.params.id, req.body);
      return res.status(200).json(tarefaAtualizada);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  },
  async delete(req, res) {
    try {
      const result = await tarefaService.delete(req.params.id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  },
};

module.exports = tarefaController;