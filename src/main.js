import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// createApp(App).use(router).mount('#app')
const app = createApp(App);

// 集成ElementPlus
import ElementPlus from 'element-plus';
// import 'element-plus/dist/index.css' // 官方推荐
import 'element-plus/theme-chalk/index.css';

// ElementPlus组件内部默认使用英语，在使用分页插件el-pagination时显示英文，下面配置为中文
import zhCn from 'element-plus/es/locale/lang/zh-cn'

app.use(ElementPlus, { locale: zhCn });
app.use(router).mount("#app");