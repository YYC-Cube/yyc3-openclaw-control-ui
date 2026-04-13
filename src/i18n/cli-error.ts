/**
 * file: src/i18n/cli-error.ts
 * description: CLI 错误类 · 提供结构化的错误处理和本地化错误消息
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-04-10
 * updated: 2026-04-10
 * status: active
 * tags: [i18n],[error],[cli]
 *
 * features:
 * - 结构化错误信息 (code, message, suggestion)
 * - 自动 i18n 翻译
 * - 友好的解决建议
 * - 支持嵌套原始错误
 */

import { t } from './core.js';

/** CLI 错误代码枚举 */
export enum CliErrorCode {
  // Gateway 相关错误
  GATEWAY_PORT_IN_USE = 'GATEWAY_PORT_IN_USE',
  GATEWAY_START_FAILED = 'GATEWAY_START_FAILED',
  GATEWAY_STOP_FAILED = 'GATEWAY_STOP_FAILED',
  GATEWAY_NOT_RUNNING = 'GATEWAY_NOT_RUNNING',
  GATEWAY_RESTART_FAILED = 'GATEWAY_RESTART_FAILED',

  // 渠道相关错误
  CHANNEL_CONNECT_FAILED = 'CHANNEL_CONNECT_FAILED',
  CHANNEL_DISCONNECT_FAILED = 'CHANNEL_DISCONNECT_FAILED',
  CHANNEL_CONFIG_INVALID = 'CHANNEL_CONFIG_INVALID',
  CHANNEL_QR_TIMEOUT = 'CHANNEL_QR_TIMEOUT',

  // 配置相关错误
  CONFIG_INVALID = 'CONFIG_INVALID',
  CONFIG_NOT_FOUND = 'CONFIG_NOT_FOUND',
  CONFIG_PARSE_ERROR = 'CONFIG_PARSE_ERROR',

  // 认证相关错误
  AUTH_TOKEN_EXPIRED = 'AUTH_TOKEN_EXPIRED',
  AUTH_INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS',
  AUTH_MISSING_API_KEY = 'AUTH_MISSING_API_KEY',

  // 网络相关错误
  NETWORK_CONNECTION_REFUSED = 'NETWORK_CONNECTION_REFUSED',
  NETWORK_TIMEOUT = 'NETWORK_TIMEOUT',
  NETWORK_DNS_FAILURE = 'NETWORK_DNS_FAILURE',

  // 文件系统错误
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',
  FILE_PERMISSION_DENIED = 'FILE_PERMISSION_DENIED',
  FILE_READ_ERROR = 'FILE_READ_ERROR',
  FILE_WRITE_ERROR = 'FILE_WRITE_ERROR',

  // 用户输入错误
  INPUT_REQUIRED = 'INPUT_REQUIRED',
  INPUT_INVALID_FORMAT = 'INPUT_INVALID_FORMAT',
  INPUT_OUT_OF_RANGE = 'INPUT_OUT_OF_RANGE',

  // 系统级错误
  SYSTEM_UNSUPPORTED_PLATFORM = 'SYSTEM_UNSUPPORTED_PLATFORM',
  SYSTEM_INSUFFICIENT_PERMISSIONS = 'SYSTEM_INSUFFICIENT_PERMISSIONS',
  SYSTEM_MEMORY_LOW = 'SYSTEM_MEMORY_LOW',

  // 通用错误
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/** 错误严重级别 */
export type ErrorSeverity = 'error' | 'warning' | 'info';

/** 错误建议配置 */
export interface ErrorSuggestion {
  /** 建议文本 */
  text: string;
  /** 是否可执行命令 */
  command?: string;
}

/** CliError 配置选项 */
export interface CliErrorOptions {
  /** 错误代码 */
  code?: CliErrorCode;
  /** 错误消息 (支持 i18n key) */
  message?: string;
  /** 模板变量 */
  params?: Record<string, unknown>;
  /** 解决建议 */
  suggestions?: ErrorSuggestion[];
  /** 严重级别 */
  severity?: ErrorSeverity;
  /** 原始错误对象 */
  cause?: Error | unknown;
  /** 退出码 */
  exitCode?: number;
}

/** 错误代码到 i18n 翻译键的映射 */
const ERROR_CODE_TO_I18N_KEY: Partial<Record<CliErrorCode, string>> = {
  [CliErrorCode.GATEWAY_PORT_IN_USE]: 'error.portInUse',
  [CliErrorCode.GATEWAY_START_FAILED]: 'gateway.start.started',
  [CliErrorCode.GATEWAY_STOP_FAILED]: 'gateway.stopped',
  [CliErrorCode.GATEWAY_NOT_RUNNING]: 'gateway.status.stopped',
  [CliErrorCode.GATEWAY_RESTART_FAILED]: 'gateway.restart.restarted',
  [CliErrorCode.CHANNEL_CONNECT_FAILED]: 'channel.error',
  [CliErrorCode.CHANNEL_DISCONNECT_FAILED]: 'channel.disconnected',
  [CliErrorCode.CHANNEL_CONFIG_INVALID]: 'error.invalidConfig',
  [CliErrorCode.CONFIG_INVALID]: 'error.invalidConfig',
  [CliErrorCode.AUTH_MISSING_API_KEY]: 'auth.missingApiKey',
  [CliErrorCode.NETWORK_CONNECTION_REFUSED]: 'error.network',
};

/**
 * CLI 错误类
 *
 * 提供结构化的错误处理能力，支持：
 * - 自动 i18n 翻译
 * - 多条解决建议
 * - 错误链追踪
 *
 * @example
 * ```typescript
 * throw new CliError({
 *   code: CliErrorCode.GATEWAY_PORT_IN_USE,
 *   params: { port: 18789, altPort: 18790 },
 * });
 * ```
 */
export class CliError extends Error {
  /** 错误代码 */
  public readonly code: CliErrorCode;
  /** 严重级别 */
  public readonly severity: ErrorSeverity;
  /** 解决建议列表 */
  public readonly suggestions: ErrorSuggestion[];
  /** 退出码 */
  public readonly exitCode: number;
  /** 原始错误 */
  public readonly cause?: Error;

