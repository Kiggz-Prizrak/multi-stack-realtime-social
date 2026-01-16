const { Post, User, Comment, Reaction } = require('../models');

exports.create = async ({ userId, content, media }) => {
  return Post.create({
    UserId: userId,
    content,
    ...(media ? { media } : {}),
  });
};

exports.findAllPaginated = async ({ limit, offset }) => {
  return Post.findAndCountAll({
    limit,
    offset,
    distinct: true,
    include: [
      {
        model: User,
        attributes: ['username', 'firstName', 'lastName', 'avatar'],
      },
      {
        model: Comment,
        include: [
          { model: Reaction },
          {
            model: User,
            attributes: ['username', 'firstName', 'lastName', 'avatar'],
          },
        ],
      },
      { model: Reaction },
    ],
    order: [
      ['createdAt', 'DESC'],
      [Comment, 'createdAt', 'DESC'],
    ],
  });
};

exports.findByIdWithAssociations = async (id) => {
  return Post.findOne({
    where: { id },
    include: [
      {
        model: User,
        attributes: ['username', 'firstName', 'lastName', 'avatar'],
      },
      {
        model: Comment,
        include: [
          {
            model: User,
            attributes: ['username', 'firstName', 'lastName', 'avatar'],
          },
          { model: Reaction },
        ],
      },
      { model: Reaction },
    ],
    order: [[Comment, 'createdAt', 'DESC']],
  });
};

exports.findById = async (id) => {
  return Post.findOne({ where: { id } });
};

exports.updateById = async (id, data) => {
  return Post.update(data, { where: { id } });
};


exports.deleteById = async (id) => {
  return Post.destroy({ where: { id } });
};