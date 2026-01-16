const fs = require('fs/promises');
const postRepository = require('../repositories/posts');

const { toInt } = require('../utils/parsing');
const {
  safeUnlink,
  extractFilenameFromMediaUrl,
} = require('../utils/filesystem');
const { httpError } = require('../utils/httpError');

exports.createPost = async ({ authUserId, content, file, protocol, host }) => {
  if (typeof content !== 'string' || content.trim().length === 0) {
    if (file?.filename) await safeUnlink(`images/${file.filename}`);
    const err = new Error('please provides valid data');
    err.statusCode = 400;
    throw err;
  }

  const mediaUrl = file?.filename
    ? `${protocol}://${host}/images/${file.filename}`
    : null;

  try {
    const created = await postRepository.create({
      userId: authUserId,
      content: content.trim(),
      media: mediaUrl,
    });

    return created;
  } catch (e) {
    // DB failed -> cleanup newly uploaded file
    if (file?.filename) await safeUnlink(`images/${file.filename}`);

    const err = new Error('Error');
    err.statusCode = 500;
    throw err;
  }
};

exports.getAllPosts = async ({ limit, offset }) => {
  try {
    const { rows, count } = await postRepository.findAllPaginated({
      limit,
      offset,
    });

    return {
      items: rows,
      pagination: {
        limit,
        offset,
        total: count,
      },
    };
  } catch (e) {
    const err = new Error('Failed to fetch posts');
    err.statusCode = 500;
    throw err;
  }
};

exports.getOnePost = async (postId) => {
  const id = toInt(postId);
  if (!id) {
    const err = new Error('Invalid post id');
    err.statusCode = 400;
    throw err;
  }

  const post = await postRepository.findByIdWithAssociations(id);

  if (!post) {
    const err = new Error('Post not found');
    err.statusCode = 404;
    throw err;
  }

  return post;
};

exports.modifyPost = async ({
  postId,
  authUserId,
  isAdmin,
  body,
  file,
  protocol,
  host,
}) => {
  const id = toInt(postId);
  if (!id) {
    if (file?.filename) await safeUnlink(`images/${file.filename}`);
    const err = new Error('Invalid post id');
    err.statusCode = 400;
    throw err;
  }

  const post = await postRepository.findById(id);
  if (!post) {
    if (file?.filename) await safeUnlink(`images/${file.filename}`);
    const err = new Error('Post not found');
    err.statusCode = 404;
    throw err;
  }

  if (post.UserId !== authUserId && !isAdmin) {
    if (file?.filename) await safeUnlink(`images/${file.filename}`);
    const err = new Error('Unauthorized request');
    err.statusCode = 403;
    throw err;
  }

  const updateData = {};

  if (typeof body?.content === 'string') {
    updateData.content = body.content.trim();
  }

  const newMediaUrl = file?.filename
    ? `${protocol}://${host}/images/${file.filename}`
    : null;

  if (newMediaUrl) {
    updateData.media = newMediaUrl;
  }

  if (Object.keys(updateData).length === 0) {
    if (file?.filename) await safeUnlink(`images/${file.filename}`);
    const err = new Error('No fields to update');
    err.statusCode = 400;
    throw err;
  }

  const oldMediaFilename = extractFilenameFromMediaUrl(post.media);

  try {
    await postRepository.updateById(id, updateData);
  } catch (e) {
    if (file?.filename) await safeUnlink(`images/${file.filename}`);
    const err = new Error('Failed to update post');
    err.statusCode = 500;
    throw err;
  }

  if (newMediaUrl && oldMediaFilename) {
    await safeUnlink(`images/${oldMediaFilename}`);
  }
};

exports.deletePost = async ({ postId, authUserId, isAdmin }) => {
  const id = toInt(postId);
  if (!id) {
    const err = new Error('Invalid post id');
    err.statusCode = 400;
    throw err;
  }

  const post = await postRepository.findById(id);
  if (!post) {
    const err = new Error('Post not found');
    err.statusCode = 404;
    throw err;
  }

  if (post.UserId !== authUserId && !isAdmin) {
    const err = new Error('Unauthorized request');
    err.statusCode = 403;
    throw err;
  }

  await postRepository.deleteById(id);

  const filename = extractFilenameFromMediaUrl(post.media);
  if (filename) {
    await safeUnlink(`images/${filename}`);
  }
};
