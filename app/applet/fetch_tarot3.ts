import https from 'https';

https.get('https://www.lzqqq.org/assets/TarotSanctumView-DSddR0al.js', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log(data.substring(0, 1000));
    
    const strings = data.match(/"[^"]+"/g);
    if (strings) {
      console.log("\nStrings:");
      console.log(Array.from(new Set(strings)).slice(0, 50).join(', '));
    }
  });
});
