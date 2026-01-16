// repositories/reactions.js
const { Reaction } = require('../models');

exports.existsForUserOnTarget = async ({ userId, postId, commentId }) => {
  const where = { UserId: userId };

  if (postId) where.PostId = postId;
  if (commentId) where.CommentId = commentId;

  const found = await Reaction.findOne({ where });
  return !!found;
};

exports.create = async ({ userId, postId, commentId, type }) => {
  return Reaction.create({
    UserId: userId,
    PostId: postId || null,
    CommentId: commentId || null,
    type,
  });
};

exports.findAll = async () => {
  return Reaction.findAll({
    order: [['createdAt', 'DESC']],
  });
};

exports.findById = async (id) => {
  return Reaction.findOne({
    where: { id },
  });
};

exports.updateTypeById = async (id, type) => {
  return Reaction.update({ type }, { where: { id } });
};

exports.deleteById = async (id) => {
  return Reaction.destroy({ where: { id } });
};
