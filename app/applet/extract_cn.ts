import fs from 'fs';

const files = fs.readdirSync('lzq_assets');
files.forEach(f => {
  const data = fs.readFileSync('lzq_assets/' + f, 'utf8');
  const matches = data.match(/[\u4e00-\u9fa5]{2,}/g);
  if (matches) {
    console.log(f, Array.from(new Set(matches)).slice(0, 10).join(', '));
  }
});
