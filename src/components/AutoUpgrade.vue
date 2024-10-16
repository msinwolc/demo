<!-- src/components/AutoUpgrade.vue -->
<template>
  <div style="padding: 20px;">
    <a-card title="修炼界面" style="width: 80%; margin: auto;">
      <!-- 当前境界信息 -->
      <p>当前境界: {{ store.playerRealName }}</p>
      <p>可用天赋点: {{ store.playerTalentPoints }}</p>

      <!-- 属性及加号按钮 -->
      <div>
        <p>血量: {{ store.playerHealth }}
          <a-button @click="upgrade('health')" size="small" icon="+" :disabled="store.playerTalentPoints <= 0"
            style="margin-left: 8px;"></a-button>
        </p>
        <p>攻击: {{ store.playerAttack }}
          <a-button @click="upgrade('attack')" size="small" icon="+" :disabled="store.playerTalentPoints <= 0"
            style="margin-left: 8px;"></a-button>
        </p>
        <p>防御: {{ store.playerDefense }}
          <a-button @click="upgrade('defense')" size="small" icon="+" :disabled="store.playerTalentPoints <= 0"
            style="margin-left: 8px;"></a-button>
        </p>
      </div>

      <!-- 进度条 -->
      <div style="text-align: center; margin-top: 20px;">
        <a-progress type="circle" :percent="progressPercent" status="active" :width="80" />
      </div>

      <a-divider />

      <!-- 突破和丹药突破按钮 -->
      <a-space style="display: flex; justify-content: center; margin-top: 20px;" size="large">
        <a-button type="primary" @click="breakthrough" :disabled="!canBreakthrough">直接突破</a-button>
        <a-button type="primary" danger @click="showPotionModal" :disabled="!canBreakthrough">丹药突破</a-button>
      </a-space>

      <a-divider />

      <!-- 领取新手礼包按钮 -->
      <div style="text-align: center; margin-top: 10px;" v-if="!store.player.starterPackItems">
        <a-button type="primary" @click="claimStarterPack">领取新手礼包</a-button>
        <a-divider />
      </div>

      <a-tabs default-active-key="1" centered>
        <a-tab-pane key="1" tab="装备">
          <p>装备内容展示...</p>
        </a-tab-pane>

        <a-tab-pane key="2" tab="道具">
          <a-row gutter={16} justify="start" style="flex-wrap: wrap;">
            <a-col v-for="(item, index) in availableConsumable" :key="index" :xs="24" :sm="12" :md="8" :lg="6" :xl="4"
              style="display: flex; justify-content: center;">
              <a-space style="display: flex; justify-content: center;" size="middle">
                <a-button style="width: 100%; margin-bottom: 10px;">
                  {{ item.name }} ({{ item.quantity }})
                </a-button>
              </a-space>
            </a-col>
          </a-row>
        </a-tab-pane>

        <a-tab-pane key="3" tab="材料">
          <a-row gutter={16} justify="start" style="flex-wrap: wrap;">
            <a-col v-for="(item, index) in availableMeterial" :key="index" :xs="24" :sm="12" :md="8" :lg="6" :xl="4"
              style="display: flex; justify-content: center;">
              <a-space style="display: flex; justify-content: center;" size="middle">
                <a-button style="width: 100%; margin-bottom: 10px;">
                  {{ item.name }} ({{ item.quantity }})
                </a-button>
              </a-space>
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>

      <a-divider />
      <a-space style="display: flex; justify-content: center; margin-top: 20px;" size="large">
        <a-button type="primary" @click="goToHerbGathering">外出采药</a-button>
        <a-button type="primary" @click="goToAlchemyProcess">前往炼丹房</a-button>
        <a-button type="primary" @click="goToCryptoMining">外出挖矿</a-button>
      </a-space>

    </a-card>

    <!-- 选择丹药弹窗 -->
    <a-modal v-model:open="isPotionModalVisible" title="选择丹药" @ok="breakthroughWithPill" width="80%">
      <a-row gutter="16">
        <a-col v-for="(item, index) in filteredInventoryPill" :key="index" :span="24">
          <a-card :title="item.name" hoverable>
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <p>数量: {{ item.quantity }}</p>
              <div style="display: flex; align-items: center;">
                <a-button @click="decrementQuantity(item.name)" :disabled="item.selectedQuantity <= 0">-</a-button>
                <span style="margin: 0 8px;">{{ selectedQuantities.find(x => x.name === item.name).quantity }}</span>
                <a-button @click="incrementQuantity(item.name)"
                  :disabled="item.selectedQuantity >= item.quantity">+</a-button>
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';
import { useUpgradeStore } from '../stores/upgradeStore';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';

