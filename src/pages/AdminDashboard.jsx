import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS, apiRequest, notifyApp } from "../config/api";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    preparing: 0,
    onTheWay: 0,
    delivered: 0,
    cancelled: 0,
    revenue: 0,
  });

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      notifyApp("Please login as admin", "warning");
      navigate("/admin/login");
      return;
    }
    loadOrders();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadOrders, 30000);
    return () => clearInterval(interval);
  }, [navigate]);

  const loadOrders = async () => {
    try {
      console.log('Loading orders from:', API_ENDPOINTS.ADMIN.GET_ALL_ORDERS);
      const data = await apiRequest(API_ENDPOINTS.ADMIN.GET_ALL_ORDERS, {
        method: "GET",
      });
      
      console.log('Orders received:', data);
      const ordersList = Array.isArray(data) ? data : [];
      setOrders(ordersList);
      
      // Calculate stats
      const newStats = {
        total: ordersList.length,
        confirmed: ordersList.filter((o) => o.status === "confirmed").length,
        preparing: ordersList.filter((o) => o.status === "preparing").length,
        onTheWay: ordersList.filter((o) => o.status === "on_the_way").length,
        delivered: ordersList.filter((o) => o.status === "delivered").length,
        cancelled: ordersList.filter((o) => o.status === "cancelled").length,
        revenue: ordersList
          .filter((o) => o.status === "delivered")
          .reduce((sum, o) => sum + (Number(o.total) || 0), 0),
      };
      setStats(newStats);
    } catch (error) {
      console.error("Error loading orders:", error);
      console.error("Error details:", error.message);
      notifyApp(error.message || "Failed to load orders", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("isAdmin");
    notifyApp("Logged out successfully", "success");
    navigate("/admin/login");
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await apiRequest(API_ENDPOINTS.ORDERS.UPDATE_STATUS(orderId), {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      notifyApp(`Order status updated to ${newStatus}`, "success");
      loadOrders();
    } catch (error) {
      notifyApp("Failed to update order status", "error");
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    return order.status === filter;
  });

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div>
          <h1>📊 Admin Dashboard</h1>
          <p>Manage all restaurant orders</p>
        </div>
        <div className="admin-header-actions">
          <button onClick={() => navigate("/")} className="admin-switch-btn">
            👤 Switch to Customer
          </button>
          <button onClick={handleLogout} className="admin-logout-btn">
            Logout
          </button>
        </div>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon">📦</div>
          <div className="admin-stat-info">
            <h3>{stats.total}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon">✅</div>
          <div className="admin-stat-info">
            <h3>{stats.confirmed}</h3>
            <p>Confirmed</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon">👨‍🍳</div>
          <div className="admin-stat-info">
            <h3>{stats.preparing}</h3>
            <p>Preparing</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon">🚚</div>
          <div className="admin-stat-info">
            <h3>{stats.onTheWay}</h3>
            <p>On the Way</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon">✨</div>
          <div className="admin-stat-info">
            <h3>{stats.delivered}</h3>
            <p>Delivered</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon">💰</div>
          <div className="admin-stat-info">
            <h3>₹{stats.revenue}</h3>
            <p>Revenue</p>
          </div>
        </div>
      </div>

      <div className="admin-filters">
        <button
          className={`admin-filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All ({stats.total})
        </button>
        <button
          className={`admin-filter-btn ${filter === "confirmed" ? "active" : ""}`}
          onClick={() => setFilter("confirmed")}
        >
          Confirmed ({stats.confirmed})
        </button>
        <button
          className={`admin-filter-btn ${filter === "preparing" ? "active" : ""}`}
          onClick={() => setFilter("preparing")}
        >
          Preparing ({stats.preparing})
        </button>
        <button
          className={`admin-filter-btn ${filter === "on_the_way" ? "active" : ""}`}
          onClick={() => setFilter("on_the_way")}
        >
          On the Way ({stats.onTheWay})
        </button>
        <button
          className={`admin-filter-btn ${filter === "delivered" ? "active" : ""}`}
          onClick={() => setFilter("delivered")}
        >
          Delivered ({stats.delivered})
        </button>
        <button
          className={`admin-filter-btn ${filter === "cancelled" ? "active" : ""}`}
          onClick={() => setFilter("cancelled")}
        >
          Cancelled ({stats.cancelled})
        </button>
      </div>

      <div className="admin-orders-list">
        {filteredOrders.length === 0 ? (
          <div className="admin-empty-state">
            <p>No orders found</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="admin-order-card">
              <div className="admin-order-header">
                <div>
                  <h3>Order #{order.orderId || order.id}</h3>
                  <p className="admin-order-date">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className={`admin-status-badge status-${order.status}`}>
                  {order.status}
                </span>
              </div>

              <div className="admin-order-body">
                <div className="admin-order-info">
                  <p>
                    <strong>Customer:</strong> {order.user?.fullName || "N/A"}
                  </p>
                  <p>
                    <strong>Email:</strong> {order.user?.email || "N/A"}
                  </p>
                  <p>
                    <strong>Phone:</strong> {order.deliveryAddress?.phone || "N/A"}
                  </p>
                  <p>
                    <strong>Address:</strong>{" "}
                    {order.deliveryAddress?.address || "N/A"}
                  </p>
                </div>

                <div className="admin-order-items">
                  <strong>Items:</strong>
                  {(order.items || [order.item]).map((item, idx) => (
                    <div key={idx} className="admin-order-item">
                      {item.name} x{item.quantity || 1} - ₹
                      {(item.price || 0) * (item.quantity || 1)}
                    </div>
                  ))}
                </div>

                <div className="admin-order-total">
                  <strong>Total: ₹{order.total}</strong>
                </div>
              </div>

              <div className="admin-order-actions">
                <select
                  value={order.status}
                  onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                  className="admin-status-select"
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="preparing">Preparing</option>
                  <option value="on_the_way">On the Way</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
