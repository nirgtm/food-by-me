import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_ENDPOINTS, apiRequest } from "../config/api";
import "./AuthPages.css";

const NAME_REGEX = /^[A-Za-z][A-Za-z\s'.-]*$/;

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [otpCode, setOtpCode] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [pendingPhoneMasked, setPendingPhoneMasked] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (resendCooldown <= 0) return undefined;

    const timeoutId = setTimeout(() => {
      setResendCooldown((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [resendCooldown]);

  const validateForm = () => {
    const next = {};

    const normalizedName = formData.fullName.trim();
    const normalizedEmail = formData.email.trim();
    const normalizedPhoneDigits = formData.phone.replace(/\D/g, "");
    const normalizedPassword = formData.password.trim();
    const normalizedConfirmPassword = formData.confirmPassword.trim();

    if (!normalizedName) next.fullName = "Name is required";
    else if (!NAME_REGEX.test(normalizedName)) {
      next.fullName = "Name can contain letters and spaces only";
    }
    if (!normalizedEmail) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) next.email = "Enter a valid email";
    if (!normalizedPhoneDigits) next.phone = "Mobile number is required";
    else if (normalizedPhoneDigits.length < 8 || normalizedPhoneDigits.length > 15) {
      next.phone = "Enter a valid mobile number with country code";
    }
    if (!normalizedPassword || normalizedPassword.length < 6) next.password = "Password must be 6+ characters";
    if (!normalizedConfirmPassword) next.confirmPassword = "Confirm password is required";
    else if (normalizedPassword !== normalizedConfirmPassword) next.confirmPassword = "Passwords do not match";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextValue =
      name === "fullName"
        ? value.replace(/[^A-Za-z\s'.-]/g, "").replace(/\s{2,}/g, " ")
        : name === "phone"
        ? value
            .replace(/[^\d+]/g, "")
            .replace(/(?!^)\+/g, "")
            .replace(/^\++/, "+")
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
    try {
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password.trim(),
      };

      const data = await apiRequest(API_ENDPOINTS.AUTH.SIGNUP, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setPendingEmail(payload.email);
      setPendingPhoneMasked(data.maskedPhone || payload.phone);
      setOtpStep(true);
      setOtpCode("");
      setErrors({});
      setResendCooldown(30);
      setOtpMessage(
        data.devOtp
          ? `OTP sent. Development OTP: ${data.devOtp}`
          : "OTP sent to your mobile number. Enter it below to verify your account."
      );
    } catch (error) {
      setErrors({ email: error.message || "Signup failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    const nextErrors = {};

    if (!otpCode || otpCode.length !== 6) {
      nextErrors.otp = "Enter the 6-digit OTP";
      setErrors((prev) => ({ ...prev, ...nextErrors }));
      return;
    }

    setIsLoading(true);
    try {
      await apiRequest(API_ENDPOINTS.AUTH.VERIFY_SIGNUP_OTP, {
        method: "POST",
        body: JSON.stringify({
          email: pendingEmail,
          otp: otpCode,
        }),
      });

      navigate("/login");
    } catch (error) {
      setErrors((prev) => ({ ...prev, otp: error.message || "OTP verification failed" }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;

    setIsLoading(true);
    try {
      const data = await apiRequest(API_ENDPOINTS.AUTH.RESEND_SIGNUP_OTP, {
        method: "POST",
        body: JSON.stringify({ email: pendingEmail }),
      });

      setResendCooldown(30);
      setErrors((prev) => ({ ...prev, otp: "" }));
      setOtpMessage(
        data.devOtp
          ? `New OTP sent. Development OTP: ${data.devOtp}`
          : "A new OTP has been sent to your mobile number."
      );
    } catch (error) {
      setErrors((prev) => ({ ...prev, otp: error.message || "Failed to resend OTP" }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToSignup = () => {
    setOtpStep(false);
    setOtpCode("");
    setOtpMessage("");
    setPendingPhoneMasked("");
    setErrors({});
    setResendCooldown(0);
  };

  return (
    <section className="auth-premium auth-signup">
      <div className="auth-card">
        {!otpStep ? (
          <>
            <div className="auth-headline">Create profile</div>
            <h1>Start in one minute</h1>
            <p>Save favorites and reorder faster.</p>

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
                inputMode="text"
                pattern="[A-Za-z][A-Za-z\\s'.-]*"
                title="Use letters and spaces only"
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
              />
              {errors.email && <span className="auth-error">{errors.email}</span>}

              <label htmlFor="phone">Mobile number</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={handleChange}
                autoComplete="tel"
                inputMode="tel"
              />
              {errors.phone && <span className="auth-error">{errors.phone}</span>}

              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
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
              />
              {errors.confirmPassword && <span className="auth-error">{errors.confirmPassword}</span>}

              <button type="submit" className="auth-submit" disabled={isLoading}>
                {isLoading ? "Sending OTP..." : "Create account"}
              </button>
            </form>

            <div className="auth-links">
              <span>Already have an account?</span>
              <Link to="/login">Sign in</Link>
            </div>
          </>
        ) : (
          <>
            <div className="auth-headline">Verify mobile</div>
            <h1>Enter OTP</h1>
            <p>
              We sent a 6-digit code to{" "}
              <strong>{pendingPhoneMasked || pendingEmail}</strong>.
            </p>

            {otpMessage && <p className="auth-info">{otpMessage}</p>}

            <form className="auth-form" onSubmit={handleVerifyOtp}>
              <label htmlFor="otpCode">OTP code</label>
              <input
                id="otpCode"
                type="text"
                name="otpCode"
                placeholder="Enter 6-digit OTP"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                value={otpCode}
                onChange={(event) => {
                  const digits = event.target.value.replace(/\D/g, "").slice(0, 6);
                  setOtpCode(digits);
                  if (errors.otp) {
                    setErrors((prev) => ({ ...prev, otp: "" }));
                  }
                }}
              />
              {errors.otp && <span className="auth-error">{errors.otp}</span>}

              <button type="submit" className="auth-submit" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify OTP"}
              </button>

              <button
                type="button"
                className="auth-secondary-btn"
                onClick={handleResendOtp}
                disabled={isLoading || resendCooldown > 0}
              >
                {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : "Resend OTP"}
              </button>

              <button
                type="button"
                className="auth-text-btn"
                onClick={handleBackToSignup}
                disabled={isLoading}
              >
                Back to signup form
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
