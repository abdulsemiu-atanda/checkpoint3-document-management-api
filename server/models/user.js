import bCrypt from 'bcrypt';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    RoleId: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  }, {
    classMethods: {
      associate: (models) => {
        User.belongsTo(models.Role, {
          foreignKey: {
            allowNull: false
          },
          onDelete: 'CASCADE'
        });
        User.hasMany(models.Document, {
          foreignKey: {
            name: 'ownerId',
            allowNull: false,
          },
          onDelete: 'CASCADE'
        });
      }
    },
    hooks: {
      beforeCreate: (theUser) => {
        theUser.password = bCrypt.hashSync(theUser.password,
            bCrypt.genSaltSync(8));
      },
      beforeUpdate: (theUser) => {
        theUser.password = bCrypt.hashSync(theUser.password,
            bCrypt.genSaltSync(8));
      }
    }
  });
  return User;
};
