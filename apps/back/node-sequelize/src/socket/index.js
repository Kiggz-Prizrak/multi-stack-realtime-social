const { Server } = require('socket.io');
const { socketAuth } = require('./auth');
const { registerRoomHandlers } = require('./handlers/rooms');

let ioInstance = null;

const initSocket = (httpServer) => {
  const allowedOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error('Not allowed by CORS'), false);
      },
      credentials: true,
      methods: ['GET', 'POST'],
    },
  });

  io.use(socketAuth);

  io.on('connection', (socket) => {
    console.log('🟢 socket connected', socket.id, 'user=', socket.user?.id);
    socket.join(`user:${socket.user.id}`);

    registerRoomHandlers(io, socket);

    socket.on('disconnect', (reason) => {
      console.log('🔴 socket disconnected', socket.id, reason);
    });
  });

  ioInstance = io;
  return io;
};

const getIO = () => {
  if (!ioInstance) {
    throw new Error(
      'Socket.IO not initialized. Call initSocket(server) first.',
    );
  }
  return ioInstance;
};

module.exports = { initSocket, getIO };
