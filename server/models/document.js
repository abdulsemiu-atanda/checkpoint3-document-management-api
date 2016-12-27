
module.exports = (sequelize, DataTypes) => {
  const document = sequelize.define('Document', {
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    access: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => {
        document.belongsTo(models.user, {
          as: 'owner',
          foreignKey: {
            allowNull: false,
          },
          onDelete: 'CASCADE'
        });
      }
    }
  });
  return document;
};
