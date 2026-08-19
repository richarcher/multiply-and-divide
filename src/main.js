import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { installChunkLoadRecovery } from './lib/chunkLoadRecovery'

installChunkLoadRecovery()

function setTheme() {
  const dark = window.matchMedia('(prefers-color-scheme: dark)').matches
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
}
setTheme()
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setTheme)

createApp(App).mount('#app')
