import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Categoria extends Model {
    static associate(models) {
      Categoria.belongsTo(models.Categoria, {
        as: 'parentCategory',
        foreignKey: 'parent_category_id',
      });

      Categoria.hasMany(models.Categoria, {
        as: 'subcategories',
        foreignKey: 'parent_category_id',
      });

      Categoria.belongsToMany(models.Produto, {
        through: {
          model: 'produto_categorias',
          unique: false,
          timestamps: false,
        },
        foreignKey: 'category_id',
        otherKey: 'product_id',
        as: 'products',
      });
    }
  }

  Categoria.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      parent_category_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'categorias',
          key: 'id',
        },
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'Categoria',
      tableName: 'categorias',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['slug'], name: 'idx_categorias_slug' },
        { fields: ['parent_category_id'], name: 'idx_categorias_parent_category' },
      ],
    }
  );

  return Categoria;
};
