import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class ProductClick extends Model {
    static associate(models) {
      ProductClick.belongsTo(models.Produto, {
        foreignKey: 'product_id',
        as: 'product',
      });
    }
  }

  ProductClick.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'produtos',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      clicked_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'ProductClick',
      tableName: 'product_clicks',
      timestamps: false,
      indexes: [
        { fields: ['clicked_at', 'product_id'], name: 'idx_clicks_date_product' },
        { fields: ['clicked_at'], name: 'idx_clicks_date' },
      ],
    }
  );

  return ProductClick;
};
