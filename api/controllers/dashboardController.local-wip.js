import { Produto, Categoria } from '../models/index.js';
import { fn, col, Op } from 'sequelize';

function getPeriodFilter(period) {
  if (!period || period === 'todo-periodo') return {};
  
  const now = new Date();
  let startDate;

  switch (period) {
    case 'hoje':
      startDate = new Date(now.setHours(0, 0, 0, 0));
      break;
    case 'este-mes':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'ultimos-30':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case 'ultimos-90':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    default:
      return {};
  }

  return {
    createdAt: {
      [Op.gte]: startDate
    }
  };
}

export async function getDashboardStats(req, res) {
  try {
    const { period } = req.query;
    const filter = getPeriodFilter(period);

    // Total de produtos
    const totalProducts = await Produto.count({ where: filter });

    // Total de categorias
    const totalCategories = await Categoria.count({ where: filter });

    // Total de cliques (soma do click_count de todos os produtos)
    const totalClicksResult = await Produto.findOne({
      where: filter,
      attributes: [
        [fn('SUM', col('click_count')), 'totalClicks']
      ],
      raw: true
    });
    const totalClicks = parseInt(totalClicksResult?.totalClicks || 0, 10);

    // Produtos mais clicados
    const topProducts = await Produto.findAll({
      where: filter,
      order: [['click_count', 'DESC']],
      limit: 5,
      attributes: ['id', 'title', 'price', 'image_url', 'click_count', 'rating'],
      include: [
        {
          model: Categoria,
          as: 'categories',
          attributes: ['id', 'name'],
          through: { attributes: [] }
        }
      ]
    });

    // Últimas atividades (Baseado em createdAt e updatedAt)
    const recentProducts = await Produto.findAll({
      order: [['updatedAt', 'DESC']],
      limit: 5,
      attributes: ['id', 'title', 'createdAt', 'updatedAt']
    });

    const recentCategories = await Categoria.findAll({
      order: [['updatedAt', 'DESC']],
      limit: 5,
      attributes: ['id', 'name', 'createdAt', 'updatedAt']
    });

    // Mesclar as atividades e ordenar pelas mais recentes
    let recentActivity = [];
    
    recentProducts.forEach(p => {
      const isNew = Math.abs(new Date(p.updatedAt).getTime() - new Date(p.createdAt).getTime()) < 1000;
      recentActivity.push({
        id: `p-${p.id}`,
        action: isNew ? 'Produto cadastrado' : 'Produto editado',
        item: p.title,
        time: p.updatedAt
      });
    });

    recentCategories.forEach(c => {
      const isNew = Math.abs(new Date(c.updatedAt).getTime() - new Date(c.createdAt).getTime()) < 1000;
      recentActivity.push({
        id: `c-${c.id}`,
        action: isNew ? 'Categoria criada' : 'Categoria editada',
        item: c.name,
        time: c.updatedAt
      });
    });

    recentActivity.sort((a, b) => b.time - a.time);
    recentActivity = recentActivity.slice(0, 5);

    // Como não temos tabela de histórico de cliques por dia, o gráfico será nulo ou fake
    // Opcionalmente podemos retornar vazio, e o frontend lida com isso.
    const chartData = [
      { day: 'Seg', clicks: 0 },
      { day: 'Ter', clicks: 0 },
      { day: 'Qua', clicks: 0 },
      { day: 'Qui', clicks: 0 },
      { day: 'Sex', clicks: 0 },
      { day: 'Sáb', clicks: 0 },
      { day: 'Dom', clicks: 0 },
    ];

    res.json({
      success: true,
      data: {
        kpis: {
          products: totalProducts,
          categories: totalCategories,
          clicks: totalClicks
        },
        topProducts,
        recentActivity,
        chartData // mock vazio já que não há dados históricos no banco
      }
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas do dashboard:', error);
    res.status(500).json({ success: false, error: 'Erro ao buscar estatísticas do dashboard.' });
  }
}
