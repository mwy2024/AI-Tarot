import https from 'https';

https.get('https://www.lzqqq.org/assets/TarotSanctumView-DSddR0al.js', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const texts = data.match(/[\u4e00-\u9fa5]{2,}/g);
    if (texts) {
      console.log("Found Chinese texts in TarotSanctumView:");
      console.log(Array.from(new Set(texts)).join(', '));
    }
  });
});
