import { Categoria } from '../models/index.js';
import { Sequelize } from 'sequelize';

/**
 * O que faz: Converte um valor textual/booleano de query para boolean real.
 * Como faz: Aceita `true`, `false`, `'true'` e `'false'`; demais valores viram `undefined`.
 * Para que serve: Padronizar filtros booleanos sem quebrar quando o cliente envia texto.
 */
function parseBooleanQuery(value) {
  if (value === undefined) return undefined;
  if (typeof value === 'boolean') return value;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
}

/**
 * O que faz: Converte um valor de query para inteiro aceitando `null` explícito.
 * Como faz: Retorna `undefined` quando não veio valor, `null` quando veio `null/'null'`,
 * e número inteiro quando o parse é válido.
 * Para que serve: Permitir filtros como categoria pai específica ou categoria raiz (`null`).
 */
function parseNullableInt(value) {
  if (value === undefined) return undefined;
  if (value === null || value === 'null') return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
}

/**
 * O que faz: Normaliza texto em formato de slug URL-friendly.
 * Como faz: Remove acentos, converte para minúsculo e troca separadores por hífen.
 * Para que serve: Gerar slug consistente para URLs públicas das categorias.
 */
function toSlug(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

/**
 * O que faz: Gera um slug único para categoria.
 * Como faz: Verifica existência no banco e incrementa sufixo numérico quando necessário.
 * Para que serve: Evitar conflito de slug em criação/edição com geração automática.
 */
async function generateUniqueSlug(baseSlug, excludeCategoryId) {
  let candidate = baseSlug || 'category';
  let counter = 2;

  while (true) {
    const where = excludeCategoryId
      ? { slug: candidate, id: { [Sequelize.Op.ne]: excludeCategoryId } }
      : { slug: candidate };

    const exists = await Categoria.findOne({
      where,
      attributes: ['id'],
    });

    if (!exists) {
      return candidate;
    }

    candidate = `${baseSlug}-${counter}`;
    counter += 1;
  }
}

/**
 * O que faz: Valida se atribuir um novo pai criaria ciclo na árvore de categorias.
 * Como faz: Sobe pela cadeia de pais a partir do novo pai e detecta referência ao próprio nó.
 * Para que serve: Impedir ciclos indiretos como A -> B -> A.
 */
async function wouldCreateCycle(categoryId, newParentCategoryId) {
  if (newParentCategoryId === null || newParentCategoryId === undefined) return false;

  const visited = new Set();
  let currentParentId = newParentCategoryId;

  while (currentParentId !== null && currentParentId !== undefined) {
    if (currentParentId === categoryId) {
      return true;
    }

    if (visited.has(currentParentId)) {
      return true;
    }
    visited.add(currentParentId);

    const parent = await Categoria.findByPk(currentParentId, {
      attributes: ['id', 'parent_category_id'],
    });

    if (!parent) {
      return false;
    }

    currentParentId = parent.parent_category_id;
  }

  return false;
}

/**
 * O que faz: Constrói árvore recursiva de categorias.
 * Como faz: Indexa categorias por `parent_category_id` e monta nós em profundidade.
 * Para que serve: Retornar estrutura completa de navegação em uma única resposta.
 */
function buildCategoryTree(categories) {
  const byParent = new Map();

  for (const category of categories) {
    const parentId = category.parent_category_id ?? null;
    if (!byParent.has(parentId)) byParent.set(parentId, []);
    byParent.get(parentId).push(category);
  }

  const buildNode = (category, visiting) => {
    if (visiting.has(category.id)) {
      return { ...category, subcategories: [] };
    }

    const nextVisiting = new Set(visiting);
    nextVisiting.add(category.id);

    const children = (byParent.get(category.id) ?? []).map((child) =>
      buildNode(child, nextVisiting)
    );

    return { ...category, subcategories: children };
  };

  const roots = byParent.get(null) ?? [];
  return roots.map((root) => buildNode(root, new Set()));
}

/**
 * @route GET /api/categorias
 * @description Lista categorias com filtros opcionais
 * O que faz: Retorna categorias podendo filtrar por ativo e categoria pai.
 * Como faz: Monta `where` dinâmico e inclui subcategorias ativas.
 * Para que serve: Alimentar listagens de catálogo e navegação hierárquica.
 */
export async function listCategorias(req, res) {
  try {
    const activeFilter = parseBooleanQuery(req.query.is_active ?? req.query.ativo);
    const parentCategoryFilter = parseNullableInt(
      req.query.parent_category_id ?? req.query.categoria_pai_id ?? req.query.pai
    );

    const where = {};

    if (activeFilter !== undefined) {
      where.is_active = activeFilter;
    }

    if (parentCategoryFilter !== undefined) {
      where.parent_category_id = parentCategoryFilter;
    }

    const categorias = await Categoria.findAll({
      where,
      include: [
        {
          model: Categoria,
          as: 'subcategories',
          where: { is_active: true },
          required: false,
          attributes: ['id', 'name', 'slug'],
        },
      ],
      order: [['name', 'ASC']],
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
 * @route GET /api/categorias/:id
 * @description Obtém uma categoria específica
 * @param {number} id - ID da categoria
 * O que faz: Busca uma categoria por ID.
 * Como faz: Consulta por PK e inclui categoria pai e subcategorias.
 * Para que serve: Exibir detalhes completos da categoria no admin ou API pública.
 */
export async function getCategoria(req, res) {
  try {
    const { id } = req.params;

    const categoria = await Categoria.findByPk(id, {
      include: [
        {
          model: Categoria,
          as: 'parentCategory',
          attributes: ['id', 'name', 'slug'],
        },
        {
          model: Categoria,
          as: 'subcategories',
          attributes: ['id', 'name', 'slug'],
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
 * @route GET /api/categorias/slug/:slug
 * @description Obtém uma categoria pelo slug
 * @param {string} slug - Slug da categoria
 * O que faz: Busca categoria por slug público.
 * Como faz: Query por `slug` com include de pai e filhos ativos.
 * Para que serve: Resolver categoria por URL amigável no frontend.
 */
export async function getCategoriaBySlug(req, res) {
  try {
    const { slug } = req.params;

    const categoria = await Categoria.findOne({
      where: { slug },
      include: [
        {
          model: Categoria,
          as: 'parentCategory',
          attributes: ['id', 'name', 'slug'],
        },
        {
          model: Categoria,
          as: 'subcategories',
          where: { is_active: true },
          required: false,
          attributes: ['id', 'name', 'slug'],
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
 * @route POST /api/categorias
 * @description Cria uma nova categoria
 * O que faz: Cria registro de categoria no banco.
 * Como faz: Valida campos obrigatórios, conflito de name/slug e existência de categoria pai.
 * Para que serve: Permitir cadastro de categorias no painel admin.
 */
export async function createCategoria(req, res) {
  try {
    const name = req.body.name ?? req.body.nome;
    const slugInput = req.body.slug;
    const parentCategoryId = parseNullableInt(
      req.body.parent_category_id ?? req.body.categoria_pai_id
    );
    const isActive = req.body.is_active ?? req.body.ativo ?? true;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios faltando',
        message: 'name é obrigatório',
      });
    }

    const normalizedProvidedSlug = slugInput ? toSlug(slugInput) : null;
    const generatedSlug = toSlug(name);
    const slug = normalizedProvidedSlug || (await generateUniqueSlug(generatedSlug, null));

    const existingByName = await Categoria.findOne({
      where: { name },
      attributes: ['id'],
    });

    if (existingByName) {
      return res.status(409).json({
        success: false,
        error: 'Categoria já cadastrada',
        message: 'Já existe uma categoria com este name',
      });
    }

    if (normalizedProvidedSlug) {
      const existingBySlug = await Categoria.findOne({
        where: { slug: normalizedProvidedSlug },
        attributes: ['id'],
      });
      if (existingBySlug) {
        return res.status(409).json({
          success: false,
          error: 'Categoria já cadastrada',
          message: 'Já existe uma categoria com este slug',
        });
      }
    }

    if (parentCategoryId) {
      const parentCategory = await Categoria.findByPk(parentCategoryId);
      if (!parentCategory) {
        return res.status(400).json({
          success: false,
          error: 'Categoria pai não encontrada',
          message: 'A categoria pai informada não existe',
        });
      }
    }

    const categoria = await Categoria.create({
      name,
      slug,
      parent_category_id: parentCategoryId,
      is_active: isActive,
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
 * @route PUT /api/categorias/:id
 * @description Atualiza uma categoria existente
 * @param {number} id - ID da categoria
 * O que faz: Atualiza dados de uma categoria existente.
 * Como faz: Valida existência, conflitos de name/slug e consistência da categoria pai.
 * Para que serve: Editar estrutura e status das categorias no admin.
 */
export async function updateCategoria(req, res) {
  try {
    const { id } = req.params;
    const categoryId = Number.parseInt(id, 10);
    const name = req.body.name ?? req.body.nome;
    const hasSlugInput = req.body.slug !== undefined;
    const slugInput = req.body.slug;
    const parentCategoryId = parseNullableInt(
      req.body.parent_category_id ?? req.body.categoria_pai_id
    );
    const isActive = req.body.is_active ?? req.body.ativo;

    const categoria = await Categoria.findByPk(id);

    if (!categoria) {
      return res.status(404).json({
        success: false,
        error: 'Categoria não encontrada',
      });
    }

    if (name) {
      const existingByName = await Categoria.findOne({
        where: { name, id: { [Sequelize.Op.ne]: id } },
        attributes: ['id'],
      });
      if (existingByName) {
        return res.status(409).json({
          success: false,
          error: 'Conflito de categoria',
          message: 'Já existe uma categoria com este name',
        });
      }
    }

    let nextSlug = categoria.slug;
    if (hasSlugInput) {
      nextSlug = toSlug(slugInput);
      if (!nextSlug) {
        return res.status(400).json({
          success: false,
          error: 'Slug inválido',
          message: 'Não foi possível gerar slug a partir do valor informado',
        });
      }
      const existingBySlug = await Categoria.findOne({
        where: { slug: nextSlug, id: { [Sequelize.Op.ne]: id } },
        attributes: ['id'],
      });
      if (existingBySlug) {
        return res.status(409).json({
          success: false,
          error: 'Conflito de categoria',
          message: 'Já existe uma categoria com este slug',
        });
      }
    } else if (name && name !== categoria.name) {
      nextSlug = await generateUniqueSlug(toSlug(name), categoryId);
    }

    if (parentCategoryId !== undefined) {
      if (parentCategoryId === categoryId) {
        return res.status(400).json({
          success: false,
          error: 'Categoria pai inválida',
          message: 'Uma categoria não pode ser sua própria categoria pai',
        });
      }

      if (parentCategoryId !== null) {
        const parentCategory = await Categoria.findByPk(parentCategoryId);
        if (!parentCategory) {
          return res.status(400).json({
            success: false,
            error: 'Categoria pai não encontrada',
            message: 'A categoria pai informada não existe',
          });
        }

        const hasCycle = await wouldCreateCycle(categoryId, parentCategoryId);
        if (hasCycle) {
          return res.status(400).json({
            success: false,
            error: 'Categoria pai inválida',
            message: 'Esta relação criaria um ciclo na hierarquia de categorias',
          });
        }
      }
    }

    await categoria.update({
      name: name ?? categoria.name,
      slug: nextSlug,
      parent_category_id:
        parentCategoryId !== undefined ? parentCategoryId : categoria.parent_category_id,
      is_active: isActive ?? categoria.is_active,
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
 * @route DELETE /api/categorias/:id
 * @description Remove uma categoria
 * @param {number} id - ID da categoria
 * O que faz: Remove uma categoria do banco.
 * Como faz: Verifica existência e bloqueia remoção quando existem subcategorias vinculadas.
 * Para que serve: Garantir integridade da hierarquia antes de exclusões.
 */
export async function deleteCategoria(req, res) {
  try {
    const { id } = req.params;

    const categoria = await Categoria.findByPk(id, {
      include: [
        {
          model: Categoria,
          as: 'subcategories',
        },
      ],
    });

    if (!categoria) {
      return res.status(404).json({
        success: false,
        error: 'Categoria não encontrada',
      });
    }

    if (categoria.subcategories && categoria.subcategories.length > 0) {
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
 * @route GET /api/categorias/arvore
 * @description Retorna a árvore de categorias
 * O que faz: Retorna categorias raiz com suas subcategorias ativas.
 * Como faz: Busca por `parent_category_id: null` e inclui filhos com filtro de ativo.
 * Para que serve: Construir menu/árvore de navegação de catálogo.
 */
export async function getCategoriasArvore(req, res) {
  try {
    const categories = await Categoria.findAll({
      where: { is_active: true },
      attributes: ['id', 'name', 'slug', 'is_active', 'parent_category_id'],
      order: [['name', 'ASC']],
    });

    const categorias = buildCategoryTree(categories.map((category) => category.toJSON()));

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
