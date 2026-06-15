export type CardKnowledge = {
  keywords: string[];
  upright: string;
  reversed: string;
};

export type KnowledgeChunk = {
  id: string;
  cardName: string;
  cardNameCn: string;
  text: string;
  type: 'keywords' | 'upright' | 'reversed';
};

const MAJOR_CN: Record<string, string> = {
  "The Fool": "愚者", "The Magician": "魔术师", "The High Priestess": "女祭司",
  "The Empress": "皇后", "The Emperor": "皇帝", "The Hierophant": "教皇",
  "The Lovers": "恋人", "The Chariot": "战车", "Strength": "力量",
  "The Hermit": "隐士", "Wheel of Fortune": "命运之轮", "Justice": "正义",
  "The Hanged Man": "倒吊人", "Death": "死神", "Temperance": "节制",
  "The Devil": "恶魔", "The Tower": "塔", "The Star": "星星",
  "The Moon": "月亮", "The Sun": "太阳", "Judgement": "审判", "The World": "世界",
};

const SUITS_CN: Record<string, string> = {
  "Wands": "权杖", "Cups": "圣杯", "Swords": "宝剑", "Pentacles": "钱币",
};

const RANKS_CN: Record<string, string> = {
  "Ace": "一", "Two": "二", "Three": "三", "Four": "四", "Five": "五",
  "Six": "六", "Seven": "七", "Eight": "八", "Nine": "九", "Ten": "十",
  "Page": "侍从", "Knight": "骑士", "Queen": "王后", "King": "国王",
};

