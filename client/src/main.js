import '../src/assets/styles/rest.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from "@tanstack/vue-query";
import axios from 'axios';

import App from './App.vue'
import router from './router'

const app = createApp(App)

axios.defaults.baseURL = 'https://game-catalog-server.vercel.app/api/games';
axios.defaults.headers.common['Authorization'] = `BEARER ${import.meta.env.VITE_API_KEY}`;

app.config.globalProperties.$axios = axios;


app.use(createPinia())
app.use(router)
app.use(VueQueryPlugin)

app.mount('#app')
