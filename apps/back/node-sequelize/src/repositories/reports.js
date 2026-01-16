// repositories/reports.js
const { Report } = require('../models');

exports.existsForUserOnTarget = async ({ userId, postId, commentId }) => {
  const where = { UserId: userId };
  if (postId) where.PostId = postId;
  if (commentId) where.CommentId = commentId;

  const found = await Report.findOne({ where });
  return !!found;
};

exports.create = async ({ userId, postId, commentId }) => {
  return Report.create({
    UserId: userId,
    PostId: postId || null,
    CommentId: commentId || null,
  });
};

exports.findAll = async () => {
  return Report.findAll({
    order: [['createdAt', 'DESC']],
  });
};

exports.findById = async (id) => {
  return Report.findOne({ where: { id } });
};

exports.deleteById = async (id) => {
  return Report.destroy({ where: { id } });
};
