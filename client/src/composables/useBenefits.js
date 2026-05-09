/**
 * useBenefits - Composable para dados de beneficios
 * Usado em: BenefitsSection
 */

import { Truck, Star, ShieldCheck, Lock } from 'lucide-vue-next'

const benefits = [
  {
    icon: 'truck',
    title: 'Frete Gratis e Devolucoes',
    description: 'Frete gratis em compras acima de R$ 200. Devolucao facil em ate 30 dias.'
  },
  {
    icon: 'star',
    title: 'Avaliacao 4.8 dos Clientes',
    description: 'Junte-se a mais de 5.000 clientes satisfeitos que amam nossos produtos.'
  },
  {
    icon: 'shield',
    title: 'Curadoria com Transparencia',
    description: 'Selecionamos ofertas com base em relevancia, avaliacoes e custo-beneficio, com informacoes claras antes do clique.'
  },
  {
    icon: 'lock',
    title: 'Pagamentos Seguros',
    description: 'Seus dados sao protegidos com seguranca de nivel empresarial.'
  }
]

const iconComponents = {
  truck: Truck,
  star: Star,
  shield: ShieldCheck,
  lock: Lock
}

export function useBenefits() {
  return {
    benefits,
    iconComponents
  }
}
