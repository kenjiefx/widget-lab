import { useContext } from "react";
import { StoreContext } from "../context";

export default function useStoreContext() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error(
      "useStoreContext must be used within a StoreContextProvider",
    );
  }
  return context;
}
