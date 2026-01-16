// services/comments.js
const fs = require('fs/promises');
const commentRepository = require('../repositories/comments');

const { toInt } = require('../utils/parsing');
const {
  safeUnlink,
  extractFilenameFromMediaUrl,
} = require('../utils/filesystem');
const { httpError } = require('../utils/httpError');

exports.createComment = async ({
  authUserId,
  content,
  postId,
  file,
  protocol,
  host,
}) => {
  if (typeof content !== 'string' || content.trim().length === 0) {
    if (file?.filename) await safeUnlink(`images/${file.filename}`);
    httpError('please provides all fields', 400);
  }

  const parsedPostId = toInt(postId);
  if (!parsedPostId) {
    if (file?.filename) await safeUnlink(`images/${file.filename}`);
    httpError('Invalid post id', 400);
  }

  const mediaUrl = file?.filename
    ? `${protocol}://${host}/images/${file.filename}`
    : null;

  try {
    const created = await commentRepository.create({
      userId: authUserId,
      postId: parsedPostId,
      content: content.trim(),
      media: mediaUrl,
    });

    return created;
  } catch (e) {
    if (file?.filename) await safeUnlink(`images/${file.filename}`);

    httpError('An error is occured', 500);
  }
};

exports.getAllComments = async ({ limit, offset }) => {
  try {
    const { rows, count } = await commentRepository.findAllPaginated({
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
    httpError('Failed to fetch comments', 500);
  }
};

exports.getOneComment = async (commentId) => {
  const id = toInt(commentId);
  if (!id) {
    httpError('Invalid comment id', 404);
  }

  const comment = await commentRepository.findByIdWithAssociations(id);

  if (!comment) {
    httpError('Comment not found', 404);
  }

  return comment;
};

exports.modifyComment = async ({
  commentId,
  authUserId,
  isAdmin,
  body,
  file,
  protocol,
  host,
}) => {
  const id = toInt(commentId);
  if (!id) {
    if (file?.filename) await safeUnlink(`images/${file.filename}`);
    httpError('Invalid comment id', 400);
  }

  const comment = await commentRepository.findById(id);
  if (!comment) {
    if (file?.filename) await safeUnlink(`images/${file.filename}`);
    httpError('Comment not found', 404);
  }

  if (comment.UserId !== authUserId && !isAdmin) {
    if (file?.filename) await safeUnlink(`images/${file.filename}`);
    httpError('Unauthorized request', 403);
  }

  const updateData = {};

  if (typeof body?.content === 'string') {
    updateData.content = body.content.trim();
  }

  // if (body?.PostId !== undefined) {
  //   const postId = toInt(body.PostId);
  //   if (!postId) {
  //     if (file?.filename) await safeUnlink(`images/${file.filename}`);
  //     httpError('Invalid PostId', 400);
  //   }
  //   updateData.PostId = postId;
  // }

  const newMediaUrl = file?.filename
    ? `${protocol}://${host}/images/${file.filename}`
    : null;

  if (newMediaUrl) {
    updateData.media = newMediaUrl;
  }

  if (Object.keys(updateData).length === 0) {
    if (file?.filename) await safeUnlink(`images/${file.filename}`);
    httpError('No fields to update', 400);
  }

  const oldMediaFilename = extractFilenameFromMediaUrl(comment.media);

  try {
    await commentRepository.updateById(id, updateData);
  } catch (e) {
    if (file?.filename) await safeUnlink(`images/${file.filename}`);
    httpError('Failed to update comment', 500);
  }

  if (newMediaUrl && oldMediaFilename) {
    await safeUnlink(`images/${oldMediaFilename}`);
  }
};

exports.deleteComment = async ({ commentId, authUserId, isAdmin }) => {
  const id = toInt(commentId);
  if (!id) {
    httpError('Invalid comment id', 400);
  }

  const comment = await commentRepository.findById(id);

  if (!comment) {
    httpError('Comment not found', 404);
  }

  if (comment.UserId !== authUserId && !isAdmin) {
    httpError('Unauthorized request', 403);
  }

  await commentRepository.deleteById(id);

  const filename = extractFilenameFromMediaUrl(comment.media);
  if (filename) {
    await safeUnlink(`images/${filename}`);
  }
};
