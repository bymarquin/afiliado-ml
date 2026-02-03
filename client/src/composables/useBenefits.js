/**
 * useBenefits - Composable para dados de benefícios
 * Usado em: BenefitsSection
 */

import { Truck, Star, ShieldCheck, Lock } from 'lucide-vue-next'

const benefits = [
    {
        icon: 'truck',
        title: 'Free shipping & returns',
        description: 'Orders over $50 ship free. Easy 30-day returns on all items.'
    },
    {
        icon: 'star',
        title: 'Customers rate us 4.8',
        description: 'Join 5,000+ happy customers who love our products.'
    },
    {
        icon: 'shield',
        title: '30 Day money back',
        description: 'Not satisfied? Get a full refund, no questions asked.'
    },
    {
        icon: 'lock',
        title: 'Secure payments',
        description: 'Your data is protected with enterprise-grade security.'
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
