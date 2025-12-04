let ioInstance = null;

function init(server) {
  const { Server } = require('socket.io');
  ioInstance = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || '*',
      methods: ['GET', 'POST']
    }
  });

  ioInstance.on('connection', (socket) => {
    console.log('[socket] connected', socket.id);

    socket.on('join', (payload, ack) => {
      const id = payload && payload.userId ? String(payload.userId) : String(payload);
      console.log('[socket] join request', { id, socketId: socket.id, payload });
      if (id && id !== 'undefined') {
        socket.join(`user:${id}`);
        console.log('[socket] joined room', `user:${id}`, 'socket', socket.id);
        ack && ack({ ok: true, room: `user:${id}` });
      } else {
        ack && ack({ ok: false, reason: 'invalid userId' });
      }
    });

    socket.on('disconnect', (reason) => {
      console.log('[socket] disconnected', socket.id, 'reason:', reason);
    });
  });

  return ioInstance;
}

function getIO() {
  return ioInstance;
}

module.exports = { init, getIO };