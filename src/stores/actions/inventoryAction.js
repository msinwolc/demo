// src/stores/actions/inventoryAction.js

export const inventoryAction = {
    // 添加物品到背包
    addItemToInventory(item) {
        const existingItem = this.getItemByName(item.name);
        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            this.inventory.push({ ...item, quantity: item.quantity || 1 });
        }
    },
    // 从背包移除物品
    removeItemFromInventory(itemName, quantity) {
        const item = this.getItemByName(itemName);
        if (item) {
            item.quantity -= quantity;
            if (item.quantity <= 0) {
                this.player.inventory = this.player.inventory.filter(i => i.name !== itemName);
            }
        }
    },
    // 新增方法：添加新手礼包的道具
    addStarterPackItems() {
        const danyao = { name: '初级筑基丹', quantity: 5, successRate: 0.1, type: 'consumable' };
        const money = { name: '灵石', quantity: 1000, type: 'consumable' }
        this.addItemToInventory(danyao);
        this.addItemToInventory(money);
        this.player.starterPackItems = true;
    },
    getItemByName(name) {
        return this.player.inventory.find(item => item.name === name);
    },
    getInventoryQuantity(materialName) {
        const item = this.getItemByName(materialName);
        return item ? item.quantity : 0;
    },
};