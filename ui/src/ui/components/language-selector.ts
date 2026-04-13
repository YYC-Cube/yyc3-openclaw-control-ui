import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { Locale } from "../../i18n/lib/types.js";
import { isRTL, setupDocumentDirection } from "../../i18n/lib/rtl-utils.js";

interface LanguageOption {
  value: Locale;
  label: string;
  nativeName: string;
  flag: string;
}

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { value: "en", label: "English", nativeName: "English", flag: "🇺🇸" },
  { value: "zh-CN", label: "中文 (简体)", nativeName: "简体中文", flag: "🇨🇳" },
  { value: "zh-TW", label: "繁體中文", nativeName: "繁體中文", flag: "🇹🇼" },
  { value: "ja", label: "日本語", nativeName: "日本語", flag: "🇯🇵" },
  { value: "ko", label: "한국어", nativeName: "한국어", flag: "🇰🇷" },
  { value: "fr", label: "Français", nativeName: "Français", flag: "🇫🇷" },
  { value: "de", label: "Deutsch", nativeName: "Deutsch", flag: "🇩🇪" },
  { value: "es", label: "Español", nativeName: "Español", flag: "🇪🇸" },
  { value: "pt-BR", label: "Português (BR)", nativeName: "Português", flag: "🇧🇷" },
  { value: "ar", label: "العربية", nativeName: "العربية", flag: "🇸🇦" },
];

@customElement("language-selector")
export class LanguageSelector extends LitElement {
  static override styles = css`
    :host {
      display: inline-block;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    .selector-wrapper {
      position: relative;
      display: inline-block;
    }

    .selector-button {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border: 1px solid var(--border-color, #e0e0e0);
      border-radius: 8px;
      background-color: var(--bg-primary, #ffffff);
      color: var(--text-primary, #333333);
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
      user-select: none;
    }

    .selector-button:hover {
      background-color: var(--bg-hover, #f5f5f5);
      border-color: var(--border-hover, #d0d0d0);
    }

    .selector-button:focus {
      outline: none;
      box-shadow: 0 0 0 2px var(--primary-color, #4a90d9);
    }

    .selector-button[aria-expanded="true"] {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

    .flag {
      font-size: 20px;
      line-height: 1;
    }

    .current-language {
      flex: 1;
      text-align: left;
    }

    .chevron {
      transition: transform 0.2s ease;
      font-size: 12px;
      color: var(--text-secondary, #666666);
    }

    .selector-button[aria-expanded="true"] .chevron {
      transform: rotate(180deg);
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      margin-top: -1px;
      padding: 8px 0;
      background-color: var(--bg-primary, #ffffff);
      border: 1px solid var(--border-color, #e0e0e0);
      border-radius: 0 0 8px 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      max-height: 320px;
      overflow-y: auto;
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.2s ease, visibility 0.2s ease;
    }

    .dropdown-menu.open {
      opacity: 1;
      visibility: visible;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 16px;
      cursor: pointer;
      transition: background-color 0.15s ease;
      border: none;
      background: transparent;
      width: 100%;
      text-align: left;
      font-size: 14px;
      color: var(--text-primary, #333333);
    }

    .dropdown-item:hover {
      background-color: var(--bg-hover, #f5f5f5);
    }

    .dropdown-item.selected {
      background-color: var(--bg-selected, #e3f2fd);
      color: var(--primary-color, #1976d2);
      font-weight: 500;
    }

    .dropdown-item .flag {
      font-size: 18px;
    }

    .dropdown-item-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .native-name {
      font-weight: 500;
    }

    .label-name {
      font-size: 12px;
      color: var(--text-secondary, #666666);
    }

    /* RTL Support */
    :host([dir="rtl"]) .selector-button,
    :host([dir="rtl"]) .dropdown-item {
      text-align: right;
    }

    :host([dir="rtl"]) .current-language {
      text-align: right;
    }

    :host([dir="rtl"]) .chevron {
      margin-right: auto;
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      .selector-button {
        padding: 6px 12px;
        font-size: 13px;
      }

      .flag {
        font-size: 16px;
      }

      .dropdown-menu {
        max-height: 280px;
      }
    }

    /* Dark Mode */
    @media (prefers-color-scheme: dark) {
      :host-context(body.dark) .selector-button,
      :host-context(body[data-theme="dark"]) .selector-button {
        background-color: var(--bg-primary-dark, #1e1e1e);
        border-color: var(--border-color-dark, #404040);
        color: var(--text-primary-dark, #e0e0e0);
      }

      :host-context(body.dark) .dropdown-menu,
      :host-context(body[data-theme="dark"]) .dropdown-menu {
        background-color: var(--bg-primary-dark, #1e1e1e);
        border-color: var(--border-color-dark, #404040);
      }

      :host-context(body.dark) .dropdown-item,
      :host-context(body[data-theme="dark"]) .dropdown-item {
        color: var(--text-primary-dark, #e0e0e0);
      }

      :host-context(body.dark) .dropdown-item:hover,
      :host-context(body[data-theme="dark"]) .dropdown-item:hover {
        background-color: var(--bg-hover-dark, #2a2a2a);
      }

      :host-context(body.dark) .dropdown-item.selected,
      :host-context(body[data-theme="dark"]) .dropdown-item.selected {
        background-color: var(--bg-selected-dark, #1a237e);
        color: var(--primary-color-light, #64b5f6);
      }
    }
  `;

