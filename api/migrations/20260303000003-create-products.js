/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('produtos', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    meli_id: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    original_price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    },
    image_url: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    product_url: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    affiliate_url: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    rating: {
      type: Sequelize.DECIMAL(3, 2),
      allowNull: true,
    },
    rating_count: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    status: {
      type: Sequelize.STRING,
      defaultValue: 'active',
    },
    featured: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    click_count: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
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

  await queryInterface.addIndex('produtos', ['meli_id'], {
    name: 'idx_produtos_meli_id',
  });

  await queryInterface.addIndex('produtos', ['status'], {
    name: 'idx_produtos_status',
  });

  await queryInterface.addIndex('produtos', ['featured'], {
    name: 'idx_produtos_featured',
  });

  await queryInterface.addIndex('produtos', ['created_at'], {
    name: 'idx_produtos_created_at',
  });

  await queryInterface.addIndex('produtos', ['click_count'], {
    name: 'idx_produtos_click_count',
  });
};

/** @type {import('sequelize-cli').Migration} */
export const down = async (queryInterface, Sequelize) => {
  await queryInterface.dropTable('produtos');
};
