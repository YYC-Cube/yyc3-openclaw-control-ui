<p align="center">
  <a href="https://github.com/YYC-Cube/yyc3-i18n-core">
    <img src="https://raw.githubusercontent.com/YYC-Cube/.github/main/assets/banner-i18n-core.svg" alt="@yyc3/i18n-core" width="100%" />
  </a>
</p>

<p align="center">
  <strong>Production-Ready Internationalization Framework</strong><br>
  <em>Zero-dependency · Plugin-based · Enterprise Security · RTL Support</em>
</p>

<p align="center">
  <img src="https://img.shields.io/npm/v/@yyc3/i18n-core.svg?style=flat-square&color=blue" alt="npm version" />
  <img src="https://img.shields.io/npm/dt/@yyc3/i18n-core.svg?style=flat-square&color=blueviolet" alt="npm downloads" />
  <img src="https://img.shields.io/npm/l/@yyc3/i18n-core.svg?style=flat-square&color=brightgreen" alt="license" />
  <br/>
  <img src="https://img.shields.io/badge/TypeScript-5.3+-3178c6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/node/v/%3E%3D16.0.0.svg?style=flat-square&color=339933" alt="Node.js" />
  <img src="https://img.shields.io/badge/dependencies-0-success?style=flat-square" alt="Zero Dependencies" />
  <br/>
  <img src="https://img.shields.io/badge/tests-321%20passed-brightgreen?style=flat-square" alt="Tests" />
  <img src="https://img.shields.io/badge/coverage-73.78%25-yellowgreen?style=flat-square" alt="Coverage" />
  <img src="https://img.shields.io/badge/security-OWASP%20Level%204-blue?style=flat-square" alt="Security" />
</p>

---

## 📖 Table of Contents

