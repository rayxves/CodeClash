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
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <AboutPage /> },
      { path: "code-model", element: <CodeModel /> },
      { path: "code-model/:language/:category", element: <CategoryPage /> },
      { path: "code-modal/:id/:name", element: <CodeModal /> },
      { path: "submission", element: <SubmissionPage /> },
      {
        path: "recommendations/:language/:name",
        element: <RecommendationsPage />,
      },
      { path: "recommendations", element: <RecommendationsPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
