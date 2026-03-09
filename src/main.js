import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import 'preline'
import VWave from 'v-wave'

const app = createApp(App)
app.use(router)
app.mount('#app')
app.use(VWave, {
    color: 'rgba(0, 255, 255, 0.3)',
    initialOpacity: 0.5,
    duration: 0.4,
    easing: 'ease-out'
})