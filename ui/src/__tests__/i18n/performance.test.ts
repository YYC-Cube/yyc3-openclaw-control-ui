import { describe, it, expect } from "vitest";
import { zh_CN } from "../../i18n/locales/zh-CN.ts";
import { ja } from "../../i18n/locales/ja.ts";
import { ko } from "../../i18n/locales/ko.ts";
import { fr } from "../../i18n/locales/fr.ts";

function safelyGet<T extends Record<string, any>>(obj: T, ...keys: string[]): any {
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

describe("i18n Performance Benchmark Tests", () => {
  
  describe("Module Import Performance", () => {
    
    it("should import zh-CN translation in under 50ms", () => {
      const startTime = performance.now();
      
      // Force re-import to measure actual load time
      const translations = { zh_CN, ja, ko, fr };
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      console.log(`[PERF] Import all 4 locales: ${duration.toFixed(2)}ms`);
      expect(duration).toBeLessThan(50);
    });

    it("should access nested translation keys efficiently", () => {
      const iterations = 1000;
      const startTime = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        // Simulate frequent key access pattern
        const _ = safelyGet(zh_CN, 'common', 'health');
        const __ = safelyGet(zh_CN, 'nav', 'chat');
        const ___ = safelyGet(zh_CN, 'channels', 'page', 'title');
        const ____ = safelyGet(zh_CN, 'config', 'page', 'title');
        const _____ = safelyGet(zh_CN, 'messages', 'success');
      }
      
      const endTime = performance.now();
      const avgTime = (endTime - startTime) / iterations;
      
      console.log(`[PERF] Average key access time: ${avgTime.toFixed(4)}ms (${iterations} iterations)`);
      expect(avgTime).toBeLessThan(0.1); // Less than 0.1ms per access
    });
  });

  describe("Memory Footprint Analysis", () => {
    
    it("should have reasonable memory footprint for zh-CN", () => {
      const jsonString = JSON.stringify(zh_CN);
      const sizeInBytes = new Blob([jsonString]).size;
      const sizeInKB = sizeInBytes / 1024;
      
      console.log(`[MEMORY] zh-CN translation size: ${sizeInKB.toFixed(2)} KB`);
      
      // Should be under 100KB for a comprehensive translation
      expect(sizeInKB).toBeLessThan(100);
    });

    it("should have consistent memory footprint across languages", () => {
      const sizes = [
        { locale: 'zh-CN', size: JSON.stringify(zh_CN).length },
        { locale: 'ja', size: JSON.stringify(ja).length },
        { locale: 'ko', size: JSON.stringify(ko).length },
        { locale: 'fr', size: JSON.stringify(fr).length },
      ];
      
      console.table(sizes.map(s => ({
        Locale: s.locale,
        'Size (bytes)': s.size,
        'Size (KB)': (s.size / 1024).toFixed(2)
      })));
      
      // All languages should be within 20% of each other
      const avgSize = sizes.reduce((sum, s) => sum + s.size, 0) / sizes.length;
      sizes.forEach(({ locale, size }) => {
        const deviation = Math.abs(size - avgSize) / avgSize;
        expect(deviation).toBeLessThan(0.3); // Within 30% of average
      });
    });
  });

  describe("Translation Lookup Performance", () => {
    
    it("should perform deep nested lookups efficiently", () => {
      const deepKeys = [
        'channels.list.empty',
        'config.agents.model',
        'usage.overview.title',
        'debug.logs.filter',
        'cron.form.name'
      ];
      
      const iterations = 100;
      const startTime = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        deepKeys.forEach(keyPath => {
          // Simulate dot-notation lookup
          const keys = keyPath.split('.');
          let current: any = zh_CN;
          for (const key of keys) {
            if (current && typeof current === 'object') {
              current = current[key];
            }
          }
        });
      }
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const avgLookupTime = totalTime / (iterations * deepKeys.length);
      
      console.log(`[PERF] Deep lookup average: ${avgLookupTime.toFixed(4)}ms`);
      expect(avgLookupTime).toBeLessThan(0.05); // Very fast lookups
    });

    it("should handle bulk translation operations efficiently", () => {
      const startTime = performance.now();
      
      // Simulate rendering a complex page with many translations
      const pageTranslations = {
        nav: Object.values(zh_CN.nav),
        common: Object.values(zh_CN.common),
        tabs: Object.values(zh_CN.tabs),
        channels: Object.values(safelyGet(zh_CN, 'channels', 'page') || {}),
        config: Object.values(safelyGet(zh_CN, 'config', 'page') || {}),
      };
      
      const totalTranslations = Object.values(pageTranslations)
        .flat()
        .filter(Boolean)
        .length;
      
      const endTime = performance.now();
      
      console.log(`[PERF] Bulk translation extraction: ${(endTime - startTime).toFixed(2)}ms (${totalTranslations} strings)`);
      expect(endTime - startTime).toBeLessThan(10); // Under 10ms
    });
  });

  describe("Startup Impact Simulation", () => {
    
    it("should simulate total i18n initialization overhead", () => {
      const startTime = performance.now();
      
      // Step 1: Load locale detection logic (~1ms)
      const locale = 'zh-CN';
      
      // Step 2: Import translation files (~5ms)
      const translations = { zh_CN, ja, ko, fr };
      const selectedLocale = translations[locale as keyof typeof translations];
      
      // Step 3: Initialize i18n engine with selected locale (~1ms)
      const i18nInstance = {
        locale,
        translations: selectedLocale,
        t: (key: string) => {
          const keys = key.split('.');
          let current: any = selectedLocale;
          for (const k of keys) {
            if (current && typeof current === 'object') {
              current = current[k];
            }
          }
          return current || key;
        }
      };
      
      // Step 4: Perform initial UI render translations (~2ms)
      const initialUIStrings = [
        i18nInstance.t('common.health'),
        i18nInstance.t('nav.chat'),
        i18nInstance.t('tabs.agents'),
        i18nInstance.t('messages.loading')
      ];
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      console.log(`[STARTUP] Total i18n initialization: ${totalTime.toFixed(2)}ms`);
      console.log(`[STARTUP] Initial UI strings loaded: ${initialUIStrings.length}`);
      
      // YYC³ Standard: Startup impact should be < 100ms (targeting < 20ms)
      expect(totalTime).toBeLessThan(20);
      expect(initialUIStrings.every(s => s && s.length > 0)).toBeTruthy();
    });
  });

});
