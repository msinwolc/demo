<template>
    <div style="text-align: center;">
        <a-card title="炼丹界面" style="width: 80%; margin: auto;">
            <!-- 环形进度条 -->
            <a-progress type="circle" :percent="progress" status="active" :width="120" />

            <a-divider />

            <h2>{{ store.playerAlchemyLevel.name }}</h2>

            <a-progress :percent="alchemyLevelProgress" status="active" />

            <a-divider />

            <!-- 选择丹方按钮 -->
            <a-button type="primary" @click="showFormulaModal">选择丹方</a-button>

            <!-- 显示所选丹方和所需材料 -->
            <div v-if="selectedFormula">
                <h3>{{ selectedFormula.name }}</h3>
                <div v-for="(material, index) in selectedFormula.materials" :key="index" style="margin-top: 10px;">
                    <a-space>
                        <a-button @click="decrementMaterial(material.name)"
                            :disabled="material.addedQuantity <= 0">-</a-button>
                        <span>
                            {{ material.name }} (需要: {{ material.quantity }}，拥有: {{ material.inventoryQuantity }}，已添加:
                            {{ material.addedQuantity }})
                        </span>
                        <a-button @click="incrementMaterial(material.name)"
                            :disabled="material.addedQuantity > material.inventoryQuantity">+</a-button>
                    </a-space>
                </div>
            </div>

            <a-divider />

            <!-- 开始炼丹按钮 -->
            <a-button type="primary" @click="startAlchemy" :disabled="!canStartAlchemy">开始炼丹</a-button>
        </a-card>

        <!-- 丹方选择弹层 -->
        <a-modal v-model:open="isFormulaModalVisible" title="选择丹方" @ok="selectFormula">
            <a-list :dataSource="availableFormulas">
                <template #renderItem="{ item }">
                    <a-list-item @click="selectFormula(item)">
                        {{ item.name }}
                    </a-list-item>
                </template>
            </a-list>
        </a-modal>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { message } from 'ant-design-vue';
import { pillRecipes } from '@/constants/pill';
import { useUpgradeStore } from '@/stores/upgradeStore';

const progress = ref(0);
const selectedFormula = ref(null);
const isFormulaModalVisible = ref(false);
const availableFormulas = ref(pillRecipes);
const store = useUpgradeStore();

const alchemyLevelProgress = computed(() => {
    return ((store.player.alchemyExp / store.nextAlchemyLevel.requiredExperience) * 100).toFixed(0);
});

const showFormulaModal = () => {
    isFormulaModalVisible.value = true;
};

const selectFormula = (formula) => {
    selectedFormula.value = {
        ...formula,
        materials: formula.materials.map(material => ({
            ...material,
            inventoryQuantity: store.getInventoryQuantity(material.name), // 背包拥有的数量
            addedQuantity: 0 // 已添加数量初始化为0
        }))
    };
    isFormulaModalVisible.value = false;
};

const incrementMaterial = (materialName) => {
    const material = selectedFormula.value.materials.find(mat => mat.name === materialName);
    if (material.addedQuantity < material.inventoryQuantity) {
        material.addedQuantity++;
    }
};

const decrementMaterial = (materialName) => {
    const material = selectedFormula.value.materials.find(mat => mat.name === materialName);
    if (material.addedQuantity > 0) material.addedQuantity--;
};

const canStartAlchemy = computed(() => {
    return selectedFormula.value && selectedFormula.value.materials.every(mat => mat.addedQuantity >= mat.quantity);
});

const startAlchemy = () => {
    if (!canStartAlchemy.value) {
        message.warning('请确保所有材料都已选择！');
        return;
    }
    message.success('开始炼丹！');
    progress.value = 0;
    const interval = setInterval(() => {
        if (progress.value < 100) {
            progress.value += 10;
        } else {
            clearInterval(interval);
            finishAlchemy();
        }
    }, 500);
};

function finishAlchemy() {
    const rand = Math.random();
    let pillQuality;

    if (rand < 0.5) {
        pillQuality = "初级"; // 50%的概率生成初级丹药
    } else if (rand < 0.8) {
        pillQuality = "中级"; // 30%的概率生成中级丹药
    } else {
        pillQuality = "高级"; // 20%的概率生成高级丹药
    }

    const quantity = Math.floor(Math.random() * 10) + 1; // 生成1到10之间的随机数量

    const newPill = {
        name: `${pillQuality}${selectedFormula.value.name}`,
        quantity: quantity,
        type: 'consumable'
    };

    // 将生成的丹药加入背包
    store.addItemToInventory(newPill);
    store.gainAlchemyExp();
    message.success(`炼制成功，获得${newPill.name} x${newPill.quantity}！`);
}
</script>
