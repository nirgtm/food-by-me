import React, { useEffect, useMemo, useState, useRef } from "react";
import "./Navbar.css";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  APP_SYNC_EVENT,
  dispatchAppSync,
  getCartCount,
  getCartItems,
} from "../config/api";

function Navbar() {
  const location = useLocation();
  const [snapshot, setSnapshot] = useState({
    isLoggedIn: false,
    fullName: "",
    cartCount: 0,
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const shortName = useMemo(() => {
    const words = snapshot.fullName.trim().split(/\s+/).filter(Boolean);
    return words[0] || "Account";
  }, [snapshot.fullName]);

  useEffect(() => {
    const sync = () => {
      const token = localStorage.getItem("token");
      const fullName = localStorage.getItem("fullName") || "";
      const cartCount = getCartCount(getCartItems());
      setSnapshot({
        isLoggedIn: Boolean(token),
        fullName,
        cartCount,
      });
    };

    sync();
    window.addEventListener(APP_SYNC_EVENT, sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener(APP_SYNC_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    // Handle hash navigation on page load
    if (location.hash === '#restaurants') {
      setTimeout(() => {
        const restaurantsSection = document.getElementById('restaurants');
        if (restaurantsSection) {
          restaurantsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [location.hash]);

  useEffect(() => {
    if (!menuOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    if (profileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [profileDropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("fullName");
    dispatchAppSync();
    setMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  const scrollToRestaurants = (e) => {
    e.preventDefault();
    closeMenu();
    
    // If not on home page, navigate to home first
    if (location.pathname !== '/') {
      window.location.href = '/#restaurants';
      return;
    }
    
    // Scroll to restaurants section
    const restaurantsSection = document.getElementById('restaurants');
    if (restaurantsSection) {
      restaurantsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="app-navbar" role="navigation">
      <div className="nav-inner">
        <h2 className="brand">
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }} onClick={closeMenu}>
            FoodByMe
          </Link>
        </h2>

        <button 
          className={`hamburger-btn ${menuOpen ? "is-open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-links ${menuOpen ? 'nav-open' : ''}`}>
          <li>
            <a href="#restaurants" onClick={scrollToRestaurants}>Restaurant</a>
          </li>

          <li>
            <NavLink to="/cart" className={({ isActive }) => (isActive ? "active" : "")} onClick={closeMenu}>
              Cart
              {snapshot.cartCount > 0 ? (
                <span className="cart-badge" aria-label={`${snapshot.cartCount} items in cart`}>
                  {snapshot.cartCount}
                </span>
              ) : null}
            </NavLink>
          </li>

          <li>
            <NavLink to="/orders" className={({ isActive }) => (isActive ? "active" : "")} onClick={closeMenu}>
              Orders
            </NavLink>
          </li>

          {snapshot.isLoggedIn ? (
            <>
              <li className="profile-dropdown-container" ref={dropdownRef}>
                <button
                  className="account-chip-btn"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  title={snapshot.fullName}
                >
                  <span className="account-avatar">
                    {snapshot.fullName.charAt(0).toUpperCase()}
                  </span>
                  <span className="account-name">Hi, {shortName}</span>
                  <span className="dropdown-arrow">{profileDropdownOpen ? "▲" : "▼"}</span>
                </button>

                {profileDropdownOpen && (
                  <div className="profile-dropdown">
                    <div className="profile-dropdown-header">
                      <div className="profile-dropdown-avatar">
                        {snapshot.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div className="profile-dropdown-info">
                        <p className="profile-dropdown-name">{snapshot.fullName}</p>
                        <p className="profile-dropdown-email">{localStorage.getItem("email") || "user@example.com"}</p>
                      </div>
                    </div>

                    <div className="profile-dropdown-divider"></div>

                    <Link to="/profile" className="profile-dropdown-item" onClick={closeMenu}>
                      <span className="dropdown-icon">👤</span>
                      <span>My Profile</span>
                    </Link>

                    <Link to="/orders" className="profile-dropdown-item" onClick={closeMenu}>
                      <span className="dropdown-icon">📦</span>
                      <span>My Orders</span>
                    </Link>

                    <Link to="/cart" className="profile-dropdown-item" onClick={closeMenu}>
                      <span className="dropdown-icon">🛒</span>
                      <span>My Cart</span>
                      {snapshot.cartCount > 0 && (
                        <span className="dropdown-badge">{snapshot.cartCount}</span>
                      )}
                    </Link>

                    <div className="profile-dropdown-divider"></div>

                    <Link to="/admin/login" className="profile-dropdown-item admin-item" onClick={closeMenu}>
                      <span className="dropdown-icon">🔐</span>
                      <span>Admin Panel</span>
                    </Link>

                    <div className="profile-dropdown-divider"></div>

                    <button className="profile-dropdown-item logout-item" onClick={handleLogout}>
                      <span className="dropdown-icon">🚪</span>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) => (isActive ? "active" : "")}
                  onClick={closeMenu}
                >
                  Login
                </NavLink>
              </li>
              <li>
                <Link to="/signup" className="signup-btn" onClick={closeMenu}>
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
      {menuOpen && <div className="nav-overlay" onClick={closeMenu}></div>}
    </nav>
  );
}

export default Navbar;
