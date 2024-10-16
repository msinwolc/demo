// src/stores/actions/playerActions.js

import { realms } from "@/constants/realms";

export const playerActions = {
    gainExperience(amount) {
        this.player.experience += amount;

        while (this.player.currentLevelIndex < this.playerRealm.levels.length - 1 &&
            this.player.experience >= this.playerRealm.levels[this.player.currentLevelIndex + 1].experience) {
            this.player.currentLevelIndex++;
            this.player.talentPoints += this.playerLevel.talentPoints;
        }

        while (this.player.currentRealmIndex < realms.length - 1 &&
            this.player.currentLevelIndex === this.playerRealm.levels.length - 1 &&
            this.player.experience >= realms[this.player.currentRealmIndex + 1].levels[0].experience) {
            this.player.currentRealmIndex++;
            this.player.currentLevelIndex = 0;
            this.player.talentPoints += realms[this.player.currentRealmIndex].levels[0].talentPoints;
        }

    },
    upgradeStat(stat) {
        if (this.player.talentPoints > 0) {
            if (stat === 'health') {
                this.player.health += 5;
            } else if (stat === 'attack') {
                this.player.attack += 3;
            } else if (stat === 'defense') {
                this.player.defense += 2;
            }
            this.player.talentPoints--;
            // this.saveState();
        }
    },
    startAutoGain() {
        // const multiplier = this.palyerLevel.multiplier;
        const multiplier = 100;
        setInterval(() => {
            if (this.playerLevel.level === 9 && this.player.experience >= this.playerLevel.experience) {
                return;
            }
            this.gainExperience(1 * multiplier);
        }, 500);
    },
    attemptBreakthrough() {
        if (this.playerLevel.level === 9 && this.player.experience >= this.playerLevel.experience) {
            const successChance = this.playerRealm.breakProbability;
            if (Math.random() < successChance) {
                this.player.experience = 0;
                if (this.player.currentRealmIndex < realms.length - 1) {
                    this.player.currentRealmIndex += 1;
                    this.player.currentLevelIndex = 0;
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
        if (this.playerLevel.level === 9 && this.player.experience >= this.playerLevel.experience) {
            let successChance = this.playerRealm.breakProbability;
            // 遍历提供的药品数组，计算总成功概率
            pills.forEach(pill => {
                const inventoryItem = this.getItemByName(pill.name);
                if (inventoryItem) {
                    successChance += inventoryItem.successRate * pill.quantity; // 根据药品的成功率和数量提升成功率
                    inventoryItem.quantity -= pill.quantity;
                }
            });

            if (Math.random() < successChance) {
                this.player.experience = 0;
                if (this.player.currentRealmIndex < realms.length - 1) {
                    this.player.currentRealmIndex += 1;
                    this.player.currentLevelIndex = 0;
                    return true;
                }
            } else {
                this.startCooldown();
            }
            return false;
        }
    },
    startCooldown() {
        this.player.breakthroughCooldown = true;
        setTimeout(() => {
            this.player.breakthroughCooldown = false;
        }, this.player.cooldownTime);
    },
};