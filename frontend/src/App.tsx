import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import { AuthProvider } from "./contexts/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col overflow-x-hidden">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </AuthProvider>
  );
}
