const sequelize = require('./sequelize');
const initModels = require('../models');

let models;

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL connection established');

    models = initModels(sequelize);

    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('🧩 Sequelize models synchronized');
    }

    return models;
  } catch (error) {
    console.error('❌ Unable to connect to database', error);
    process.exit(1);
  }
};

const getModels = () => {
  if (!models) {
    throw new Error(
      'Models not initialized. Did you forget to call connectDB()?',
    );
  }
  return models;
};

module.exports = {
  connectDB,
  getModels,
  sequelize,
};
