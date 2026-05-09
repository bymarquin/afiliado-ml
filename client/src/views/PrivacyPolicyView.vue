<script setup>
import { ShieldCheck } from 'lucide-vue-next'
import BaseContainer from '@/components/ui/BaseContainer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const sections = [
  {
    title: '1. Coleta de informacoes',
    content:
      'Podemos coletar dados de navegacao, interacoes com produtos e informacoes fornecidas por voce em formularios de contato. Esses dados ajudam a melhorar a experiencia e a relevancia das recomendacoes.',
  },
  {
    title: '2. Uso das informacoes',
    content:
      'As informacoes sao usadas para operacao da plataforma, analise de desempenho, personalizacao de conteudo e comunicacoes de suporte. Nao vendemos dados pessoais a terceiros.',
  },
  {
    title: '3. Cookies e tecnologias similares',
    content:
      'Utilizamos cookies para lembrar preferencias, entender comportamento de uso e medir resultados. Voce pode gerenciar cookies no seu navegador, mas algumas funcionalidades podem ser afetadas.',
  },
  {
    title: '4. Compartilhamento com terceiros',
    content:
      'Ao clicar em links de afiliado, voce pode ser direcionado a plataformas parceiras, que possuem politicas proprias. Recomendamos revisar os termos e politicas desses servicos antes da compra.',
  },
  {
    title: '5. Seguranca e retencao',
    content:
      'Adotamos medidas tecnicas e organizacionais para proteger os dados. As informacoes sao mantidas apenas pelo tempo necessario para cumprir finalidades legitimas e obrigacoes legais.',
  },
  {
    title: '6. Seus direitos',
    content:
      'Voce pode solicitar atualizacao, correcao ou exclusao de dados pessoais, quando aplicavel. Para exercer seus direitos, entre em contato pelos canais informados no rodape do site.',
  },
]
</script>

<template>
  <section class="relative overflow-hidden bg-surface py-16 md:py-24 transition-colors duration-300">
    <div class="pointer-events-none absolute inset-0 opacity-40">
      <div class="absolute -top-24 right-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl"></div>
      <div class="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-accent/10 blur-3xl"></div>
    </div>

    <BaseContainer class="relative z-10">
      <div class="mx-auto max-w-4xl">
        <div class="mb-10 text-center md:mb-14">
          <span class="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1">
            <ShieldCheck class="h-4 w-4 text-primary-text" />
            <span class="text-xs font-bold uppercase tracking-wider text-primary-text">Privacidade</span>
          </span>
          <h1 class="text-3xl font-bold tracking-tight text-text-main md:text-5xl">Politica de Privacidade</h1>
          <p class="mt-4 text-sm leading-relaxed text-text-muted md:text-base">
            Esta politica explica como tratamos informacoes na plataforma e como protegemos seus dados.
          </p>
        </div>

        <div class="space-y-4">
          <article
            v-for="section in sections"
            :key="section.title"
            class="rounded-2xl border border-border-sutil bg-surface p-5 md:p-6 transition-colors duration-300"
          >
            <h2 class="text-base font-semibold text-text-main md:text-lg">{{ section.title }}</h2>
            <p class="mt-2 text-sm leading-relaxed text-text-muted md:text-base">{{ section.content }}</p>
          </article>
        </div>

        <p class="mt-8 text-xs text-text-muted md:text-sm">
          Ultima atualizacao: 09 de maio de 2026.
        </p>

        <div class="mt-10 flex justify-center">
          <BaseButton to="/" variant="outline" size="sm">Voltar para o inicio</BaseButton>
        </div>
      </div>
    </BaseContainer>
  </section>
</template>
