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

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
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
  </React.StrictMode>
);
