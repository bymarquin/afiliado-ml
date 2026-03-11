import { Produto } from '../models/index.js';
import { Categoria } from '../models/index.js';
import { Sequelize } from 'sequelize';

const PRODUCT_STATUS = ['ativo', 'inativo', 'sem_estoque'];
const ALLOWED_ORDER_FIELDS = ['id', 'created_at', 'updated_at', 'preco', 'titulo', 'avaliacao', 'avaliacao_qtd'];

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
  return null;
}

/**
 * Controller para gerenciar Produtos
 */

/**
 * GET /api/produtos
 * Lista todos os produtos com paginação e filtros
 */
export async function listProdutos(req, res) {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      destaque,
      categoria,
      search,
      order = 'created_at',
      direction = 'DESC',
    } = req.query;

    const pageNumber = parsePositiveInt(page, 1);
    const limitNumber = Math.min(parsePositiveInt(limit, 20), 100);
    const offset = (pageNumber - 1) * limitNumber;
    const { orderField, orderDirection } = normalizeSort(order, direction);
    const where = {};

    // Filtros
    if (status) {
      if (!PRODUCT_STATUS.includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Status inválido',
        });
      }
      where.status = status;
    }

    const destaqueParsed = parseBooleanQuery(destaque);
    if (destaque !== undefined && destaqueParsed === null) {
      return res.status(400).json({
        success: false,
        error: 'Filtro destaque inválido',
      });
    }

    if (destaqueParsed !== undefined && destaqueParsed !== null) {
      where.destaque = destaqueParsed;
    }

    if (search) {
      where.titulo = { [Sequelize.Op.iLike]: `%${search}%` };
    }

    if (categoria) {
      const categoriaRecord = await Categoria.findOne({ where: { slug: categoria } });
      if (categoriaRecord) {
        const produtosIds = await Produto.findAll({
          include: [{
            model: Categoria,
            where: { id: categoriaRecord.id },
            through: { attributes: [] },
          }],
          attributes: ['id'],
        });
        where.id = { [Sequelize.Op.in]: produtosIds.map(p => p.id) };
      } else {
        where.id = { [Sequelize.Op.in]: [] };
      }
    }

    const { count, rows } = await Produto.findAndCountAll({
      where,
      limit: limitNumber,
      offset,
      order: [[orderField, orderDirection]],
      include: [{
        model: Categoria,
        as: 'categorias',
        attributes: ['id', 'nome', 'slug'],
      }],
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
    console.error('Erro ao listar produtos:', error.message);
    res.status(500).json({
      success: false,
      error: 'Erro ao listar produtos',
    });
  }
}

/**
 * GET /api/produtos/:id
 * Obtém um produto específico pelo ID
 */
export async function getProduto(req, res) {
  try {
    const { id } = req.params;

    const produto = await Produto.findByPk(id, {
      include: [{
        model: Categoria,
        as: 'categorias',
        attributes: ['id', 'nome', 'slug'],
      }],
    });

    if (!produto) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado',
      });
    }

    res.json({
      success: true,
      data: produto,
    });
  } catch (error) {
    console.error('Erro ao buscar produto:', error.message);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar produto',
    });
  }
}

/**
 * GET /api/produtos/mlb/:mlb_id
 * Obtém um produto pelo ID do Mercado Livre
 */
export async function getProdutoByMlbId(req, res) {
  try {
    const { mlb_id } = req.params;

    const produto = await Produto.findOne({
      where: { mlb_id },
      include: [{
        model: Categoria,
        as: 'categorias',
        attributes: ['id', 'nome', 'slug'],
      }],
    });

    if (!produto) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado',
      });
    }

    res.json({
      success: true,
      data: produto,
    });
  } catch (error) {
    console.error('Erro ao buscar produto:', error.message);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar produto',
    });
  }
}

/**
 * POST /api/produtos
 * Cria um novo produto
 */
export async function createProduto(req, res) {
  try {
    const {
      mlb_id,
      titulo,
      descricao,
      preco,
      preco_original,
      imagem_url,
      url_produto,
      url_afiliado,
      avaliacao,
      avaliacao_qtd,
      status = 'ativo',
      destaque = false,
      categoria_ids = [],
    } = req.body;

    // Validações
    if (!mlb_id || !titulo || preco === undefined || preco === null || !url_produto) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios faltando',
        message: 'mlb_id, titulo, preco e url_produto são obrigatórios',
      });
    }

    // Verifica se já existe produto com este mlb_id
    const existingProduto = await Produto.findOne({ where: { mlb_id } });
    if (existingProduto) {
      return res.status(409).json({
        success: false,
        error: 'Produto já cadastrado',
        message: 'Já existe um produto com este ID do Mercado Livre',
      });
    }

    if (!PRODUCT_STATUS.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Status inválido',
      });
    }

    if (!Array.isArray(categoria_ids)) {
      return res.status(400).json({
        success: false,
        error: 'categoria_ids inválido',
        message: 'categoria_ids deve ser um array de IDs',
      });
    }

    let categorias = [];
    if (categoria_ids.length > 0) {
      categorias = await Categoria.findAll({
        where: { id: categoria_ids },
      });

      if (categorias.length !== categoria_ids.length) {
        return res.status(400).json({
          success: false,
          error: 'Categorias inválidas',
          message: 'Uma ou mais categorias informadas não existem',
        });
      }
    }

    const produto = await Produto.create({
      mlb_id,
      titulo,
      descricao,
      preco,
      preco_original,
      imagem_url,
      url_produto,
      url_afiliado,
      avaliacao,
      avaliacao_qtd,
      status,
      destaque,
    });

    // Associa categorias se fornecidas
    if (categoria_ids.length > 0) {
      await produto.addCategorias(categorias);
    }

    res.status(201).json({
      success: true,
      data: produto,
    });
  } catch (error) {
    console.error('Erro ao criar produto:', error.message);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar produto',
    });
  }
}

