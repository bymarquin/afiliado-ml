import { Categoria } from '../models/index.js';
import { Sequelize } from 'sequelize';

function parseBooleanQuery(value) {
  if (value === undefined) return undefined;
  if (typeof value === 'boolean') return value;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
}

/**
 * Controller para gerenciar Categorias
 */

/**
 * GET /api/categorias
 * Lista todas as categorias
 */
export async function listCategorias(req, res) {
  try {
    const { ativo, pai } = req.query;
    const where = {};

    const ativoParsed = parseBooleanQuery(ativo);

    where.ativo = ativoParsed ?? true;

    if (pai !== undefined) {
      if (pai === 'null') {
        where.categoria_pai_id = null;
      } else {
        const paiId = Number.parseInt(pai, 10);
        if (Number.isNaN(paiId) || paiId < 1) {
          return res.status(400).json({
            success: false,
            error: 'Parâmetro pai inválido',
          });
        }
        where.categoria_pai_id = paiId;
      }
    }

    const categorias = await Categoria.findAll({
      where,
      include: [{
        model: Categoria,
        as: 'subcategorias',
        where: { ativo: true },
        required: false,
        attributes: ['id', 'nome', 'slug'],
      }],
      order: [['nome', 'ASC']],
    });

    res.json({
      success: true,
      data: categorias,
    });
  } catch (error) {
    console.error('Erro ao listar categorias:', error.message);
    res.status(500).json({
      success: false,
      error: 'Erro ao listar categorias',
    });
  }
}

/**
 * GET /api/categorias/:id
 * Obtém uma categoria específica
 */
export async function getCategoria(req, res) {
  try {
    const { id } = req.params;

    const categoria = await Categoria.findByPk(id, {
      include: [
        {
          model: Categoria,
          as: 'categoriaPai',
          attributes: ['id', 'nome', 'slug'],
        },
        {
          model: Categoria,
          as: 'subcategorias',
          attributes: ['id', 'nome', 'slug'],
        },
      ],
    });

    if (!categoria) {
      return res.status(404).json({
        success: false,
        error: 'Categoria não encontrada',
      });
    }

    res.json({
      success: true,
      data: categoria,
    });
  } catch (error) {
    console.error('Erro ao buscar categoria:', error.message);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar categoria',
    });
  }
}

/**
 * GET /api/categorias/slug/:slug
 * Obtém uma categoria pelo slug
 */
export async function getCategoriaBySlug(req, res) {
  try {
    const { slug } = req.params;

    const categoria = await Categoria.findOne({
      where: { slug },
      include: [
        {
          model: Categoria,
          as: 'categoriaPai',
          attributes: ['id', 'nome', 'slug'],
        },
        {
          model: Categoria,
          as: 'subcategorias',
          where: { ativo: true },
          required: false,
          attributes: ['id', 'nome', 'slug'],
        },
      ],
    });

    if (!categoria) {
      return res.status(404).json({
        success: false,
        error: 'Categoria não encontrada',
      });
    }

    res.json({
      success: true,
      data: categoria,
    });
  } catch (error) {
    console.error('Erro ao buscar categoria:', error.message);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar categoria',
    });
  }
}

/**
 * POST /api/categorias
 * Cria uma nova categoria
 */
export async function createCategoria(req, res) {
  try {
    const { nome, slug, categoria_pai_id, ativo = true } = req.body;

    // Validações
    if (!nome || !slug) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios faltando',
        message: 'nome e slug são obrigatórios',
      });
    }

    // Verifica se já existe categoria com este nome ou slug
    const existingCategoria = await Categoria.findOne({
      where: {
        [Sequelize.Op.or]: [{ nome }, { slug }],
      },
    });

    if (existingCategoria) {
      return res.status(409).json({
        success: false,
        error: 'Categoria já cadastrada',
        message: 'Já existe uma categoria com este nome ou slug',
      });
    }

    // Verifica se categoria_pai existe (se fornecido)
    if (categoria_pai_id) {
      const categoriaPai = await Categoria.findByPk(categoria_pai_id);
      if (!categoriaPai) {
        return res.status(400).json({
          success: false,
          error: 'Categoria pai não encontrada',
          message: 'A categoria pai informada não existe',
        });
      }
    }

    const categoria = await Categoria.create({
      nome,
      slug,
      categoria_pai_id,
      ativo,
    });

    res.status(201).json({
      success: true,
      data: categoria,
    });
  } catch (error) {
    console.error('Erro ao criar categoria:', error.message);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar categoria',
    });
  }
}

