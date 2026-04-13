import { describe, it, expect } from "vitest";
import { ar } from "../../i18n/locales/ar.js";
import type { TranslationMap } from "../../i18n/lib/types.js";

describe("Arabic (ar) Translation File", () => {
  describe("Structure Validation", () => {
    it("should have all required top-level modules", () => {
      const requiredModules = [
        "common",
        "nav",
        "tabs",
        "subtitles",
        "overview",
        "messages",
        "actions",
        "errors",
        "status",
        "config",
        "channels",
        "agents",
        "sessions",
        "usage",
        "help",
        "dates",
        "validation",
        "accessibility",
      ];

      requiredModules.forEach(module => {
        expect(ar[module]).toBeDefined();
        expect(typeof ar[module]).toBe("object");
      });
    });

    it("should have non-empty common translations", () => {
      const common = ar.common as TranslationMap;
      expect(Object.keys(common).length).toBeGreaterThan(0);
    });
  });

  describe("RTL Language Characteristics", () => {
    it("should contain Arabic script characters", () => {
      const allText = JSON.stringify(ar);
      // Arabic Unicode range: U+0600 to U+06FF
      const hasArabic = /[\u0600-\u06FF]/.test(allText);
      expect(hasArabic).toBeTruthy();
    });

    it("should translate navigation items correctly", () => {
      const nav = ar.nav as TranslationMap;
      expect(nav.chat).toBe("الدردشة");
      expect(nav.control).toBe("التحكم");
      expect(nav.settings).toBe("الإعدادات");
    });

    it("should translate status indicators correctly", () => {
      const status = ar.status as TranslationMap;
      expect(status.online).toBe("متصل");
      expect(status.offline).toBe("غير متصل");
      expect(status.error).toBe("خطأ");
    });

    it("should translate action buttons correctly", () => {
      const actions = ar.actions as TranslationMap;
      const messages = ar.messages as TranslationMap;
      expect(actions.connect).toBe("اتصال");
      expect(messages.save).toBe("حفظ");
      expect(messages.delete).toBe("حذف");
    });

    it("should translate error messages correctly", () => {
      const errors = ar.errors as TranslationMap;
      expect(errors.generic).toContain("خطأ");
      expect(errors.network).toContain("شبكة");
    });
  });

  describe("Channel Translations", () => {
    it("should translate channel types", () => {
      const channels = ar.channels as TranslationMap;
      const types = channels.types as TranslationMap;
      expect(types.whatsapp).toBe("واتساب");
      expect(types.telegram).toBe("تلغرام");
      expect(types.discord).toBe("ديسكورد");
    });

    it("should have channel status translations", () => {
      const channels = ar.channels as TranslationMap;
      const status = channels.status as TranslationMap;
      expect(status.connected).toBe("متصل");
      expect(status.disconnected).toBe("غير متصل");
    });
  });

  describe("Date and Time Formatting", () => {
    it("should have Arabic date labels", () => {
      const dates = ar.dates as TranslationMap;
      expect(dates.today).toBe("اليوم");
      expect(dates.yesterday).toBe("أمس");
    });

    it("should support relative time with placeholders", () => {
      const dates = ar.dates as TranslationMap;
      expect(dates.minutesAgo).toContain("{count}");
      expect(dates.hoursAgo).toContain("{count}");
    });
  });

  describe("Validation Messages", () => {
    it("should have validation error messages in Arabic", () => {
      const validation = ar.validation as TranslationMap;
      expect(validation.required).toBeTruthy();
      expect(validation.email).toBeTruthy();
      expect((validation.required as string).length).toBeGreaterThan(5); // Reasonable length for Arabic
    });
  });

  describe("Accessibility Support", () => {
    it("should have accessibility labels in Arabic", () => {
      const accessibility = ar.accessibility as TranslationMap;
      expect(accessibility.skipToContent).toBeTruthy();
      expect(accessibility.openMenu).toBeTruthy();
      expect(accessibility.closeMenu).toBeTruthy();
    });
  });

  describe("Consistency Checks", () => {
    it("should not have empty translation values", () => {
      const checkEmpty = (obj: Record<string, any>, path: string = ""): string[] => {
        let emptyPaths: string[] = [];

        Object.entries(obj).forEach(([key, value]) => {
          const currentPath = path ? `${path}.${key}` : key;

          if (typeof value === "string" && value.trim() === "") {
            emptyPaths.push(currentPath);
          } else if (typeof value === "object" && value !== null) {
            emptyPaths = emptyPaths.concat(checkEmpty(value, currentPath));
          }
        });

        return emptyPaths;
      };

      const emptyValues = checkEmpty(ar as unknown as Record<string, any>);
      expect(emptyValues).toHaveLength(0);
    });

    it("should have reasonable translation lengths for UI strings", () => {
      // Arabic text is typically shorter than English
      const shortStrings = ["common.ok", "common.search", "nav.chat"];

      shortStrings.forEach(path => {
        const keys = path.split(".");
        let value: any = ar;

        keys.forEach(key => {
          value = (value as TranslationMap)?.[key];
        });

        expect(value).toBeTruthy();
        expect((value as string).length).toBeLessThan(20); // Should be concise
      });
    });
  });
});
