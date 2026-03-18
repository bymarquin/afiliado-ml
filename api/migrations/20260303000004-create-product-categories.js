/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('produto_categorias', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    product_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'produtos',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    category_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'categorias',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('NOW()'),
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('NOW()'),
    },
  });

  await queryInterface.addIndex('produto_categorias', ['product_id', 'category_id'], {
    unique: true,
    name: 'idx_produto_categorias_unique',
  });

  await queryInterface.addIndex('produto_categorias', ['product_id'], {
    name: 'idx_produto_categorias_product',
  });

  await queryInterface.addIndex('produto_categorias', ['category_id'], {
    name: 'idx_produto_categorias_category',
  });
};

/** @type {import('sequelize-cli').Migration} */
export const down = async (queryInterface, Sequelize) => {
  await queryInterface.dropTable('produto_categorias');
};
