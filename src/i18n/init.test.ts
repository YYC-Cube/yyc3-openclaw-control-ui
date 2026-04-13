/**
 * file: src/i18n/init.test.ts
 * description: i18n 初始化模块单元测试 · 验证 --language 参数和自动初始化
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-04-10
 * updated: 2026-04-10
 * status: active
 * tags: [i18n],[test],[init]
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { initI18n, parseLanguageArg, isI18nInitialized, resetInitState } from './init.js';
import { getLocale, destroyI18n } from './core.js';

describe('i18n Initialization Module Tests', () => {
  beforeEach(() => {
    resetInitState();
  });

  afterEach(() => {
    resetInitState();
  });

  describe('parseLanguageArg()', () => {
    it('should parse --language <value> format', () => {
      const result = parseLanguageArg(['node', 'script.js', '--language', 'en']);
      expect(result).toBe('en');
    });

    it('should parse -l <value> format', () => {
      const result = parseLanguageArg(['node', 'script.js', '-l', 'zh-CN']);
      expect(result).toBe('zh-CN');
    });

    it('should parse --language=<value> format', () => {
      const result = parseLanguageArg(['node', 'script.js', '--language=zh-TW']);
      expect(result).toBe('zh-TW');
    });

    it('should parse -l<value> format (no space)', () => {
      const result = parseLanguageArg(['node', 'script.js', '-len']);
      expect(result).toBe('en');
    });

    it('should return null when no language argument present', () => {
      const result = parseLanguageArg(['node', 'script.js', 'start']);
      expect(result).toBeNull();
    });

    it('should handle empty argv gracefully', () => {
      const result = parseLanguageArg([]);
      expect(result).toBeNull();
    });
  });

  describe('initI18n()', () => {
    it('should initialize i18n and return locale', () => {
      const locale = initI18n();
      
      expect(locale).toBeTruthy();
      expect(typeof locale).toBe('string');
      expect(isI18nInitialized()).toBe(true);
    });

    it('should use explicit locale when provided', () => {
      const locale = initI18n({ locale: 'en' });
      
      expect(locale).toBe('en');
      expect(getLocale()).toBe('en');
    });

    it('should detect system locale when no explicit locale', () => {
      // Mock process.argv to avoid interference
      const originalArgv = process.argv;
      process.argv = ['node', 'test'];
      
      try {
        const locale = initI18n();
        
        // Should detect either zh-CN or en based on environment
        expect(['zh-CN', 'en']).toContain(locale);
      } finally {
        process.argv = originalArgv;
      }
    });

    it('should not reinitialize by default', () => {
      initI18n({ locale: 'en' });
      const firstCall = getLocale();
      
      // Try to initialize again (should be ignored)
      initI18n({ locale: 'zh-CN' });
      const secondCall = getLocale();
      
      // Should still be the first locale
      expect(secondCall).toBe(firstCall);
    });

    it('should allow reinitialization when allowReinit is true', () => {
      initI18n({ locale: 'en' });
      expect(getLocale()).toBe('en');

      // Reinitialize with different locale
      const newLocale = initI18n({ locale: 'zh-CN', allowReinit: true });
      
      expect(newLocale).toBe('zh-CN');
      expect(getLocale()).toBe('zh-CN');
    });
  });

  describe('isI18nInitialized()', () => {
    it('should return false before initialization', () => {
      expect(isI18nInitialized()).toBe(false);
    });

    it('should return true after initialization', () => {
      initI18n();
      expect(isI18nInitialized()).toBe(true);
    });
  });

  describe('resetInitState()', () => {
    it('should reset initialization state', () => {
      initI18n();
      expect(isI18nInitialized()).toBe(true);

      resetInitState();
      expect(isI18nInitialized()).toBe(false);
    });

    it('should allow fresh initialization after reset', () => {
      initI18n({ locale: 'en' });
      resetInitState();

      const newLocale = initI18n({ locale: 'zh-CN' });
      expect(newLocale).toBe('zh-CN');
    });
  });
});
