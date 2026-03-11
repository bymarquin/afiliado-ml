import { Model, DataTypes } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Categoria extends Model {
    static associate(models) {
      Categoria.belongsTo(models.Categoria, {
        as: 'categoriaPai',
        foreignKey: 'categoria_pai_id',
      });

      Categoria.hasMany(models.Categoria, {
        as: 'subcategorias',
        foreignKey: 'categoria_pai_id',
      });

      Categoria.belongsToMany(models.Produto, {
        through: {
          model: 'produto_categorias',
          unique: false,
          timestamps: false,
        },
        foreignKey: 'categoria_id',
        otherKey: 'produto_id',
        as: 'produtos',
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
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      categoria_pai_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'categorias',
          key: 'id',
        },
      },
      ativo: {
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
        { fields: ['categoria_pai_id'], name: 'idx_categorias_pai' },
      ],
    }
  );

  return Categoria;
};
