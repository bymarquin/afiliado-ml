<script setup>
import BaseContainer from '@/components/ui/BaseContainer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
</script>

<template>
    <section class="py-8 md:py-12">
        <BaseContainer>
            <!-- Badge + Title -->
            <div class="text-center mb-8">
                <span class="inline-block px-3 py-1 text-xs font-semibold text-primary bg-primary/10 rounded-full mb-4">
                    LIMITED OFFER
                </span>
                <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-950 leading-tight">
                    All the products<br class="hidden sm:inline" />
                    you ever wanted
                </h1>
            </div>

            <!-- Hero Banner -->
            <div class="relative bg-hero-bg rounded-2xl overflow-hidden mb-8">
                <div class="flex flex-col lg:flex-row items-center">
                    <!-- Image Container -->
                    <div class="w-full lg:w-1/2 h-48 sm:h-64 lg:h-80 flex items-center justify-center p-8">
                        <!-- Placeholder para headphone - podemos usar imagem real depois -->
                        <div class="relative">
                            <svg class="w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 text-gray-200/20" viewBox="0 0 24 24"
                                fill="currentColor">
                                <path
                                    d="M12 1a9 9 0 00-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7a9 9 0 00-9-9z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Discount Info + CTA -->
            <div class="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h2 class="text-xl md:text-2xl font-bold text-gray-950 mb-1">
                        Get 25% discount
                    </h2>
                    <p class="text-gray-800">only available today</p>
                </div>

                <div class="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    <p class="text-sm text-gray-400 max-w-xs text-center md:text-left">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Suspendisse varius enim in eros elementum tristique.
                    </p>
                    <div class="flex gap-3">
                        <BaseButton variant="primary">
                            Button
                        </BaseButton>
                        <BaseButton variant="secondary">
                            Button
                        </BaseButton>
                    </div>
                </div>
            </div>
        </BaseContainer>
    </section>
</template>
