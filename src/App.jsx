import React, { useCallback, useEffect, useRef, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Signup from "./pages/SignupSimple";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import CategoryPage from "./pages/CategoryPage";
import PremiumFoodPage from "./pages/PremiumFoodPage";
import RestaurantDetailsPage from "./pages/RestaurantDetailsPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProfilePage from "./pages/ProfilePage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import TestConnection from "./pages/TestConnection";
import { listCatalogThemes } from "./pages/catalogThemes";
import { RESTAURANT_ROUTE_PATTERN } from "./data/restaurants";
import { APP_SYNC_EVENT, APP_TOAST_EVENT } from "./config/api";
import ScrollToTop from "./components/ScrollToTop";
import "./App.css";

function createToastPayload(detail) {
  return {
    id:
      detail?.id ||
      `toast_${Date.now()}_${Math.floor(Math.random() * 1e5)}`,
    message: detail?.message || "",
    type: detail?.type || "info",
    duration:
      Number.isFinite(Number(detail?.duration)) && Number(detail?.duration) > 0
        ? Number(detail.duration)
        : 2800,
  };
}

function RequireAuth({ isAuthenticated, children }) {
  const location = useLocation();

  if (!isAuthenticated) {
    const from = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to="/login" replace state={{ from }} />;
  }

  return children;
}

function CheckoutLegacyRedirect() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const isOrders = params.get("view") === "orders";
  return <Navigate to={isOrders ? "/orders" : "/cart"} replace />;
}

export default function App() {
  const location = useLocation();
  const catalogThemes = listCatalogThemes();
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    typeof window !== "undefined" ? Boolean(localStorage.getItem("token")) : false
  );
  const [toasts, setToasts] = useState([]);
  const toastTimersRef = useRef(new Map());

  const removeToast = useCallback((toastId) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== toastId));
    const timer = toastTimersRef.current.get(toastId);
    if (timer) {
      clearTimeout(timer);
      toastTimersRef.current.delete(toastId);
    }
  }, []);

  useEffect(() => {
    const syncAuth = () => setIsAuthenticated(Boolean(localStorage.getItem("token")));

    syncAuth();
    window.addEventListener(APP_SYNC_EVENT, syncAuth);
    window.addEventListener("storage", syncAuth);

    return () => {
      window.removeEventListener(APP_SYNC_EVENT, syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  useEffect(() => {
    const timerMap = toastTimersRef.current;

    const handleToast = (event) => {
      const nextToast = createToastPayload(event?.detail || {});
      if (!nextToast.message) return;

      setToasts((prev) => {
        const withoutDuplicate = prev.filter((toast) => toast.id !== nextToast.id);
        return [...withoutDuplicate, nextToast].slice(-4);
      });

      const existingTimer = timerMap.get(nextToast.id);
      if (existingTimer) clearTimeout(existingTimer);

      const timer = window.setTimeout(() => removeToast(nextToast.id), nextToast.duration);
      timerMap.set(nextToast.id, timer);
    };

    window.addEventListener(APP_TOAST_EVENT, handleToast);
    return () => {
      window.removeEventListener(APP_TOAST_EVENT, handleToast);
      timerMap.forEach((timer) => clearTimeout(timer));
      timerMap.clear();
    };
  }, [removeToast]);

  return (
    <div className="app-root">
      <ScrollToTop />
      {!location.pathname.startsWith('/admin') && <Navbar />}
      <div className="bg-dots" aria-hidden="true">
        <span className="dot dot-left dot-1" />
        <span className="dot dot-left dot-2" />
        <span className="dot dot-right dot-1" />
        <span className="dot dot-right dot-2" />
      </div>
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test-connection" element={<TestConnection />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route
            path="/profile"
            element={
              <RequireAuth isAuthenticated={isAuthenticated}>
                <ProfilePage />
              </RequireAuth>
            }
          />
          <Route path={RESTAURANT_ROUTE_PATTERN} element={<RestaurantDetailsPage />} />
          <Route path="/cart" element={<CheckoutPage />} />
          <Route
            path="/orders"
            element={
              <RequireAuth isAuthenticated={isAuthenticated}>
                <CheckoutPage view="orders" />
              </RequireAuth>
            }
          />
          <Route path="/checkout" element={<CheckoutLegacyRedirect />} />
          <Route path="/category/:name" element={<CategoryPage />} />
          {catalogThemes.map((theme) => (
            <Route
              key={theme.slug}
              path={theme.route}
              element={<PremiumFoodPage theme={theme} />}
            />
          ))}
        </Routes>
      </main>

      <section className="app-toast-stack" aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => (
          <article key={toast.id} className={`app-toast app-toast-${toast.type}`}>
            <p>{toast.message}</p>
            <button
              type="button"
              className="app-toast-close"
              onClick={() => removeToast(toast.id)}
              aria-label="Close notification"
            >
              ×
            </button>
          </article>
        ))}
      </section>
    </div>
  );
}
