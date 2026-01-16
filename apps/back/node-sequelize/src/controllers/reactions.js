const reactionService = require('../services/reactions');

exports.createReaction = async (req, res) => {
  try {
    await reactionService.createReaction({
      authUserId: req.auth.UserId,
      postId: req.body.PostId,
      commentId: req.body.CommentId,
      type: req.body.type,
    });

    return res.status(201).json({ message: 'Reaction postée !' });
  } catch (error) {
    const status = error?.statusCode || 500;
    return res.status(status).json({
      message: error?.message || 'An error occurred',
    });
  }
};

exports.getAllReactions = async (req, res) => {
  try {
    const reactions = await reactionService.getAllReactions();
    return res.status(200).json(reactions);
  } catch (error) {
    const status = error?.statusCode || 500;
    return res.status(status).json({
      message: error?.message || 'An error occurred',
    });
  }
};

exports.getOneReaction = async (req, res) => {
  try {
    const reaction = await reactionService.getOneReaction(req.params.id);
    return res.status(200).json(reaction);
  } catch (error) {
    const status = error?.statusCode || 500;
    return res.status(status).json({
      message: error?.message || 'An error occurred',
    });
  }
};

exports.modifyReaction = async (req, res) => {
  try {
    await reactionService.modifyReaction({
      reactionId: req.params.id,
      authUserId: req.auth.UserId,
      isAdmin: !!req.auth.isAdmin,
      type: req.body.type,
    });

    return res.status(200).json({ message: 'reaction modifié' });
  } catch (error) {
    const status = error?.statusCode || 500;
    return res.status(status).json({
      message: error?.message || 'An error occurred',
    });
  }
};

exports.deleteReaction = async (req, res) => {
  try {
    await reactionService.deleteReaction({
      reactionId: req.params.id,
      authUserId: req.auth.UserId,
      isAdmin: !!req.auth.isAdmin,
    });

    return res.status(200).json({ message: 'Réaction supprimé !' });
  } catch (error) {
    const status = error?.statusCode || 500;
    return res.status(status).json({
      message: error?.message || 'An error occurred',
    });
  }
};
