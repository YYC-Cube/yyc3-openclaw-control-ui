/**
 * file: src/i18n/types.ts
 * description: i18n 类型定义 · 提供完整的 TypeScript 类型支持
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-04-10
 * updated: 2026-04-10
 * status: active
 * tags: [i18n],[types],[typescript]
 */

/** 支持的语言类型 */
export type SupportedLocale = 'en' | 'zh-CN' | 'zh-TW';

/** 翻译数据结构 (支持嵌套) */
export type TranslationData = string | TranslationRecord;
export interface TranslationRecord {
  [key: string]: TranslationData;
}

/** 翻译资源映射 */
export type LocaleMap = Record<string, TranslationRecord>;

/** i18n 引擎配置选项 */
export interface I18nConfig {
  /** 默认语言 */
  defaultLocale?: SupportedLocale;
  /** 回退语言 (当翻译缺失时使用) */
  fallbackLocale?: SupportedLocale;
  /** 翻译资源目录路径 */
  localeDir?: string;
  /** 缺失翻译键的处理回调 */
  onMissingKey?: (key: string, locale: string) => string;
}

/** 翻译函数参数 */
export interface TranslateParams {
  [key: string]: unknown;
}

/** 语言检测结果 */
export interface LocaleDetectionResult {
  /** 检测到的语言代码 */
  locale: SupportedLocale;
  /** 检测来源 */
  source: 'env' | 'config' | 'system' | 'default';
  /** 置信度 (0-1) */
  confidence: number;
}
