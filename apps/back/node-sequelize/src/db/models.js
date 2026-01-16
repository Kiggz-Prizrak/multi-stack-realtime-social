// src/db/models.js
const sequelize = require('./sequelize');
const { initModels } = require('../models/initModels');

const models = initModels(sequelize);

module.exports = models;
