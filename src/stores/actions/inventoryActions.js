// src/stores/actions/inventoryActions.js

export const inventoryActions = {
    // 添加物品到背包
    addItemToInventory(item) {
        const existingItem = this.getItemByName(item.name);
        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            this.player.inventory.push({ ...item, quantity: item.quantity || 1 });
        }
    },
    // 从背包移除物品
    removeItemFromInventory(itemName, quantity) {
        const item = this.getItemByName(itemName);
        if (item) {
            item.quantity -= quantity;
            if (item.quantity <= 0) {
                item.quantity = 0;
            }
        }
    },
    // 新增方法：添加新手礼包的道具
    addStarterPackItems() {
        const danyao = {
            name: '初级筑基丹', quantity: 5, type: 'consumable', requiredRealm: "炼气",
            effect: {
                type: "breakProbability",
                desc: "增加突破到筑基期的成功概率",
                addCount: 0.1,
            },
        };
        const money = {
            name: '灵石', quantity: 1000, type: 'consumable', effect: {
                type: "money",
                desc: "修士们之间广泛使用的基础货币",
            },
        };
        const technique1 = { name: '引灵诀', quantity: 1, type: 'technique', effect: 'cultivationSpeed' };
        const technique2 = { name: '紫霞真气', quantity: 1, type: 'technique', effect: 'basicAttributes' };
        const technique3 = { name: '烈焰刀诀', quantity: 1, type: 'technique', effect: 'skills' };
        this.addItemToInventory(danyao);
        this.addItemToInventory(money);
        this.addItemToInventory(technique1);
        this.addItemToInventory(technique2);
        this.addItemToInventory(technique3);
        this.player.starterPackItems = true;
    },
    getItemByName(name) {
        return this.player.inventory.find(item => item.name === name);
    },
    getInventoryQuantity(materialName) {
        const item = this.getItemByName(materialName);
        return item ? item.quantity : 0;
    },
    filterItemByType(type) {
        return this.player.inventory.filter(item => item.quantity > 0 && item.type === type);
    },
    filterItemByName(name) {
        return this.player.inventory.filter(item => item.name.includes(name));
    },
};