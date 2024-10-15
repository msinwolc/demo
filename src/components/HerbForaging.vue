<template>
    <div style="padding: 20px;">
        <a-card title="采药" style="width: 80%; margin: auto;">
            <h2>选择区域采药</h2>
            <a-row>
                <a-col v-for="(realm, index) in realms" :key="index" :span="8">
                    <a-button @click="forage(realm)" style="margin-bottom: 10px;">
                        {{ realmToMap[realm.name] || realm.name }}
                    </a-button>
                </a-col>
            </a-row>

            <a-divider />

            <div v-for="(message, index) in gainedMaterials" :key="index">
                <p>{{ message }}</p>
            </div>
        </a-card>
    </div>
</template>

<script setup>
import { realms, realmToMap } from '@/constants/realms'; // 确保 realms 被正确导入
import { pillRecipes } from '@/constants/pill'
// import { message } from 'ant-design-vue';
import { useUpgradeStore } from '@/stores/upgradeStore';
import { ref } from 'vue';

const store = useUpgradeStore();

const gainedMaterials = ref([]);
const maxMessages = 10; // 设置最大消息数

function forage(realm) {
    const success = Math.random() < 0.5; // 设置成功概率
    if (success) {
        // 随机选择一种材料
        const materials = getMaterialsForRealm(realm);
        if (materials.length > 0) {
            const gainedMaterial = materials[Math.floor(Math.random() * materials.length)];
            const randomQuantity = Math.floor(Math.random() * 10) + 1;
            // 将获得的材料添加到背包
            store.addItemToInventory({ name: gainedMaterial.name, quantity: randomQuantity });
            let msg = `成功获得: ${gainedMaterial.name} x ${randomQuantity}`;
            removeMsg();
            gainedMaterials.value.push(msg);
        } else {
            let msg = '未能获得材料，请再试一次！';
            removeMsg();
            gainedMaterials.value.push(msg);
        }
    } else {
        let msg = '未能获得材料，请再试一次！';
        removeMsg();
        gainedMaterials.value.push(msg);
    }
}

function removeMsg() {
    // 如果超过最大消息数，移除最旧的消息
    if (gainedMaterials.value.length >= maxMessages) {
        gainedMaterials.value.shift(); // 移除最旧的消息
    }
}

// 根据境界返回相应的材料
function getMaterialsForRealm(realm) {
    // 找到对应的丹药
    const pillRecipe = pillRecipes.find(pill => pill.name.includes(realm.name));
    // 返回材料列表，如果没有找到对应的丹药，则返回空数组
    return pillRecipe ? pillRecipe.materials : [];
}
</script>

<style scoped>
/* 添加样式 */
</style>