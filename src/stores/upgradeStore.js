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
    starterPackItems: false
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
    nextLevel() {
      let cur = this.currentLevelIndex < 8 ? this.currentLevelIndex + 1 : 8
      return this.currentRealm.levels[cur];
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
        const successChance = -0.9;
        if (Math.random() < successChance) {
          this.experience = 0;
          if (this.currentRealmIndex < realms.length - 1) {
            this.currentRealmIndex += 1;
            this.currentLevelIndex = 0;
            return true;
          }
        } else {
          this.startCooldown();
        }
        // this.saveState();
        return false;
      }
    },
    attemptBreakthroughWithPill(pills) {
      if (this.currentLevel.level === 9 && this.experience >= this.currentLevel.experience) {
        let successChance = 0.9;
        // 遍历提供的药品数组，计算总成功概率
        pills.forEach(pill => {
          const inventoryItem = this.inventory.find(item => item.name === pill.name);
          if (inventoryItem) {
            successChance += inventoryItem.successRate * pill.quantity; // 根据药品的成功率和数量提升成功率
            inventoryItem.quantity -= pill.quantity;
          }
        });

        successChance = -1;

        if (Math.random() < successChance) {
          this.experience = 0;
          if (this.currentRealmIndex < realms.length - 1) {
            this.currentRealmIndex += 1;
            this.currentLevelIndex = 0;
            return true;
          }
        } else {
          this.startCooldown();
        }
        // this.saveState();
        return false;
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
      this.starterPackItems = true;
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
    getInventoryQuantity(materialName) {
      const item = this.inventory.find(item => item.name === materialName);
      return item ? item.quantity : 0;
    },
    // 新增方法：添加新手礼包的道具
    addStarterPackItems() {
      const danyao = { name: '初级筑基丹', quantity: 5, successRate: 0.1 };
      const money = { name: '灵石', quantity: 1000 }
      this.addItemToInventory(danyao);
      this.addItemToInventory(money);
      // this.saveState();
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
