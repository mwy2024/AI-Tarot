export const MAJOR_ARCANA = [
  { id: 0, name: "The Fool", nameCn: "愚者", numeral: "0", image: "/cards/00-fool.jpg" },
  { id: 1, name: "The Magician", nameCn: "魔术师", numeral: "I", image: "/cards/01-magician.jpg" },
  { id: 2, name: "The High Priestess", nameCn: "女祭司", numeral: "II", image: "/cards/02-high-priestess.jpg" },
  { id: 3, name: "The Empress", nameCn: "皇后", numeral: "III", image: "/cards/03-empress.jpg" },
  { id: 4, name: "The Emperor", nameCn: "皇帝", numeral: "IV", image: "/cards/04-emperor.jpg" },
  { id: 5, name: "The Hierophant", nameCn: "教皇", numeral: "V", image: "/cards/05-hierophant.jpg" },
  { id: 6, name: "The Lovers", nameCn: "恋人", numeral: "VI", image: "/cards/06-lovers.jpg" },
  { id: 7, name: "The Chariot", nameCn: "战车", numeral: "VII", image: "/cards/07-chariot.jpg" },
  { id: 8, name: "Strength", nameCn: "力量", numeral: "VIII", image: "/cards/08-strength.jpg" },
  { id: 9, name: "The Hermit", nameCn: "隐士", numeral: "IX", image: "/cards/09-hermit.jpg" },
  { id: 10, name: "Wheel of Fortune", nameCn: "命运之轮", numeral: "X", image: "/cards/10-wheel-of-fortune.jpg" },
  { id: 11, name: "Justice", nameCn: "正义", numeral: "XI", image: "/cards/11-justice.jpg" },
  { id: 12, name: "The Hanged Man", nameCn: "倒吊人", numeral: "XII", image: "/cards/12-hanged-man.jpg" },
  { id: 13, name: "Death", nameCn: "死神", numeral: "XIII", image: "/cards/13-death.jpg" },
  { id: 14, name: "Temperance", nameCn: "节制", numeral: "XIV", image: "/cards/14-temperance.jpg" },
  { id: 15, name: "The Devil", nameCn: "恶魔", numeral: "XV", image: "/cards/15-devil.jpg" },
  { id: 16, name: "The Tower", nameCn: "塔", numeral: "XVI", image: "/cards/16-tower.jpg" },
  { id: 17, name: "The Star", nameCn: "星星", numeral: "XVII", image: "/cards/17-star.jpg" },
  { id: 18, name: "The Moon", nameCn: "月亮", numeral: "XVIII", image: "/cards/18-moon.jpg" },
  { id: 19, name: "The Sun", nameCn: "太阳", numeral: "XIX", image: "/cards/19-sun.jpg" },
  { id: 20, name: "Judgement", nameCn: "审判", numeral: "XX", image: "/cards/20-judgement.jpg" },
  { id: 21, name: "The World", nameCn: "世界", numeral: "XXI", image: "/cards/21-world.jpg" },
];

const suits = ["Wands", "Cups", "Swords", "Pentacles"];
const suitsLocal = ["wands", "cups", "swords", "pentacles"];
const suitsCn = ["权杖", "圣杯", "宝剑", "钱币"];
const ranks = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Page", "Knight", "Queen", "King"];
const ranksLocal = ["ace", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "page", "knight", "queen", "king"];
const ranksCn = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "侍从", "骑士", "王后", "国王"];
const numerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "Page", "Knight", "Queen", "King"];

export const MINOR_ARCANA = suits.flatMap((suit, suitIndex) =>
  ranks.map((rank, rankIndex) => ({
    id: 22 + suitIndex * 14 + rankIndex,
    name: `${rank} of ${suit}`,
    nameCn: `${suitsCn[suitIndex]}${ranksCn[rankIndex]}`,
    numeral: numerals[rankIndex],
    image: `/cards/${suitsLocal[suitIndex]}-${ranksLocal[rankIndex]}.jpg`,
  }))
);

export const TAROT_DECK = [...MAJOR_ARCANA, ...MINOR_ARCANA];
