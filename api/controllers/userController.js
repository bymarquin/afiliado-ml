import { Usuario } from '../models/index.js';
import { Sequelize } from 'sequelize';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const ALLOWED_ORDER_FIELDS = ['id', 'name', 'email', 'created_at', 'updated_at'];

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) || parsed < 1 ? fallback : parsed;
}

function normalizeSort(order, direction) {
  const orderField = ALLOWED_ORDER_FIELDS.includes(order) ? order : 'created_at';
  const orderDirection = String(direction).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  return { orderField, orderDirection };
}

function parseBooleanQuery(value) {
  if (value === undefined) return undefined;
  if (typeof value === 'boolean') return value;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
}

/**
 * @route GET /api/usuarios
 * @description Lista todos os usuários com paginação
 */
export async function listUsuarios(req, res) {
  try {
    const {
      page = 1,
      limit = 20,
      is_active,
      ativo,
      search,
      order = 'created_at',
      direction = 'DESC',
    } = req.query;

    const pageNumber = parsePositiveInt(page, 1);
    const limitNumber = Math.min(parsePositiveInt(limit, 20), 100);
    const offset = (pageNumber - 1) * limitNumber;
    const { orderField, orderDirection } = normalizeSort(order, direction);
    const where = {};

    const activeFilter = parseBooleanQuery(is_active ?? ativo);
    if (activeFilter !== undefined) {
      where.is_active = activeFilter;
    }

    if (search) {
      where[Sequelize.Op.or] = [
        { name: { [Sequelize.Op.iLike]: `%${search}%` } },
        { email: { [Sequelize.Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Usuario.findAndCountAll({
      where,
      limit: limitNumber,
      offset,
      order: [[orderField, orderDirection]],
      attributes: { exclude: ['password_hash'] },
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(count / limitNumber),
      },
    });
  } catch (error) {
    console.error('Erro ao listar usuários:', error.message);
    res.status(500).json({
      success: false,
      error: 'Erro ao listar usuários',
    });
  }
}

/**
 * @route GET /api/usuarios/:id
 * @description Obtém um usuário específico
 * @param {number} id - ID do usuário
 */
export async function getUsuario(req, res) {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id, {
      attributes: { exclude: ['password_hash'] },
    });

    if (!usuario) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado',
      });
    }

    res.json({
      success: true,
      data: usuario,
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error.message);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar usuário',
    });
  }
}

/**
 * @route POST /api/usuarios
 * @description Cria um novo usuário
 */
export async function createUsuario(req, res) {
  try {
    const name = req.body.name ?? req.body.nome;
    const email = req.body.email;
    const password = req.body.password ?? req.body.senha;
    const isActive = req.body.is_active ?? req.body.ativo ?? true;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios faltando',
        message: 'name, email e password são obrigatórios',
      });
    }

    const existingUsuario = await Usuario.findOne({ where: { email } });
    if (existingUsuario) {
      return res.status(409).json({
        success: false,
        error: 'Usuário já cadastrado',
        message: 'Já existe um usuário com este email',
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const usuario = await Usuario.create({
      name,
      email,
      password_hash,
      is_active: isActive,
    });

    res.status(201).json({
      success: true,
      data: {
        id: usuario.id,
        name: usuario.name,
        email: usuario.email,
        is_active: usuario.is_active,
        created_at: usuario.created_at,
      },
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error.message);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar usuário',
    });
  }
}

/**
 * @route PUT /api/usuarios/:id
 * @description Atualiza um usuário existente
 * @param {number} id - ID do usuário
 */
export async function updateUsuario(req, res) {
  try {
    const { id } = req.params;
    const name = req.body.name ?? req.body.nome;
    const email = req.body.email;
    const password = req.body.password ?? req.body.senha;
    const isActive = req.body.is_active ?? req.body.ativo;

    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado',
      });
    }

    if (email && email !== usuario.email) {
      const existingEmail = await Usuario.findOne({
        where: { email, id: { [Sequelize.Op.ne]: id } },
      });
      if (existingEmail) {
        return res.status(409).json({
          success: false,
          error: 'Email já cadastrado',
          message: 'Já existe um usuário com este email',
        });
      }
    }

    const updateData = {
      name: name ?? usuario.name,
      email: email ?? usuario.email,
      is_active: isActive ?? usuario.is_active,
    };

    if (password) {
      updateData.password_hash = await bcrypt.hash(password, 10);
    }

    await usuario.update(updateData);

    res.json({
      success: true,
      data: {
        id: usuario.id,
        name: usuario.name,
        email: usuario.email,
        is_active: usuario.is_active,
        updated_at: usuario.updated_at,
      },
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error.message);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar usuário',
    });
  }
}

/**
 * @route DELETE /api/usuarios/:id
 * @description Remove um usuário (soft delete - desativa)
 * @param {number} id - ID do usuário
 */
export async function deleteUsuario(req, res) {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado',
      });
    }

    await usuario.update({ is_active: false });

    res.json({
      success: true,
      message: 'Usuário desativado com sucesso',
    });
  } catch (error) {
    console.error('Erro ao remover usuário:', error.message);
    res.status(500).json({
      success: false,
      error: 'Erro ao remover usuário',
    });
  }
}

/**
 * @route POST /api/usuarios/login
 * @description Realiza login do usuário
 */
export async function loginUsuario(req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password ?? req.body.senha;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios faltando',
        message: 'email e password são obrigatórios',
      });
    }

    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(401).json({
        success: false,
        error: 'Credenciais inválidas',
        message: 'Email ou senha incorretos',
      });
    }

    if (!usuario.is_active) {
      return res.status(401).json({
        success: false,
        error: 'Usuário inativo',
        message: 'Este usuário está desativado',
      });
    }

    const passwordValid = await bcrypt.compare(password, usuario.password_hash);

    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        error: 'Credenciais inválidas',
        message: 'Email ou senha incorretos',
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        error: 'Configuração inválida',
        message: 'JWT_SECRET não configurado',
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: {
        id: usuario.id,
        name: usuario.name,
        email: usuario.email,
        token,
      },
    });
  } catch (error) {
    console.error('Erro no login:', error.message);
    res.status(500).json({
      success: false,
      error: 'Erro ao realizar login',
    });
  }
}

/**
 * @route GET /api/usuarios/me
 * @description Obtém dados do usuário autenticado
 */
export async function getUsuarioMe(req, res) {
  try {
    if (!req.usuario) {
      return res.status(401).json({
        success: false,
        error: 'Não autenticado',
        message: 'Usuário não autenticado',
      });
    }

    const usuario = await Usuario.findByPk(req.usuario.id, {
      attributes: { exclude: ['password_hash'] },
    });

    if (!usuario) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado',
      });
    }

    res.json({
      success: true,
      data: usuario,
    });
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error.message);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar dados do usuário',
    });
  }
}
