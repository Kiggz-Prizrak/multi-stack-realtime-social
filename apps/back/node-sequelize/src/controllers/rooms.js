const roomsService = require('../services/rooms');

exports.list = async (req, res) => {
  try {
    const userId = req.auth.UserId;
    const rooms = await roomsService.listRooms(userId);
    return res.status(200).json({ rooms });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

exports.create = async (req, res) => {
  try {
    const userId = req.auth.UserId;
    const { type, name, memberIds } = req.body;

    const { room, created } = await roomsService.createRoom({
      userId,
      type,
      name,
      memberIds,
    });

    const status = created ? 201 : 200;
    return res.status(status).json({ room });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ error: error.message || error });
  }
};
