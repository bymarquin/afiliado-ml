/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('produtos', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    mlb_id: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    titulo: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    descricao: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    preco: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    preco_original: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    },
    imagem_url: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    url_produto: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    url_afiliado: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    avaliacao: {
      type: Sequelize.DECIMAL(3, 2),
      allowNull: true,
    },
    avaliacao_qtd: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    status: {
      type: Sequelize.STRING,
      defaultValue: 'ativo',
    },
    destaque: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
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

  await queryInterface.addIndex('produtos', ['mlb_id'], {
    name: 'idx_produtos_mlb_id',
  });

  await queryInterface.addIndex('produtos', ['status'], {
    name: 'idx_produtos_status',
  });

  await queryInterface.addIndex('produtos', ['destaque'], {
    name: 'idx_produtos_destaque',
  });

  await queryInterface.addIndex('produtos', ['created_at'], {
    name: 'idx_produtos_created_at',
  });
};

/** @type {import('sequelize-cli').Migration} */
export const down = async (queryInterface, Sequelize) => {
  await queryInterface.dropTable('produtos');
};
