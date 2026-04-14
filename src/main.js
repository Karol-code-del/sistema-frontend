import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './assets/main.css'
import App from './App.vue'

const app = createApp(App)

app.use(createPinia()) // Activamos el manejador de estados globales
app.use(router)        // Activamos las rutas

app.mount('#app')