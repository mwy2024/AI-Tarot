/**
 * 下载 Rider-Waite 塔罗牌全套图片 (78张) 到 public/cards/
 * 运行方式：npx tsx app/applet/download_cards.ts
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, '../../public/cards');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// ── 大阿卡纳 (22张) — 直接 URL ──────────────────────────────────────────────
const MAJOR: [string, string][] = [
  ['https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg',            '00-fool'],
  ['https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg',        '01-magician'],
  ['https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg',  '02-high-priestess'],
  ['https://upload.wikimedia.org/wikipedia/commons/d/d2/RWS_Tarot_03_Empress.jpg',         '03-empress'],
  ['https://upload.wikimedia.org/wikipedia/commons/c/c3/RWS_Tarot_04_Emperor.jpg',         '04-emperor'],
  ['https://upload.wikimedia.org/wikipedia/commons/8/8d/RWS_Tarot_05_Hierophant.jpg',      '05-hierophant'],
  ['https://upload.wikimedia.org/wikipedia/commons/3/3a/RWS_Tarot_06_Lovers.jpg',          '06-lovers'],
  ['https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg',         '07-chariot'],
  ['https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg',        '08-strength'],
  ['https://upload.wikimedia.org/wikipedia/commons/4/4d/RWS_Tarot_09_Hermit.jpg',          '09-hermit'],
  ['https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg','10-wheel-of-fortune'],
  ['https://upload.wikimedia.org/wikipedia/commons/e/e0/RWS_Tarot_11_Justice.jpg',         '11-justice'],
  ['https://upload.wikimedia.org/wikipedia/commons/2/2b/RWS_Tarot_12_Hanged_Man.jpg',      '12-hanged-man'],
  ['https://upload.wikimedia.org/wikipedia/commons/d/d7/RWS_Tarot_13_Death.jpg',           '13-death'],
  ['https://upload.wikimedia.org/wikipedia/commons/f/f8/RWS_Tarot_14_Temperance.jpg',      '14-temperance'],
  ['https://upload.wikimedia.org/wikipedia/commons/5/55/RWS_Tarot_15_Devil.jpg',           '15-devil'],
  ['https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg',           '16-tower'],
  ['https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_17_Star.jpg',            '17-star'],
  ['https://upload.wikimedia.org/wikipedia/commons/7/7f/RWS_Tarot_18_Moon.jpg',            '18-moon'],
  ['https://upload.wikimedia.org/wikipedia/commons/1/17/RWS_Tarot_19_Sun.jpg',             '19-sun'],
  ['https://upload.wikimedia.org/wikipedia/commons/d/dd/RWS_Tarot_20_Judgment.jpg',        '20-judgement'],
  ['https://upload.wikimedia.org/wikipedia/commons/f/ff/RWS_Tarot_21_World.jpg',           '21-world'],
];

// ── 小阿卡纳 (56张) — 通过 Wikimedia API 查真实 URL ─────────────────────────
// Wikimedia Commons 上 RWS 小阿卡纳的候选文件名（按可能性从高到低排列）
const SUITS = ['Wands', 'Cups', 'Swords', 'Pentacles'] as const;
const SUIT_LOWER = ['wands', 'cups', 'swords', 'pentacles'] as const;
// Pentacles 在 Wikimedia 上有时缩写为 Pents
const SUIT_WIKI_ALT = ['Wands', 'Cups', 'Swords', 'Pents'] as const;
const RANK_NAMES = ['ace','two','three','four','five','six','seven','eight','nine','ten','page','knight','queen','king'];

function candidateFilenames(suit: string, suitAlt: string, rankIndex: number): string[] {
  const num2 = String(rankIndex + 1).padStart(2, '0');
  const num1 = String(rankIndex + 1);
  return [
    // 短格式（最常见）
    `${suit}${num2}.jpg`,
    `${suitAlt}${num2}.jpg`,
    `${suit}${num1}.jpg`,
    // 带 Tarot_ 前缀
    `Tarot_${suit}_${num2}.jpg`,
    `Tarot_${suitAlt}_${num2}.jpg`,
    // 带 RWS_ 前缀
    `RWS_Tarot_${suit}_${num2}.jpg`,
  ];
}

// ── 工具函数 ─────────────────────────────────────────────────────────────────
function getWikiUrl(filename: string): Promise<string | null> {
  return new Promise((resolve) => {
    const api = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(filename)}&prop=imageinfo&iiprop=url&format=json`;
    const req = https.get(api, { headers: { 'User-Agent': 'TarotDownloader/2.0' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          for (const page of Object.values(json.query.pages) as any[]) {
            if (page.imageinfo?.[0]?.url) { resolve(page.imageinfo[0].url); return; }
          }
          resolve(null);
        } catch { resolve(null); }
      });
    });
    req.on('error', () => resolve(null));
    req.setTimeout(8000, () => { req.destroy(); resolve(null); });
  });
}

function download(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const doGet = (u: string) => {
      const file = fs.createWriteStream(dest);
      https.get(u, { headers: { 'User-Agent': 'TarotDownloader/2.0' } }, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          file.close(); fs.existsSync(dest) && fs.unlinkSync(dest);
          doGet(res.headers.location!); return;
        }
        res.pipe(file);
        file.on('finish', () => file.close(() => resolve()));
        file.on('error', reject);
      }).on('error', (e) => { fs.existsSync(dest) && fs.unlinkSync(dest); reject(e); });
    };
    doGet(url);
  });
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// ── 主流程 ───────────────────────────────────────────────────────────────────
async function main() {
  let ok = 0, skip = 0, fail = 0;

  // 1. 大阿卡纳（直接 URL）
  for (const [url, localName] of MAJOR) {
    const dest = path.join(OUT_DIR, `${localName}.jpg`);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 5000) {
      console.log(`⏭  skip  ${localName}`); skip++; continue;
    }
    try {
      await download(url, dest);
      console.log(`✓  ok    ${localName}  (${(fs.statSync(dest).size/1024).toFixed(0)}KB)`);
      ok++; await sleep(200);
    } catch (e: any) {
      console.log(`✗  fail  ${localName}: ${e.message}`); fail++;
    }
  }

  // 2. 小阿卡纳（通过 API 找正确 URL）
  for (let si = 0; si < SUITS.length; si++) {
    for (let ri = 0; ri < 14; ri++) {
      const localName = `${SUIT_LOWER[si]}-${RANK_NAMES[ri]}`;
      const dest = path.join(OUT_DIR, `${localName}.jpg`);

      if (fs.existsSync(dest) && fs.statSync(dest).size > 5000) {
        console.log(`⏭  skip  ${localName}`); skip++; continue;
      }

      const candidates = candidateFilenames(SUITS[si], SUIT_WIKI_ALT[si], ri);
      let found = false;

      for (const fname of candidates) {
        const url = await getWikiUrl(fname);
        if (!url) { await sleep(100); continue; }
        try {
          await download(url, dest);
          const size = fs.statSync(dest).size;
          if (size < 1000) { fs.unlinkSync(dest); continue; } // 太小说明不对
          console.log(`✓  ok    ${localName}  [${fname}]  (${(size/1024).toFixed(0)}KB)`);
          ok++; found = true; await sleep(300); break;
        } catch { /* 试下一个候选 */ }
      }

      if (!found) {
        console.log(`✗  fail  ${localName}  (tried: ${candidates.slice(0,3).join(', ')} ...)`);
        fail++;
      }
    }
  }

  console.log(`\n完成！✓ 成功: ${ok}  ⏭ 跳过: ${skip}  ✗ 失败: ${fail}`);
  console.log(`图片目录: ${OUT_DIR}`);
}

main();
