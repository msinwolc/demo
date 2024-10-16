<template>
    <div style="text-align: center;">
        <a-card title="挖矿界面" style="width: 80%; margin: auto;">
            <!-- 环形进度条 -->
            <a-progress type="circle" :percent="progress" status="active" :width="120" />

            <a-divider />

            <!-- 显示挖矿结果 -->
            <div>
                <h3>挖矿结果</h3>
                <a-row>
                    <a-col v-for="(result, index) in miningResults" :key="index" :span="8">
                        <a-button style="margin-top: 10px;" :style="{ color: result.color }">
                            {{ result.name }}: {{ result.amount }}
                        </a-button>
                    </a-col>
                </a-row>
            </div>

            <a-divider />

            <!-- 开始/停止挖矿按钮 -->
            <a-button type="primary" @click="toggleMining">{{ isMining ? '停止挖矿' : '开始挖矿' }}</a-button>
        </a-card>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import { ores } from '@/constants/ores';
import { useUpgradeStore } from '@/stores/upgradeStore';

const store = useUpgradeStore();

const progress = ref(0);
const miningResults = ref([...ores]);
const isMining = ref(false);
let miningInterval = null;

const toggleMining = () => {
    isMining.value = !isMining.value;
    if (isMining.value) {
        startMining();
        message.success('开始挖矿！');
    } else {
        stopMining();
        message.info('停止挖矿');
    }
};

// 根据权重计算挖到矿石的概率
const getRandomOre = () => {
    const totalWeight = ores.reduce((sum, ore) => sum + ore.weight, 0);
    let randomValue = Math.random() * totalWeight;

    for (const ore of ores) {
        if (randomValue < ore.weight) {
            return ore;
        }
        randomValue -= ore.weight;
    }
    return ores[0]; // 兜底，防止意外情况
};

const startMining = () => {
    miningResults.value.forEach(result => {
        result.amount = 0; // 重置挖矿结果
    });

    miningInterval = setInterval(() => {
        if (progress.value < 100) {
            progress.value += 10;
        } else {
            progress.value = 0; // 重置进度条
            updateMiningResults();
        }
    }, 500);
};

const stopMining = () => {
    clearInterval(miningInterval);
    miningInterval = null;
};

const updateMiningResults = () => {
    // 随机选择一种矿石，并增加随机数量
    const randomOre = getRandomOre();
    const randomAmount = Math.floor(Math.random() * 10 + 1);
    // 更新挖矿结果
    const oreToUpdate = miningResults.value.find(ore => ore.name === randomOre.name);
    if (oreToUpdate) {
        oreToUpdate.amount += randomAmount;
    }

    store.addItemToInventory({ name: randomOre.name, quantity: randomAmount, type: 'material' });

    message.success(`挖到了一些${randomOre.name}！`);
};
</script>

<style scoped>
/* 可以添加样式 */
</style>
