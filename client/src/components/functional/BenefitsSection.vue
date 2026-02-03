<script setup>
import { onMounted } from 'vue'
import BaseContainer from '@/components/ui/BaseContainer.vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const benefits = [
    {
        icon: 'truck',
        title: 'Free shipping & returns',
        description: 'Lorem ipsum dolor sit amet, consect adipiscing elit.'
    },
    {
        icon: 'star',
        title: 'Customers rate us 4.8',
        description: 'Lorem ipsum dolor sit amet, consect adipiscing elit.'
    },
    {
        icon: 'shield',
        title: '30 Day money back',
        description: 'Lorem ipsum dolor sit amet, consect adipiscing elit.'
    },
    {
        icon: 'lock',
        title: 'Secure payments',
        description: 'Lorem ipsum dolor sit amet, consect adipiscing elit.'
    }
]

onMounted(() => {
    gsap.from('.benefit-card', {
        scrollTrigger: {
            trigger: '.benefits-grid',
            start: 'top 80%',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out'
    })
})
</script>

<template>
    <section class="py-16 md:py-24 bg-white">
        <BaseContainer>
            <h2 class="text-2xl md:text-3xl font-bold text-[#0F1113] text-center mb-16 tracking-tight">
                Benefits of shopping with us
            </h2>

            <!-- Figma-aligned Grid: 4 columns, centered content -->
            <div class="benefits-grid grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8">
                <div v-for="benefit in benefits" :key="benefit.title"
                    class="benefit-card flex flex-col items-center text-center group">
                    <!-- Icon Circle -->
                    <div
                        class="w-16 h-16 mb-6 flex items-center justify-center rounded-full border-[3px] border-[#0F1113] group-hover:bg-[#0F1113] transition-colors duration-300">
                        <!-- Truck -->
                        <svg v-if="benefit.icon === 'truck'"
                            class="w-7 h-7 text-[#0F1113] group-hover:text-white transition-colors" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                        </svg>
                        <!-- Star -->
                        <svg v-else-if="benefit.icon === 'star'"
                            class="w-7 h-7 text-[#0F1113] group-hover:text-white transition-colors" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        <!-- Shield -->
                        <svg v-else-if="benefit.icon === 'shield'"
                            class="w-7 h-7 text-[#0F1113] group-hover:text-white transition-colors" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <!-- Lock -->
                        <svg v-else-if="benefit.icon === 'lock'"
                            class="w-7 h-7 text-[#0F1113] group-hover:text-white transition-colors" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>

                    <h3 class="text-base font-bold text-[#0F1113] mb-2">
                        {{ benefit.title }}
                    </h3>
                    <p class="text-sm text-gray-500 max-w-[200px]">
                        {{ benefit.description }}
                    </p>
                </div>
            </div>
        </BaseContainer>
    </section>
</template>
