# 塔罗仪式 (Tarot Ritual)

✨ 一个基于AI的交互式塔罗牌占卜应用，使用Google Gemini API提供智能解读。

## 📌 项目简介

这是一个现代化的数字塔罗牌占卜平台，结合了3D可视化、流式AI生成和实时对话功能。用户可以通过选择塔罗牌卡片，获得基于AI的个性化占卜解读。

### ✨ 核心特性

- 🎴 **多种牌阵支持** - 单牌阵和三牌阵（过去、现在、未来）
- 🤖 **AI智能解读** - 集成Google Gemini API，基于塔罗知识库的智能生成
- 🎨 **3D可视化** - 使用Three.js和React Three Fiber创建沉浸式背景
- ✨ **流式输出** - 实时显示AI生成的解读过程
- 💬 **后续提问** - 支持与AI进行多轮对话深入探讨
- 🌍 **中英文支持** - 完整的双语界面
- 📱 **响应式设计** - 使用Tailwind CSS构建现代化UI

## 🚀 快速开始

### 前置要求

- Node.js >= 18.0
- npm 或 yarn
- Google AI API 密钥（Gemini）
- （可选）代理配置

### 环境配置

在项目根目录创建 `.env` 文件：

```env
# Google AI / Gemini API 配置
VITE_GOOGLE_AI_API_KEY=your_google_ai_api_key

# 如果使用自定义AI后端（可选）
API_BASE_URL=https://api.example.com
API_MODEL=glm-4-flash
API_KEY=your_api_key

# 代理配置（如需要）
HTTPS_PROXY=http://proxy.example.com:8080
```

### 安装依赖

```bash
npm install
```

### 开发模式

运行前端开发服务器（端口3000）：

```bash
npm run dev
```

同时运行后端服务器（用于RAG和AI集成）：

```bash
npm run dev:all
```

单独运行后端服务器：

```bash
npm run server
```

### 生产构建

```bash
npm run build
```

预览构建结果：

```bash
npm run preview
```

## 📂 项目结构

```
tarot-ritual/
├── src/                          # 前端应用源码
│   ├── components/
│   │   ├── Background3D.tsx       # 3D星空背景
│   │   ├── TarotCard.tsx          # 塔罗牌卡片组件
│   │   ├── ShuffleView.tsx        # 洗牌动画视图
│   │   ├── FollowUpChat.tsx       # 后续提问对话框
│   │   ├── MagicCircle.tsx        # 魔法圆圈装饰
│   │   └── StarryOverlay.tsx      # 星空叠加效果
│   ├── services/
│   │   └── gemini.ts             # Gemini API集成
│   ├── utils/
│   │   └── tarotData.ts          # 塔罗牌数据库
│   ├── App.tsx                   # 主应用组件
│   ├── main.tsx                  # 应用入口
│   └── index.css                 # 全局样式
│
├── server/                       # 后端服务器
│   ├── index.ts                  # Express服务器主文件
│   ├── tarotKnowledgeBase.ts     # 塔罗知识库
│   ├── vectorStore.ts            # 向量存储（RAG）
│   ├── embeddings-cache.json     # 嵌入缓存
│   └── tsconfig.json
│
├── app/applet/                   # 数据提取工具脚本
│   ├── fetch_tarot.ts            # 获取塔罗数据
│   ├── extract_cn.ts             # 提取中文信息
│   └── ...其他数据处理脚本
│
├── public/                       # 静态资源
│   └── cards/                    # 塔罗牌图片
│
├── package.json                  # 项目依赖配置
├── vite.config.ts                # Vite构建配置
├── tsconfig.json                 # TypeScript配置
└── index.html                    # HTML入口

```

## 🛠 技术栈

### 前端
- **React 19** - UI框架
- **TypeScript** - 类型安全
- **Three.js** - 3D图形库
- **React Three Fiber** - React + Three.js整合
- **Tailwind CSS** - 样式框架
- **Motion/Framer** - 动画库
- **Vite** - 构建工具

### 后端
- **Express** - Web框架
- **OpenAI SDK** - AI API集成
- **TypeScript** - 类型安全

### AI/数据处理
- **Google Gemini API** - AI模型
- **RAG (Retrieval-Augmented Generation)** - 向量搜索增强
- **向量嵌入** - 语义理解

## 🎮 使用流程

1. **打开应用** - 访问Web界面
2. **选择牌阵** - 选择单牌或三牌阵
3. **提出问题** - 输入你想要询问的问题
4. **洗牌选牌** - 动画演示洗牌过程，然后从卡片中选择
5. **查看解读** - 实时显示AI生成的占卜解读
6. **后续提问** - 可以继续提问深入了解

## 📋 可用命令

| 命令 | 描述 |
|------|------|
| `npm run dev` | 启动前端开发服务器 |
| `npm run server` | 启动后端服务器 |
| `npm run dev:all` | 同时启动前端和后端 |
| `npm run build` | 构建生产版本 |
| `npm run preview` | 预览构建结果 |
| `npm run clean` | 清除build输出目录 |
| `npm run lint` | 类型检查 |

## 🔧 配置选项

### API配置

支持多种AI后端配置：

- **Google Gemini** (推荐) - 直接使用Google AI API
- **自定义API** - 支持通过 `API_BASE_URL` 配置自定义AI服务
- **代理支持** - 通过 `HTTPS_PROXY` 环境变量配置代理

### 塔罗数据

- 支持78张完整塔罗牌
- 包含中文和英文牌名
- 支持正位和逆位解读
- 每张牌都有详细的传统解释

## 🎨 自定义

### 修改问题列表

编辑 [src/App.tsx](src/App.tsx) 中的 `RANDOM_QUESTIONS` 数组：

```typescript
const RANDOM_QUESTIONS = [
  "你的自定义问题1",
  "你的自定义问题2",
  // ...
];
```

### 调整动画效果

编辑各个组件文件中的动画参数：
- [src/components/ShuffleView.tsx](src/components/ShuffleView.tsx) - 洗牌动画
- [src/components/Background3D.tsx](src/components/Background3D.tsx) - 3D背景效果

## 🚨 故障排除

### API连接错误
- 检查API密钥是否正确配置
- 验证网络连接和代理设置
- 查看浏览器控制台中的错误信息

### AI模型响应缓慢
- 检查网络延迟
- 尝试使用更快的模型（如 `glm-4-flash`）
- 增加流式请求的超时时间

### 3D背景不显示
- 检查浏览器是否支持WebGL
- 更新显卡驱动程序
- 尝试关闭硬件加速

## 📝 许可证

Apache License 2.0

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📧 联系方式

如有问题或建议，请通过以下方式联系：
- 提交GitHub Issue
- 联系项目维护者

---

**注**: 这是一个个性化的AI占卜应用，仅供娱乐和参考之用。占卜结果不能作为真实决策的依据。
