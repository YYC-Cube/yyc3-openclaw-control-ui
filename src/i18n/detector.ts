/**
 * file: src/i18n/detector.ts
 * description: 语言环境自动检测器 · 支持多源检测策略
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-04-10
 * updated: 2026-04-10
 * status: active
 * tags: [i18n],[detector],[locale]
 */

import type { SupportedLocale, LocaleDetectionResult } from './types.js';

const LOCALE_ALIASES: Record<string, SupportedLocale> = {
  // 中文变体
  'zh': 'zh-CN',
  'zh-cn': 'zh-CN',
  'zh_cn': 'zh-CN',
  'zh-hans': 'zh-CN',
  'zh-hans-cn': 'zh-CN',
  'zh-tw': 'zh-TW',
  'zh_hk': 'zh-TW',
  'zh-hant': 'zh-TW',
  // 英文
  'en': 'en',
  'en-us': 'en',
  'en_gb': 'en',
};

/**
 * 自动检测系统语言环境
 * 
 * 检测优先级:
 * 1. 环境变量显式设置 (LANGUAGE, LANG, LC_ALL)
 * 2. OpenClaw 配置文件中的语言设置
 * 3. 操作系统/运行时默认 locale
 * 4. 默认返回中文 (中国市场优先)
 */
export function detectSystemLocale(): LocaleDetectionResult {
  const envResult = detectFromEnvironment();
  if (envResult && envResult.confidence > 0.8) {
    return envResult;
  }

  const systemResult = detectFromSystem();
  if (systemResult) {
    return systemResult;
  }

  return {
    locale: 'zh-CN',
    source: 'default',
    confidence: 0.5,
  };
}

/**
 * 从环境变量检测语言设置
 */
function detectFromEnvironment(): LocaleDetectionResult | null {
  const envVars = [
    process.env.LANGUAGE,
    process.env.LANG,
    process.env.LC_ALL,
    process.env.LC_MESSAGES,
  ].filter(Boolean);

  for (const envVar of envVars) {
    const normalized = normalizeLocale(envVar!);
    if (normalized) {
      return {
        locale: normalized,
        source: 'env',
        confidence: 0.95,
      };
    }
  }

  return null;
}

/**
 * 从系统运行时检测语言
 */
function detectFromSystem(): LocaleDetectionResult | null {
  try {
    if (typeof Intl !== 'undefined') {
      const languages = Intl.getCanonicalLocales?.(navigator?.languages || []) ?? [];
      
      for (const lang of languages) {
        const normalized = normalizeLocale(lang);
        if (normalized) {
          return {
            locale: normalized,
            source: 'system',
            confidence: 0.85,
          };
        }
      }
    }
  } catch {
    // Intl API 不可用，忽略错误
  }

  return null;
}

/**
 * 规范化语言代码到标准格式
 */
export function normalizeLocale(locale: string): SupportedLocale | null {
  const lower = locale.toLowerCase().trim();
  
  // 直接匹配
  if (lower in LOCALE_ALIASES) {
    return LOCALE_ALIASES[lower];
  }

  // 处理带编码后缀的情况 (如 zh_CN.UTF-8)
  const withoutEncoding = lower.split('.')[0].replace('-', '_');
  if (withoutEncoding in LOCALE_ALIASES) {
    return LOCALE_ALIASES[withoutEncoding];
  }

  // 提取主要语言部分
  const primaryLang = lower.split(/[-_]/)[0];
  if (primaryLang === 'zh') {
    return 'zh-CN'; // 中文默认简体
  }
  if (primaryLang === 'en') {
    return 'en';
  }

  return null;
}

/**
 * 判断是否为中文语言环境
 */
export function isChineseLocale(locale: SupportedLocale): boolean {
  return locale.startsWith('zh');
}
