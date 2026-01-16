const { Comment, User, Post, Reaction } = require('../db/models');

exports.create = async ({ userId, postId, content, media }) => {
  return Comment.create({
    UserId: userId,
    PostId: postId,
    content,
    ...(media ? { media } : {}),
  });
};

exports.findAllPaginated = async ({ limit, offset }) => {
  return Comment.findAndCountAll({
    limit,
    offset,
    distinct: true,
    include: [
      {
        model: User,
        attributes: ['username', 'firstName', 'lastName', 'avatar'],
      },
      { model: Post },
      { model: Reaction },
    ],
    order: [['createdAt', 'DESC']],
  });
};

exports.findByIdWithAssociations = async (id) => {
  return Comment.findOne({
    where: { id },
    include: [
      {
        model: User,
        attributes: ['username', 'firstName', 'lastName', 'avatar'],
      },
      { model: Post },
      { model: Reaction },
    ],
  });
};

exports.findById = async (id) => {
  return Comment.findOne({ where: { id } });
};

exports.updateById = async (id, data) => {
  return Comment.update(data, { where: { id } });
};

exports.deleteById = async (id) => {
  return Comment.destroy({ where: { id } });
};
