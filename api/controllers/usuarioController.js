import { Usuario } from '../models/index.js';
import { Sequelize } from 'sequelize';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const ALLOWED_ORDER_FIELDS = ['id', 'nome', 'email', 'created_at', 'updated_at'];

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) || parsed < 1 ? fallback : parsed;
}

function normalizeSort(order, direction) {
  const orderField = ALLOWED_ORDER_FIELDS.includes(order) ? order : 'created_at';
  const orderDirection = String(direction).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  return { orderField, orderDirection };
}

/**
 * Controller para gerenciar Usuários
 */

/**
 * GET /api/usuarios
 * Lista todos os usuários com paginação
 */
export async function listUsuarios(req, res) {
  try {
    const {
      page = 1,
      limit = 20,
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

    if (ativo !== undefined) {
      where.ativo = ativo === 'true';
    }

    if (search) {
      where[Sequelize.Op.or] = [
        { nome: { [Sequelize.Op.iLike]: `%${search}%` } },
        { email: { [Sequelize.Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Usuario.findAndCountAll({
      where,
      limit: limitNumber,
      offset,
      order: [[orderField, orderDirection]],
      attributes: { exclude: ['senha_hash'] },
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
 * GET /api/usuarios/:id
 * Obtém um usuário específico
 */
export async function getUsuario(req, res) {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id, {
      attributes: { exclude: ['senha_hash'] },
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
 * POST /api/usuarios
 * Cria um novo usuário
 */
export async function createUsuario(req, res) {
  try {
    const { nome, email, senha, ativo = true } = req.body;

    // Validações
    if (!nome || !email || !senha) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios faltando',
        message: 'nome, email e senha são obrigatórios',
      });
    }

    // Verifica se já existe usuário com este email
    const existingUsuario = await Usuario.findOne({ where: { email } });
    if (existingUsuario) {
      return res.status(409).json({
        success: false,
        error: 'Usuário já cadastrado',
        message: 'Já existe um usuário com este email',
      });
    }

    // Hash da senha
    const senha_hash = await bcrypt.hash(senha, 10);

    const usuario = await Usuario.create({
      nome,
      email,
      senha_hash,
      ativo,
    });

    res.status(201).json({
      success: true,
      data: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        ativo: usuario.ativo,
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
 * PUT /api/usuarios/:id
 * Atualiza um usuário existente
 */
export async function updateUsuario(req, res) {
  try {
    const { id } = req.params;
    const { nome, email, senha, ativo } = req.body;

    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado',
      });
    }

    // Verifica se email já existe (exceto o próprio)
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
      nome: nome ?? usuario.nome,
      email: email ?? usuario.email,
      ativo: ativo ?? usuario.ativo,
    };

    // Hash da senha se fornecida
    if (senha) {
      updateData.senha_hash = await bcrypt.hash(senha, 10);
    }

    await usuario.update(updateData);

    res.json({
      success: true,
      data: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        ativo: usuario.ativo,
        atualizado_em: usuario.atualizado_em,
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
 * DELETE /api/usuarios/:id
 * Remove um usuário (soft delete - desativa)
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

    // Soft delete - apenas desativa
    await usuario.update({ ativo: false });

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
 * POST /api/usuarios/login
 * Realiza login do usuário
 */
export async function loginUsuario(req, res) {
  try {
    const { email, senha } = req.body;

    // Validações
    if (!email || !senha) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios faltando',
        message: 'email e senha são obrigatórios',
      });
    }

    // Busca usuário
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(401).json({
        success: false,
        error: 'Credenciais inválidas',
        message: 'Email ou senha incorretos',
      });
    }

    // Verifica se está ativo
    if (!usuario.ativo) {
      return res.status(401).json({
        success: false,
        error: 'Usuário inativo',
        message: 'Este usuário está desativado',
      });
    }

    // Verifica senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);

    if (!senhaValida) {
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

    // Gera token JWT
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
        nome: usuario.nome,
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
 * GET /api/usuarios/me
 * Obtém dados do usuário autenticado
 */
export async function getUsuarioMe(req, res) {
  try {
    // Assume que o middleware de autenticação adicionou o usuário ao request
    if (!req.usuario) {
      return res.status(401).json({
        success: false,
        error: 'Não autenticado',
        message: 'Usuário não autenticado',
      });
    }

    const usuario = await Usuario.findByPk(req.usuario.id, {
      attributes: { exclude: ['senha_hash'] },
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
