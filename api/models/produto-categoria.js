import { Model, DataTypes } from 'sequelize';

export default (sequelize, DataTypes) => {
  class ProdutoCategoria extends Model {
    static associate(models) {
      ProdutoCategoria.belongsTo(models.Produto, {
        foreignKey: 'produto_id',
        as: 'produto',
      });

      ProdutoCategoria.belongsTo(models.Categoria, {
        foreignKey: 'categoria_id',
        as: 'categoria',
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
      produto_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'produtos',
          key: 'id',
        },
      },
      categoria_id: {
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
      indexes: [
        { fields: ['produto_id', 'categoria_id'], unique: true },
      ],
    }
  );

  return ProdutoCategoria;
};
