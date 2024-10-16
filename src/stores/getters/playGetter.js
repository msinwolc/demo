// src/stores/getters/playGetter.js

import { realms } from "@/constants/realms";

export const levelsMap = ['一层', '二层', '三层', '四层', '五层', '六层', '七层', '八层', '九层'];

export const playerGetters = {
    playerRealm() {
        return realms[this.player.currentRealmIndex];
    },
    playerLevel() {
        return this.playerRealm.levels[this.player.currentLevelIndex];
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
    requiredExp() {
        this.nextLevel.experience;
    },
};