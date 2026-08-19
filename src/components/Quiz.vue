<script setup>
import { ref, watch, nextTick } from 'vue'
import { useQuiz } from '../composables/useQuiz'
import { playCorrect, playIncorrect } from '../lib/sounds'

const { question, checkAnswer, nextQuestion } = useQuiz()

const input = ref('')
const inputEl = ref(null)
const nextButtonEl = ref(null)
const feedback = ref(null) // 'correct' | 'incorrect' | null
const showFeedback = ref(false)

watch(
  question,
  () => {
    input.value = ''
    feedback.value = null
    showFeedback.value = false
    nextTick(() => inputEl.value?.focus())
  },
  { immediate: true }
)

function submit() {
  if (!input.value.trim()) return
  const correct = checkAnswer(input.value)
  feedback.value = correct ? 'correct' : 'incorrect'
  showFeedback.value = true
  if (correct) {
    playCorrect()
  } else {
    playIncorrect()
  }
  nextTick(() => nextButtonEl.value?.focus())
}

function advance() {
  nextQuestion()
}

function onKeydown(e) {
  if (e.key === 'Enter') submit()
}
</script>

<template>
  <div class="flex flex-col items-center gap-5 max-w-[20rem] mx-auto w-full">
    <p class="m-0 text-3xl tabular-nums" aria-live="polite">{{ question.label }} = ?</p>

    <div
      class="w-full flex flex-col gap-3 transition-transform duration-200"
      :class="{
        'quiz-feedback-correct': feedback === 'correct',
        'quiz-feedback-incorrect': feedback === 'incorrect'
      }"
    >
      <label for="answer-input" class="sr-only">Your answer</label>
      <input
        id="answer-input"
        ref="inputEl"
        v-model="input"
        type="text"
        inputmode="numeric"
        pattern="[0-9]*"
        autocomplete="off"
        placeholder="Your answer"
        class="input input-bordered w-full text-xl text-center box-border"
        :class="{
          'input-success': feedback === 'correct',
          'input-error': feedback === 'incorrect'
        }"
        :disabled="showFeedback"
        @keydown="onKeydown"
      />
      <button
        type="button"
        class="btn btn-primary btn-block"
        :disabled="showFeedback || !input.trim()"
        @click="submit"
      >
        Check
      </button>
    </div>

    <div
      v-if="showFeedback"
      class="w-full box-border p-3 rounded-lg text-base text-center"
      :class="feedback === 'correct' ? 'bg-success/15 text-success' : 'bg-error/10 text-error'"
      role="status"
    >
      <span v-if="feedback === 'correct'">Correct!</span>
      <span v-else>Not quite — the answer was <strong>{{ question.expected }}</strong>.</span>
      <button ref="nextButtonEl" type="button" class="btn btn-primary btn-block mt-3" @click="advance">
        Next question
      </button>
    </div>
  </div>
</template>

<style scoped>
.quiz-feedback-correct {
  animation: pulse-correct 0.5s ease;
}
.quiz-feedback-incorrect {
  animation: shake 0.4s ease;
}
@keyframes pulse-correct {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}
</style>
