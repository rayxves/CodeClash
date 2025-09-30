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
import EnhancedSubmissionPage from "./components/Submission/EnhancedSubmissionPage.tsx";
import RecommendationsPage from "./components/CodeModel/Recomendation/RecomendationsPage.tsx";
import ProblemsPage from "./components/Problems/ProblemsPage.tsx";
import LoginPage from "./components/Auth/LoginPage.tsx";
import RegisterPage from "./components/Auth/RegisterPage.tsx";
import ProfilePage from "./components/Profile/ProfilePage.tsx";
import TreeNavigator from "./components/CodeModel/TreeNavigator/TreeNavigator.tsx";

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
