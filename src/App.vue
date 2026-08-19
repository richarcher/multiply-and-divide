<script setup>
import { computed } from 'vue'

const buildId = __BUILD_ID__
const buildStamp = __BUILD_STAMP__

const builtAtLabel = computed(() => {
  const s = buildStamp
  return s.length >= 16 ? `${s.slice(0, 10)} ${s.slice(11, 16)}` : s
})
</script>

<template>
  <div id="app" lang="en-ZA" class="min-h-app flex flex-col">
    <main class="flex-1 flex flex-col items-center justify-center p-4 gap-2 text-center">
      <h1>Multiply &amp; Divide</h1>
      <p class="text-base-content/70">Multiplication and division practice — coming soon.</p>
    </main>

    <footer class="w-full border-t border-base-300/60 px-4 pt-4 text-center text-xs text-base-content/60 pb-[max(1rem,env(safe-area-inset-bottom,0px))]">
      <span>
        Multiply &amp; Divide ·
        <span class="text-base-content/80 font-mono tracking-tight">{{ buildId }}</span>
        <span class="text-base-content/50"> · built {{ builtAtLabel }}</span>
      </span>
    </footer>
  </div>
</template>
