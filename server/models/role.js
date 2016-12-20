module.exports = function (sequelize, DataTypes) {
  const role = sequelize.define('Role', {
    title: DataTypes.STRING,
    allowNull: false,
    unique: true
  }, {
    classMethods: {
      associate: (models) => {
        role.hasMany(models.user, {
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });
  return role;
};
