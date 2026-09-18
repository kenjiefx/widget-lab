import { useState } from "react";
import { Store } from "../../../types";
import { StoreContext } from "../context";

export default function URLParamStoreContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const urlParams = new URLSearchParams(window.location.search);
  const appKey = urlParams.get("appKey") || "";
  const productId = urlParams.get("productId") || "";
  const isLoading = async () => {
    return appKey === "" || productId === "";
  };

  const store: Store = {
    isLoading,
    appKey,
    productId,
    isValid: () => appKey !== "" && productId !== "",
    setSession: (appKey: string, productId: string) => {
      const params = `?appKey=${encodeURIComponent(appKey)}&productId=${encodeURIComponent(productId)}`;
      window.location.href = `/${params}`;
    },
  };

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}
