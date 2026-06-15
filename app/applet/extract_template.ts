import fs from 'fs';

const data = fs.readFileSync('lzq_assets/TarotRitualView-BHawUPVY.js', 'utf8');
const templateMatches = data.match(/createElementVNode\([^)]+\)/g);
if (templateMatches) {
  console.log("Found createElementVNode:");
  console.log(templateMatches.slice(0, 10).join('\n'));
}

const createVNodeMatches = data.match(/createVNode\([^)]+\)/g);
if (createVNodeMatches) {
  console.log("Found createVNode:");
  console.log(createVNodeMatches.slice(0, 10).join('\n'));
}

const strings = data.match(/"[^"]+"/g);
if (strings) {
  const cnStrings = strings.filter(s => /[\u4e00-\u9fa5]/.test(s));
  console.log("Chinese strings:");
  console.log(Array.from(new Set(cnStrings)).join('\n'));
}
