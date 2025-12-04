const notificacaoService = require('../services/notificacaoService');

module.exports = {
  async minhas(req, res) {
    try {
      const userId = Number(req.user?.id || req.query.usuarioId);
      if (!userId) return res.status(400).json({ error: 'usuarioId é obrigatório (query) se não houver usuário autenticado.' });
      const lista = await notificacaoService.listarNaoLidas(userId);
      return res.status(200).json(lista);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  },

  async marcarComoLida(req, res) {
    try {
      const id = Number(req.params.id);
      const userId = Number(req.user?.id || req.body.usuarioId || req.query.usuarioId);
      if (!id || !userId) return res.status(400).json({ error: 'id e usuarioId são obrigatórios.' });
      const n = await notificacaoService.marcarComoLida(id, userId);
      return res.status(200).json(n);
    } catch (e) {
      return res.status(404).json({ error: e.message });
    }
  },

  // endpoint de teste: criar notificação, enviar email e emitir via websocket
  async test(req, res) {
    try {
      const currentUserId = Number(req.user?.id);
      const { usuarioId, mensagem, email = true } = req.body;
      if (!usuarioId || !mensagem) return res.status(400).json({ error: 'usuarioId e mensagem são obrigatórios.' });

      // Restrição simples: permitir somente para si mesmo ou admin (ajuste conforme sua regra)
      const isAdmin = req.user?.cargo_id && String(req.user.cargo_id).toLowerCase().includes('admin'); // adapt if you have admin role
      if (Number(usuarioId) !== currentUserId && !isAdmin) {
        return res.status(403).json({ error: 'Não autorizado a criar notificação para outro usuário.' });
      }

      const n = await notificacaoService.criarNotificacao(Number(usuarioId), mensagem, { email });
      return res.status(201).json(n);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }
};