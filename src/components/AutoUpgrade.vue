<!-- src/components/AutoUpgrade.vue -->
<template>
  <div style="padding: 20px;">
    <a-card title="修炼界面" style="width: 400px; margin: auto;">
      <p>当前境界: {{ store.currentRealm.name }}{{ levels[store.currentLevel.level - 1] }}</p>
      <p>可用天赋点: {{ store.talentPoints }}</p>
      <p>血量: {{ store.health }}</p>
      <p>攻击: {{ store.attack }}</p>
      <p>防御: {{ store.defense }}</p>

      <a-progress type="circle" :percent="progressPercent" status="active" :width="80" />

      <a-divider />

      <h2>分配天赋点</h2>
      <a-button @click="upgrade('health')" :disabled="store.talentPoints <= 0" type="primary"
        style="margin-right: 8px;">升级血量</a-button>
      <a-button @click="upgrade('attack')" :disabled="store.talentPoints <= 0" type="primary"
        style="margin-right: 8px;">升级攻击</a-button>
      <a-button @click="upgrade('defense')" :disabled="store.talentPoints <= 0" type="primary">升级防御</a-button>

      <a-divider />

      <div style="margin-top: 20px;">
        <a-button type="primary" @click="breakthrough" :disabled="!canBreakthrough"
          style="margin-right: 10px;">直接突破</a-button>
        <a-button type="dashed" @click="showPotionModal" :disabled="!canBreakthrough">丹药突破</a-button>
      </div>
    </a-card>

    <!-- 背包选择弹窗 -->
    <a-modal v-model:visible="isPotionModalVisible" title="选择丹药" @ok="onInventoryConfirm">
      <div v-for="item in filteredInventory" :key="item.name" style="margin-bottom: 10px;">
        <span>{{ item.name }} (成功率加 {{ item.successRate }}%)</span>
        <a-input-number v-model="item.count" min="0" style="margin-left: 10px;" />
      </div>
    </a-modal>

  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';
import { useUpgradeStore, levels } from '../stores/upgradeStore';
import { realms } from '@/constants/realms';

const store = useUpgradeStore();
const isPotionModalVisible = ref(false);

onMounted(() => {
  startGaining();
})

function startGaining() {
  store.startAutoGain();
}

function upgrade(stat) {
  store.upgradeStat(stat);
}

function breakthrough() {
  store.attemptBreakthrough(); // 调用突破方法
}

function showPotionModal() {
  isPotionModalVisible.value = true; // 显示丹药选择弹窗
}

// 计算当前经验的进度百分比并保留两位小数
const progressPercent = computed(() => {
  const currentExp = store.experience;
  const requiredExp = store.currentLevel.experience;
  // 确保防止除以零的错误
  if (requiredExp === 0) return 0;
  return Math.min(((currentExp / requiredExp) * 100).toFixed(2), 100); // 计算进度百分比并保留两位小数
});

// 检查是否可以突破
const canBreakthrough = computed(() => {
  return store.currentLevel.level === 9 && store.experience >= store.currentLevel.experience;
});

// TODO
const inventory = ref([
  { name: '初级筑基丹', successRate: 20, count: 0 }, // 提高20%的成功率
  { name: '中级筑基丹', successRate: 30, count: 0 }, // 提高30%的成功率
  { name: '高级筑基丹', successRate: 50, count: 0 }, // 提高50%的成功率
  { name: '初级炼气丹', successRate: 15, count: 0 }, // 提高15%的成功率
  { name: '中级炼气丹', successRate: 25, count: 0 }, // 提高25%的成功率
]);

// 筛选与当前境界相关的丹药
const filteredInventory = computed(() => {
  const nextRealmName = realms[store.currentRealmIndex + 1].name;
  return inventory.value.filter(item => item.name.includes(nextRealmName));
});

function onInventoryConfirm() {

}
</script>