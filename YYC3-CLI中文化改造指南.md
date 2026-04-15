---
file: YYC3-CLI中文化改造指南.md
description: OpenClaw CLI 命令行工具中文本地化实施指南 — 基于 @yyc3/i18n-core 集成
author: YanYuCloudCube Team <admin@0379.email>
version: v2.0.0
created: 2026-04-10
updated: 2026-04-15
status: active
tags: [cli],[localization],[chinese],[i18n-core],[terminal]
category: implementation-guide
language: zh-CN
audience: developers,devops-engineers
complexity: intermediate
---

> ***YanYuCloudCube***
> *言启象限 | 语枢未来*
> ***Words Initiate Quadrants, Language Serves as Core for Future***
> *万象归元于云枢 | 深栈智启新纪元*
> ***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***

---

# 🔧 OpenClaw CLI 中文化改造指南

**版本**: v2.0.0 (**基于 @yyc3/i18n-core 重构**)  
**更新日期**: 2026-04-15  
**适用范围**: `openclaw` 命令行工具全量命令  
**目标用户**: 中文开发者、运维人员、普通用户  
**改造原则**: 零配置默认中文 · 保持技术标识英文 · 友好错误提示  
**i18n 引擎**: `@yyc3/i18n-core` v2.0+ (零依赖 · 插件化 · 安全加固)

---

## 📋 目录

