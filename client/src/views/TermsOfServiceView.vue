<script setup>
import { FileText } from 'lucide-vue-next'
import BaseContainer from '@/components/ui/BaseContainer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const sections = [
  {
    title: '1. Aceitacao dos termos',
    content:
      'Ao acessar e utilizar esta plataforma, voce concorda com estes Termos de Servico e com a Politica de Privacidade. Se nao concordar, recomendamos nao utilizar o site.',
  },
  {
    title: '2. Natureza da plataforma',
    content:
      'A plataforma atua como vitrine de recomendacoes e links de afiliado. Nao realizamos venda direta dos produtos exibidos e nao processamos pagamento das compras.',
  },
  {
    title: '3. Responsabilidades do usuario',
    content:
      'O usuario deve utilizar o site de forma licita, sem comprometer seguranca, disponibilidade ou integridade do servico. Tambem e responsavel por verificar informacoes finais antes da compra.',
  },
  {
    title: '4. Precos e disponibilidade',
    content:
      'Precos, condicoes e estoque podem mudar sem aviso nas plataformas parceiras. Nao garantimos manutencao de oferta apos o clique, prevalecendo as informacoes do vendedor final.',
  },
  {
    title: '5. Propriedade intelectual',
    content:
      'Conteudos, marcas, textos e elementos visuais deste site sao protegidos por direitos aplicaveis. Nao e permitido copiar, distribuir ou reutilizar sem autorizacao previa.',
  },
  {
    title: '6. Limitacao de responsabilidade',
    content:
      'Nao nos responsabilizamos por transacoes, entregas, garantias, trocas ou atendimentos realizados por terceiros. Eventuais problemas devem ser tratados diretamente com o marketplace ou vendedor.',
  },
  {
    title: '7. Alteracoes dos termos',
    content:
      'Podemos atualizar estes Termos de Servico a qualquer momento para refletir melhorias ou exigencias legais. O uso continuado da plataforma apos alteracoes representa concordancia com a nova versao.',
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
            <FileText class="h-4 w-4 text-primary-text" />
            <span class="text-xs font-bold uppercase tracking-wider text-primary-text">Juridico</span>
          </span>
          <h1 class="text-3xl font-bold tracking-tight text-text-main md:text-5xl">Termos de Servico</h1>
          <p class="mt-4 text-sm leading-relaxed text-text-muted md:text-base">
            Regras de uso da plataforma para garantir transparencia, seguranca e boa experiencia para todos.
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
