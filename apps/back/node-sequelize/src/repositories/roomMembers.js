const { RoomMember } = require('../db/models');

exports.isMember = async ({ roomId, userId }) => {
  const row = await RoomMember.findOne({ where: { roomId, userId } });
  return !!row;
};

exports.getMembers = async (roomId) => {
  return RoomMember.findAll({
    where: { roomId },
    attributes: ['userId', 'role', 'lastReadMessageId', 'lastReadAt'],
  });
};

exports.updateReadCursor = async ({ roomId, userId, lastReadMessageId }) => {
  return RoomMember.update(
    { lastReadMessageId, lastReadAt: new Date() },
    { where: { roomId, userId } },
  );
};
