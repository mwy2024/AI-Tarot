import https from 'https';

https.get('https://www.lzqqq.org/assets/TarotRitualView-BHawUPVY.js', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const texts = data.match(/[\u4e00-\u9fa5]{2,}/g);
    if (texts) {
      console.log("Found Chinese texts in TarotRitualView:");
      console.log(Array.from(new Set(texts)).join(', '));
    }
    
    // Let's also try to extract some animation values or class names
    const classes = data.match(/class="[^"]+"/g);
    if (classes) {
      console.log("\nFound classes:");
      console.log(Array.from(new Set(classes)).slice(0, 20).join('\n'));
    }
  });
});
