import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/inter"; /* Defaults to weight 400 */
import "@fontsource/inter/400.css"; /* Specify weight */
import "@fontsource/inter/800.css"; /* Specify weight */
import App from "./App";
import "./index.css";

import StoreContextProvider from "./providers/StoreContextProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <StoreContextProvider>
      <App />
    </StoreContextProvider>
  </React.StrictMode>,
);
