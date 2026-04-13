/**
 * file: src/i18n/init.ts
 * description: i18n 初始化模块 · 处理 --language 参数和自动初始化
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-04-10
 * updated: 2026-04-10
 * status: active
 * tags: [i18n],[init],[cli]
 *
 * features:
 * - 解析 --language / -l 命令行参数
 * - Gateway 启动时自动初始化 i18n
 * - 支持环境变量 LANGUAGE 配置
 * - 单例模式防止重复初始化
 */

import { getI18n, setLocale, getLocale, destroyI18n } from './core.js';
import { normalizeLocale, detectSystemLocale } from './detector.js';
import type { SupportedLocale, I18nConfig } from './types.js';

/** 初始化状态 */
let initialized = false;

/**
 * 从命令行参数中解析语言设置
 *
 * 支持的格式:
 * - `--language zh-CN`
 * - `-l en`
 * - `--language=en`
 *
 * @param argv 命令行参数数组 (默认 process.argv)
 * @returns 解析出的语言代码，如果未指定则返回 null
 */
export function parseLanguageArg(argv?: string[]): string | null {
  const args = argv ?? process.argv;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    // 匹配 --language <value> 或 -l <value>
    if ((arg === '--language' || arg === '-l') && i + 1 < args.length) {
      return args[i + 1];
    }

    // 匹配 --language=<value>
    if (arg.startsWith('--language=')) {
      return arg.split('=')[1];
    }

    // 匹配 -l<value> (无空格)
    if (arg.startsWith('-l') && arg.length > 2) {
      return arg.slice(2);
    }
  }

  return null;
}

/**
 * 初始化 i18n 系统
 *
 * 调用优先级:
 * 1. 显式传入的 locale 参数
 * 2. 命令行 --language 参数
 * 3. 环境变量 LANGUAGE/LANG
 * 4. 系统自动检测
 * 5. 默认值 (zh-CN)
 *
 * @param options 可选配置
 * @returns 实际使用的语言环境
 */
export function initI18n(options?: {
  /** 强制指定的语言 */
  locale?: string;
  /** 自定义配置 */
  config?: I18nConfig;
  /** 是否允许重复初始化 (默认 false) */
  allowReinit?: boolean;
}): SupportedLocale {
  // 防止重复初始化
  if (initialized && !options?.allowReinit) {
    return getLocale();
  }

  // 解析语言设置的优先级链
  let targetLocale: string | null = options?.locale ?? null;

  // 如果没有显式指定，尝试从命令行参数获取
  if (!targetLocale) {
    targetLocale = parseLanguageArg();
  }

  // 如果还是没有，使用系统检测
  if (!targetLocale) {
    const detection = detectSystemLocale();
    targetLocale = detection.locale;
  }

  // 规范化语言代码
  const normalized = normalizeLocale(targetLocale);

  if (!normalized) {
    console.warn(
      `[i18n] ⚠ Unsupported language "${targetLocale}", falling back to default (zh-CN)`
    );
    targetLocale = 'zh-CN';
  } else {
    targetLocale = normalized;
  }

  // 销毁旧实例并创建新的（如果需要）
  if (initialized && options?.allowReinit) {
    destroyI18n();
    initialized = false;
  }

  // 创建或获取引擎实例
  const engine = getI18n({
    ...options?.config,
    defaultLocale: targetLocale as SupportedLocale,
  });

  // 设置语言
  engine.setLocale(targetLocale as SupportedLocale);

  initialized = true;

  const finalLocale = getLocale();
  console.debug(`[i18n] ✓ Initialized with locale: "${finalLocale}"`);

  return finalLocale;
}

/**
 * 检查 i18n 是否已初始化
 */
export function isI18nInitialized(): boolean {
  return initialized;
}

/**
 * 重置初始化状态 (主要用于测试)
 */
export function resetInitState(): void {
  initialized = false;
  destroyI18n();
}
