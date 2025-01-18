import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { UserContextProvider } from "./context/UserContext.tsx";
import App from "./App.tsx";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserContextProvider>
      <App />
    </UserContextProvider>
  </StrictMode>
);