// 大阿卡纳
const MAJOR_KNOWLEDGE: Record<string, CardKnowledge> = {
  "The Fool": {
    keywords: ["新的开始", "冒险", "纯真", "自由", "无限可能"],
    upright: "新的开始、冒险精神、纯真、自由、无限可能。愚者正位鼓励你勇敢踏出第一步，相信直觉，拥抱未知。代表机遇和新的可能性。",
    reversed: "鲁莽、冲动、缺乏计划、逃避责任、愚蠢的决定。愚者逆位提醒你要谨慎行事，不要盲目冒险。代表需要更多的考虑和准备。"
  },
  "The Magician": {
    keywords: ["创造力", "意志力", "技能", "自信", "行动力"],
    upright: "创造力、意志力、技能、自信、行动力。魔术师正位表示你有能力实现目标，现在是将想法付诸行动的时候。代表能力与机遇的结合。",
    reversed: "欺骗、操纵、缺乏方向、浪费才能、沟通障碍。魔术师逆位提醒你要诚实面对自己和他人。代表才能的误用或欺骗。"
  },
  "The High Priestess": {
    keywords: ["直觉", "神秘", "内在智慧", "等待", "隐藏的真相"],
    upright: "直觉、神秘、内在智慧、等待、隐藏的真相。女祭司正位鼓励你倾听内心的声音，相信直觉。代表需要静心倾听内在。",
    reversed: "忽视直觉、表面化、秘密暴露、缺乏耐心。女祭司逆位提醒你不要忽视内心的声音。代表与内在智慧的断连。"
  },
  "The Empress": {
    keywords: ["丰盛", "母性", "创造力", "滋养", "美", "怀孕"],
    upright: "丰盛、母性、创造力、滋养、美、怀孕。皇后正位代表丰盛和滋养，是创造和成长的时期。代表丰盛和滋养的能量。",
    reversed: "缺乏滋养、创造力受阻、过度依赖、忽视自我照顾。皇后逆位提醒你要照顾好自己。代表滋养能量的缺失。"
  },
  "The Emperor": {
    keywords: ["权威", "结构", "稳定", "领导", "保护"],
    upright: "权威、结构、稳定、领导、保护。皇帝正位代表秩序和稳定，是建立基础和行使领导力的时期。代表秩序和权威的能量。",
    reversed: "专制、僵化、控制欲、缺乏纪律、滥用权力。皇帝逆位提醒你要平衡权威与灵活。代表权威的滥用或缺失。"
  },
  "The Hierophant": {
    keywords: ["传统", "信仰", "教育", "精神指导", "群体归属"],
    upright: "传统、信仰、教育、精神指导、群体归属。教皇正位代表遵循传统和寻求指导。代表传统和精神支持。",
    reversed: "打破传统、个人信仰、反叛、教条主义。教皇逆位可能代表打破传统或寻找自己的道路。代表对传统的挑战。"
  },
  "The Lovers": {
    keywords: ["爱情", "和谐", "选择", "价值观统一", "伙伴关系"],
    upright: "爱情、和谐、选择、价值观统一、伙伴关系。恋人正位代表美好的关系和重要的选择。代表和谐的关系和正确的选择。",
    reversed: "关系问题、价值观冲突、错误的选择、不和谐。恋人逆位提醒你要审视关系和选择。代表关系或选择的挑战。"
  },
  "The Chariot": {
    keywords: ["胜利", "决心", "意志力", "控制", "前进"],
    upright: "胜利、决心、意志力、控制、前进。战车正位代表通过意志力取得胜利。代表胜利和前进的能量。",
    reversed: "失去控制、缺乏方向、挫折、攻击性。战车逆位提醒你要重新找回方向和控制。代表失控或挫折。"
  },
  "Strength": {
    keywords: ["勇气", "内在力量", "耐心", "自我控制", "温柔"],
    upright: "勇气、内在力量、耐心、自我控制、温柔。力量正位代表以柔克刚的智慧。代表内在的勇气和力量。",
    reversed: "缺乏自信、自我怀疑、软弱、失去耐心。力量逆位提醒你要相信自己的内在力量。代表内在力量的缺失。"
  },
  "The Hermit": {
    keywords: ["内省", "智慧", "独处", "寻找答案", "精神指导"],
    upright: "内省、智慧、独处、寻找答案、精神指导。隐士正位代表需要独处和内省。代表内省和智慧的时期。",
    reversed: "孤立、退缩、拒绝帮助、过度内省。隐士逆位提醒你要平衡独处与社交。代表过度的孤立或退缩。"
  },
  "Wheel of Fortune": {
    keywords: ["好运", "机遇", "变化", "命运转折", "循环"],
    upright: "好运、机遇、变化、命运转折、循环。命运之轮正位代表好运和有利的转变。代表好运和机遇。",
    reversed: "厄运、抗拒变化、失控、挫折。命运之轮逆位提醒你要接受变化。代表不利的转变或抗拒变化。"
  },
  "Justice": {
    keywords: ["公正", "真相", "因果", "法律事务", "平衡"],
    upright: "公正、真相、因果、法律事务、平衡。正义正位代表公正的结果和真相的显现。代表公正和真相。",
    reversed: "不公正、逃避责任、失衡、不诚实。正义逆位提醒你要诚实面对真相。代表不公正或逃避真相。"
  },
  "The Hanged Man": {
    keywords: ["牺牲", "等待", "新视角", "放下", "转变"],
    upright: "牺牲、等待、新视角、放下、转变。倒吊人正位代表需要暂停和从不同角度看问题。代表暂停和新视角。",
    reversed: "无谓的牺牲、拖延、抗拒改变、僵局。倒吊人逆位提醒你要行动起来。代表停滞或无谓的牺牲。"
  },
  "Death": {
    keywords: ["结束", "转变", "重生", "放下", "新开始"],
    upright: "结束、转变、重生、放下、新开始。死神正位代表旧的结束和新的开始。代表必要的结束和转变。",
    reversed: "抗拒改变、停滞、恐惧、无法放下。死神逆位提醒你要接受必要的改变。代表抗拒必要的改变。"
  },
  "Temperance": {
    keywords: ["平衡", "调和", "耐心", "适度", "和谐"],
    upright: "平衡、调和、耐心、适度、和谐。节制正位代表找到平衡和和谐。代表平衡和调和。",
    reversed: "失衡、过度、不和谐、缺乏耐心。节制逆位提醒你要找回平衡。代表失衡或过度。"
  },
  "The Devil": {
    keywords: ["束缚", "诱惑", "阴影", "物质主义", "依赖"],
    upright: "束缚、诱惑、阴影、物质主义、依赖。恶魔正位代表需要面对的阴影和束缚。代表需要认识和面对的束缚。",
    reversed: "解脱、打破束缚、面对阴影、自由。恶魔逆位代表打破束缚和获得自由。代表解脱和自由。"
  },
  "The Tower": {
    keywords: ["突然改变", "毁灭", "觉醒", "真相显现", "解放"],
    upright: "突然改变、毁灭、觉醒、真相显现、解放。塔正位代表必要的破坏和重建。代表必要的毁灭和觉醒。",
    reversed: "避免灾难、恐惧改变、延迟的觉醒、内在转变。塔逆位代表改变正在内在发生。代表内在的转变或延迟的改变。"
  },
  "The Star": {
    keywords: ["希望", "灵感", "治愈", "平静", "信心"],
    upright: "希望、灵感、治愈、平静、信心。星星正位代表希望和治愈的时期。代表希望和治愈。",
    reversed: "失去希望、缺乏灵感、绝望、失去信心。星星逆位提醒你要重新找回希望。代表希望的缺失。"
  },
  "The Moon": {
    keywords: ["直觉", "潜意识", "幻觉", "不确定性", "内在恐惧"],
    upright: "直觉、潜意识、幻觉、不确定性、内在恐惧。月亮正位代表需要面对内在的恐惧和不确定性。代表直觉和潜意识的探索。",
    reversed: "释放恐惧、真相显现、克服幻觉、清晰。月亮逆位代表恐惧的释放和真相的显现。代表克服恐惧和幻觉。"
  },
  "The Sun": {
    keywords: ["成功", "喜悦", "活力", "积极", "光明"],
    upright: "成功、喜悦、活力、积极、光明。太阳正位是最积极的牌之一，代表成功和幸福。代表成功和喜悦。",
    reversed: "暂时的挫折、过度乐观、延迟的成功、内在的喜悦。太阳逆位代表成功可能延迟，但仍在路上。代表暂时的挫折或延迟的成功。"
  },
  "Judgement": {
    keywords: ["觉醒", "重生", "内在召唤", "反思", "决定"],
    upright: "觉醒、重生、内在召唤、反思、决定。审判正位代表听到内在召唤并做出决定。代表觉醒和重生。",
    reversed: "自我怀疑、拒绝召唤、逃避反思、无法原谅。审判逆位提醒你要倾听内在的声音。代表拒绝觉醒或逃避召唤。"
  },
  "The World": {
    keywords: ["完成", "圆满", "整合", "成就", "旅程的终点"],
    upright: "完成、圆满、整合、成就、旅程的终点。世界正位代表旅程的完成和目标的达成。代表圆满和成就。",
    reversed: "未完成、延迟的完成、缺乏闭合、需要整合。世界逆位代表需要完成未竟之事。代表未完成或需要整合。"
  }
};

