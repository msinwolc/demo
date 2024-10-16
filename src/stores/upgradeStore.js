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
      experience: 0,
      currentRealmIndex: 0,
      currentLevelIndex: 0,
      talentPoints: 0,
      health: 10,
      attack: 10,
      defense: 10,
      breakthroughCooldown: false,
      cooldownTime: 5000,
      inventory: [], // 背包
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
});
