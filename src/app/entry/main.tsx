import { ThemeProvider } from "@mui/material";
import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "@app/routes/App";
import theme from "@app/styles/theme";
import "@app/styles/global.css";

import queryClient from "@shared/react-query/queryClient";

if (import.meta.env.DEV) {
  import("@shared/libs/utils/measureHmr");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
