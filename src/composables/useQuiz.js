import { ref, computed } from 'vue'
import { randomInt } from '../lib/random'

function makeQuestion() {
  const op = Math.random() < 0.5 ? 'multiply' : 'divide'
  if (op === 'multiply') {
    const a = randomInt(1, 12)
    const b = randomInt(1, 12)
    return { op, label: `${a} × ${b}`, expected: a * b }
  }
  const divisor = randomInt(1, 12)
  const quotient = randomInt(1, 12)
  return { op, label: `${divisor * quotient} ÷ ${divisor}`, expected: quotient }
}

export function useQuiz() {
  const question = ref(makeQuestion())
  const results = ref([])

  const wrongAnswers = computed(() => results.value.filter((r) => !r.correct))

  function checkAnswer(rawInput) {
    const userAnswer = Number(String(rawInput).trim())
    const correct = userAnswer === question.value.expected
    results.value.push({ label: question.value.label, correct, userAnswer, expected: question.value.expected })
    return correct
  }

  function nextQuestion() {
    question.value = makeQuestion()
  }

  return { question, results, wrongAnswers, checkAnswer, nextQuestion }
}
