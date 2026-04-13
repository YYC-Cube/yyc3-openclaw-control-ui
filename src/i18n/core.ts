/**
 * file: src/i18n/core.ts
 * description: i18n 核心引擎 · 轻量级国际化解决方案
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-04-10
 * updated: 2026-04-10
 * status: active
 * tags: [i18n],[core],[engine]
 *
 * features:
 * - 零依赖轻量级设计
 * - 支持嵌套翻译键 (如 'gateway.status.running')
 * - 模板变量插值 ({{variable}} 格式)
 * - 自动语言检测 (环境变量/系统locale)
 * - Fallback 链机制 (缺失翻译自动回退)
 * - 单例模式全局共享
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type {
  SupportedLocale,
  TranslationData,
  TranslationRecord,
  LocaleMap,
  I18nConfig,
  TranslateParams,
} from './types.js';
import { detectSystemLocale, normalizeLocale } from './detector.js';
import { interpolate } from './formatter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** 默认配置 */
const DEFAULT_CONFIG: Required<I18nConfig> = {
  defaultLocale: 'zh-CN',
  fallbackLocale: 'en',
  localeDir: join(__dirname, '..', 'locales'),
  onMissingKey: (key) => key,
};

/**
 * i18n 引擎类
 * 
 * 提供完整的国际化能力:
 * - 多语言翻译资源管理
 * - 嵌套键值解析
 * - 模板变量插值
 * - 语言环境切换
 */
export class I18nEngine {
  private config: Required<I18nConfig>;
  private locales: LocaleMap = {};
  private currentLocale: SupportedLocale;

