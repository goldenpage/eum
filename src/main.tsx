import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "./router/routes.tsx";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("root 엘리먼트 찾을 수 없음 ㅅㄱ");
}

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
