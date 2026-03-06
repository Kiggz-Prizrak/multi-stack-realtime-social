const { Op } = require('sequelize');
const { Message, User } = require('../db/models');

exports.create = async ({ roomId, senderId, content }) => {
  const msg = await Message.create({ roomId, senderId, content });
  // reload with sender (match swagger "sender")
  return Message.findByPk(msg.id, {
    include: [
      {
        model: User,
        as: 'sender',
        attributes: ['id', 'username', 'firstName', 'lastName', 'avatar'],
      },
    ],
  });
};

exports.listPaginated = async ({ roomId, limit, before }) => {
  const where = { roomId };
  if (before) where.id = { [Op.lt]: before };

  const itemsDesc = await Message.findAll({
    where,
    order: [['id', 'DESC']],
    limit,
    include: [
      {
        model: User,
        as: 'sender',
        attributes: ['id', 'username', 'firstName', 'lastName', 'avatar'],
      },
    ],
  });

  const items = itemsDesc.slice().reverse();
  const nextCursor =
    itemsDesc.length === limit
      ? String(itemsDesc[itemsDesc.length - 1].id)
      : null;

  return { items, nextCursor };
};
