import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_ENDPOINTS, apiRequest, notifyApp } from "../config/api";
import "./AuthPages.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const validateEmail = () => {
    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
      setErrors({ email: "Email is required" });
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setErrors({ email: "Enter a valid email" });
      return false;
    }
    setErrors({});
    return true;
  };

  const validatePasswordReset = () => {
    const next = {};
    if (!newPassword) next.newPassword = "New password is required";
    else if (newPassword.length < 6) next.newPassword = "Password must be at least 6 characters";
    
    if (!confirmPassword) next.confirmPassword = "Please confirm your password";
    else if (newPassword !== confirmPassword) next.confirmPassword = "Passwords do not match";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleVerifyEmail = async (event) => {
    event.preventDefault();
    if (!validateEmail()) return;

    setIsLoading(true);
    try {
      const endpoint = API_ENDPOINTS.AUTH.REQUEST_PASSWORD_RESET;
      console.log('Password reset endpoint:', endpoint);
      
      if (!endpoint) {
        throw new Error('Password reset endpoint not configured. Please refresh the page.');
      }

      const response = await apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      if (response.emailExists) {
        setStep(2);
        notifyApp("Email verified! Now set your new password.", "success");
      } else {
        notifyApp("If an account exists with this email, you can now reset the password.", "info");
        setStep(2);
      }
    } catch (error) {
      notifyApp(error.message || "Failed to verify email", "error");
      setErrors({ email: error.message || "Failed to verify email" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    if (!validatePasswordReset()) return;

    setIsLoading(true);
    try {
      await apiRequest(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        method: 'POST',
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          newPassword: newPassword.trim(),
        }),
      });

      notifyApp("Password updated successfully! Redirecting to login...", "success");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      notifyApp(error.message || "Failed to reset password", "error");
      setErrors({ newPassword: error.message || "Failed to reset password" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="auth-premium auth-login">
      <div className="auth-card">
        <div className="auth-headline">Password Reset</div>
        <h1>{step === 1 ? "Forgot Password?" : "Create New Password"}</h1>
        <p>
          {step === 1
            ? "Enter your email address to reset your password"
            : `Setting new password for ${email}`}
        </p>

        {step === 1 ? (
          <form className="auth-form" onSubmit={handleVerifyEmail}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({});
              }}
              disabled={isLoading}
            />
            {errors.email && <span className="auth-error">{errors.email}</span>}

            <button type="submit" className="auth-submit" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Continue"}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleResetPassword}>
            <label htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              type="password"
              name="newPassword"
              placeholder="Enter new password (min 6 characters)"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (errors.newPassword) setErrors((prev) => ({ ...prev, newPassword: "" }));
              }}
              disabled={isLoading}
            />
            {errors.newPassword && <span className="auth-error">{errors.newPassword}</span>}

            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: "" }));
              }}
              disabled={isLoading}
            />
            {errors.confirmPassword && <span className="auth-error">{errors.confirmPassword}</span>}

            <button type="submit" className="auth-submit" disabled={isLoading}>
              {isLoading ? "Updating Password..." : "Reset Password"}
            </button>

            <button
              type="button"
              className="auth-submit"
              style={{ marginTop: '10px', background: '#6c757d' }}
              onClick={() => {
                setStep(1);
                setNewPassword("");
                setConfirmPassword("");
                setErrors({});
              }}
              disabled={isLoading}
            >
              Back to Email
            </button>
          </form>
        )}

        <div className="auth-links">
          <span>Remember your password?</span>
          <Link to="/login">Back to login</Link>
        </div>
      </div>
    </section>
  );
}
