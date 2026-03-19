/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('usuarios', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: Sequelize.STRING,
      allowNull: false,
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

  await queryInterface.addIndex('usuarios', ['email'], {
    name: 'idx_usuarios_email',
  });
};

/** @type {import('sequelize-cli').Migration} */
export const down = async (queryInterface, Sequelize) => {
  await queryInterface.dropTable('usuarios');
};
