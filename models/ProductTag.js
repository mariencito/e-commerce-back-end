const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class ProductTag extends Model {}

ProductTag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product_tag',
  }
);

ProductTag.associate = (models) => {
  ProductTag.belongsTo(models.Product, {
    foreignKey: 'product_id',
  });
  ProductTag.belongsTo(models.Tag, {
    foreignKey: 'tag_id',
  });
};

module.exports = ProductTag;




