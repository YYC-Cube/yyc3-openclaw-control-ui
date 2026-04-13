import { t } from "../i18n/index.js";
import type { ProgressReporter, ProgressOptions } from "./progress.js";
import { createCliProgress, withProgress, withProgressTotals } from "./progress.js";

/**
 * 中文进度指示器标签映射
 *
 * 将常见的英文进度标签翻译为中文
 */
const PROGRESS_LABEL_MAP: Record<string, string> = {
  // Gateway 相关
  "Starting gateway...": t('gateway.start.starting'),
  "Stopping gateway...": t('gateway.stop.stopping'),
  "Restarting gateway...": t('gateway.restart.restart'),

  // 渠道相关
  "Connecting to channel...": t('channels.connect.connecting'),
  "Disconnecting from channel...": "正在断开渠道连接...",
  "Loading channels...": "正在加载渠道列表...",

  // 配置相关
  "Loading configuration...": "正在加载配置...",
  "Saving configuration...": "正在保存配置...",
  "Validating configuration...": "正在验证配置...",

  // 模型相关
  "Loading models...": "正在加载模型列表...",
  "Setting model...": "正在设置模型...",
  "Testing model connection...": "正在测试模型连接...",

  // 通用操作
  "Loading...": t('common.loading'),
  "Please wait...": t('common.pleaseWait'),
  "Processing...": "正在处理...",
  "Downloading...": "正在下载...",
  "Uploading...": "正在上传...",
  "Installing...": "正在安装...",
  "Updating...": "正在更新...",
  "Checking...": "正在检查...",
  "Verifying...": "正在验证...",
  "Compiling...": "正在编译...",
  "Building...": "正在构建...",
  "Cleaning up...": "正在清理...",

  // 完成状态
  "Completed!": t('common.success'),
  "Done!": "完成！",
  "Finished!": "已完成！",
};

/**
 * 翻译进度标签
 *
 * @param label 原始英文标签
 * @returns 中文标签 (如果找到映射) 或原始标签
 */
export function translateProgressLabel(label: string): string {
  return PROGRESS_LABEL_MAP[label] ?? label;
}

/**
 * 创建中文进度指示器
 *
 * 自动将进度标签翻译为中文
 *
 * @param options 进度选项
 * @returns 进度报告器
 */
export function createChineseProgress(options: ProgressOptions): ProgressReporter {
  const translatedOptions: ProgressOptions = {
    ...options,
    label: translateProgressLabel(options.label),
  };

  const reporter = createCliProgress(translatedOptions);

  const originalSetLabel = reporter.setLabel.bind(reporter);
  reporter.setLabel = (label: string) => {
    originalSetLabel(translateProgressLabel(label));
  };

  return reporter;
}

/**
 * 使用中文进度指示器执行异步任务
 *
 * 自动翻译所有进度更新
 *
 * @param options 进度选项
 * @work 异步工作函数
 * @returns 工作函数的返回值
 */
export async function withChineseProgress<T>(
  options: ProgressOptions,
  work: (progress: ProgressReporter) => Promise<T>,
): Promise<T> {
  const chineseOptions: ProgressOptions = {
    ...options,
    label: translateProgressLabel(options.label),
  };

  return await withProgress(chineseOptions, async (progress) => {
    const originalSetLabel = progress.setLabel.bind(progress);
    progress.setLabel = (label: string) => {
      originalSetLabel(translateProgressLabel(label));
    };

    return await work(progress);
  });
}

/**
 * 使用中文进度指示器执行带总数更新的任务
 *
 * @param options 进度选项
 * @work 工作函数
 * @returns 工作函数的返回值
 */
export async function withChineseProgressTotals<T>(
  options: ProgressOptions,
  work: (
    update: (update: { completed: number; total: number; label?: string }) => void,
    progress: ProgressReporter,
  ) => Promise<T>,
): Promise<T> {
  const chineseOptions: ProgressOptions = {
    ...options,
    label: translateProgressLabel(options.label),
  };

  return await withProgressTotals(chineseOptions, async (update, progress) => {
    const originalUpdate = update;
    const wrappedUpdate = (updateInfo: { completed: number; total: number; label?: string }) => {
      if (updateInfo.label) {
        updateInfo.label = translateProgressLabel(updateInfo.label);
      }
      originalUpdate(updateInfo);
    };

    const originalSetLabel = progress.setLabel.bind(progress);
    progress.setLabel = (label: string) => {
      originalSetLabel(translateProgressLabel(label));
    };

    return await work(wrappedUpdate, progress);
  });
}

/**
 * 预定义的常用中文进度场景
 */

/** Gateway 启动进度 */
export function createGatewayStartProgress(port?: number): ProgressReporter {
  return createChineseProgress({
    label: port ? `正在启动 Gateway (端口 ${port})...` : t('gateway.start.starting'),
    indeterminate: true,
  });
}

/** Gateway 停止进度 */
export function createGatewayStopProgress(): ProgressReporter {
  return createChineseProgress({
    label: t('gateway.stop.stopping'),
    indeterminate: true,
  });
}

/** 渠道连接进度 */
export function createChannelConnectProgress(channelName: string): ProgressReporter {
  return createChineseProgress({
    label: t('channels.connect.connecting', { channel: channelName }),
    indeterminate: true,
  });
}

/** 模型设置进度 */
export function createModelSetProgress(modelName: string): ProgressReporter {
  return createChineseProgress({
    label: `正在设置模型 ${modelName}...`,
    indeterminate: true,
  });
}

/** 配置保存进度 */
export function createConfigSaveProgress(): ProgressReporter {
  return createChineseProgress({
    label: "正在保存配置...",
    indeterminate: true,
  });
}

/**
 * 扩展进度标签映射表
 *
 * 允许用户添加自定义翻译
 *
 * @param customMap 自定义映射表
 */
export function extendProgressLabels(customMap: Record<string, string>): void {
  Object.assign(PROGRESS_LABEL_MAP, customMap);
}
