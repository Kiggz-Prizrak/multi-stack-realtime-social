module.exports = (Sequelize, DataTypes) =>
  Sequelize.define(
    'Message',
    {
      roomId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      indexes: [
        { fields: ['roomId', 'id'] },
        // { fields: ['roomId', 'createdAt'] },
      ],
    },
  );
