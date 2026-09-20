import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check, X, Globe } from "lucide-react";
import {
  SUPPORTED_LANGUAGES,
  getLanguageByCode,
  LanguageOption,
} from "../../../features/languages/languages";

type Props = {
  currentLanguage: string;
  onSelectLanguage: (languageCode: string) => void;
};

export default function LanguageDropdown({
  currentLanguage,
  onSelectLanguage,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption: LanguageOption = getLanguageByCode(currentLanguage);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      // Small timeout to ensure menu is rendered
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const filteredLanguages = SUPPORTED_LANGUAGES.filter((lang) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      lang.name.toLowerCase().includes(q) ||
      lang.code.toLowerCase().includes(q)
    );
  });

  const handleSelect = (code: string) => {
    onSelectLanguage(code);
    setIsOpen(false);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (filteredLanguages.length > 0) {
        handleSelect(filteredLanguages[0].code);
      }
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selector Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Current language: ${selectedOption.name}. Click to change language`}
        title={`Language: ${selectedOption.name} (${selectedOption.code})`}
        className={`h-[38px] sm:h-[40px] px-2.5 sm:px-3 rounded-xl border bg-white flex items-center gap-1.5 sm:gap-2 text-xs sm:text-[0.85rem] font-medium text-slate-700 shadow-2xs hover:border-slate-300 transition-all focus:outline-none focus:ring-2 focus:ring-[#60a4ff]/45 cursor-pointer select-none ${
          isOpen
            ? "border-[#60a4ff] ring-2 ring-[#60a4ff]/25"
            : "border-slate-200"
        }`}
      >
        <span
          className="text-base sm:text-lg leading-none shrink-0"
          role="img"
          aria-label={selectedOption.name}
        >
          {selectedOption.flag}
        </span>
        <span className="hidden sm:inline text-slate-800 font-medium truncate max-w-[85px] md:max-w-[105px] lg:max-w-[125px]">
          {selectedOption.name}
        </span>
        <span className="sm:hidden font-mono text-[11px] font-semibold text-slate-600 uppercase">
          {selectedOption.code}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-[#60a4ff]" : ""
          }`}
        />
      </button>

      {/* Popover Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Select language"
          className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-2xl border border-slate-200/90 bg-white shadow-xl shadow-slate-900/10 z-50 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Search Header */}
          <div className="p-2 border-b border-slate-100 bg-slate-50/70">
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search language or code..."
                className="w-full pl-8 pr-7 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#60a4ff] focus:ring-1 focus:ring-[#60a4ff] transition-all font-sans"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 text-slate-400 hover:text-slate-600 p-0.5 rounded"
                  aria-label="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Languages List */}
          <div className="max-h-64 overflow-y-auto p-1.5 space-y-0.5 overscroll-contain">
            {filteredLanguages.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-slate-400">
                No languages found matching &ldquo;{searchQuery}&rdquo;
              </div>
            ) : (
              filteredLanguages.map((lang) => {
                const isSelected =
                  lang.code.toLowerCase() === currentLanguage.toLowerCase();
                return (
                  <button
                    key={lang.code}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(lang.code)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors text-xs sm:text-[0.85rem] cursor-pointer ${
                      isSelected
                        ? "bg-sky-50 text-[#0f53ac] font-semibold"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span
                      className="text-base sm:text-lg leading-none shrink-0"
                      role="img"
                      aria-label={lang.name}
                    >
                      {lang.flag}
                    </span>
                    <span className="truncate flex-1">{lang.name}</span>
                    <span className="font-mono text-[10px] sm:text-[11px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 shrink-0">
                      {lang.code}
                    </span>
                    {isSelected && (
                      <Check
                        className="w-3.5 h-3.5 text-[#60a4ff] shrink-0 ml-1"
                        strokeWidth={2.5}
                      />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Metadata */}
          <div className="px-3 py-2 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>
              {filteredLanguages.length} of {SUPPORTED_LANGUAGES.length} languages
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 uppercase font-mono">
              <Globe className="w-3 h-3 text-[#60a4ff]" />
              Yotpo
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
