<script setup>
import BaseContainer from '@/components/ui/BaseContainer.vue'

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
</script>

<template>
    <section class="py-12 md:py-16 border-y border-gray-100">
        <BaseContainer>
            <h2 class="text-xl md:text-2xl font-bold text-gray-950 text-center mb-10">
                Benefits of shopping with us
            </h2>

            <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                <div v-for="benefit in benefits" :key="benefit.title" class="flex flex-col items-center text-center">
                    <!-- Icon -->
                    <div class="w-12 h-12 mb-4 flex items-center justify-center bg-gray-50 rounded-full">
                        <!-- Truck -->
                        <svg v-if="benefit.icon === 'truck'" class="w-6 h-6 text-gray-950" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                        </svg>
                        <!-- Star -->
                        <svg v-else-if="benefit.icon === 'star'" class="w-6 h-6 text-gray-950" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        <!-- Shield -->
                        <svg v-else-if="benefit.icon === 'shield'" class="w-6 h-6 text-gray-950" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <!-- Lock -->
                        <svg v-else-if="benefit.icon === 'lock'" class="w-6 h-6 text-gray-950" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>

                    <h3 class="text-sm font-semibold text-gray-950 mb-1">
                        {{ benefit.title }}
                    </h3>
                    <p class="text-xs text-gray-400 leading-relaxed">
                        {{ benefit.description }}
                    </p>
                </div>
            </div>
        </BaseContainer>
    </section>
</template>
