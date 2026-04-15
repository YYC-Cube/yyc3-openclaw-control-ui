---
file: YYC3-中文UI组件库规范.md
description: OpenClaw中文体验优化 - UI组件库设计规范与实现指南
author: YanYuCloudCube Team <admin@0379.email>
version: v1.0.0
created: 2026-04-10
updated: 2026-04-10
status: production-ready
tags: [ui-design],[component-library],[Chinese-optimization],[design-system],[CJK]
category: design-specification
language: zh-CN
audience: designers,developers,ux-engineers
complexity: advanced
---

> ***YanYuCloudCube***
> *言启象限 | 语枢未来*
> ***Words Initiate Quadrants, Language Serves as Core for Future***
> *万象归元于云枢 | 深栈智启新纪元*
> ***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***

---

# 🎨 OpenClaw 中文 UI 组件库规范

**版本**: v1.0.0  
**制定日期**: 2026-04-10  
**适用平台**: Web (Control UI) / iOS / Android / macOS  
**设计原则**: 符合中文阅读习惯 · CJK排版最佳实践 · YYC³标准化  

---

## 📋 目录

- [一、设计系统概述](#一设计系统概述)
- [二、中文排版规范](#二中文排版规范)
- [三、色彩体系](#三色彩体系)
- [四、字体系统](#四字体系统)
- [五、间距与布局](#五间距与布局)
- [六、核心组件清单](#六核心组件清单)
- [七、组件实现示例](#七组件实现示例)
- [八、响应式适配](#八响应式适配)
- [九、无障碍访问(A11y)](#九无障碍访问a11y)
- [十、质量检查清单](#十质量检查清单)

---

## 一、设计系统概述

### 1.1 设计理念

```
┌─────────────────────────────────────────────────────────────┐
│              OpenClaw Design System                         │
│                    设计系统核心理念                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────┐    ┌─────────┐    ┌─────────┐               │
│   │  清晰    │    │  一致    │    │  高效    │               │
│   │ Clarity │    │Consistent│    │Efficient│               │
│   └────┬────┘    └────┬────┘    └────┬────┘               │
│        │              │              │                      │
│        ▼              ▼              ▼                      │
│   • 信息层级清晰   • 组件风格统一   • 操作路径最短           │
│   • 视觉焦点明确   • 交互模式一致   • 减少认知负荷           │
│   • 文字易读性强   • 跨端体验统一   • 支持键盘导航           │
│                                                             │
│   ════════════════════════════════════════════             │
│                  中文优先 (Chinese First)                   │
│   • CJK 字符优化排版                                        │
│   • 中文字体栈配置                                          │
│   • 中文语境的交互习惯                                       │
│   • 本地化内容展示                                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 适用场景

| 场景 | 说明 | 示例 |
|------|------|------|
| **Control UI** | 浏览器端管理界面 | Gateway配置、聊天界面、渠道管理 |
| **移动端App** | iOS/Android原生应用 | 设备控制面板、消息通知 |
| **CLI终端** | 命令行交互界面 | Onboarding向导、状态显示 |
| **Canvas画布** | AI交互工作区 | 可视化编辑器、工具调用卡片 |

---

## 二、中文排版规范

### 2.1 CJK 排版核心规则

#### 规则1: 行高适配中文

```css
/* ✅ 推荐: 中文友好的行高 */
:root[lang="zh-CN"] {
  --line-height-text: 1.75;      /* 正文行高 */
  --line-height-heading: 1.4;     /* 标题行高 */
  --line-height-tight: 1.25;      /* 紧凑行高(标签/按钮) */
}

/* ❌ 避免: 西文行高应用于中文 */
.text {
  line-height: 1.5; /* 对英文合适，对中文偏紧 */
}
```

**原理说明**:
- 中文字符是方块字，字间距和行高需要更大空间
- 推荐正文行高 `1.7-1.8`，标题 `1.3-1.5`
- 避免文字拥挤，保证可读性

#### 规则2: CJK-Latin 混排间距

```css
/* ✅ 自动处理中英混排间距 */
:root[lang="zh-CN"] {
  text-autospace: ideograph-alpha ideograph-numeric;
}

/* 手动微调 (当自动处理不够时) */
.chinese-latin-gap {
  margin-inline-start: 0.25em;
  margin-inline-end: 0.25em;
}

/* 使用示例 */
<p>OpenClaw<span class="chinese-latin-gap">网关</span>已启动</p>
```

**效果对比**:
```
❌ 未处理: OpenClaw网关已启动 (中英文粘连)
✅ 已处理: OpenClaw 网关已启动 (适当间距)
```

#### 规则3: 标点符号悬挂

```css
/* ✅ CJK标点符号优化 */
:root[lang="zh-CN"] {
  hanging-punctuation: first last allow-end;
  punctuation-trim: start allow-end;
}

/* 行首禁止出现的字符 */
p::first-line {
  text-indent: 2em; /* 中文段落首行缩进 */
}
```

**支持的标点悬挂**:
- `,` `。` `！` `？` `：` `；` `""` `''` `》` `）`
- 这些标点不会出现在行首，提升视觉美感

#### 规则4: 两端对齐

```css
/* ✅ 中文文本两端对齐 */
:root[lang="zh-CN"] .prose {
  text-align: justify;
  text-justify: inter-ideograph; /* CJK专用对齐算法 */
  text-align-last: justify;      /* 最后一行也对齐(可选) */
}
```

**适用场景**:
- 长文本内容 (帮助文档、说明文字)
- 表格单元格文本
- 列表项描述

### 2.2 字号体系

```css
:root[lang="zh-CN"] {
  /* 标题字号 (比西文略小，因中文字符视觉占比大) */
  --font-size-display: 2.5rem;    /* 40px - 大屏标题 */
  --font-size-h1: 2rem;           /* 32px - 一级标题 */
  --font-size-h2: 1.5rem;         /* 24px - 二级标题 */
  --font-size-h3: 1.25rem;        /* 20px - 三级标题 */
  --font-size-h4: 1.125rem;       /* 18px - 四级标题 */
  
  /* 正文字号 */
  --font-size-body-lg: 1.125rem;  /* 18px - 大号正文 */
  --font-size-body: 1rem;         /* 16px - 标准正文 (基准) */
  --font-size-body-sm: 0.875rem;  /* 14px - 小号正文 */
  
  /* 辅助文字 */
  --font-size-caption: 0.75rem;   /* 12px - 注释/标签 */
  --font-size-overline: 0.6875rem;/* 11px - 极小文字(谨慎使用) */
}
```

**使用指南**:

| 用途 | 变量 | 字号 | 行高 |
|------|------|------|------|
| 页面主标题 | `--font-size-h1` | 32px | 1.4 |
| 区块标题 | `--font-size-h2` | 24px | 1.45 |
| 卡片标题 | `--font-size-h3` | 20px | 1.5 |
| 正文内容 | `--font-size-body` | 16px | 1.75 |
| 辅助说明 | `--font-size-caption` | 12px | 1.6 |

### 2.3 字重选择

```css
:root[lang="zh-CN"] {
  /* 中文字重建议 */
  --font-weight-light: 300;       /* 细体 - 装饰性文字 */
  --font-weight-normal: 400;      /* 常规 - 正文(推荐) */
  --font-weight-medium: 500;      /* 中等 - 强调文字 */
  --font-weight-semibold: 600;    /* 半粗 - 小标题 */
  --font-weight-bold: 700;        /* 粗体 - 主标题 */
  
  /* ⚠️ 注意: 中文字重过粗会影响可读性 */
  /* 避免在正文中使用 >700 的字重 */
}
```

---

## 三、色彩体系

### 3.1 主色调 (Brand Colors)

```css
:root {
  /* 主色 - 科技蓝 (符合AI/科技产品调性) */
  --color-primary: #2563EB;          /* 主色 */
  --color-primary-hover: #1D4ED8;    /* 悬停态 */
  --color-primary-active: #1E40AF;   /* 激活态 */
  --color-primary-light: #DBEAFE;    /* 浅色背景 */
  --color-primary-dark: #1E3A8A;     /* 深色变体 */
  
  /* 强调色 - 活力橙 (用于CTA操作) */
  --color-accent: #F97316;           /* 强调色 */
  --color-accent-hover: #EA580C;     /* 悬停态 */
  --color-accent-light: #FFEDD5;     /* 浅色背景 */
}
```

### 3.2 语义色 (Semantic Colors)

```css
:root {
  /* 成功 - 绿色系 */
  --color-success: #059669;
  --color-success-bg: #ECFDF5;
  --color-success-border: #A7F3D0;
  
  /* 警告 - 琥珀色 */
  --color-warning: #D97706;
  --color-warning-bg: #FFFBEB;
  --color-warning-border: #FDE68A;
  
  /* 错误 - 红色系 */
  --color-error: #DC2626;
  --color-error-bg: #FEF2F2;
  --color-error-border: #FECACA;
  
  /* 信息 - 蓝灰色 */
  --color-info: #0891B2;
  --color-info-bg: #ECFEFF;
  --color-info-border: #A5F3FC;
}
```

### 3.3 中性色 (Neutral Colors)

```css
:root {
  /* 文本色阶 */
  --color-text-primary: #111827;     /* 主要文字 */
  --color-text-secondary: #4B5563;   /* 次要文字 */
  --color-text-tertiary: #9CA3AF;    /* 辅助文字 */
  --color-text-disabled: #D1D5DB;    /* 禁用文字 */
  
  /* 背景色阶 */
  --color-bg-primary: #FFFFFF;       /* 主背景 */
  --color-bg-secondary: #F9FAFB;     /* 次级背景 */
  --color-bg-tertiary: #F3F4F6;      /* 三级背景 */
  --color-bg-elevated: #FFFFFF;      /* 卡片/浮层背景 */
  
  /* 边框色阶 */
  --color-border-light: #E5E7EB;     /* 浅边框 */
  --color-border-default: #D1D5DB;   /* 默认边框 */
  --color-border-strong: #9CA3AF;    /* 强边框 */
}
```

### 3.4 暗色主题支持

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-text-primary: #F9FAFB;
    --color-text-secondary: #D1D5DB;
    --color-text-tertiary: #9CA3AF;
    
    --color-bg-primary: #111827;
    --color-bg-secondary: #1F2937;
    --color-bg-tertiary: #374151;
    
    --color-border-light: #374151;
    --color-border-default: #4B5563;
    --color-border-strong: #6B7280;
    
    /* 保持主色调亮度不变或略微提亮 */
    --color-primary: #60A5FA;
    --color-accent: #FB923C;
  }
}
```

---

## 四、字体系统

### 4.1 中文字体栈

```css
:root[lang="zh-CN"] {
  /* 无衬线字体栈 (用于UI界面) */
  --font-sans: 
    /* 系统默认优先 */
    -apple-system, 
    BlinkMacSystemFont,
    /* macOS/iOS 中文 */
    "PingFang SC",
    "PingFang HK",
    /* Windows 中文 */
    "Microsoft YaHei",
    /* Linux 中文 */
    "WenQuanYi Micro Hei",
    /* 回退 */
    "Noto Sans CJK SC",
    sans-serif;
  
  /* 衬线字体栈 (用于长文本/文章) */
  --font-serif:
    "Noto Serif CJK SC",
    "Songti SC",
    "SimSun",
    serif;
  
  /* 等宽字体栈 (用于代码/数据) */
  --font-mono:
    "SF Mono",
    "Menlo",
    "Consolas",
    "Liberation Mono",
    "Courier New",
    monospace;
  
  /* 数字字体栈 (用于数值显示) */
  --font-numbers:
    "SF Pro Display",
    -apple-system,
    "Helvetica Neue",
    Arial,
    sans-serif;
}
```

### 4.2 平台特定字体

| 平台 | 推荐字体 | 备选方案 |
|------|----------|----------|
| **macOS/iOS** | PingFang SC (苹方) | STHeiti, Hiragino Sans |
| **Windows** | Microsoft YaHei (微软雅黑) | SimHei (黑体) |
| **Android** | Noto Sans CJK SC | Roboto + Noto Sans fallback |
| **Linux** | WenQuanYi Micro Hei | Noto Sans CJK |

### 4.3 字体加载策略

```html
<!-- 预连接字体CDN (可选，用于Web Fonts) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Google Noto Sans SC (按需加载子集) -->
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;600;700&display=swap" 
      rel="stylesheet">

<style>
  /* 字体显示策略 */
  @font-face {
    font-family: 'Noto Sans SC';
    font-display: swap; /* 避免FOIT */
    unicode-range: U+4E00-9FFF, U+3400-4DBF; /* 仅CJK字符 */
  }
</style>
```

**性能建议**:
- 优先使用系统字体 (零网络请求)
- 如需Web Font，使用 `font-display: swap`
- 按 Unicode 范围子集化字体文件
- 预加载关键页面字体

---

## 五、间距与布局

### 5.1 间距系统 (Spacing Scale)

```css
:root {
  /* 基于 4px 网格系统 */
  --space-0: 0;          /* 0px */
  --space-1: 0.25rem;    /* 4px */
  --space-2: 0.5rem;     /* 8px */
  --space-3: 0.75rem;    /* 12px */
  --space-4: 1rem;       /* 16px */
  --space-5: 1.25rem;    /* 20px */
  --space-6: 1.5rem;     /* 24px */
  --space-8: 2rem;       /* 32px */
  --space-10: 2.5rem;    /* 40px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  --space-20: 5rem;      /* 80px */
  --space-24: 6rem;      /* 96px */
}
```

### 5.2 中文语境间距调整

```css
/* ✅ 中文内容增加内边距 */
:root[lang="zh-CN"] {
  --padding-card: var(--space-6);     /* 24px (比英文多25%) */
  --padding-modal: var(--space-8);    /* 32px */
  --padding-page: var(--space-10);    /* 40px */
}

/* 组件间距示例 */
.card {
  padding: var(--padding-card);
  line-height: var(--line-height-text);
}

.modal-content {
  padding: var(--padding-modal);
}
```

### 5.3 布局断点 (Breakpoints)

```css
:root {
  /* 响应式断点 */
  --breakpoint-xs: 320px;   /* 手机竖屏 */
  --breakpoint-sm: 640px;   /* 手机横屏/小平板 */
  --breakpoint-md: 768px;   /* 平板竖屏 */
  --breakpoint-lg: 1024px;  /* 平板横屏/笔记本 */
  --breakpoint-xl: 1280px;  /* 桌面显示器 */
  --breakpoint-2xl: 1536px; /* 大屏显示器 */
}
```

---

## 六、核心组件清单

### 6.1 基础组件 (Foundation Components)

#### 6.1.1 按钮 (Button)

```typescript
/**
 * file: components/Button.ts (Lit Component)
 * description: 按钮组件 · 支持多种变体和尺寸
 */

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

@customElement('oc-button')
export class Button extends LitElement {
  @property({ type: String }) variant: ButtonVariant = 'primary';
  @property({ type: String }) size: ButtonSize = 'md';
  @property({ type: Boolean }) loading = false;
  @property({ type: Boolean }) disabled = false;
  @property() label = '';

  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-sans);
      font-weight: 500;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
      user-select: none;
      gap: var(--space-2);
    }

    /* 尺寸变体 */
    :host([size="sm"]) {
      height: 32px;
      padding: 0 var(--space-3);
      font-size: var(--font-size-body-sm);
    }

    :host([size="md"]) {
      height: 40px;
      padding: 0 var(--space-4);
      font-size: var(--font-size-body);
    }

    :host([size="lg"]) {
      height: 48px;
      padding: 0 var(--space-6);
      font-size: var(--font-size-body-lg);
    }

    /* Primary 变体 */
    :host([variant="primary"]) {
      background: var(--color-primary);
      color: white;
      border: none;
    }

    :host([variant="primary"]:hover:not(:disabled)) {
      background: var(--color-primary-hover);
    }

    /* Secondary 变体 */
    :host([variant="secondary"]) {
      background: var(--color-bg-secondary);
      color: var(--color-text-primary);
      border: 1px solid var(--color-border-default);
    }

    :host([variant="secondary"]:hover:not(:disabled)) {
      background: var(--color-bg-tertiary);
    }

    /* Ghost 变体 */
    :host([variant="ghost"]) {
      background: transparent;
      color: var(--color-text-secondary);
      border: none;
    }

    :host([variant="ghost"]:hover:not(:disabled)) {
      background: var(--color-bg-secondary);
      color: var(--color-text-primary);
    }

    /* Danger 变体 */
    :host([variant="danger"]) {
      background: var(--color-error);
      color: white;
      border: none;
    }

    /* 状态样式 */
    :host([disabled]),
    :host([loading]) {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* 加载动画 */
    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid currentColor;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;

  render() {
    return html`
      <button 
        ?disabled=${this.disabled || this.loading}
        aria-label=${this.label}
        aria-busy=${this.loading}
      >
        ${this.loading ? html`<div class="spinner"></div>` : ''}
        <slot></slot>
      </button>
    `;
  }
}
```

**使用示例**:

```html
<!-- Primary 按钮 -->
<oc-button variant="primary" size="md">保存配置</oc-button>
<oc-button variant="primary" size="lg" loading>正在提交...</oc-button>

<!-- Secondary 按钮 -->
<oc-button variant="secondary">取消</oc-button>

<!-- Ghost 按钮 (用于链接式操作) -->
<oc-button variant="ghost">查看详情</oc-button>

<!-- Danger 按钮 -->
<oc-button variant="danger">删除渠道</oc-button>
```

#### 6.1.2 输入框 (Input)

```typescript
/**
 * file: components/Input.ts
 * description: 文本输入框 · 支持中文输入优化
 */

@customElement('oc-input')
export class Input extends LitElement {
  @property() placeholder = '';
  @property() value = '';
  @property() label = '';
  @property() error = '';
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) multiline = false;

  static styles = css`
    :host {
      display: block;
      font-family: var(--font-sans);
    }

    .input-wrapper {
      position: relative;
    }

    label {
      display: block;
      margin-bottom: var(--space-2);
      font-size: var(--font-size-body-sm);
      font-weight: 500;
      color: var(--color-text-primary);
    }

    input, textarea {
      width: 100%;
      padding: var(--space-3) var(--space-4);
      font-size: var(--font-size-body);
      font-family: inherit;
      color: var(--color-text-primary);
      background: var(--color-bg-primary);
      border: 1px solid var(--color-border-default);
      border-radius: 6px;
      transition: all 0.2s ease;
      
      /* 中文输入优化 */
      line-height: var(--line-height-text);
      letter-spacing: 0.02em;
    }

    input:focus,
    textarea:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px var(--color-primary-light);
    }

    input::placeholder,
    textarea::placeholder {
      color: var(--color-text-tertiary);
    }

    /* 错误状态 */
    .error {
      border-color: var(--color-error);
    }

    .error:focus {
      box-shadow: 0 0 0 3px var(--color-error-bg);
    }

    .error-message {
      margin-top: var(--space-1);
      font-size: var(--font-size-caption);
      color: var(--color-error);
    }

    /* 禁用状态 */
    :host([disabled]) input,
    :host([disabled]) textarea {
      background: var(--color-bg-secondary);
      cursor: not-allowed;
      opacity: 0.6;
    }
  `;

  render() {
    return html`
      <div class="input-wrapper">
        ${this.label ? html`<label>${this.label}</label>` : ''}
        
        ${this.multiline 
          ? html`<textarea 
              class="${this.error ? 'error' : ''}"
              .value=${this.value}
              placeholder=${this.placeholder}
              ?disabled=${this.disabled}
              ?required=${this.required}
              rows="4"
            ></textarea>`
          : html`<input 
              type="text"
              class="${this.error ? 'error' : ''}"
              .value=${this.value}
              placeholder=${this.placeholder}
              ?disabled=${this.disabled}
              ?required=${this.required}
            />`
        }
        
        ${this.error ? html`<div class="error-message">${this.error}</div>` : ''}
      </div>
    `;
  }
}
```

#### 6.1.3 选择器 (Select)

```typescript
/**
 * file: components/Select.ts
 * description: 下拉选择器 · 支持搜索和分组
 */

@customElement('oc-select')
export class Select extends LitElement {
  @property() label = '';
  @property() value = '';
  @property({ type: Array }) options: Array<{label: string, value: string}> = [];
  @property() placeholder = '请选择';
  @property({ type: Boolean }) searchable = false;
  @property({ type: Boolean }) disabled = false;

  // ... 实现细节省略
}
```

### 6.2 复合组件 (Composite Components)

#### 6.2.1 卡片 (Card)

```typescript
/**
 * file: components/Card.ts
 * description: 内容卡片容器 · 支持多种布局模式
 */

@customElement('oc-card')
export class Card extends LitElement {
  @property() title = '';
  @property() subtitle = '';
  @property({ type: Boolean }) bordered = true;
  @property({ type: Boolean }) hoverable = false;
  @property({ type: Boolean }) collapsible = false;

  static styles = css`
    :host {
      display: block;
      background: var(--color-bg-elevated);
      border-radius: 12px;
      transition: all 0.3s ease;
    }

    :host([bordered]) {
      border: 1px solid var(--color-border-light);
    }

    :host([hoverable]:hover) {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }

    .card-header {
      padding: var(--space-4) var(--space-6);
      border-bottom: 1px solid var(--color-border-light);
    }

    .card-title {
      font-size: var(--font-size-h4);
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0;
    }

    .card-subtitle {
      font-size: var(--font-size-body-sm);
      color: var(--color-text-secondary);
      margin-top: var(--space-1);
    }

    .card-body {
      padding: var(--space-6);
    }

    .card-footer {
      padding: var(--space-4) var(--space-6);
      border-top: 1px solid var(--color-border-light);
      background: var(--color-bg-secondary);
      border-radius: 0 0 12px 12px;
    }
  `;

  render() {
    return html`
      <article>
        ${(this.title || this.subtitle) ? html`
          <header class="card-header">
            <h3 class="card-title">${this.title}</h3>
            ${this.subtitle ? html`<p class="card-subtitle">${this.subtitle}</p>` : ''}
          </header>
        ` : ''}
        
        <div class="card-body">
          <slot></slot>
        </div>
        
        <footer class="card-footer">
          <slot name="footer"></slot>
        </footer>
      </article>
    `;
  }
}
```

**使用示例**:

```html
<!-- 渠道状态卡片 -->
<oc-card hoverable>
  <span slot="header-title">微信渠道</span>
  <span slot="header-subtitle">最后更新: 2分钟前</span>
  
  <div class="channel-status">
    <div class="status-indicator success"></div>
    <span>运行正常</span>
  </div>
  
  <div slot="footer">
    <oc-button variant="ghost" size="sm">查看日志</oc-button>
    <oc-button variant="ghost" size="sm">重新连接</oc-button>
  </div>
</oc-card>
```

#### 6.2.2 对话气泡 (Chat Bubble)

```typescript
/**
 * file: components/ChatBubble.ts
 * description: 聊天气泡组件 · 专为中文对话优化
 */

@customElement('oc-chat-bubble')
export class ChatBubble extends LitElement {
  @property({ type: String }) role: 'user' | 'assistant' = 'assistant';
  @property({ type: String }) content = '';
  @property({ type: Number }) timestamp = Date.now();
  @property({ type: Boolean }) isLoading = false;

  static styles = css`
    :host {
      display: flex;
      margin-bottom: var(--space-4);
      max-width: 85%;
    }

    /* 助手消息 - 左对齐 */
    :host([role="assistant"]) {
      align-self: flex-start;
    }

    /* 用户消息 - 右对齐 */
    :host([role="user"]) {
      align-self: flex-end;
      flex-direction: row-reverse;
    }

    .bubble {
      padding: var(--space-4);
      border-radius: 16px;
      font-size: var(--font-size-body);
      line-height: var(--line-height-text); /* 中文友好行高 */
      word-break: break-word;
      
      /* 中文混排优化 */
      text-autospace: ideograph-alpha;
    }

    :host([role="assistant"]) .bubble {
      background: var(--color-bg-secondary);
      color: var(--color-text-primary);
      border-bottom-left-radius: 4px;
    }

    :host([role="user"]) .bubble {
      background: var(--color-primary);
      color: white;
      border-bottom-right-radius: 4px;
    }

    .timestamp {
      font-size: var(--font-size-caption);
      color: var(--color-text-tertiary);
      margin-top: var(--space-1);
    }

    /* 加载动画 */
    .typing-indicator {
      display: flex;
      gap: 4px;
      padding: var(--space-3) var(--space-4);
    }

    .dot {
      width: 8px;
      height: 8px;
      background: var(--color-text-tertiary);
      border-radius: 50%;
      animation: bounce 1.4s infinite ease-in-out both;
    }

    .dot:nth-child(1) { animation-delay: -0.32s; }
    .dot:nth-child(2) { animation-delay: -0.16s; }

    @keyframes bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }
  `;

  render() {
    if (this.isLoading) {
      return html`
        <div class="bubble typing-indicator">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      `;
    }

    return html`
      <div class="bubble">
        <slot>${this.content}</slot>
      </div>
      <div class="timestamp">
        ${new Date(this.timestamp).toLocaleTimeString('zh-CN', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
      </div>
    `;
  }
}
```

#### 6.2.3 状态指示器 (Status Badge)

```typescript
/**
 * file: components/StatusBadge.ts
 * description: 状态徽章 · 用于显示渠道/服务状态
 */

type StatusType = 'success' | 'warning' | 'error' | 'info' | 'neutral';

@customElement('oc-status-badge')
export class StatusBadge extends LitElement {
  @property({ type: String }) status: StatusType = 'neutral';
  @property() label = '';
  @property({ type: Boolean }) dot = true;

  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-1) var(--space-3);
      border-radius: 9999px;
      font-size: var(--font-size-caption);
      font-weight: 500;
    }

    .indicator-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    /* 成功状态 - 绿色 */
    :host([status="success"]) {
      background: var(--color-success-bg);
      color: var(--color-success);
    }
    :host([status="success"]) .indicator-dot {
      background: var(--color-success);
      box-shadow: 0 0 0 2px var(--color-success-bg);
    }

    /* 警告状态 - 琥珀色 */
    :host([status="warning"]) {
      background: var(--color-warning-bg);
      color: var(--color-warning);
    }
    :host([status="warning"]) .indicator-dot {
      background: var(--color-warning);
      box-shadow: 0 0 0 2px var(--color-warning-bg);
    }

    /* 错误状态 - 红色 */
    :host([status="error"]) {
      background: var(--color-error-bg);
      color: var(--color-error);
    }
    :host([status="error"]) .indicator-dot {
      background: var(--color-error);
      box-shadow: 0 0 0 2px var(--color-error-bg);
    }

    /* 信息状态 - 蓝色 */
    :host([status="info"]) {
      background: var(--color-info-bg);
      color: var(--color-info);
    }
    :host([status="info"]) .indicator-dot {
      background: var(--color-info);
      box-shadow: 0 0 0 2px var(--color-info-bg);
    }

    /* 中性状态 - 灰色 */
    :host([status="neutral"]) {
      background: var(--color-bg-tertiary);
      color: var(--color-text-secondary);
    }
    :host([status="neutral"]) .indicator-dot {
      background: var(--color-text-tertiary);
    }
  `;

  render() {
    return html`
      ${this.dot ? html`<div class="indicator-dot"></div>` : ''}
      <span class="label">${this.label}</span>
    `;
  }
}
```

**使用示例**:

```html
<!-- 渠道状态 -->
<oc-status-badge status="success" label="已连接"></oc-status-badge>
<oc-status-badge status="error" label="连接失败"></oc-status-badge>
<oc-status-badge status="warning" label="延迟较高"></oc-status-badge>

<!-- 服务状态 -->
<oc-status-badge status="info" label="同步中..." :dot="false"></oc-status-badge>
```

### 6.3 反馈组件 (Feedback Components)

#### 6.3.1 Toast 通知

```typescript
/**
 * file: components/Toast.ts
 * description: 轻量级消息提示 · 自动消失
 */

type ToastType = 'success' | 'error' | 'warning' | 'info';

@customElement('oc-toast')
export class Toast extends LitElement {
  @property({ type: String }) type: ToastType = 'info';
  @property() message = '';
  @property({ type: Number }) duration = 3000;
  @property({ type: Boolean }) visible = false;

  private timer?: number;

  connectedCallback() {
    super.connectedCallback();
    if (this.visible && this.duration > 0) {
      this.startTimer();
    }
  }

  private startTimer() {
    this.timer = window.setTimeout(() => {
      this.visible = false;
      this.dispatchEvent(new CustomEvent('close'));
    }, this.duration);
  }

  disconnectedCallback() {
    if (this.timer) clearTimeout(this.timer);
    super.disconnectedCallback();
  }

  static styles = css`
    :host {
      display: none;
      position: fixed;
      top: var(--space-6);
      right: var(--space-6);
      z-index: 9999;
      min-width: 320px;
      max-width: 480px;
      padding: var(--space-4);
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      animation: slideIn 0.3s ease-out;
    }

    :host([visible]) {
      display: block;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .toast-content {
      display: flex;
      align-items: flex-start;
      gap: var(--space-3);
    }

    .toast-icon {
      flex-shrink: 0;
      width: 20px;
      height: 20px;
    }

    .toast-message {
      flex: 1;
      font-size: var(--font-size-body);
      line-height: var(--line-height-text);
    }

    .toast-close {
      flex-shrink: 0;
      background: none;
      border: none;
      cursor: pointer;
      padding: var(--space-1);
      color: inherit;
      opacity: 0.6;
    }

    .toast-close:hover {
      opacity: 1;
    }

    /* 类型样式 */
    :host([type="success"]) {
      background: var(--color-success-bg);
      border-left: 4px solid var(--color-success);
      color: var(--color-success);
    }

    :host([type="error"]) {
      background: var(--color-error-bg);
      border-left: 4px solid var(--color-error);
      color: var(--color-error);
    }

    :host([type="warning"]) {
      background: var(--color-warning-bg);
      border-left: 4px solid var(--color-warning);
      color: var(--color-warning);
    }

    :host([type="info"]) {
      background: var(--color-info-bg);
      border-left: 4px solid var(--color-info);
      color: var(--color-info);
    }
  `;

  render() {
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };

    return html`
      <div class="toast-content">
        <span class="toast-icon">${icons[this.type]}</span>
        <span class="toast-message">${this.message}</span>
        <button class="toast-close" @click=${() => this.visible = false}>
          ✕
        </button>
      </div>
    `;
  }
}
```

### 6.4 导航组件 (Navigation Components)

#### 6.4.1 侧边栏 (Sidebar)

```typescript
/**
 * file: components/Sidebar.ts
 * description: 导航侧边栏 · 支持折叠和图标模式
 */

@customElement('oc-sidebar')
export class Sidebar extends LitElement {
  @property({ type: Boolean }) collapsed = false;
  @property({ type: String }) activeItem = '';

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      width: 260px;
      height: 100vh;
      background: var(--color-bg-primary);
      border-right: 1px solid var(--color-border-light);
      transition: width 0.3s ease;
      overflow: hidden;
    }

    :host([collapsed]) {
      width: 72px;
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      padding: var(--space-4) var(--space-6);
      height: 64px;
      border-bottom: 1px solid var(--color-border-light);
    }

    .sidebar-logo {
      font-size: var(--font-size-h4);
      font-weight: 700;
      color: var(--color-primary);
    }

    .sidebar-nav {
      flex: 1;
      padding: var(--space-4) 0;
      overflow-y: auto;
    }

    .nav-item {
      display: flex;
      align-items: center;
      padding: var(--space-3) var(--space-6);
      margin: 0 var(--space-3);
      border-radius: 8px;
      color: var(--color-text-secondary);
      text-decoration: none;
      font-size: var(--font-size-body);
      transition: all 0.2s ease;
      gap: var(--space-3);
      white-space: nowrap;
    }

    .nav-item:hover {
      background: var(--color-bg-secondary);
      color: var(--color-text-primary);
    }

    .nav-item.active {
      background: var(--color-primary-light);
      color: var(--color-primary);
      font-weight: 500;
    }

    .nav-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .nav-label {
      opacity: 1;
      transition: opacity 0.2s ease;
    }

    :host([collapsed]) .nav-label {
      opacity: 0;
      width: 0;
      overflow: hidden;
    }

    :host([collapsed]) .nav-item {
      justify-content: center;
      padding: var(--space-3);
    }
  `;

  private navItems = [
    { id: 'chat', icon: '💬', label: '对话' },
    { id: 'channels', icon: '📡', label: '渠道' },
    { id: 'sessions', icon: '📋', label: '会话' },
    { id: 'config', icon: '⚙️', label: '配置' },
    { id: 'nodes', icon: '📱', label: '节点' },
    { id: 'cron', icon: '⏰', label: '定时任务' },
    { id: 'skills', icon: '🎯', label: '技能' },
    { id: 'logs', icon: '📝', label: '日志' },
  ];

  render() {
    return html`
      <header class="sidebar-header">
        <div class="sidebar-logo">🦞</div>
        ${!this.collapsed ? html`<span class="sidebar-logo">OpenClaw</span>` : ''}
      </header>
      
      <nav class="sidebar-nav">
        ${this.navItems.map(item => html`
          <a 
            href="#${item.id}" 
            class="nav-item ${this.activeItem === item.id ? 'active' : ''}"
            @click=${(e: Event) => {
              e.preventDefault();
              this.dispatchEvent(new CustomEvent('navigate', { detail: item.id }));
            }}
          >
            <span class="nav-icon">${item.icon}</span>
            <span class="nav-label">${item.label}</span>
          </a>
        `)}
      </nav>
    `;
  }
}
```

---

## 七、组件实现示例

### 7.1 完整页面示例: 配置页面

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gateway 配置 - OpenClaw</title>
  <style>
    /* 引入设计系统变量 */
    @import './styles/design-system.css';
    
    body {
      font-family: var(--font-sans);
      background: var(--color-bg-secondary);
      color: var(--color-text-primary);
      margin: 0;
      line-height: var(--line-height-text);
    }
  </style>
</head>
<body>
  <!-- 页面容器 -->
  <div class="page-container">
    <!-- 侧边栏 -->
    <oc-sidebar active-item="config"></oc-sidebar>
    
    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 页面头部 -->
      <header class="page-header">
        <h1>Gateway 配置</h1>
        <p class="subtitle">管理你的 Gateway 网关设置和参数</p>
      </header>
      
      <!-- 配置表单 -->
      <form class="config-form">
        <!-- 基本设置卡片 -->
        <oc-card title="基本设置" subtitle="网关基础配置">
          <div class="form-grid">
            <oc-input 
              label="监听端口"
              placeholder="请输入端口号 (1-65535)"
              value="18789"
              type="number"
            ></oc-input>
            
            <oc-select 
              label="绑定地址"
              placeholder="选择绑定模式"
              .options=${[
                { label: '本地回环 (loopback)', value: 'loopback' },
                { label: '所有接口 (0.0.0.0)', value: 'all' },
                { label: 'Tailscale 网络', value: 'tailnet' }
              ]}
            ></oc-select>
            
            <oc-input 
              label="认证令牌"
              placeholder="留空将自动生成"
              type="password"
            ></oc-input>
          </div>
          
          <div slot="footer" style="display: flex; justify-content: flex-end; gap: 12px;">
            <oc-button variant="secondary">重置</oc-button>
            <oc-button variant="primary" type="submit">保存并重启</oc-button>
          </div>
        </oc-card>
        
        <!-- 渠道配置卡片 -->
        <oc-card title="消息渠道" subtitle="配置外部通信渠道">
          <div class="channels-list">
            <!-- 微信渠道 -->
            <div class="channel-item">
              <div class="channel-info">
                <strong>微信 (WeChat)</strong>
                <oc-status-badge status="success" label="已启用"></oc-status-badge>
              </div>
              <oc-button variant="ghost" size="sm">配置</oc-button>
            </div>
            
            <!-- 飞书渠道 -->
            <div class="channel-item">
              <div class="channel-info">
                <strong>飞书 (Feishu)</strong>
                <oc-status-badge status="neutral" label="未配置"></oc-status-badge>
              </div>
              <oc-button variant="ghost" size="sm">配置</oc-button>
            </div>
          </div>
        </oc-card>
      </form>
    </main>
  </div>
  
  <!-- 全局Toast容器 -->
  <oc-toast-container></oc-toast-container>
  
  <script type="module" src="./components/index.js"></script>
</body>
</html>
```

### 7.2 CSS Design Token 文件

```css
/**
 * file: styles/design-system.css
 * description: OpenClaw 设计系统 - CSS变量定义
 * version: v1.0.0
 */

:root {
  /* ========================================
   * 1. 字体系统
   * ======================================== */
  --font-sans: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif;
  --font-serif: "Noto Serif CJK SC", "Songti SC", serif;
  --font-mono: "SF Mono", "Menlo", Consolas, monospace;
  
  /* 字号 */
  --font-size-xs: 0.75rem;     /* 12px */
  --font-size-sm: 0.875rem;    /* 14px */
  --font-size-base: 1rem;      /* 16px */
  --font-size-lg: 1.125rem;    /* 18px */
  --font-size-xl: 1.25rem;     /* 20px */
  --font-size-2xl: 1.5rem;     /* 24px */
  --font-size-3xl: 2rem;       /* 32px */
  
  /* 字重 */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  /* 行高 (中文优化) */
  --line-height-tight: 1.25;
  --line-height-base: 1.6;
  --line-height-relaxed: 1.75;
  --line-height-loose: 2;
  
  /* ========================================
   * 2. 色彩系统
   * ======================================== */
  
  /* 主色 */
  --color-primary-50: #EFF6FF;
  --color-primary-100: #DBEAFE;
  --color-primary-200: #BFDBFE;
  --color-primary-500: #3B82F6;
  --color-primary-600: #2563EB;
  --color-primary-700: #1D4ED8;
  --color-primary-900: #1E3A8A;
  
  /* 中性色 */
  --color-gray-50: #F9FAFB;
  --color-gray-100: #F3F4F6;
  --color-gray-200: #E5E7EB;
  --color-gray-300: #D1D5DB;
  --color-gray-400: #9CA3AF;
  --color-gray-500: #6B7280;
  --color-gray-600: #4B5563;
  --color-gray-700: #374151;
  --color-gray-800: #1F2937;
  --color-gray-900: #111827;
  
  /* 语义色 */
  --color-success: #059669;
  --color-success-bg: #ECFDF5;
  --color-warning: #D97706;
  --color-warning-bg: #FFFBEB;
  --color-error: #DC2626;
  --color-error-bg: #FEF2F2;
  --color-info: #0891B2;
  --color-info-bg: #ECFEFF;
  
  /* ========================================
   * 3. 间距系统
   * ======================================== */
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  
  /* ========================================
   * 4. 圆角系统
   * ======================================== */
  --radius-none: 0;
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 9999px;
  
  /* ========================================
   * 5. 阴影系统
   * ======================================== */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  
  /* ========================================
   * 6. 过渡动画
   * ======================================== */
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;
  
  /* ========================================
   * 7. Z-index 层级
   * ======================================== */
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-fixed: 300;
  --z-modal-backdrop: 400;
  --z-modal: 500;
  --z-popover: 600;
  --z-tooltip: 700;
  --z-toast: 9999;
}

/* ========================================
 * 中文语言特定覆盖
 * ======================================== */
:root[lang="zh-CN"],
:root[lang="zh-TW"],
:root[lang="ja"] {
  /* 增加行高以适应CJK字符 */
  --line-height-base: 1.75;
  --line-height-relaxed: 1.85;
  
  /* CJK 字符间距 */
  --letter-spacing-tight: -0.01em;
  --letter-spacing-normal: 0.02em;
  --letter-spacing-wide: 0.05em;
  
  /* 自动处理中西文混排间距 */
  text-autospace: ideograph-alpha ideograph-numeric idiosyncratic;
}
```

---

## 八、响应式适配

### 8.1 断点策略

```css
/* 移动端优先 (Mobile First) */

/* xs: 0 - 639px (手机) */
.component {
  /* 默认移动端样式 */
  padding: var(--space-4);
  font-size: var(--font-size-base);
}

/* sm: 640px+ (大手机/小平板) */
@media (min-width: 640px) {
  .component {
    padding: var(--space-6);
  }
}

/* md: 768px+ (平板) */
@media (min-width: 768px) {
  .component {
    padding: var(--space-8);
  }
}

/* lg: 1024px+ (桌面) */
@media (min-width: 1024px) {
  .component {
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

### 8.2 中文内容响应式考虑

```css
/* 中文文本通常比同字数的英文短 */
/* 但每个字符占用更多水平空间 */

.title {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  /* 使用 clamp() 实现流式字号 */
}

/* 长文本换行 */
.long-text-chinese {
  word-break: break-all; /* 允许在任何字符处换行 */
  overflow-wrap: break-word;
}

/* 避免单个字符孤立在行首/行尾 */
p {
  orphans: 2;  /* 段落末尾至少保留2个字符 */
  widows: 2;   /* 新段落开头至少保留2个字符 */
}
```

---

## 九、无障碍访问 (A11y)

### 9.1 键盘导航

```typescript
// 所有交互组件必须支持键盘操作
@customElement('oc-accessible-component')
class AccessibleComponent extends LitElement {
  // Tab 键聚焦
  // Enter/Space 激活
  // Escape 关闭
  // 方向键导航 (如适用)
  
  handleKeydown(e: KeyboardEvent) {
    switch (e.key) {
      case 'Enter':
      case ' ':
        this.activate();
        break;
      case 'Escape':
        this.close();
        break;
    }
  }
}
```

### 9.2 屏幕阅读器支持

```html
<!-- 为图标按钮添加无障碍标签 -->
<oc-button 
  aria-label="保存配置" 
  title="保存配置"
>
  💾
</oc-button>

<!-- 状态变化需通过 ARIA 实时区域通知 -->
<div role="status" aria-live="polite" aria-atomic="true">
  <oc-toast message="配置已保存成功"></oc-toast>
</div>

<!-- 表单错误关联 -->
<oc-input
  id="port-input"
  aria-describedby="port-error"
  aria-invalid="true"
  error="端口号必须在 1-65535 之间"
></oc-input>
<div id="port-error" role="alert"></div>
```

### 9.3 颜色对比度要求

```css
/* WCAG 2.1 AA 标准 */
/* 正文文字: 至少 4.5:1 对比度 */
/* 大文字(18px+): 至少 3:1 对比度 */

/* ✅ 合格示例 */
.success-text {
  color: var(--color-success); /* #059669 on white = 4.56:1 ✓ */
}

/* ❌ 不合格示例 */
.faint-text {
  color: #CCCCCC; /* on white = 1.61:1 ✗ */
}
```

---

## 十、质量检查清单

### 10.1 设计审查 Checklist

- [ ] **排版检查**
  - [ ] 行高是否适合中文 (≥1.6)
  - [ ] 中英文混排是否有适当间距
  - [ ] 标点符号是否正确悬挂
  - [ ] 段落首行是否缩进 (如需要)

- [ ] **色彩检查**
  - [ ] 主色调是否符合品牌规范
  - [ ] 语义色使用是否正确
  - [ ] 是否满足WCAG对比度标准
  - [ ] 暗色模式是否完整支持

- [ ] **字体检查**
  - [ ] 是否使用了正确的中文字体栈
  - [ ] 字号是否适合中文阅读
  - [ ] 字重是否影响可读性
  - [ ] 数字是否使用等宽字体

- [ ] **间距检查**
  - [ ] 内边距是否足够 (中文内容)
  - [ ] 元素间距是否符合网格系统
  - [ ] 响应式断点是否合理

- [ ] **交互检查**
  - [ ] 所有交互元素是否有明确的hover/focus状态
  - [ ] 加载状态是否有反馈
  - [ ] 错误状态是否清晰
  - [ ] 禁用状态是否明确

- [ ] **无障碍检查**
  - [ ] 所有图片是否有alt文本
  - [ ] 表单元素是否有label关联
  - [ ] 颜色是否不是唯一的信息传达方式
  - [ ] 键盘导航是否完整可用

### 10.2 性能检查

```bash
# 字体性能检查
- [ ] 系统字体优先 (无需下载)
- [ ] Web Font使用 font-display: swap
- [ ] 字体文件大小 < 50KB (子集化后)
- [ ] 关键CSS内联 (< 14KB)

# 渲染性能
- [ ] 动画使用 GPU 加速属性 (transform, opacity)
- [ ] 避免同步布局抖动
- [ ] 图片使用懒加载
- [ ] 组件按需加载
```

---

## 附录

### A. 组件索引

| 组件名 | 类型 | 描述 | 状态 |
|--------|------|------|------|
| Button | 基础 | 按钮 | ✅ 完成 |
| Input | 基础 | 输入框 | ✅ 完成 |
| Select | 基础 | 下拉选择 | ✅ 完成 |
| Card | 复合 | 内容卡片 | ✅ 完成 |
| ChatBubble | 复合 | 聊天气泡 | ✅ 完成 |
| StatusBadge | 反馈 | 状态徽章 | ✅ 完成 |
| Toast | 反馈 | 消息提示 | ✅ 完成 |
| Sidebar | 导航 | 侧边栏 | ✅ 完成 |
| Modal | 反馈 | 弹窗 | 🔄 开发中 |
| Table | 数据 | 表格 | 🔄 开发中 |
| Tabs | 导航 | 标签页 | 🔄 开发中 |
| Dropdown | 交互 | 下拉菜单 | 🔄 开发中 |

### B. 设计资源

- **Figma Design File**: [OpenClaw UI Kit](link)
- **Icon Library**: [Lucide Icons](https://lucide.dev/)
- **Color Palette Generator**: [Coolors](https://coolors.co/palette-generator)
- **Typography Scale**: [Type Scale Calculator](https://type-scale.com/)

### C. 版本历史

| 版本 | 日期 | 变更内容 | 作者 |
|------|------|----------|------|
| v1.0.0 | 2026-04-10 | 初始版本 - 完整设计系统 | YanYuCloudCube Team |

---

<div align="center">

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for Future***」
> 「***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***」

</div>
