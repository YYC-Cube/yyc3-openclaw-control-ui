# OpenClaw 国际化（i18n）社区贡献指南

> **版本**: 1.0.0  
> **最后更新**: 2026-04-10  
> **适用范围**: OpenClaw v1.0+  

---

## 📋 目录

1. [项目概述](#项目概述)
2. [i18n 架构说明](#i18n-架构说明)
3. [添加新语言步骤](#添加新语言步骤)
4. [翻译规范与最佳实践](#翻译规范与最佳实践)
5. [术语一致性要求](#术语一致性要求)
6. [测试验证流程](#测试验证流程)
7. [提交 PR 规范](#提交-pr-规范)
8. [常见问题解答](#常见问题解答)

---

## 项目概述

OpenClaw 致力于为全球用户提供一致且优质的用户体验。我们的国际化（i18n）系统采用模块化设计，支持轻松扩展新语言。本指南将帮助您为 OpenClaw 添加新的语言支持。

### 🎯 目标

- 降低新语言集成的门槛
- 确保翻译质量和术语一致性
- 提供清晰的贡献流程
- 建立可持续的社区翻译生态

### 🌍 当前支持语言

| 语言 | 代码 | 覆盖率 | 状态 |
|------|------|--------|------|
| English | `en` | 100% | ✅ 完整 |
| 简体中文 | `zh-CN` | 100% | ✅ 完整 |
| 繁体中文 | `zh-TW` | 计划中 | 🔄 进行中 |
| 日本語 | `ja` | 计划中 | ⏳ 待开始 |
| 한국어 | `ko` | 计划中 | ⏳ 待开始 |
| Français | `fr` | 计划中 | ⏳ 待开始 |

---

## i18n 架构说明

### 技术栈

```
OpenClaw UI (Lit + TypeScript)
└── src/i18n/
    ├── index.ts                 # 导出入口
    ├── lib/
    │   ├── types.ts            # 类型定义
    │   ├── translate.ts        # 翻译函数
    │   └── lit-controller.ts   # Lit 集成控制器
    └── locales/
        ├── en.ts               # 英语（参考）
        └── zh-CN.ts            # 简体中文
```

### 核心组件

#### 1. 类型定义 ([types.ts](../../ui/src/i18n/lib/types.ts))

```typescript
export interface TranslationMap {
  common: Record<string, string>;
  nav: Record<string, string>;
  tabs: Record<string, string>;
  subtitles: Record<string, string>;
  status: Record<string, string>;
  actions: Record<string, string>;
  messages: Record<string, string>;
  errors: Record<string, string>;
  placeholders: Record<string, string>;
  config: Record<string, string>;
  channels: Record<string, string>;
  agents: Record<string, string>;
  sessions: Record<string, string>;
  usage: Record<string, string>;
  cron: Record<string, string>;
  skills: Record<string, string>;
  nodes: Record<string, string>;
  chat: Record<string, string>;
  debug: Record<string, string>;
  logs: Record<string, string>;
}
```

#### 2. 翻译函数 ([translate.ts](../../ui/src/i18n/lib/translate.ts))

```typescript
export function t(key: string, params?: Record<string, unknown>): string {
  // 自动插值支持：{{variable}}
  // 示例: t('common.welcome', { name: '用户' }) => "欢迎，用户"
}
```

#### 3. Lit 集成 ([lit-controller.ts](../../ui/src/i18n/lib/lit-controller.ts))

```typescript
@customElement('i18n-controller')
export class I18nController extends LitElement {
  // 自动检测语言变化并更新UI
  // 支持动态切换语言
}
```

---

## 添加新语言步骤

### 📝 步骤概览

```
准备环境 → 创建翻译文件 → 执行翻译 → 配置注册 → 测试验证 → 提交PR
```

### 🔧 步骤 1: 准备开发环境

```bash
# 克隆仓库
git clone https://github.com/your-org/openclaw.git
cd openclaw

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

**前置条件**:
- Node.js >= 18.x
- npm >= 9.x
- Git
- 代码编辑器（推荐 VS Code）

### 📄 步骤 2: 创建翻译文件

在 `ui/src/i18n/locales/` 目录下创建新文件：

**文件命名规则**: `{locale-code}.ts`

示例：
- 日语: `ja.ts`
- 韩语: `ko.ts`
- 法语: `fr.ts`
- 德语: `de.ts`

**模板文件**:

```typescript
// ui/src/i18n/locales/ja.ts
import type { TranslationMap } from "../lib/types.ts";

export const ja: TranslationMap = {
  // =============================================
  // COMMON - 通用词汇
  // =============================================
  common: {
    health: "ヘルス",  // 健康/状态
    ok: "正常",
    online: "オンライン",
    offline: "オフライン",
    connect: "接続",
    refresh: "更新",
    enabled: "有効",
    disabled: "無効",
    na: "該当なし",
    version: "バージョン",
    docs: "ドキュメント",
    theme: "テーマ",
    resources: "リソース",
    search: "検索",
    loading: "読み込み中...",
    save: "保存",
    cancel: "キャンセル",
    delete: "削除",
    edit: "編集",
    add: "追加",
    close: "閉じる",
    back: "戻る",
    next: "次へ",
    previous: "前へ",
    confirm: "確認",
    yes: "はい",
    no: "いいえ",
    copy: "コピー",
    copied: "コピーしました",
    success: "成功",
    error: "エラー",
    warning: "警告",
    info: "情報",
    total: "合計",
    active: "アクティブ",
    inactive: "非アクティブ",
    pending: "保留中",
    running: "実行中",
    stopped: "停止中",
    unknown: "不明",
    never: "なし",
    auto: "自動",
    manual: "手動",
    all: "すべて",
    none: "なし",
    show: "表示",
    hide: "非表示",
    view: "表示",
    select: "選択",
    clear: "クリア",
    reset: "リセット",
    apply: "適用",
    upload: "アップロード",
    download: "ダウンロード",
    import: "インポート",
    export: "エクスポート",
    advanced: "詳細設定",
    basic: "基本設定",
    settings: "設定",
    configuration: "構成",
    options: "オプション",
    properties: "プロパティ",
    details: "詳細",
    summary: "概要",
    description: "説明",
    name: "名前",
    type: "タイプ",
    value: "値",
    status: "ステータス",
    created: "作成日時",
    updated: "更新日時",
    operations: "操作",
    actions: "アクション",
    filter: "フィルター",
    sort: "並び替え",
    search_placeholder: "検索...",
    no_data: "データがありません",
    no_results: "結果が見つかりません",
    loading_more: "さらに読み込み中...",
    load_more: "さらに読み込む",
    refresh_success: "正常に更新されました",
    save_success: "正常に保存されました",
    delete_success: "正常に削除されました",
    delete_confirm: "本当に削除しますか？",
    undo: "元に戻す",
    redo: "やり直し",
  },

  // =============================================
  // NAV - 导航菜单
  // =============================================
  nav: {
    chat: "チャット",
    control: "コントロール",
    agent: "エージェント",
    settings: "設定",
    expand: "サイドバーを展開",
    collapse: "サイドバーを折りたたむ",
    resize: "サイドバーのサイズを変更",
  },

  // ... (继续其他模块的翻译)
};
```

### 🌐 步骤 3: 注册新语言

编辑 `ui/src/i18n/index.ts`：

```typescript
// 在文件顶部添加导出
export * from "./locales/ja.ts";  // 新增日语
```

### ⚙️ 步骤 4: 配置语言检测（如需要）

如果需要自动检测该语言，修改相关配置：

```typescript
// ui/src/i18n/lib/lit-controller.ts 或相应配置文件
const SUPPORTED_LOCALES = ['en', 'zh-CN', 'zh-TW', 'ja', 'ko', 'fr'];
```

### ✅ 步骤 5: 本地测试

```bash
# 运行单元测试
npm test -- --grep i18n

# 手动测试
npm run dev
# 访问 http://localhost:5173
# 切换到新语言验证所有页面
```

**测试清单**:
- [ ] 所有页面文本正确显示
- [ ] 无未翻译的 key（显示为 raw key）
- [ ] 特殊字符正确渲染（CJK、阿拉伯文等）
- [ ] 布局适应长文本（德语、俄语等）
- [ ] 日期/数字格式本地化
- [ ] 输入法兼容性（IME）
- [ ] 响应式布局正常
- [ ] 无控制台错误

---

## 翻译规范与最佳实践

### 📏 一般原则

#### 1. **准确性优先**
- ✅ 正确理解原文含义
- ❌ 不要逐词翻译
- ✅ 符合目标语言表达习惯

**示例**:
```
英文: "Health Check"
❌ 错误: "健康检查" (医疗语境)
✅ 正确: "状态检查" (技术语境)
```

#### 2. **简洁明了**
- 保持简短，适合UI空间限制
- 避免冗余表达
- 使用行业通用术语

**示例**:
```
英文: "Click here to save your changes"
❌ 冗长: "点击此处以保存您的更改"
✅ 简洁: "保存更改" / "保存"
```

#### 3. **一致性**
- 同一术语全文统一
- 遵循[术语表](#术语一致性要求)
- 参考现有翻译

#### 4. **文化适应性**
- 考虑文化差异
- 避免敏感表达
- 尊重当地习惯

**示例**:
```
颜色含义:
- 西方: Red = 危险/错误
- 中国: Red = 吉祥/重要
- 建议: 保持红色用于错误提示，但避免过度使用
```

### 🔤 特殊情况处理

#### 1. **占位符**

使用 `{{变量名}}` 语法：

```typescript
// 英文原文
"welcome": "Welcome, {{name}}!"

// 日语翻译
"welcome": "{{name}}さん、ようこそ！"

// 中文翻译
"welcome": "欢迎，{{name}}！"
```

**注意**:
- 保持占位符不变
- 可调整语序以符合目标语言习惯
- 不要添加或删除占位符

#### 2. **复数形式**

部分语言需要处理复数（英语不需要）：

```typescript
// 俄语示例
"items": {
  one: "{{count}} элемент",
  few: "{{count}} элемента",
  many: "{{count}} элементов",
  other: "{{count}} элементов"
}
```

#### 3. **方向性文本**

RTL 语言（阿拉伯语、希伯来语）：

```css
/* 需要额外CSS支持 */
html[dir="rtl"] {
  direction: rtl;
  text-align: right;
}
```

#### 4. **长文本处理**

德语、芬兰语等语言文本较长：

```css
/* 确保UI能容纳 */
.button {
  /* 避免固定宽度 */
  width: auto;
  min-width: fit-content;
  white-space: nowrap;
  
  /* 允许换行 */
  overflow-wrap: break-word;
}
```

### 🎨 格式化建议

#### 1. **标点符号**

| 语言 | 句号 | 逗号 | 问号 | 感叹号 |
|------|------|------|------|--------|
| en | . | , | ? | ! |
| zh-CN | 。 | ， | ？ | ！ |
| ja | 。 | 、 | ？ | ！ |
| ko | . | , | ? | ! |

#### 2. **数字格式**

| 语言 | 千位分隔符 | 小数点 | 示例 |
|------|-----------|--------|------|
| en | , | . | 1,234.56 |
| zh-CN | ， | . | 1,234.56 |
| de | . | , | 1.234,56 |
| fr |   | , | 1 234,56 |

#### 3. **日期格式**

| 语言 | 格式 | 示例 |
|------|------|------|
| en | MM/DD/YYYY | 04/10/2026 |
| zh-CN | YYYY年MM月DD日 | 2026年04月10日 |
| ja | YYYY年MM月DD日 | 2026年04月10日 |
| ko | YYYY. MM. DD | 2026. 04. 10 |

---

## 术语一致性要求

### 核心术语表（必须遵循）

| English | zh-CN | ja | ko | fr | 说明 |
|---------|-------|----|----|----|------|
| Agent | 代理 | エージェント | 에이전트 | Agent | AI代理实体 |
| Channel | 频道 | 채널 | 채널 | Canal | 通信渠道 |
| Session | 会话 | 세션 | セッション | Session | 用户会话 |
| Instance | 实体 | 인스턴스 | インスタンス | Instance | 运行实例 |
| Skill | 技能 | 스킬 | スキル | Skill | 能力/技能 |
| Node | 节点 | 노드 | ノード | Nœud | 网络节点 |
| Config | 配置 | 설정 | 設定 | Configuration | 配置设置 |
| Usage | 使用量 | 사용량 | 使用量 | Utilisation | 资源使用 |
| Debug | 调试 | 디버그 | デバッグ | Débogage | 调试功能 |
| Log | 日志 | 로그 | ログ | Journal | 系统日志 |
| Health | 状态 | 상태 | ヘルス | Santé | 健康状态 |
| Online | 在线 | 온라인 | オンライン | En ligne | 连接状态 |
| Offline | 离线 | 오프라인 | オフライン | Hors ligne | 断开状态 |
| Enable | 启用 | 활성화 | 有効化 | Activer | 启用功能 |
| Disable | 禁用 | 비활성화 | 無効化 | Désactiver | 禁用功能 |
| Refresh | 刷新 | 새로고침 | 更新 | Actualiser | 刷新数据 |
| Connect | 连接 | 연결 | 接続 | Connecter | 建立连接 |
| Disconnect | 断开 | 연결 해제 | 切断 | Déconnecter | 断开连接 |

### 品牌和专有名词

**不翻译**（保持英文原文）:
- OpenClaw
- YYC³
- API
- CLI
- SDK
- JSON
- URL
- HTTP
- HTTPS
- WebSocket
- Docker
- Kubernetes
- Node.js
- TypeScript
- React/Vue/Angular（框架名称）

**示例**:
```
✅ 正确: "OpenClaw API 文档"
❌ 错误: "开放爪 应用程序接口 文档"
```

### 缩写处理

| 全称 | 缩写 | 处理方式 |
|------|------|----------|
| Application Programming Interface | API | 不翻译 |
| Command Line Interface | CLI | 不翻译 |
| Software Development Kit | SDK | 不翻译 |
| User Interface | UI | 不翻译 |
| Graphical User Interface | GUI | 不翻译 |
| Artificial Intelligence | AI | 不翻译 |
| Machine Learning | ML | 不翻译 |
| Natural Language Processing | NLP | 不翻译 |

---

## 测试验证流程

### 单元测试

创建对应的测试文件：

```typescript
// ui/src/__tests__/i18n/locales/ja.test.ts
import { ja } from '../../i18n/locales/ja';
import { en } from '../../i18n/locales/en';

describe('Japanese translations', () => {
  test('should have all required modules', () => {
    expect(ja).toHaveProperty('common');
    expect(ja).toHaveProperty('nav');
    expect(ja).toHaveProperty('tabs');
    // ... 其他模块
  });

  test('should have same keys as English', () => {
    const enKeys = flattenKeys(en);
    const jaKeys = flattenKeys(ja);
    
    expect(Object.keys(jaKeys).sort()).toEqual(
      Object.keys(enKeys).sort()
    );
  });

  test('should not have empty values', () => {
    const values = Object.values(flattenKeys(ja));
    values.forEach(value => {
      expect(value.trim().length).toBeGreaterThan(0);
    });
  });
});

function flattenKeys(obj: Record<string, any>, prefix = ''): Record<string, string> {
  let result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      result = { ...result, ...flattenKeys(value, fullKey) };
    } else {
      result[fullKey] = value;
    }
  }
  return result;
}
```

运行测试：

```bash
# 运行所有i18n测试
npm test -- --testPathPattern=i18n

# 运行特定语言测试
npm test -- --testPathPattern=ja
```

### 集成测试

#### 1. 视觉回归测试

使用工具（如 Percy、Chromatic）对比截图：

```bash
# 安装Percy
npm install @percy/cli --save-dev

# 截图
npx percy exec -- npm run test:e2e
```

#### 2. 手动测试清单

**必测场景**:

- [ ] **启动流程**
  - [ ] Banner 显示正确
  - [ ] Onboarding 向导完整
  - [ ] 语言选择生效

- [ ] **主界面**
  - [ ] 侧边栏导航完整
  - [ ] Tab 标签正确
  - [ ] 状态指示器准确

- [ ] **核心功能页**
  - [ ] Agents 页面
  - [ ] Channels 页面
  - [ ] Sessions 页面
  - [ ] Configuration 页面
  - [ ] Usage 页面
  - [ ] Debug 页面
  - [ ] Logs 页面

- [ ] **交互元素**
  - [ ] 按钮、链接文字正确
  - [ ] 表单标签、占位符正确
  - [ ] 提示信息、错误消息正确
  - [ ] 确认对话框文字正确

- [ ] **边界情况**
  - [ ] 超长文本不破坏布局
  - [ ] 特殊字符正确显示
  - [ ] 空数据显示友好提示
  - [ ] 加载状态文案正确

#### 3. 设备测试矩阵

| 设备类型 | 操作系统 | 浏览器 | 优先级 |
|---------|---------|--------|-------|
| Desktop | Windows | Chrome | P0 |
| Desktop | macOS | Safari | P0 |
| Desktop | Linux | Firefox | P1 |
| Mobile | iOS | Safari | P0 |
| Mobile | Android | Chrome | P0 |
| Tablet | iPadOS | Safari | P1 |
| Tablet | Android | Chrome | P1 |

---

## 提交 PR 规范

### PR 标题格式

```
feat(i18n): Add {language} translation (#issue-number)
```

**示例**:
```
feat(i18n): Add Japanese (ja) translation support (#123)
```

### PR 描述模板

```markdown
## 📝 变更描述

简要描述本次变更内容。

## 🌍 语言信息

- **语言名称**: Japanese (日本語)
- **语言代码**: `ja`
- **覆盖模块**: 
  - ✅ common
  - ✅ nav
  - ✅ tabs
  - ✅ ... (列出所有已翻译模块)

## ✅ 测试结果

- [x] 单元测试通过 (`npm test`)
- [x] 手动测试完成（附截图）
- [x] 无控制台错误
- [x] 响应式布局正常
- [x] 特殊字符渲染正确

## 📸 测试截图

<!-- 附上关键页面的截图 -->

### 主界面
![主界面](screenshots/main.png)

### 设置页面
![设置](screenshots/settings.png)

## 🔍 检查清单

- [x] 遵循翻译规范
- [x] 术语一致性检查通过
- [x] 无拼写/语法错误
- [x] 占位符保持完整
- [x] 代码格式化完成 (`npm run format`)
- [x] Lint 检查通过 (`npm run lint`)
- [x] 更新了本文档（如有新增术语）

## 📚 参考资料

- [翻译规范文档](./TRANSLATION_GUIDE.md)
- [术语表](./GLOSSARY.md)
- [原语言文件](./ui/src/i18n/locales/en.ts)

## 👥 审核人

@i18n-team @maintainers

---

## 💬 补充说明

其他需要说明的内容...
```

### 分支命名

```bash
git checkout -b feat/i18n/add-{locale}-translation
```

**示例**:
```bash
git checkout -b feat/i18n/add-ja-translation
```

### Commit 信息规范

```bash
# 添加翻译文件
git commit -m "feat(i18n): add Japanese translation for {module}"

# 修复翻译错误
git commit -m "fix(i18n): correct Japanese translation for {key}"

# 更新术语
git commit -m "docs(i18n): update glossary with new terms"
```

### Code Review 要点

**审核者应关注**:

1. **完整性**
   - [ ] 所有模块都已翻译
   - [ ] 无遗漏的 key
   - [ ] 与英文版本结构一致

2. **质量**
   - [ ] 翻译准确自然
   - [ ] 术语使用一致
   - [ ] 无语法/拼写错误
   - [ ] 文化适应性良好

3. **技术**
   - [ ] TypeScript 类型正确
   - [ ] 无语法错误
   - [ ] 测试覆盖充分
   - [ ] 无性能问题

4. **用户体验**
   - [ ] 文本长度合适
   - [ ] 布局不被破坏
   - [ ] 特殊字符正确
   - [ ] RTL 支持（如适用）

---

## 常见问题解答

### Q1: 我不懂编程，可以参与翻译吗？

**可以！** 我们提供多种参与方式：

1. **直接编辑翻译文件** (推荐)
   - 使用 GitHub Web IDE
   - 无需本地开发环境
   - 可视化编辑 `.ts` 文件

2. **使用翻译管理平台** (计划中)
   - Crowdin / POEditor 集成
   - 在线协作翻译
   - 版本控制自动化

3. **报告问题**
   - 提交 Issue 标记翻译错误
   - 提供改进建议
   - 帮助审核翻译质量

### Q2: 如何处理专业术语？

请严格遵循[术语表](#术语一致性要求)。如果遇到表中没有的术语：

1. 先搜索现有翻译是否已使用
2. 参考 Wikipedia 或行业标准翻译
3. 在 PR 中说明选择理由
4. 如有必要，提议更新术语表

### Q3: 翻译长度有限制吗？

虽然没有硬性限制，但请注意：

- **按钮文本**: ≤ 4 个词 / ≤ 8 个汉字
- **标签文本**: ≤ 6 个词 / ≤ 12 个汉字
- **提示文本**: ≤ 15 个词 / ≤ 30 个汉字
- **描述文本**: 适度，考虑布局空间

如果某些语言文本过长，可以：
1. 使用缩写形式
2. 采用 Tooltip 显示完整文本
3. 调整 UI 布局（需单独 PR）

### Q4: 如何处理复数形式？

目前系统基础版不支持复数变位。建议：

1. 使用中性表达（适用于单复数）
2. 使用数字代替（如："1 项"、"N 项"）
3. 如某语言强需求，可在 Issue 中提出，我们评估后扩展功能

### Q5: 可以只翻译部分模块吗？

**不建议**，但可以接受分阶段提交：

1. **首次 PR**: 至少翻译核心模块（common, nav, tabs, actions, errors）
2. **后续 PR**: 逐步完善其他模块
3. **标记未翻译**: 使用 `"TODO: translate"` 占位

**注意**: 未完全翻译的语言不会合并到主分支。

### Q6: 发现翻译错误怎么办？

1. **小错误** (错别字、标点):
   - 直接提交 Fix PR
   - 标题格式: `fix(i18n): correct {locale} typo in {key}`

2. **术语不一致**:
   - 提交 Issue 讨论
   - 达成共识后修复
   - 更新术语表

3. **重大质量问题**:
   - 提交详细 Issue
   - 提供改进方案
   - 申请重新审核

### Q7: 如何成为官方翻译者？

**路径**:

1. **贡献者** → 完成 1 个完整语言翻译并通过审核
2. **审核者** → 完成 3+ 高质量翻译 + 通过审核者认证
3. **维护者** → 长期活跃 + 社区认可 + 团队邀请

**权益**:
- 出现在贡献者名单
- 获得 i18n team badge
- 参与技术决策
- 优先体验新功能

### Q8: 翻译版权归属谁？

- 翻译内容采用 MIT 许可证（与项目一致）
- 贡献者保留署名权
- 出现在 CONTRIBUTORS.md 和 Git 历史

---

## 📞 获取帮助

### 联系渠道

- **GitHub Issues**: [i18n 标签](https://github.com/your-org/openclaw/issues?q=label%3Ai18n)
- **Discord**: #i18n 频道
- **Email**: i18n@openclaw.dev

### 学习资源

- [MDN: Internationalization](https://developer.mozilla.org/en-US/docs/Glossary/Internationalization)
- [W3C: Localization vs. Internationalization](https://www.w3.org/Internationalization/)
- [Google: Localization Best Practices](https://developers.google.com/localization/)
- [Mozilla: Localization](https://mozilla-localization.github.io/)

---

## 🙏 致谢

感谢所有为 OpenClaw 国际化做出贡献的社区成员！您的努力让全球用户都能享受优质的产品体验。

**特别感谢**:
- @all-contributors - 持续改进翻译质量
- @reviewers - 仔细审核每一处翻译
- @community - 积极反馈和提供建议

---

**最后更新**: 2026-04-10  
**维护团队**: OpenClaw i18n Team  
**许可证**: MIT License
