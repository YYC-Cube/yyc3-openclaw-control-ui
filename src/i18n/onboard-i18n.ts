/**
 * file: src/i18n/onboard-i18n.ts
 * description: Onboarding 向导中文化辅助工具 · 提供全中文的引导体验
 * author: YanYuCloudCube Team
 * version: v1.0.0
 * created: 2026-04-10
 * updated: 2026-04-10
 * status: active
 * tags: [i18n],[onboard],[wizard]
 *
 * features:
 * - 中文欢迎界面
 * - 三步引导流程 (Gateway → 渠道 → 模型)
 * - 交互式提示优化
 * - 完成总结屏幕
 */

import { t } from './core.js';
import type { RuntimeEnv } from '../runtime.js';

/** Onboarding 步骤配置 */
export interface OnboardStepConfig {
  /** 步骤标题 */
  title: string;
  /** 步骤描述 */
  description: string;
  /** 当前步骤序号 (从1开始) */
  stepNumber: number;
  /** 总步骤数 */
  totalSteps: number;
}

/**
 * 打印中文欢迎界面
 */
export function printWelcomeScreen(runtime: RuntimeEnv): void {
  const welcomeText = [
    '',
    '╔═══════════════════════════════════════════════════╗',
    '║                                                   ║',
    `║   ${t('onboard.welcome.title')}   ║`,
    `║      ${t('onboard.welcome.subtitle')}     ║`,
    '║                                                   ║',
    '╚═══════════════════════════════════════════════════╝',
    '',
    t('onboard.steps.preview'),
    '',
    `  ${t('onboard.steps.step.gateway')}`,
    `  ${t('onboard.steps.step.channels')}`,
    `  ${t('onboard.steps.step.model')}`,
    '',
    '─'.repeat(51),
    '',
  ];

  runtime.log(welcomeText.join('\n'));
}

/**
 * 打印步骤标题
 */
export function printStepHeader(config: OnboardStepConfig, runtime: RuntimeEnv): void {
  const header = [
    '',
    '┌' + '─'.repeat(49) + '┐',
    `│  ${config.title.padEnd(45)} │`,
    `│  ${config.description.padEnd(45)} │`,
    '└' + '─'.repeat(49) + '┘',
    '',
  ];

  runtime.log(header.join('\n'));
}

/**
 * 打印完成总结界面
 */
export function printCompletionScreen(
  config: {
    gatewayPort?: number;
    channels?: string[];
    modelProvider?: string;
  },
  runtime: RuntimeEnv,
): void {
  const lines = [
    '',
    '╔═══════════════════════════════════════════════════╗',
    '║                                                   ║',
    '║              ✅ 设置完成！                        ║',
    '║                                                   ║',
    '╚═══════════════════════════════════════════════════╝',
    '',
    t('onboard.complete.summary'),
    '',
  ];

  // 配置摘要
  if (config.gatewayPort) {
    lines.push(`  🌐 Gateway 端口: ${config.gatewayPort}`);
  }
  if (config.channels && config.channels.length > 0) {
    lines.push(`  📱 已连接渠道: ${config.channels.join(', ')}`);
  }
  if (config.modelProvider) {
    lines.push(`  🤖 AI 模型: ${config.modelProvider}`);
  }

  lines.push('');
  lines.push(t('onboard.complete.nextSteps'));
  lines.push('');
  lines.push(`  1️⃣  ${t('onboard.complete.step1Desc')} - openclaw gateway start`);
  lines.push(`  2️⃣  ${t('onboard.complete.step2Desc')} - http://127.0.0.1:${config.gatewayPort ?? 18789}`);
  lines.push(`  3️⃣  ${t('onboard.complete.step3Desc')}`);
  lines.push('');
  lines.push(t('onboard.complete.documentation'));
  lines.push('');
  lines.push(`🎉 ${t('onboard.complete.enjoy')}`);

  runtime.log(lines.join('\n'));
}

/**
 * 打印取消提示
 */
export function printCancelledMessage(runtime: RuntimeEnv): void {
  runtime.log('');
  runtime.log(t('onboard.cancelled'));
  runtime.log('');
}

/**
 * 获取中文提示文本
 */
export function getPromptText(key: keyof typeof promptTexts): string {
  return promptTexts[key] ?? key;
}

/** 预定义的提示文本 (中文) */
const promptTexts = {
  port: t('onboard.prompt.port'),
  bindMode: t('onboard.prompt.bindMode'),
  selectChannels: t('onboard.prompt.selectChannels'),
  selectModel: t('onboard.prompt.selectModel'),
  freeTier: t('onboard.prompt.freeTier'),
  apiKey: t('onboard.prompt.apiKey'),
} as const;

/** 验证错误信息 */
export const validationMessages = {
  portRange: t('onboard.validation.portRange'),
  apiKeyLength: t('onboard.validation.apiKeyLength'),
  required: t('prompt.inputRequired'),
};

/** 操作提示 */
export const hints = {
  portDefault: t('onboard.hint.portDefault'),
  multiselect: t('onboard.hint.multiselect'),
};
