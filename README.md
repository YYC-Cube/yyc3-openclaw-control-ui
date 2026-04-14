# 🦞 OpenClaw / YYC³ Core

<p align="center">
  <strong>YYC³ Ecosystem Core Monorepo</strong><br>
  <em>零依赖 · 企业级安全 · 插件化架构 · 国际化优先</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-5.3+-3178c6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-%3E%3D16-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Monorepo-pnpm-ff69b4?style=flat-square&logo=pnpm&logoColor=white" alt="pnpm" />
  <br/>
  <img src="https://img.shields.io/badge/i18n-10+languages-blueviolet?style=flat-square" alt="i18n" />
  <img src="https://img.shields.io/badge/security-OWASP_Level_4-blue?style=flat-square" alt="Security" />
  <img src="https://img.shields.io/badge/license-MIT-brightgreen?style=flat-square" alt="License" />
</p>

---

## 📖 Table of Contents

- [🎯 Project Overview](#-project-overview)
- [✨ Core Features](#-core-features)
- [📦 Package Structure](#-package-structure)
- [🚀 Quick Start](#-quick-start)
- [🌍 Documentation](#-documentation)
- [🏗️ Architecture](#-architecture)
- [🛡️ Security & Quality](#-security--quality)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🎯 Project Overview

**OpenClaw** is the core monorepo of the **YYC³ (YanYuCloudCube)** ecosystem, providing foundational infrastructure for intelligent cloud platforms.

### Key Highlights

- 🌐 **Internationalization-First**: Built-in i18n support with `@yyc3/i18n-core`
- 🔒 **Enterprise Security**: OWASP Level 4 security standards
- 🧩 **Plugin Architecture**: Extensible and modular design
- 📦 **Zero Dependencies**: Core packages minimize external dependencies
- 🇨🇳 **Chinese-Ready**: Complete Chinese documentation and localization

---

## ✨ Core Features

### For Developers

| Feature | Description |
|---------|-------------|
| **i18n Framework** | Production-ready internationalization with 10+ languages |
| **Memory SDK** | Advanced memory host SDK for AI applications |
| **Plugin System** | Standardized plugin contracts and interfaces |
| **CLI Tools** | Developer-friendly command-line interfaces |

### For Enterprise

| Capability | Implementation |
|------------|----------------|
| **High Availability** | Redundant systems and failover mechanisms |
| **High Performance** | Optimized algorithms and caching strategies |
| **High Security** | ReDoS protection, timing attack prevention |
| **High Scalability** | Horizontal scaling and load balancing |
| **High Maintainability** | Clean architecture and comprehensive docs |

---

## 📦 Package Structure

```
openclaw/
├── packages/
│   ├── i18n-core/              # @yyc3/i18n-core - Internationalization Framework
│   ├── memory-host-sdk/        # @openclaw/memory-host-sdk - Memory Host SDK
│   ├── clawdbot/               # clawdbot - CLI Compatibility Shim
│   ├── moltbot/                # moltbot - CLI Compatibility Shim
│   └── plugin-package-contract/ # @openclaw/plugin-package-contract - Plugin Contracts
└── docs-ZN/                    # Chinese Documentation (YYC³ Standards)
```

### Package Details

| Package | Version | Description | Status | Documentation |
|---------|---------|-------------|--------|---------------|
| **@yyc3/i18n-core** | v2.0.1 | Production-ready i18n framework | ✅ Public | [README](packages/i18n-core/README.md) |
| **@openclaw/memory-host-sdk** | v0.0.0-private | Memory host SDK for AI | 🔒 Private | - |
| **clawdbot** | v2026.2.12 | Compatibility shim (→ openclaw) | ✅ Public | - |
| **moltbot** | v2026.2.12 | Compatibility shim (→ openclaw) | ✅ Public | - |
| **@openclaw/plugin-package-contract** | v0.0.0-private | Plugin interface definitions | 🔒 Private | - |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 16.0.0 (recommended: 20.x LTS)
- **pnpm** ≥ 8.x
- **Git** latest version

### Installation

```bash
# Clone the repository
git clone https://github.com/YYC-Cube/openclaw.git
cd openclaw

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test
```

### Using @yyc3/i18n-core

```bash
# Install the i18n package
cd packages/i18n-core
pnpm build && pnpm link --global

# In your project
pnpm add @yyc3/i18n-core
```

```typescript
import { initI18n, t, setLocale } from '@yyc3/i18n-core';

await initI18n({ defaultLocale: 'zh-CN' });
console.log(t('welcome.message')); // 输出本地化文本
```

---

## 🌍 Documentation

### 🇨🇳 Chinese Documentation (YYC³ Standards)

Complete Chinese documentation is available in [`docs-ZN/`](docs-ZN/):

| Category | Location | Content |
|----------|----------|---------|
| **Team Standards** | [docs-ZN/YYC3-团队通用-标准规范/](docs-ZN/YYC3-团队通用-标准规范/) | Development standards, documentation guidelines |
| **Project Reviews** | [docs-ZN/YYC3-项目审核-总结建议/](docs-ZN/YYC3-项目审核-总结建议/) | Audit reports, improvement suggestions |
| **Implementation Plans** | [docs-ZN/YYC3-项目规划-实施方案/](docs-ZN/YYC3-项目规划-实施方案/) | Technical implementation blueprints |
| **Archived Docs** | [docs-ZN/archive/](docs-ZN/archive/) | Historical reference materials |

#### Key Documents

- **[CLI Localization Guide (v2.0)](YYC3-CLI中文化改造指南.md)** - Complete guide for CLI i18n with @yyc3/i18n-core
- **[i18n Implementation Summary](docs-ZN/YYC3-项目审核-总结建议/YYC3-i18n-技术实施总结-1.md)** - Multi-part technical review
- **[Core Vision & Architecture](docs-ZN/YYC3-项目规划-核心愿景/YYC3-核心愿景-架构设计.md)** - Strategic design document

### 📦 Package Documentation

- **[@yyc3/i18n-core](packages/i18n-core/README.md)** - Comprehensive API documentation and examples
- **[CHANGELOG](packages/i18n-core/CHANGELOG.md)** - Version history and release notes

---

## 🏗️ Architecture

### Monorepo Design Philosophy

```
┌─────────────────────────────────────────────────────────────┐
│                    OpenClaw Monorepo                        │
│              (YYC³ Ecosystem Core)                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  i18n-core  │  │ memory-host │  │   plugins   │        │
│  │  (Public)   │  │    SDK      │  │  (Contract) │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│         │                 │                │               │
│         └─────────────────┼────────────────┘               │
│                           ▼                                │
│  ┌─────────────────────────────────────────────┐           │
│  │            Shared Infrastructure            │           │
│  │  · TypeScript 5.3+ Strict Mode             │           │
│  │  · Vitest Testing Framework                │           │
│  │  · CI/CD Pipelines                         │           │
│  │  · Security Standards (OWASP L4)           │           │
│  └─────────────────────────────────────────────┘           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Language** | TypeScript | 5.3+ |
| **Runtime** | Node.js | ≥ 16.0 |
| **Package Manager** | pnpm | 8.x |
| **Testing** | Vitest | 1.x |
| **Build** | tsc (TypeScript Compiler) | 5.3 |
| **CI/CD** | GitHub Actions | Latest |

---

## 🛡️ Security & Quality

### Security Features

✅ **ReDoS Protection** - Safe regex patterns with built-in detection  
✅ **Timing Attack Prevention** - Constant-time string comparison  
✅ **Input Validation** - Path traversal and injection prevention  
✅ **Secret Management** - No hardcoded credentials  
✅ **Dependency Audit** - Zero external dependencies in core  

### Quality Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Test Coverage | >80% | 73.78% (i18n-core) |
| Type Safety | 100% | ✅ Strict Mode |
| Security Level | OWASP L4 | ✅ Certified |
| Documentation | Complete | ✅ Chinese + English |

---

## 🤝 Contributing

We welcome contributions! Please see:

1. **[Chinese Contribution Guide](docs-ZN/CONTRIBUTING-I18N.md)** - i18n-specific guidelines
2. **[Package CONTRIBUTING.md](packages/i18n-core/CONTRIBUTING.md)** - General contribution standards

### Development Workflow

```bash
# Fork and clone
git clone https://github.com/YOUR-USERNAME/openclaw.git
cd openclaw

# Create feature branch
git checkout -b feature/amazing-feature

# Make changes and test
pnpm install && pnpm test

# Submit PR
git push origin feature/amazing-feature
```

### YYC³ Standards Compliance

All contributions must comply with:
- **五高 (Five Highs)**: Availability, Performance, Security, Scalability, Maintainability
- **五标 (Five Standards)**: Standardization, Normalization, Automation, Intelligence, Visualization
- **五化 (Five Transformations)**: Process-oriented, Documented, Tool-enabled, Digitalized, Ecosystem-based

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### Packages

| Package | License | Type |
|---------|---------|------|
| @yyc3/i18n-core | MIT | Open Source |
| Other packages | MIT | Varies (see individual packages) |

---

## 🙏 Acknowledgments

- **YYC³ Team** - Core development and architecture design
- **Contributors** - Community feedback and improvements
- **Open Source Community** - Tools and libraries that make this possible

---

<div align="center">

### ⭐ Star this project if you find it useful! ⭐

**Made with ❤️ by [YYC³ Team](https://github.com/YYC-Cube)**

**[🏠 Home](https://github.com/YYC-Cube)** • 
**[📖 Documentation](docs-ZN/README.md)** • 
**[🐛 Report Issue](https://github.com/YYC-Cube/openclaw/issues)** • 
**[💬 Discussions](https://github.com/YYC-Cube/openclaw/discussions)**

<br/>

<p>
  <strong>YYC³ Quality Assurance Certified</strong><br>
  <em>五高 · 五标 · 五化</em><br>
  <code>High Availability · High Performance · High Security · High Scalability · High Maintainability</code><br>
  <code>Standardization · Normalization · Automation · Intelligence · Visualization</code><br>
  <code>Process-oriented · Documented · Tool-enabled · Digitalized · Ecosystem-based</code>
</p>

**Last Updated**: 2026-04-15

</div>
