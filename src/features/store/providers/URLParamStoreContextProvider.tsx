import { useState } from "react";
import { Store } from "../../../types";
import { StoreContext } from "../context";
import {
  isValidLanguageCode,
  canonicalizeLanguageCode,
} from "../../languages/languages";

export function isValidTwoLetterLanguageCode(code: string): boolean {
  return isValidLanguageCode(code);
}

export default function URLParamStoreContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const urlParams = new URLSearchParams(window.location.search);
  const appKey = urlParams.get("appKey") || "";
  const productId = urlParams.get("productId") || "";
  const rawLang = urlParams.get("lang") || "en";
  let language = isValidTwoLetterLanguageCode(rawLang)
    ? canonicalizeLanguageCode(rawLang)
    : "en";

  const isLoading = async () => {
    return appKey === "" || productId === "";
  };

  const store: Store = {
    isLoading,
    appKey,
    productId,
    language,
    isValid: () => appKey !== "" && productId !== "",
    setSession: (appKey: string, productId: string, lang: string = "en") => {
      const selectedLanguage = isValidTwoLetterLanguageCode(lang)
        ? canonicalizeLanguageCode(lang)
        : "en";
      const params = `?appKey=${encodeURIComponent(appKey)}&productId=${encodeURIComponent(productId)}&lang=${encodeURIComponent(selectedLanguage)}`;
      window.location.href = `/${params}`;
    },
  };

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}
