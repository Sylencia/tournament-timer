import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { PrefsProvider } from "./PrefsContext.tsx";
import "./index.scss";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PrefsProvider>
      <App />
    </PrefsProvider>
  </React.StrictMode>
);
