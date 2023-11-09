import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import myFooter from "./components/myFooter.vue"
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/dist/index.css'
import 'dayjs/locale/zh-cn'
import { createStore } from 'vuex';
import Antd from 'ant-design-vue';
import App from './App.vue';
import 'ant-design-vue/dist/reset.css';
import router from './router';
import store from '../store';  // 引入store
import 'core-js/modules/es.array.map';
import * as echarts from 'echarts';




const app = createApp(App)
app.use(ElementPlus, { size: 'small', zIndex: 3000, locale: zhCn })
app.use(router) //注册路由
app.use(store)
app.use(Antd)
app.component("myFooter", myFooter)

app.mount('#app')







