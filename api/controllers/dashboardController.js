import { sequelize } from '../models/index.js';
import { QueryTypes } from 'sequelize';

const DAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

/**
 * Formata uma data local como YYYY-MM-DD (sem depender de UTC/ISO).
 */
function toLocalDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Gera um array com os últimos 7 dias, do mais antigo ao mais recente.
 */
function getLast7Days() {
  const days = [];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = toLocalDateStr(date);
    const dayName = DAY_NAMES[date.getDay()];
    days.push({ date: dateStr, day: dayName, clicks: 0 });
  }

  return days;
}

/**
 * @route GET /api/dashboard/clicks
 * @description Retorna total de cliques agrupados por dia (últimos 7 dias)
 */
export async function getClicksByDay(req, res) {
  try {
    const days = getLast7Days();
    const startDate = days[0].date;

    // Usa timezone local do servidor (America/Sao_Paulo) para agrupar por dia corretamente
    const results = await sequelize.query(
      `SELECT (clicked_at AT TIME ZONE 'America/Sao_Paulo')::date::text AS click_date,
              COUNT(*)::int AS total
       FROM product_clicks
       WHERE clicked_at >= :startDate::date
       GROUP BY click_date
       ORDER BY click_date ASC`,
      {
        replacements: { startDate },
        type: QueryTypes.SELECT,
      }
    );

    // Mescla resultados da query com os 7 dias (preenche zeros)
    const clickMap = {};
    for (const row of results) {
      clickMap[row.click_date] = row.total;
    }

    let totalClicks = 0;
    for (const day of days) {
      day.clicks = clickMap[day.date] || 0;
      totalClicks += day.clicks;
    }

    res.json({
      success: true,
      data: days,
      totalClicks,
    });
  } catch (error) {
    console.error('Erro ao buscar cliques por dia:', error.message);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar cliques por dia',
    });
  }
}
