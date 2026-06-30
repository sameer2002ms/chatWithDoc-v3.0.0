import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useAuth } from "../../hooks/useAuth";

const TITLES = {
  "/dashboard": "Dashboard",
  "/upload": "Upload Documents",
  "/chat": "Ask Questions",
  "/history": "History",
};

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    navigate("/login", { replace: true });
  };

  const pageTitle = TITLES[location.pathname] || "ChatWithDoc";

  return (
    <div className="flex min-h-screen bg-[var(--color-surface)]">
      <Sidebar
        onLogout={handleLogout}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex min-h-screen w-full flex-1 flex-col lg:pl-0">
        <Navbar
          onOpenMobileMenu={() => setMobileOpen(true)}
          onLogout={handleLogout}
          pageTitle={pageTitle}
        />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
