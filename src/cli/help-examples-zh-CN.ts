import type { HelpExample } from "./help-format.js";
import { t } from "../i18n/index.js";

/**
 * 中文帮助示例数据库
 *
 * 提供所有 CLI 命令的中文使用示例
 * 用于 help 命令的示例展示
 */

/** Gateway 命令示例 */
export const gatewayHelpExamples: HelpExample[] = [
  ["openclaw gateway start", t('gateway.start.description')],
  ["openclaw gateway start --port 8080", "在自定义端口启动 Gateway"],
  ["openclaw gateway stop", t('gateway.stop.description')],
  ["openclaw gateway restart", t('gateway.restart.description')],
  ["openclaw gateway status", t('gateway.status.description')],
  ["openclaw gateway status --json", "以 JSON 格式输出状态信息"],
];

/** 渠道命令示例 */
export const channelsHelpExamples: HelpExample[] = [
  ["openclaw channels list", t('channels.list.description')],
  ["openclaw channels add --channel telegram --token <token>", "添加 Telegram 渠道"],
  ["openclaw channels login --channel whatsapp", "关联 WhatsApp Web 账号"],
  ["openclaw channels logout --channel telegram", "登出 Telegram 账号"],
  ["openclaw channels remove --channel discord", "移除 Discord 渠道配置"],
];

/** 模型命令示例 */
export const modelsHelpExamples: HelpExample[] = [
  ["openclaw models list", "列出所有可用的 AI 模型"],
  ["openclaw models set qwen-plus", "设置默认模型为 Qwen Plus"],
  ["openclaw models set deepseek-chat --channel wechat", "为微信渠道指定模型"],
  ["openclaw models info gpt-4o", "查看 GPT-4o 模型的详细信息"],
];

/** 配置命令示例 */
export const configHelpExamples: HelpExample[] = [
  ["openclaw config get", "查看当前所有配置"],
  ["openclaw config get gateway.port", "查看 Gateway 端口配置"],
  ["openclaw config set gateway.port 9090", "修改 Gateway 端口"],
  ["openclaw config edit", "在编辑器中打开配置文件"],
  ["openclaw config reset", "重置所有配置为默认值"],
];

/** Onboard 命令示例 */
export const onboardHelpExamples: HelpExample[] = [
  ["openclaw onboard", "启动初始设置向导"],
  ["openclaw onboard --quick", "快速模式 (使用默认配置)"],
  ["openclaw onboard --advanced", "高级模式 (完整配置选项)"],
];

/** Doctor 命令示例 */
export const doctorHelpExamples: HelpExample[] = [
  ["openclaw doctor", "运行系统诊断检查"],
  ["openclaw doctor --fix", "自动修复检测到的问题"],
  ["openclaw doctor --deep", "深度诊断 (包含网络和依赖检查)"],
  ["openclaw doctor --json", "以 JSON 格式输出诊断结果"],
];

/** 日志命令示例 */
export const logsHelpExamples: HelpExample[] = [
  ["openclaw logs", "查看最近的日志输出"],
  ["openclaw logs --follow", "实时跟踪日志 (类似 tail -f)"],
  ["openclaw logs --lines 100", "显示最近 100 行日志"],
  ["openclaw logs --level error", "仅显示错误级别日志"],
  ["openclaw channels logs --channel telegram", "查看特定渠道的日志"],
];

/** 帮助命令示例 */
export const helpHelpExamples: HelpExample[] = [
  ["openclaw help", "显示主帮助信息"],
  ["openclaw help gateway", "查看 Gateway 命令的详细帮助"],
  ["openclaw help channels add", "查看渠道添加命令的详细用法"],
  ["openclaw --help", "显示全局选项说明"],
];

/** 版本命令示例 */
export const versionHelpExamples: HelpExample[] = [
  ["openclaw version", "显示当前版本号"],
  ["openclaw --version", "显示版本号 (简短格式)"],
  ["openclaw version --verbose", "显示详细的版本和环境信息"],
];

/**
 * 获取指定命令的帮助示例
 *
 * @param commandName 命令名称
 * @returns 帮助示例数组
 */
export function getCommandHelpExamples(commandName: string): HelpExample[] {
  const exampleMap: Record<string, HelpExample[]> = {
    gateway: gatewayHelpExamples,
    channels: channelsHelpExamples,
    models: modelsHelpExamples,
    config: configHelpExamples,
    onboard: onboardHelpExamples,
    doctor: doctorHelpExamples,
    logs: logsHelpExamples,
    help: helpHelpExamples,
    version: versionHelpExamples,
  };

  return exampleMap[commandName] ?? [];
}

/**
 * 格式化命令组帮助示例
 *
 * @param label 组标签
 * @param examples 示例数组
 * @param inline 是否内联格式
 * @returns 格式化后的字符串
 */
export function formatCommandGroupExamples(
  label: string,
  examples: ReadonlyArray<HelpExample>,
  inline = false,
): string {
  if (examples.length === 0) {
    return "";
  }

  const lines = examples.map(([command, description]) => {
    if (inline) {
      return `  ${command} # ${description}`;
    }
    return `  ${command}\n    ${description}`;
  });

  return `${label}\n${lines.join("\n")}`;
}
