import fs from 'fs';

const data = fs.readFileSync('lzq_assets/TarotRitualView-BHawUPVY.js', 'utf8');
const strings = data.match(/"[^"]+"/g);
if (strings) {
  console.log(Array.from(new Set(strings)).slice(0, 100).join('\n'));
}
