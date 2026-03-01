import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { API_ENDPOINTS, apiRequest, dispatchAppSync, notifyApp } from "../config/api";
import "./AuthPages.css";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const validateForm = () => {
    const next = {};
    const normalizedEmail = formData.email.trim();
    const normalizedPassword = formData.password.trim();

    if (!normalizedEmail) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) next.email = "Enter a valid email";

    if (!normalizedPassword) next.password = "Password is required";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const payload = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password.trim(),
      };

      const data = await apiRequest(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('fullName', data.fullName);
      dispatchAppSync();
      notifyApp("Login successful", "success");
      const redirectTarget =
        typeof location.state?.from === "string" && location.state.from.startsWith("/")
          ? location.state.from
          : "/";
      navigate(redirectTarget, { replace: true });
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('fullName');
      dispatchAppSync();
      notifyApp(error.message || "Login failed. Please try again.", "error");
      setErrors({ password: error.message || 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="auth-premium auth-login">
      <div className="auth-card">
        <div className="auth-headline">Sign in</div>
        <h1>Welcome back</h1>
        <p>Fast checkout and saved picks.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className="auth-error">{errors.email}</span>}

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <span className="auth-error">{errors.password}</span>}

          <button type="submit" className="auth-submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Continue"}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/forgot-password" style={{ marginBottom: '10px', display: 'block', textAlign: 'center' }}>
            Forgot password?
          </Link>
        </div>

        <div className="auth-links">
          <span>New here?</span>
          <Link to="/signup">Create account</Link>
        </div>

        <div className="auth-links" style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e0e0e0' }}>
          <Link to="/admin/login" style={{ color: '#667eea', fontWeight: '600' }}>
            🔐 Admin Login
          </Link>
        </div>
      </div>
    </section>
  );
}