  constructor(config: I18nConfig = {}) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
      defaultLocale: config.defaultLocale ?? this.detectDefaultLocale(),
    };

    this.currentLocale = this.config.defaultLocale;
    
    // 加载所有可用的翻译资源
    this.loadLocales();
  }

  /**
   * 检测默认语言环境
   */
  private detectDefaultLocale(): SupportedLocale {
    const result = detectSystemLocale();
    return result.locale;
  }

  /**
   * 加载所有可用的语言包
   * 从 localeDir 目录读取 JSON 翻译文件
   */
  private loadLocales(): void {
    const supportedLocales: SupportedLocale[] = ['en', 'zh-CN'];

    for (const locale of supportedLocales) {
      const filePath = join(this.config.localeDir, `${locale}.json`);

      if (existsSync(filePath)) {
        try {
          const content = readFileSync(filePath, 'utf-8');
          const parsed = JSON.parse(content);
          
          if (this.isValidTranslationData(parsed)) {
            this.locales[locale] = parsed;
            console.debug(`[i18n] ✓ Loaded locale "${locale}"`);
          }
        } catch (error) {
          console.error(`[i18n] ✗ Failed to load locale "${locale}":`, error);
        }
      } else {
        console.warn(`[i18n] ⚠ Locale file not found: ${filePath}`);
      }
    }

    console.log(
      `[i18n] Available locales: [${Object.keys(this.locales).join(', ')}]`
    );
  }

  /**
   * 验证翻译数据结构是否有效
   */
  private isValidTranslationData(data: unknown): data is TranslationRecord {
    return (
      typeof data === 'object' &&
      data !== null &&
      !Array.isArray(data)
    );
  }

  /**
   * 获取翻译文本
   *
   * @param key 翻译键 (支持嵌套: "chat.placeholder")
   * @param params 模板变量 (可选)
   * @returns 翻译后的字符串
   *
   * @example
   * ```typescript
   * i18n.t('common.success')
   * // => "✅ 操作成功"
   *
   * i18n.t('gateway.started', { port: 18789 })
   * // => "✅ Gateway 启动成功 http://127.0.0.1:18789"
   * ```
   */
  t(key: string, params?: TranslateParams): string {
    let value = this.resolveKey(key, this.currentLocale);

    // 如果当前语言找不到，尝试 fallback 语言
    if (value === undefined && this.currentLocale !== this.config.fallbackLocale) {
      value = this.resolveKey(key, this.config.fallbackLocale);
    }

    // 处理未找到的情况
    if (value === undefined || typeof value !== 'string') {
      return this.config.onMissingKey(key, this.currentLocale);
    }

    // 应用模板变量插值
    return interpolate(value, params);
  }

  /**
   * 解析嵌套的翻译键
   * 
   * 支持 "a.b.c" 形式的嵌套访问
   */
  private resolveKey(key: string, locale: SupportedLocale): TranslationData | undefined {
    const keys = key.split('.');
    let current: TranslationData | undefined = this.locales[locale];

    for (const k of keys) {
      if (
        current === undefined ||
        typeof current !== 'object' ||
        Array.isArray(current)
      ) {
        return undefined;
      }

      current = (current as TranslationRecord)[k];
    }

    return current;
  }

  /**
   * 切换当前语言环境
   *
   * @param locale 目标语言代码
   * @throws 当语言不支持时抛出错误
   */
  setLocale(locale: string | SupportedLocale): void {
    const normalized = normalizeLocale(locale);

    if (!normalized) {
      const available = this.getAvailableLocales().join(', ');
      throw new Error(
        `[i18n] Unsupported locale "${locale}". Available: [${available}]`
      );
    }

    if (!this.locales[normalized]) {
      console.warn(
        `[i18n] Locale "${normalized}" not loaded. Falling back to "${this.config.fallbackLocale}".`
      );
      this.currentLocale = this.config.fallbackLocale;
      return;
    }

    this.currentLocale = normalized;
    console.log(`[i18n] Locale switched to: "${normalized}"`);
  }

  /**
   * 获取当前语言环境
   */
  getLocale(): SupportedLocale {
    return this.currentLocale;
  }

  /**
   * 获取所有已加载的语言列表
   */
  getAvailableLocales(): SupportedLocale[] {
    return Object.keys(this.locales) as SupportedLocale[];
  }

  /**
   * 检查指定语言的翻译是否存在
   */
  hasLocale(locale: SupportedLocale): boolean {
    return locale in this.locales;
  }

  /**
   * 检查指定翻译键是否存在
   */
  hasKey(key: string, locale?: SupportedLocale): boolean {
    const targetLocale = locale ?? this.currentLocale;
    return this.resolveKey(key, targetLocale) !== undefined;
  }

  /**
   * 获取原始翻译数据 (用于调试)
   */
  getRawTranslations(locale?: SupportedLocale): TranslationRecord | null {
    const targetLocale = locale ?? this.currentLocale;
    return this.locales[targetLocale] ?? null;
  }

  /**
   * 重置引擎状态 (主要用于测试)
   */
  reset(): void {
    this.locales = {};
    this.currentLocale = this.config.defaultLocale;
  }
}

// ==================== 单例实例管理 ====================

let engineInstance: I18nEngine | null = null;

/**
 * 获取或创建 i18n 引擎单例
 *
 * @param config 可选配置 (仅在首次调用时生效)
 * @returns I18nEngine 实例
 */
export function getI18n(config?: I18nConfig): I18nEngine {
  if (!engineInstance) {
    engineInstance = new I18nEngine(config);
  }
  return engineInstance;
}

/**
 * 销毁单例实例 (用于测试或重新初始化)
 */
export function destroyI18n(): void {
  engineInstance = null;
}

// ==================== 全局便捷函数 ====================

/**
 * 全局翻译函数
 *
 * @param key 翻译键
 * @param params 模板变量
 * @returns 翻译后的字符串
 *
 * @example
 * ```typescript
 * import { t } from '../i18n/core';
 *
 * t('common.success'); // "✅ 操作成功"
 * t('error.portInUse', { port: 18789 }); // "端口 18789 已被占用..."
 * ```
 */
export function t(key: string, params?: TranslateParams): string {
  return getI18n().t(key, params);
}

/**
 * 切换全局语言环境
 */
export function setLocale(locale: string | SupportedLocale): void {
  getI18n().setLocale(locale);
}

/**
 * 获取当前全局语言环境
 */
export function getLocale(): SupportedLocale {
  return getI18n().getLocale();
}
