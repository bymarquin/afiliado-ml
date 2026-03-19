import bcrypt from 'bcrypt';

const MOCK_USER = {
  name: 'Admin Mock',
  email: 'admin.mock@afiliado.local',
  password: '123456',
};

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface) => {
  const [existingUsers] = await queryInterface.sequelize.query(
    'SELECT id FROM usuarios WHERE email = :email LIMIT 1',
    {
      replacements: { email: MOCK_USER.email },
    }
  );

  if (Array.isArray(existingUsers) && existingUsers.length > 0) {
    return;
  }

  const passwordHash = await bcrypt.hash(MOCK_USER.password, 10);

  await queryInterface.bulkInsert(
    'usuarios',
    [
      {
        name: MOCK_USER.name,
        email: MOCK_USER.email,
        password_hash: passwordHash,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ],
    {}
  );
};

/** @type {import('sequelize-cli').Migration} */
export const down = async (queryInterface) => {
  await queryInterface.bulkDelete('usuarios', { email: MOCK_USER.email }, {});
};