const store = useUpgradeStore();
const router = useRouter();

const isPotionModalVisible = ref(false);
const selectedQuantities = ref([{}]);

onMounted(() => {
  startGaining();
})

function startGaining() {
  store.startAutoGain();
}

function upgrade(stat) {
  store.upgradeStat(stat);
}

function goToHerbGathering() {
  router.push({ name: 'HerbGathering' });
}

function goToAlchemyProcess() {
  router.push({ name: 'AlchemyProcess' });
}

function goToCryptoMining() {
  router.push({ name: 'CryptoMining' });
}

// 计算属性，只返回数量大于 0 的物品
const availableConsumable = computed(() => {
  return store.filterItemByType('consumable');
});

const availableMeterial = computed(() => {
  return store.filterItemByType('material');
});

function breakthrough() {
  let res = store.attemptBreakthrough(); // 调用突破方法
  if (res) {
    message.success(`突破成功！恭喜道友步入${store.playerRealm.name}期。`);
  } else {
    message.error("突破失败！根基受损，道友还是巩固一下再来吧。")
  }
}

function breakthroughWithPill() {
  let res = store.attemptBreakthroughWithPill(selectedQuantities.value); // 调用突破方法
  isPotionModalVisible.value = false;
  if (res) {
    message.success(`突破成功！恭喜道友步入${store.playerRealm.name}期。`);
  } else {
    message.error("突破失败！根基受损，道友还是巩固一下再来吧。")
  }
}

function showPotionModal() {
  isPotionModalVisible.value = true; // 显示丹药选择弹窗
}

// 计算当前经验的进度百分比并保留两位小数
const progressPercent = computed(() => {
  const currentExp = store.playerExperience;
  const requiredExp = store.requiredExp;
  // 确保防止除以零的错误
  if (requiredExp === 0) return 0;
  return Math.min(((currentExp / requiredExp) * 100).toFixed(2), 100); // 计算进度百分比并保留两位小数
});

// 检查是否可以突破
const canBreakthrough = computed(() => {
  return store.playerLevel.level === 9 && store.player.experience >= store.playerLevel.experience && !store.player.breakthroughCooldown;
});

function claimStarterPack() {
  // 调用 store 的方法领取礼包
  store.addStarterPackItems();
  message.success('领取成功，获得初级筑基丹 x5，灵石 x1000');
}

// 筛选与当前境界相关的丹药
const filteredInventoryPill = computed(() => {
  const nextRealmName = store.nextRealm.name;
  const filteredItems = store.filterItemByName(nextRealmName);

  // 初始化 selectedQuantities 中对应的每种丹药的数量
  filteredItems.forEach(item => {
    if (!(item.name in selectedQuantities.value)) {
      selectedQuantities.value.push({ name: item.name, quantity: item.quantity }); // 初始化为 0
    }
  });

  return filteredItems;
});

// 增加和减少选择的数量
function incrementQuantity(itemName) {
  const pill = filteredInventoryPill.value.find(item => item.name === itemName);
  let selected = selectedQuantities.value.find(item => item.name === itemName);
  if (selected.quantity < pill.quantity) {
    selected.quantity++;
  }
}

function decrementQuantity(itemName) {
  let selected = selectedQuantities.value.find(item => item.name === itemName);
  if (selected.quantity > 0) {
    selected.quantity--;
  }
}

</script>