
import type { Locale } from "./types.js";

export interface TranslateParams {
  [key: string]: unknown;
}

export function interpolate(template: string, params?: TranslateParams): string {
  if (!params || Object.keys(params).length === 0) {
    return template;
  }

  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const value = params[key];

    if (value === undefined || value === null) {
      return match;
    }

    return String(value);
  });
}

export function pluralize(template: string, count: number): string {
  return template
    .replace(/\(s\)/g, count === 1 ? "" : "s")
    .replace(/\{\{count\}\}/g, String(count));
}

export function formatRelativeTime(timestamp: number, locale: string): string {
  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (locale.startsWith("zh")) {
    if (seconds < 60) return "刚刚";
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return new Date(timestamp).toLocaleDateString("zh-CN");
  } else {
    if (seconds < 60) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString("en-US");
  }
}
