// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import App from "./App.jsx";
import { store } from "./store/store.js";
import { appTheme } from "./theme";
import "antd/dist/reset.css";
import { ClerkProvider } from "@clerk/clerk-react";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  // Optional: you can console.error here
  console.error("Missing VITE_CLERK_PUBLISHABLE_KEY in env");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <Provider store={store}>
        <BrowserRouter>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: appTheme.colors.primary,
                colorBgLayout: appTheme.colors.background,
                colorText: appTheme.colors.textMain,
                colorTextSecondary: appTheme.colors.textMuted,
                borderRadius: appTheme.radii.card,
                fontSize: 14,
              },
            }}
          >
            <App />
          </ConfigProvider>
        </BrowserRouter>
      </Provider>
    </ClerkProvider>
  </React.StrictMode>
);
