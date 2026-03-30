import { Produto, Categoria, ProductClick } from '../models/index.js';
import { Sequelize } from 'sequelize';

const PRODUCT_STATUS = ['active', 'inactive', 'out_of_stock'];
const STATUS_COMPAT_MAP = {
  ativo: 'active',
  inativo: 'inactive',
  sem_estoque: 'out_of_stock',
  active: 'active',
  inactive: 'inactive',
  out_of_stock: 'out_of_stock',
};

const ALLOWED_ORDER_FIELDS = [
  'id',
  'created_at',
  'updated_at',
  'price',
  'title',
  'click_count',
  'rating',
  'rating_count',
];

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

function normalizeStatus(status) {
  if (status === undefined || status === null) return undefined;
  return STATUS_COMPAT_MAP[String(status).toLowerCase()] ?? null;
}

function parseNumberQuery(value) {
  if (value === undefined || value === null || value === '') return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseDateQuery(value, { endOfDay = false } = {}) {
  if (value === undefined || value === null || value === '') return undefined;

  let parsedDate;
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) {
    const dateWithTime = endOfDay
      ? `${value}T23:59:59.999Z`
      : `${value}T00:00:00.000Z`;
    parsedDate = new Date(dateWithTime);
  } else {
    parsedDate = new Date(value);
  }

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

/**
 * @route GET /api/produtos
 * @description Lista todos os produtos com paginação e filtros
 */
export async function listProdutos(req, res) {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      featured,
      destaque,
      categoria,
      category_id,
      categoria_id,
      search,
      price_min,
      price_max,
      clicks_min,
      clicks_max,
      rating_min,
      rating_max,
      updated_from,
      updated_to,
      order = 'created_at',
      direction = 'DESC',
    } = req.query;

    const pageNumber = parsePositiveInt(page, 1);
    const limitNumber = Math.min(parsePositiveInt(limit, 20), 100);
    const offset = (pageNumber - 1) * limitNumber;
    const { orderField, orderDirection } = normalizeSort(order, direction);
    const where = {};

    const normalizedStatus = normalizeStatus(status);
    if (status !== undefined && normalizedStatus === null) {
      return res.status(400).json({
        success: false,
        error: 'Status inválido',
      });
    }
    if (normalizedStatus) {
      where.status = normalizedStatus;
    }

    const featuredParsed = parseBooleanQuery(featured ?? destaque);
    if ((featured !== undefined || destaque !== undefined) && featuredParsed === null) {
      return res.status(400).json({
        success: false,
        error: 'Filtro featured inválido',
      });
    }
    if (featuredParsed !== undefined && featuredParsed !== null) {
      where.featured = featuredParsed;
    }

    if (search) {
      where.title = { [Sequelize.Op.iLike]: `%${search}%` };
    }

    const parsedPriceMin = parseNumberQuery(price_min);
    const parsedPriceMax = parseNumberQuery(price_max);
    const parsedClicksMin = parseNumberQuery(clicks_min);
    const parsedClicksMax = parseNumberQuery(clicks_max);
    const parsedRatingMin = parseNumberQuery(rating_min);
    const parsedRatingMax = parseNumberQuery(rating_max);
    const parsedUpdatedFrom = parseDateQuery(updated_from);
    const parsedUpdatedTo = parseDateQuery(updated_to, { endOfDay: true });

    const numberQueryValidations = [
      ['price_min', price_min, parsedPriceMin],
      ['price_max', price_max, parsedPriceMax],
      ['clicks_min', clicks_min, parsedClicksMin],
      ['clicks_max', clicks_max, parsedClicksMax],
      ['rating_min', rating_min, parsedRatingMin],
      ['rating_max', rating_max, parsedRatingMax],
    ];

    for (const [label, rawValue, parsedValue] of numberQueryValidations) {
      if (rawValue !== undefined && parsedValue === null) {
        return res.status(400).json({
          success: false,
          error: `Filtro ${label} inválido`,
        });
      }
    }

    if (updated_from !== undefined && parsedUpdatedFrom === null) {
      return res.status(400).json({
        success: false,
        error: 'Filtro updated_from inválido',
      });
    }

    if (updated_to !== undefined && parsedUpdatedTo === null) {
      return res.status(400).json({
        success: false,
        error: 'Filtro updated_to inválido',
      });
    }

    if (
      parsedPriceMin !== undefined &&
      parsedPriceMax !== undefined &&
      parsedPriceMin > parsedPriceMax
    ) {
      return res.status(400).json({
        success: false,
        error: 'price_min não pode ser maior que price_max',
      });
    }

    if (
      parsedClicksMin !== undefined &&
      parsedClicksMax !== undefined &&
      parsedClicksMin > parsedClicksMax
    ) {
      return res.status(400).json({
        success: false,
        error: 'clicks_min não pode ser maior que clicks_max',
      });
    }

    if (
      parsedRatingMin !== undefined &&
      parsedRatingMax !== undefined &&
      parsedRatingMin > parsedRatingMax
    ) {
      return res.status(400).json({
        success: false,
        error: 'rating_min não pode ser maior que rating_max',
      });
    }

    if (
      parsedUpdatedFrom !== undefined &&
      parsedUpdatedTo !== undefined &&
      parsedUpdatedFrom > parsedUpdatedTo
    ) {
      return res.status(400).json({
        success: false,
        error: 'updated_from não pode ser maior que updated_to',
      });
    }

    if (parsedPriceMin !== undefined || parsedPriceMax !== undefined) {
      where.price = {};
      if (parsedPriceMin !== undefined) where.price[Sequelize.Op.gte] = parsedPriceMin;
      if (parsedPriceMax !== undefined) where.price[Sequelize.Op.lte] = parsedPriceMax;
    }

    if (parsedClicksMin !== undefined || parsedClicksMax !== undefined) {
      where.click_count = {};
      if (parsedClicksMin !== undefined) where.click_count[Sequelize.Op.gte] = parsedClicksMin;
      if (parsedClicksMax !== undefined) where.click_count[Sequelize.Op.lte] = parsedClicksMax;
    }

    if (parsedRatingMin !== undefined || parsedRatingMax !== undefined) {
      where.rating = {};
      if (parsedRatingMin !== undefined) where.rating[Sequelize.Op.gte] = parsedRatingMin;
      if (parsedRatingMax !== undefined) where.rating[Sequelize.Op.lte] = parsedRatingMax;
    }

    if (parsedUpdatedFrom !== undefined || parsedUpdatedTo !== undefined) {
      where.updated_at = {};
      if (parsedUpdatedFrom !== undefined) where.updated_at[Sequelize.Op.gte] = parsedUpdatedFrom;
      if (parsedUpdatedTo !== undefined) where.updated_at[Sequelize.Op.lte] = parsedUpdatedTo;
    }

    const categorySlug = categoria;
    const categoryId = category_id ?? categoria_id;

    if (categorySlug || categoryId) {
      const categoryWhere = categorySlug ? { slug: categorySlug } : { id: categoryId };
      const categoryRecord = await Categoria.findOne({ where: categoryWhere });
      if (categoryRecord) {
        const productsIds = await Produto.findAll({
          include: [
            {
              model: Categoria,
              as: 'categories',
              where: { id: categoryRecord.id },
              through: { attributes: [] },
            },
          ],
          attributes: ['id'],
        });
        where.id = { [Sequelize.Op.in]: productsIds.map((p) => p.id) };
      } else {
        where.id = { [Sequelize.Op.in]: [] };
      }
    }

    const { count, rows } = await Produto.findAndCountAll({
      where,
      limit: limitNumber,
      offset,
      order: [[orderField, orderDirection]],
      include: [
        {
          model: Categoria,
          as: 'categories',
          attributes: ['id', 'name', 'slug'],
        },
      ],
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
 * @route GET /api/produtos/:id
 * @description Obtém um produto específico pelo ID
 * @param {number} id - ID do produto
 */
export async function getProduto(req, res) {
  try {
    const { id } = req.params;

    const produto = await Produto.findByPk(id, {
      include: [
        {
          model: Categoria,
          as: 'categories',
          attributes: ['id', 'name', 'slug'],
        },
      ],
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
 * @route GET /api/produtos/:id/clicks
 * @description Retorna apenas a quantidade de cliques do produto
 * @param {number} id - ID do produto
 */
export async function getProdutoClicks(req, res) {
  try {
    const { id } = req.params;

    const produto = await Produto.findByPk(id, {
      attributes: ['id', 'title', 'click_count'],
    });

    if (!produto) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado',
      });
    }

    res.json({
      success: true,
      data: {
        id: produto.id,
        title: produto.title,
        click_count: produto.click_count,
      },
    });
  } catch (error) {
    console.error('Erro ao buscar cliques do produto:', error.message);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar cliques do produto',
    });
  }
}

/**
 * @route GET /api/produtos/:id/go
 * @description Registra clique e redireciona para o Mercado Livre
 * @param {number} id - ID do produto
 */
export async function goToProduto(req, res) {
  try {
    const { id } = req.params;

    const produto = await Produto.findByPk(id, {
      attributes: ['id', 'affiliate_url', 'product_url'],
    });

    if (!produto) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado',
      });
    }

    const targetUrl = produto.affiliate_url || produto.product_url;
    if (!targetUrl) {
      return res.status(400).json({
        success: false,
        error: 'Produto sem URL de destino',
      });
    }

    await Promise.all([
      produto.increment('click_count', { by: 1 }),
      ProductClick.create({ product_id: produto.id }),
    ]);
    return res.redirect(302, targetUrl);
  } catch (error) {
    console.error('Erro ao registrar clique do produto:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Erro ao registrar clique do produto',
    });
  }
}

