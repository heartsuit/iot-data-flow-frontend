import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// createApp(App).use(router).mount('#app')
const app = createApp(App);

// 集成ElementPlus
import ElementPlus from 'element-plus';
// import 'element-plus/dist/index.css' // 官方推荐
import 'element-plus/theme-chalk/index.css';

app.use(ElementPlus);
app.use(router).mount("#app");