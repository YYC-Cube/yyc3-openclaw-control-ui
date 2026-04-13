/**
 * Type-safe translation module loader for tests
 * Handles different export styles (named, default, direct)
 */

export interface TranslationMap {
  [key: string]: any;
}

export async function loadTranslationModule(
  modulePath: string,
  exportName?: string
): Promise<TranslationMap> {
  const mod = await import(modulePath);

  // Try named export first (e.g., zh_CN, ja, ar)
  if (exportName && mod[exportName]) {
    return mod[exportName] as TranslationMap;
  }

  // Try default export
  if (mod.default && typeof mod.default === "object") {
    return mod.default as TranslationMap;
  }

  // Fallback: treat the entire module as TranslationMap
  return mod as unknown as TranslationMap;
}

export async function loadLocale(locale: string): Promise<TranslationMap> {
  const exportNameMap: Record<string, string> = {
    "zh-CN": "zh_CN",
    "zh-TW": "zh_TW",
    "pt-BR": "pt_BR",
  };
  
  const exportName = exportNameMap[locale] || locale;
  // Use correct relative path from helpers directory
  const modulePath = `../../i18n/locales/${locale}.ts`;
  
  return loadTranslationModule(modulePath, exportName);
}
