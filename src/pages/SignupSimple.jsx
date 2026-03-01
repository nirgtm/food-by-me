import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_ENDPOINTS, apiRequest } from "../config/api";
import "./AuthPages.css";

const NAME_REGEX = /^[A-Za-z][A-Za-z\s'.-]*$/;

export default function SignupSimple() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const next = {};

    const normalizedName = formData.fullName.trim();
    const normalizedEmail = formData.email.trim();
    const normalizedPassword = formData.password.trim();
    const normalizedConfirmPassword = formData.confirmPassword.trim();

    if (!normalizedName) next.fullName = "Name is required";
    else if (!NAME_REGEX.test(normalizedName)) {
      next.fullName = "Name can contain letters and spaces only";
    }
    if (!normalizedEmail) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) 
      next.email = "Enter a valid email";
    if (!normalizedPassword || normalizedPassword.length < 6) 
      next.password = "Password must be 6+ characters";
    if (!normalizedConfirmPassword) next.confirmPassword = "Confirm password is required";
    else if (normalizedPassword !== normalizedConfirmPassword) 
      next.confirmPassword = "Passwords do not match";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextValue =
      name === "fullName"
        ? value.replace(/[^A-Za-z\s'.-]/g, "").replace(/\s{2,}/g, " ")
        : value;

    setFormData((prev) => ({ ...prev, [name]: nextValue }));
    if (errors[name] || ((name === "password" || name === "confirmPassword") && errors.confirmPassword)) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
        ...(name === "password" || name === "confirmPassword" ? { confirmPassword: "" } : {}),
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    setSuccessMessage("");

    try {
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password.trim(),
      };

      await apiRequest(API_ENDPOINTS.AUTH.SIGNUP_EMAIL, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setSuccessMessage(
        "Account created! Please check your email to verify your account before logging in."
      );
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      setErrors({ email: error.message || "Signup failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="auth-premium auth-signup">
      <div className="auth-card">
        <div className="auth-headline">Create profile</div>
        <h1>Start in one minute</h1>
        <p>Save favorites and reorder faster.</p>

        {successMessage && (
          <div className="auth-success-message">
            {successMessage}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="fullName">Full name</label>
          <input
            id="fullName"
            type="text"
            name="fullName"
            placeholder="Your name"
            value={formData.fullName}
            onChange={handleChange}
            autoComplete="name"
            disabled={isLoading || successMessage}
          />
          {errors.fullName && <span className="auth-error">{errors.fullName}</span>}

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            disabled={isLoading || successMessage}
          />
          {errors.email && <span className="auth-error">{errors.email}</span>}

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="At least 6 characters"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            disabled={isLoading || successMessage}
          />
          {errors.password && <span className="auth-error">{errors.password}</span>}

          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            placeholder="Repeat password"
            value={formData.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
            disabled={isLoading || successMessage}
          />
          {errors.confirmPassword && <span className="auth-error">{errors.confirmPassword}</span>}

          <button 
            type="submit" 
            className="auth-submit" 
            disabled={isLoading || successMessage}
          >
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="auth-links">
          <span>Already have an account?</span>
          <Link to="/login">Sign in</Link>
        </div>
      </div>
    </section>
  );
}
