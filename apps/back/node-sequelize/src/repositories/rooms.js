const { Op } = require('sequelize');
const { Room, RoomMember, sequelize } = require('../db/models');

const makeDmKey = (a, b) => [a, b].sort((x, y) => x - y).join(':');

exports.makeDmKey = makeDmKey;

exports.findById = (id) => Room.findByPk(id);

exports.listForUser = async (userId) => {
  const memberships = await RoomMember.findAll({
    where: { userId },
    attributes: ['roomId'],
  });

  const roomIds = memberships.map((m) => m.roomId);
  if (roomIds.length === 0) return [];

  return Room.findAll({
    where: { id: { [Op.in]: roomIds } },
    order: [['updatedAt', 'DESC']],
  });
};

exports.findOrCreateDmRoom = async ({ userId, otherUserId }) => {
  const dmKey = makeDmKey(userId, otherUserId);

  return sequelize.transaction(async (t) => {
    const [room, created] = await Room.findOrCreate({
      where: { dmKey },
      defaults: { type: 'dm', name: null, dmKey },
      transaction: t,
    });

    await RoomMember.findOrCreate({
      where: { roomId: room.id, userId },
      defaults: { roomId: room.id, userId, role: 'member' },
      transaction: t,
    });

    await RoomMember.findOrCreate({
      where: { roomId: room.id, userId: otherUserId },
      defaults: { roomId: room.id, userId: otherUserId, role: 'member' },
      transaction: t,
    });

    return { room, created };
  });
};

exports.createGroupRoom = async ({ creatorId, name, memberIds }) => {
  const allMemberIds = Array.from(new Set([creatorId, ...(memberIds || [])]));

  return sequelize.transaction(async (t) => {
    const room = await Room.create(
      { type: 'group', name: name || null, dmKey: null },
      { transaction: t },
    );

    const rows = allMemberIds.map((userId) => ({
      roomId: room.id,
      userId,
      role: userId === creatorId ? 'admin' : 'member',
    }));

    await RoomMember.bulkCreate(rows, {
      transaction: t,
      ignoreDuplicates: true,
    });

    return room;
  });
};
