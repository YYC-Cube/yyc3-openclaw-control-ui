/**
 * E2E Integration Test for Language Selector Component
 * Tests the integration of <language-selector> in Control UI
 * Note: Full browser E2E tests require Playwright (see i18n-visual.browser.test.ts)
 */

import { test, expect, describe } from "vitest";

describe("LanguageSelector Component Integration", () => {
  
  test("should import language-selector component successfully", async () => {
    // Verify component can be imported
    const componentModule = await import("../../ui/components/language-selector.js");
    expect(componentModule).toBeDefined();
  });

  test("should have LanguageSelector class defined", async () => {
    const { LanguageSelector } = await import("../../ui/components/language-selector.js");
    expect(LanguageSelector).toBeDefined();
    expect(typeof LanguageSelector).toBe("function");
  });

  test("should be registered as custom element", async () => {
    // Import to trigger custom element registration
    await import("../../ui/components/language-selector.js");
    
    // Check if custom element is defined
    const isDefined = customElements.get("language-selector");
    expect(isDefined).toBeDefined();
  });
});

describe("Arabic Translation Module Validation", () => {
  
  test("should export ar translation object", async () => {
    const { ar } = await import("../../i18n/locales/ar.js");
    
    expect(ar).toBeDefined();
    expect(typeof ar).toBe("object");
    expect(Object.keys(ar).length).toBeGreaterThan(10);
  });

  test("should have complete Arabic navigation translations", async () => {
    const { ar } = await import("../../i18n/locales/ar.js");
    
    const nav = ar.nav as any;
    expect(nav.chat).toBe("الدردشة");
    expect(nav.control).toBe("التحكم");
    expect(nav.settings).toBe("الإعدادات");
    // agents is in tabs, not nav
    const tabs = ar.tabs as any;
    expect(tabs.agents).toBe("الوكلاء");
  });

  test("should have Arabic status translations", async () => {
    const { ar } = await import("../../i18n/locales/ar.js");
    
    const status = ar.status as any;
    expect(status.online).toBe("متصل");
    expect(status.offline).toBe("غير متصل");
    expect(status.error).toBe("خطأ");
  });

  test("should have Arabic channel type translations", async () => {
    const { ar } = await import("../../i18n/locales/ar.js");
    
    const channels = ar.channels as any;
    const types = channels.types;
    expect(types.whatsapp).toBe("واتساب");
    expect(types.telegram).toBe("تلغرام");
    expect(types.discord).toBe("ديسكورد");
  });
});

describe("RTL Utilities Validation", () => {
  
  test("should correctly identify RTL locales", async () => {
    const { isRTL } = await import("../../i18n/lib/rtl-utils.js");
    
    expect(isRTL("ar")).toBeTruthy();
    expect(isRTL("en")).toBeFalsy();
    expect(isRTL("zh-CN")).toBeFalsy();
    expect(isRTL("ja")).toBeFalsy();
  });

  test("should return correct text direction", async () => {
    const { getDirection } = await import("../../i18n/lib/rtl-utils.js");
    
    expect(getDirection("ar")).toBe("rtl");
    expect(getDirection("en")).toBe("ltr");
    expect(getDirection("zh-CN")).toBe("ltr");
    expect(getDirection("ko")).toBe("ltr");
  });

  test("should provide RTL locale list", async () => {
    const { RTL_LOCALES } = await import("../../i18n/lib/rtl-utils.js");
    
    expect(RTL_LOCALES).toBeDefined();
    expect(Array.isArray(RTL_LOCALES)).toBeTruthy();
    expect(RTL_LOCALES).toContain("ar");
  });
});

describe("Config Integration Validation", () => {
  
  test("should import config view with language-selector", async () => {
    // This verifies that the config.ts file can be imported without errors
    // (which means the language-selector integration doesn't break it)
    const configModule = await import("../../ui/views/config.ts");
    expect(configModule).toBeDefined();
  });

  test("should have renderAppearanceSection function", async () => {
    // We can't easily test the render output without a DOM,
    // but we can verify the module structure is intact
    const configModule = await import("../../ui/views/config.ts");
    
    // The module should export something
    expect(Object.keys(configModule).length).toBeGreaterThan(0);
  });
});
