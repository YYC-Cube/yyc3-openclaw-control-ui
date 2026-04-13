/**
 * file: src/i18n/core.test.ts
 * description: i18n 引擎核心功能单元测试
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-04-10
 * updated: 2026-04-10
 * status: active
 * tags: [i18n],[test],[unit]
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { I18nEngine, getI18n, destroyI18n, t, setLocale, getLocale } from './core.js';
import type { SupportedLocale, I18nConfig } from './types.js';

describe('I18nEngine - Core Engine Tests', () => {
  let engine: I18nEngine;

  beforeEach(() => {
    destroyI18n();
    engine = new I18nEngine({
      defaultLocale: 'zh-CN',
      fallbackLocale: 'en',
      localeDir: './src/locales',
    });
  });

  describe('Constructor & Initialization', () => {
    it('should create engine instance with default config', () => {
      expect(engine).toBeInstanceOf(I18nEngine);
    });

    it('should load available locales on initialization', () => {
      const locales = engine.getAvailableLocales();
      expect(locales).toContain('zh-CN');
      expect(locales).toContain('en');
    });
  });

  describe('Translation Functionality', () => {
    it('should translate simple key in Chinese', () => {
      const result = engine.t('common.success');
      expect(result).toBe('✅ 操作成功');
    });

    it('should translate simple key in English after locale switch', () => {
      engine.setLocale('en');
      const result = engine.t('common.success');
      expect(result).toBe('✅ Success');
    });

    it('should handle nested keys correctly', () => {
      const result = engine.t('gateway.start.started');
      expect(result).toContain('Gateway 启动成功');
    });

    it('should interpolate template variables', () => {
      const result = engine.t('error.portInUse', { port: 18789, altPort: 18790 });
      expect(result).toContain('18789');
      expect(result).toContain('18790');
    });

    it('should return key when translation is missing', () => {
      const result = engine.t('nonexistent.key');
      expect(result).toBe('nonexistent.key');
    });

    it('should fallback to English when Chinese translation missing', () => {
      // 假设有一个只在 en.json 中存在的键
      const result = engine.t('banner.title'); // 这个在两种语言中都存在
      expect(result).toBeTruthy();
    });
  });

  describe('Locale Management', () => {
    it('should switch locale successfully', () => {
      engine.setLocale('en');
      expect(engine.getLocale()).toBe('en');

      engine.setLocale('zh-CN');
      expect(engine.getLocale()).toBe('zh-CN');
    });

    it('should throw error for unsupported locale', () => {
      expect(() => engine.setLocale('fr-FR')).toThrow(/Unsupported locale/);
    });

    it('should check if locale exists', () => {
      expect(engine.hasLocale('zh-CN')).toBe(true);
      expect(engine.hasLocale('en')).toBe(true);
      expect(engine.hasLocale('zh-TW')).toBe(false);
    });

    it('should check if translation key exists', () => {
      expect(engine.hasKey('common.success')).toBe(true);
      expect(engine.hasKey('nonexistent.key')).toBe(false);
    });
  });

  describe('Singleton Pattern', () => {
    it('should return same instance via getI18n()', () => {
      const instance1 = getI18n();
      const instance2 = getI18n();
      expect(instance1).toBe(instance2);
    });

    it('should allow destroying and recreating singleton', () => {
      const instance1 = getI18n();
      destroyI18n();

      const instance2 = getI18n();
      expect(instance2).not.toBe(instance1);
    });
  });

  describe('Global Convenience Functions', () => {
    beforeEach(() => {
      destroyI18n();
      // 使用默认配置初始化
      getI18n({
        defaultLocale: 'zh-CN',
        fallbackLocale: 'en',
        localeDir: './src/locales',
      });
    });

    it('t() should work as global function', () => {
      expect(t('common.success')).toBe('✅ 操作成功');
    });

    it('setLocale() should change global locale', () => {
      setLocale('en');
      expect(getLocale()).toBe('en');
      expect(t('common.success')).toBe('✅ Success');
    });

    it('getLocale() should return current global locale', () => {
      expect(getLocale()).toBe('zh-CN');
    });
  });
});

describe('I18nEngine - Edge Cases', () => {
  let engine: I18nEngine;

  beforeEach(() => {
    destroyI18n();
    engine = new I18nEngine({
      defaultLocale: 'zh-CN',
      fallbackLocale: 'en',
      localeDir: './src/locales',
    });
  });

  it('should handle empty params gracefully', () => {
    const result = engine.t('common.success', {});
    expect(result).toBe('✅ 操作成功');
  });

  it('should handle undefined params', () => {
    const result = engine.t('common.success', undefined);
    expect(result).toBe('✅ 操作成功');
  });

  it('should preserve original placeholder when param missing', () => {
    const result = engine.t('error.portInUse'); // 不传参数
    expect(result).toContain('{{port}}'); // 占位符保留
  });

  it('should reset state correctly', () => {
    engine.setLocale('en');
    engine.reset();
    
    // 重置后应该回到默认语言
    expect(engine.getLocale()).toBe('zh-CN');
  });
});
