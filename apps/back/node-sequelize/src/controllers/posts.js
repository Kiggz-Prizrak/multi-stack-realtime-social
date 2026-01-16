const { promises: fs } = require('fs');

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
    const limitRaw = toPositiveInt(req.query.limit);
    const offsetRaw = toPositiveInt(req.query.offset);

    const limit = limitRaw === null ? 20 : Math.min(limitRaw, 50); // max 50 (posts avec includes = lourd)
    const offset = offsetRaw === null ? 0 : offsetRaw;

    const result = await postService.getAllPosts({ limit, offset });

    return res.status(200).json(result);
  } catch (error) {
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
