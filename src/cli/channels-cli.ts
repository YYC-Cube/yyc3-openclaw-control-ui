import type { Command } from "commander";
import { danger } from "../globals.js";
import { defaultRuntime } from "../runtime.js";
import { formatDocsLink } from "../terminal/links.js";
import { theme } from "../terminal/theme.js";
import { runChannelLogin, runChannelLogout } from "./channel-auth.js";
import { formatCliChannelOptions } from "./channel-options.js";
import { runCommandWithRuntime } from "./cli-utils.js";
import { hasExplicitOptions } from "./command-options.js";
import { formatHelpExamples } from "./help-format.js";
import { t } from "../i18n/index.js";

const optionNamesAdd = [
  "channel",
  "account",
  "name",
  "token",
  "privateKey",
  "tokenFile",
  "botToken",
  "appToken",
  "signalNumber",
  "cliPath",
  "dbPath",
  "service",
  "region",
  "authDir",
  "httpUrl",
  "httpHost",
  "httpPort",
  "webhookPath",
  "webhookUrl",
  "audienceType",
  "audience",
  "useEnv",
  "homeserver",
  "userId",
  "accessToken",
  "password",
  "deviceName",
  "initialSyncLimit",
  "ship",
  "url",
  "relayUrls",
  "code",
  "groupChannels",
  "dmAllowlist",
  "autoDiscoverChannels",
] as const;

const optionNamesRemove = ["channel", "account", "delete"] as const;

function runChannelsCommand(action: () => Promise<void>) {
  return runCommandWithRuntime(defaultRuntime, action);
}

function runChannelsCommandWithDanger(action: () => Promise<void>, label: string) {
  return runCommandWithRuntime(defaultRuntime, action, (err) => {
    defaultRuntime.error(danger(`${label}: ${String(err)}`));
    defaultRuntime.exit(1);
  });
}

