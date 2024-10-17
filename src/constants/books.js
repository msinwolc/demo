export const books = [
    {
        name: '引灵法',
        type: 'cultivationSpeed',
        requiredReal: '炼气',
        levels: generateLevels(9, 0.01, 100),
    },
    {
        name: '五行聚灵功',
        type: 'cultivationSpeed',
        requiredReal: '筑基',
        levels: generateLevels(9, 0.02, 1000),
    },
    {
        name: '八荒纳气诀',
        type: 'cultivationSpeed',
        requiredReal: '金丹',
        levels: generateLevels(9, 0.02, 2000),
    },
    {
        name: '星辰炼气诀',
        type: 'cultivationSpeed',
        requiredReal: '元婴',
        levels: generateLevels(9, 0.03, 2500),
    },
    {
        name: '万象吞天法',
        type: 'cultivationSpeed',
        requiredReal: '分神',
        levels: generateLevels(9, 0.03, 2700),
    },
    {
        name: '灵元归一法',
        type: 'cultivationSpeed',
        requiredReal: '合体',
        levels: generateLevels(9, 0.03, 2800),
    },
    {
        name: '紫气东来诀',
        type: 'cultivationSpeed',
        requiredReal: '大乘',
        levels: generateLevels(9, 0.04, 3000),
    },
    {
        name: '紫霞真气',
        type: 'basicAttributes',
        requiredReal: '炼气',
        levels: generateLevels(9, 0.01, 100),
    },
    {
        name: '天罡霸体诀',
        type: 'basicAttributes',
        requiredReal: '炼气',
        levels: generateLevels(9, 0.01, 1000),
    },
    {
        name: '五岳镇山诀',
        type: 'basicAttributes',
        requiredReal: '炼气',
        levels: generateLevels(9, 0.01, 1000),
    },
    {
        name: '青龙伏魔体',
        type: 'basicAttributes',
        requiredReal: '炼气',
        levels: generateLevels(9, 0.01, 1000),
    },
    {
        name: '苍穹战体诀',
        type: 'basicAttributes',
        requiredReal: '炼气',
        levels: generateLevels(9, 0.01, 1000),
    },
    {
        name: '太古洪荒体',
        type: 'basicAttributes',
        requiredReal: '炼气',
        levels: generateLevels(9, 0.01, 1000),
    },
    {
        name: '玉女回春功',
        type: 'basicAttributes',
        requiredReal: '炼气',
        levels: generateLevels(9, 0.01, 1000),
    },
    {
        name: '烈焰刀诀',
        type: 'skills',
        requiredReal: '炼气',
        levels: generateLevels(9, 0.01, 1000),
    },
    {
        name: '雷霆剑诀',
        type: 'skills',
        requiredReal: '炼气',
        levels: generateLevels(9, 0.01, 1000),
    },
    {
        name: '寒星碎影掌',
        type: 'skills',
        requiredReal: '炼气',
        levels: generateLevels(9, 0.01, 1000),
    },
    {
        name: '疾风迅影枪',
        type: 'skills',
        requiredReal: '炼气',
        levels: generateLevels(9, 0.01, 1000),
    },
    {
        name: '烈日焚天诀',
        type: 'skills',
        requiredReal: '炼气',
        levels: generateLevels(9, 0.01, 1000),
    },
    {
        name: '霸天裂空拳',
        type: 'skills',
        requiredReal: '炼气',
        levels: generateLevels(9, 0.01, 1000),
    },
    {
        name: '苍龙吟天诀',
        type: 'skills',
        requiredReal: '炼气',
        levels: generateLevels(9, 0.01, 1000),
    },
    {
        name: '苍龙吟天诀',
        type: 'skills',
        requiredReal: '炼气',
        levels: generateLevels(9, 0.01, 1000),
    },
]

// 功法层级生成函数
function generateLevels(maxLevel, baseEffect, baseExp) {
    const levels = [];
    for (let i = 1; i <= maxLevel; i++) {
        levels.push({
            level: i,
            effect: baseEffect * i,
            requiredExp: baseExp * i,
        });
    }
    return levels;
}