  @property({ type: String }) value: Locale = "en";

  @property({ type: Boolean }) compact: boolean = false;

  @property({ type: Boolean }) showFlags: boolean = true;

  @state() private _isOpen: boolean = false;

  private _closeHandler: ((event: MouseEvent) => void) | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    this._loadSavedLocale();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._removeCloseListener();
  }

  private _loadSavedLocale(): void {
    try {
      const saved = localStorage.getItem("locale") || sessionStorage.getItem("locale");
      if (saved && this._isValidLocale(saved)) {
        this.value = saved;
      }
    } catch {
      // localStorage not available
    }
  }

  private _isValidLocale(locale: string): locale is Locale {
    return LANGUAGE_OPTIONS.some(opt => opt.value === locale);
  }

  private _toggleDropdown(): void {
    this._isOpen = !this._isOpen;

    if (this._isOpen) {
      this._addCloseListener();
    } else {
      this._removeCloseListener();
    }
  }

  private _addCloseListener(): void {
    // Delay to prevent immediate close
    setTimeout(() => {
      this._closeHandler = (event: MouseEvent) => {
        const target = event.target as Node;
        if (!this.contains(target)) {
          this._isOpen = false;
          this._removeCloseListener();
        }
      };
      document.addEventListener("click", this._closeHandler);
    }, 0);
  }

  private _removeCloseListener(): void {
    if (this._closeHandler) {
      document.removeEventListener("click", this._closeHandler);
      this._closeHandler = null;
    }
  }

  private _selectLanguage(option: LanguageOption): void {
    const oldValue = this.value;
    this.value = option.value;
    this._isOpen = false;
    this._removeCloseListener();

    // Save preference
    try {
      localStorage.setItem("locale", option.value);
    } catch {
      // localStorage not available
    }

    // Apply RTL direction if needed
    if (isRTL(option.value)) {
      setupDocumentDirection(option.value);
    }

    // Dispatch change event
    if (oldValue !== option.value) {
      this.dispatchEvent(
        new CustomEvent("language-change", {
          detail: {
            oldValue,
            newValue: option.value,
            option,
          },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  private _getCurrentOption(): LanguageOption {
    return (
      LANGUAGE_OPTIONS.find(opt => opt.value === this.value) || LANGUAGE_OPTIONS[0]
    );
  }

  override render() {
    const currentOption = this._getCurrentOption();
    const dir = isRTL(this.value) ? "rtl" : "ltr";

    return html`
      <div class="selector-wrapper" dir=${dir}>
        <button
          class="selector-button"
          aria-expanded="${this._isOpen}"
          aria-haspopup="listbox"
          @click=${this._toggleDropdown}
          data-testid="language-selector"
        >
          ${this.showFlags ? html`<span class="flag">${currentOption.flag}</span>` : ""}
          ${!this.compact
            ? html`<span class="current-language">${currentOption.nativeName}</span>`
            : ""}
          <span class="chevron">▼</span>
        </button>

        <div
          class="dropdown-menu ${this._isOpen ? "open" : ""}"
          role="listbox"
          aria-label="Select language"
        >
          ${LANGUAGE_OPTIONS.map(
            option => html`
              <button
                class="dropdown-item ${option.value === this.value ? "selected" : ""}"
                role="option"
                aria-selected="${option.value === this.value}"
                @click=${() => this._selectLanguage(option)}
              >
                ${this.showFlags ? html`<span class="flag">${option.flag}</span>` : ""}
                <div class="dropdown-item-content">
                  <span class="native-name">${option.nativeName}</span>
                  <span class="label-name">${option.label}</span>
                </div>
              </button>
            `,
          )}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "language-selector": LanguageSelector;
  }
}
