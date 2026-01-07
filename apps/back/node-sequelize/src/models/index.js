const { DataTypes } = require('sequelize');

const initModels = (sequelize) => {
  const User = require('./User')(sequelize, DataTypes);
  const Post = require('./Post')(sequelize, DataTypes);
  const Comment = require('./Comment')(sequelize, DataTypes);
  const Reaction = require('./Reaction')(sequelize, DataTypes);
  const Report = require('./Report')(sequelize, DataTypes);

  /* =========================
     Associations
  ========================== */

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

  return {
    User,
    Post,
    Comment,
    Reaction,
    Report,
  };
};

module.exports = initModels;
