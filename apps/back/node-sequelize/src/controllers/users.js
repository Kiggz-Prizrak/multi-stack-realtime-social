const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { promises: fs } = require('fs');
const { User, Post, Comment, Reaction } = require('../models');
const { cleanupUploadedAvatar } = require('../utils/uploadCleanup');
const authService = require('../services/auth');

exports.signup = async (req, res) => {
  try {
    const avatarFile = req.files?.avatar?.[0] || null;

    const result = await authService.signup({
      body: req.body,
      avatarFile,
      protocol: req.protocol,
      host: req.get('host'),
    });

    return res.status(201).json(result);
  } catch (err) {
    await cleanupUploadedAvatar(req);

    const status = err.status || 500;
    const message = err.message || 'Error';
    return res.status(status).json({ message });
  }
};

exports.login = async (req, res) => {
  try {
    const result = await authService.login({
      email: req.body.email,
      password: req.body.password,
    });

    return res.status(200).json(result);
  } catch (err) {
    await cleanupUploadedAvatar(req);

    const status = err.status || 500;
    const message = err.message || 'An error has occurred';
    return res.status(status).json({ message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json(users);
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ message: err.message || 'Error' });
  }
};

exports.getOneUser = async (req, res) => {
  try {
    const user = await userService.getOneUser(req.params.id);
    return res.status(200).json(user);
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ message: err.message || 'Error' });
  }
};

exports.modifyUser = async (req, res) => {
  try {
    const avatarFile = req.files?.avatar?.[0] || null;

    const result = await userService.modifyUser({
      targetUserId: req.params.id,
      auth: req.auth,
      body: req.body,
      avatarFile,
      protocol: req.protocol,
      host: req.get('host'),
    });

    if (result.avatarWasUpdated && result.oldAvatarUrl) {
      const oldFilename = result.oldAvatarUrl.split('/images/')[1];
      if (oldFilename && oldFilename !== 'default_avatar.png') {
        try {
          await fs.unlink(`images/${oldFilename}`);
        } catch (_) {}
      }
    }

    return res.status(200).json({ message: result.message, user: result.user });
  } catch (err) {
    await cleanupUploadedAvatar(req);

    const status = err.status || 500;
    return res.status(status).json({ message: err.message || 'Error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const result = await userService.deleteUser({
      targetUserId: req.params.id,
      auth: req.auth,
    });

    if (result.avatarUrl) {
      const filename = result.avatarUrl.split('/images/')[1];

      if (filename && filename !== 'default_avatar.png') {
        try {
          await fs.unlink(`images/${filename}`);
        } catch (_) {}
      }
    }

    return res.status(200).json({ message: result.message });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ message: err.message || 'Error' });
  }
};
