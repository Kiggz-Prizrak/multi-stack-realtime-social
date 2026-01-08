const { User } = require('../models');

module.exports = async (req, res, next) => {
  const userId = Number(req.params.id);
  if (!Number.isInteger(userId)) {
    return res.status(400).json({ message: 'bad request' });
  }

  const user = await User.findByPk(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (user.id !== req.auth.UserId && !req.auth.isAdmin) {
    return res.status(403).json({ message: 'Unauthorized request' });
  }

  req.targetUser = user;
  next();
};

