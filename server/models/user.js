
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
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
    }
  });
  return User;
};
