const Notificacao = require('../models/Notificacao');
const User = require('../models/User');
const Cargo = require('../models/Cargo');
const { Op } = require('sequelize');
const { enviarEmail } = require('./emailService');

// socket utils imported lazily to avoid init order issues
const { getIO } = require('../utils/socket');

async function criarNotificacao(usuarioIdDestino, mensagem, options = {}) {
  if (!usuarioIdDestino) throw new Error('usuarioIdDestino é obrigatório');
  if (!mensagem) throw new Error('mensagem é obrigatória');

  // Validate user exists
  const userExists = await User.findOne({ where: { id_usuario: usuarioIdDestino } });
  if (!userExists) throw new Error('Usuário destino não encontrado');

  const notif = await Notificacao.create({
    usuario_id_destino: usuarioIdDestino,
    mensagem,
    lida: false
  });

  // Emit via socket.io (não bloqueante)
  try {
    const io = getIO();
    if (io) {
      const room = `user:${usuarioIdDestino}`;
      // quantos sockets estão na sala (v4)
      const socketsInRoom = await io.in(room).allSockets(); // Promise<Set>
      console.log('[notificacaoService] sockets in room:', room, 'count=', socketsInRoom.size, 'sockets=', Array.from(socketsInRoom));
      io.to(room).emit('notificacao', {
        id_notificacao: notif.id_notificacao,
        mensagem: notif.mensagem,
        lida: notif.lida,
        criado_em: notif.criado_em,
        usuario_id_destino: notif.usuario_id_destino
      });
      console.log('[notificacaoService] emitted notificacao to', room);
    }
  } catch (sioErr) {
    // fail silently
    console.warn('[notificacaoService] socket emit error:', sioErr.message);
  }

  // Enviar e-mail em background (não bloquear criação)
  if (options.email !== false) {
    (async () => {
      try {
        if (userExists?.email) {
          await enviarEmail(userExists.email, 'Nova notificação', mensagem);
        }
      } catch (e) {
        console.warn('[notificacaoService] Falha ao enviar e-mail:', e.message);
      }
    })();
  }

  return notif;
}

async function listarNaoLidas(usuarioIdDestino) {
  return await Notificacao.findAll({
    where: { usuario_id_destino: usuarioIdDestino, lida: false },
    order: [['criado_em', 'DESC']]
  });
}

async function marcarComoLida(idNotificacao, usuarioIdDestino) {
  const n = await Notificacao.findOne({ where: { id_notificacao: idNotificacao, usuario_id_destino: usuarioIdDestino } });
  if (!n) throw new Error('Notificação não encontrada');
  await n.update({ lida: true });

  // Notify via socket that the notification was marked as read
  try {
    const io = getIO();
    if (io) {
      io.to(`user:${usuarioIdDestino}`).emit('notificacao-lida', { id_notificacao: idNotificacao });
    }
  } catch (sioErr) {
    console.warn('[notificacaoService] socket emit error (lida):', sioErr.message);
  }

  return n;
}

async function usuariosGerentes() {
  const gerentes = await User.findAll({
    include: [{ model: Cargo, where: { nome_cargo: { [Op.like]: 'Gerente%' } }, required: true }]
  });
  return gerentes;
}

async function notificarGerentes(mensagem, options = {}) {
  const gerentes = await usuariosGerentes();
  if (!gerentes.length) return [];

  const entries = gerentes.map(g => ({
    usuario_id_destino: g.id_usuario,
    mensagem,
    lida: false,
    criado_em: new Date()
  }));

  const created = await Notificacao.bulkCreate(entries);

  // emit and email in background
  (async () => {
    const io = getIO();
    for (const g of gerentes) {
      try {
        if (options.email !== false && g.email) {
          enviarEmail(g.email, 'Nova notificação', mensagem).catch((e) => console.warn('email error', e.message));
        }
        if (io) {
          const room = `user:${g.id_usuario}`;
          // quantos sockets estão na sala (v4)
          const socketsInRoom = await io.in(room).allSockets(); // Promise<Set>
          console.log('[notificacaoService] sockets in room:', room, 'count=', socketsInRoom.size, 'sockets=', Array.from(socketsInRoom));
          io.to(room).emit('notificacao', {
            mensagem,
            usuario_id_destino: g.id_usuario,
            criado_em: new Date()
          });
        }
      } catch (err) {
        console.warn('[notificacaoService] notificarGerentes error:', err.message);
      }
    }
  })();

  return created;
}

// Cron opcional: ... (keep as is but will emit via criarNotificacao which already emits)
async function verificarVencimentosProximos(dias = 7) {
  const Tarefa = require('../models/Tarefa');
  const agora = new Date();
  const limite = new Date(agora.getTime() + dias * 24 * 60 * 60 * 1000);
  const proximas = await Tarefa.findAll({
    where: {
      contrato_id: { [Op.ne]: null },
      data_fim: { [Op.gte]: agora, [Op.lte]: limite }
    }
  });

  for (const t of proximas) {
    if (t.responsavel_id) {
      const msg = `Vencimento próximo da tarefa "${t.titulo}" (até ${new Date(t.data_fim).toLocaleString()}).`;
      await criarNotificacao(t.responsavel_id, msg);
    }
  }

  return { total: proximas.length };
}

module.exports = {
  criarNotificacao,
  listarNaoLidas,
  marcarComoLida,
  notificarGerentes,
  verificarVencimentosProximos
};
