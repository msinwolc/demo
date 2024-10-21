<!-- src/components/AutoUpgrade.vue -->
<template>
  <div style="padding: 20px;">
    <a-card title="修炼界面" style="width: 80%; margin: auto;">
      <!-- 当前境界信息 -->
      <p>当前境界: {{ store.playerRealName }}</p>
      <p>可用天赋点: {{ store.playerTalentPoints }}</p>

      <!-- 属性及加号按钮 -->
      <a-row gutter={16}>
        <a-col :xs="24" :sm="24" :md="12" :lg="12" v-for="(attribute, index) in basicAttributes" :key="index">
          <p>{{ attribute.label }}: {{ getAttributeValue(attribute.key) }}{{ attribute.multiplier === 100 ? '%' : '' }}
            <a-button v-if="attribute.canUpgrade" @click="upgrade(attribute.key)" size="small" icon="+"
              :disabled="store.playerTalentPoints <= 0" style="margin-left: 8px;"></a-button>
          </p>
        </a-col>
      </a-row>

      <!-- 进度条 -->
      <div style="text-align: center; margin-top: 20px;">
        <a-progress type="circle" :percent="progressPercent" status="active" :width="80" />
      </div>

      <a-divider />

      <!-- 当前功法显示 -->
      <!-- 当前功法信息 -->
      <p style="text-align: center; margin-top: 10px;">当前功法: </p>

      <!-- 显示已学会的功法按钮组 -->
      <a-row gutter={16} style="margin-top: 20px;">
        <a-col v-for="(technique, index) in store.currentActiveTechniques" :key="index" :xs="24" :sm="24" :md="12"
          :lg="6">
          <a-button>
            {{ technique.name }} (等级: {{ technique.level || 1 }})
          </a-button>
        </a-col>
      </a-row>

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
                <a-button style="width: 100%; margin-bottom: 10px;" @click="showConsumable(item)">
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

        <a-tab-pane key="4" tab="功法">
          <a-row gutter={16} justify="start" style="flex-wrap: wrap;">
            <a-col v-for="(item, index) in availableTechnique" :key="index" :xs="24" :sm="12" :md="8" :lg="6" :xl="4"
              style="display: flex; justify-content: center;">
              <a-space style="display: flex; justify-content: center;" size="middle">
                <a-button style="width: 100%; margin-bottom: 10px;" @click="showCultivationModal(item)">
                  {{ item.name }} ({{ item.quantity }})
                </a-button>
              </a-space>
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>

      <a-divider />
      <a-space style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-top: 20px;"
        size="large">
        <a-button type="primary" @click="goToHerbGathering">外出采药</a-button>
        <a-button type="primary" @click="goToAlchemyProcess">前往炼丹房</a-button>
        <a-button type="primary" @click="goToCryptoMining">外出挖矿</a-button>
        <a-button type="primary" @click="goToExplore">探索秘境</a-button>
      </a-space>

    </a-card>

    <!-- 修炼确认弹框 -->
    <a-modal v-model:open="isTechniqueModalVisible" title="确认修炼" @ok="startCultivating">
      <p>确定要修炼 <strong>{{ selectedTechnique ? selectedTechnique.name : '' }}</strong> 吗？(同时最多修炼一种功法)</p>
    </a-modal>

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

    <!-- 修炼确认弹框 -->
    <a-modal v-model:open="isConsumableModalVisible" title="道具详情">
      <h3>{{ selectedConsumItem.name }}</h3>
      <p><strong>作用:</strong> {{ selectedConsumItem.effect.desc }}</p>
      <div v-if="selectedConsumItem.effect.type !== 'money' && selectedConsumItem.effect.type !== 'breakProbability'">
        <a-button type="primary" @click="useItem">使用</a-button>
      </div>
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

const selectedQuantities = ref([{}]);
const selectedTechnique = ref(null);
const selectedConsumItem = ref({});

const isTechniqueModalVisible = ref(false);
const isPotionModalVisible = ref(false);
const isConsumableModalVisible = ref(false);

onMounted(() => {
  startGaining();
  continueCultivating();
})

// 属性列表
const basicAttributes = [
  { label: '血量', key: 'health', attr: 'playerHealth', canUpgrade: true, multiplier: 1 },
  { label: '攻击', key: 'attack', attr: 'playerAttack', canUpgrade: true, multiplier: 1 },
  { label: '防御', key: 'defense', attr: 'playerDefense', canUpgrade: true, multiplier: 1 },
  { label: '暴击率', key: 'critRate', attr: 'playerCriticalRate', multiplier: 100 },
  { label: '暴击伤害', key: 'critDamage', attr: 'playerCriticalDamage', multiplier: 100 },
  { label: '闪避', key: 'dodgeRate', attr: 'playerDodgeRate', multiplier: 100 }
];

const getAttributeValue = computed(() => (key) => {
  let attr = basicAttributes.find(x => x.key === key);
  return (store[attr.attr] * attr.multiplier).toFixed(0);
});

function startGaining() {
  store.startAutoGain();
}

function upgrade(attr) {
  store.upgradeStat(attr);
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

function goToExplore() {
  router.push({ name: 'ExploreProcess' });
}

// 计算属性，只返回数量大于 0 的物品
const availableConsumable = computed(() => {
  return store.filterItemByType('consumable');
});

const availableMeterial = computed(() => {
  return store.filterItemByType('material');
});

const availableTechnique = computed(() => {
  return store.filterItemByType('technique');
});

const showCultivationModal = (technique) => {
  selectedTechnique.value = technique;
  isTechniqueModalVisible.value = true;
}

const continueCultivating = () => {
  selectedTechnique.value = store.currentLearnTech;
  if (store.currentLearnTech !== null && store.currentLearnTech.name !== undefined && store.currentLearnTech.level !== 9) {
    autoCultivate(store.currentLearnTech);
  }
}

// 开始修炼功法
const startCultivating = () => {
  if (selectedTechnique.value) {
    if (!store.currentLearnTech) {
      message.success(`你已经学会 ${selectedTechnique.value.name}！`);
      // 开启修炼的自动进程
      autoCultivate(selectedTechnique.value);
    } else if (store.currentLearnTech && store.currentLearnTech.exp !== undefined && store.currentLearnTech.exp !== 0) {
      message.warn(`已经有在修炼的功法！`);
    }
  }
  // 关闭弹框
  isTechniqueModalVisible.value = false;
}

const autoCultivate = (technique) => {
  store.addTechnique(selectedTechnique.value)
  const autoCultivateInterval = setInterval(() => {
    // 增加修炼经验
    technique.exp = (technique.exp || 0) + 10;
    technique.level = technique.level || 1;
    const allLevels = store.techniqueList.find(t => t.name === technique.name).levels;
    // 升级逻辑
    if (technique.exp >= allLevels[technique.level - 1].requiredExp) {
      if (technique.level >= allLevels.length) {
        message.success(`${technique.name} 已修炼至最高等级`);
        clearInterval(autoCultivateInterval);
        store.changecurrentLearnTech(technique);
      } else {
        technique.level++;
        technique.exp = 0; // 经验归零
        store.addBasicAttrByTech();
        store.addAttackAttrByTech();
        message.success(`${technique.name} 升级到 ${technique.level}级！`);
        store.changecurrentLearnTech(technique);
      }
    }
  }, 1000); // 每秒自动增加经验
}

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
  message.success('领取成功，获得初级筑基丹 x5，灵石 x1000，引灵诀 x1，紫霞真气 x1，烈焰刀诀 x1');
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

const showConsumable = (item) => {
  isConsumableModalVisible.value = true;
  selectedConsumItem.value = item;
}

</script>