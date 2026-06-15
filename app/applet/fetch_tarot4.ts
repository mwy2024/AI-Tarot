import https from 'https';

https.get('https://www.lzqqq.org/assets/TarotRitualView-BHawUPVY.js', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const strings = data.match(/"[^"]+"/g);
    if (strings) {
      console.log("Strings in TarotRitualView:");
      console.log(Array.from(new Set(strings)).slice(0, 100).join('\n'));
    }
  });
});
