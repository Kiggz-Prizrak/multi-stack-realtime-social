// services/reactions.js
const reactionRepository = require('../repositories/reactions');

const { toInt } = require('../utils/parsing');
const {
  safeUnlink,
  extractFilenameFromMediaUrl,
} = require('../utils/filesystem');
const { httpError } = require('../utils/httpError');

exports.createReaction = async ({ authUserId, postId, commentId, type }) => {
  if (typeof type !== 'string' || type.trim().length === 0) {
    const err = new Error('please provides all fields');
    err.statusCode = 400;
    throw err;
  }

  const parsedPostId = toIntOrNull(postId);
  const parsedCommentId = toIntOrNull(commentId);

  if (!parsedPostId && !parsedCommentId) {
    const err = new Error('please select comment or post to react');
    err.statusCode = 400;
    throw err;
  }

  if (parsedPostId && parsedCommentId) {
    const err = new Error('please select between comment or post to react');
    err.statusCode = 400;
    throw err;
  }

  const alreadyReacted = await reactionRepository.existsForUserOnTarget({
    userId: authUserId,
    postId: parsedPostId,
    commentId: parsedCommentId,
  });

  if (alreadyReacted) {
    const err = new Error('element already reacted');
    err.statusCode = 400;
    throw err;
  }

  try {
    await reactionRepository.create({
      userId: authUserId,
      postId: parsedPostId,
      commentId: parsedCommentId,
      type: type.trim(),
    });
  } catch (e) {
    const err = new Error('Error');
    err.statusCode = 500;
    throw err;
  }
};

exports.getAllReactions = async () => {
  try {
    return await reactionRepository.findAll();
  } catch (e) {
    const err = new Error('Failed to fetch reactions');
    err.statusCode = 500;
    throw err;
  }
};

exports.getOneReaction = async (reactionId) => {
  const id = toInt(reactionId);
  if (!id) {
    const err = new Error('Invalid reaction id');
    err.statusCode = 400;
    throw err;
  }

  const reaction = await reactionRepository.findById(id);

  if (!reaction) {
    const err = new Error('Reaction not found');
    err.statusCode = 404;
    throw err;
  }

  return reaction;
};

exports.modifyReaction = async ({ reactionId, authUserId, isAdmin, type }) => {
  const id = toInt(reactionId);
  if (!id) {
    const err = new Error('Invalid reaction id');
    err.statusCode = 400;
    throw err;
  }

  const reaction = await reactionRepository.findById(id);
  if (!reaction) {
    const err = new Error('Reaction not found');
    err.statusCode = 404;
    throw err;
  }

  if (reaction.UserId !== authUserId && !isAdmin) {
    const err = new Error('Unauthorized request');
    err.statusCode = 403;
    throw err;
  }

  if (typeof type !== 'string' || type.trim().length === 0) {
    const err = new Error('please provides all fields');
    err.statusCode = 400;
    throw err;
  }

  try {
    await reactionRepository.updateTypeById(id, type.trim());
  } catch (e) {
    const err = new Error('Failed to update reaction');
    err.statusCode = 500;
    throw err;
  }
};

exports.deleteReaction = async ({ reactionId, authUserId, isAdmin }) => {
  const id = toInt(reactionId);
  if (!id) {
    const err = new Error('Invalid reaction id');
    err.statusCode = 400;
    throw err;
  }

  const reaction = await reactionRepository.findById(id);
  if (!reaction) {
    const err = new Error('reaction not found');
    err.statusCode = 404;
    throw err;
  }

  if (reaction.UserId !== authUserId && !isAdmin) {
    const err = new Error('Unauthorized request');
    err.statusCode = 403;
    throw err;
  }

  try {
    await reactionRepository.deleteById(id);
  } catch (e) {
    const err = new Error('Failed to delete reaction');
    err.statusCode = 500;
    throw err;
  }
};
