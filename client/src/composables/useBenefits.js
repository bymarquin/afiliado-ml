/**
 * useBenefits - Composable para dados de benefícios
 * Usado em: BenefitsSection
 */

import { Truck, Star, ShieldCheck, Lock } from 'lucide-vue-next'

const benefits = [
  {
    icon: 'truck',
    title: 'Ofertas Atualizadas Todos os Dias',
    description:
      'Monitoramos os parceiros para destacar promoções ativas, boas avaliações e oportunidades reais de economia.'
  },
  {
    icon: 'star',
    title: 'Avaliação 4,8 dos Clientes',
    description: 'Junte-se a mais de 5.000 clientes satisfeitos que amam nossos produtos.'
  },
  {
    icon: 'shield',
    title: 'Curadoria com Transparência',
    description:
      'Selecionamos ofertas com base em relevância, avaliações e custo-benefício, com informações claras antes do clique.'
  },
  {
    icon: 'lock',
    title: 'Pagamentos Seguros',
    description: 'Seus dados são protegidos com segurança de nível empresarial.'
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
