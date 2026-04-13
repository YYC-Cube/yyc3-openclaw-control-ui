/**
 * file: src/i18n/cli-error.test.ts
 * description: CliError 单元测试 · 验证错误处理和本地化功能
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-04-10
 * updated: 2026-04-10
 * status: active
 * tags: [i18n],[test],[error]
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { CliError, CliErrorCode, createError } from './cli-error.js';
import { destroyI18n, getI18n } from './core.js';

describe('CliError - Error Handling Tests', () => {
  beforeEach(() => {
    destroyI18n();
    // 初始化 i18n 引擎用于测试
    getI18n({
      defaultLocale: 'zh-CN',
      fallbackLocale: 'en',
      localeDir: './src/locales',
    });
  });

  describe('Constructor & Basic Properties', () => {
    it('should create error with code', () => {
      const error = new CliError({ code: CliErrorCode.GATEWAY_PORT_IN_USE });
      
      expect(error).toBeInstanceOf(CliError);
      expect(error).toBeInstanceOf(Error);
      expect(error.code).toBe(CliErrorCode.GATEWAY_PORT_IN_USE);
      expect(error.name).toBe('CliError');
    });

    it('should set default severity to error', () => {
      const error = new CliError({ code: CliErrorCode.UNKNOWN_ERROR });
      expect(error.severity).toBe('error');
    });

    it('should set custom severity', () => {
      const error = new CliError({
        code: CliErrorCode.UNKNOWN_ERROR,
        severity: 'warning',
      });
      expect(error.severity).toBe('warning');
    });

    it('should set default exit code to 1', () => {
      const error = new CliError({ code: CliErrorCode.UNKNOWN_ERROR });
      expect(error.exitCode).toBe(1);
    });
  });

  describe('Message Translation', () => {
    it('should translate error message using i18n', () => {
      const error = new CliError({
        code: CliErrorCode.GATEWAY_PORT_IN_USE,
        params: { port: 18789 },
      });

      // 中文环境应该包含中文翻译
      expect(error.message).toContain('18789');
    });

    it('should support custom message key', () => {
      const error = new CliError({
        message: 'common.success',
      });

      expect(error.message).toBe('✅ 操作成功');
    });

    it('should interpolate template variables', () => {
      const error = createError(CliErrorCode.GATEWAY_PORT_IN_USE, {
        port: 8080,
        altPort: 8081,
      });

      expect(error.message).toContain('8080');
      expect(error.message).toContain('8081');
    });
  });

  describe('Suggestions System', () => {
    it('should have default suggestions for known error codes', () => {
      const error = new CliError({ code: CliErrorCode.GATEWAY_PORT_IN_USE });
      
      expect(error.suggestions.length).toBeGreaterThan(0);
      expect(error.suggestions[0].text).toBeTruthy();
    });

    it('should allow custom suggestions', () => {
      const customSuggestion = [
        { text: 'Custom suggestion 1', command: 'custom-command' },
        { text: 'Custom suggestion 2' },
      ];

      const error = new CliError({
        code: CliErrorCode.UNKNOWN_ERROR,
        suggestions: customSuggestion,
      });

      expect(error.suggestions).toEqual(customSuggestion);
    });
  });

  describe('format() Method', () => {
    it('should format error with icon and message', () => {
      const error = new CliError({ code: CliErrorCode.UNKNOWN_ERROR });
      const formatted = error.format();

      expect(formatted).toContain('❌');
      expect(formatted).toContain(error.message);
    });

    it('should include suggestions in formatted output', () => {
      const error = new CliError({ code: CliErrorCode.GATEWAY_PORT_IN_USE });
      const formatted = error.format();

      expect(formatted).toContain('💡');
      expect(formatted).toContain('解决建议');
    });

    it('should use warning icon for warning severity', () => {
      const error = new CliError({
        code: CliErrorCode.UNKNOWN_ERROR,
        severity: 'warning',
      });
      const formatted = error.format();

      expect(formatted).toContain('⚠️');
    });
  });

  describe('toJSON() Method', () => {
    it('should serialize error to JSON object', () => {
      const error = new CliError({
        code: CliErrorCode.GATEWAY_PORT_IN_USE,
        params: { port: 18789 },
      });

      const json = error.toJSON();

      expect(json).toHaveProperty('name', 'CliError');
      expect(json).toHaveProperty('code', CliErrorCode.GATEWAY_PORT_IN_USE);
      expect(json).toHaveProperty('message');
      expect(json).toHaveProperty('severity');
      expect(json).toHaveProperty('suggestions');
      expect(json).toHaveProperty('exitCode');
    });
  });

  describe('is() Method', () => {
    it('should return true for matching error code', () => {
      const error = new CliError({ code: CliErrorCode.GATEWAY_PORT_IN_USE });
      
      expect(error.is(CliErrorCode.GATEWAY_PORT_IN_USE)).toBe(true);
      expect(error.is(CliErrorCode.CHANNEL_CONNECT_FAILED)).toBe(false);
    });
  });

  describe('createError() Convenience Function', () => {
    it('should create error using error code', () => {
      const error = createError(CliErrorCode.AUTH_MISSING_API_KEY);
      
      expect(error).toBeInstanceOf(CliError);
      expect(error.code).toBe(CliErrorCode.AUTH_MISSING_API_KEY);
    });

    it('should create error using custom message string', () => {
      const error = createError('error.portInUse', { port: 8080 });
      
      expect(error).toBeInstanceOf(CliError);
      expect(error.message).toContain('8080');
    });

    it('should accept additional options', () => {
      const error = createError(
        CliErrorCode.UNKNOWN_ERROR,
        {},
        { exitCode: 42, severity: 'info' }
      );

      expect(error.exitCode).toBe(42);
      expect(error.severity).toBe('info');
    });
  });
});

describe('CliErrorCode - Enum Coverage', () => {
  it('should have all expected error codes', () => {
    // Gateway errors
    expect(CliErrorCode.GATEWAY_PORT_IN_USE).toBeDefined();
    expect(CliErrorCode.GATEWAY_START_FAILED).toBeDefined();
    expect(CliErrorCode.GATEWAY_STOP_FAILED).toBeDefined();
    expect(CliErrorCode.GATEWAY_NOT_RUNNING).toBeDefined();
    expect(CliErrorCode.GATEWAY_RESTART_FAILED).toBeDefined();

    // Channel errors
    expect(CliErrorCode.CHANNEL_CONNECT_FAILED).toBeDefined();
    expect(CliErrorCode.CHANNEL_DISCONNECT_FAILED).toBeDefined();
    expect(CliErrorCode.CHANNEL_CONFIG_INVALID).toBeDefined();
    expect(CliErrorCode.CHANNEL_QR_TIMEOUT).toBeDefined();

    // Auth errors
    expect(CliErrorCode.AUTH_TOKEN_EXPIRED).toBeDefined();
    expect(CliErrorCode.AUTH_INVALID_CREDENTIALS).toBeDefined();
    expect(CliErrorCode.AUTH_MISSING_API_KEY).toBeDefined();

    // Network errors
    expect(CliErrorCode.NETWORK_CONNECTION_REFUSED).toBeDefined();
    expect(CliErrorCode.NETWORK_TIMEOUT).toBeDefined();
    expect(CliErrorCode.NETWORK_DNS_FAILURE).toBeDefined();

    // File system errors
    expect(CliErrorCode.FILE_NOT_FOUND).toBeDefined();
    expect(CliErrorCode.FILE_PERMISSION_DENIED).toBeDefined();
    expect(CliErrorCode.FILE_READ_ERROR).toBeDefined();
    expect(CliErrorCode.FILE_WRITE_ERROR).toBeDefined();

    // Input errors
    expect(CliErrorCode.INPUT_REQUIRED).toBeDefined();
    expect(CliErrorCode.INPUT_INVALID_FORMAT).toBeDefined();
    expect(CliErrorCode.INPUT_OUT_OF_RANGE).toBeDefined();

    // System errors
    expect(CliErrorCode.SYSTEM_UNSUPPORTED_PLATFORM).toBeDefined();
    expect(CliErrorCode.SYSTEM_INSUFFICIENT_PERMISSIONS).toBeDefined();
    expect(CliErrorCode.SYSTEM_MEMORY_LOW).toBeDefined();

    // Generic
    expect(CliErrorCode.UNKNOWN_ERROR).toBeDefined();
  });
});
