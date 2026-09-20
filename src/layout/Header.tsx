import { KeyRound, Box, ExternalLink, Check } from "lucide-react";
import { useState, useEffect } from "react";
import LogoText from "../features/logo/components/LogoText";
import LogoThumbnail from "../features/logo/components/LogoThumbnail";
import useStoreContext from "../features/store/hooks/useStoreContext";
import { useProductSimpleDataGetter } from "../features/widgets/hooks/useProductSimpleDataGetter";
import { ProductOverviewCard } from "./pages/header/ProductOverviewCard";
import LanguageDropdown from "./pages/header/LanguageDropdown";

type Props = {
  isPreviewPage: boolean;
};

export default function Header({ isPreviewPage }: Props) {
  const { appKey, productId, language, setSession } = useStoreContext();
  const [localAppKey, setLocalAppKey] = useState(appKey);
  const [localProductId, setLocalProductId] = useState(productId);
  const [localLanguage, setLocalLanguage] = useState(language);

  useEffect(() => {
    setLocalAppKey(appKey);
  }, [appKey]);

  useEffect(() => {
    setLocalProductId(productId);
  }, [productId]);

  useEffect(() => {
    setLocalLanguage(language);
  }, [language]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    const trimmedAppKey = localAppKey.trim();
    const trimmedProductId = localProductId.trim();
    if (
      trimmedAppKey &&
      trimmedProductId &&
      (trimmedAppKey !== appKey ||
        trimmedProductId !== productId ||
        localLanguage !== language)
    ) {
      setSession(trimmedAppKey, trimmedProductId, localLanguage);
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLocalLanguage(newLanguage);
    const targetAppKey = localAppKey.trim() || appKey;
    const targetProductId = localProductId.trim() || productId;
    if (targetAppKey && targetProductId) {
      setSession(targetAppKey, targetProductId, newLanguage);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (
      e.relatedTarget &&
      e.currentTarget.form?.contains(e.relatedTarget as Node)
    ) {
      return;
    }
    handleSubmit();
  };

  return (
    <header className="flex items-center justify-between fixed top-0 left-0 right-0 h-16 bg-slate-50 z-50 shadow-md">
      <div className="flex items-center min-w-0 mr-3">
        <LogoThumbnail />
        <div className="flex items-center ml-3 z-100 shrink-0">
          <LogoText />
        </div>
        {/* Product Overview Card matching StartPage vector gradient card */}
        {isPreviewPage && (
          <ProductOverviewCard appKey={appKey} productId={productId} />
        )}
      </div>
      <div className="flex items-center mr-3 shrink-0">
        {isPreviewPage && (
          <form
            className="flex items-center gap-2 sm:gap-3"
            onSubmit={handleSubmit}
          >
            <div className="relative flex items-center">
              <div className="absolute left-3 flex items-center pointer-events-none text-[#60a4ff]">
                <KeyRound className="w-4 h-4" strokeWidth={2} />
              </div>
              <input
                id="appKey"
                name="appKey"
                value={localAppKey}
                onChange={(e) => setLocalAppKey(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit(e);
                  }
                }}
                type="text"
                placeholder="iXOAlMhR8547ex7PS66fpGGdeq0V0YQ1pa3J0QJy"
                title="App Key"
                aria-label="App Key"
                autoComplete="off"
                spellCheck={false}
                className="w-44 sm:w-60 md:w-72 lg:w-80 pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white font-mono text-xs sm:text-[0.85rem] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-[#60a4ff]/45 shadow-2xs hover:border-slate-300 transition-all"
              />
            </div>

            <div className="relative flex items-center">
              <div className="absolute left-3 flex items-center pointer-events-none text-[#60a4ff]">
                <Box className="w-4 h-4" strokeWidth={2} />
              </div>
              <input
                id="productId"
                name="productId"
                value={localProductId}
                onChange={(e) => setLocalProductId(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit(e);
                  }
                }}
                type="text"
                placeholder="99817238182920"
                title="Product ID"
                aria-label="Product ID"
                autoComplete="off"
                spellCheck={false}
                className="w-32 sm:w-36 md:w-44 lg:w-48 pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white font-mono text-xs sm:text-[0.85rem] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-[#60a4ff]/45 shadow-2xs hover:border-slate-300 transition-all"
              />
            </div>

            <LanguageDropdown
              currentLanguage={localLanguage}
              onSelectLanguage={handleLanguageChange}
            />
          </form>
        )}
        {!isPreviewPage && (
          <section className="flex items-center gap-2 sm:gap-3">
            <a
              href="/pages/terms-and-conditions.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 sm:gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs sm:text-[0.85rem] hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              <ExternalLink className="w-4 h-4" strokeWidth={2} />
              <span>Terms and Conditions</span>
            </a>
            <a
              href="/pages/privacy-policy.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 sm:gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs sm:text-[0.85rem] hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              <ExternalLink className="w-4 h-4" strokeWidth={2} />
              <span>Privacy Policy</span>
            </a>
          </section>
        )}
      </div>
    </header>
  );
}
