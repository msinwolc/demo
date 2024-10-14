// stores/upgradeStore.js
import { defineStore } from 'pinia';
import { realms } from '../constants/realms';

// 从 localStorage 加载初始状态
function loadState() {
  const savedState = localStorage.getItem('upgradeStore');
  return savedState ? JSON.parse(savedState) : {
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
  };
}

export const levels = ['一层', '二层', '三层', '四层', '五层', '六层', '七层', '八层', '九层'];

export const useUpgradeStore = defineStore('upgrade', {
  state: () => loadState(),
  getters: {
    currentRealm() {
      return realms[this.currentRealmIndex];
    },
    currentLevel() {
      return this.currentRealm.levels[this.currentLevelIndex];
    },
  },
  actions: {
    gainExperience(amount) {
      const multiplier = this.currentLevel.multiplier;
      this.experience += amount * multiplier;

      while (this.currentLevelIndex < this.currentRealm.levels.length - 1 &&
        this.experience >= this.currentRealm.levels[this.currentLevelIndex + 1].experience) {
        this.currentLevelIndex++;
        this.talentPoints += this.currentLevel.talentPoints;
      }

      while (this.currentRealmIndex < realms.length - 1 &&
        this.currentLevelIndex === this.currentRealm.levels.length - 1 &&
        this.experience >= realms[this.currentRealmIndex + 1].levels[0].experience) {
        this.currentRealmIndex++;
        this.currentLevelIndex = 0;
        this.talentPoints += realms[this.currentRealmIndex].levels[0].talentPoints;
      }

      // this.saveState();
    },
    upgradeStat(stat) {
      if (this.talentPoints > 0) {
        if (stat === 'health') {
          this.health += 5;
        } else if (stat === 'attack') {
          this.attack += 3;
        } else if (stat === 'defense') {
          this.defense += 2;
        }
        this.talentPoints--;
        // this.saveState();
      }
    },
    startAutoGain() {
      const multiplier = this.currentLevel.multiplier;
      setInterval(() => {
        if (this.currentLevel.level === 9 && this.experience >= this.currentLevel.experience) {
          return;
        }
        this.gainExperience(1 * multiplier);
      }, 500);
    },
    attemptBreakthrough() {
      if (this.currentLevel.level === 9 && this.experience >= this.currentLevel.experience) {
        const successChance = 0.9;
        if (Math.random() < successChance) {
          this.experience = 0;
          if (this.currentRealmIndex < realms.length - 1) {
            this.currentRealmIndex += 1;
            this.currentLevelIndex = 0;
          }
        } else {
          this.startCooldown();
        }
        // this.saveState();
      }
    },
    startCooldown() {
      this.breakthroughCooldown = true;
      setTimeout(() => {
        this.breakthroughCooldown = false;
      }, this.cooldownTime);
    },
    // 添加物品到背包
    addItemToInventory(item) {
      const existingItem = this.inventory.find(i => i.name === item.name);
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        this.inventory.push({ ...item, quantity: item.quantity || 1 });
      }
      // this.saveState();
    },
    // 从背包移除物品
    removeItemFromInventory(itemName, quantity) {
      const item = this.inventory.find(i => i.name === itemName);
      if (item) {
        item.quantity -= quantity;
        if (item.quantity <= 0) {
          this.inventory = this.inventory.filter(i => i.name !== itemName);
        }
        // this.saveState();
      }
    },
    // 使用背包中的物品
    useItem(itemName) {
      const item = this.inventory.find(i => i.name === itemName);
      if (item && item.quantity > 0) {
        if (item.effect === 'heal') {
          this.health += item.value;
        }
        this.removeItemFromInventory(itemName, 1);
        // this.saveState();
      }
    },
    // 保存状态到 localStorage
    saveState() {
      localStorage.setItem('upgradeStore', JSON.stringify(this.$state));
    },
    // 重置状态
    resetState() {
      localStorage.removeItem('upgradeStore');
      this.$reset();
    },
  },
});
