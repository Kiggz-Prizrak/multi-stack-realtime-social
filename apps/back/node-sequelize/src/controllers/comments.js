const { promises: fs } = require('fs');
const commentService = require('../services/comments');

const toPositiveInt = (value) => {
  const n = Number(value);
  return Number.isInteger(n) && n >= 0 ? n : null;
};

exports.createComment = async (req, res) => {
  try {
    const created = await commentService.createComment({
      authUserId: req.auth.UserId,
      content: req.body.content,
      postId: req.body.PostId,
      file: req.files?.media?.[0] || null,
      protocol: req.protocol,
      host: req.get('host'),
    });

    return res.status(201).json({
      message: 'Commentaire créé',
      comment: created,
    });
  } catch (error) {
    const status = error?.statusCode || 500;
    return res.status(status).json({
      message: error?.message || 'An error occurred',
    });
  }
};

exports.getAllComments = async (req, res) => {
  try {
    const limitRaw = toPositiveInt(req.query.limit);
    const offsetRaw = toPositiveInt(req.query.offset);

    // defaults + sécurité
    const limit = limitRaw === null ? 20 : Math.min(limitRaw, 100); // max 100
    const offset = offsetRaw === null ? 0 : offsetRaw;

    const result = await commentService.getAllComments({ limit, offset });

    return res.status(200).json(result);
  } catch (error) {
    const status = error?.statusCode || 500;
    return res.status(status).json({
      message: error?.message || 'An error occurred',
    });
  }
};

exports.getOneComment = async (req, res) => {
  try {
    const comment = await commentService.getOneComment(req.params.id);
    return res.status(200).json(comment);
  } catch (error) {
    const status = error?.statusCode || 500;
    return res.status(status).json({
      message: error?.message || 'An error occurred',
    });
  }
};

exports.modifyComment = async (req, res) => {
  try {
    await commentService.modifyComment({
      commentId: req.params.id,
      authUserId: req.auth.UserId,
      isAdmin: !!req.auth.isAdmin,
      body: req.body,
      file: req.files?.media?.[0] || null,
      protocol: req.protocol,
      host: req.get('host'),
    });

    return res.status(200).json({ message: 'Commentaire modifié' });
  } catch (error) {
    const status = error?.statusCode || 500;
    return res.status(status).json({
      message: error?.message || 'An error occurred',
    });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    await commentService.deleteComment({
      commentId: req.params.id,
      authUserId: req.auth.UserId,
      isAdmin: !!req.auth.isAdmin,
    });

    return res.status(200).json({ message: 'Objet supprimé !' });
  } catch (error) {
    const status = error?.statusCode || 500;
    return res.status(status).json({
      message: error?.message || 'An error occurred',
    });
  }
};