const SUITS_MAP: Record<string, string> = {
  "Wands": "行动、热情、创意、事业",
  "Cups": "情感、关系、直觉、灵性",
  "Swords": "思维、沟通、冲突、真相",
  "Pentacles": "物质、资源、健康、财富"
};

const RANKS_MAP: Record<string, { keyword: string, description: string }> = {
  "Ace": { keyword: "新创意、灵感、机会", description: "新的开始，能量的涌入。" },
  "Two": { keyword: "规划、远见、选择", description: "在选项中平衡或寻求合作。" },
  "Three": { keyword: "扩展、冒险、探索", description: "初步的成果或向外发展。" },
  "Four": { keyword: "庆祝、稳定、家庭幸福", description: "基础的建立，休息与巩固。" },
  "Five": { keyword: "竞争、冲突、挑战", description: "遇到挫折或面对困境。" },
  "Six": { keyword: "胜利、认可、自信", description: "重新找回平衡，获得支持或成功。" },
  "Seven": { keyword: "防御、坚持、斗争", description: "坚定立场，评估选项。" },
  "Eight": { keyword: "迅速发展、消息、前进", description: "能量流动加快，专注行动。" },
  "Nine": { keyword: "坚持、警惕、韧性", description: "接近完成，但也可能有压力或满足感。" },
  "Ten": { keyword: "责任、压力、负担", description: "周期的结束，可能是重担也可能是极致圆满。" },
  "Page": { keyword: "冒险、探索、创造力", description: "学习与探索的态度，新的消息。" },
  "Knight": { keyword: "行动力、冲动、旅行", description: "积极推进，追求目标的过程。" },
  "Queen": { keyword: "热情、独立、领导力", description: "内在的掌控与滋养，成熟的体现。" },
  "King": { keyword: "影响力、权威、愿景", description: "对于外在领域的掌控与稳健领导。" }
};

