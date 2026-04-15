import { t } from "./translate.js";

interface I18nAuditEntry {
  key: string;
  fallback: string;
  location: string;
  timestamp: number;
}

class I18nAuditLogger {
  private entries: I18nAuditEntry[] = [];
  private enabled = false;

  enable() {
    this.enabled = true;
    this.entries = [];
    console.log("[i18n-audit] ✅ Translation audit ENABLED");
  }

  disable() {
    this.enabled = false;
    console.log(`[i18n-audit] ❌ Translation audit DISABLED (${this.entries.length} entries)`);
  }

  log(key: string, fallback: string, location: string) {
    if (!this.enabled) return;

    const entry: I18nAuditEntry = {
      key,
      fallback,
      location,
      timestamp: Date.now(),
    };

    this.entries.push(entry);

    console.warn(
      `[i18n-audit] Missing translation:\n` +
      `  🔑 Key: ${key}\n` +
      `  📝 Fallback: "${fallback}"\n` +
      `  📍 Location: ${location}`
    );
  }

  getReport(): { total: number; uniqueKeys: Set<string>; entries: I18nAuditEntry[] } {
    const uniqueKeys = new Set(this.entries.map(e => e.key));
    return {
      total: this.entries.length,
      uniqueKeys,
      entries: this.entries,
    };
  }

  exportReport(): string {
    const report = this.getReport();

    let output = `\n${"=".repeat(80)}\n`;
    output += `📊 I18N AUDIT REPORT\n`;
    output += `${"=".repeat(80)}\n\n`;
    output += `Total missing translations: ${report.total}\n`;
    output += `Unique keys missing: ${report.uniqueKeys.size}\n\n`;

    output += `📋 MISSING TRANSLATION KEYS:\n`;
    output += `${"-".repeat(80)}\n\n`;

    for (const key of Array.from(report.uniqueKeys).sort()) {
      const examples = report.entries.filter(e => e.key === key).slice(0, 3);
      output += `❌ ${key}\n`;
      if (examples.length > 0) {
        output += `   Example fallback: "${examples[0]?.fallback}"\n`;
        output += `   Found in: ${examples[0]?.location}\n\n`;
      }
    }

    output += `${"=".repeat(80)}\n\n`;

    return output;
  }

  clear() {
    this.entries = [];
  }
}

export const i18nAudit = new I18nAuditLogger();

export function createAuditedT(location: string) {
  return (key: string, params?: Record<string, string>): string => {
    const result = t(key, params);

    if (result === key && !key.startsWith("{") && !key.startsWith("config.")) {
      i18nAudit.log(key, key, location);
    } else if (result === `${key}.label` || result === `${key}.help`) {
      i18nAudit.log(key, result.replace(`${key}.`, ""), location);
    }

    return result;
  };
}
