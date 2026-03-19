<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LockKeyhole, Mail } from 'lucide-vue-next'

import BaseButton from '@/components/ui/BaseButton.vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

const canSubmit = computed(() => email.value.trim() && password.value)

async function submitLogin() {
  errorMessage.value = ''
  if (!canSubmit.value) {
    errorMessage.value = 'Informe email e senha.'
    return
  }

  isSubmitting.value = true
  try {
    await authStore.login(email.value, password.value)

    const redirectTo = route.query.redirect || '/admin'
    await router.replace(String(redirectTo))
  } catch (error) {
    errorMessage.value =
      error?.response?.data?.message || error?.response?.data?.error || 'Falha ao realizar login.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-neutral-950 flex items-center justify-center px-4">
    <section class="w-full max-w-md rounded-2xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 md:p-6 shadow-sm">
      <div class="mb-6">
        <h1 class="text-2xl font-semibold text-gray-950 dark:text-neutral-100 tracking-tight">Login Admin</h1>
        <p class="text-sm text-gray-500 dark:text-neutral-400 mt-1">Entre para acessar o painel administrativo.</p>
      </div>

      <form class="space-y-4" @submit.prevent="submitLogin">
        <label class="flex flex-col gap-1.5">
          <span class="text-sm font-medium text-gray-700 dark:text-neutral-300">Email</span>
          <div class="relative">
            <Mail class="w-4 h-4 text-gray-400 dark:text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              v-model="email"
              type="email"
              autocomplete="email"
              class="input-field input-with-icon"
              placeholder="voce@empresa.com"
            />
          </div>
        </label>

        <label class="flex flex-col gap-1.5">
          <span class="text-sm font-medium text-gray-700 dark:text-neutral-300">Senha</span>
          <div class="relative">
            <LockKeyhole class="w-4 h-4 text-gray-400 dark:text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              v-model="password"
              type="password"
              autocomplete="current-password"
              class="input-field input-with-icon"
              placeholder="Sua senha"
            />
          </div>
        </label>

        <div v-if="errorMessage" class="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {{ errorMessage }}
        </div>

        <BaseButton variant="primary" size="sm" class="w-full justify-center" :disabled="isSubmitting">
          {{ isSubmitting ? 'Entrando...' : 'Entrar' }}
        </BaseButton>
      </form>
    </section>
  </div>
</template>

<style scoped>
.input-field {
  width: 100%;
  border-radius: 0.75rem;
  border: 1px solid var(--color-gray-200);
  background: #fff;
  padding: 0.625rem 0.75rem;
  font-size: 0.875rem;
  color: var(--color-gray-950);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.input-with-icon {
  padding-left: 2.5rem;
}

.input-field::placeholder {
  color: var(--color-gray-400);
}

.dark .input-field {
  border-color: #404040;
  background: #171717;
  color: #f5f5f5;
}

.dark .input-field::placeholder {
  color: #737373;
}

.input-field:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 20%, transparent);
}
</style>