/**
 * PUT /api/categorias/:id
 * Atualiza uma categoria existente
 */
export async function updateCategoria(req, res) {
  try {
    const { id } = req.params;
    const { nome, slug, categoria_pai_id, ativo } = req.body;

    const categoria = await Categoria.findByPk(id);

    if (!categoria) {
      return res.status(404).json({
        success: false,
        error: 'Categoria não encontrada',
      });
    }

    // Verifica se não há conflito de nome/slug com outras categorias
    if (nome || slug) {
      const existingCategoria = await Categoria.findOne({
        where: {
          [Sequelize.Op.or]: [
            nome ? { nome, id: { [Sequelize.Op.ne]: id } } : null,
            slug ? { slug, id: { [Sequelize.Op.ne]: id } } : null,
          ].filter(Boolean),
        },
      });

      if (existingCategoria) {
        return res.status(409).json({
          success: false,
          error: 'Conflito de categoria',
          message: 'Já existe uma categoria com este nome ou slug',
        });
      }
    }

    // Verifica se categoria_pai existe e não é ela mesma
    if (categoria_pai_id !== undefined) {
      if (categoria_pai_id === parseInt(id)) {
        return res.status(400).json({
          success: false,
          error: 'Categoria pai inválida',
          message: 'Uma categoria não pode ser sua própria categoria pai',
        });
      }

      if (categoria_pai_id !== null) {
        const categoriaPai = await Categoria.findByPk(categoria_pai_id);
        if (!categoriaPai) {
          return res.status(400).json({
            success: false,
            error: 'Categoria pai não encontrada',
            message: 'A categoria pai informada não existe',
          });
        }
      }
    }

    await categoria.update({
      nome: nome ?? categoria.nome,
      slug: slug ?? categoria.slug,
      categoria_pai_id: categoria_pai_id !== undefined ? categoria_pai_id : categoria.categoria_pai_id,
      ativo: ativo ?? categoria.ativo,
    });

    res.json({
      success: true,
      data: categoria,
    });
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error.message);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar categoria',
    });
  }
}

/**
 * DELETE /api/categorias/:id
 * Remove uma categoria
 */
export async function deleteCategoria(req, res) {
  try {
    const { id } = req.params;

    const categoria = await Categoria.findByPk(id, {
      include: [{
        model: Categoria,
        as: 'subcategorias',
      }],
    });

    if (!categoria) {
      return res.status(404).json({
        success: false,
        error: 'Categoria não encontrada',
      });
    }

    // Verifica se tem subcategorias
    if (categoria.subcategorias && categoria.subcategorias.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Não é possível remover categoria com subcategorias',
        message: 'Remova ou mova as subcategorias antes de remover esta categoria',
      });
    }

    await categoria.destroy();

    res.json({
      success: true,
      message: 'Categoria removida com sucesso',
    });
  } catch (error) {
    console.error('Erro ao remover categoria:', error.message);
    res.status(500).json({
      success: false,
      error: 'Erro ao remover categoria',
    });
  }
}

/**
 * GET /api/categorias/arvore
 * Retorna a árvore de categorias
 */
export async function getCategoriasArvore(req, res) {
  try {
    const categorias = await Categoria.findAll({
      where: { ativo: true, categoria_pai_id: null },
      include: [{
        model: Categoria,
        as: 'subcategorias',
        where: { ativo: true },
        required: false,
        attributes: ['id', 'nome', 'slug', 'ativo'],
      }],
      order: [['nome', 'ASC']],
    });

    res.json({
      success: true,
      data: categorias,
    });
  } catch (error) {
    console.error('Erro ao buscar árvore de categorias:', error.message);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar árvore de categorias',
    });
  }
}
