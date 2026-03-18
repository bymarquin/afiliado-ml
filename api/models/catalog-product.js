import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Produto extends Model {
    static associate(models) {
      Produto.belongsToMany(models.Categoria, {
        through: {
          model: 'produto_categorias',
          unique: false,
          timestamps: false,
        },
        foreignKey: 'product_id',
        otherKey: 'category_id',
        as: 'categories',
      });
    }
  }

  Produto.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      meli_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      original_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      product_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      affiliate_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      rating: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: true,
      },
      rating_count: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'active',
        validate: {
          isIn: [['active', 'inactive', 'out_of_stock']],
        },
      },
      featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      click_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'Produto',
      tableName: 'produtos',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['meli_id'], name: 'idx_produtos_meli_id' },
        { fields: ['status'], name: 'idx_produtos_status' },
        { fields: ['featured'], name: 'idx_produtos_featured' },
        { fields: ['click_count'], name: 'idx_produtos_click_count' },
        { fields: ['created_at'], name: 'idx_produtos_created_at' },
      ],
    }
  );

  return Produto;
};
