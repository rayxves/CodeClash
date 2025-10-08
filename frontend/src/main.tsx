import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./components/Home/ErrorPage.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import CodeModel from "./pages/CodeModel.tsx";
import Home from "./pages/Home.tsx";
import CategoryPage from "./pages/CategoryPage.tsx";
import CodeModal from "./pages/CodeModal.tsx";
import EnhancedSubmissionPage from "./pages/EnhancedSubmissionPage.tsx";
import RecommendationsPage from "./pages/RecomendationsPage.tsx";
import ProblemsPage from "./pages/ProblemsPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import TreeNavigator from "./pages/TreeNavigator.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <AboutPage /> },
      { path: "problems", element: <ProblemsPage /> },
      { path: "code-model", element: <CodeModel /> },
      { path: "/:language", element: <TreeNavigator /> },
      { path: "code-model/:language/:category", element: <CategoryPage /> },
      { path: "code-modal/:id/:name", element: <CodeModal /> },
      { path: "submission", element: <EnhancedSubmissionPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "profile", element: <ProfilePage /> },
      {
        path: "recommendations/:language/by-name/:name",
        element: <RecommendationsPage />,
      },
      {
        path: "recommendations/:language/by-code/:code",
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
