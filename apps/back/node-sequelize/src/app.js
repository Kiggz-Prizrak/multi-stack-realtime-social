const express = require('express');
const cookieParser = require('cookie-parser');

const usersRoutes = require('./routes/users');
const postsRoutes = require('./routes/posts');
const commentsRoutes = require('./routes/comments');
const reactionsRoutes = require('./routes/reactions');
const reportsRoutes = require('./routes/reports');

const app = express();

app.use('/images', express.static('./images'));

// Body parsing
app.use(express.json());

// Cookies (req.cookies)
app.use(cookieParser());

// CORS (multi-origin, compatible cookies)
const allowedOrigins = new Set(
  (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
);

app.use((req, res, next) => {
  const origin = req.headers.origin;

  // Autorise seulement les origins whitelisted (nécessaire pour cookies)
  if (origin && allowedOrigins.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization',
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  );

  // Preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  return next();
});

// Routes
app.use('/api/users', usersRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/reactions', reactionsRoutes);
app.use('/api/reports', reportsRoutes);

module.exports = app;
