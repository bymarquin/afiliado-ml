import { Model, DataTypes } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Produto extends Model {
    static associate(models) {
      Produto.belongsToMany(models.Categoria, {
        through: {
          model: 'produto_categorias',
          unique: false,
          timestamps: false,
        },
        foreignKey: 'produto_id',
        otherKey: 'categoria_id',
        as: 'categorias',
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
      mlb_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      titulo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      descricao: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      preco: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      preco_original: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      imagem_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      url_produto: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      url_afiliado: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      avaliacao: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: true,
      },
      avaliacao_qtd: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'ativo',
        validate: {
          isIn: [['ativo', 'inativo', 'sem_estoque']],
        },
      },
      destaque: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Produto',
      tableName: 'produtos',
      timestamps: true,
      underscored: true,
      indexes: [
        { fields: ['mlb_id'], name: 'idx_produtos_mlb_id' },
        { fields: ['status'], name: 'idx_produtos_status' },
        { fields: ['destaque'], name: 'idx_produtos_destaque' },
        { fields: ['created_at'], name: 'idx_produtos_created_at' },
      ],
    }
  );

  return Produto;
};
