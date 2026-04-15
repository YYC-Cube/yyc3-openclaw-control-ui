/**
 * Enhanced I18n Engine (v2.0)
 * YYC³ i18n Core - Production-Ready Translation Engine
 * 
 * Features:
 * - LRU caching for performance
 * - Plugin architecture for extensibility
 * - Namespace support for large applications
 * - Batch translation API
 * - Comprehensive error handling
 * - Debug mode for development
 */

import { getSafeLocalStorage } from "./local-storage.js";
import { en } from "../locales/en.js";
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  isSupportedLocale,
  loadLazyLocaleTranslation,
  resolveNavigatorLocale,
} from "./registry.js";
import type { Locale, TranslationMap } from "./types.js";
import { LRUCache } from "./cache.js";
import { PluginManager } from "./plugins.js";

type Subscriber = (locale: Locale) => void;

export interface I18nEngineConfig {
  locale?: Locale;
  fallbackLocale?: Locale;
  cache?: {
    enabled?: boolean;
    maxSize?: number;
    ttl?: number;
  };
  debug?: boolean;
  onError?: (error: Error, context: { key: string; locale: Locale }) => void;
  missingKeyHandler?: (key: string, locale: Locale) => string;
}

interface I18nEngineState {
  locale: Locale;
  translations: Partial<Record<Locale, TranslationMap>>;
}

export class I18nEngine {
  private state: I18nEngineState;
  private subscribers: Set<Subscriber> = new Set();

  // New v2.0 features
  public readonly cache: LRUCache<string>;
  public readonly plugins: PluginManager;
  private debugMode = false;
  private errorHandler?: I18nEngineConfig["onError"];
  private missingKeyHandler?: I18nEngineConfig["missingKeyHandler"];

  constructor(config: I18nEngineConfig = {}) {
    // Initialize state
    this.state = {
      locale: config.locale ?? DEFAULT_LOCALE,
      translations: { [DEFAULT_LOCALE]: en },
    };

    // Initialize cache
    this.cache = new LRUCache({
      enabled: config.cache?.enabled ?? true,
      maxSize: config.cache?.maxSize ?? 1000,
      defaultTTL: config.cache?.ttl ?? 5 * 60 * 1000, // 5 minutes
    });

    // Initialize plugin system
    this.plugins = new PluginManager();

    // Store handlers
    this.errorHandler = config.onError;
    this.missingKeyHandler = config.missingKeyHandler;
    this.debugMode = config.debug ?? false;

    // Load initial locale
    this.loadInitialLocale();

    if (this.debugMode) {
      console.log(
        "%c🌐 I18n Engine v2.0 Initialized",
        "color: #00ff00; font-weight: bold; font-size: 14px;"
      );
      console.log(`   Locale: ${this.state.locale}`);
      console.log(`   Cache: ${this.cache.config.enabled ? "✅ Enabled" : "❌ Disabled"}`);
      console.log(`   Plugins: ${this.plugins.getRegisteredPlugins().length} registered`);
    }
  }

  private readStoredLocale(): string | null {
    const storage = getSafeLocalStorage();
    if (!storage) return null;

    try {
      return storage.getItem("openclaw.i18n.locale");
    } catch {
      return null;
    }
  }

  private persistLocale(locale: Locale): void {
    const storage = getSafeLocalStorage();
    if (!storage) return;

    try {
      storage.setItem("openclaw.i18n.locale", locale);
    } catch {
      // Ignore storage failures in private/blocked contexts
    }
  }

  private resolveInitialLocale(): Locale {
    const saved = this.readStoredLocale();
    if (saved && isSupportedLocale(saved)) {
      return saved;
    }

    const detected = resolveNavigatorLocale();

    return detected ?? DEFAULT_LOCALE;
  }

  private loadInitialLocale(): void {
    const initialLocale = this.resolveInitialLocale();
    if (initialLocale === DEFAULT_LOCALE) {
      this.state.locale = DEFAULT_LOCALE;
      return;
    }

    void this.setLocale(initialLocale);
  }

  public getLocale(): Locale {
    return this.state.locale;
  }

