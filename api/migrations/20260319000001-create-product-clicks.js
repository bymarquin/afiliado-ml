/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('product_clicks', {
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
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    clicked_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('NOW()'),
    },
  });

  await queryInterface.addIndex('product_clicks', ['clicked_at', 'product_id'], {
    name: 'idx_clicks_date_product',
  });

  await queryInterface.addIndex('product_clicks', ['clicked_at'], {
    name: 'idx_clicks_date',
  });
};

/** @type {import('sequelize-cli').Migration} */
export const down = async (queryInterface) => {
  await queryInterface.dropTable('product_clicks');
};
