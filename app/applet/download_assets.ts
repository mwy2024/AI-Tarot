import https from 'https';
import fs from 'fs';
import path from 'path';

const chunks = [
  'RecipeBookView-C-92DHJi.js',
  'vue-vendor-CFPFDbVi.js',
  'ChefDashboard-nuUFfNl4.js',
  'AdminLandingView-BT4Df-X7.js',
  'MyOrdersView-DNKEU-gb.js',
  'RecipeManagerView-DlAcAdyS.js',
  'RecipeEditorView-BC1Hx2Jg.js',
  'ChefLoginView-CQ4RnQHk.js',
  'InventoryView-E4thkMU7.js',
  'BlogListView-CQ-mZQYr.js',
  'BlogPostView-fzIyGjLw.js',
  'markdown-DajSjiQI.js',
  'index-CUxC9xgx.js',
  'BlogEditorView-DmCIWPfC.js',
  'BlogManagerView-DiP2jidh.js',
  'AiLabView-CuWmi8Rk.js',
  'AiLabStudioView-ClxocN5O.js',
  'AuthView-BXjQ536X.js',
  'QuestionGenView-CNN2L7PY.js',
  'PortfolioHomeView-B2h7dQ3b.js',
  'GamesHubView-D84pX6e8.js',
  'GomokuView-DstOOPpK.js',
  'TarotSanctumView-DSddR0al.js',
  'StarField-CXx_Dpy9.js',
  'TarotRitualView-BHawUPVY.js',
  'index-BdO5ESOc.js'
];

const dir = path.join(process.cwd(), 'lzq_assets');
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

chunks.forEach(chunk => {
  https.get(`https://www.lzqqq.org/assets/${chunk}`, (res) => {
    let data = '';
    res.on('data', (c) => data += c);
    res.on('end', () => {
      fs.writeFileSync(path.join(dir, chunk), data);
      console.log(`Downloaded ${chunk}`);
    });
  });
});
