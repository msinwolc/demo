export const pillRecipes = [
    {
        name: "筑基丹",
        requiredRealm: "炼气",
        effect: {
            type: "breakProbability",
            desc: "增加突破到筑基期的成功概率",
            addCount: 0.1,
        },
        materials: [
            { name: "千年灵芝", quantity: 1 },
            { name: "地火莲子", quantity: 2 },
            { name: "紫云果", quantity: 3 },
            { name: "三叶草", quantity: 5 }
        ]
    },
    {
        name: "结丹丹",
        requiredRealm: "筑基",
        effect: {
            type: "breakProbability",
            desc: "增加突破到金丹期的成功概率",
            addCount: 0.05,
        },
        materials: [
            { name: "赤炎果", quantity: 2 },
            { name: "寒铁草", quantity: 1 },
            { name: "天青石", quantity: 2 },
            { name: "赤血藤", quantity: 3 }
        ]
    },
    {
        name: "元婴丹",
        requiredRealm: "金丹",
        effect: {
            type: "breakProbability",
            desc: "增加突破到元婴期的成功概率",
            addCount: 0.04,
        },
        materials: [
            { name: "龙髓花", quantity: 1 },
            { name: "紫晶草", quantity: 2 },
            { name: "太阴寒玉", quantity: 1 },
            { name: "幽冥芝", quantity: 3 }
        ]
    },
    {
        name: "分神丹",
        requiredRealm: "元婴",
        effect: {
            type: "breakProbability",
            desc: "增加突破到分神期的成功概率",
            addCount: 0.03,
        },
        materials: [
            { name: "雷击木", quantity: 2 },
            { name: "七星草", quantity: 1 },
            { name: "天霜露", quantity: 1 },
            { name: "灵玄果", quantity: 2 }
        ]
    },
    {
        name: "合体丹",
        requiredRealm: "分神",
        effect: {
            type: "breakProbability",
            desc: "增加突破到合体期的成功概率",
            addCount: 0.03,
        },
        materials: [
            { name: "九叶龙藤", quantity: 1 },
            { name: "化神莲", quantity: 1 },
            { name: "千年血参", quantity: 2 },
            { name: "天罡石", quantity: 3 }
        ]
    },
    {
        name: "大乘丹",
        requiredRealm: "合体",
        effect: {
            type: "breakProbability",
            desc: "增加突破到大乘期的成功概率",
            addCount: 0.02,
        },
        materials: [
            { name: "凤凰涅槃草", quantity: 1 },
            { name: "昆仑仙果", quantity: 2 },
            { name: "太虚水晶", quantity: 1 },
            { name: "赤龙髓", quantity: 2 }
        ]
    },
    {
        name: "渡劫丹",
        requiredRealm: "大乘",
        effect: {
            type: "breakProbability",
            desc: "增加突破到渡劫期的成功概率",
            addCount: 0.02,
        },
        materials: [
            { name: "雷霆果", quantity: 1 },
            { name: "天元石", quantity: 2 },
            { name: "虎骨精粉", quantity: 1 },
            { name: "龙鳞草", quantity: 3 }
        ]
    },
    {
        name: "升仙丹",
        requiredRealm: "渡劫",
        effect: {
            type: "breakProbability",
            desc: "增加突破到地仙期的成功概率",
            addCount: 0.01,
        },
        materials: [
            { name: "九天玄火石", quantity: 1 },
            { name: "五行神果", quantity: 1 },
            { name: "星辰晶髓", quantity: 2 },
            { name: "仙灵露", quantity: 1 }
        ]
    },
    {
        name: "清灵丹",
        requiredRealm: "炼气",
        effect: {
            type: "addExp",
            desc: "增加少许灵气的丹药",
            addCount: 10,
        },
        materials: [
            { name: "灵芝", quantity: 1 },
            { name: "雪莲花", quantity: 2 },
            { name: "百年人参", quantity: 2 },
            { name: "野狼内丹", quantity: 5 }
        ]
    },
];

export default pillRecipes;
