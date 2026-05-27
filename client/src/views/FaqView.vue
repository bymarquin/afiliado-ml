<script setup>
import { ref } from 'vue'
import { ChevronDown, HelpCircle } from 'lucide-vue-next'
import BaseContainer from '@/components/ui/BaseContainer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const faqItems = [
  {
    question: 'Os produtos exibidos são vendidos por vocês?',
    answer:
      'Nao. A vitrine apresenta ofertas de parceiros. O pagamento, frete, garantia e entrega sao processados diretamente pelo marketplace vendedor.',
  },
  {
    question: 'Posso confiar nos produtos recomendados?',
    answer:
      'Nossa curadoria prioriza itens bem avaliados, com bom custo-benefício e relevância para o público. Ainda assim, vale checar reputação do vendedor e avaliações recentes.',
  },
  {
    question: 'Como entro em contato para suporte?',
    answer:
      'Você pode falar com a gente pelo e-mail de contato no rodapé. Respondemos o mais rápido possível em horário comercial.',
  },
  {
    question: 'Onde ocorre o pagamento pelos produtos?',
    answer:
      'O pagamento é processado diretamente pelo marketplace vendedor. Ao clicar no botão "Comprar Agora", você será redirecionado para a página do Mercado Livre para finalizar sua compra com segurança.',
  },
]

const activeIndex = ref(0)

const toggleItem = (index) => {
  activeIndex.value = activeIndex.value === index ? -1 : index
}
</script>

<template>
  <section class="relative overflow-hidden bg-surface py-16 md:py-24 transition-colors duration-300">
    <div class="pointer-events-none absolute inset-0 opacity-40">
      <div class="absolute -top-24 right-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl"></div>
      <div class="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-accent/10 blur-3xl"></div>
    </div>

    <BaseContainer class="relative z-10">
      <div class="mx-auto max-w-3xl">
        <div class="mb-10 text-center md:mb-14">
          <span class="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1">
            <HelpCircle class="h-4 w-4 text-primary-text" />
            <span class="text-xs font-bold uppercase tracking-wider text-primary-text">Central de ajuda</span>
          </span>
          <h1 class="text-3xl font-bold tracking-tight text-text-main md:text-5xl">Perguntas frequentes</h1>
          <p class="mt-4 text-sm leading-relaxed text-text-muted md:text-base">
            Tudo o que voce precisa saber para usar a plataforma com seguranca e aproveitar melhor as recomendacoes.
          </p>
        </div>

        <div class="space-y-4">
          <article
            v-for="(item, index) in faqItems"
            :key="item.question"
            class="overflow-hidden rounded-2xl border border-border-sutil bg-surface transition-colors duration-300"
          >
            <button
              type="button"
              class="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-surface-hover md:px-6 md:py-5"
              :aria-expanded="activeIndex === index"
              @click="toggleItem(index)"
            >
              <span class="text-sm font-semibold text-text-main md:text-base">{{ item.question }}</span>
              <ChevronDown
                class="h-5 w-5 shrink-0 text-text-muted transition-transform duration-300"
                :class="activeIndex === index ? 'rotate-180 text-primary-text' : ''"
              />
            </button>

            <Transition
              enter-active-class="transition-all duration-250 ease-out"
              enter-from-class="max-h-0 opacity-0"
              enter-to-class="max-h-64 opacity-100"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="max-h-64 opacity-100"
              leave-to-class="max-h-0 opacity-0"
            >
              <div v-if="activeIndex === index" class="border-t border-border-sutil px-5 py-4 md:px-6">
                <p class="text-sm leading-relaxed text-text-muted">{{ item.answer }}</p>
              </div>
            </Transition>
          </article>
        </div>

        <div class="mt-10 flex justify-center">
          <BaseButton to="/" variant="outline" size="sm">Voltar para o inicio</BaseButton>
        </div>
      </div>
    </BaseContainer>
  </section>
</template>
