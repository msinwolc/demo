// src/stores/actions/playerActions.js

import { realms } from "@/constants/realms";
import { techniqueList } from "@/constants/techniqueList";

export const playerActions = {
    gainExperience() {
        const amount = 1;

        const multiplier = this.getMultiplierByTech('cultivationSpeed');

        this.player.experience += amount * multiplier;

        while (this.player.currentLevelIndex < this.playerRealm.levels.length - 1 &&
            this.player.experience >= this.playerRealm.levels[this.player.currentLevelIndex + 1].experience) {
            this.player.currentLevelIndex++;
            this.player.talentPoints += this.playerLevel.talentPoints;
            this.player.experience = 0
        }

        while (this.player.currentRealmIndex < realms.length - 1 &&
            this.player.currentLevelIndex === this.playerRealm.levels.length - 1 &&
            this.player.experience >= realms[this.player.currentRealmIndex + 1].levels[0].experience) {
            this.player.currentRealmIndex++;
            this.player.currentLevelIndex = 0;
            this.player.talentPoints += realms[this.player.currentRealmIndex].levels[0].talentPoints;
            this.player.experience = 0
        }

    },
    upgradeStat(stat) {
        if (this.player.talentPoints > 0) {
            const basicMultiplier = this.getMultiplierByTech('basicAttributes');
            const skillMultiplier = this.getMultiplierByTech('skills');
            if (stat === 'health') {
                this.player.health = (this.player.health + 10) * basicMultiplier;
            } else if (stat === 'attack') {
                this.player.attack += 5 * skillMultiplier;
            } else if (stat === 'defense') {
                this.player.defense = (this.player.defense + 2) * basicMultiplier;
            }
            this.player.talentPoints--;
        }
    },
    startAutoGain() {
        // const multiplier = this.palyerLevel.multiplier;
        // const multiplier = 100;
        setInterval(() => {
            if (this.playerLevel.level === 9 && this.player.experience >= this.playerLevel.experience) {
                return;
            }
            this.gainExperience();
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
    gainMiningExp() {
        this.player.miningExp += 10;
    },
    gainAlchemyExp() {
        this.player.alchemyExp += 10;
    },
    addTechnique(technique) {
        if (this.player.activeTechniques.find(x => x.name === technique.name)) { return }
        this.player.activeTechniques.push(technique);
        this.changeCurrentLearnStatus(true);
        this.removeItemFromInventory(technique.name, 1);
    },
    getMultiplierByTech(type) {
        let multiplier = 1;
        const cultivationAttrTechs = this.currentActiveTechniques.filter(t => t.effect === type);

        for (let i = 0; i < cultivationAttrTechs.length; i++) {
            const currentLevel = cultivationAttrTechs[i].level || 1;

            const techMultiplier = techniqueList.find(t => t.name === cultivationAttrTechs[i].name).levels[currentLevel - 1].multiplier;

            multiplier = 1 + techMultiplier;
        }
        return multiplier;
    },
    addBasicAttrByTech() {
        const multiplier = this.getMultiplierByTech('basicAttributes');
        this.player.health *= multiplier;
        this.player.defense *= multiplier;
    },
    changeCurrentLearnStatus(status) {
        this.player.currentLearnTech = status;
    },
};