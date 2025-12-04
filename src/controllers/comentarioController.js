const { create, listByTarefa } = require('../services/comentarioService');

module.exports = {
  async criar(req, res) {
    try {
      const body = req.body || {};
      const autorId = req.user?.id_usuario || body.autor_id || Number(req.query.autorId);
      if (!autorId) return res.status(400).json({ error: 'autor_id é obrigatório' });
      const data = { tarefa_id: Number(body.tarefa_id), autor_id: Number(autorId), texto: String(body.texto || '') };
      const item = await create(data);
      return res.status(201).json(item);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  },
  async listarPorTarefa(req, res) {
    try {
      const tarefaId = Number(req.params.tarefaId || req.query.tarefaId);
      if (!tarefaId) return res.status(400).json({ error: 'tarefaId é obrigatório' });
      const lista = await listByTarefa(tarefaId);
      return res.status(200).json(lista);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  }
};
