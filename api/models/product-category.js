import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class ProdutoCategoria extends Model {
    static associate(models) {
      ProdutoCategoria.belongsTo(models.Produto, {
        foreignKey: 'product_id',
        as: 'product',
      });

      ProdutoCategoria.belongsTo(models.Categoria, {
        foreignKey: 'category_id',
        as: 'category',
      });
    }
  }

  ProdutoCategoria.init(
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
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'categorias',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'ProdutoCategoria',
      tableName: 'produto_categorias',
      timestamps: true,
      underscored: true,
      indexes: [{ fields: ['product_id', 'category_id'], unique: true }],
    }
  );

  return ProdutoCategoria;
};
