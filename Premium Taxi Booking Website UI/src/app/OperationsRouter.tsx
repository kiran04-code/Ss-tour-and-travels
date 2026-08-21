import { useEffect, useState } from "react";
import { AdminPage } from "./pages/AdminPage";
import { CarDetailsPage } from "./pages/CarDetailsPage";
import { CarFormPage } from "./pages/CarFormPage";
import { CarsPage } from "./pages/CarsPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { isAuthenticated } from "./auth";

function currentPath() {
  return window.location.pathname.replace(/\/$/, "") || "/";
}

export function OperationsRouter() {
  const [path, setPath] = useState(currentPath());

  useEffect(() => {
    const onPopState = () => setPath(currentPath());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Public Routes
  if (path === "/login") return <LoginPage />;
  if (path === "/cars") return <CarsPage />;

  const carDetails = path.match(/^\/cars\/([^/]+)$/);
  if (carDetails) return <CarDetailsPage id={carDetails[1]} />;

  // Protected Admin & Dashboard Routes - Require LocalStorage Auth Token
  const isProtectedAdminRoute = path.startsWith("/dashboard") || path.startsWith("/admin");
  if (isProtectedAdminRoute && !isAuthenticated()) {
    return <LoginPage />;
  }

  // Authenticated Admin Routes
  if (path === "/dashboard") return <DashboardPage />;
  if (path === "/dashboard/cars/new") return <CarFormPage />;

  const carEdit = path.match(/^\/dashboard\/cars\/([^/]+)\/edit$/);
  if (carEdit) return <CarFormPage id={carEdit[1]} />;

  const adminQuote = path.match(/^\/admin\/quotes\/([^/]+)$/);
  if (adminQuote) return <AdminPage quoteId={adminQuote[1]} />;

  if (path === "/admin") return <AdminPage />;

  // Default fallback
  return <DashboardPage />;
}

