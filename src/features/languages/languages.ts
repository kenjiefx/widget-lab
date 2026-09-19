export interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

/**
 * Languages supported by Yotpo Reviews and Widgets.
 * All use standard two-letter ISO 639-1 language codes, except:
 * - Chinese (Simplified): zh-CN
 * - Chinese (Traditional): zh-TW
 * - Portuguese (Brazil): pt-BR
 * - Portuguese (Portugal): pt-PT
 * Default / fallback: English (en)
 */
export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "zh-CN", name: "Chinese (Simplified)", flag: "🇨🇳" },
  { code: "zh-TW", name: "Chinese (Traditional)", flag: "🇹🇼" },
  { code: "hr", name: "Croatian", flag: "🇭🇷" },
  { code: "cs", name: "Czech", flag: "🇨🇿" },
  { code: "da", name: "Danish", flag: "🇩🇰" },
  { code: "nl", name: "Dutch", flag: "🇳🇱" },
  { code: "fi", name: "Finnish", flag: "🇫🇮" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "el", name: "Greek", flag: "🇬🇷" },
  { code: "he", name: "Hebrew", flag: "🇮🇱" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "hu", name: "Hungarian", flag: "🇭🇺" },
  { code: "id", name: "Indonesian", flag: "🇮🇩" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "lt", name: "Lithuanian", flag: "🇱🇹" },
  { code: "ms", name: "Malay", flag: "🇲🇾" },
  { code: "no", name: "Norwegian", flag: "🇳🇴" },
  { code: "pl", name: "Polish", flag: "🇵🇱" },
  { code: "pt-BR", name: "Portuguese (Brazil)", flag: "🇧🇷" },
  { code: "pt-PT", name: "Portuguese (Portugal)", flag: "🇵🇹" },
  { code: "ro", name: "Romanian", flag: "🇷🇴" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "sk", name: "Slovak", flag: "🇸🇰" },
  { code: "sl", name: "Slovenian", flag: "🇸🇮" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "sv", name: "Swedish", flag: "🇸🇪" },
  { code: "th", name: "Thai", flag: "🇹🇭" },
  { code: "tr", name: "Turkish", flag: "🇹🇷" },
  { code: "vi", name: "Vietnamese", flag: "🇻🇳" },
];

/**
 * Map of lowercased language code to canonical LanguageOption.
 */
const LANGUAGE_BY_LOWER_CODE = new Map<string, LanguageOption>();
for (const lang of SUPPORTED_LANGUAGES) {
  LANGUAGE_BY_LOWER_CODE.set(lang.code.toLowerCase(), lang);
}

// Aliases for compatibility
LANGUAGE_BY_LOWER_CODE.set("pt", {
  code: "pt-PT",
  name: "Portuguese (Portugal)",
  flag: "🇵🇹",
});
LANGUAGE_BY_LOWER_CODE.set("zh", {
  code: "zh-CN",
  name: "Chinese (Simplified)",
  flag: "🇨🇳",
});

/**
 * Validates if the given code is a supported Yotpo language code.
 * Accepts standard 2-letter codes, valid exceptions (zh-CN, zh-TW, pt-BR, pt-PT),
 * and case-insensitive variations.
 */
export function isValidLanguageCode(code: string): boolean {
  if (!code || typeof code !== "string") {
    return false;
  }
  return LANGUAGE_BY_LOWER_CODE.has(code.trim().toLowerCase());
}

/**
 * Canonicalizes a language code (e.g. "zh-cn" -> "zh-CN", "EN" -> "en").
 * If unknown, returns fallback "en".
 */
export function canonicalizeLanguageCode(code: string): string {
  if (!code || typeof code !== "string") {
    return "en";
  }
  const match = LANGUAGE_BY_LOWER_CODE.get(code.trim().toLowerCase());
  return match ? match.code : "en";
}

/**
 * Finds language option metadata by code.
 */
export function getLanguageByCode(code: string): LanguageOption {
  const canonical = canonicalizeLanguageCode(code);
  return (
    SUPPORTED_LANGUAGES.find((l) => l.code === canonical) ||
    SUPPORTED_LANGUAGES[0]
  );
}
