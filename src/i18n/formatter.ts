/**
 * file: src/i18n/formatter.ts
 * description: 翻译文本格式化工具 · 支持模板变量插值和复数形式
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-04-10
 * updated: 2026-04-10
 * status: active
 * tags: [i18n],[formatter],[interpolation]
 */

import type { TranslateParams } from './types.js';

/**
 * 模板变量插值
 * 
 * 支持 {{variable}} 格式的占位符替换
 * 
 * @example
 * ```typescript
 * interpolate('Hello {{name}}, you have {{count}} messages', { name: 'World', count: 5 })
 * // => "Hello World, you have 5 messages"
 * ```
 */
export function interpolate(template: string, params?: TranslateParams): string {
  if (!params || Object.keys(params).length === 0) {
    return template;
  }

  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const value = params[key];
    
    if (value === undefined || value === null) {
      return match; // 保留原始占位符
    }
    
    return String(value);
  });
}

/**
 * 复数形式处理
 * 
 * 根据数量选择正确的复数形式
 * 
 * @example
 * ```typescript
 * pluralize('{{count}} message(s)', 1)
 * // => "1 message"
 * 
 * pluralize('{{count}} message(s)', 5)
 * // => "5 messages"
 * ```
 */
export function pluralize(template: string, count: number): string {
  // 简单实现: 替换 (s) 为 s 或空
  return template.replace(/\(s\)/g, count === 1 ? '' : 's').replace(/\{\{count\}\}/g, String(count));
}

/**
 * 格式化相对时间
 * 
 * @param timestamp 时间戳 (毫秒)
 * @param locale 当前语言环境
 * @returns 格式化的相对时间字符串
 */
export function formatRelativeTime(timestamp: number, locale: string): string {
  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (locale.startsWith('zh')) {
    if (seconds < 60) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return new Date(timestamp).toLocaleDateString('zh-CN');
  } else {
    if (seconds < 60) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString('en-US');
  }
}
