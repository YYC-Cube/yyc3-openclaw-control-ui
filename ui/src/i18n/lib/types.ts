export type TranslationMap = { [key: string]: string | TranslationMap };

export type Locale =
  | "en"
  | "zh-CN"
  | "zh-TW"
  | "ja"
  | "ko"
  | "fr"
  | "de"
  | "es"
  | "pt-BR"
  | "ar";

export type RTLLocale = Extract<Locale, "ar">;

export interface I18nConfig {
  locale: Locale;
  fallbackLocale: Locale;
  translations: Partial<Record<Locale, TranslationMap>>;
  rtlSupport?: boolean;
}
