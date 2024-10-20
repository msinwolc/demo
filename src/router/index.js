import { createRouter, createWebHistory } from 'vue-router';
import AutoUpgrade from '@/components/AutoUpgrade.vue';
import HerbForaging  from '@/components/HerbForaging.vue';
import AlchemyProcess from '@/components/AlchemyProcess.vue';
import CryptoMining from '@/components/CryptoMining.vue';
import ExploreProcess from '@/components/ExploreProcess.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: AutoUpgrade, // 主页组件
  },
  {
    path: '/foraging',
    name: 'HerbGathering',
    component: HerbForaging , // 采药界面组件
  },
  {
    path: '/alchemy',
    name: 'AlchemyProcess',
    component: AlchemyProcess , // 炼丹房界面组件
  },
  {
    path: '/mining',
    name: 'CryptoMining',
    component: CryptoMining , // 挖矿界面组件
  },
  {
    path: '/explore',
    name: 'ExploreProcess',
    component: ExploreProcess , // 探索界面组件
  },
  // 可以继续添加其他路由
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
