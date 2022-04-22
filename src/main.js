import { createApp } from 'vue'
// import Vue from 'vue'
import App from './App.vue'
import router from './router'
import installElementPlus from './plugins/element'
import './assets/css/global.css'
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

const app = createApp(App)
installElementPlus(app)
app.config.globalProperties.$http = axios
app.use(router)
app.mount('#app')
