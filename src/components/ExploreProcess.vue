<template>
    <div style="padding: 20px;">
        <a-card title="秘境" style="width: 80%; margin: auto;">
            <h2>选择区域探索</h2>
            <a-row>
                <a-col v-for="(realm, index) in realms" :key="index" :span="8">
                    <a-button @click="startExplore(realm)" style="margin-bottom: 10px;">
                        {{ exploreMap[realm.name] || realm.name }}
                    </a-button>
                </a-col>
            </a-row>

            <a-divider />

            <!-- 左侧玩家血条 -->
            <div style="float: left; width: 45%; text-align: center;">
                <p>玩家血量: {{ playerHealth.toFixed(0) }}</p>
                <a-progress :percent="playerHealthPercent" status="active" />
            </div>

            <!-- 右侧怪物血条 -->
            <div style="float: right; width: 45%; text-align: center;" v-if="currentMonster && currentMonster.name">
                <p>{{ currentMonster.name }} 血量: {{ monsterHealth }}</p>
                <a-progress :percent="monsterHealthPercent" status="active" />
            </div>

            <a-divider />

            <!-- 战斗日志 -->
            <div v-for="(message, index) in exploreResult" :key="index">
                <p v-html="message"></p>
            </div>
        </a-card>
    </div>
</template>

<script setup>
import { realms } from '@/constants/realms'; // 确保 realms 被正确导入
import { monsters, exploreMap } from '@/constants/monsters';

import { useUpgradeStore } from '@/stores/upgradeStore';
import { ref, computed } from 'vue';

const store = useUpgradeStore();

const exploreResult = ref([]);
const maxMessages = 10; // 设置最大消息数
const isFighting = ref(false);
const currentExporeReal = ref('');
const playerHealth = ref(store.playerHealth);
const currentMonster = ref({});
const monsterHealth = ref(0)

// 定义事件类型
const EventType = {
    MONSTER: 'monster',
    ITEM: 'item',
    NPC: 'npc'
};

// 自动探索逻辑
const startExplore = (realm) => {
    currentExporeReal.value = realm;
    explorationLoop();
};

// 探索主循环
const explorationLoop = () => {
    // 没有境界或者正在战斗则退出，等待战斗完成
    if (!currentExporeReal.value || isFighting.value) return;

    // 随机事件
    const event = generateRandomEvent();
    handleEvent(event);
};

// 生成随机事件
const generateRandomEvent = () => {
    const rand = Math.random();
    if (rand < 0.5) {
        return { type: EventType.MONSTER };
    } else if (rand < 0.8) {
        return { type: EventType.ITEM };
    } else {
        return { type: EventType.NPC };
    }
};

// 处理事件
const handleEvent = (event) => {
    switch (event.type) {
        case EventType.MONSTER:
            startBattle();
            break;
        case EventType.ITEM:
            // acquireRandomItem();
            explorationLoop();
            break;
        case EventType.NPC:
            // showNpcInteraction();
            explorationLoop();
            break;
    }
};

// 计算血条百分比
const playerHealthPercent = computed(() => ((playerHealth.value / store.playerHealth) * 100).toFixed(0));
const monsterHealthPercent = computed(() => ((monsterHealth.value / currentMonster.value.health) * 100).toFixed(0));

// 战斗逻辑
const startBattle = () => {
    const monster = generateRandomMonster();
    currentMonster.value = monster;
    isFighting.value = true;
    let playerTurn = true;

    playerHealth.value = store.playerHealth;
    monsterHealth.value = monster.health;

    removeMsg();
    exploreResult.value.push(`遭遇了<span style="color: ${monster.color}">${monster.name}</span>！`);

    const battleLoop = () => {
        if (playerHealth.value > 0 && monsterHealth.value > 0) {
            setTimeout(() => {
                if (playerTurn) {
                    // 玩家回合
                    const { damage, isCrit } = calculateDamage(store.playerAttack - monster.defense, store.playerCriticalRate);
                    if (!isDodge(monster.dodgeRate)) {
                        monsterHealth.value -= damage;
                        if (monsterHealth.value <= 0) {
                            monsterHealth.value = 0;
                        }
                        removeMsg();
                        exploreResult.value.push(
                            `你攻击了<span style="color: ${monster.color}">${monster.name}</span>，造成了<span style="color: ${isCrit ? 'red' : 'gray'}">${damage}${isCrit ? '!' : ''}</span>点伤害！`
                        );
                    } else {
                        removeMsg();
                        exploreResult.value.push(`你攻击了<span style="color: ${monster.color}">${monster.name}</span>，但被闪避了！`);
                    }
                } else {
                    // 怪物回合
                    const { damage, isCrit } = calculateDamage(monster.attack - store.playerDefense, monster.critRate);
                    if (!isDodge(store.playerDodge)) {
                        playerHealth.value -= damage;
                        if (playerHealth.value <= 0) {
                            playerHealth.value = 0;
                        }
                        removeMsg();
                        exploreResult.value.push(
                            `<span style="color: ${monster.color}">${monster.name}</span>攻击了你，造成了<span style="color: ${isCrit ? 'red' : 'gray'}">${damage}${isCrit ? '!' : ''}</span>点伤害！`
                        );
                    } else {
                        removeMsg();
                        exploreResult.value.push(`<span style="color: ${monster.color}">${monster.name}</span>攻击了你，但被闪避了！`);
                    }
                }
                playerTurn = !playerTurn;

                // 继续战斗循环
                battleLoop();
            }, 500); // 每回合延迟0.5秒
        } else {
            // 战斗结束
            if (playerHealth.value > 0) {
                removeMsg();
                exploreResult.value.push(`你击败了<span style="color: ${monster.color}">${monster.name}</span>`);
                acquireRandomItem(monster);
            } else {
                exploreResult.value.push("你被击败...");
            }
            isFighting.value = false;
            exploreResult.value.push("3秒后开始下一轮探索...");
            setTimeout(() => {
                explorationLoop();
            }, 3000)
        }
    };
    // 开始战斗循环
    battleLoop();
};

// 计算伤害（考虑暴击）
const calculateDamage = (baseDamage, critRate) => {
    const isCrit = Math.random() < critRate;
    const finalDamage = isCrit ? baseDamage * 1.5 : baseDamage;
    return { damage: Math.floor(finalDamage), isCrit };
};

// 判断是否闪避
const isDodge = (dodgeRate) => {
    return Math.random() < dodgeRate;
};

// 生成随机怪物
const generateRandomMonster = () => {
    const realmName = currentExporeReal.value.name;
    const monstersList = monsters[realmName];
    const randomInt = Math.floor(Math.random() * monstersList.length);
    return monstersList[randomInt];
};

// 获得道具
const acquireRandomItem = (monster) => {
    const item = { name: `${monster.name}内丹`, quantity: 1, type: 'material' };
    store.addItemToInventory(item);
    const money = { name: "灵石", quantity: Math.round(monster.health / 100) };
    store.addItemToInventory(money);
    exploreResult.value.push(`获得 ${item.name}x1，灵石x${Math.round(monster.health / 100)}`);
};

const removeMsg = () => {
    // 如果超过最大消息数，移除最旧的消息
    if (exploreResult.value.length >= maxMessages) {
        exploreResult.value.shift(); // 移除最旧的消息
    }
}
</script>

<style scoped>
/* 添加样式 */
</style>