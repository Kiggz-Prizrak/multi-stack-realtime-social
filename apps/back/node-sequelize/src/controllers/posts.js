const { promises: fs } = require('fs');
const { toPositiveInt } = require('../utils/parsing');
const postService = require('../services/posts');

exports.createPost = async (req, res) => {
  try {
    const created = await postService.createPost({
      authUserId: req.auth.UserId,
      content: req.body.content,
      file: req.files?.media?.[0] || null,
      protocol: req.protocol,
      host: req.get('host'),
    });

    return res.status(201).json({
      message: 'Post créé',
      post: created,
    });
  } catch (error) {
    const status = error?.statusCode || 500;
    return res.status(status).json({
      message: error?.message || 'An error occurred',
    });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const parsedLimit = Number.parseInt(req.query.limit, 10);
    const parsedOffset = Number.parseInt(req.query.offset, 10);

    const limit =
      Number.isInteger(parsedLimit) && parsedLimit > 0
        ? Math.min(parsedLimit, 50)
        : 20;

    const offset =
      Number.isInteger(parsedOffset) && parsedOffset >= 0 ? parsedOffset : 0;

    const result = await postService.getAllPosts({ limit, offset });

    return res.status(200).json(result);
  } catch (error) {
    console.error('GET POSTS ERROR:', error);

    const status = error?.statusCode || 500;
    return res.status(status).json({
      message: error?.message || 'An error occurred',
    });
  }
};
exports.getOnePost = async (req, res) => {
  try {
    const post = await postService.getOnePost(req.params.id);
    return res.status(200).json(post);
  } catch (error) {
    const status = error?.statusCode || 500;
    return res.status(status).json({
      message: error?.message || 'An error occurred',
    });
  }
};

exports.modifyPost = async (req, res) => {
  try {
    await postService.modifyPost({
      postId: req.params.id,
      authUserId: req.auth.UserId,
      isAdmin: !!req.auth.isAdmin,
      body: req.body,
      file: req.files?.media?.[0] || null,
      protocol: req.protocol,
      host: req.get('host'),
    });

    return res.status(200).json({ message: 'Post modifié' });
  } catch (error) {
    const status = error?.statusCode || 500;
    return res.status(status).json({
      message: error?.message || 'An error occurred',
    });
  }
};

exports.deletePost = async (req, res) => {
  try {
    await postService.deletePost({
      postId: req.params.id,
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