export function registerChannelsCli(program: Command) {
  const channelNames = formatCliChannelOptions();
  const channels = program
    .command("channels")
    .description(t('channels.description'))
    .addHelpText(
      "after",
      () =>
        `\n${theme.heading("Examples:")}\n${formatHelpExamples([
          ["openclaw channels list", t('channels.list.description')],
          ["openclaw channels status --probe", "运行渠道状态检查和探测"],
          [
            "openclaw channels add --channel telegram --token <token>",
            "非交互式添加或更新渠道账号",
          ],
          ["openclaw channels login --channel whatsapp", "关联 WhatsApp Web 账号"],
        ])}\n\n${theme.muted("Docs:")} ${formatDocsLink(
          "/cli/channels",
          "docs.openclaw.ai/zh-CN/cli/channels",
        )}\n`,
    );

  channels
    .command("list")
    .description(t('channels.list.description'))
    .option("--no-usage", "跳过模型提供商使用量/配额快照")
    .option("--json", t('gateway.options.jsonOutput'), false)
    .action(async (opts) => {
      await runChannelsCommand(async () => {
        const { channelsListCommand } = await import("../commands/channels.js");
        await channelsListCommand(opts, defaultRuntime);
      });
    });

  channels
    .command("status")
    .description(t('channels.status.description'))
    .option("--probe", t('channels.connect.argType'), false)
    .option("--timeout <ms>", "超时时间 (毫秒)", "10000")
    .option("--json", t('gateway.options.jsonOutput'), false)
    .action(async (opts) => {
      await runChannelsCommand(async () => {
        const { channelsStatusCommand } = await import("../commands/channels.js");
        await channelsStatusCommand(opts, defaultRuntime);
      });
    });

  channels
    .command("capabilities")
    .description("显示提供商能力 (意图/范围 + 支持的功能)")
    .option("--channel <name>", `渠道 (${formatCliChannelOptions(["all"])})`)
    .option("--account <id>", "账号ID (仅与 --channel 配合使用)")
    .option("--target <dest>", "权限审计的渠道目标 (Discord channel:<id>)")
    .option("--timeout <ms>", "超时时间 (毫秒)", "10000")
    .option("--json", t('gateway.options.jsonOutput'), false)
    .action(async (opts) => {
      await runChannelsCommand(async () => {
        const { channelsCapabilitiesCommand } = await import("../commands/channels.js");
        await channelsCapabilitiesCommand(opts, defaultRuntime);
      });
    });

  channels
    .command("resolve")
    .description("解析渠道/用户名称到ID")
    .argument("<entries...>", "要解析的条目 (名称或ID)")
    .option("--channel <name>", `渠道 (${channelNames})`)
    .option("--account <id>", "账号ID (accountId)")
    .option("--kind <kind>", "目标类型 (auto|user|group)", "auto")
    .option("--json", t('gateway.options.jsonOutput'), false)
    .action(async (entries, opts) => {
      await runChannelsCommand(async () => {
        const { channelsResolveCommand } = await import("../commands/channels.js");
        await channelsResolveCommand(
          {
            channel: opts.channel as string | undefined,
            account: opts.account as string | undefined,
            kind: opts.kind as "auto" | "user" | "group",
            json: Boolean(opts.json),
            entries: Array.isArray(entries) ? entries : [String(entries)],
          },
          defaultRuntime,
        );
      });
    });

  channels
    .command("logs")
    .description("显示网关日志文件中的最近渠道日志")
    .option("--channel <name>", `渠道 (${formatCliChannelOptions(["all"])})`, "all")
    .option("--lines <n>", "显示行数 (默认: 200)", "200")
    .option("--json", t('gateway.options.jsonOutput'), false)
    .action(async (opts) => {
      await runChannelsCommand(async () => {
        const { channelsLogsCommand } = await import("../commands/channels.js");
        await channelsLogsCommand(opts, defaultRuntime);
      });
    });

  channels
    .command("add")
    .description("添加或更新渠道账号")
    .option("--channel <name>", `渠道 (${channelNames})`)
    .option("--account <id>", "账号ID (省略时使用默认)")
    .option("--name <name>", "此账号的显示名称")
    .option("--token <token>", "机器人Token (Telegram/Discord)")
    .option("--private-key <key>", "Nostr私钥 (nsec... 或 hex)")
    .option("--token-file <path>", "机器人Token文件 (Telegram)")
    .option("--bot-token <token>", "Slack机器人Token (xoxb-...)")
    .option("--app-token <token>", "Slack应用Token (xapp-...)")
    .option("--signal-number <e164>", "Signal账号号码 (E.164格式)")
    .option("--cli-path <path>", "CLI路径 (signal-cli 或 imsg)")
    .option("--db-path <path>", "iMessage数据库路径")
    .option("--service <service>", "iMessage服务类型 (imessage|sms|auto)")
    .option("--region <region>", "iMessage区域 (用于SMS)")
    .option("--auth-dir <path>", "WhatsApp认证目录覆盖")
    .option("--http-url <url>", "Signal HTTP守护进程基础URL")
    .option("--http-host <host>", "Signal HTTP主机")
    .option("--http-port <port>", "Signal HTTP端口")
    .option("--webhook-path <path>", "Webhook路径 (Google Chat/BlueBubbles)")
    .option("--webhook-url <url>", "Google Chat Webhook URL")
    .option("--audience-type <type>", "Google Chat受众类型 (app-url|project-number)")
    .option("--audience <value>", "Google Chat受众值 (应用URL或项目编号)")
    .option("--homeserver <url>", "Matrix服务器URL")
    .option("--user-id <id>", "Matrix用户ID")
    .option("--access-token <token>", "Matrix访问令牌")
    .option("--password <password>", "Matrix密码")
    .option("--device-name <name>", "Matrix设备名称")
    .option("--initial-sync-limit <n>", "Matrix初始同步限制")
    .option("--ship <ship>", "Tlon飞船名称 (~sampel-palnet)")
    .option("--url <url>", "Tlon飞船URL")
    .option("--relay-urls <list>", "Nostr中继URL列表 (逗号分隔)")
    .option("--code <code>", "Tlon登录代码")
    .option("--group-channels <list>", "Tlon群组频道列表 (逗号分隔)")
    .option("--dm-allowlist <list>", "Tlon DM白名单列表 (逗号分隔的飞船)")
    .option("--auto-discover-channels", "Tlon自动发现群组频道")
    .option("--no-auto-discover-channels", "禁用Tlon自动发现")
    .option("--use-env", "使用环境变量Token (仅默认账号)", false)
    .action(async (opts, command) => {
      await runChannelsCommand(async () => {
        const { channelsAddCommand } = await import("../commands/channels.js");
        const hasFlags = hasExplicitOptions(command, optionNamesAdd);
        await channelsAddCommand(opts, defaultRuntime, { hasFlags });
      });
    });

  channels
    .command("remove")
    .description("禁用或删除渠道账号")
    .option("--channel <name>", `渠道 (${channelNames})`)
    .option("--account <id>", "账号ID (省略时使用默认)")
    .option("--delete", "删除配置条目 (无提示)", false)
    .action(async (opts, command) => {
      await runChannelsCommand(async () => {
        const { channelsRemoveCommand } = await import("../commands/channels.js");
        const hasFlags = hasExplicitOptions(command, optionNamesRemove);
        await channelsRemoveCommand(opts, defaultRuntime, { hasFlags });
      });
    });

  channels
    .command("login")
    .description(t('channels.connect.description'))
    .option("--channel <channel>", "渠道别名 (仅配置一个时自动选择)")
    .option("--account <id>", "账号ID (accountId)")
    .option("--verbose", "详细连接日志", false)
    .action(async (opts) => {
      await runChannelsCommandWithDanger(async () => {
        await runChannelLogin(
          {
            channel: opts.channel as string | undefined,
            account: opts.account as string | undefined,
            verbose: Boolean(opts.verbose),
          },
          defaultRuntime,
        );
      }, t('channels.disconnect.confirm'));
    });

  channels
    .command("logout")
    .description(t('channels.disconnect.description'))
    .option("--channel <channel>", "渠道别名 (仅配置一个时自动选择)")
    .option("--account <id>", "账号ID (accountId)")
    .action(async (opts) => {
      await runChannelsCommandWithDanger(async () => {
        await runChannelLogout(
          {
            channel: opts.channel as string | undefined,
            account: opts.account as string | undefined,
          },
          defaultRuntime,
        );
      }, "渠道登出失败");
    });
}
