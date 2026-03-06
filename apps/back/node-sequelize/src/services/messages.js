const messageRepo = require('../repositories/messages');
const roomMemberRepo = require('../repositories/roomMembers');
const { getIO } = require('../socket');

const parseLimit = (value, fallback = 30) => {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return Math.min(n, 50);
};

exports.listMessages = async ({ roomId, userId, limit, before }) => {
  const ok = await roomMemberRepo.isMember({ roomId, userId });
  if (!ok) {
    const err = new Error('Forbidden');
    err.status = 403;
    throw err;
  }

  const lim = parseLimit(limit, 30);
  const bef = before ? Number(before) : null;

  return messageRepo.listPaginated({ roomId, limit: lim, before: bef });
};

exports.sendMessage = async ({ roomId, userId, content }) => {
  const ok = await roomMemberRepo.isMember({ roomId, userId });
  if (!ok) {
    const err = new Error('Forbidden');
    err.status = 403;
    throw err;
  }

  const text = String(content || '').trim();
  if (!text) {
    const err = new Error('content is required');
    err.status = 400;
    throw err;
  }

  const message = await messageRepo.create({
    roomId,
    senderId: userId,
    content: text,
  });

  const io = getIO();
  io.to(`room:${roomId}`).emit('message:new', message);

  // (Optionnel v2) : inbox update à tous les membres via user:${id}
  // ->  unreadCount en live

  return message;
};

exports.markRead = async ({ roomId, userId, lastReadMessageId }) => {
  const ok = await roomMemberRepo.isMember({ roomId, userId });
  if (!ok) {
    const err = new Error('Forbidden');
    err.status = 403;
    throw err;
  }

  const id = Number(lastReadMessageId);
  if (!id) {
    const err = new Error('lastReadMessageId is required');
    err.status = 400;
    throw err;
  }

  await roomMemberRepo.updateReadCursor({
    roomId,
    userId,
    lastReadMessageId: id,
  });

  const io = getIO();
  io.to(`room:${roomId}`).emit('read:update', {
    roomId,
    userId,
    lastReadMessageId: id,
  });

  return { roomId, userId, lastReadMessageId: id };
};
