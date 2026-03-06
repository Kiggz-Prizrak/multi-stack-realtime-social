const { DataTypes } = require('sequelize');

exports.initModels = (sequelize) => {
  const User = require('./User')(sequelize, DataTypes);
  const Post = require('./Post')(sequelize, DataTypes);
  const Comment = require('./Comment')(sequelize, DataTypes);
  const Reaction = require('./Reaction')(sequelize, DataTypes);
  const Report = require('./Report')(sequelize, DataTypes);

  const Room = require('./Room')(sequelize, DataTypes);
  const RoomMember = require('./RoomMember')(sequelize, DataTypes);
  const Message = require('./Message')(sequelize, DataTypes);

  User.hasMany(Post, { onDelete: 'CASCADE' });
  User.hasMany(Comment, { onDelete: 'CASCADE' });
  User.hasMany(Reaction, { onDelete: 'CASCADE' });
  User.hasMany(Report, { onDelete: 'CASCADE' });

  Post.belongsTo(User);
  Post.hasMany(Comment, { onDelete: 'CASCADE' });
  Post.hasMany(Reaction, { onDelete: 'CASCADE' });
  Post.hasMany(Report, { onDelete: 'CASCADE' });

  Comment.belongsTo(User);
  Comment.belongsTo(Post);
  Comment.hasMany(Reaction, { onDelete: 'CASCADE' });
  Comment.hasMany(Report, { onDelete: 'CASCADE' });

  Reaction.belongsTo(User);
  Reaction.belongsTo(Post);
  Reaction.belongsTo(Comment);

  Report.belongsTo(User);
  Report.belongsTo(Post);
  Report.belongsTo(Comment);

  Room.hasMany(RoomMember, { foreignKey: 'roomId', onDelete: 'CASCADE' });
  RoomMember.belongsTo(Room, { foreignKey: 'roomId' });

  User.hasMany(RoomMember, { foreignKey: 'userId', onDelete: 'CASCADE' });
  RoomMember.belongsTo(User, { foreignKey: 'userId' });

  Room.hasMany(Message, { foreignKey: 'roomId', onDelete: 'CASCADE' });
  Message.belongsTo(Room, { foreignKey: 'roomId' });

  User.hasMany(Message, { foreignKey: 'senderId', onDelete: 'CASCADE' });
  Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

  return {
    User,
    Post,
    Comment,
    Reaction,
    Report,

    Room,
    RoomMember,
    Message,
  };
};
