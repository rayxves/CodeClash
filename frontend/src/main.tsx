import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./components/Home/ErrorPage.tsx";
import AboutPage from "./components/About/AboutPage.tsx";
import CodeModel from "./components/CodeModel/CodeModel.tsx";
import Home from "./components/Home/Home.tsx";
import CategoryPage from "./components/CodeModel/CategoryPage.tsx";
import CodeModal from "./components/CodeModel/CodeModal.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "about",
    element: <AboutPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "code-model",
    element: <CodeModel />,
    errorElement: <ErrorPage />,
  },
  {
    path: "code-model/:language/:category",
    element: <CategoryPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "code-model/:language/:category/code",
    element: <CodeModal />,
    errorElement: <ErrorPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <App />
  </StrictMode>
);
