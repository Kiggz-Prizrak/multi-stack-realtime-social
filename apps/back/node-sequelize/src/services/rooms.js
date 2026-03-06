const roomRepo = require('../repositories/rooms');

exports.listRooms = async (userId) => {
  return roomRepo.listForUser(userId);
};

exports.createRoom = async ({ userId, type, name, memberIds }) => {
  if (!type || (type !== 'dm' && type !== 'group')) {
    const err = new Error('Invalid room type');
    err.status = 400;
    throw err;
  }

  if (type === 'dm') {
    if (!Array.isArray(memberIds) || memberIds.length !== 1) {
      const err = new Error('For dm: provide exactly 1 other user id');
      err.status = 400;
      throw err;
    }
    const otherUserId = Number(memberIds[0]);
    if (!otherUserId || otherUserId === userId) {
      const err = new Error('Invalid other user id');
      err.status = 400;
      throw err;
    }

    return roomRepo.findOrCreateDmRoom({ userId, otherUserId });
  }

  if (!Array.isArray(memberIds) || memberIds.length < 1) {
    const err = new Error('For group: provide at least 1 member id');
    err.status = 400;
    throw err;
  }

  const room = await roomRepo.createGroupRoom({
    creatorId: userId,
    name,
    memberIds: memberIds.map(Number).filter(Boolean),
  });

  return { room, created: true };
};
