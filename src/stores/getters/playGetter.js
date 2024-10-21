// src/stores/getters/playGetter.js

import { miningLevels } from "@/constants/miningLevels";
import { alchemyLevels } from "@/constants/alchemyLevels";
import { realms } from "@/constants/realms";
import { techniqueList } from "@/constants/techniqueList";

export const levelsMap = ['一层', '二层', '三层', '四层', '五层', '六层', '七层', '八层', '九层'];

export const playerGetters = {
    playerRealm() {
        return realms[this.player.currentRealmIndex];
    },
    playerLevel() {
        return this.playerRealm.levels[this.player.currentLevelIndex];
    },
    nextRealm() {
        return realms[this.player.currentRealmIndex + 1];
    },
    nextLevel() {
        let cur = this.player.currentLevelIndex < 8 ? this.player.currentLevelIndex + 1 : 8;
        return this.playerRealm.levels[cur];
    },
    playerRealName() {
        return `${this.playerRealm.name}${levelsMap[this.playerLevel.level - 1]}`;
    },
    playerExperience() {
        return this.player.experience;
    },
    playerHealth() {
        return this.player.health;
    },
    playerAttack() {
        return this.player.attack;
    },
    playerDefense() {
        return this.player.defense;
    },
    playerTalentPoints() {
        return this.player.talentPoints;
    },
    playerCriticalRate() {
        return this.player.criticalRate;
    },
    playerDodgeRate() {
        return this.player.dodgeRate;
    },
    playerCriticalDamage() {
        return this.player.criticalRate;
    },
    requiredExp() {
        return this.nextLevel.experience;
    },
    playerMiningLevel() {
        for (let i = miningLevels.length - 1; i >= 0; i--) {
            if (this.player.miningExp >= miningLevels[i].requiredExperience) {
                return miningLevels[i];
            }
        }
        return miningLevels[0]; // 返回最低等级
    },
    nextMiningLevel() {
        const currentIndex = miningLevels.indexOf(this.playerMiningLevel);
        return miningLevels[currentIndex + 1] || this.playerMiningLevel;
    },
    playerMiningBouns() {
        return this.playerMiningLevel.miningBonus;
    },
    playerAlchemyLevel() {
        for (let i = alchemyLevels.length - 1; i >= 0; i--) {
            if (this.player.miningExp >= alchemyLevels[i].requiredExperience) {
                return alchemyLevels[i];
            }
        }
        return alchemyLevels[0]; // 返回最低等级
    },
    nextAlchemyLevel() {
        const currentIndex = alchemyLevels.indexOf(this.playerAlchemyLevel);
        return alchemyLevels[currentIndex + 1] || this.playerAlchemyLevel;
    },
    currentActiveTechniques() {
        return this.player.activeTechniques;
    },
    techniqueList() {
        return techniqueList;
    },
    currentLearnTech() {
        return this.player.currentLearnTech;
    }
};