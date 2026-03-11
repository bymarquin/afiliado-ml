/**
 * useStarRating - Composable para calcular estrelas visuais a partir do rate
 *
 * Lógica de arredondamento:
 *   - fração < 0.25  → arredonda para baixo (só estrelas cheias)
 *   - fração >= 0.25 e < 0.75 → meia-estrela
 *   - fração >= 0.75 → arredonda para cima (estrela cheia extra)
 *
 * Exemplos:
 *   rate 4.8 → 5 full, 0 half, 0 empty  (0.8 >= 0.75 → arredonda pra cima)
 *   rate 4.5 → 4 full, 1 half, 0 empty  (0.5 >= 0.25 e < 0.75)
 *   rate 4.2 → 4 full, 0 half, 1 empty  (0.2 < 0.25 → arredonda pra baixo)
 *   rate 3.0 → 3 full, 0 half, 2 empty
 *   rate 0.0 → 0 full, 0 half, 5 empty
 */

const MAX_STARS = 5

/**
 * Calcula a distribuição de estrelas (cheias, meia, vazias)
 * @param {number} rate - Nota de avaliação (0 a 5)
 * @returns {{ fullStars: number, hasHalfStar: boolean, emptyStars: number }}
 */
function getStarDistribution(rate) {
    // Programação defensiva: garante um número válido entre 0 e MAX_STARS
    const safeRate = Math.min(Math.max(Number(rate) || 0, 0), MAX_STARS)

    const integerPart = Math.floor(safeRate)
    const fraction = safeRate - integerPart

    let fullStars = integerPart
    let hasHalfStar = false

    if (fraction >= 0.75) {
        // Fração alta → arredonda para estrela cheia
        fullStars = Math.min(fullStars + 1, MAX_STARS)
    } else if (fraction >= 0.25) {
        // Fração média → meia-estrela
        hasHalfStar = true
    }
    // Fração < 0.25 → ignora (fica só com as cheias)

    const emptyStars = MAX_STARS - fullStars - (hasHalfStar ? 1 : 0)

    return {
        fullStars,
        hasHalfStar,
        emptyStars
    }
}

export function useStarRating() {
    return {
        getStarDistribution,
        MAX_STARS
    }
}