export function getAllChunks(): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = [];

  // 大阿卡纳：每张牌 3 个块
  for (const [name, k] of Object.entries(MAJOR_KNOWLEDGE)) {
    const cn = MAJOR_CN[name] ?? name;
    chunks.push({ id: `${name}::keywords`, cardName: name, cardNameCn: cn, type: 'keywords',
      text: `${cn} 关键词：${k.keywords.join('、')}` });
    chunks.push({ id: `${name}::upright`, cardName: name, cardNameCn: cn, type: 'upright',
      text: `${cn} 正位含义：${k.upright}` });
    chunks.push({ id: `${name}::reversed`, cardName: name, cardNameCn: cn, type: 'reversed',
      text: `${cn} 逆位含义：${k.reversed}` });
  }

  // 小阿卡纳：每张牌 2 个块（56 张 × 2 = 112）
  const suits = ["Wands", "Cups", "Swords", "Pentacles"];
  const ranks = ["Ace","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Page","Knight","Queen","King"];
  for (const suit of suits) {
    for (const rank of ranks) {
      const cardName = `${rank} of ${suit}`;
      const nameCn = `${SUITS_CN[suit]}${RANKS_CN[rank]}`;
      const k = getCardKnowledge(cardName);
      chunks.push({ id: `${cardName}::upright`, cardName, cardNameCn: nameCn, type: 'upright',
        text: `${nameCn} 关键词与正位：${k.keywords.join('、')}。${k.upright}` });
      chunks.push({ id: `${cardName}::reversed`, cardName, cardNameCn: nameCn, type: 'reversed',
        text: `${nameCn} 逆位含义：${k.reversed}` });
    }
  }

  return chunks;
}

export function getCardKnowledge(cardName: string): CardKnowledge {
  if (MAJOR_KNOWLEDGE[cardName]) {
    return MAJOR_KNOWLEDGE[cardName];
  }

  // 小阿卡纳
  const parts = cardName.split(' of ');
  if (parts.length === 2) {
    const rank = parts[0];
    const suit = parts[1];
    
    const suitDesc = SUITS_MAP[suit] || "一般性生活面向";
    const rankData = RANKS_MAP[rank] || { keyword: "未知阶段", description: "需要探索的阶段" };
    
    return {
      keywords: [suitDesc, rankData.keyword],
      upright: `在${suitDesc}方面：${rankData.keyword}。${rankData.description}`,
      reversed: `在${suitDesc}方面（逆位影响）：可能意味着能量受阻、延迟或过度表达。建议审视这方面是否失去了平衡。`
    };
  }

  // Fallback
  return {
    keywords: ["未知探索", "潜意识浮现"],
    upright: "代表当前状态具有探索空间。建议保持觉察，专注当下的内心感受。",
    reversed: "可能意味着内在存在某些未被看见的需求。建议多倾听身体与情绪的声音。"
  };
}
