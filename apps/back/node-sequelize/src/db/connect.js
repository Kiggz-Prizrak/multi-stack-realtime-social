const sequelize = require('./sequelize');
require('./models'); 

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL connection established');

    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('🧩 Sequelize models synchronized');
    }
  } catch (error) {
    console.error('❌ Unable to connect to database', error);
    process.exit(1);
  }
};

module.exports = {
  connectDB,
  sequelize,
};
