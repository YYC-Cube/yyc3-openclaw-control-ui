/**
 * file: src/i18n/index.ts
 * description: i18n 模块统一导出入口
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-04-10
 * updated: 2026-04-10
 * status: active
 * tags: [i18n],[export]
 */

// 核心引擎和便捷函数
export {
  I18nEngine,
  getI18n,
  destroyI18n,
  t,
  setLocale,
  getLocale,
} from './core.js';

// 类型定义
export type {
  SupportedLocale,
  TranslationData,
  TranslationRecord,
  LocaleMap,
  I18nConfig,
  TranslateParams,
  LocaleDetectionResult,
} from './types.js';

// 工具函数
export { detectSystemLocale, normalizeLocale, isChineseLocale } from './detector.js';
export { interpolate, pluralize, formatRelativeTime } from './formatter.js';

// CLI 错误处理
export { CliError, CliErrorCode, createError } from './cli-error.js';
export type { CliErrorOptions, ErrorSuggestion, ErrorSeverity } from './cli-error.js';

// 初始化模块
export { initI18n, parseLanguageArg, isI18nInitialized, resetInitState } from './init.js';

// Onboard 向导中文化
export {
  printWelcomeScreen,
  printStepHeader,
  printCompletionScreen,
  printCancelledMessage,
  getPromptText,
  validationMessages,
  hints,
} from './onboard-i18n.js';
export type { OnboardStepConfig } from './onboard-i18n.js';

/**
 * 使用示例:
 *
 * ```typescript
 * import { t, setLocale, getLocale, CliError, createError } from '../i18n/index';
 *
 * // 基础翻译
 * console.log(t('common.success')); // "✅ 操作成功"
 *
 * // 带参数的翻译
 * console.log(t('gateway.started', { port: 18789 }));
 *
 * // 切换语言
 * setLocale('en');
 * console.log(t('common.success')); // "✅ Success"
 *
 * // 获取当前语言
 * console.log(getLocale()); // "en"
 *
 * // 创建结构化错误
 * throw createError(CliErrorCode.GATEWAY_PORT_IN_USE, { port: 18789 });
 * ```
 */
