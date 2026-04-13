/**
 * i18n Visual Regression Test Suite
 * Tests for multi-language UI rendering and RTL support
 * Browser mode tests using Playwright via @vitest/browser-playwright
 */

import { test, expect, describe } from "vitest";
import { loadLocale } from "../helpers/translation-loader.js";

describe("i18n Multi-Language Rendering", () => {

  describe("Chinese (zh-CN) Language Support", () => {

    test("should have complete Chinese translations for navigation", async () => {
      const zhCN = await loadLocale("zh-CN");

      expect(zhCN.nav.chat).toBe("聊天");
      expect(zhCN.nav.control).toBe("控制");
      expect(zhCN.nav.settings).toBe("设置");
    });

    test("should have Chinese status indicators", async () => {
      const zhCN = await loadLocale("zh-CN");

      expect(zhCN.common.online).toBe("在线");
      expect(zhCN.common.offline).toBe("离线");
    });

    test("should contain CJK characters in Chinese translations", async () => {
      const zhCN = await loadLocale("zh-CN");

      const allText = JSON.stringify(zhCN);
      // CJK Unified Ideographs range: U+4E00 to U+9FFF
      const hasCJK = /[\u4e00-\u9fff]/.test(allText);
      expect(hasCJK).toBeTruthy();
    });
  });

  describe("Japanese (ja) Language Support", () => {

    test("should have Japanese navigation translations", async () => {
      const ja = await loadLocale("ja");

      expect(ja.nav.chat).toBe("チャット");
      expect(ja.nav.control).toBe("コントロール");
    });

    test("should contain Hiragana and Katakana characters", async () => {
      const ja = await loadLocale("ja");

      const allText = JSON.stringify(ja);
      // Hiragana range: U+3040 to U+309F
      // Katakana range: U+30A0 to U+30FF
      const hasHiragana = /[\u3040-\u309f]/.test(allText);
      const hasKatakana = /[\u30a0-\u30ff]/.test(allText);

      expect(hasHiragana || hasKatakana).toBeTruthy();
    });
  });

  describe("Korean (ko) Language Support", () => {

    test("should have Korean navigation translations", async () => {
      const ko = await loadLocale("ko");

      expect(ko.nav.chat).toBe("채팅");
      expect(ko.nav.control).toBe("제어");
    });

    test("should contain Hangul characters", async () => {
      const ko = await loadLocale("ko");

      const allText = JSON.stringify(ko);
      // Hangul Syllables range: U+AC00 to U+D7AF
      const hasHangul = /[\uac00-\ud7af]/.test(allText);
      expect(hasHangul).toBeTruthy();
    });
  });

  describe("French (fr) Language Support", () => {

    test("should have French navigation translations", async () => {
      const fr = await loadLocale("fr");

      expect(fr.nav.chat).toBe("Chat");
      expect(fr.nav.control).toBe("Contrôle");
    });

    test("should contain French accent characters", async () => {
      const fr = await loadLocale("fr");

      const allText = JSON.stringify(fr);
      // French accented characters
      const hasAccents = /[àâäéèêëïîôùûüç]/.test(allText);
      expect(hasAccents).toBeTruthy();
    });
  });

  describe("Arabic (ar) RTL Language Support", () => {

    test("should be identified as RTL locale", async () => {
      const { isRTL } = await import("../../i18n/lib/rtl-utils.js");

      expect(isRTL("ar")).toBeTruthy();
    });

    test("should return rtl direction", async () => {
      const { getDirection } = await import("../../i18n/lib/rtl-utils.js");

      expect(getDirection("ar")).toBe("rtl");
    });

    test("should have Arabic navigation translations", async () => {
      const ar = await loadLocale("ar");

      expect(ar.nav.chat).toBe("الدردشة");
      expect(ar.nav.control).toBe("التحكم");
      expect(ar.nav.settings).toBe("الإعدادات");
    });

    test("should contain Arabic script characters", async () => {
      const ar = await loadLocale("ar");

      const allText = JSON.stringify(ar);
      // Arabic Unicode range: U+0600 to U+06FF
      const hasArabic = /[\u0600-\u06ff]/.test(allText);
      expect(hasArabic).toBeTruthy();
    });
  });

  describe("Language Switching Behavior", () => {

    test("should support all 10 locales in registry", async () => {
      const { SUPPORTED_LOCALES } = await import("../../i18n/lib/registry.js");

      const expectedLocales = ["en", "zh-CN", "zh-TW", "ja", "ko", "fr", "de", "es", "pt-BR", "ar"];
      expectedLocales.forEach(locale => {
        expect(SUPPORTED_LOCALES).toContain(locale);
      });
    });

    test("should correctly resolve navigator language", async () => {
      const { resolveNavigatorLocale } = await import("../../i18n/lib/registry.js");

      expect(resolveNavigatorLocale("zh-CN")).toBe("zh-CN");
      expect(resolveNavigatorLocale("zh-TW")).toBe("zh-TW");
      expect(resolveNavigatorLocale("ja")).toBe("ja");
      expect(resolveNavigatorLocale("ko")).toBe("ko");
      expect(resolveNavigatorLocale("fr")).toBe("fr");
      expect(resolveNavigatorLocale("ar")).toBe("ar");
    });
  });

  describe("Typography & Font Support", () => {

    test("should load translation modules successfully", async () => {
      const translations = await Promise.all([
        loadLocale("zh-CN"),
        loadLocale("ar"),
        loadLocale("ja"),
        loadLocale("ko"),
      ]);

      // Verify all translation modules loaded successfully
      translations.forEach(t => {
        expect(t).toBeDefined();
        expect(Object.keys(t).length).toBeGreaterThan(0);
      });
    });
  });
});
