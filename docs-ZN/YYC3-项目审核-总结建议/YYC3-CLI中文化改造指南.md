---
file: YYC3-CLI中文化改造指南.md
description: OpenClaw CLI命令行工具中文本地化实施指南 - 含详细步骤、代码模板和最佳实践
author: YanYuCloudCube Team <admin@0379.email>
version: v1.0.0
created: 2026-04-10
updated: 2026-04-10
status: production-ready
tags: [cli],[localization],[Chinese],[implementation-guide],[terminal]
category: implementation-guide
language: zh-CN
audience: developers,devops-engineers
complexity: advanced
---

> ***YanYuCloudCube***
> *言启象限 | 语枢未来*
> ***Words Initiate Quadrants, Language Serves as Core for Future***
> *万象归元于云枢 | 深栈智启新纪元*
> ***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***

---

# 🔧 OpenClaw CLI 中文化改造指南

**版本**: v1.0.0  
**制定日期**: 2026-04-10  
**适用范围**: `openclaw` 命令行工具全量命令  
**目标用户**: 中文开发者、运维人员、普通用户  
**改造原则**: 零配置默认中文 · 保持技术标识英文 · 友好错误提示  

---

## 📋 目录

- [一、改造范围与优先级](#一改造范围与优先级)
- [二、基础设施搭建](#二基础设施搭建)
- [三、核心命令中文化](#三核心命令中文化)
- [四、交互式提示优化](#四交互式提示优化)
- [五、错误消息友好化](#五错误消息友好化)
- [六、帮助系统完善](#六帮助系统完善)
- [七、特殊场景处理](#七特殊场景处理)
- [八、测试与验证](#八测试与验证)
- [九、发布与部署](#九发布与部署)

---

## 一、改造范围与优先级

### 1.1 改造模块清单

| 模块 | 文件路径 | 优先级 | 工作量 | 状态 |
|------|----------|--------|--------|------|
| **Banner & 启动信息** | `src/cli/banner.ts` | P0 (最高) | 小 | ⏳ 待开始 |
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

### 1.2 优先级定义

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

## 二、基础设施搭建

### 2.1 项目结构初始化

```bash
# 创建 i18n 相关目录结构
mkdir -p src/i18n
mkdir -p src/locales
mkdir -p src/cli/i18n

# 创建核心文件
touch src/i18n/index.ts
touch src/i18n/core.ts
touch src/i18n/types.ts
touch src/i18n/detector.ts
touch src/locales/en.json
touch src/locales/zh-CN.json
```

### 2.2 配置 TypeScript 类型声明

```typescript
/**
 * file: src/i18n/types.d.ts
 * description: 全局类型声明 · 让 t() 函数在全局可用
 */

declare global {
  /**
   * 翻译函数 - 全局可用
   */
  function t(key: string, params?: Record<string, unknown>): string;
  
  /**
   * 获取当前语言环境
   */
  function getLocale(): string;
  
  /**
   * 切换语言环境
   */
  function setLocale(locale: string): void;
}

export {};
```

### 2.3 在 package.json 中添加脚本

```json
{
  "scripts": {
    "i18n:extract": "node scripts/extract-i18n-keys.js",
    "i18n:check": "node scripts/check-i18n-coverage.js"
  }
}
```

---

## 三、核心命令中文化

### 3.1 Banner 启动横幅改造

```typescript
/**
 * file: src/cli/banner.ts (改造后)
 * description: CLI启动横幅 · 支持多语言显示
 */

import { t } from '../i18n/core';

// 使用 i18n 翻译标题
const title = t('banner.title'); // "🦞 OpenClaw" (保持品牌一致)
const tagline = pickTagline({ ...options });

export { formatCliBannerLine };
```

### 3.2 Gateway 命令完整实现

```typescript
/**
 * file: src/cli/gateway-cli.ts (改造后)
 * description: Gateway 管理 · 完整中文交互
 */

import { Command } from 'commander';
import { t } from '../i18n/core';

export function createGatewayCommand(): Command {
  const gateway = new Command('gateway');
  
  gateway
    .description(t('gateway.description')) // "启动和管理 Gateway 网关服务"
    
    .command('start')
    .description(t('gateway.start.description')) // "启动 Gateway 服务"
    .option('-p, --port <number>', t('gateway.options.port'), String(18789))
    .action(async (options) => {
      try {
        console.log(`\n${t('gateway.starting', { port: options.port })}`);
        // "正在启动 Gateway (端口 18789)..."
        
        await startGateway(options);
        
        console.log(`${t('common.success')}\n`);
        // "✅ 操作成功"
        
        console.log(t('gateway.started', { 
          host: '127.0.0.1',
          port: options.port 
        }));
        // "✅ Gateway 启动成功 http://127.0.0.1:18789"
        
      } catch (error) {
        handleGatewayError(error);
      }
    });
    
  return gateway;
}
```

### 3.3 Onboarding 向导完全中文化

```typescript
/**
 * file: src/cli/onboard/wizard.ts (完整重写)
 * description: 新手引导向导 · 全中文沉浸式体验
 */

import prompts from 'prompts';
import { t } from '../../i18n/core';
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
    locale: 'zh-CN'
  };
  
  // Step 1: Gateway 配置
  config.gateway = await stepGatewayConfig();
  
  // Step 2: 渠道选择
  config.channels = await stepChannelSelection();
  
  // Step 3: 模型选择
  config.model = await stepModelSelection();
  
  // 完成
  printCompletionScreen(config);
  
  return config;
}

/** 欢迎界面 */
function printWelcomeScreen(): void {
  console.log(`
${chalk.cyan('╔══════════════════════════════════════════════════════╗')}
${chalk.cyan('║')}                                                      ${chalk.cyan('║')}
${chalk.cyan('║')}  ${chalk.white.bold('🦞  欢迎使用 OpenClaw!')}                          ${chalk.cyan('║')}
${chalk.cyan('║')}                                                      ${chalk.cyan('║')}
${chalk.cyan('║')}  ${chalk.gray('你的个人 AI 助手 · 多渠道智能网关')}                     ${chalk.cyan('║')}
${chalk.cyan('║')}                                                      ${chalk.cyan('║')}
${chalk.cyan('╚══════════════════════════════════════════════════════╝')}
  `);

  console.log(chalk.gray(t('onboard.welcome.subtitle')));
  // "让我们花几分钟时间完成初始设置...\n"

  console.log(`  ${chalk.blue('→')} ${t('onboard.steps.preview')}`);
  console.log(`     ${chalk.dim('1️⃣  ' + t('onboard.step.gateway'))}`);
  console.log(`     ${chalk.dim('2️⃣  ' + t('onboard.step.channels'))}`);
  console.log(`     ${chalk.dim('3️⃣  ' + t('onboard.step.model'))}`);
}

/** Step 1: Gateway 配置 */
async function stepGatewayConfig() {
  const questions = await prompts([
    {
      type: 'number',
      name: 'port',
      message: chalk.cyan('📡 ' + t('onboard.prompt.port')),
      initial: 18789,
      validate: (value: number) => {
        if (value < 1 || value > 65535) return t('onboard.validation.portRange');
        return true;
      }
    },
    {
      type: 'select',
      name: 'bind',
      message: chalk.cyan('🌐 ' + t('onboard.prompt.bindMode')),
      choices: [
        { title: '本地回环 (仅本机访问)', value: 'loopback', description: '推荐用于个人使用' },
        { title: '局域网访问 (0.0.0.0)', value: 'lan', description: '允许同网络设备访问' },
        { title: 'Tailscale 网络', value: 'tailnet', description: '通过 Tailscale 安全远程访问' }
      ]
    }
  ]);
  
  return {
    port: questions.port,
    bind: questions.bind,
    authMode: 'token'
  };
}

/** Step 2: 渠道选择 */
async function stepChannelSelection(): Promise<string[]> {
  const questions = await prompts({
    type: 'multiselect',
    name: 'selected',
    message: chalk.cyan('💬 ' + t('onboard.prompt.selectChannels')),
    choices: [
      { title: '📱 微信 (WeChat)', value: 'wechat', selected: true, description: '国内最常用' },
      { title: '🚀 飞书 (Feishu/Lark)', value: 'feishu', description: '企业协作平台' },
      { title: '💬 钉钉 (DingTalk)', value: 'dingtalk', description: '阿里系企业通讯' },
      { title: '✈️ Telegram', value: 'telegram', description: '国际主流即时通讯' },
      { title: '📞 WhatsApp', value: 'whatsapp', description: '全球最大即时通讯' }
    ]
  });
  
  return questions.selected || [];
}

/** Step 3: 模型选择 */
async function stepModelSelection() {
  const questions = await prompts([
    {
      type: 'select',
      name: 'provider',
      message: chalk.cyan('🤖 ' + t('onboard.prompt.selectModel')),
      choices: [
        { title: '通义千问 Qwen (⭐ 推荐)', value: 'qwen', description: '阿里云 · 快速响应 · 中文优秀' },
        { title: '智谱 GLM-4', value: 'glm', description: '智谱AI · 长文本处理强' },
        { title: '月之暗面 Moonshot (Kimi)', value: 'moonshot', description: '超长上下文' },
        { title: 'OpenAI GPT-4', value: 'openai', description: '国际领先 · 需要代理' },
        { title: 'Anthropic Claude', value: 'anthropic', description: '安全对齐好 · 需要代理' }
      ]
    }
  ]);
  
  return { provider: questions.provider };
}
```

---

## 四、交互式提示优化

### 4.1 通用提示工具库

```typescript
/**
 * file: src/cli/prompts.ts
 * description: 通用交互式提示工具 · 中文优化版
 */

import prompts from 'prompts';
import { t } from '../i18n/core';
import chalk from 'chalk';

export async function confirm(message: string): Promise<boolean> {
  const { value } = await prompts({
    type: 'confirm',
    name: 'value',
    message: chalk.yellow('⚠️  ') + message
  });
  return value;
}

export async function input(message: string, options?: { required?: boolean }): Promise<string> {
  const { value } = await prompts({
    type: 'text',
    name: 'value',
    message: chalk.cyan('➤ ') + message,
    validate: (val) => {
      if (options?.required && !val?.trim()) return t('prompt.inputRequired');
      return true;
    }
  });
  return value || '';
}

export async function select<T extends string>(
  message: string,
  choices: Array<{ title: string; value: T; description?: string }>
): Promise<T> {
  const { value } = await prompts({
    type: 'select',
    name: 'value',
    message: chalk.cyan('📍 ') + message,
    choices
  });
  return value;
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

## 五、错误消息友好化

### 5.1 统一错误处理器

```typescript
/**
 * file: src/cli/error-handler.ts
 * description: 统一错误处理 · 中文友好提示
 */

import { t } from '../i18n/core';
import chalk from 'chalk';

export class CliError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: { suggestion?: string }
  ) {
    super(message);
    this.name = 'CliError';
  }
}

const ERROR_MAP: Record<string, { template: string; suggestion?: string }> = {
  'E_PORT_IN_USE': {
    template: 'error.portInUse',
    suggestion: 'error.suggestion.portInUse'
  },
  'E_NETWORK_UNREACHABLE': {
    template: 'error.network',
    suggestion: 'error.suggestion.network'
  },
  'E_AUTH_FAILED': {
    template: 'error.authFailed',
    suggestion: 'error.suggestion.checkCredentials'
  },
  'E_CONFIG_INVALID': {
    template: 'error.invalidConfig',
    suggestion: 'error.suggestion.runDoctor'
  }
};

export function formatCliError(error: unknown): string {
  const lines: string[] = [''];
  lines.push(chalk.red('─'.repeat(50)));
  
  if (error instanceof CliError) {
    const mapping = ERROR_MAP[error.code];
    
    if (mapping) {
      lines.push(chalk.red.bold(`❌ ${t(mapping.template)}`));
    } else {
      lines.push(chalk.red.bold(`❌ ${error.message}`));
    }
    
    const suggestion = mapping?.suggestion || error.context?.suggestion;
    if (suggestion) {
      lines.push('');
      lines.push(chalk.yellow(`💡 ${t(suggestion)}`));
    }
    
  } else if (error instanceof Error) {
    lines.push(chalk.red.bold(`❌ ${t('error.unknown')}`));
    lines.push('');
    lines.push(chalk.gray(`   ${error.message}`));
    lines.push('');
    lines.push(chalk.yellow(`💡 ${t('error.suggestion.general')}`));
  }
  
  lines.push(chalk.red('─'.repeat(50)));
  lines.push('');
  
  return lines.join('\n');
}
```

---

## 六、帮助系统完善

### 6.1 完整帮助信息示例

```typescript
/**
 * file: src/cli/help.ts
 * description: 帮助系统 · 完整中文帮助文档
 */

export function createHelpCommand(program: Command): void {
  program
    .helpOption('-h, --help', t('help.option'))
    .addHelpCommand('help [command]', t('help.command'));
}

/**
 * 示例数据库
 */
const EXAMPLES = {
  'gateway': [
    { cmd: 'openclaw gateway start', desc: '启动 Gateway 服务 (默认端口 18789)' },
    { cmd: 'openclaw gateway start --port 3000', desc: '指定端口启动' },
    { cmd: 'openclaw gateway stop', desc: '停止 Gateway' },
    { cmd: 'openclaw gateway status', desc: '查看运行状态' }
  ],
  'channels': [
    { cmd: 'openclaw channels list', desc: '列出所有已配置的渠道' },
    { cmd: 'openclaw channels connect wechat', desc: '连接微信渠道' },
    { cmd: 'openclaw channels disconnect telegram', desc: '断开 Telegram' }
  ],
  'config': [
    { cmd: 'openclaw config get', desc: '查看当前配置' },
    { cmd: 'openclaw config edit', desc: '打开编辑器修改配置' }
  ],
  'doctor': [
    { cmd: 'openclaw doctor', desc: '运行诊断检查' },
    { cmd: 'openclaw doctor --fix', desc: '自动修复常见问题' }
  ]
};
```

---

## 七、特殊场景处理

### 7.1 Unicode/CJK 字符宽度计算

```typescript
/**
 * file: src/cli/terminal/unicode.ts
 * description: Unicode/Emoji 处理工具
 */

export function stringDisplayWidth(str: string): number {
  let width = 0;
  
  for (const char of str) {
    const codePoint = char.codePointAt(0)!;
    
    // CJK 统一汉字
    if ((codePoint >= 0x4E00 && codePoint <= 0x9FFF) ||
        (codePoint >= 0x3400 && codePoint <= 0x4DBF)) {
      width += 2;
    }
    // 日文假名/韩文
    else if ((codePoint >= 0x3040 && codePoint <= 0x30FF) ||
             (codePoint >= 0xAC00 && codePoint <= 0xD7AF)) {
      width += 2;
    }
    // CJK 标点
    else if ('，。！？：；""''《》【】（）'.includes(char)) {
      width += 2;
    }
    // Emoji
    else if (codePoint >= 0x1F000 && codePoint <= 0x1FFFF) {
      width += 2;
    }
    else {
      width += 1;
    }
  }
  
  return width;
}
```

### 7.2 终端自适应布局

```typescript
/**
 * file: src/cli/terminal/layout.ts
 * description: 终端布局适配
 */

export function getTerminalWidth(): number {
  return process.stdout.columns || 80;
}

export function printTable(headers: string[], rows: string[][]): void {
  const width = getTerminalWidth();
  const colCount = headers.length;
  const colWidth = Math.floor((width - colCount - 3) / colCount);
  
  // 表头
  let headerLine = '│';
  headers.forEach(h => {
    headerLine += ` ${truncate(h, colWidth).padEnd(colWidth)} │`;
  });
  
  console.log(headerLine);
  
  // 数据行
  rows.forEach(row => {
    let line = '│';
    row.forEach((cell) => {
      line += ` ${truncate(cell, colWidth).padEnd(colWidth)} │`;
    });
    console.log(line);
  });
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}
```

---

## 八、测试与验证

### 8.1 单元测试示例

```typescript
/**
 * file: src/cli/__tests__/localization.test.ts
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { t, getLocale, setLocale } from '../../i18n/core';

describe('CLI Localization', () => {
  
  beforeEach(() => {
    setLocale('zh-CN');
  });
  
  it('应返回正确的中文翻译', () => {
    expect(t('common.success')).toBe('✅ 操作成功');
    expect(t('gateway.starting', { port: 18789 })).toContain('18789');
  });

  it('应支持模板变量插值', () => {
    expect(t('error.portInUse', { port: 3000 })).toContain('3000');
  });

  it('缺少翻译时应返回 key', () => {
    expect(t('nonexistent.key')).toBe('nonexistent.key');
  });

  it('应正确计算 CJK 字符宽度', () => {
    const { stringDisplayWidth } = require('../terminal/unicode');
    expect(stringDisplayWidth('你好')).toBe(4);
    expect(stringDisplayWidth('Hello')).toBe(5);
  });
});
```

### 8.2 手动测试清单

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
- [ ] 包含Emoji的文本正确显示
- [ ] 中文长文本正确换行
```

---

## 九、发布与部署

### 9.1 版本兼容性

```json
// package.json
{
  "name": "openclaw",
  "version": "2026.4.11-cn",
  "description": "Personal AI assistant - 多渠道AI智能体网关 (中文优化版)",
  "keywords": ["ai", "assistant", "chinese", "i18n"]
}
```

### 9.2 发布说明模板

```markdown
## v2026.4.11 - 中文体验优化版

### ✨ 新特性
- 🇨🇳 **全面中文支持**
  - CLI 命令行界面 100% 中文化
  - Onboarding 新手引导全中文交互
  - 错误消息和提示全部中文化
  - 帮助系统和文档中文化

- 🎨 **UI 体验提升**
  - CJK 排版优化 (字体/间距/行高)
  - 中文友好的颜色对比度
  - 响应式布局适配

### 🐛 修复
- 修复中文环境下终端显示错位问题
- 修复 CJK 字符宽度计算不准确的问题

### 🔧 技术改进
- 引入轻量级 i18n 引擎 (零性能损耗)
- 新增 Unicode/CJK 字符处理工具
- 优化终端输出格式化

### 升级指南
\`\`\`bash
npm install -g openclaw@latest
\`\`\`
```

### 9.3 CI/CD 集成

```yaml
# .github/workflows/cli-localization.yml

name: CLI Localization Check

on:
  pull_request:
    paths:
      - 'src/cli/**'
      - 'src/i18n/**'

jobs:
  check-localization:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          
      - name: Install dependencies
        run: pnpm install
        
      - name: Run localization tests
        run: pnpm test -- --grep "Localization"
        
      - name: Test CLI help output
        run: |
          pnpm build
          ./dist/cli.js --help | grep -q "用法" || exit 1
          echo "✅ CLI help is in Chinese"
```

---

## 附录

### A. 快速参考卡片

```bash
# 常用命令速查

# Gateway 管理
openclaw gateway start              # 启动服务
openclaw gateway stop               # 停止服务
openclaw gateway restart            # 重启服务
openclaw gateway status             # 查看状态

# 渠道管理
openclaw channels list              # 列出渠道
openclaw channels connect wechat    # 连接微信
openclaw channels config feishu     # 配置飞书

# 配置管理
openclaw config get                 # 查看配置
openclaw config edit                # 编辑配置
openclaw doctor                     # 运行诊断

# 新手引导
openclaw onboard                    # 启动向导

# 帮助
openclaw --help                     # 全局帮助
openclaw gateway --help             # 子命令帮助
```

### B. 翻译质量检查点

| 检查项 | 标准 | 通过条件 |
|--------|------|----------|
| 覆盖率 | ≥95% | 所有用户可见文本都有翻译 |
| 一致性 | 术语统一 | 同一术语在所有位置翻译相同 |
| 自然度 | 母语级 | 读起来像原生中文，不是机翻痕迹 |
| 准确性 | 无歧义 | 技术含义准确传达 |
| 友好性 | 用户导向 | 错误提示给出解决方案 |
| 格式正确 | 符合规范 | 模板变量正确使用 |

### C. 版本历史

| 版本 | 日期 | 变更内容 | 作者 |
|------|------|----------|------|
| v1.0.0 | 2026-04-10 | 初始版本 - 完整指南 | YanYuCloudCube Team |

---

<div align="center">

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for Future***」
> 「***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***」

</div>
