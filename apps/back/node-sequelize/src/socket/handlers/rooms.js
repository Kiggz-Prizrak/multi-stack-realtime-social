const { RoomMember } = require('../../db/models');

exports.registerRoomHandlers = (io, socket) => {
  socket.on('room:join', async ({ roomId }) => {
    if (!roomId) return;

    const membership = await RoomMember.findOne({
      where: { roomId, userId: socket.user.id },
    });

    if (!membership) {
      socket.emit('error', { message: 'Forbidden: not a room member' });
      return;
    }

    socket.join(`room:${roomId}`);
    socket.emit('room:joined', { roomId });
  });

  socket.on('room:leave', ({ roomId }) => {
    if (!roomId) return;
    socket.leave(`room:${roomId}`);
    socket.emit('room:left', { roomId });
  });
};