/**
 * PUT /api/produtos/:id
 * Atualiza um produto existente
 */
export async function updateProduto(req, res) {
  try {
    const { id } = req.params;
    const {
      titulo,
      descricao,
      preco,
      preco_original,
      imagem_url,
      url_produto,
      url_afiliado,
      avaliacao,
      avaliacao_qtd,
      status,
      destaque,
      categoria_ids,
    } = req.body;

    if (status !== undefined && !PRODUCT_STATUS.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Status inválido',
      });
    }

    const produto = await Produto.findByPk(id);

    if (!produto) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado',
      });
    }

    await produto.update({
      titulo: titulo ?? produto.titulo,
      descricao: descricao ?? produto.descricao,
      preco: preco ?? produto.preco,
      preco_original: preco_original ?? produto.preco_original,
      imagem_url: imagem_url ?? produto.imagem_url,
      url_produto: url_produto ?? produto.url_produto,
      url_afiliado: url_afiliado ?? produto.url_afiliado,
      avaliacao: avaliacao ?? produto.avaliacao,
      avaliacao_qtd: avaliacao_qtd ?? produto.avaliacao_qtd,
      status: status ?? produto.status,
      destaque: destaque ?? produto.destaque,
    });

    // Atualiza categorias se fornecidas
    if (categoria_ids !== undefined) {
      if (!Array.isArray(categoria_ids)) {
        return res.status(400).json({
          success: false,
          error: 'categoria_ids inválido',
          message: 'categoria_ids deve ser um array de IDs',
        });
      }

      const categorias = await Categoria.findAll({
        where: { id: categoria_ids },
      });

      if (categorias.length !== categoria_ids.length) {
        return res.status(400).json({
          success: false,
          error: 'Categorias inválidas',
          message: 'Uma ou mais categorias informadas não existem',
        });
      }

      await produto.setCategorias(categorias);
    }

    res.json({
      success: true,
      data: produto,
    });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error.message);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar produto',
    });
  }
}

/**
 * DELETE /api/produtos/:id
 * Remove um produto
 */
export async function deleteProduto(req, res) {
  try {
    const { id } = req.params;

    const produto = await Produto.findByPk(id);

    if (!produto) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado',
      });
    }

    await produto.destroy();

    res.json({
      success: true,
      message: 'Produto removido com sucesso',
    });
  } catch (error) {
    console.error('Erro ao remover produto:', error.message);
    res.status(500).json({
      success: false,
      error: 'Erro ao remover produto',
    });
  }
}

/**
 * GET /api/produtos/destaque
 * Lista produtos em destaque
 */
export async function getProdutosDestaque(req, res) {
  try {
    const { limit = 10 } = req.query;
    const limitNumber = Math.min(parsePositiveInt(limit, 10), 100);

    const produtos = await Produto.findAll({
      where: { destaque: true, status: 'ativo' },
      limit: limitNumber,
      order: [['created_at', 'DESC']],
      include: [{
        model: Categoria,
        as: 'categorias',
        attributes: ['id', 'nome', 'slug'],
      }],
    });

    res.json({
      success: true,
      data: produtos,
    });
  } catch (error) {
    console.error('Erro ao buscar produtos em destaque:', error.message);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar produtos em destaque',
    });
  }
}

/**
 * GET /api/produtos/random
 * Lista produtos aleatórios
 */
export async function getProdutosRandom(req, res) {
  try {
    const { limit = 10, status = 'ativo' } = req.query;
    const limitNumber = Math.min(parsePositiveInt(limit, 10), 100);

    if (!PRODUCT_STATUS.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Status inválido',
      });
    }

    const produtos = await Produto.findAll({
      where: { status },
      limit: limitNumber,
      order: Sequelize.literal('RANDOM()'),
      include: [{
        model: Categoria,
        as: 'categorias',
        attributes: ['id', 'nome', 'slug'],
      }],
    });

    res.json({
      success: true,
      data: produtos,
    });
  } catch (error) {
    console.error('Erro ao buscar produtos aleatórios:', error.message);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar produtos aleatórios',
    });
  }
}