- [一、架构总览](#一架构总览)
- [二、集成 @yyc3/i18n-core](#二集成-yyc3i18n-core)
- [三、CLI 翻译资源定义](#三cli-翻译资源定义)
- [四、核心命令中文化](#四核心命令中文化)
- [五、交互式提示优化](#五交互式提示优化)
- [六、错误消息友好化](#六错误消息友好化)
- [七、帮助系统完善](#七帮助系统完善)
- [八、特殊场景处理](#八特殊场景处理)
- [九、测试与验证](#九测试与验证)
- [十、发布与部署](#十发布与部署)

---

## 一、架构总览

### 1.1 改造前后对比

```
┌─────────────────────────────────────────────────────────────────┐
│                    v1.0 (已废弃)                                 │
│  自研 I18nEngine → src/i18n/core.ts (~300行)                    │
│  自研类型定义   → src/i18n/types.ts                              │
│  自研检测器     → src/i18n/detector.ts                           │
│  问题: 重复造轮子 · 无安全模块 · 无插件能力                       │
└─────────────────────────────────────────────────────────────────┘
                            ↓ 重构为
┌─────────────────────────────────────────────────────────────────┐
│                    v2.0 (当前)                                   │
│  @yyc3/i18n-core → npm 包 (零依赖 · 生产级)                     │
│  ├── I18nEngine       → 翻译引擎 + LRU 缓存                     │
│  ├── Formatter        → ICU 消息格式 + 复数规则                   │
│  ├── Detector         → 系统语言自动检测                          │
│  ├── RTL Utils        → RTL 布局支持                             │
│  ├── Security Modules → ReDoS防护 · 时序攻击防护                  │
│  └── Plugin System    → ConsoleLogger / MissingKeyReporter       │
│                                                                 │
│  CLI 特有层 (本指南重点):                                        │
│  ├── cli/locales/      → CLI 专用翻译键                          │
│  ├── cli/prompts.ts    → 中文交互提示                            │
│  ├── cli/error-handler → 友好错误处理                            │
│  └── cli/terminal/     → CJK 终端适配                            │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 改造范围与优先级

| 模块 | 文件路径 | 优先级 | 工作量 | 状态 |
|------|----------|--------|--------|------|
| **Banner & 启动信息** | `src/cli/banner.ts` | P0 | 小 | ⏳ 待开始 |
| **Gateway 命令** | `src/cli/gateway-cli.ts` | P0 | 大 | ⏳ |
| **渠道管理命令** | `src/cli/channels-cli.ts` | P0 | 中 | ⏳ |
| **设备配对命令** | `src/cli/devices-cli.ts` | P1 | 中 | ⏳ |
| **会话管理命令** | `src/cli/sessions-cli.ts` | P1 | 中 | ⏳ |
| **定时任务命令** | `src/cli/cron-cli.ts` | P2 | 小 | ⏳ |
| **技能管理命令** | `src/cli/skills-cli.ts` | P2 | 小 | ⏳ |
| **配置管理命令** | `src/cli/config-cli.ts` | P1 | 大 | ⏳ |
| **Onboarding 向导** | `src/cli/onboard/` | P0 | 大 | ⏳ |
| **帮助信息** | 所有命令的 `.description()` | P1 | 中 | ⏳ |
| **错误消息** | 全局 error handler | P0 | 大 | ⏳ |
| **日志输出** | `src/terminal/` | P2 | 中 | ⏳ |

### 1.3 优先级定义

```
P0 (必须) - 核心用户体验，影响首次使用
├── Banner 启动横幅
├── Gateway 启动/停止/状态
├── Onboarding 新手引导
└── 关键错误提示

P1 (重要) - 日常使用高频功能
├── 渠道连接/断开
├── 配置查看/编辑
├── 设备配对流程
└── 会话管理

P2 (增强) - 低频但需完善的功能
├── 定时任务管理
├── 技能安装/更新
├── 日志查看
└── 调试命令
```

---

## 二、集成 @yyc3/i18n-core

### 2.1 安装依赖

```bash
# 项目根目录安装
cd /Users/yanyu/openclaw
npm install @yyc3/i18n-core

# 或使用本地包 (开发阶段)
npm install packages/i18n-core
```

### 2.2 初始化入口

```typescript
/**
 * file: src/cli/i18n/index.ts
 * description: CLI i18n 初始化 · 基于 @yyc3/i18n-core
 */

import {
  initI18n,
  setLocale,
  getLocale,
  t,
  addTranslations,
  detectSystemLocale,
  normalizeLocale,
  type Locale,
  type TranslationMap,
} from '@yyc3/i18n-core';

import { cliZhCN } from './locales/zh-CN';
import { cliEn } from './locales/en';

let initialized = false;

export async function initCliI18n(): Promise<void> {
  if (initialized) return;

  await initI18n({
    defaultLocale: 'zh-CN',
    fallbackLocale: 'en',
  });

  addTranslations('zh-CN', cliZhCN as unknown as TranslationMap);
  addTranslations('en', cliEn as unknown as TranslationMap);

  const systemLocale = detectSystemLocale();
  const normalized = normalizeLocale(systemLocale);
  setLocale(normalized);

  initialized = true;
}

export { t, setLocale, getLocale };
export type { Locale, TranslationMap };
```

### 2.3 全局类型声明

```typescript
/**
 * file: src/cli/i18n/types.d.ts
 * description: 全局类型声明 · 让 t() 在全局可用
 */

import '@yyc3/i18n-core';

declare global {
  var __cli_t: typeof import('./index').t;
}

export {};
```

### 2.4 package.json 脚本

```json
{
  "scripts": {
    "i18n:extract": "node scripts/extract-i18n-keys.js",
    "i18n:check": "node scripts/check-i18n-coverage.js"
  }
}
```

---

## 三、CLI 翻译资源定义

### 3.1 中文翻译文件

```typescript
/**
 * file: src/cli/i18n/locales/zh-CN.ts
 * description: CLI 中文翻译资源
 */

export const cliZhCN = {
  meta: {
    locale: 'zh-CN',
    version: '2026.4.15',
  },

  common: {
    success: '✅ 操作成功',
    error: '❌ 操作失败',
    cancel: '已取消',
    confirm: '确认',
    loading: '加载中...',
    yes: '是',
    no: '否',
  },

  banner: {
    title: '🦞 OpenClaw',
    tagline: '你的个人 AI 助手 · 多渠道智能网关',
    version: '版本',
  },

  gateway: {
    description: '启动和管理 Gateway 网关服务',
    start: {
      description: '启动 Gateway 服务',
      starting: '正在启动 Gateway (端口 {{port}})...',
      started: '✅ Gateway 启动成功 {{host}}:{{port}}',
      stopped: '✅ Gateway 已停止',
      stopping: '正在停止 Gateway...',
      alreadyRunning: '⚠️  Gateway 正在运行 (PID: {{pid}})',
      notRunning: 'Gateway 未运行',
    },
    status: {
      running: '🟢 运行中',
      stopped: '🔴 已停止',
      port: '监听端口',
      pid: '进程 ID',
      uptime: '运行时间',
    },
    options: {
      port: '指定端口号',
      bind: '绑定地址',
    },
  },

  channels: {
    description: '管理消息渠道连接',
    list: {
      title: '已配置的渠道',
      headerName: '渠道名称',
      headerType: '类型',
      headerStatus: '状态',
      noChannels: '暂无已配置的渠道',
    },
    connect: {
      connecting: '正在连接 {{channel}}...',
      connected: '✅ {{channel}} 连接成功',
      failed: '❌ {{channel}} 连接失败: {{error}}',
      alreadyConnected: '{{channel}} 已经处于连接状态',
    },
    disconnect: {
      disconnected: '✅ {{channel}} 已断开',
      notConnected: '{{channel}} 当前未连接',
    },
    types: {
      wechat: '微信',
      feishu: '飞书',
      dingtalk: '钉钉',
      telegram: 'Telegram',
      whatsapp: 'WhatsApp',
      discord: 'Discord',
      slack: 'Slack',
    },
  },

  onboard: {
    welcome: {
      title: '欢迎使用 OpenClaw!',
      subtitle: '让我们花几分钟时间完成初始设置...',
      preview: '即将完成以下设置:',
    },
    steps: {
      gateway: 'Gateway 设置',
      channels: '渠道配置',
      model: '模型选择',
      complete: '设置完成!',
    },
    prompt: {
      port: '请输入 Gateway 监听端口',
      bindMode: '请选择网络绑定模式',
      selectChannels: '选择要启用的消息渠道',
      selectModel: '选择 AI 模型提供商',
    },
    validation: {
      portRange: '端口号必须在 1-65535 之间',
      inputRequired: '此项为必填项',
    },
    complete: {
      title: '🎉 初始设置完成!',
      nextStep: '现在可以运行以下命令启动服务:',
      startCmd: 'openclaw gateway start',
    },
  },

  errors: {
    portInUse: '端口 {{port}} 已被占用，请更换端口或停止占用进程',
    network: '网络连接失败，请检查网络后重试',
    authFailed: '认证失败，请检查凭据是否正确',
    permissionDenied: '权限不足，无法执行此操作',
    notFound: '请求的资源不存在',
    serverError: '服务器内部错误',
    timeout: '请求超时，请稍后再试',
    invalidConfig: '配置文件格式无效',
    unknown: '发生了意外错误',
    suggestion: {
      portInUse: '尝试: openclaw gateway start --port <其他端口>',
      network: '检查防火墙设置和网络连接',
      checkCredentials: '运行: openclaw config edit 更新凭据',
      runDoctor: '运行: openclaw doctor 进行诊断',
      general: '查看日志获取更多详情: openclaw logs',
    },
  },

  help: {
    option: '显示帮助信息',
    command: '显示命令帮助',
  },

  prompt: {
    inputRequired: '此项不能为空',
  },
} as const;

export type CliZhCNKeys = keyof typeof cliZhCN;
```

### 3.2 英文翻译文件

```typescript
/**
 * file: src/cli/i18n/locales/en.ts
 * description: CLI 英文翻译资源 (Fallback)
 */

export const cliEn = {
  meta: {
    locale: 'en',
    version: '2026.4.15',
  },

  common: {
    success: '✅ Success',
    error: '❌ Error',
    cancel: 'Cancelled',
    confirm: 'Confirm',
    loading: 'Loading...',
    yes: 'Yes',
    no: 'No',
  },

  banner: {
    title: '🦞 OpenClaw',
    tagline: 'Your Personal AI Assistant · Multi-channel Gateway',
    version: 'Version',
  },

  gateway: {
    description: 'Start and manage the Gateway service',
    start: {
      description: 'Start the Gateway service',
      starting: 'Starting Gateway on port {{port}}...',
      started: '✅ Gateway started successfully {{host}}:{{port}}',
      stopped: '✅ Gateway stopped',
      stopping: 'Stopping Gateway...',
      alreadyRunning: '⚠️  Gateway is already running (PID: {{pid}})',
      notRunning: 'Gateway is not running',
    },
    status: {
      running: '🟢 Running',
      stopped: '🔴 Stopped',
      port: 'Listen Port',
      pid: 'Process ID',
      uptime: 'Uptime',
    },
    options: {
      port: 'Specify port number',
      bind: 'Bind address',
    },
  },

  channels: {
    description: 'Manage messaging channel connections',
    list: {
      title: 'Configured Channels',
      headerName: 'Channel Name',
      headerType: 'Type',
      headerStatus: 'Status',
      noChannels: 'No configured channels',
    },
    connect: {
      connecting: 'Connecting to {{channel}}...',
      connected: '✅ {{channel}} connected successfully',
      failed: '❌ {{channel}} connection failed: {{error}}',
      alreadyConnected: '{{channel}} is already connected',
    },
    disconnect: {
      disconnected: '✅ {{channel}} disconnected',
      notConnected: '{{channel}} is not currently connected',
    },
    types: {
      wechat: 'WeChat',
      feishu: 'Feishu/Lark',
      dingtalk: 'DingTalk',
      telegram: 'Telegram',
      whatsapp: 'WhatsApp',
      discord: 'Discord',
      slack: 'Slack',
    },
  },

  onboard: {
    welcome: {
      title: 'Welcome to OpenClaw!',
      subtitle: 'Let us take a few minutes to complete initial setup...',
      preview: 'We will configure the following:',
    },
    steps: {
      gateway: 'Gateway Setup',
      channels: 'Channel Configuration',
      model: 'Model Selection',
      complete: 'Setup Complete!',
    },
    prompt: {
      port: 'Enter Gateway listen port',
      bindMode: 'Select network binding mode',
      selectChannels: 'Select messaging channels to enable',
      selectModel: 'Select AI model provider',
    },
    validation: {
      portRange: 'Port must be between 1-65535',
      inputRequired: 'This field is required',
    },
    complete: {
      title: '🎉 Initial Setup Complete!',
      nextStep: 'You can now start the service with:',
      startCmd: 'openclaw gateway start',
    },
  },

  errors: {
    portInUse: 'Port {{port}} is already in use. Use a different port or stop the occupying process',
    network: 'Network connection failed. Please check your network',
    authFailed: 'Authentication failed. Please verify your credentials',
    permissionDenied: 'Permission denied. Cannot perform this action',
    notFound: 'The requested resource does not exist',
    serverError: 'Internal server error',
    timeout: 'Request timed out. Please try again later',
    invalidConfig: 'Invalid configuration format',
    unknown: 'An unexpected error occurred',
    suggestion: {
      portInUse: 'Try: openclaw gateway start --port <other-port>',
      network: 'Check firewall settings and network connectivity',
      checkCredentials: 'Run: openclaw config edit to update credentials',
      runDoctor: 'Run: openclaw doctor to diagnose issues',
      general: 'Check logs for details: openclaw logs',
    },
  },

  help: {
    option: 'Show help information',
    command: 'Show command help',
  },

  prompt: {
    inputRequired: 'This field is required',
  },
} as const;
```

---

## 四、核心命令中文化

### 4.1 Banner 启动横幅

```typescript
/**
 * file: src/cli/banner.ts
 * description: CLI 启动横幅 · 使用 @yyc3/i18n-core
 */

import chalk from 'chalk';
import { t } from './i18n';

interface BannerOptions {
  version?: string;
  locale?: string;
}

export function printCliBanner(options: BannerOptions = {}): void {
  const { version = '' } = options;

  console.log(`
${chalk.cyan('╔══════════════════════════════════════════════════════╗')}
${chalk.cyan('║')}                                                      ${chalk.cyan('║')}
${chalk.cyan('║')}  ${chalk.white.bold(t('banner.title'))}${' '.repeat(Math.max(0, 30 - t('banner.title').length))}${chalk.cyan('║')}
${chalk.cyan('║')}                                                      ${chalk.cyan('║')}
${chalk.cyan('║')}  ${chalk.gray(t('banner.tagline'))}${' '.repeat(Math.max(0, 34 - t('banner.tagline').length))}${chalk.cyan('║')}
${chalk.cyan('║')}                                                      ${chalk.cyan('║')}
${chalk.cyan('╚══════════════════════════════════════════════════════╝')}
  `);

  if (version) {
    console.log(`  ${chalk.dim(`${t('banner.version')}: ${version}`)}\n`);
  }
}
```

### 4.2 Gateway 命令完整实现

```typescript
/**
 * file: src/cli/gateway-cli.ts
 * description: Gateway 管理 · 基于 @yyc3/i18n-core 的完整中文交互
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { t } from './i18n';

export function createGatewayCommand(): Command {
  const gateway = new Command('gateway');

  gateway
    .description(t('gateway.description'))

    .command('start')
    .description(t('gateway.start.description'))
    .option('-p, --port <number>', t('gateway.options.port'), String(18789))
    .option('-b, --bind <address>', t('gateway.options.bind'), '127.0.0.1')
    .action(async (options) => {
      try {
        console.log(`\n${chalk.cyan(t('gateway.start.starting', { port: options.port }))}`);

        await startGateway(options);

        console.log(chalk.green(`\n${t('common.success')}\n`));
        console.log(t('gateway.start.started', {
          host: options.bind,
          port: options.port,
        }));

      } catch (error: unknown) {
        handleGatewayError(error);
      }
    });

  gateway
    .command('stop')
    .description('停止 Gateway 服务')
    .action(async () => {
      console.log(chalk.yellow(t('gateway.start.stopping')));
      await stopGateway();
      console.log(chalk.green(t('gateway.start.stopped')));
    });

  gateway
    .command('status')
    .description('查看 Gateway 运行状态')
    .action(async () => {
      const status = await getGatewayStatus();

      if (status.running) {
        console.log(chalk.green(t('gateway.status.running')));
        console.log(`  ${t('gateway.status.port')}:  ${status.port}`);
        console.log(`  ${t('gateway.status.pid')}:   ${status.pid}`);
        console.log(`  ${t('gateway.status.uptime')}: ${formatUptime(status.uptime)}`);
      } else {
        console.log(chalk.red(t('gateway.status.notRunning')));
      }
    });

  return gateway;
}
```

### 4.3 Onboarding 向导完全中文化

```typescript
/**
 * file: src/cli/onboard/wizard.ts
 * description: 新手引导向导 · 全中文沉浸式体验
 */

import prompts from 'prompts';
import { t } from '../i18n';
import chalk from 'chalk';

interface OnboardConfig {
  gateway: { port: number; bind: string; authMode: string };
  channels: string[];
  model: { provider: string; apiKey?: string };
  locale: string;
}

export async function runOnboardWizard(): Promise<OnboardConfig> {
  console.clear();
  printWelcomeScreen();

  const config: OnboardConfig = {
    gateway: { port: 18789, bind: 'loopback', authMode: 'token' },
    channels: [],
    model: { provider: '' },
    locale: 'zh-CN',
  };

  config.gateway = await stepGatewayConfig();
  config.channels = await stepChannelSelection();
  config.model = await stepModelSelection();
  printCompletionScreen(config);

  return config;
}

function printWelcomeScreen(): void {
  console.log(`
${chalk.cyan('╔══════════════════════════════════════════════════════╗')}
${chalk.cyan('║')}                                                      ${chalk.cyan('║')}
${chalk.cyan('║')}  ${chalk.white.bold(t('onboard.welcome.title'))}${' '.repeat(Math.max(0, 38 - t('onboard.welcome.title').length))}${chalk.cyan('║')}
${chalk.cyan('║')}                                                      ${chalk.cyan('║')}
${chalk.cyan('║')}  ${chalk.gray(t('banner.tagline'))}${' '.repeat(Math.max(0, 34 - t('banner.tagline').length))}${chalk.cyan('║')}
${chalk.cyan('║')}                                                      ${chalk.cyan('║')}
${chalk.cyan('╚══════════════════════════════════════════════════════╝')}
  `);

  console.log(chalk.gray(t('onboard.welcome.subtitle')));
  console.log(`  ${chalk.blue('→')} ${t('onboard.welcome.preview')}`);
  console.log(`     ${chalk.dim(`1️⃣  ${t('onboard.steps.gateway')}`)}`);
  console.log(`     ${chalk.dim(`2️⃣  ${t('onboard.steps.channels')}`)}`);
  console.log(`     ${chalk.dim(`3️⃣  ${t('onboard.steps.model')}`)}`);
}

async function stepGatewayConfig() {
  const questions = await prompts([
    {
      type: 'number',
      name: 'port',
      message: chalk.cyan('📡 ') + t('onboard.prompt.port'),
      initial: 18789,
      validate: (value: number) => {
        if (value < 1 || value > 65535) return t('onboard.validation.portRange');
        return true;
      },
    },
    {
      type: 'select',
      name: 'bind',
      message: chalk.cyan('🌐 ') + t('onboard.prompt.bindMode'),
      choices: [
        { title: '本地回环 (仅本机访问)', value: 'loopback', description: '推荐用于个人使用' },
        { title: '局域网访问 (0.0.0.0)', value: 'lan', description: '允许同网络设备访问' },
        { title: 'Tailscale 网络', value: 'tailnet', description: '通过 Tailscale 安全远程访问' },
      ],
    },
  ]);

  return { port: questions.port, bind: questions.bind, authMode: 'token' };
}

async function stepChannelSelection(): Promise<string[]> {
  const questions = await prompts({
    type: 'multiselect',
    name: 'selected',
    message: chalk.cyan('💬 ') + t('onboard.prompt.selectChannels'),
    choices: [
      { title: '📱 微信 (WeChat)', value: 'wechat', selected: true, description: '国内最常用' },
      { title: '🚀 飞书 (Feishu/Lark)', value: 'feishu', description: '企业协作平台' },
      { title: '💬 钉钉 (DingTalk)', value: 'dingtalk', description: '阿里系企业通讯' },
      { title: '✈️ Telegram', value: 'telegram', description: '国际主流即时通讯' },
      { title: '📞 WhatsApp', value: 'whatsapp', description: '全球最大即时通讯' },
    ],
  });

  return questions.selected || [];
}

async function stepModelSelection() {
  const questions = await prompts([
    {
      type: 'select',
      name: 'provider',
      message: chalk.cyan('🤖 ') + t('onboard.prompt.selectModel'),
      choices: [
        { title: '通义千问 Qwen (⭐ 推荐)', value: 'qwen', description: '阿里云 · 快速响应 · 中文优秀' },
        { title: '智谱 GLM-4', value: 'glm', description: '智谱AI · 长文本处理强' },
        { title: '月之暗面 Moonshot (Kimi)', value: 'moonshot', description: '超长上下文' },
        { title: 'OpenAI GPT-4', value: 'openai', description: '国际领先 · 需要代理' },
        { title: 'Anthropic Claude', value: 'anthropic', description: '安全对齐好 · 需要代理' },
      ],
    },
  ]);

  return { provider: questions.provider };
}

function printCompletionScreen(config: OnboardConfig): void {
  console.log(`
${chalk.green('╔══════════════════════════════════════════════════════╗')}
${chalk.green('║')}  ${chalk.white.bold(t('onboard.complete.title'))}${' '.repeat(Math.max(0, 28 - t('onboard.complete.title').length)))}${chalk.green('║')}
${chalk.green('╚══════════════════════════════════════════════════════╝')}
  `);

  console.log(`  ${chalk.dim(t('onboard.complete.nextStep'))}`);
  console.log(`  ${chalk.cyan('  $ ')}${chalk.bold(t('onboard.complete.startCmd'))}\n`);
}
```

---

## 五、交互式提示优化

### 5.1 通用提示工具库

```typescript
/**
 * file: src/cli/prompts.ts
 * description: 通用交互式提示工具 · 中文优化版
 */

import prompts from 'prompts';
import { t } from './i18n';
import chalk from 'chalk';

export async function confirm(message: string): Promise<boolean> {
  const { value } = await prompts({
    type: 'confirm',
    name: 'value',
    message: chalk.yellow('⚠️  ') + message,
  });
  return value ?? false;
}

export async function input(
  message: string,
  options?: { required?: boolean },
): Promise<string> {
  const { value } = await prompts({
    type: 'text',
    name: 'value',
    message: chalk.cyan('➤ ') + message,
    validate: (val) => {
      if (options?.required && !val?.trim()) return t('prompt.inputRequired');
      return true;
    },
  });
  return value || '';
}

export async function select<T extends string>(
  message: string,
  choices: Array<{ title: string; value: T; description?: string }>,
): Promise<T> {
  const { value } = await prompts({
    type: 'select',
    name: 'value',
    message: chalk.cyan('📍 ') + message,
    choices,
  });
  return value!;
}

/** 进度指示器 */
export class ProgressIndicator {
  private spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  private index = 0;
  private interval?: ReturnType<typeof setInterval>;
  private message: string;

  constructor(initialMessage: string) {
    this.message = initialMessage;
  }

  start(): void {
    process.stdout.write(`\r${chalk.cyan(this.spinner[this.index])} ${this.message}`);
    this.interval = setInterval(() => {
      this.index = (this.index + 1) % this.spinner.length;
      process.stdout.write(`\r${chalk.cyan(this.spinner[this.index])} ${this.message}`);
    }, 100);
  }

  update(message: string): void {
    this.message = message;
  }

  stop(finalMessage?: string): void {
    if (this.interval) clearInterval(this.interval);
    if (finalMessage) process.stdout.write(`\r${finalMessage}\n`);
    else process.stdout.write('\r');
  }
}
```

---

## 六、错误消息友好化

### 6.1 统一错误处理器

```typescript
/**
 * file: src/cli/error-handler.ts
 * description: 统一错误处理 · 基于 @yyc3/i18n-core 的中文友好提示
 */

import { t } from './i18n';
import chalk from 'chalk';

export class CliError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: { suggestion?: string },
  ) {
    super(message);
    this.name = 'CliError';
  }
}

const ERROR_MAP: Record<
  string,
  { template: string; params?: string[]; suggestion?: string }
> = {
  E_PORT_IN_USE: {
    template: 'errors.portInUse',
    params: ['port'],
    suggestion: 'errors.suggestion.portInUse',
  },
  E_NETWORK_UNREACHABLE: {
    template: 'errors.network',
    suggestion: 'errors.suggestion.network',
  },
  E_AUTH_FAILED: {
    template: 'errors.authFailed',
    suggestion: 'errors.suggestion.checkCredentials',
  },
  E_CONFIG_INVALID: {
    template: 'errors.invalidConfig',
    suggestion: 'errors.suggestion.runDoctor',
  },
};

export function formatCliError(error: unknown): string {
  const lines: string[] = [''];
  lines.push(chalk.red('─'.repeat(50)));

  if (error instanceof CliError) {
    const mapping = ERROR_MAP[error.code];

    if (mapping) {
      const params = mapping.params?.reduce(
        (acc, key) => ({ ...acc, [key]: (error as Record<string, unknown>)[key] ?? '' }),
        {},
      );
      lines.push(chalk.red.bold(`❌ ${t(mapping.template, params)}`));
    } else {
      lines.push(chalk.red.bold(`❌ ${error.message}`));
    }

    const suggestion = mapping?.suggestion || error.context?.suggestion;
    if (suggestion) {
      lines.push('');
      lines.push(chalk.yellow(`💡 ${t(suggestion)}`));
    }
  } else if (error instanceof Error) {
    lines.push(chalk.red.bold(`❌ ${t('errors.unknown')}`));
    lines.push('');
    lines.push(chalk.gray(`   ${error.message}`));
    lines.push('');
    lines.push(chalk.yellow(`💡 ${t('errors.suggestion.general')}`));
  }

  lines.push(chalk.red('─'.repeat(50)));
  lines.push('');

  return lines.join('\n');
}
```

---

## 七、帮助系统完善

### 7.1 完整帮助信息示例

```typescript
/**
 * file: src/cli/help.ts
 * description: 帮助系统 · 完整中文帮助文档
 */

import { Command } from 'commander';
import { t } from './i18n';

export function createHelpCommand(program: Command): void {
  program
    .helpOption('-h, --help', t('help.option'))
    .addHelpCommand('help [command]', t('help.command'));
}

const EXAMPLES: Record<string, Array<{ cmd: string; desc: string }>> = {
  gateway: [
    { cmd: 'openclaw gateway start', desc: '启动 Gateway 服务 (默认端口 18789)' },
    { cmd: 'openclaw gateway start --port 3000', desc: '指定端口启动' },
    { cmd: 'openclaw gateway stop', desc: '停止 Gateway' },
    { cmd: 'openclaw gateway status', desc: '查看运行状态' },
  ],
  channels: [
    { cmd: 'openclaw channels list', desc: '列出所有已配置的渠道' },
    { cmd: 'openclaw channels connect wechat', desc: '连接微信渠道' },
    { cmd: 'openclaw channels disconnect telegram', desc: '断开 Telegram' },
  ],
  config: [
    { cmd: 'openclaw config get', desc: '查看当前配置' },
    { cmd: 'openclaw config edit', desc: '打开编辑器修改配置' },
  ],
  doctor: [
    { cmd: 'openclaw doctor', desc: '运行诊断检查' },
    { cmd: 'openclaw doctor --fix', desc: '自动修复常见问题' },
  ],
};

export { EXAMPLES };
```

---

## 八、特殊场景处理

### 8.1 Unicode/CJK 字符宽度计算

```typescript
/**
 * file: src/cli/terminal/unicode.ts
 * description: Unicode/Emoji/CJK 字符宽度处理
 * note: 此工具可考虑贡献至 @yyc3/i18n-core 作为独立导出
 */

export function stringDisplayWidth(str: string): number {
  let width = 0;

  for (const char of str) {
    const codePoint = char.codePointAt(0)!;

    if (
      (codePoint >= 0x4e00 && codePoint <= 0x9fff) ||
      (codePoint >= 0x3400 && codePoint <= 0x4dbf)
    ) {
      width += 2;
    } else if (
      (codePoint >= 0x3040 && codePoint <= 0x30ff) ||
      (codePoint >= 0xac00 && codePoint <= 0xd7af)
    ) {
      width += 2;
    } else if ('，。！？：；""''《》【】（）'.includes(char)) {
      width += 2;
    } else if (codePoint >= 0x1f000 && codePoint <= 0x1ffff) {
      width += 2;
    } else {
      width += 1;
    }
  }

  return width;
}

export function padCJK(str: string, targetWidth: number, fillChar = ' '): string {
  const currentWidth = stringDisplayWidth(str);
  const paddingNeeded = Math.max(0, targetWidth - currentWidth);
  return str + fillChar.repeat(paddingNeeded);
}
```

### 8.2 终端自适应布局

```typescript
/**
 * file: src/cli/terminal/layout.ts
 * description: 终端布局适配 · CJK 安全
 */

import { stringDisplayWidth, padCJK } from './unicode';

export function getTerminalWidth(): number {
  return process.stdout.columns || 80;
}

export function printTable(headers: string[], rows: string[][]): void {
  const width = getTerminalWidth();
  const colCount = headers.length;
  const colWidth = Math.floor((width - colCount - 3) / colCount);

  let headerLine = '│';
  headers.forEach((h) => {
    headerLine += ` ${padCJK(h, colWidth)} │`;
  });
  console.log(headerLine);

  rows.forEach((row) => {
    let line = '│';
    row.forEach((cell) => {
      line += ` ${padCJK(cell, colWidth)} │`;
    });
    console.log(line);
  });
}

export function truncate(text: string, maxLength: number): string {
  if (stringDisplayWidth(text) <= maxLength) return text;

  let currentWidth = 0;
  let result = '';
  for (const char of text) {
    currentWidth += stringDisplayWidth(char);
    if (currentWidth > maxLength - 3) break;
    result += char;
  }
  return result + '...';
}
```

---

## 九、测试与验证

### 9.1 单元测试

```typescript
/**
 * file: src/cli/__tests__/localization.test.ts
 * description: CLI 本地化测试套件
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { initCliI18n, t, getLocale, setLocale } from '../i18n';

describe('CLI Localization (@yyc3/i18n-core)', () => {
  beforeAll(async () => {
    await initCliI18n();
  });

  beforeEach(() => {
    setLocale('zh-CN');
  });

  it('应返回正确的中文翻译', () => {
    expect(t('common.success')).toBe('✅ 操作成功');
    expect(t('gateway.description')).toContain('Gateway');
  });

  it('应支持模板变量插值', () => {
    const result = t('gateway.start.starting', { port: 18789 });
    expect(result).toContain('18789');
  });

  it('缺少翻译时应返回 key', () => {
    expect(t('nonexistent.key')).toBe('nonexistent.key');
  });

  it('应正确计算 CJK 字符宽度', () => {
    const { stringDisplayWidth } = require('../terminal/unicode');
    expect(stringDisplayWidth('你好')).toBe(4);
    expect(stringDisplayWidth('Hello')).toBe(5);
    expect(stringDisplayWidth('你好世界')).toBe(8);
  });

  it('padCJK 应按显示宽度填充', () => {
    const { padCJK } = require('../terminal/unicode');
    expect(padCJK('你好', 6).length).toBeGreaterThanOrEqual(4);
    expect(stringDisplayWidth(padCJK('你好', 6))).toBe(6);
  });

  it('切换到英文应返回英文翻译', () => {
    setLocale('en');
    expect(t('common.success')).toBe('✅ Success');
  });
});
```

### 9.2 手动测试清单

```markdown
## CLI 中文化手动测试清单

### 基础功能
- [ ] 启动 `openclaw` 无参数时显示中文 Banner
- [ ] `openclaw --version` 版本号正常显示
- [ ] `openclaw --help` 显示完整的中文帮助信息

### Gateway 命令
- [ ] `openclaw gateway start` 显示中文启动信息
- [ ] 端口占用时显示友好的中文错误提示
- [ ] `openclaw gateway status` 状态表格显示中文

### 渠道命令
- [ ] `openclaw channels list` 渠道列表显示中文
- [ ] `openclaw channels connect wechat` 连接过程中文提示

### Onboarding 向导
- [ ] `openclaw onboard` 启动完整的中文引导
- [ ] 所有步骤标题和说明都是中文
- [ ] 交互式提示清晰易懂

### 错误处理
- [ ] 网络错误时显示中文提示
- [ ] 权限错误时显示中文建议
- [ ] 未知的异常也有友好的中文反馈

### 特殊情况
- [ ] 终端宽度较窄时不乱码
- [ ] 包含 Emoji 的文本正确显示
- [ ] 中文长文本正确换行
- [ ] CJK 表格列宽计算准确
```

---

## 十、发布与部署

### 10.1 版本兼容性

```jsonc
// openclaw package.json
{
  "name": "openclaw",
  "version": "2026.4.15-cn",
  "description": "Personal AI assistant - 多渠道AI智能体网关 (中文优化版)",
  "dependencies": {
    "@yyc3/i18n-core": "^2.0.0"
  },
  "keywords": ["ai", "assistant", "chinese", "i18n", "yyc3"]
}
```

### 10.2 发布说明模板

```markdown
## v2026.4.15 - 中文体验优化版 (v2.0 重构)

### ✨ 新特性
- 🇨🇳 **全面中文支持**
  - CLI 命令行界面 100% 中文化
  - Onboarding 新手引导全中文交互
  - 错误消息和提示全部中文化

###  技术改进
- 📦 **迁移至 @yyc3/i18n-core**
  - 移除自研 i18n 引擎 (~300行代码消除)
  - 零外部依赖，生产级安全保障
  - ReDoS 防护 + 时序攻击防护内置
  - 插件化架构 (ConsoleLogger / MissingKeyReporter)

### 📊 质量指标
- 测试覆盖率目标: >80%
- 翻译键完整性: 100%
- CJK 终端适配: 通过
```

---

## 📎 附录: 与旧版差异对照

| 项目 | v1.0 (自研引擎) | v2.0 (@yyc3/i18n-core) |
|------|------------------|------------------------|
| **依赖体积** | ~300 行自研代码 | 0 外部依赖 |
| **安全性** | 无 | ReDoS + 时序攻击防护 |
| **缓存策略** | 无 | LRU Cache 内置 |
| **插件能力** | 无 | ConsoleLogger / MissingKeyReporter |
| **RTL 支持** | 无 | 完整 RTL 工具集 |
| **语言检测** | 基础版 | 完整浏览器/Node 检测 |
| **维护成本** | 高 (自行维护) | 低 (npm 包统一升级) |
