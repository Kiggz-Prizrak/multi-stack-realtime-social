module.exports = (Sequelize, DataTypes) =>
  Sequelize.define(
    'RoomMember',
    {
      role: {
        type: DataTypes.ENUM('member', 'admin'),
        allowNull: false,
        defaultValue: 'member',
      },

      roomId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      joinedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },

      lastReadMessageId: { type: DataTypes.INTEGER, allowNull: true },
      lastReadAt: { type: DataTypes.DATE, allowNull: true },
    },
    {
      indexes: [
        { unique: true, fields: ['roomId', 'userId'] },
        { fields: ['userId'] },
        { fields: ['roomId'] },
      ],
    },
  );
