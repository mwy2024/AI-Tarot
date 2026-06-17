# AI塔罗

一个用AI做塔罗占卜解读的小项目，用智谱API生成解读内容，前端做了3D背景和流式输出，通过前端设计尽量还原塔罗占卜体验。

## 项目简介

输入想问的问题，选一个牌阵（单牌或者三牌），抽牌之后AI会结合塔罗知识库给出解读，解读完还能继续追问。项目包括AI应用的全套流程：从RAG检索、流式生成，到前端的3D交互动画。

### 功能

- 单牌阵和三牌阵（过去、现在、未来）两种玩法
- 接入智谱API，解读基于塔罗知识库做RAG增强
- Three.js做的3D星空背景，洗牌动画
- 解读是流式输出的
- 解读完可以继续追问，多轮对话

## 快速开始

### 准备

- Node.js >= 18.0
- npm 或 yarn
- API key（可在[智谱AI开放平台](https://open.bigmodel.cn/)免费申请）


### 配置环境变量

项目根目录新建一个 `.env` 文件：

```env
# 智谱API配置
API_BASE_URL=https://open.bigmodel.cn/api/paas/v4
API_MODEL=glm-4-flash
API_KEY=your_zhipu_api_key
```

### 安装依赖

```bash
npm install
```

### 开发模式

跑前端（端口3000）：

```bash
npm run dev
```

前端+后端一起跑（RAG和AI接口需要后端）：

```bash
npm run dev:all
```

## 项目结构

```
tarot-ritual/
├── src/                          # 前端代码
│   ├── components/
│   │   ├── Background3D.tsx       # 3D星空背景
│   │   ├── TarotCard.tsx          # 塔罗牌卡片
│   │   ├── ShuffleView.tsx        # 洗牌动画
│   │   ├── FollowUpChat.tsx       # 追问对话框
│   │   ├── MagicCircle.tsx        # 魔法圆圈装饰
│   │   └── StarryOverlay.tsx      # 星空叠加效果
│   ├── services/
│   │   └── zhipu.ts              # 智谱API调用
│   ├── utils/
│   │   └── tarotData.ts          # 塔罗牌数据
│   ├── App.tsx                   # 主组件
│   ├── main.tsx                  # 入口
│   └── index.css                 # 全局样式
│
├── server/                       # 后端
│   ├── index.ts                  # Express服务
│   ├── tarotKnowledgeBase.ts     # 塔罗知识库
│   ├── vectorStore.ts            # 向量存储（RAG用）
│   ├── embeddings-cache.json     # 嵌入缓存
│   └── tsconfig.json
│
├── app/applet/                   # 数据处理脚本
│   ├── fetch_tarot.ts            # 抓塔罗牌数据
│   ├── extract_cn.ts             # 提取中文信息
│   └── ...
│
├── public/
│   └── cards/                    # 塔罗牌图片
│
├── package.json
├── vite.config.ts
├── tsconfig.json
└── index.html
```

## 技术栈

前端：React 19 + TypeScript + Three.js（配React Three Fiber）+ Tailwind CSS + Motion动画库，Vite构建。

后端：Express + TypeScript，调用智谱API的SDK做生成。

AI部分：智谱GLM做解读生成，自建了一个向量库做RAG，检索塔罗知识库里相关的牌意再喂给模型，减少瞎编的情况。

## 使用流程

1. 打开网页
2. 选单牌还是三牌阵
3. 输入想问的问题
4. 看洗牌动画，选牌
5. AI流式生成解读，实时显示
6. 还想追问，可以接着聊

## 命令一览

| 命令 | 作用 |
|------|------|
| `npm run dev` | 启动前端 |
| `npm run server` | 启动后端 |
| `npm run dev:all` | 前后端一起启动 |
| `npm run build` | 打包生产版本 |
| `npm run preview` | 预览打包结果 |
| `npm run clean` | 清掉build输出 |
| `npm run lint` | 类型检查 |

## 塔罗数据

78张牌全的，中英文牌名都有，正逆位都支持，每张牌带传统释义。

## 想改点东西？

### 改问题列表

[src/App.tsx](src/App.tsx) 里的 `RANDOM_QUESTIONS` 数组，改成你想要的问题就行：

```typescript
const RANDOM_QUESTIONS = [
  "你的自定义问题1",
  "你的自定义问题2",
  // ...
];
```

### 改动画

洗牌动画在 [src/components/ShuffleView.tsx](src/components/ShuffleView.tsx)，3D背景在 [src/components/Background3D.tsx](src/components/Background3D.tsx)，里面的动画参数都能调。


## 优化计划：A/B测试

这个项目现在解读风格、UI呈现方式都是写死的，但其实有不少地方值得测一测哪种效果更好。可以做三组对比：

**1. Prompt风格**

A组走神秘风格，语言充满隐喻；B组走理性分析风格，更接近心理咨询的语气。两种风格同时生成，让用户自己选更喜欢哪个（类似GPT那种双回答对比的方式）。

**2. UI呈现方式**

A组保持现在的流式逐字输出；B组改为加载完直接整段展示。衡量标准是阅读完整率和页面停留时长，看看哪种方式完读率更高。

**3. 解读详细程度**

A组是简洁版，控制在150词以内；B组是详细版，大概400词，包含牌面分析和具体行动建议。采用双回答对比、用户选择的方式来收集数据。

---

**注**：AI占卜解读结果仅供娱乐。