import fs from 'fs';

const data = fs.readFileSync('lzq_assets/TarotRitualView-BHawUPVY.js', 'utf8');
const cnStrings = data.match(/[\u4e00-\u9fa5]+/g);
if (cnStrings) {
  const counts = {};
  for (const s of cnStrings) {
    counts[s] = (counts[s] || 0) + 1;
  }
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  console.log(sorted.slice(0, 50).map(x => `${x[0]}: ${x[1]}`).join('\n'));
}
