const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.split(' ')[1] : null;
    if (!token) return res.status(401).json({ error: 'Missing bearer token' });

    req.auth = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    return next();
  } catch (error) {
    return res.status(401).json({
      error: 'You must be logged in to perform this action',
    });
  }
};
