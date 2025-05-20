import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./components/Home/ErrorPage.tsx";
import AboutPage from "./components/About/AboutPage.tsx";
import CodeModel from "./components/CodeModel/CodeModel/CodeModel.tsx";
import Home from "./components/Home/Home.tsx";
import CategoryPage from "./components/CodeModel/CategoryPage/CategoryPage.tsx";
import CodeModal from "./components/CodeModel/CodeModal/CodeModal.tsx";
import SubmissionPage from "./components/Submission/SubmissionPage.tsx";
import RecommendationsPage from "./components/CodeModel/Recomendation/RecomendationsPage.tsx";

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
    path: "code-model/:language/:category/:name",
    element: <CodeModal key={location.pathname} />,
    errorElement: <ErrorPage />,
  },
  {
    path: "submission",
    element: <SubmissionPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/recommendations/:language/:name",
    element: <RecommendationsPage />,
  },
  {
    path: "/recommendations",
    element: <RecommendationsPage />,
  }
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <App />
  </StrictMode>
);
