import URLParamStoreContextProvider from "../features/store/providers/URLParamStoreContextProvider";

export default function StoreContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <URLParamStoreContextProvider>{children}</URLParamStoreContextProvider>
  );
}