  public async setLocale(locale: Locale): Promise<void> {
    const needsTranslationLoad =
      locale !== DEFAULT_LOCALE && !this.state.translations[locale];

    if (this.state.locale === locale && !needsTranslationLoad) {
      return;
    }

    const oldLocale = this.state.locale;

    if (needsTranslationLoad) {
      try {
        const translation = await loadLazyLocaleTranslation(locale as Exclude<Locale, "en">);
        if (!translation) {
          const error = new Error(`Failed to load translation for locale: ${locale}`);
          this.handleError(error, { key: "", locale });
          return;
        }
        this.state.translations[locale] = translation;
      } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e));
        this.handleError(error, { key: "", locale });
        return;
      }
    }

    this.state.locale = locale;
    this.persistLocale(locale);

    // Invalidate cache on locale change
    this.cache.clear();

    // Notify plugins
    this.plugins.notifyLocaleChange(locale, oldLocale);

    // Notify subscribers
    this.notify();

    if (this.debugMode) {
      console.log(`%c🌍 Locale changed: ${oldLocale} → ${locale}`, "color: #0099ff;");
    }
  }

  public registerTranslation(locale: Locale, map: TranslationMap): void {
    this.state.translations[locale] = map;

    if (this.debugMode) {
      console.log(`📦 Translation registered for locale: ${locale}`);
    }
  }

  public subscribe(sub: Subscriber): () => void {
    this.subscribers.add(sub);
    return () => this.subscribers.delete(sub);
  }

  private notify(): void {
    for (const sub of this.subscribers) {
      sub(this.state.locale);
    }
  }

  /**
   * Main translation method with caching and plugin support
   */
  public t(key: string, params?: Record<string, string>): string {
    try {
      // Check cache first
      const cached = this.cache.get(`${this.state.locale}:${key}`);
      if (cached !== null) {
        return params ? this.interpolate(cached, params) : cached;
      }

      // Execute beforeTranslate plugins
      const { key: modifiedKey, params: modifiedParams } =
        this.plugins.executeBeforeTranslate(key, params);

      // Resolve translation value
      let value = this.resolveTranslation(modifiedKey);

      // Handle missing keys
      if (value === undefined || value === modifiedKey) {
        const fallback = this.plugins.handleMissingKey(modifiedKey, this.state.locale)
          ?? this.missingKeyHandler?.(modifiedKey, this.state.locale)
          ?? modifiedKey;

        if (this.debugMode && fallback === modifiedKey) {
          console.warn(`[i18n] Missing translation key: "${modifiedKey}"`);
        }

        value = fallback;
      }

      // Interpolate parameters
      if (params || modifiedParams) {
        value = this.interpolate(value, { ...params, ...modifiedParams });
      }

      // Execute afterTranslate plugins
      value = this.plugins.executeAfterTranslate(value, modifiedKey, params);

      // Cache the result
      this.cache.set(`${this.state.locale}:${key}`, value);

      return value;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.handleError(err, { key, locale: this.state.locale });
      return key; // Fallback to raw key
    }
  }

  /**
   * Batch translate multiple keys at once
   */
  public batchTranslate(
    keys: string[],
    params?: Record<string, Record<string, string>>
  ): Record<string, string> {
    const results: Record<string, string> = {};

    for (const key of keys) {
      results[key] = this.t(key, params?.[key]);
    }

    return results;
  }

  /**
   * Create a namespaced translator
   */
  public createNamespace(prefix: string): {
    t: (key: string, params?: Record<string, string>) => string;
    batchTranslate: (keys: string[]) => Record<string, string>;
    getLocale: () => Locale;
  } {
    return {
      t: (key, params) => this.t(`${prefix}.${key}`, params),
      batchTranslate: (keys) =>
        Object.fromEntries(keys.map((k) => [k, this.t(`${prefix}.${k}`)])),
      getLocale: () => this.getLocale(),
    };
  }

  private resolveTranslation(key: string): string | undefined {
    const keys = key.split(".");
    let value: unknown =
      this.state.translations[this.state.locale] ??
      this.state.translations[DEFAULT_LOCALE];

    for (const k of keys) {
      if (value && typeof value === "object") {
        value = (value as Record<string, unknown>)[k];
      } else {
        value = undefined;
        break;
      }
    }

    // Fallback to English if not found in current locale
    if (
      value === undefined &&
      this.state.locale !== DEFAULT_LOCALE
    ) {
      value = this.state.translations[DEFAULT_LOCALE];
      for (const k of keys) {
        if (value && typeof value === "object") {
          value = (value as Record<string, unknown>)[k];
        } else {
          value = undefined;
          break;
        }
      }
    }

    return typeof value === "string" ? value : undefined;
  }

  private interpolate(
    template: string,
    params: Record<string, string>
  ): string {
    return template.replace(/\{(\w+)\}/g, (_, k) => params[k] ?? `{${k}}`);
  }

  private handleError(
    error: Error,
    context: { key: string; locale: Locale }
  ): void {
    // Call custom error handler if provided
    this.errorHandler?.(error, context);

    // Notify plugins
    this.plugins.handleError(error, context);

    // Log in debug mode
    if (this.debugMode) {
      console.error("[i18n] Error:", error.message, context);
    }
  }

  /**
   * Enable/disable debug mode
   */
  public setDebug(enabled: boolean): void {
    this.debugMode = enabled;

    if (enabled) {
      console.log("%c🔧 i18n Debug Mode ENABLED", "color: #ff9900; font-weight: bold;");

      // Attach debug utilities to window
      (globalThis as any).__i18n_debug__ = {
        engine: this,
        getStats: () => this.getStats(),
        clearCache: () => this.cache.clear(),
        getPlugins: () => this.plugins.getRegisteredPlugins(),
        testTranslation: (key: string) => this.t(key),
      };
    } else {
      delete (globalThis as any).__i18n_debug__;
    }
  }

  /**
   * Get comprehensive statistics
   */
  public getStats(): {
    locale: Locale;
    cache: ReturnType<LRUCache<string>["getStats"]>;
    plugins: string[];
    subscriberCount: number;
    loadedLocales: string[];
  } {
    return {
      locale: this.state.locale,
      cache: this.cache.getStats(),
      plugins: this.plugins.getRegisteredPlugins(),
      subscriberCount: this.subscribers.size,
      loadedLocales: Object.keys(this.state.translations),
    };
  }

  /**
   * Destroy the engine instance (cleanup)
   */
  public async destroy(): Promise<void> {
    await this.plugins.destroyAll();
    this.cache.clear();
    this.subscribers.clear();

    if (this.debugMode) {
      console.log("%c🗑️ I18n Engine destroyed", "color: #ff0000;");
    }
  }
}

// Singleton instance for backward compatibility
export const i18n = new I18nEngine();

// Convenience export
export const t = (key: string, params?: Record<string, string>) =>
  i18n.t(key, params);

export { SUPPORTED_LOCALES, isSupportedLocale };
