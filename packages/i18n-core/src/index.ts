/**
 * @fileoverview YYC³ i18n Core - Production-Ready Internationalization Framework
 * @version 2.0.0
 * @author YYC³ Team <team@yyc3.dev>
 * @license MIT
 * @see https://github.com/YYC-Cube/yyc3-i18n-core
 *
 * @description
 * High-performance, plugin-based, zero-dependency i18n solution for modern web applications.
 */

// Core Engine
export { I18nEngine, i18n, t } from "./lib/engine.js";
export type { I18nEngineConfig } from "./lib/engine.js";

// Cache System
export { LRUCache } from "./lib/cache.js";
export type { CacheConfig, CacheStats } from "./lib/cache.js";

// Plugin System
export { PluginManager } from "./lib/plugins.js";
export type { I18nPlugin, I18nContext } from "./lib/plugins.js";

// Built-in Plugins (from plugins/index.ts)
export {
  createConsoleLogger,
  MissingKeyReporter,
  PerformanceTracker,
} from "./lib/plugins/index.js";

// Formatter utilities
export { interpolate, pluralize, formatRelativeTime } from "./lib/formatter.js";
export type { TranslateParams } from "./lib/formatter.js";

// Locale detection
export {
  detectSystemLocale,
  normalizeLocale,
  isChineseLocale,
} from "./lib/detector.js";
export type { LocaleDetectionResult } from "./lib/detector.js";

// ============================================================
// Infrastructure Utilities (from OpenClaw - High Availability)
// ============================================================

// Backoff & Retry
export {
  computeBackoff,
  sleepWithAbort,
  createRetryRunner,
  DEFAULT_BACKOFF_POLICY,
} from "./lib/infra/backoff.js";
export type { BackoffPolicy } from "./lib/infra/backoff.js";

// Rate Limiting
export { createFixedWindowRateLimiter } from "./lib/infra/rate-limit.js";
export type { FixedWindowRateLimiter } from "./lib/infra/rate-limit.js";

// Secure Random
export {
  generateSecureUuid,
  generateSecureToken,
  generateSecureHex,
  generateSecureFraction,
  generateSecureInt,
} from "./lib/infra/secure-random.js";

// ============================================================
// Security Utilities (from OpenClaw - Enterprise Security)
// ============================================================

// Dangerous Operations Detection
export {
  isDangerousOperation,
  getDangerousOperations,
  DANGEROUS_OPERATION_NAMES,
  DANGEROUS_OPERATIONS_SET,
} from "./lib/security/dangerous-operations.js";
export type { DangerousOperation } from "./lib/security/dangerous-operations.js";

// Safe Regex (ReDoS Protection)
export {
  compileSafeRegex,
  testSafeRegex,
  clearSafeRegexCache,
} from "./lib/security/safe-regex.js";
export type { SafeRegexCompileResult, SafeRegexRejectReason } from "./lib/security/safe-regex.js";

// Secret Comparison (Timing Attack Safe)
export { safeEqualSecret } from "./lib/security/secret-equal.js";

// ============================================================
// General Utilities (from OpenClaw - Production Ready)
// ============================================================

// Time Formatting
export { formatTimeAgo, formatRelativeTimestamp } from "./lib/utils/format-time.js";
export type { FormatTimeAgoOptions, FormatRelativeTimestampOptions } from "./lib/utils/format-time.js";

// Path Guards (Traversal Prevention)
export {
  normalizeWindowsPathForComparison,
  isNodeError,
  hasNodeErrorCode,
  isNotFoundPathError,
  isSymlinkOpenError,
  isPathInside,
} from "./lib/utils/path-guards.js";

// JSON File Operations
export {
  loadJsonFile,
  saveJsonFile,
  jsonFileExists,
  deleteJsonFile,
} from "./lib/utils/json-file.js";
