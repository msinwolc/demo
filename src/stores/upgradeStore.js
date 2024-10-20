// stores/upgradeStore.js
import { defineStore } from 'pinia';
import { playerGetters } from './getters/playGetter';
import { playerActions } from './actions/playerActions';
import { inventoryGetters } from './getters/inventoryGetters';
import { inventoryActions } from './actions/inventoryActions';

// 从 localStorage 加载初始状态
function loadState() {
  const savedState = localStorage.getItem('upgradeStore');
  return savedState ? JSON.parse(savedState) : {
    player: {
      experience: 0, // 境界经验
      miningExp: 0, // 挖矿经验
      alchemyExp: 0, // 炼丹经验
      currentRealmIndex: 0, // 当前境界
      currentLevelIndex: 0, // 当前层级
      talentPoints: 0, // 天赋点
      health: 1000,
      attack: 100,
      defense: 50,
      criticalRate: 0.1,
      criticalDamage: 1.5,
      dodgeRate: 0.1,
      breakthroughCooldown: false,
      cooldownTime: 5000,
      inventory: [], // 背包
      activeTechniques: [],
      currentLearnTech: null,
      starterPackItems: false
    },
  };
}

export const useUpgradeStore = defineStore('upgrade', {
  state: () => loadState(),
  getters: {
    ...playerGetters,
    ...inventoryGetters,
  },
  actions: {
    ...playerActions,
    ...inventoryActions,
  },
  persist: {
    enabled: true, // 开启持久化
    strategies: [
      {
        key: 'play-store', // 存储键名
        storage: localStorage, // 使用 localStorage 存储
      },
    ],
  },
});
