import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { i18nAudit, createAuditedT } from "../lib/i18n-audit.js";

describe("I18nAuditLogger", () => {
  beforeEach(() => {
    i18nAudit.disable();
    i18nAudit.clear();
  });

  describe("enable / disable", () => {
    it("should enable audit logging", () => {
      const spy = vi.spyOn(console, "log").mockImplementation(() => {});
      i18nAudit.enable();
      expect(spy).toHaveBeenCalledWith("[i18n-audit] ✅ Translation audit ENABLED");
      spy.mockRestore();
    });

    it("should disable audit logging", () => {
      const spy = vi.spyOn(console, "log").mockImplementation(() => {});
      i18nAudit.enable();
      i18nAudit.disable();
      expect(spy).toHaveBeenCalledWith(
        expect.stringContaining("[i18n-audit] ❌ Translation audit DISABLED")
      );
      spy.mockRestore();
    });
  });

  describe("log", () => {
    it("should not log when disabled", () => {
      const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
      i18nAudit.log("test.key", "fallback", "Component.ts");
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });

    it("should log entry when enabled", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      i18nAudit.enable();

      i18nAudit.log("missing.key", "fallback", "TestComponent.tsx");

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("Missing translation")
      );
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("missing.key"));
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("TestComponent.tsx")
      );
      warnSpy.mockRestore();
    });
  });

  describe("getReport", () => {
    it("should return empty report when no entries", () => {
      const report = i18nAudit.getReport();
      expect(report.total).toBe(0);
      expect(report.uniqueKeys.size).toBe(0);
      expect(report.entries).toEqual([]);
    });

    it("should count entries correctly", () => {
      i18nAudit.enable();
      i18nAudit.log("key1", "fb1", "loc1");
      i18nAudit.log("key2", "fb2", "loc2");
      i18nAudit.log("key1", "fb1", "loc3");

      const report = i18nAudit.getReport();
      expect(report.total).toBe(3);
      expect(report.uniqueKeys.size).toBe(2);
      expect(report.uniqueKeys.has("key1")).toBe(true);
      expect(report.uniqueKeys.has("key2")).toBe(true);
    });
  });

  describe("exportReport", () => {
    it("should generate formatted report string", () => {
      i18nAudit.enable();
      i18nAudit.log("app.title", "App Title", "Header.tsx");

      const report = i18nAudit.exportReport();
      expect(report).toContain("I18N AUDIT REPORT");
      expect(report).toContain("Total missing translations: 1");
      expect(report).toContain("Unique keys missing: 1");
      expect(report).toContain("app.title");
    });

    it("should handle empty entries gracefully", () => {
      const report = i18nAudit.exportReport();
      expect(report).toContain("I18N AUDIT REPORT");
      expect(report).toContain("Total missing translations: 0");
    });
  });

  describe("clear", () => {
    it("should clear all entries", () => {
      i18nAudit.enable();
      i18nAudit.log("key1", "fb", "loc");

      i18nAudit.clear();
      const report = i18nAudit.getReport();
      expect(report.total).toBe(0);
    });
  });
});

describe("createAuditedT", () => {
  it("should return a function", () => {
    const auditedT = createAuditedT("TestLocation");
    expect(typeof auditedT).toBe("function");
  });

  it("should call t() and return result for valid translations", () => {
    const auditedT = createAuditedT("TestComponent");
    const result = auditedT("common.cancel");
    expect(result).toBeTruthy();
  });

  it("should log to audit when key equals fallback (missing)", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    i18nAudit.enable();

    const auditedT = createAuditedT("MyComponent");
    auditedT("nonexistent.key");

    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it("should not log for config.* keys", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    i18nAudit.enable();

    const auditedT = createAuditedT("Config");
    auditedT("config.someSetting");

    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it("should not log for template literal starting keys", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    i18nAudit.enable();

    const auditedT = createAuditedT("Template");
    auditedT("{dynamicKey}");

    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});
