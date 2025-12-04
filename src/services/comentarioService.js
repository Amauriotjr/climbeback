const Comentario = require('../models/Comentario');
const Tarefa = require('../models/Tarefa');
const User = require('../models/User');
const { criarNotificacao } = require('./notificacaoService');

function snippet(texto, max = 120) {
  if (!texto) return '';
  return texto.length > max ? texto.slice(0, max).trim() + '…' : texto;
}

async function create({ tarefa_id, autor_id, texto }) {
  const tarefa = await Tarefa.findByPk(tarefa_id);
  if (!tarefa) throw new Error('Tarefa não encontrada');

  const autor = await User.findOne({ where: { id_usuario: autor_id } });
  if (!autor) throw new Error('Autor não encontrado');

  const comentario = await Comentario.create({ tarefa_id, autor_id, texto });

  // Notifica o responsável de forma humana e simples
  if (tarefa.responsavel_id) {
    const msg = `Novo comentário em "${tarefa.titulo}": ${snippet(texto)}`;
    try { await criarNotificacao(tarefa.responsavel_id, msg); } catch {}
  }

  return comentario;
}

async function listByTarefa(tarefa_id) {
  return await Comentario.findAll({
    where: { tarefa_id },
    include: [{ model: User, as: 'autor', attributes: ['id_usuario', 'nome_completo'] }],
    order: [['criado_em', 'DESC']]
  });
}

module.exports = { create, listByTarefa };
