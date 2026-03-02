import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { notifyApp } from "../config/api";
import "./AdminLogin.css";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple admin credentials (in production, use proper authentication)
    if (credentials.username === "niraj gautam" && credentials.password === "majnu@2909") {
      localStorage.setItem("adminToken", "admin-authenticated");
      localStorage.setItem("isAdmin", "true");
      notifyApp("Admin login successful", "success");
      navigate("/admin/dashboard");
    } else {
      notifyApp("Invalid admin credentials", "error");
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <h1>🔐 Admin Login</h1>
            <p>Access the restaurant management dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="admin-form-field">
              <label>Username</label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) =>
                  setCredentials({ ...credentials, username: e.target.value })
                }
                placeholder="Enter admin username"
                required
              />
            </div>

            <div className="admin-form-field">
              <label>Password</label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                placeholder="Enter admin password"
                required
              />
            </div>

            <button type="submit" className="admin-login-btn">
              Login to Dashboard
            </button>
          </form>

          <div className="admin-login-footer">
            <p>Admin: niraj gautam</p>
            <button onClick={() => navigate("/")} className="admin-back-btn">
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
