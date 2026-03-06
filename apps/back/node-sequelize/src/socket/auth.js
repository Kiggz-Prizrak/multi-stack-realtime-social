const jwt = require('jsonwebtoken');

function parseCookies(cookieHeader) {
  if (!cookieHeader) return {};
  return cookieHeader.split(';').reduce((acc, part) => {
    const [k, ...v] = part.trim().split('=');
    if (!k) return acc;
    acc[k] = decodeURIComponent(v.join('=') || '');
    return acc;
  }, {});
}

function socketAuth(socket, next) {
  const authToken =
    typeof socket.handshake.auth?.token === 'string'
      ? socket.handshake.auth.token
      : null;

  const header =
    typeof socket.handshake.headers?.authorization === 'string'
      ? socket.handshake.headers.authorization
      : '';

  const bearer = header.startsWith('Bearer ') ? header.slice(7) : null;

  const cookies = parseCookies(socket.handshake.headers?.cookie || '');
  const cookieToken = cookies.access_token || null;

  const token = authToken || bearer || cookieToken;

  if (!token) return next(new Error('Missing auth token'));

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    socket.auth = payload;
    socket.user = { id: payload.UserId || payload.id };
    return next();
  } catch (err) {
    return next(new Error('Invalid or expired token'));
  }
}

module.exports = { socketAuth };
