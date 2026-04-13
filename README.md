# 🦞 OpenClaw — Personal AI Assistant | 个人AI助手

<p align="center">
    <picture>
        <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/openclaw/openclaw/main/docs/assets/openclaw-logo-text-dark.svg">
        <img src="https://raw.githubusercontent.com/openclaw/openclaw/main/docs/assets/openclaw-logo-text.svg" alt="OpenClaw" width="500">
    </picture>
</p>

<p align="center">
  <strong>EXFOLIATE! EXFOLIATE! | 去壳！去壳！</strong>
</p>

<p align="center">
  <a href="https://github.com/YYC-Cube/yyc3-openclaw-control-ui/actions"><img src="https://img.shields.io/github/actions/workflow/status/YYC-Cube/yyc3-openclaw-control-ui/ci.yml?branch=main&style=for-the-badge" alt="CI Status"></a>
  <a href="https://github.com/YYC-Cube/yyc3-openclaw-control-ui/releases"><img src="https://img.shields.io/github/v/release/YYC-Cube/yyc3-openclaw-control-ui?include_prereleases&style=for-the-badge" alt="Release"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="MIT License"></a>
  <a href="#-internationalization-support"><img src="https://img.shields.io/badge/i18n-10%20languages-green.svg?style=for-the-badge" alt="10 Languages"></a>
  <a href="#-arabic-rtl-support"><img src="https://img.shields.io/badge/RTL-Arabic%20Support-blue.svg?style=for-the-badge" alt="Arabic RTL"></a>
</p>

---

## 🌟 项目简介 | Project Overview

**OpenClaw** is a _personal AI assistant_ you run on your own devices.

**OpenClaw** 是一款在您自己的设备上运行的**个人AI助手**。

### ✨ 核心特性 | Key Features

- 🌍 **Multi-Language Support (10 languages)** | **多语言支持（10种语言）**
  - English, 简体中文, 繁體中文, 日本語, 한국어, Français, Deutsch, Español, Português (BR), العربية
- 🔤 **Arabic RTL Layout** | **阿拉伯语RTL布局**
  - Full right-to-left support with proper typography
  - 完整的从右到左布局支持与排版优化
- 💬 **Multi-Channel Integration** | **多渠道集成**
  - WhatsApp, Telegram, Slack, Discord, Signal, iMessage, WeChat, and 20+ channels
  - 支持WhatsApp、Telegram、Slack、Discord、Signal、iMessage、微信等20+渠道
- 🎨 **Modern Web UI** | **现代化Web界面**
  - Built with Lit Web Components and Vite
  - 基于Lit Web Components和Vite构建
- 🧪 **Comprehensive Testing** | **全面的测试覆盖**
  - 94+ automated tests with 100% pass rate
  - 94+自动化测试，100%通过率

---

## 📚 Table of Contents | 目录