- [🎯 Project Overview](#-project-overview)
- [✨ Core Features](#-core-features)
- [🚀 Quick Start](#-quick-start)
- [📦 Installation](#-installation)
- [🔌 Plugin System](#-plugin-system)
- [🛡️ Security Modules](#-security-modules)
- [⚙️ Infrastructure Utilities](#-infrastructure-utilities)
- [🔧 General Utilities](#-general-utilities)
- [🌍 Supported Languages](#-supported-languages)
- [📊 Architecture](#-architecture)
- [🧪 Testing & Quality](#-testing--quality)
- [📁 Project Structure](#-project-structure)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🎯 Project Overview

**@yyc3/i18n-core** is a **production-grade internationalization framework** built with the YYC³ philosophy of "五高五标五化" (Five Highs, Five Standards, Five Transformations).

### Key Highlights

| Feature | Description |
|---------|-------------|
| 🌐 **10 Languages** | English, Chinese (Simplified/Traditional), Japanese, Korean, French, German, Spanish, Portuguese, Arabic |
| 🔤 **RTL Support** | Native Right-to-Left layout for Arabic and other RTL languages |
| 🔒 **Zero Dependencies** | No runtime dependencies - pure Node.js built-ins only |
| 🛡️ **Enterprise Security** | ReDoS protection, timing attack prevention, path traversal guards |
| ⚡️ **High Performance** | LRU cache, lazy loading, <1ms translation calls |
| 🔌 **Plugin Architecture** | Extensible lifecycle hooks for logging, monitoring, analytics |
| 📦 **Tree-Shakeable** | ESM exports for optimal bundle size |
| 🎯 **Type Safety** | 100% TypeScript with strict mode |

### YYC³ Quality Matrix

```
┌─────────────────────────────────────────────────────────────┐
│                    五高 (Five Highs)                          │
│  ✅ High Availability   ✅ High Performance                  │
│  ✅ High Security       ✅ High Scalability                  │
│  ✅ High Maintainability                                        │
├─────────────────────────────────────────────────────────────┤
│                    五标 (Five Standards)                      │
│  ✅ Standardization      ✅ Normalization                     │
│  ✅ Automation           ✅ Intelligence                      │
│  ✅ Visualization                                           │
├─────────────────────────────────────────────────────────────┤
│                    五化 (Five Transformations)                │
│  ✅ Process-oriented     ✅ Documented                        │
│  ✅ Tool-enabled         ✅ Digitalized                       │
│  ✅ Ecosystem-based                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## ✨ Core Features

### Internationalization Engine

```typescript
import { i18n, t, I18nEngine } from '@yyc3/i18n-core';

// Basic translation
console.log(t('common.health')); // "Health Status"

// With interpolation
console.log(t('greeting', { name: 'World' })); // "Hello World"

// Switch locale
await i18n.setLocale('zh-CN');
console.log(t('common.health')); // "健康状况"

// Namespace support
const appT = i18n.createNamespace('app');
console.log(appT('title')); // Equivalent to t('app.title')

// Batch translation
const results = i18n.batchTranslate(['common.save', 'common.cancel']);
```

### Formatter Utilities

```typescript
import { interpolate, pluralize, formatRelativeTime } from '@yyc3/i18n-core';

// Template interpolation
interpolate('Hello {{name}}, you have {{count}} messages', { name: 'World', count: 5 });
// => "Hello World, you have 5 messages"

// Pluralization
pluralize('{{count}} message(s)', 1);  // => "1 message"
pluralize('{{count}} message(s)', 5);  // => "5 messages"

// Relative time
formatRelativeTime(Date.now() - 3600000, 'zh-CN'); // => "1小时前"
formatRelativeTime(Date.now() - 3600000, 'en');     // => "1h ago"
```

### Locale Detection

```typescript
import { detectSystemLocale, normalizeLocale, isChineseLocale } from '@yyc3/i18n-core';

// Multi-source detection (env > storage > system > default)
const result = detectSystemLocale(storedLocale);
console.log(result.locale);      // 'zh-CN'
console.log(result.source);      // 'env' | 'system' | 'storage' | 'default'

// Normalize locale codes
normalizeLocale('zh_cn');   // => 'zh-CN'
normalizeLocale('EN-US');  // => 'en'

// Chinese detection
isChineseLocale('zh-CN'); // => true
isChineseLocale('en');    // => false
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 16.0.0
- **TypeScript** >= 5.3 (recommended)
- **Package manager**: npm / yarn / pnpm

### Installation

```bash
# npm
npm install @yyc3/i18n-core

# yarn
yarn add @yyc3/i18n-core

# pnpm (recommended)
pnpm add @yyc3/i18n-core
```

### Minimal Setup

```typescript
// src/i18n.ts
import { i18n, t } from '@yyc3/i18n-core';

// Initialize with default config
await i18n.init({
  defaultLocale: 'en',
  fallbackLocale: 'en',
});

// Use in your app
export const translate = t;
```

### Advanced Configuration

```typescript
await i18n.init({
  defaultLocale: 'zh-CN',
  fallbackLocale: 'en',
  
  // Cache configuration
  cache: {
    maxSize: 500,
    ttl: 30 * 60 * 1000, // 30 minutes
  },
  
  // Error handling
  onError: (error) => console.error('[i18n]', error),
  missingKeyHandler: (key) => `[MISSING:${key}]`,
  
  // Debug mode
  debug: process.env.NODE_ENV === 'development',
});
```

---

## 📦 Installation

### Package Exports

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./cache": {
      "import": "./dist/lib/cache.js",
      "types": "./dist/lib/cache.d.ts"
    },
    "./plugins": {
      "import": "./dist/plugins/index.js",
      "types": "./dist/plugins/index.d.ts"
    }
  }
}
```

### Subpath Imports

```typescript
// Full package
import { i18n, t } from '@yyc3/i18n-core';

// Cache only
import { LRUCache } from '@yyc3/i18n-core/cache';

// Plugins only
import { createConsoleLogger } from '@yyc3/i18n-core/plugins';
```

---

## 🔌 Plugin System

The plugin architecture provides extensible lifecycle hooks for monitoring, logging, and analytics.

### Built-in Plugins

#### 1. ConsoleLogger

Development debugging with colored output.

```typescript
import { createConsoleLogger } from '@yyc3/i18n-core';

i18n.plugins.register(createConsoleLogger({
  logTranslations: true,
  logLocaleChanges: true,
  logMissingKeys: true,
  logErrors: true,
}));
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `logTranslations` | `boolean` | `false` | Log each translation call |
| `logLocaleChanges` | `boolean` | `false` | Log locale switch events |
| `logMissingKeys` | `boolean` | `true` | Log missing key warnings |
| `logErrors` | `boolean` | `true` | Log error events |

#### 2. MissingKeyReporter

Track missing translations for quality monitoring.

```typescript
import { MissingKeyReporter } from '@yyc3/i18n-core';

const reporter = new MissingKeyReporter({ maxEntries: 1000 });
i18n.plugins.register(reporter.createPlugin());

// Get report
console.log(reporter.generateReport());

// Export as JSON
const json = reporter.exportJSON();
```

**Features:**
- Track unique missing keys by locale
- Count occurrences per key
- Generate formatted reports
- Export to JSON for CI/CD integration

#### 3. PerformanceTracker

Monitor translation performance metrics.

```typescript
import { PerformanceTracker } from '@yyc3/i18n-core';

const tracker = new PerformanceTracker({
  slowThreshold: 10, // ms
  maxSlowEntries: 50,
  samplingRate: 1, // 1 = track all
});

i18n.plugins.register(tracker.createPlugin());

// Get metrics
const metrics = tracker.getMetrics();
console.log(`Cache hit rate: ${tracker.getCacheHitRate()}%`);
console.log(`P99 latency: ${tracker.getPercentile(99)}ms`);

// Generate report
console.log(tracker.generateReport());
```

**Metrics Provided:**
- Total calls, cache hits/misses
- Average/max duration
- P50/P95/P99 percentiles
- Slow translation list

### Custom Plugin Example

```typescript
import type { I18nPlugin } from '@yyc3/i18n-core';

const analyticsPlugin: I18nPlugin = {
  name: 'analytics-plugin',
  version: '1.0.0',

  beforeTranslate(key: string) {
    // Track translation request
    analytics.track('i18n:request', { key });
  },

  afterTranslate(result: string, key: string): string | undefined {
    // Track successful translation
    analytics.track('i18n:success', { key, length: result.length });
    return undefined; // Don't modify result
  },

  onLocaleChange(from: string, to: string): void {
    analytics.track('i18n:locale-change', { from, to });
  },
};

i18n.plugins.register(analyticsPlugin);
```

---

## 🛡️ Security Modules

Integrated from OpenClaw's security infrastructure with zero external dependencies.

### Dangerous Operations Detection

```typescript
import { isDangerousOperation, DANGEROUS_OPERATION_NAMES } from '@yyc3/i18n-core';

isDangerousOperation('DROP TABLE users'); // true
isDangerousOperation('SELECT * FROM users'); // false

console.log(DANGEROUS_OPERATION_NAMES);
// ['DROP', 'DELETE', 'TRUNCATE', 'ALTER', ...]
```

**Supported Patterns:**
- SQL DDL operations (DROP, DELETE, TRUNCATE, ALTER)
- File system operations (RM, RMDIR, MKDIR)
- Process operations (KILL, EXEC, EVAL)

### Safe Regex (ReDoS Protection)

```typescript
import { compileSafeRegex, testSafeRegex } from '@yyc3/i18n-core';

// Safe regex - compiles normally
const safeResult = compileSafeRegex(/^[a-z]+$/);
console.log(safeResult.safe); // true
console.log(safeResult.regex); // /^[a-z]+$/

// Unsafe regex - rejects with reason
const unsafeResult = compileSafeRegex(/^(a+)+$/);
console.log(unsafeResult.safe); // false
console.log(unsafeResult.reason); // 'nested_repetition'

// Test without compiling
testSafeRegex('(a+)+b'); // { safe: false, reason: 'nested_reputation' }
```

**Detection Capabilities:**
- Nested quantifiers `(a+)+`
- Alternation with quantifiers `(a|b+)+`
- Deep nesting depth > 3

### Secret Comparison (Timing Attack Safe)

```typescript
import { safeEqualSecret } from '@yyc3/i18n-core';

// Constant-time comparison prevents timing attacks
safeEqualSecret('my-secret-token', 'my-secret-token'); // true
safeEqualSecret('my-secret-token', 'wrong-token');     // false
```

**Security Features:**
- Constant-time string comparison
- Length check first (prevents early exit)
- Uses crypto.timingSafeEqual when available

---

## ⚙️ Infrastructure Utilities

High-availability components for production environments.

### Exponential Backoff with Jitter

```typescript
import { computeBackoff, createRetryRunner, DEFAULT_BACKOFF_POLICY } from '@yyc3/i18n-core';

// Compute backoff delay
const delay = computeBackoff(3, DEFAULT_BACKOFF_POLICY);
console.log(delay); // ~4000ms with jitter

// Retry runner with automatic backoff
const result = await createRetryRunner(
  async () => fetchData(),
  {
    maxRetries: 3,
    baseDelayMs: 1000,
    maxDelayMs: 30000,
  }
);
```

**Features:**
- Exponential backoff with full jitter
- Configurable retry limits
- AbortController support
- Retryable error filtering

### Fixed Window Rate Limiter

```typescript
import { createFixedWindowRateLimiter } from '@yyc3/i18n-core';

const limiter = createFixedWindowRateLimiter({
  windowMs: 60000, // 1 minute
  maxRequests: 100,
});

if (limiter.tryAcquire()) {
  // Request allowed
} else {
  // Rate limited
}

console.log(limiter.getStats());
// { remaining: 98, resetTime: Date }
```

**Use Cases:**
- API rate limiting
- Translation batch throttling
- Cache refresh limiting

### Secure Random Generation

```typescript
import {
  generateSecureUuid,
  generateSecureToken,
  generateSecureHex,
  generateSecureInt,
} from '@yyc3/i18n-core';

// UUID v4 format
generateSecureUuid(); // "550e8400-e29b-41d4-a716-446655440000"

// URL-safe token (32 bytes)
generateSecureToken(); // "xJ7cK9mN2pQ4rS6..."

// Hex string
generateSecureHex(16); // "a1b2c3d4e5f67890"

// Integer in range
generateSecureInt(1, 100); // 42
```

**Security:**
- Uses crypto.randomBytes (Node.js) or crypto.getRandomValues (browser)
- Cryptographically secure
- No Math.random() usage

---

## 🔧 General Utilities

Production-ready utilities for common tasks.

### Time Formatting

```typescript
import { formatTimeAgo, formatRelativeTimestamp } from '@yyc3/i18n-core';

// Human-readable relative time
formatTimeAgo(Date.now() - 3600000); // "1 hour ago"
formatTimeAgo(Date.now() - 86400000); // "1 day ago"

// Locale-aware formatting
formatRelativeTimestamp(Date.now() - 3600000, 'zh-CN'); // "1小时前"
formatRelativeTimestamp(Date.now() - 7200, 'en');        // "2 hours ago"
```

### Path Guards (Traversal Prevention)

```typescript
import { isPathInside, normalizeWindowsPathForComparison } from '@yyc3/i18n-core';

// Prevent path traversal attacks
isPathInside('/var/www/uploads', '/var/www/uploads/../etc/passwd');
// false - path escapes directory

isPathInside('/var/www/uploads', '/var/www/uploads/image.png');
// true - safe path

// Normalize Windows paths
normalizeWindowsPathForComparison('C:\\Users\\file.txt');
// "C:/Users/file.txt"
```

### JSON File Operations

```typescript
import { loadJsonFile, saveJsonFile, deleteJsonFile } from '@yyc3/i18n-core';

// Atomic read with validation
const data = await loadJsonFile('./config.json');

// Atomic write with backup
await saveJsonFile('./config.json', newData, {
  mkdir: true,
  permission: 0o600, // Owner only
});

// Safe delete
await deleteJsonFile('./old-config.json');
```

**Safety Features:**
- Atomic writes (write to temp + rename)
- Permission control (default 0o600)
- Automatic backup on overwrite
- Schema validation support

---

## 🌍 Supported Languages

| Code | Language | Native Name | Direction | Status |
|------|----------|-------------|-----------|--------|
| `en` | English | English | LTR | ✅ |
| `zh-CN` | 简体中文 | 简体中文 | LTR | ✅ |
| `zh-TW` | 繁體中文 | 繁體中文 | LTR | ✅ |
| `ja` | 日本語 | 日本語 | LTR | ✅ |
| `ko` | 한국어 | 한국어 | LTR | ✅ |
| `fr` | Français | Français | LTR | ✅ |
| `de` | Deutsch | Deutsch | LTR | ✅ |
| `es` | Español | Español | LTR | ✅ |
| `pt-BR` | Português | Português (BR) | LTR | ✅ |
| `ar` | العربية | العربية | **RTL** | ✅ |

**Total: 10 languages | 9 LTR + 1 RTL**

---

## 📊 Architecture

### Layered Design

```
┌─────────────────────────────────────────────────────────────────┐
│                        Application Layer                         │
│              React · Vue · Angular · Lit · Vanilla JS            │
└──────────────────────────────┬──────────────────────────────────┘
                               │ import
┌──────────────────────────────▼──────────────────────────────────┐
│                   @yyc3/i18n-core (Public API)                   │
│  ┌───────────┬──────────┬──────────┬──────────┬──────────────┐  │
│  │   Core    │Formatter │ Detector │   RTL    │    Lit       │  │
│  │   Engine  │          │          │  Utils   │ Controller   │  │
│  └─────┬─────┴─────┬────┴─────┬────┴─────┬────┴──────┬───────┘  │
│        │           │          │          │            │          │
│  ┌─────▼───────────▼──────────▼──────────▼────────────▼─────┐   │
│  │                 Core Engine Layer                          │   │
│  │  ┌─────────┐ ┌─────────┐ ┌──────────┐ ┌──────────────┐  │   │
│  │  │Registry │ │ Loader  │ │  Cache   │ │   Plugins    │  │   │
│  │  └─────────┘ └─────────┘ └──────────┘ └──────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
├──────────────────────────────────────────────────────────────────┤
│                    Integrated Modules                             │
│  ┌────────────────┬────────────────┬─────────────────────────┐  │
│  │  Infrastructure│    Security    │      Utilities          │  │
│  │  • Backoff     │  • Safe Regex  │  • Format Time          │  │
│  │  • Rate Limit  │  • Secret Eq.  │  • Path Guards          │  │
│  │  • Sec Random  │  • Danger Ops  │  • JSON File Ops        │  │
│  └────────────────┴────────────────┴─────────────────────────┘  │
└──────────────────────────────┬──────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│                    Data Layer (Locales)                           │
│  en · zh-CN · zh-TW · ja · ko · fr · de · es · pt-BR · ar      │
└─────────────────────────────────────────────────────────────────┘
```

### Module Dependency Graph

```
index.ts
├── lib/engine.ts          → Core I18nEngine class
├── lib/cache.ts           → LRUCache implementation
├── lib/plugins.ts         → PluginManager
├── lib/formatter.ts       → interpolate, pluralize, formatRelativeTime
├── lib/detector.ts        → detectSystemLocale, normalizeLocale
├── lib/rtl-utils.ts       → RTL layout utilities
├── lib/local-storage.ts   → Browser storage abstraction
├── lib/translate.ts       → Translation resolution logic
├── lib/registry.ts        → Translation registry
├── lib/i18n-audit.ts      → Audit logging system
├── lib/lit-controller.ts  → Lit reactive controller
│
├── lib/infra/
│   ├── backoff.ts         → Exponential backoff with jitter
│   ├── rate-limit.ts      → Fixed window rate limiter
│   └── secure-random.ts   → Crypto-secure random generation
│
├── lib/security/
│   ├── dangerous-operations.ts → SQL/File/Process danger detection
│   ├── safe-regex.ts      → ReDoS prevention compiler
│   └── secret-equal.ts    → Timing-attack-safe comparison
│
├── lib/utils/
│   ├── format-time.ts     → Relative time formatting
│   ├── path-guards.ts     → Path traversal prevention
│   └── json-file.ts       → Atomic JSON file operations
│
└── locales/
    ├── en.ts, zh-CN.ts, zh-TW.ts, ja.ts, ko.ts
    ├── fr.ts, de.ts, es.ts, pt-BR.ts, ar.ts
```

---

## 🧪 Testing & Quality

### Test Statistics

```
✅ Total Tests:     321
✅ Pass Rate:       100%
✅ Test Files:      20
✅ Coverage:
   - Statements:    73.78%
   - Branches:      84.13%
   - Functions:     84.32%
```

### Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Specific test file
npx vitest run src/test/backoff.test.ts
```

### Quality Metrics by Module

| Module | Statements | Branches | Functions | Status |
|--------|-----------|----------|-----------|--------|
| **security/** | 100% | 95% | 100% | ✅ Perfect |
| **locales/** | 100% | 100% | 100% | ✅ Perfect |
| **formatter.ts** | 100% | 100% | 100% | ✅ Perfect |
| **local-storage.ts** | 100% | 100% | 100% | ✅ Perfect |
| **infra/** | 97.16% | 90.9% | 100% | ✅ Excellent |
| **utils/** | 93.64% | 93.15% | 100% | ✅ Excellent |
| **plugins/** | 92.64% | 89.18% | 91.17% | ✅ Excellent |
| **lib/ core** | 88.88% | 79.58% | 83.8% | ✅ Good |

---

## 📁 Project Structure

```
packages/i18n-core/
├── .github/
│   └── workflows/
│       └── ci.yml                    # GitHub Actions CI/CD
├── docs/
│   └── .i18n/
│       └── glossary.zh-CN.json       # Translation glossary
├── examples/
│   └── basic-usage.ts               # Usage examples
├── scripts/
│   ├── i18n-coverage-report.ts       # Coverage report generator
│   ├── i18n-key-extractor.ts         # Translation key extractor
│   └── rtl-validation.ts             # RTL validation script
├── src/
│   ├── index.ts                      # Public API entry point
│   ├── lib/
│   │   ├── engine.ts                 # Core I18nEngine
│   │   ├── cache.ts                  # LRU Cache implementation
│   │   ├── plugins.ts                # Plugin Manager
│   │   ├── formatter.ts              # String formatting
│   │   ├── detector.ts               # Locale detection
│   │   ├── rtl-utils.ts              # RTL layout utilities
│   │   ├── local-storage.ts          # Storage abstraction
│   │   ├── translate.ts              # Translation logic
│   │   ├── registry.ts               # Translation registry
│   │   ├── i18n-audit.ts             # Audit logging
│   │   ├── lit-controller.ts         # Lit integration
│   │   │
│   │   ├── infra/                    # Infrastructure modules
│   │   │   ├── backoff.ts            # Exponential backoff
│   │   │   ├── rate-limit.ts         # Rate limiting
│   │   │   └── secure-random.ts      # Secure random
│   │   │
│   │   ├── plugins/                  # Built-in plugins
│   │   │   ├── console-logger.ts     # Dev logger
│   │   │   ├── missing-key-reporter.ts # Missing key tracker
│   │   │   ├── performance-tracker.ts # Perf monitoring
│   │   │   └── index.ts              # Plugin exports
│   │   │
│   │   ├── security/                 # Security modules
│   │   │   ├── dangerous-operations.ts # Danger detection
│   │   │   ├── safe-regex.ts         # ReDoS protection
│   │   │   └── secret-equal.ts       # Timing-safe compare
│   │   │
│   │   └── utils/                    # Utility modules
│   │       ├── format-time.ts        # Time formatting
│   │       ├── path-guards.ts        # Path traversal guard
│   │       └── json-file.ts          # JSON file ops
│   │
│   ├── locales/                      # Language packs (10 total)
│   │   ├── en.ts, zh-CN.ts, zh-TW.ts
│   │   ├── ja.ts, ko.ts, fr.ts, de.ts
│   │   ├── es.ts, pt-BR.ts, ar.ts
│   │
│   ├── test/                         # Test suites (321 tests)
│   │   ├── infra/                    # Infra module tests
│   │   ├── security/                 # Security module tests
│   │   ├── utils/                    # Utility module tests
│   │   ├── *.test.ts                 # Core module tests
│   │
│   └── types/
│       └── lit.d.ts                  # Lit type declarations
│
├── test-helpers/
│   └── storage.ts                    # Test storage helpers
│
├── .gitignore
├── CHANGELOG.md                       # Version history
├── CONTRIBUTING.md                    # Contribution guidelines
├── LICENSE                            # MIT License
├── README.md                          # This file
├── package.json                       # Package configuration
├── tsconfig.build.json                # Build TypeScript config
├── tsconfig.json                      # Base TypeScript config
└── vitest.config.ts                   # Vitest configuration
```

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

### Quick Start

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/yyc3-i18n-core.git
cd yyc3-i18n-core

# Install dependencies
pnpm install

# Run tests
pnpm test

# Build
pnpm build
```

### Development Standards

- TypeScript strict mode
- >80% test coverage for new code
- Conventional Commits specification
- Update documentation for API changes

---

## 📄 License

MIT © [YYC³ Team](https://github.com/YYC-Cube)

---

<div align="center">

### ⭐ Star this project if you find it useful! ⭐

**Made with ❤️ by [YYC³ Team](https://github.com/YYC-Cube)**

[🏠 Home](https://github.com/YYC-Cube) • 
[📖 Documentation](#-table-of-contents) • 
[🐛 Report Issue](https://github.com/YYC-Cube/yyc3-i18n-core/issues) • 
[💬 Discussions](https://github.com/YYC-Cube/yyc3-i18n-core/discussions)

<br/>

<p>
  <strong>YYC³ Quality Assurance Certified</strong><br>
  <em>五高 · 五标 · 五化</em><br>
  <code>High Availability · High Performance · High Security · High Scalability · High Maintainability</code><br>
  <code>Standardization · Normalization · Automation · Intelligence · Visualization</code><br>
  <code>Process-oriented · Documented · Tool-enabled · Digitalized · Ecosystem-based</code>
</p>

</div>
