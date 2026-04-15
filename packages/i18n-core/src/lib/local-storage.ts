/**
 * Safe localStorage access utility
 * Handles private browsing and SSR scenarios
 */

export function getSafeLocalStorage(): Storage | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const testKey = '__yyc3_test__';
    window.localStorage.setItem(testKey, 'test');
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch (e) {
    return null;
  }
}
