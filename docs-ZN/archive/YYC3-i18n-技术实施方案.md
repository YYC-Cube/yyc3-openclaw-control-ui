---
file: YYC3-i18n-技术实施方案.md
description: OpenClaw项目国际化(i18n)技术实施方案 — 含架构设计、代码示例、实施步骤
author: YanYuCloudCube Team <admin@0379.email>
version: v1.0.0
created: 2026-04-10
updated: 2026-04-10
status: production-ready
tags: [i18n],[internationalization],[localization],[Chinese],[implementation]
category: technical-design
language: zh-CN
audience: developers,architects
complexity: advanced
---

> ***YanYuCloudCube***
> *言启象限 | 语枢未来*
> ***Words Initiate Quadrants, Language Serves as Core for Future***
> *万象归元于云枢 | 深栈智启新纪元*
> ***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***

---

# 🌐 OpenClaw 中文体验优化 - i18n 技术实施方案

**方案版本**: v1.0.0  
**制定日期**: 2026-04-10  
**适用范围**: Control UI / CLI / iOS / Android / macOS 全平台  
**目标语言**: 简体中文 (zh-CN) 为默认首选语言  

---

## 📋 目录

- [一、现状分析与技术选型](#一现状分析与技术选型)
- [二、整体架构设计](#二整体架构设计)
- [三、Control UI 国际化方案](#三control-ui-国际化方案)
- [四、CLI 中文化方案](#四cli-中文化方案)
- [五、移动端国际化方案](#五移动端国际化方案)
- [六、翻译资源管理](#六翻译资源管理)
- [七、实施路线图](#七实施路线图)
- [八、质量保障](#八质量保障)

---

## 一、现状分析与技术选型

### 1.1 当前技术栈盘点

| 平台 | 技术栈 | 当前i18n状态 | 改造优先级 |
|------|--------|--------------|------------|
| **Web Control UI** | Vite + Lit (Web Components) | ✅ 已支持多语言(en/zh-CN等) | 🟢 优化增强 |
| **CLI** | TypeScript + Commander-like | ❌ 英文硬编码 | 🔴 最高优先 |
| **iOS App** | Swift + WKWebView | ⚠️ 部分本地化 | 🟡 中等 |
| **macOS App** | Swift + WKWebView | ⚠️ 部分本地化 | 🟡 中等 |
| **Android App** | Kotlin + WebView | ⚠️ 部分本地化 | 🟡 中等 |
| **文档系统** | Markdown + i18n pipeline | ✅ 完整zh-CN翻译 | 🟢 维护优化 |

### 1.2 技术选型决策

#### ✅ 推荐技术栈

**Control UI (Web)**:
```typescript
// 继续使用现有 i18n 方案 (已验证可用)
// 技术: 原生 Custom Elements + lazy-loaded JSON translations
```

**CLI (Node.js/TypeScript)**:
```typescript
// 推荐: 自研轻量级 i18n 方案
// 理由:
// 1. 无需引入重型框架 (避免增加启动时间)
// 2. 与现有架构完美集成
// 3. 支持动态切换
// 4. 支持模板变量插值
```

**移动端原生层**:
```swift
// iOS/macOS: 使用 Apple 原生 Localizable.strings
// Android: 使用 strings.xml 资源文件
// WebView 层: 复用 Control UI 的 i18n 体系
```

### 1.3 核心设计原则

| 原则 | 说明 | YYC³映射 |
|------|------|----------|
| **渐进式改造** | 不破坏现有功能，平滑过渡 | 高可扩展性 |
| **零配置默认** | 中文用户开箱即用 | 高智能化 |
| **性能优先** | 不影响启动速度和运行时性能 | 高性能 |
| **类型安全** | TypeScript 类型完整覆盖 | 标准化 |
| **可维护性** | 翻译资源集中管理 | 流程化 |

---

## 二、整体架构设计

### 2.1 分层架构图

```
┌─────────────────────────────────────────────────────────────┐
│                    OpenClaw i18n 架构                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐      │
│  │  Control UI │   │    CLI      │   │  Mobile     │      │
│  │  (Vite+Lit) │   │  (Node.js)  │   │  Native     │      │
│  └──────┬──────┘   └──────┬──────┘   └──────┬──────┘      │
│         │                 │                  │              │
│         ▼                 ▼                  ▼              │
│  ┌─────────────────────────────────────────────────┐       │
│  │              Translation Resources Layer        │       │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐     │       │
│  │  │ en.json  │  │ zh-CN.json│  │ future.. │     │       │
│  │  └──────────┘  └──────────┘  └──────────┘     │       │
│  └─────────────────────────────────────────────────┘       │
│                         │                                  │
│                         ▼                                  │
│  ┌─────────────────────────────────────────────────┐       │
│  │           Core i18n Engine (Shared)             │       │
│  │  • Locale Detection                            │       │
│  │  • Fallback Chain                              │       │
│  │  • Interpolation                               │       │
│  │  • Pluralization                               │       │
│  └─────────────────────────────────────────────────┘       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 文件结构规划

```
openclaw/
├── src/
│   ├── i18n/                          # 新增: 核心i18n模块
│   │   ├── index.ts                   # 导出入口
│   │   ├── core.ts                    # 核心引擎
│   │   ├── detector.ts                # 语言检测
│   │   ├── formatter.ts               # 格式化工具
│   │   └── types.ts                   # 类型定义
│   │
│   ├── locales/                       # 新增: 翻译资源
│   │   ├── en.json                    # 英文(源语言)
│   │   ├── zh-CN.json                 # 简体中文
│   │   └── zh-TW.json                 # 繁体中文(预留)
│   │
│   └── cli/
│       └── i18n/                      # CLI专用翻译
│           ├── index.ts
│           ├── commands.ts            # 命令相关翻译
│           ├── errors.ts              # 错误消息
│           ├── prompts.ts             # 交互提示
│           └── help.ts                # 帮助信息
│
├── apps/
│   ├── ios/
│   │   └── Sources/
│   │       ├── en.lproj/
│   │       │   └── Localizable.strings
│   │       └── zh-Hans.lproj/
│   │           └── Localizable.strings
│   │
│   ├── macos/
│   │   └── Sources/
│   │       ├── en.lproj/
│   │       │   └── Localizable.strings
│   │       └── zh-Hans.lproj/
│   │           └── Localizable.strings
│   │
│   └── android/
│       └── app/src/main/res/
│           ├── values/
│           │   └── strings.xml
│           └── values-zh-rCN/
│               └── strings.xml
│
└── dist/control-ui/
    └── locales/                      # Web端翻译(已有)
        ├── en.json
        └── zh-CN.json
```

---

## 三、Control UI 国际化方案

### 3.1 现状评估

**✅ 已实现的能力**:
- 支持 `en`, `zh-CN`, `zh-TW`, `pt-BR`, `de`, `es` 6种语言
- 浏览器语言自动检测
- 语言选择器UI
- localStorage持久化
- Lazy-loading按需加载
- Fallback到英文机制

**🎯 优化方向**:
- 提升中文翻译质量(当前为机器翻译)
- 补充缺失的翻译key
- 优化中文排版(CJK字体/间距)

### 3.2 翻译资源结构示例

```jsonc
// dist/control-ui/locales/zh-CN.json
{
  "meta": {
    "locale": "zh-CN",
    "version": "2026.4.10",
    "lastUpdated": "2026-04-10T00:00:00Z",
    "translator": "human-reviewed"
  },
  
  "common": {
    "appName": "OpenClaw",
    "tagline": "你的全能AI助手，一个OpenClaw搞定所有对话",
    "loading": "加载中...",
    "error": "出错了",
    "retry": "重试",
    "cancel": "取消",
    "confirm": "确认",
    "save": "保存",
    "delete": "删除",
    "edit": "编辑",
    "close": "关闭",
    "back": "返回",
    "next": "下一步",
    "previous": "上一步",
    "search": "搜索",
    "noResults": "暂无结果"
  },

  "nav": {
    "chat": "对话",
    "channels": "渠道",
    "sessions": "会话",
    "config": "配置",
    "nodes": "节点",
    "cron": "定时任务",
    "skills": "技能",
    "logs": "日志",
    "settings": "设置"
  },

  "chat": {
    "title": "AI 对话",
    "placeholder": "输入你的消息...",
    "send": "发送",
    "stop": "停止生成",
    "regenerate": "重新生成",
    "copy": "复制",
    "thinking": "正在思考...",
    "toolCall": "调用工具",
    "error": {
      "network": "网络连接失败，请检查网络后重试",
      "auth": "认证失败，请重新登录",
      "rateLimit": "请求过于频繁，请稍后再试",
      "unknown": "未知错误，请联系管理员"
    }
  },

  "channels": {
    "title": "消息渠道",
    "status": {
      "connected": "已连接",
      "disconnected": "已断开",
      "connecting": "连接中...",
      "error": "连接错误"
    },
    "types": {
      "whatsapp": "WhatsApp",
      "telegram": "Telegram",
      "discord": "Discord",
      "slack": "Slack",
      "feishu": "飞书",
      "wechat": "微信"
    },
    "actions": {
      "connect": "连接",
      "disconnect": "断开",
      "configure": "配置",
      "test": "测试连接",
      "viewQR": "查看二维码"
    },
    "pairing": {
      "title": "设备配对",
      "pending": "等待配对批准",
      "approved": "已批准",
      "rejected": "已拒绝"
    }
  },

  "config": {
    "title": "配置管理",
    "sections": {
      "general": "通用设置",
      "gateway": "Gateway网关",
      "channels": "渠道配置",
      "models": "模型设置",
      "security": "安全设置",
      "logging": "日志设置"
    },
    "actions": {
      "apply": "应用更改",
      "reset": "重置为默认",
      "export": "导出配置",
      "import": "导入配置",
      "restart": "重启服务"
    },
    "validation": {
      "required": "此字段为必填项",
      "invalidFormat": "格式不正确",
      "outOfRange": "值超出允许范围",
      "duplicate": "该值已存在"
    }
  },

  "onboarding": {
    "title": "欢迎使用 OpenClaw",
    "subtitle": "让我们花几分钟时间完成初始设置",
    "steps": {
      "welcome": "欢迎",
      "gateway": "Gateway 设置",
      "channels": "渠道配置",
      "model": "模型选择",
      "complete": "完成!"
    },
    "actions": {
      "start": "开始设置",
      "skip": "跳过",
      "nextStep": "下一步",
      "prevStep": "上一步",
      "finish": "完成设置"
    },
    "tips": {
      "gateway": "Gateway 是 OpenClaw 的核心控制平面，负责管理所有连接和会话",
      "channels": "选择你要使用的消息渠道，OpenClaw 将在这些平台上与你交互",
      "model": "选择 AI 模型提供商，我们推荐使用国内模型以获得更快的响应速度"
    }
  },

  "errors": {
    "generic": "发生了意外错误",
    "network": "无法连接到服务器",
    "authFailed": "认证失败，请检查你的凭据",
    "permissionDenied": "你没有权限执行此操作",
    "notFound": "请求的资源不存在",
    "serverError": "服务器内部错误",
    "timeout": "请求超时，请稍后重试"
  },

  "dates": {
    "short": "MM/DD",
    "long": "YYYY年MM月DD日",
    "relative": {
      "justNow": "刚刚",
      "minutesAgo": "{count}分钟前",
      "hoursAgo": "{count}小时前",
      "daysAgo": "{count}天前",
      "yesterday": "昨天"
    }
  }
}
```

### 3.3 CJK 排版优化规范

```css
/* Control UI 中文优化样式 */

/* 字体栈 - 优先使用系统中文字体 */
:root[lang="zh-CN"] {
  --font-sans: 
    -apple-system, 
    "PingFang SC", 
    "Hiragino Sans GB", 
    "Microsoft YaHei", 
    "WenQuanYi Micro Hei", 
    sans-serif;
  
  --font-mono: 
    "SF Mono", 
    "Menlo", 
    "Consolas", 
    "Liberation Mono", 
    monospace;
  
  /* CJK 字符间距调整 */
  --CJK-letter-spacing: 0.02em;
  --CJK-word-spacing: 0.05em;
  
  /* 行高适配中文 */
  --line-height-loose: 1.8;
  --line-height-normal: 1.6;
  --line-height-tight: 1.4;
}

/* CJK-Latin 间距自动处理 */
:root[lang="zh-CN"] p,
:root[lang="zh-CN"] li,
:root[lang="zh-CN"] span,
:root[lang="zh-CN"] td {
  text-autospace: ideograph-alpha idiosyncratic;
}

/* 数字使用等宽字体 */
:root[lang="zh-CN"] .number {
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum";
}

/* 中文标点符号优化 */
:root[lang="zh-CN"] {
  /* 避免行首标点 */
  hanging-punctuation: first last;
  
  /* 文本对齐 */
  text-align: justify;
  text-justify: inter-character;
}
```

---

## 四、CLI 中文化方案

### 4.1 CLI i18n 架构设计

#### 核心模块实现

```typescript
/**
 * file: src/i18n/core.ts
 * description: CLI i18n 核心引擎 · 提供轻量级国际化能力
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-04-10
 * updated: 2026-04-10
 * status: active
 * tags: [i18n],[core],[cli]
 */

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { DeepReadonly } from './types';

export interface I18nConfig {
  defaultLocale?: string;
  fallbackLocale?: string;
  localeDir?: string;
  onMissingKey?: (key: string, locale: string) => string;
}

interface TranslationData {
  [key: string]: string | TranslationData;
}

type LocaleMap = Record<string, TranslationData>;

class I18nEngine {
  private config: Required<I18nConfig>;
  private locales: LocaleMap = {};
  private currentLocale: string;

  constructor(config: I18nConfig = {}) {
    this.config = {
      defaultLocale: config.defaultLocale ?? this.detectSystemLocale(),
      fallbackLocale: config.fallbackLocale ?? 'en',
      localeDir: config.localeDir ?? join(import.meta.dirname ?? '.', '..', 'locales'),
      onMissingKey: config.onMissingKey ?? ((key) => key),
    };
    
    this.currentLocale = this.config.defaultLocale;
    this.loadLocales();
  }

  /**
   * 检测系统语言环境
   * 优先级: 环境变量 > 系统locale > 默认值
   */
  private detectSystemLocale(): string {
    // 1. 检查环境变量显式设置
    const envLocale = process.env.LANGUAGE || process.env.LANG || process.env.LC_ALL;
    if (envLocale) {
      const normalized = envLocale.split('.')[0].replace('_', '-');
      if (normalized.startsWith('zh')) return 'zh-CN';
      if (normalized.startsWith('en')) return 'en';
    }
    
    // 2. 检查 OpenClaw 配置中的语言设置
    // TODO: 读取 openclaw.json 中的 locale 配置
    
    // 3. 默认返回中文 (中国市场优先)
    return 'zh-CN';
  }

  /**
   * 加载所有可用的语言包
   */
  private loadLocales(): void {
    const { localeDir } = this.config;
    
    const localeFiles = ['en', 'zh-CN'];
    
    for (const locale of localeFiles) {
      const filePath = join(localeDir, `${locale}.json`);
      
      if (existsSync(filePath)) {
        try {
          const content = readFileSync(filePath, 'utf-8');
          this.locales[locale] = JSON.parse(content);
        } catch (error) {
          console.error(`[i18n] Failed to load locale "${locale}":`, error);
        }
      }
    }
  }

  /**
   * 获取翻译文本
   * @param key 翻译键 (支持嵌套: "chat.placeholder")
   * @param params 模板变量
   * @returns 翻译后的文本
   */
  t(key: string, params?: Record<string, unknown>): string {
    const value = this.resolveKey(key, this.currentLocale);
    
    if (typeof value !== 'string') {
      return this.config.onMissingKey(key, this.currentLocale);
    }
    
    return this.interpolate(value, params);
  }

  /**
   * 解析嵌套的翻译键
   */
  private resolveKey(key: string, locale: string): string | TranslationData | undefined {
    const keys = key.split('.');
    let current: TranslationData | undefined = this.locales[locale];
    
    for (const k of keys) {
      if (current === undefined || typeof current !== 'object') {
        break;
      }
      current = current[k] as TranslationData | undefined;
    }
    
    // Fallback 到默认语言
    if (current === undefined && locale !== this.config.fallbackLocale) {
      return this.resolveKey(key, this.config.fallbackLocale);
    }
    
    return current;
  }

  /**
   * 模板变量插值
   * 支持: {{variable}} 和 {{count}} 格式
   */
  private interpolate(template: string, params?: Record<string, unknown>): string {
    if (!params) return template;
    
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
      const value = params[key];
      return value !== undefined ? String(value) : `{{${key}}}`;
    });
  }

  /**
   * 切换语言
   */
  setLocale(locale: string): void {
    if (this.locales[locale]) {
      this.currentLocale = locale;
    } else {
      console.warn(`[i18n] Locale "${locale}" not available, falling back to "${this.config.fallbackLocale}"`);
      this.currentLocale = this.config.fallbackLocale;
    }
  }

  /**
   * 获取当前语言
   */
  getLocale(): string {
    return this.currentLocale;
  }

  /**
   * 获取可用语言列表
   */
  getAvailableLocales(): string[] {
    return Object.keys(this.locales);
  }
}

/** 单例实例 */
let instance: I18nEngine | null = null;

/**
 * 获取 i18n 引擎实例 (单例模式)
 */
export function getI18n(config?: I18nConfig): I18nEngine {
  if (!instance) {
    instance = new I18nEngine(config);
  }
  return instance;
}

/**
 * 便捷翻译函数
 * @example
 * ```typescript
 * import { t } from '../i18n/core';
 * 
 * console.log(t('chat.placeholder')); // "输入你的消息..."
 * console.log(t('errors.network')); // "网络连接失败"
 * console.log(t('dates.relative.hoursAgo', { count: 3 })); // "3小时前"
 * ```
 */
export function t(key: string, params?: Record<string, unknown>): string {
  return getI18n().t(key, params);
}
```

#### 类型定义

```typescript
/**
 * file: src/i18n/types.ts
 * description: i18n 类型定义
 * author: YanYuCloudCube Team
 * version: v1.0.0
 */

export type SupportedLocale = 'en' | 'zh-CN' | 'zh-TW';

export interface TranslationKeys {
  // 命令名称
  'cli.name': string;
  'cli.description': string;
  
  // Banner
  'banner.title': string;
  'banner.version': string;
  'banner.tagline': string;
  
  // 通用操作
  'common.success': string;
  'common.error': string;
  'common.cancel': string;
  'common.confirm': string;
  'common.loading': string;
  
  // 错误消息
  'error.notFound': string;
  'error.permissionDenied': string;
  'error.network': string;
  'error.timeout': string;
  'error.invalidConfig': string;
  'error.portInUse': string;
  
  // Gateway 相关
  'gateway.starting': string;
  'gateway.started': string;
  'gateway.stopping': string;
  'gateway.stopped': string;
  'gateway.restart': string;
  'gateway.status.running': string;
  'gateway.status.stopped': string;
  
  // 渠道相关
  'channel.connecting': string;
  'channel.connected': string;
  'channel.disconnected': string;
  'channel.error': string;
  
  // Onboarding 向导
  'onboard.welcome': string;
  'onboard.step.gateway': string;
  'onboard.step.channels': string;
  'onboard.step.model': string;
  'onboard.complete': string;
  'onboard.progress': string;
  
  // 帮助信息
  'help.usage': string;
  'help.options': string;
  'help.examples': string;
  
  // 交互提示
  'prompt.inputRequired': string;
  'prompt.confirmAction': string;
  'prompt.selectOption': string;
  'prompt.enterValue': string;
}

/** 深度只读类型 (用于编译时检查) */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};
```

### 4.2 CLI 翻译资源文件

#### 英文源文件 (en.json)

```jsonc
{
  "meta": {
    "locale": "en",
    "version": "2026.4.10"
  },
  
  "cli": {
    "name": "openclaw",
    "description": "Personal AI assistant - Multi-channel AI gateway with extensible messaging integrations"
  },
  
  "banner": {
    "title": "🦞 OpenClaw",
    "tagline": "All your chats, one OpenClaw."
  },
  
  "common": {
    "success": "✅ Success",
    "error": "❌ Error",
    "cancel": "Cancelled",
    "confirm": "Confirmed",
    "loading": "Loading...",
    "pleaseWait": "Please wait..."
  },
  
  "error": {
    "notFound": "Resource not found: {{resource}}",
    "permissionDenied": "Permission denied: {{action}}",
    "network": "Network error: Unable to connect to {{host}}:{{port}}",
    "timeout": "Operation timed out after {{seconds}}s",
    "invalidConfig": "Invalid configuration: {{reason}}",
    "portInUse": "Port {{port}} is already in use. Try:\n  openclaw gateway --port {{altPort}}"
  },
  
  "gateway": {
    "starting": "Starting Gateway on port {{port}}...",
    "started": "✅ Gateway started successfully on http://{{host}}:{{port}}",
    "stopping": "Stopping Gateway...",
    "stopped": "✅ Gateway stopped",
    "restart": "Restarting Gateway...",
    "status": {
      "running": "● Running (PID: {{pid}})",
      "stopped": "○ Stopped",
      "restarting": "◐ Restarting..."
    }
  },
  
  "channel": {
    "connecting": "Connecting to {{channel}}...",
    "connected": "✅ {{channel}} connected successfully",
    "disconnected": "{{channel}} disconnected",
    "error": "Failed to connect to {{channel}}: {{error}}"
  },
  
  "onboard": {
    "welcome": "Welcome to OpenClaw! 🦞\nLet's set up your personal AI assistant.",
    "step": {
      "gateway": "Step 1/3: Configure Gateway",
      "channels": "Step 2/3: Setup Channels",
      "model": "Step 3/3: Choose Model Provider",
      "complete": "Setup complete! 🎉"
    },
    "progress": "[{{current}}/{{total}}]",
    "complete": "\n✨ Your OpenClaw is ready to use!\n\nNext steps:\n  1. Start the gateway: openclaw gateway\n  2. Open http://localhost:18789 in your browser\n  3. Send a message to test"
  },
  
  "help": {
    "usage": "Usage: openclaw [command] [options]",
    "options": "Options:",
    "examples": "Examples:"
  },
  
  "prompt": {
    "inputRequired": "⚠️  This field is required",
    "confirmAction": "Do you want to continue? (y/N)",
    "selectOption": "Please select an option:",
    "enterValue": "Enter value (press Enter for default):"
  }
}
```

#### 中文翻译文件 (zh-CN.json)

```jsonc
{
  "meta": {
    "locale": "zh-CN",
    "version": "2026.4.10",
    "translator": "YanYuCloudCube Team",
    "reviewStatus": "human-reviewed"
  },
  
  "cli": {
    "name": "openclaw",
    "description": "个人AI助手 - 多渠道AI智能体网关，支持可扩展的消息集成"
  },
  
  "banner": {
    "title": "🦞 OpenClaw",
    "tagline": "你的全能AI助手，一个OpenClaw搞定所有对话"
  },
  
  "common": {
    "success": "✅ 操作成功",
    "error": "❌ 发生错误",
    "cancel": "已取消",
    "confirm": "已确认",
    "loading": "加载中...",
    "pleaseWait": "请稍候..."
  },
  
  "error": {
    "notFound": "未找到资源: {{resource}}",
    "permissionDenied": "权限不足: {{action}}",
    "network": "网络错误: 无法连接到 {{host}}:{{port}}",
    "timeout": "操作超时 ({{seconds}}秒)",
    "invalidConfig": "配置无效: {{reason}}",
    "portInUse": "端口 {{port}} 已被占用，请尝试:\n  openclaw gateway --port {{altPort}}"
  },
  
  "gateway": {
    "starting": "正在启动 Gateway (端口 {{port}})...",
    "started": "✅ Gateway 启动成功 http://{{host}}:{{port}}",
    "stopping": "正在停止 Gateway...",
    "stopped": "✅ Gateway 已停止",
    "restart": "正在重启 Gateway...",
    "status": {
      "running": "● 运行中 (PID: {{pid}})",
      "stopped": "○ 已停止",
      "restarting": "◐ 重启中..."
    }
  },
  
  "channel": {
    "connecting": "正在连接 {{channel}}...",
    "connected": "✅ {{channel}} 连接成功",
    "disconnected": "{{channel}} 已断开连接",
    "error": "连接 {{channel}} 失败: {{error}}"
  },
  
  "onboard": {
    "welcome": "欢迎使用 OpenClaw! 🦞\n让我们来设置你的个人AI助手。",
    "step": {
      "gateway": "第 1/3 步: 配置 Gateway",
      "channels": "第 2/3 步: 设置消息渠道",
      "model": "第 3/3 步: 选择AI模型",
      "complete": "设置完成! 🎉"
    },
    "progress": "[{{current}}/{{total}}]",
    "complete": "\n✨ 你的 OpenClaw 已经准备就绪!\n\n接下来:\n  1. 启动网关: openclaw gateway\n  2. 在浏览器打开 http://localhost:18789\n  3. 发送一条消息测试"
  },
  
  "help": {
    "usage": "用法: openclaw [命令] [选项]",
    "options": "选项:",
    "examples": "示例:"
  },
  
  "prompt": {
    "inputRequired": "⚠️  此字段为必填项",
    "confirmAction": "是否继续? (y/N)",
    "selectOption": "请选择一个选项:",
    "enterValue": "输入值 (直接回车使用默认值):"
  }
}
```

### 4.3 CLI 集成示例

#### Banner 中文化

```typescript
/**
 * file: src/cli/banner.ts (改造后)
 * description: CLI 启动横幅 · 支持多语言显示
 */

import { t } from '../i18n/core';

export function formatCliBannerLine(version: string, options: BannerOptions = {}): string {
  const commit = options.commit ?? resolveCommitHash({ env: options.env });
  const commitLabel = commit ?? "unknown";
  
  // 使用 i18n 翻译标题和标语
  const title = t('banner.title'); // "🦞 OpenClaw" (中英文相同)
  const tagline = pickTagline({ ...options }); // 保持原有的幽默风格
  
  const rich = options.richTty ?? isRich();
  const columns = options.columns ?? process.stdout.columns ?? 120;
  
  // 版本信息保持英文 (技术标识)
  const plainBaseLine = `${title} ${version} (${commitLabel})`;
  const plainFullLine = tagline ? `${plainBaseLine} — ${tagline}` : plainBaseLine;
  
  // ... 其余渲染逻辑保持不变
}
```

#### 命令帮助信息中文化

```typescript
/**
 * file: src/cli/gateway-cli.ts (示例)
 * description: Gateway 命令 · 中文帮助信息
 */

import { Command } from 'commander';
import { t } from '../i18n/core';

export function createGatewayCommand(): Command {
  const program = new Command('gateway');
  
  program
    .description(t('gateway.description')) // "启动和管理 Gateway 网关"
    
    .command('start')
    .description(t('gateway.start.description')) // "启动 Gateway 服务"
    .option('-p, --port <number>', t('gateway.options.port'), '18789')
    .option('-v, --verbose', t('gateway.options.verbose'), false)
    .action(async (options) => {
      console.log(t('gateway.starting', { port: options.port }));
      // ... 启动逻辑
    });
    
  return program;
}
```

#### 错误消息友好化

```typescript
/**
 * file: src/cli/error-handler.ts
 * description: 统一错误处理 · 中文友好提示
 */

import { t } from '../i18n/core';

export class FriendlyErrorHandler {
  static handle(error: Error): never {
    if (error instanceof PortInUseError) {
      console.error(
        t('error.portInUse', { 
          port: error.port, 
          altPort: error.port + 1 
        })
      );
    } else if (error instanceof NetworkError) {
      console.error(
        t('error.network', {
          host: error.host,
          port: error.port
        })
      );
    } else {
      console.error(t('common.error'));
      console.error(error.message);
    }
    
    process.exit(1);
  }
}
```

#### Onboarding 向导中文化

```typescript
/**
 * file: src/cli/onboard/wizard.ts (改造后)
 * description: 新手引导向导 · 全中文交互
 */

import { t } from '../../i18n/core';
import prompts from 'prompts';

export async function runOnboardWizard(): Promise<void> {
  console.log('\n' + t('onboard.welcome') + '\n');
  
  // Step 1: Gateway 配置
  console.log(`\n${t('onboard.step.gateway')}\n${'─'.repeat(40)}`);
  
  const gatewayConfig = await prompts({
    type: 'number',
    name: 'port',
    message: t('onboard.prompt.port'), // "请输入 Gateway 端口 (默认: 18789):",
    initial: 18789,
    validate: (value) => value > 0 && value < 65536 || t('prompt.invalidPort')
  });
  
  // Step 2: 渠道配置
  console.log(`\n${t('onboard.step.channels')}\n${'─'.repeat(40)}`);
  
  const channels = await prompts({
    type: 'multiselect',
    name: 'selected',
    message: t('onboard.prompt.channels'), // "选择要启用的消息渠道:",
    choices: [
      { title: '微信 (WeChat)', value: 'wechat' },
      { title: '飞书 (Feishu/Lark)', value: 'feishu' },
      { title: '钉钉 (DingTalk)', value: 'dingtalk' },
      { title: 'Telegram', value: 'telegram' },
      { title: 'WhatsApp', value: 'whatsapp' }
    ]
  });
  
  // Step 3: 模型选择
  console.log(`\n${t('onboard.step.model')}\n${'─'.repeat(40)}`);
  
  const model = await prompts({
    type: 'select',
    name: 'provider',
    message: t('onboard.prompt.model'), // "选择AI模型提供商 (推荐国产模型):",
    choices: [
      { title: '通义千问 Qwen (推荐)', value: 'qwen', description: '阿里云 · 快速响应 · 国产优选' },
      { title: '智谱 GLM', value: 'glm', description: '智谱AI · 中文理解强' },
      { title: '月之暗面 Moonshot', value: 'moonshot', description: '长文本处理优秀' },
      { title: 'OpenAI GPT', value: 'openai', description: '国际版 · 需要科学上网' },
      { title: 'Anthropic Claude', value: 'anthropic', description: '国际版 · 需要科学上网' }
    ]
  });
  
  // 完成
  console.log('\n✨ ' + t('onboard.complete') + '\n');
}
```

---

## 五、移动端国际化方案

### 5.1 iOS/macOS 实现

#### Localizable.strings (zh-Hans)

```
/* App 名称 */
"app.name" = "OpenClaw";
"app.tagline" = "你的个人AI助手";

/* 导航栏 */
"nav.chat" = "对话";
"nav.channels" = "渠道";
"nav.settings" = "设置";

/* Gateway 状态 */
"gateway.status.connected" = "已连接";
"gateway.status.disconnected" = "未连接";
"gateway.status.connecting" = "连接中...";

/* 渠道名称 */
"channel.whatsapp" = "WhatsApp";
"channel.telegram" = "Telegram";
"channel.feishu" = "飞书";
"channel.wechat" = "微信";

/* 通用操作 */
"common.save" = "保存";
"common.cancel" = "取消";
"common.delete" = "删除";
"common.edit" = "编辑";
"common.share" = "分享";
"common.copy" = "复制";

/* 错误消息 */
"error.network" = "网络连接失败";
"error.auth" = "认证失败";
"error.unknown" = "发生未知错误";

/* Onboarding */
"onboard.welcome.title" = "欢迎使用 OpenClaw";
"onboard.welcome.subtitle" = "让我们来设置你的AI助手";
"onboard.button.start" = "开始设置";
"onboard.button.skip" = "跳过";

/* 权限请求 */
"permission.notification.title" = "启用通知";
"permission.notification.message" = "接收新消息通知，不错过任何重要信息";
"permission.microphone.title" = "语音输入";
"permission.microphone.message" = "启用麦克风以使用语音输入功能";
```

#### Swift 集成代码

```swift
import Foundation

/// 国际化管理器
final class LocalizationManager {
    static let shared = LocalizationManager()
    
    var currentLanguage: String {
        UserDefaults.standard.string(forKey: "AppLanguage") ?? autoDetectLanguage()
    }
    
    /// 自动检测系统语言
    private func autoDetectLanguage() -> String {
        let preferredLanguages = Locale.preferredLanguages
        
        for language in preferredLanguages {
            if language.hasPrefix("zh") {
                return "zh-Hans" // 简体中文优先
            } else if language.hasPrefix("en") {
                return "en"
            }
        }
        
        return "zh-Hans" // 默认中文
    }
    
    /// 获取本地化字符串
    func localized(_ key: String, _ args: CVarArg...) -> String {
        let bundle = Bundle(for: type(of: self))
        let format = NSLocalizedString(key, bundle: bundle, comment: "")
        return String(format: format, arguments: args)
    }
    
    /// 切换语言
    func setLanguage(_ code: String) {
        guard ["en", "zh-Hans", "zh-Hant"].contains(code) else { return }
        UserDefaults.standard.set(code, forKey: "AppLanguage")
        NotificationCenter.default.post(name: .languageDidChange, object: nil)
    }
}

extension Notification.Name {
    static let languageDidChange = Notification.Name("languageDidChange")
}

// 便捷访问
func L(_ key: String, _ args: CVarArg...) -> String {
    return LocalizationManager.shared.localized(key, args)
}
```

### 5.2 Android 实现

#### strings.xml (values-zh-rCN)

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <!-- App 信息 -->
    <string name="app_name">OpenClaw</string>
    <string name="app_tagline">你的个人AI助手</string>
    
    <!-- 导航 -->
    <string name="nav_chat">对话</string>
    <string name="nav_channels">渠道</string>
    <string name="nav_settings">设置</string>
    
    <!-- Gateway -->
    <string name="gateway_connecting">连接中…</string>
    <string name="gateway_connected">已连接</string>
    <string name="gateway_disconnected">未连接</string>
    
    <!-- 渠道 -->
    <string name="channel_wechat">微信</string>
    <string name="channel_feishu">飞书</string>
    <string name="channel_telegram">Telegram</string>
    
    <!-- 通用 -->
    <string name="common_save">保存</string>
    <string name="common_cancel">取消</string>
    <string name="common_confirm">确定</string>
    <string name="common_delete">删除</string>
    
    <!-- 错误 -->
    <string name="error_network">网络连接失败</string>
    <string name="error_auth_failed">认证失败</string>
    <string name="error_timeout">连接超时</string>
    
    <!-- Onboarding -->
    <string name="onboard_welcome_title">欢迎使用 OpenClaw 🦞</string>
    <string name="onboard_welcome_subtitle">让我们来设置你的AI助手</string>
    <string name="onboard_btn_start">开始设置</string>
    <string name="onboard_btn_skip">跳过</string>
</resources>
```

#### Kotlin 工具类

```kotlin
package ai.openclaw.util

import android.content.Context
import android.content.res.Configuration
import java.util.Locale

object LocalizationManager {
    const val PREFS_NAME = "openclaw_prefs"
    const val KEY_LANGUAGE = "app_language"
    
    val supportedLanguages = mapOf(
        "zh-CN" to Locale.SIMPLIFIED_CHINESE,
        "en" to Locale.ENGLISH
    )
    
    fun getSavedLanguage(context: Context): String {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        return prefs.getString(KEY_LANGUAGE, detectSystemLanguage()) ?: "zh-CN"
    }
    
    fun setLanguage(context: Context, languageCode: String) {
        val locale = supportedLanguages[languageCode] ?: Locale.SIMPLIFIED_CHINESE
        
        Locale.setDefault(locale)
        
        val config = Configuration(context.resources.configuration)
        config.setLocale(locale)
        context.createConfigurationContext(config)
        
        context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            .edit()
            .putString(KEY_LANGUAGE, languageCode)
            .apply()
    }
    
    private fun detectSystemLanguage(): String {
        val systemLang = Locale.getDefault().language
        return when {
            systemLang == "zh" -> "zh-CN"
            else -> "zh-CN" // 默认中文
        }
    }
}

fun Context.getStringRes(key: String): String {
    val resId = resources.getIdentifier(key, "string", packageName)
    return if (resId != 0) getString(resId) else key
}
```

---

## 六、翻译资源管理

### 6.1 翻译工作流

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  提取待翻译  │ →> │  人工翻译   │ →> │  审核校对   │ →> │  发布上线   │
│  Text Keys  │    │  (专业译员) │    │  (母语审核) │    │  CI/CD     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       ↑                                                           │
       └────────────────── 自动检测新增 Key ←──────────────────────┘
```

### 6.2 翻译质量标准

| 等级 | 标准 | 示例 |
|------|------|------|
| **A级 (母语级)** | 自然流畅，符合中文表达习惯 | "发送消息" ✓ vs "Send Message" ✗ |
| **B级 (可用)** | 准确无误，略显生硬 | "配置网关" ✓ |
| **C级 (机翻)** | 可理解，需人工校准 | "网关配置" (可接受但非最优) |

### 6.3 术语表 (Glossary)

| 英文术语 | 中文翻译 | 说明 |
|----------|----------|------|
| Gateway | 网关 | 核心组件，保持术语一致 |
| Channel | 渠道 | 消息通道，不用"频道" |
| Agent | 智能体/AI助手 | 根据上下文灵活选择 |
| Session | 会话 | 对话上下文 |
| Plugin | 插件 | 扩展组件 |
| Skill | 技能 | 能力单元 |
| Node | 节点 | 移动设备实例 |
| Pairing | 配对 | 设备认证流程 |
| Sandbox | 沙箱 | 安全执行环境 |
| Onboarding | 新手引导/初始化向导 | 首次使用引导 |

---

## 七、实施路线图

### Phase 1: 基础设施 (Week 1-2)

- [ ] 创建 `src/i18n/` 核心模块
- [ ] 实现轻量级 i18n 引擎
- [ ] 编写 `locales/en.json` 和 `locales/zh-CN.json`
- [ ] 集成到 CLI banner 和基础命令

**交付物**:
- ✅ i18n 核心引擎代码
- ✅ 中英文翻译资源文件(v1.0)
- ✅ CLI 基础中文化

### Phase 2: CLI 全面中文化 (Week 3-4)

- [ ] 所有命令的帮助信息中文化
- [ ] 错误消息全面中文化
- [ ] Onboarding 向导全中文交互
- [ ] 交互式提示(prompt)中文化
- [ ] Tagline/Slogan 中文版

**交付物**:
- ✅ CLI 100%中文体验
- ✅ 中文 Onboarding 向导
- ✅ 友好的错误提示系统

### Phase 3: Control UI 优化 (Week 5-6)

- [ ] 审核并提升现有中文翻译质量
- [ ] 补充缺失的翻译 key
- [ ] CJK 排版样式优化
- [ ] 中文默认语言设置

**交付物**:
- ✅ 人工校验的中文翻译
- ✅ 符合中文阅读习惯的UI
- ✅ CJK 排版最佳实践

### Phase 4: 移动端适配 (Week 7-8)

- [ ] iOS/macOS Localizable.strings 完善
- [ ] Android strings.xml 完善
- [ ] WebView 层语言同步
- [ ] 系统权限弹窗中文化

**交付物**:
- ✅ iOS/macOS 完整中文支持
- ✅ Android 完整中文支持
- ✅ 多端语言一致性

### Phase 5: 测试与发布 (Week 9-10)

- [ ] 全平台回归测试
- [ ] 翻译完整性检查
- [ ] 性能测试(确保无退化)
- [ ] 用户验收测试(UAT)
- [ ] 文档更新

**交付物**:
- ✅ 测试报告
- ✅ 发布就绪版本
- ✅ 更新的用户文档

---

## 八、质量保障

### 8.1 测试策略

```typescript
/**
 * file: src/i18n/__tests__/engine.test.ts
 * description: i18n 引擎测试套件
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { I18nEngine } from '../core';

describe('I18nEngine', () => {
  let engine: I18nEngine;
  
  beforeEach(() => {
    engine = new I18nEngine({
      defaultLocale: 'zh-CN',
      fallbackLocale: 'en'
    });
  });

  describe('t() - 翻译函数', () => {
    it('应正确返回中文翻译', () => {
      engine.setLocale('zh-CN');
      expect(engine.t('common.success')).toBe('✅ 操作成功');
    });

    it('应支持嵌套 key', () => {
      engine.setLocale('zh-CN');
      expect(engine.t('gateway.started')).toContain('启动成功');
    });

    it('应支持模板变量插值', () => {
      engine.setLocale('zh-CN');
      expect(engine.t('error.portInUse', { port: 18789, altPort: 18790 }))
        .toContain('18789');
    });

    it('缺少翻译时应 fallback 到英文', () => {
      engine.setLocale('zh-CN');
      const result = engine.t('nonexistent.key');
      expect(result).toBe('nonexistent.key'); // 或自定义 fallback
    });
  });

  describe('setLocale() - 语言切换', () => {
    it('应成功切换语言', () => {
      engine.setLocale('en');
      expect(engine.getLocale()).toBe('en');
    });

    it('不支持的语言应 fallback', () => {
      engine.setLocale('ja'); // 未支持
      expect(engine.getLocale()).toBe('en'); // fallback
    });
  });

  describe('detectSystemLocale() - 自动检测', () => {
    it('应从环境变量检测中文环境', () => {
      // Mock 环境变量
      process.env.LANG = 'zh_CN.UTF-8';
      const engine = new I18nEngine();
      expect(engine.getLocale()).toBe('zh-CN');
    });
  });
});
```

### 8.2 翻译覆盖率检查脚本

```bash
#!/bin/bash
# scripts/check-i18n-coverage.sh

echo "📊 检查翻译覆盖率..."

EN_KEYS=$(jq -r 'keys | .[]' src/locales/en.json | sort)
ZH_KEYS=$(jq -r 'keys | .[]' src/locales/zh-CN.json | sort)

MISSING=$(comm -23 <(echo "$EN_KEYS") <(echo "$ZH_KEYS"))

if [ -z "$MISSING" ]; then
  echo "✅ 中文翻译 100% 覆盖"
  exit 0
else
  echo "⚠️  缺失的中文翻译:"
  echo "$MISSING"
  exit 1
fi
```

### 8.3 CI/CD 集成

```yaml
# .github/workflows/i18n.yml
name: i18n Validation

on:
  pull_request:
    paths:
      - 'src/i18n/**'
      - 'src/locales/**'

jobs:
  validate-translations:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          
      - name: Check translation coverage
        run: |
          chmod +x scripts/check-i18n-coverage.sh
          ./scripts/check-i18n-coverage.sh
          
      - name: Run i18n tests
        run: pnpm test -- --grep "i18n"
        
      - name: Validate JSON format
        run: |
          for f in src/locales/*.json; do
            jq empty "$f" || echo "❌ Invalid JSON: $f" && exit 1
          done
          echo "✅ All translation files are valid JSON"
```

---

## 附录

### A. 参考资源

- [Unicode CLDR (Common Locale Data Repository)](https://cldr.unicode.org/)
- [W3C CJK Layout Requirements](https://www.w3.org/TR/clreq/)
- [Apple Internationalization Guide](https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPInternational/)
- [Android App Localization](https://developer.android.com/guide/topics/resources/localization)

### B. 工具推荐

| 用途 | 工具 | 说明 |
|------|------|------|
| 翻译管理 | Crowdin / Phrase | 协作翻译平台 |
| 翻译质量检查 | Lingui | 编译时检查 |
| 格式验证 | i18next-scanner | 自动提取待翻译文本 |
| CI检查 | 自定义脚本 | 覆盖率/格式验证 |

### C. 版本历史

| 版本 | 日期 | 变更内容 | 作者 |
|------|------|----------|------|
| v1.0.0 | 2026-04-10 | 初始版本 - 完整方案设计 | YanYuCloudCube Team |

---

<div align="center">

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for Future***」
> 「***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***」

</div>
