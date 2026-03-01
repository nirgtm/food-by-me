import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_ENDPOINTS, apiRequest, notifyApp } from "../config/api";
import "./ProfilePage.css";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  
  const [profile, setProfile] = useState({
    fullName: localStorage.getItem("fullName") || "",
    email: localStorage.getItem("email") || "",
    phone: "",
    avatar: "",
    joinedDate: new Date().toISOString(),
  });

  const [editForm, setEditForm] = useState({ ...profile });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      notifyApp("Please login to view profile", "warning");
      navigate("/login");
      return;
    }
    loadProfileData();
  }, [navigate]);

  const loadProfileData = async () => {
    setLoading(true);
    try {
      // Load orders
      const ordersData = await apiRequest(API_ENDPOINTS.ORDERS.GET_MY_ORDERS, {
        method: "GET",
      });
      setOrders(Array.isArray(ordersData) ? ordersData : []);

      // Load favorites from localStorage
      const savedFavorites = JSON.parse(localStorage.getItem("favoriteRestaurants") || "[]");
      setFavoriteRestaurants(savedFavorites);

      // Load profile from localStorage
      const savedProfile = {
        fullName: localStorage.getItem("fullName") || "",
        email: localStorage.getItem("email") || "",
        phone: localStorage.getItem("phone") || "",
        avatar: localStorage.getItem("avatar") || "",
        joinedDate: localStorage.getItem("joinedDate") || new Date().toISOString(),
      };
      setProfile(savedProfile);
      setEditForm(savedProfile);
    } catch (error) {
      console.error("Error loading profile:", error);
      notifyApp("Failed to load profile data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditForm({ ...profile });
    setIsEditing(false);
  };

  const handleSaveProfile = () => {
    // Validate
    if (!editForm.fullName.trim()) {
      notifyApp("Name is required", "warning");
      return;
    }

    if (!editForm.email.trim()) {
      notifyApp("Email is required", "warning");
      return;
    }

    // Save to localStorage
    localStorage.setItem("fullName", editForm.fullName);
    localStorage.setItem("email", editForm.email);
    localStorage.setItem("phone", editForm.phone);
    localStorage.setItem("avatar", editForm.avatar);

    setProfile(editForm);
    setIsEditing(false);
    notifyApp("Profile updated successfully", "success");
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm({ ...editForm, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleFavorite = (restaurantId, restaurantName) => {
    const favorites = [...favoriteRestaurants];
    const index = favorites.findIndex((fav) => fav.id === restaurantId);

    if (index > -1) {
      favorites.splice(index, 1);
      notifyApp(`${restaurantName} removed from favorites`, "info");
    } else {
      favorites.push({ id: restaurantId, name: restaurantName, addedAt: new Date().toISOString() });
      notifyApp(`${restaurantName} added to favorites`, "success");
    }

    setFavoriteRestaurants(favorites);
    localStorage.setItem("favoriteRestaurants", JSON.stringify(favorites));
  };

  const getOrderStats = () => {
    const total = orders.length;
    const delivered = orders.filter((o) => o.status === "delivered").length;
    const totalSpent = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    return { total, delivered, totalSpent };
  };

  const stats = getOrderStats();

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <p className="profile-loading">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>My Account</h1>
          <Link to="/" className="profile-back-btn">
            ← Back to Home
          </Link>
        </div>

        <div className="profile-tabs">
          <button
            className={`profile-tab ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            👤 Profile
          </button>
          <button
            className={`profile-tab ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            📦 Order History
          </button>
          <button
            className={`profile-tab ${activeTab === "favorites" ? "active" : ""}`}
            onClick={() => setActiveTab("favorites")}
          >
            ❤️ Favorites
          </button>
        </div>

        {activeTab === "profile" && (
          <div className="profile-content">
            <div className="profile-card">
              <div className="profile-info">
                {!isEditing ? (
                  <>
                    <div className="profile-field">
                      <label>Full Name</label>
                      <p>{profile.fullName}</p>
                    </div>
                    <div className="profile-field">
                      <label>Email</label>
                      <p>{profile.email}</p>
                    </div>
                    <div className="profile-field">
                      <label>Phone</label>
                      <p>{profile.phone || "Not provided"}</p>
                    </div>
                    <div className="profile-field">
                      <label>Member Since</label>
                      <p>{new Date(profile.joinedDate).toLocaleDateString()}</p>
                    </div>
                    <button className="profile-edit-btn" onClick={handleEditProfile}>
                      ✏️ Edit Profile
                    </button>
                  </>
                ) : (
                  <>
                    <div className="profile-field">
                      <label>Full Name</label>
                      <input
                        type="text"
                        value={editForm.fullName}
                        onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                      />
                    </div>
                    <div className="profile-field">
                      <label>Email</label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      />
                    </div>
                    <div className="profile-field">
                      <label>Phone</label>
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div className="profile-actions">
                      <button className="profile-save-btn" onClick={handleSaveProfile}>
                        💾 Save Changes
                      </button>
                      <button className="profile-cancel-btn" onClick={handleCancelEdit}>
                        ✖️ Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="profile-stats">
              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-info">
                  <h3>{stats.total}</h3>
                  <p>Total Orders</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                  <h3>{stats.delivered}</h3>
                  <p>Delivered</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <h3>₹{stats.totalSpent}</h3>
                  <p>Total Spent</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="profile-content">
            <div className="orders-list">
              {orders.length === 0 ? (
                <div className="empty-state">
                  <p>No orders yet</p>
                  <Link to="/" className="profile-cta-btn">
                    Start Ordering
                  </Link>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="order-history-card">
                    <div className="order-history-header">
                      <div>
                        <h3>Order #{order.orderId || order.id}</h3>
                        <p className="order-date">
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <span className={`order-status-badge status-${order.status}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="order-history-body">
                      <p className="order-restaurant">
                        🏪 {order.restaurant?.name || "Restaurant"}
                      </p>
                      <div className="order-items-summary">
                        {(order.items || [order.item]).slice(0, 3).map((item, idx) => (
                          <span key={idx}>
                            {item.name} x{item.quantity || 1}
                          </span>
                        ))}
                      </div>
                      <div className="order-history-footer">
                        <p className="order-total">Total: ₹{order.total}</p>
                        <Link to="/orders" className="order-view-btn">
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "favorites" && (
          <div className="profile-content">
            <div className="favorites-list">
              {favoriteRestaurants.length === 0 ? (
                <div className="empty-state">
                  <p>No favorite restaurants yet</p>
                  <Link to="/" className="profile-cta-btn">
                    Explore Restaurants
                  </Link>
                </div>
              ) : (
                favoriteRestaurants.map((fav) => (
                  <div key={fav.id} className="favorite-card">
                    <div className="favorite-info">
                      <h3>{fav.name}</h3>
                      <p>Added {new Date(fav.addedAt).toLocaleDateString()}</p>
                    </div>
                    <button
                      className="favorite-remove-btn"
                      onClick={() => toggleFavorite(fav.id, fav.name)}
                    >
                      ❌ Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