/**
 * @route GET /api/produtos/mlb/:meli_id
 * @description Obtém um produto pelo ID do Mercado Livre
 * @param {string} meli_id - ID do produto no Mercado Livre
 */
export async function getProdutoByMlbId(req, res) {
  try {
    const meliId = req.params.meli_id ?? req.params.mlb_id;

    const produto = await Produto.findOne({
      where: { meli_id: meliId },
      include: [
        {
          model: Categoria,
          as: 'categories',
          attributes: ['id', 'name', 'slug'],
        },
      ],
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
 * @route POST /api/produtos
 * @description Cria um novo produto
 */
export async function createProduto(req, res) {
  try {
    const meliId = req.body.meli_id ?? req.body.mlb_id;
    const title = req.body.title ?? req.body.titulo;
    const description = req.body.description ?? req.body.descricao;
    const price = req.body.price ?? req.body.preco;
    const originalPrice = req.body.original_price ?? req.body.preco_original;
    const imageUrl = req.body.image_url ?? req.body.imagem_url;
    const productUrl = req.body.product_url ?? req.body.url_produto;
    const affiliateUrl = req.body.affiliate_url ?? req.body.url_afiliado;
    const rating = req.body.rating ?? req.body.avaliacao;
    const ratingCount = req.body.rating_count ?? req.body.avaliacao_qtd;
    const status = normalizeStatus(req.body.status ?? 'active');
    const featured = req.body.featured ?? req.body.destaque ?? false;
    const categoryIds = req.body.category_ids ?? req.body.categoria_ids ?? [];

    if (!meliId || !title || price === undefined || price === null || !productUrl) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios faltando',
        message: 'meli_id, title, price e product_url são obrigatórios',
      });
    }

    const existingProduto = await Produto.findOne({ where: { meli_id: meliId } });
    if (existingProduto) {
      return res.status(409).json({
        success: false,
        error: 'Produto já cadastrado',
        message: 'Já existe um produto com este ID do Mercado Livre',
      });
    }

    if (!status || !PRODUCT_STATUS.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Status inválido',
      });
    }

    if (!Array.isArray(categoryIds)) {
      return res.status(400).json({
        success: false,
        error: 'category_ids inválido',
        message: 'category_ids deve ser um array de IDs',
      });
    }

    let categories = [];
    if (categoryIds.length > 0) {
      categories = await Categoria.findAll({
        where: { id: categoryIds },
      });

      if (categories.length !== categoryIds.length) {
        return res.status(400).json({
          success: false,
          error: 'Categorias inválidas',
          message: 'Uma ou mais categorias informadas não existem',
        });
      }
    }

    const produto = await Produto.create({
      meli_id: meliId,
      title,
      description,
      price,
      original_price: originalPrice,
      image_url: imageUrl,
      product_url: productUrl,
      affiliate_url: affiliateUrl,
      rating,
      rating_count: ratingCount,
      status,
      featured,
    });

    if (categoryIds.length > 0) {
      await produto.addCategories(categories);
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
 * @route PUT /api/produtos/:id
 * @description Atualiza um produto existente
 * @param {number} id - ID do produto
 */
export async function updateProduto(req, res) {
  try {
    const { id } = req.params;
    const title = req.body.title ?? req.body.titulo;
    const description = req.body.description ?? req.body.descricao;
    const price = req.body.price ?? req.body.preco;
    const originalPrice = req.body.original_price ?? req.body.preco_original;
    const imageUrl = req.body.image_url ?? req.body.imagem_url;
    const productUrl = req.body.product_url ?? req.body.url_produto;
    const affiliateUrl = req.body.affiliate_url ?? req.body.url_afiliado;
    const rating = req.body.rating ?? req.body.avaliacao;
    const ratingCount = req.body.rating_count ?? req.body.avaliacao_qtd;
    const normalizedStatus = normalizeStatus(req.body.status);
    const featured = req.body.featured ?? req.body.destaque;
    const categoryIds = req.body.category_ids ?? req.body.categoria_ids;

    if (req.body.status !== undefined && !normalizedStatus) {
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
      title: title ?? produto.title,
      description: description ?? produto.description,
      price: price ?? produto.price,
      original_price: originalPrice ?? produto.original_price,
      image_url: imageUrl ?? produto.image_url,
      product_url: productUrl ?? produto.product_url,
      affiliate_url: affiliateUrl ?? produto.affiliate_url,
      rating: rating ?? produto.rating,
      rating_count: ratingCount ?? produto.rating_count,
      status: normalizedStatus ?? produto.status,
      featured: featured ?? produto.featured,
    });

    if (categoryIds !== undefined) {
      if (!Array.isArray(categoryIds)) {
        return res.status(400).json({
          success: false,
          error: 'category_ids inválido',
          message: 'category_ids deve ser um array de IDs',
        });
      }

      const categories = await Categoria.findAll({
        where: { id: categoryIds },
      });

      if (categories.length !== categoryIds.length) {
        return res.status(400).json({
          success: false,
          error: 'Categorias inválidas',
          message: 'Uma ou mais categorias informadas não existem',
        });
      }

      await produto.setCategories(categories);
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
 * @route DELETE /api/produtos/:id
 * @description Remove um produto
 * @param {number} id - ID do produto
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
 * @route GET /api/produtos/destaque
 * @description Lista produtos em destaque
 */
export async function getProdutosDestaque(req, res) {
  try {
    const { limit = 10 } = req.query;
    const limitNumber = Math.min(parsePositiveInt(limit, 10), 100);

    const produtos = await Produto.findAll({
      where: { featured: true, status: 'active' },
      limit: limitNumber,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: Categoria,
          as: 'categories',
          attributes: ['id', 'name', 'slug'],
        },
      ],
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
 * @route GET /api/produtos/random
 * @description Lista produtos aleatórios
 */
export async function getProdutosRandom(req, res) {
  try {
    const { limit = 10, status = 'active' } = req.query;
    const limitNumber = Math.min(parsePositiveInt(limit, 10), 100);
    const normalizedStatus = normalizeStatus(status);

    if (!normalizedStatus || !PRODUCT_STATUS.includes(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        error: 'Status inválido',
      });
    }

    const produtos = await Produto.findAll({
      where: { status: normalizedStatus },
      limit: limitNumber,
      order: Sequelize.literal('RANDOM()'),
      include: [
        {
          model: Categoria,
          as: 'categories',
          attributes: ['id', 'name', 'slug'],
        },
      ],
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
