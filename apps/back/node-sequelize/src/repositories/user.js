// src/repositories/users.js
const { getModels } = require('../db/connect');

/* =========================
   CRUD simples
========================= */

exports.findById = async (id) => {
  const { User } = getModels();
  return User.findOne({ where: { id } });
};

exports.findByEmail = async (email) => {
  const { User } = getModels();
  return User.findOne({ where: { email } });
};

exports.findByUsername = async (username) => {
  const { User } = getModels();
  return User.findOne({ where: { username } });
};

exports.create = async (data) => {
  const { User } = getModels();
  return User.create(data);
};

exports.updateById = async (id, patch) => {
  const { User } = getModels();
  return User.update(patch, { where: { id } });
};

exports.deleteById = async (id) => {
  const { User } = getModels();
  return User.destroy({ where: { id } });
};

/* =========================
   Queries complexes
========================= */

exports.findAllWithFeed = async () => {
  const { User, Post, Comment, Reaction } = getModels();

  return User.findAll({
    include: [
      {
        model: Post,
        include: [
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
          {
            model: User,
            attributes: ['username', 'firstName', 'lastName', 'avatar'],
          },
        ],
      },
      { model: Comment },
      { model: Reaction },
    ],
    order: [['createdAt', 'DESC']],
  });
};

exports.findOneWithFeedById = async (id) => {
  const { User, Post, Comment, Reaction } = getModels();

  return User.findOne({
    where: { id },
    include: [
      {
        model: Post,
        include: [
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
          {
            model: User,
            attributes: ['username', 'firstName', 'lastName', 'avatar'],
          },
        ],
      },
      { model: Comment },
      { model: Reaction },
    ],
    order: [
      [Post, 'createdAt', 'DESC'],
      [Comment, 'createdAt', 'DESC'],
    ],
  });
};
