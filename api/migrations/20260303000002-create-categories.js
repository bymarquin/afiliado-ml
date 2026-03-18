/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('categorias', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    slug: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    parent_category_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'categorias',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
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

  await queryInterface.addIndex('categorias', ['slug'], {
    name: 'idx_categorias_slug',
  });

  await queryInterface.addIndex('categorias', ['parent_category_id'], {
    name: 'idx_categorias_parent_category',
  });
};

/** @type {import('sequelize-cli').Migration} */
export const down = async (queryInterface, Sequelize) => {
  await queryInterface.dropTable('categorias');
};
