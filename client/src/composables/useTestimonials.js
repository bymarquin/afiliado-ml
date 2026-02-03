/**
 * useTestimonials - Composable para dados de depoimentos
 * Usado em: TestimonialsSection
 */

import { computed } from 'vue'

const testimonials = [
    {
        id: 1,
        text: 'Absolutely love the quality! The product exceeded my expectations and the customer service was outstanding.',
        author: 'Sarah Johnson',
        role: 'Designer',
        avatar: 'https://i.pravatar.cc/100?img=32',
        rating: 5
    },
    {
        id: 2,
        text: 'Fast shipping and the product looks exactly like the photos. Will definitely be ordering again soon!',
        author: 'Michael Chen',
        role: 'Developer',
        avatar: 'https://i.pravatar.cc/100?img=11',
        rating: 5
    },
    {
        id: 3,
        text: "Best purchase I've made this year. The attention to detail is incredible and worth every penny.",
        author: 'Emily Davis',
        role: 'Marketing Manager',
        avatar: 'https://i.pravatar.cc/100?img=5',
        rating: 5
    },
    {
        id: 4,
        text: 'I was skeptical at first, but this product has completely changed my daily routine. Highly recommend!',
        author: 'James Wilson',
        role: 'Entrepreneur',
        avatar: 'https://i.pravatar.cc/100?img=12',
        rating: 5
    },
    {
        id: 5,
        text: 'The premium quality really shows. My friends keep asking where I got it from. Great value for money.',
        author: 'Amanda Roberts',
        role: 'Content Creator',
        avatar: 'https://i.pravatar.cc/100?img=45',
        rating: 5
    },
    {
        id: 6,
        text: 'Customer support went above and beyond to help me. The product arrived perfectly packaged.',
        author: 'David Thompson',
        role: 'Product Manager',
        avatar: 'https://i.pravatar.cc/100?img=15',
        rating: 5
    }
]

export function useTestimonials() {
    // Triplicado para efeito marquee infinito
    const infiniteList = computed(() => [
        ...testimonials,
        ...testimonials,
        ...testimonials
    ])

    return {
        testimonials,
        infiniteList
    }
}
