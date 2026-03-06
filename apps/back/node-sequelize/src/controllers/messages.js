const messagesService = require('../services/messages');

exports.list = async (req, res) => {
  try {
    const userId = req.auth.UserId;
    const roomId = Number(req.params.roomId);

    if (!roomId) return res.status(400).json({ error: 'Invalid roomId' });

    const { items, nextCursor } = await messagesService.listMessages({
      roomId,
      userId,
      limit: req.query.limit,
      before: req.query.before,
    });

    return res.status(200).json({ items, nextCursor });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ error: error.message || error });
  }
};

exports.create = async (req, res) => {
  try {
    const userId = req.auth.UserId;
    const roomId = Number(req.params.roomId);

    if (!roomId) return res.status(400).json({ error: 'Invalid roomId' });

    const message = await messagesService.sendMessage({
      roomId,
      userId,
      content: req.body?.content,
    });

    return res.status(201).json({ message });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ error: error.message || error });
  }
};

exports.read = async (req, res) => {
  try {
    const userId = req.auth.UserId;
    const roomId = Number(req.params.roomId);

    if (!roomId) return res.status(400).json({ error: 'Invalid roomId' });

    const result = await messagesService.markRead({
      roomId,
      userId,
      lastReadMessageId: req.body?.lastReadMessageId,
    });

    return res.status(200).json(result);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ error: error.message || error });
  }
};
