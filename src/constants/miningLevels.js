// miningLevels.js
export const miningLevels = [
    { 
        name: '石徒', 
        requiredExperience: 1, 
        miningBonus: 1.0 // 初学者阶段，无加成
    },
    { 
        name: '石匠', 
        requiredExperience: 100, 
        miningBonus: 1.2 // 开采铜矿时有20%加成
    },
    { 
        name: '铁矿师', 
        requiredExperience: 300, 
        miningBonus: 1.5 // 开采铁矿时有50%加成
    },
    { 
        name: '玄矿士', 
        requiredExperience: 600, 
        miningBonus: 1.8 // 开采稀有矿石时有80%加成
    },
    { 
        name: '灵石匠', 
        requiredExperience: 1000, 
        miningBonus: 2.0 // 灵气矿石有100%加成
    },
    { 
        name: '宝矿师', 
        requiredExperience: 1500, 
        miningBonus: 2.5 // 宝石矿石有150%加成
    },
    { 
        name: '精矿大师', 
        requiredExperience: 2100, 
        miningBonus: 3.0 // 高品质矿石有200%加成
    },
    { 
        name: '地脉探者', 
        requiredExperience: 2800, 
        miningBonus: 3.5 // 地脉矿物有250%加成
    },
    { 
        name: '天矿宗师', 
        requiredExperience: 3600, 
        miningBonus: 4.0 // 天材地宝级矿物有300%加成
    },
    { 
        name: '灵脉圣匠', 
        requiredExperience: 4500, 
        miningBonus: 4.5 // 灵脉矿物有350%加成
    },
    { 
        name: '天工神匠', 
        requiredExperience: 5500, 
        miningBonus: 5.0 // 传说级矿物有400%加成
    }
];
