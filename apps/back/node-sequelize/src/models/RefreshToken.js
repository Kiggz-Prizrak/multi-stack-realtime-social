module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'RefreshToken',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tokenHash: {
        type: DataTypes.STRING(128),
        allowNull: false,
        unique: true,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      revokedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'refresh_tokens',
      timestamps: true,
      updatedAt: false,
    },
  );
};
