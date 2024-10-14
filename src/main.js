import { createApp } from 'vue'
import App from './App.vue'

import { createPinia } from 'pinia';

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css'; // 引入 Ant Design 的样式

const pinia = createPinia()

createApp(App).use(pinia).use(Antd).mount('#app')