  constructor(options: CliErrorOptions) {
    const code = options.code ?? CliErrorCode.UNKNOWN_ERROR;
    const severity = options.severity ?? 'error';
    const exitCode = options.exitCode ?? 1;

    // 获取翻译后的错误消息
    let message: string;

    if (options.message) {
      // 使用自定义消息 key (支持 i18n)
      message = t(options.message, options.params);
    } else if (ERROR_CODE_TO_I18N_KEY[code]) {
      // 使用预定义的 i18n key 映射
      message = t(ERROR_CODE_TO_I18N_KEY[code]!, options.params);
    } else {
      // 回退到通用错误格式
      message = t('error.unknown');
    }

    super(message);

    this.name = 'CliError';
    this.code = code;
    this.severity = severity;
    this.suggestions = options.suggestions ?? getDefaultSuggestions(code);
    this.exitCode = exitCode;
    this.cause = options.cause instanceof Error ? options.cause : undefined;

    // 保持正确的堆栈跟踪
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CliError);
    }
  }

  /**
   * 格式化完整的错误输出（用于显示给用户）
   */
  format(): string {
    const lines: string[] = [];

    // 错误图标和消息
    const icon = this.severity === 'warning' ? '⚠️' : '❌';
    lines.push(`${icon} ${this.message}`);

    // 添加建议
    if (this.suggestions.length > 0) {
      lines.push('');
      lines.push('💡 解决建议:');
      for (const suggestion of this.suggestions) {
        lines.push(`   • ${suggestion.text}`);
        if (suggestion.command) {
          lines.push(`     $ ${suggestion.command}`);
        }
      }
    }

    return lines.join('\n');
  }

  /**
   * 将错误转换为 JSON 对象（用于日志记录）
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      severity: this.severity,
      suggestions: this.suggestions,
      exitCode: this.exitCode,
      cause: this.cause?.message,
      stack: this.stack,
    };
  }

  /**
   * 判断是否为特定类型的错误
   */
  is(errorCode: CliErrorCode): boolean {
    return this.code === errorCode;
  }
}

/**
 * 获取默认的解决建议
 */
function getDefaultSuggestions(code: CliErrorCode): ErrorSuggestion[] {
  const defaultMap: Partial<Record<CliErrorCode, ErrorSuggestion[]>> = {
    [CliErrorCode.GATEWAY_PORT_IN_USE]: [
      { text: t('error.suggestion.portInUse', { port: '' }), command: 'lsof -i :{{port}}' },
      { text: t('error.suggestion.runDoctor'), command: 'openclaw doctor --fix' },
    ],
    [CliErrorCode.GATEWAY_START_FAILED]: [
      { text: t('error.suggestion.checkConfig'), command: 'openclaw doctor' },
      { text: t('error.suggestion.general') },
    ],
    [CliErrorCode.CHANNEL_CONNECT_FAILED]: [
      { text: t('channel.suggestion.checkCredentials') },
      { text: t('error.suggestion.network') },
    ],
    [CliErrorCode.AUTH_MISSING_API_KEY]: [
      { text: t('error.suggestion.authFailed'), command: 'openclaw config set api-key YOUR_KEY' },
    ],
    [CliErrorCode.NETWORK_CONNECTION_REFUSED]: [
      { text: t('error.suggestion.network') },
    ],
    [CliErrorCode.CONFIG_INVALID]: [
      { text: t('error.suggestion.checkConfig'), command: 'openclaw doctor --fix' },
    ],
  };

  return defaultMap[code] ?? [
    { text: t('error.suggestion.runDoctor'), command: 'openclaw doctor --fix' },
    { text: t('error.suggestion.general') },
  ];
}

/**
 * 快速创建错误的便捷函数
 *
 * @example
 * ```typescript
 * // 使用错误代码创建
 * createError(CliErrorCode.PORT_IN_USE, { port: 18789 })
 *
 * // 使用自定义消息创建
 * createError('custom.error.message', { param: value })
 * ```
 */
export function createError(
  codeOrMessage: CliErrorCode | string,
  params?: Record<string, unknown>,
  options?: Partial<Omit<CliErrorOptions, 'code' | 'message' | 'params'>>,
): CliError {
  const isCode = Object.values(CliErrorCode).includes(codeOrMessage as CliErrorCode);

  return new CliError({
    ...(isCode ? { code: codeOrMessage as CliErrorCode } : { message: codeOrMessage }),
    params,
    ...options,
  });
}
