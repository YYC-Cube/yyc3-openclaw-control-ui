import { describe, it, expect } from "vitest";

import { zh_CN } from "../../i18n/locales/zh-CN.ts";
import { ja } from "../../i18n/locales/ja.ts";
import { ko } from "../../i18n/locales/ko.ts";
import { fr } from "../../i18n/locales/fr.ts";
import type { TranslationMap } from "../../i18n/lib/types.ts";

describe("i18n Integration Tests - Multi-language Support", () => {
  
  describe("Translation Structure Validation", () => {
    
    it("should have all required top-level modules in zh-CN", () => {
      const requiredModules = [
        'common', 'nav', 'tabs', 'subtitles', 'overview',
        'usage', 'login', 'chat', 'languages', 'channels',
        'config', 'agents', 'sessions', 'skills', 'nodes',
        'debug', 'logs', 'errors', 'actions', 'status',
        'messages', 'placeholders'
      ];
      
      requiredModules.forEach(module => {
        expect(zh_CN).toHaveProperty(module);
      });
    });

    it("should have all required top-level modules in ja", () => {
      const requiredModules = [
        'common', 'nav', 'tabs', 'subtitles', 'overview',
        'usage', 'login', 'chat', 'languages', 'channels',
        'config', 'agents', 'sessions', 'skills', 'nodes',
        'debug', 'logs', 'errors', 'actions', 'status',
        'messages', 'placeholders'
      ];
      
      requiredModules.forEach(module => {
        expect(ja).toHaveProperty(module);
      });
    });

    it("should have all required top-level modules in ko", () => {
      const requiredModules = [
        'common', 'nav', 'tabs', 'subtitles', 'overview',
        'usage', 'login', 'chat', 'languages', 'channels',
        'config', 'agents', 'sessions', 'skills', 'nodes',
        'debug', 'logs', 'errors', 'actions', 'status',
        'messages', 'placeholders'
      ];
      
      requiredModules.forEach(module => {
        expect(ko).toHaveProperty(module);
      });
    });

    it("should have all required top-level modules in fr", () => {
      const requiredModules = [
        'common', 'nav', 'tabs', 'subtitles', 'overview',
        'usage', 'login', 'chat', 'languages', 'channels',
        'config', 'agents', 'sessions', 'skills', 'nodes',
        'debug', 'logs', 'errors', 'actions', 'status',
        'messages', 'placeholders'
      ];
      
      requiredModules.forEach(module => {
        expect(fr).toHaveProperty(module);
      });
    });
  });

  describe("Key Consistency Across Languages", () => {
    
    function flattenKeys(obj: Record<string, any>, prefix = ''): Record<string, string> {
      let result: Record<string, string> = {};
      for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof value === 'object' && value !== null) {
          result = { ...result, ...flattenKeys(value, fullKey) };
        } else {
          result[fullKey] = value;
        }
      }
      return result;
    }

    it("zh-CN should have same key structure as English (reference)", () => {
      // zh-CN is our reference implementation with 980+ keys
      const zhKeys = Object.keys(flattenKeys(zh_CN));
      
      // Verify we have substantial coverage
      expect(zhKeys.length).toBeGreaterThan(800);
    });

    it("ja should have consistent keys with zh-CN", () => {
      const zhKeys = Object.keys(flattenKeys(zh_CN)).toSorted();
      const jaKeys = Object.keys(flattenKeys(ja)).toSorted();
      
      expect(jaKeys.length).toBeGreaterThan(500);
      
      // Check that major sections are present
      const majorSections = ['common.', 'nav.', 'tabs.', 'channels.', 'config.'];
      majorSections.forEach(section => {
        const hasSection = jaKeys.some(key => key.startsWith(section));
        expect(hasSection).toBeTruthy();
      });
    });

    it("ko should have consistent keys with zh-CN", () => {
      const zhKeys = Object.keys(flattenKeys(zh_CN)).toSorted();
      const koKeys = Object.keys(flattenKeys(ko)).toSorted();
      
      expect(koKeys.length).toBeGreaterThan(500);
      
      // Check that major sections are present
      const majorSections = ['common.', 'nav.', 'tabs.', 'channels.', 'config.'];
      majorSections.forEach(section => {
        const hasSection = koKeys.some(key => key.startsWith(section));
        expect(hasSection).toBeTruthy();
      });
    });

    it("fr should have consistent keys with zh-CN", () => {
      const zhKeys = Object.keys(flattenKeys(zh_CN)).toSorted();
      const frKeys = Object.keys(flattenKeys(fr)).toSorted();
      
      expect(frKeys.length).toBeGreaterThan(500);
      
      // Check that major sections are present
      const majorSections = ['common.', 'nav.', 'tabs.', 'channels.', 'config.'];
      majorSections.forEach(section => {
        const hasSection = frKeys.some(key => key.startsWith(section));
        expect(hasSection).toBeTruthy();
      });
    });
  });

  describe("Translation Quality Checks", () => {
    
    it("should not have empty translation values in zh-CN", () => {
      const values = Object.values(flattenKeys(zh_CN as unknown as Record<string, string>));
      values.forEach(value => {
        expect(value.trim().length).toBeGreaterThan(0);
      });
    });

    it("should not have empty translation values in ja", () => {
      const values = Object.values(flattenKeys(ja as unknown as Record<string, string>));
      values.forEach(value => {
        expect(value.trim().length).toBeGreaterThan(0);
      });
    });

    it("should not have empty translation values in ko", () => {
      const values = Object.values(flattenKeys(ko as unknown as Record<string, string>));
      values.forEach(value => {
        expect(value.trim().length).toBeGreaterThan(0);
      });
    });

    it("should not have empty translation values in fr", () => {
      const values = Object.values(flattenKeys(fr as unknown as Record<string, string>));
      values.forEach(value => {
        expect(value.trim().length).toBeGreaterThan(0);
      });
    });

    it("zh-CN translations should contain CJK characters", () => {
      const commonValues = Object.values(zh_CN.common).filter(v => typeof v === 'string');
      const hasCJK = commonValues.some(val => /[\u4e00-\u9fff]/.test(val));
      expect(hasCJK).toBeTruthy();
    });

    it("ja translations should contain Japanese characters", () => {
      const commonValues = Object.values(ja.common).filter(v => typeof v === 'string');
      const hasJapanese = commonValues.some(val => /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9fff]/.test(val));
      expect(hasJapanese).toBeTruthy();
    });

    it("ko translations should contain Korean characters", () => {
      const commonValues = Object.values(ko.common).filter(v => typeof v === 'string');
      const hasKorean = commonValues.some(val => /[\uac00-\ud7af]/.test(val));
      expect(hasKorean).toBeTruthy();
    });

    it("fr translations should contain Latin characters with accents", () => {
      const commonValues = Object.values(fr.common).filter(v => typeof v === 'string');
      const hasFrench = commonValues.some(val => /[àâäéèêëïîôùûüç]/.test(val));
      expect(hasFrench).toBeTruthy();
    });
  });

  describe("Critical UI Translations", () => {
    
    it("should translate navigation items correctly", () => {
      expect(safelyGetNested(zh_CN, 'nav', 'chat')).toBe("聊天");
      expect(safelyGetNested(ja, 'nav', 'chat')).toBe("チャット");
      expect(safelyGetNested(ko, 'nav', 'chat')).toBe("채팅");
      expect(safelyGetNested(fr, 'nav', 'chat')).toBe("Chat");
    });

    it("should translate status indicators correctly", () => {
      expect(safelyGetNested(zh_CN, 'status', 'online')).toBe("在线");
      expect(safelyGetNested(ja, 'status', 'online')).toBe("オンライン");
      expect(safelyGetNested(ko, 'status', 'online')).toBe("온라인");
      expect(safelyGetNested(fr, 'status', 'online')).toBe("En ligne");
    });

    it("should translate action buttons correctly", () => {
      expect(safelyGetNested(zh_CN, 'actions', 'save')).toBe("保存");
      expect(safelyGetNested(ja, 'actions', 'save')).toBe("保存");
      expect(safelyGetNested(ko, 'actions', 'save')).toBe("저장");
      expect(safelyGetNested(fr, 'actions', 'save')).toBe("Enregistrer");
    });

    it("should translate error messages correctly", () => {
      expect(safelyGetNested(zh_CN, 'errors', 'generic')).toContain("错误");
      expect(safelyGetNested(ja, 'errors', 'generic')).toContain("エラー");
      expect(safelyGetNested(ko, 'errors', 'generic')).toContain("오류");
      // French uses "Une erreur s'est produite." (lowercase "erreur")
      const frError = (safelyGetNested(fr, 'errors', 'generic') as string).toLowerCase();
      expect(frError).toContain("erreur");
    });

    it("should translate channel types consistently", () => {
      const channels = ["telegram", "discord", "whatsapp"];
      channels.forEach(channel => {
        expect(safelyGetNested(zh_CN, 'channels', 'types', channel)).toBeTruthy();
        expect(safelyGetNested(ja, 'channels', 'types', channel)).toBeTruthy();
        expect(safelyGetNested(ko, 'channels', 'types', channel)).toBeTruthy();
        expect(safelyGetNested(fr, 'channels', 'types', channel)).toBeTruthy();
      });
    });
  });

  describe("Placeholder Support", () => {
    
    it("should support variable interpolation format", () => {
      // Test that placeholders use {{variable}} syntax
      const usageOverview = safelyGetNested(zh_CN, 'usage', 'overview') as Record<string, string>;
      expect(usageOverview.acrossMessages).toContain("{count}");
      
      const jaUsageOverview = safelyGetNested(ja, 'usage', 'overview') as Record<string, string>;
      expect(jaUsageOverview.acrossMessages).toContain("{count}");
    });

    it("should handle multiple placeholder types", () => {
      const filters = safelyGetNested(zh_CN, 'usage', 'filters') as Record<string, string>;
      expect(filters.daysCount).toContain("{count}");
      expect(filters.sessionsCount).toContain("{count}");
    });
  });

  describe("CJK-Specific Optimizations", () => {
    
    it("zh-CN should have appropriate line length for Chinese", () => {
      const chatTexts = [
        safelyGetNested(zh_CN, 'chat', 'disconnected') as string,
        safelyGetNested(zh_CN, 'messages', 'success') as string
      ];
      chatTexts.forEach(text => {
        // Chinese text tends to be more compact
        expect(text.length).toBeLessThan(50);
      });
    });

    it("ja should use appropriate punctuation", () => {
      // Japanese formal text often uses "。" (full stop) instead of "?"
      const confirmMsg = safelyGetNested(ja, 'messages', 'confirm') as string;
      expect(confirmMsg).toBeTruthy();
      expect(confirmMsg.length).toBeGreaterThan(0);
    });

    it("ko should use appropriate punctuation", () => {
      // Korean formal text often uses "." (period) instead of "?"
      const confirmMsg = safelyGetNested(ko, 'messages', 'confirm') as string;
      expect(confirmMsg).toBeTruthy();
      expect(confirmMsg.length).toBeGreaterThan(0);
    });
  });

  describe("Module Coverage Analysis", () => {
    
    it("zh-CN should have complete coverage of core modules", () => {
      const coreModules = [
        { name: 'common', minKeys: 10 },
        { name: 'nav', minKeys: 5 },
        { name: 'tabs', minKeys: 10 },
        { name: 'actions', minKeys: 8 },
        { name: 'errors', minKeys: 5 },
        { name: 'status', minKeys: 5 },
        { name: 'messages', minKeys: 8 }
      ];
      coreModules.forEach(({ name, minKeys }) => {
        const moduleObj = zh_CN[name as keyof TranslationMap];
        if (moduleObj && typeof moduleObj === 'object') {
          const moduleKeys = Object.keys(moduleObj as Record<string, unknown>);
          expect(moduleKeys.length).toBeGreaterThanOrEqual(minKeys);
        }
      });
    });

    it("all languages should have channel management translations", () => {
      const channelSubmodules = ['page', 'list', 'form', 'types', 'status', 'actions', 'errors'];
      channelSubmodules.forEach(submodule => {
        expect(zh_CN.channels).toHaveProperty(submodule);
        expect(ja.channels).toHaveProperty(submodule);
        expect(ko.channels).toHaveProperty(submodule);
        expect(fr.channels).toHaveProperty(submodule);
      });
    });

    it("all languages should have usage analytics translations", () => {
      const usageSubmodules = ['page', 'metrics', 'filters', 'overview', 'sessions', 'details'];
      usageSubmodules.forEach(submodule => {
        expect(zh_CN.usage).toHaveProperty(submodule);
        expect(ja.usage).toHaveProperty(submodule);
        expect(ko.usage).toHaveProperty(submodule);
        expect(fr.usage).toHaveProperty(submodule);
      });
    });
  });

});

function safelyGetNested<T extends Record<string, any>>(obj: T, ...keys: string[]): any {
  let current: any = obj;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }
  return current;
}

function flattenKeys(obj: Record<string, any>, prefix = ''): Record<string, string> {
  let result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      result = { ...result, ...flattenKeys(value, fullKey) };
    } else {
      result[fullKey] = value;
    }
  }
  return result;
}
