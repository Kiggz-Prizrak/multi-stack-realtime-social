module.exports = (Sequelize, DataTypes) =>
  Sequelize.define(
    'Room',
    {
      type: {
        type: DataTypes.ENUM('dm', 'group'),
        allowNull: false,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      dmKey: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
    },
    {
      indexes: [{ fields: ['type'] }, { unique: true, fields: ['dmKey'] }],
    },
  );
