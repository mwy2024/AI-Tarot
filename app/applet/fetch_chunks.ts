import https from 'https';

https.get('https://www.lzqqq.org/assets/index-BdO5ESOc.js', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const chunks = data.match(/[a-zA-Z0-9_-]+\.js/g);
    if (chunks) {
      console.log("Found JS chunks:");
      console.log(Array.from(new Set(chunks)).join('\n'));
    }
  });
});