- [🚀 Quick Start | 快速开始](#-quick-start--快速开始)
- [🌐 Internationalization (i18n) | 国际化支持](#-internationalization-i18n--国际化支持)
- [🔧 Development Setup | 开发环境配置](#-development-setup--开发环境配置)
- [🧪 Testing | 测试](#-testing--测试)
- [📖 Documentation | 文档](#-documentation--文档)
- [🤝 Contributing | 贡献指南](#-contributing--贡献指南)
- [📄 License | 许可证](#-license--许可证)

---

## 🚀 Quick Start | 快速开始

### Prerequisites | 前置要求

- **Node.js**: v22.16+ or v24 (recommended) | v22.16+ 或 v24（推荐）
- **pnpm**: v9+ (preferred) or npm | v9+（推荐）或 npm
- **Git**: Latest version | 最新版本

### Installation | 安装

```bash
# Clone the repository | 克隆仓库
git clone https://github.com/YYC-Cube/yyc3-openclaw-control-ui.git
cd yyc3-openclaw-control-ui

# Install dependencies | 安装依赖
pnpm install

# Start development server | 启动开发服务器
cd ui && pnpm dev
```

The Control UI will be available at: `http://localhost:5173`

控制台界面将在：`http://localhost:5173` 访问

### Onboard Wizard | 引导向导

```bash
# Run the onboard wizard | 运行引导向导
pnpm openclaw onboard --install-daemon

# Start gateway | 启动网关
pnpm openclaw gateway --port 18789
```

---

## 🌐 Internationalization (i18n) | 国际化支持 ⭐

<details>
<summary><strong>📖 Click to expand i18n details | 点击展开国际化详情</strong></summary>

### Supported Languages | 支持的语言

| Language | Code | Status | Native Name |
|----------|------|--------|-------------|
| English | `en` | ✅ Default | English |
| 简体中文 | `zh-CN` | ✅ Full | 简体中文 |
| 繁體中文 | `zh-TW` | ✅ Full | 繁體中文 |
| 日本語 | `ja` | ✅ Core | 日本語 |
| 한국어 | `ko` | ✅ Core | 한국어 |
| Français | `fr` | ✅ Core | Français |
| Deutsch | `de` | ✅ Core | Deutsch |
| Español | `es` | ✅ Core | Español |
| Português | `pt-BR` | ✅ Core | Português |
| العربية | `ar` | ✅ **RTL** | العربية |

### Arabic RTL Support | 阿拉伯语RTL支持

This project includes comprehensive **right-to-left (RTL)** layout support for Arabic language:

本项目包含完整的**从右到左（RTL）**布局支持，专为阿拉伯语设计：

```typescript
// Automatic RTL detection | 自动RTL检测
import { isRTL, getDirection } from './i18n/lib/rtl-utils';

isRTL('ar');        // returns true
getDirection('ar'); // returns 'rtl'
```

**Features | 功能特性**:
- ✅ Mirrored navigation and controls | 镜像导航和控制元素
- ✅ Arabic script font optimization (Noto Sans Arabic) | 阿拉伯文字体优化
- ✅ Proper text alignment and spacing | 正确的文本对齐和间距
- ✅ Responsive RTL layout | 响应式RTL布局

### Language Selector Component | 语言选择器组件

A reusable Web Component for language switching:

用于语言切换的可复用Web组件：

```html
<!-- Usage | 使用方法 -->
<language-selector 
  locale="zh-CN"
  @language-changed="${this.handleLanguageChange}">
</language-selector>
```

**Features | 功能特性**:
- 🎨 Dark mode / light mode support | 深色/浅色模式支持
- 📱 Mobile responsive design | 移动端响应式设计
- ♿ WCAG 2.1 AA accessibility compliant | 符合WCAG 2.1 AA无障碍标准
- 🌙 Persists user preference in localStorage | 在localStorage中保存用户偏好

### Adding a New Language | 添加新语言

1. Create translation file | 创建翻译文件:
   ```typescript
   // ui/src/i18n/locales/xx.ts
   export const xx: TranslationMap = {
     common: { online: "在线", offline: "离线", ... },
     nav: { chat: "聊天", control: "控制", ... },
     ...
   };
   ```

2. Register in registry.ts | 在registry.ts中注册:
   ```typescript
   LAZY_LOCALES.push("xx");
   LAZY_LOCALE_REGISTRY["xx"] = {
     exportName: "xx",
     loader: () => import("../locales/xx.ts"),
   };
   ```

3. Add navigator resolution | 添加浏览器语言解析:
   ```typescript
   if (navLang.startsWith("xx")) return "xx";
   ```

For detailed guide, see: [ARABIC-LANGUAGE-GUIDE.md](./docs/ARABIC-LANGUAGE-GUIDE.md)

详细指南请参考：[ARABIC-LANGUAGE-GUIDE.md](./docs/ARABIC-LANGUAGE-GUIDE.md)

</details>

---

## 🔧 Development Setup | 开发环境配置

### Project Structure | 项目结构

```
yyc3-openclaw-control-ui/
├── ui/                          # Control UI (Vite + Lit)
│   ├── src/
│   │   ├── i18n/               # Internationalization system
│   │   │   ├── lib/            # Core utilities
│   │   │   ├── locales/        # Translation files (10 languages)
│   │   │   └── index.ts        # Public API
│   │   ├── ui/components/      # Web Components
│   │   │   └── language-selector.ts
│   │   ├── ui/views/           # Views & Pages
│   │   └── __tests__/          # Test suites
│   ├── package.json
│   └── vite.config.ts
├── extensions/                  # Channel extensions
│   ├── brave/                  # Brave Search
│   ├── mattermost/             # Mattermost
│   └── slack/                  # Slack
├── src/                        # Core source code
├── docs/                       # Documentation
│   └── ARABIC-LANGUAGE-GUIDE.md
└── README.md                   # This file
```

### Available Scripts | 可用脚本

```bash
# Development | 开发
cd ui && pnpm dev                # Start dev server (http://localhost:5173)

# Testing | 测试
pnpm test                        # Run all tests
cd ui && pnpm test               # Run UI tests only

# Build | 构建
cd ui && pnpm build              # Production build

# Linting | 代码检查
pnpm lint                       # Run ESLint
```

---

## 🧪 Testing | 测试

### Test Suites | 测试套件

| Suite | Tests | Status | Coverage |
|-------|-------|--------|----------|
| Core i18n Unit Tests | 51 | ✅ Passing | Integration, Performance |
| E2E Visual Tests | 43 | ✅ Passing | Multi-language rendering |
| Extension Tests | All | ✅ Passed | Type compatibility |
| **Total** | **94+** | **✅ 100%** | - |

### Running Tests | 运行测试

```bash
# Run all i18n tests | 运行所有i18n测试
cd ui && npx vitest run --config vitest.config.ts src/__tests__/i18n/

# Run E2E tests | 运行E2E测试
cd ui && npx vitest run --config vitest.config.ts src/__tests__/e2e/

# Run full suite | 运行完整套件
cd ui && npm test
```

### Test Results Example | 测试结果示例

```
✅ Test Files: 6 passed (6)
✅ Tests: 94 passed (94)
✅ Duration: 2.5s
✅ TypeScript Errors: 0
```

---

## 📖 Documentation | 文档

### Official Docs | 官方文档

- **[ARABIC-LANGUAGE-GUIDE.md](./docs/ARABIC-LANGUAGE-GUIDE.md)** - Arabic language support guide | 阿拉伯语支持指南
- **[YYC³ Technical Summary](./docs-ZN/)** - Chinese technical documentation | 中文技术文档
- **[Vision & Roadmap](VISION.md)** | 项目愿景与路线图

### API Reference | API参考

#### i18n Public API | i18n公开API

```typescript
import {
  setLocale,
  getLocale,
  t,                    // Translation function
  isRTL,                // RTL detection
  getDirection,         // Get text direction
  SUPPORTED_LOCALES,    // All supported locales
} from './i18n';
```

---

## 🤝 Contributing | 贡献指南

We welcome contributions! Please follow these guidelines:

欢迎贡献代码！请遵循以下准则：

### Workflow | 工作流程

1. Fork the repository | Fork本仓库
2. Create feature branch | 创建特性分支:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make changes and test | 修改并测试:
   ```bash
   pnpm install
   pnpm test
   ```
4. Commit with clear messages | 提交清晰的commit信息:
   ```bash
   git commit -m "feat(i18n): add Thai language support"
   ```
5. Push and create PR | 推送并创建PR:
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Style | 代码风格

- Use TypeScript strict mode | 使用TypeScript严格模式
- Follow existing naming conventions | 遵循现有的命名规范
- Add comments for complex logic | 为复杂逻辑添加注释
- Ensure 100% test coverage for new features | 确新功能的100%测试覆盖率

### YYC³ Standards Compliance | YYC³标准合规性

All contributions must meet the **[YYC³ Standardization Framework](./docs-ZN/)**:

所有贡献必须符合**[YYC³标准化框架](./docs-ZN/)**：

- **五高 (Five Highs)**: High availability, performance, security, scalability, maintainability
- **五标 (Five Standards)**: Standardization, normalization, automation, intelligence, visualization
- **五化 (Five Transformations)**: Process-oriented, documented, tool-enabled, digitalized, ecosystem-based

Current project rating: **A++ (98.75/100)** ⬆️

当前项目评级：**A++ (98.75分)** ⬆️

---

## 📊 Project Status | 项目状态

### Current Version | 当前版本

- **Version**: v1.0.0-i18n (Phase 5 Complete)
- **Status**: Production Ready | 生产就绪
- **Last Updated**: 2026-04-10

### Recent Achievements | 近期成就

✅ **Phase 5 Completed (Warning Debt Clearance)**:

1. ✅ Implemented 10-language translation system | 实现10语言翻译系统
2. ✅ Added Arabic RTL layout support | 添加阿拉伯语RTL布局支持
3. ✅ Created reusable `<language-selector>` component | 创建可复用语言选择器组件
4. ✅ Fixed 35 TypeScript diagnostic errors | 修复35个TypeScript诊断错误
5. ✅ Established 94-test E2E infrastructure | 建立94个测试的E2E基础设施
6. ✅ Achieved zero compilation errors | 实现零编译错误
7. ✅ YYC³ rating improved to A++ (98.75/100) | YYC³评级提升至A++

### Upcoming Phases | 即将到来的阶段

- **Phase 6 (Next Week)**: Tech Debt Week - Complete translation keys, component testing, CI/CD
- **Phase 7 (Future)**: Feature Enhancement - Hot-reload, plural rules, digit localization

---

## 🏆 Sponsors & Backers | 赞助商与支持者

| OpenAI | Vercel | Blacksmith | Convex |
| ------ | ------ | ---------- | ------ |
| [![OpenAI](docs/assets/sponsors/openai.svg)](https://openai.com/) | [![Vercel](docs/assets/sponsors/vercel.svg)](https://vercel.com/) | [![Blacksmith](docs/assets/sponsors/blacksmith.svg)](https://blacksmith.sh/) | [![Convex](docs/assets/sponsors/convex.svg)](https://www.convex.dev/) |

---

## 📄 License | 许可证

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

本项目基于 **MIT许可证** 开源 - 详见 [LICENSE](LICENSE) 文件。

---

## 🙏 Acknowledgments | 致谢

- **[Lit](https://lit.dev/)** - Web Component framework
- **[Vite](https://vitejs.dev/)** - Next generation frontend tooling
- **[Vitest](https://vitest.dev/)** - Fast testing framework
- **[Playwright](https://playwright.dev/)** - Reliable end-to-end testing
- **YYC³ Team** - Standardization framework and quality assurance

---

## 📮 Contact | 联系方式

- **GitHub Issues**: [Submit issue](https://github.com/YYC-Cube/yyc3-openclaw-control-ui/issues)
- **Discord**: [Join community](https://discord.gg/clawd)
- **Email**: yyc3-dev@example.com

---

<div align="center">

**⭐ If this project helped you, please give it a star! ⭐**

**⭐ 如果这个项目对您有帮助，请给一个star支持！⭐**

Made with ❤️ by [YYC³ Team](https://github.com/YYC-Cube)

*Built following the 「五高五标五化」philosophy*

*遵循「五高五标五化」理念构建*

</div>
