import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  API_ENDPOINTS,
  APP_SYNC_EVENT,
  addCartItem,
  addRecentOrderLocal,
  addSavedAddress,
  apiRequest,
  clearCartItems,
  getCartItems,
  getCartSubtotal,
  getRecentOrdersLocal,
  getSavedAddresses,
  notifyApp,
  removeCartItem,
  removeSavedAddress,
  updateCartItemQuantity,
} from "../config/api";
import { getRestaurantById } from "../data/restaurants";
import { NotificationManager, OrderPollingService } from "../utils/notifications";
import LiveTrackingMap from "../components/LiveTrackingMap";
import "./CheckoutPage.css";

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI", description: "PhonePe, GPay, Paytm" },
  { id: "card", label: "Card", description: "Credit or debit card" },
  { id: "cod", label: "Cash on Delivery", description: "Pay when order arrives" },
];

const COUPONS = {
  WELCOME10: {
    label: "10% off up to ₹120",
    minSubtotal: 199,
    getDiscount: ({ subtotal }) => Math.min(120, Math.round(subtotal * 0.1)),
  },
  SAVE50: {
    label: "Flat ₹50 off",
    minSubtotal: 299,
    getDiscount: () => 50,
  },
  FREESHIP: {
    label: "Free delivery",
    minSubtotal: 149,
    getDiscount: ({ deliveryFee }) => deliveryFee,
  },
};

const ORDER_STATUS_OPTIONS = [
  { id: "all", label: "All" },
  { id: "confirmed", label: "Confirmed" },
  { id: "preparing", label: "Preparing" },
  { id: "on_the_way", label: "Track Order" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
];

const ORDER_STATUS_LABELS = {
  confirmed: "Confirmed",
  preparing: "Preparing",
  on_the_way: "Track Order",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

function parsePrice(text) {
  if (!text) return null;
  const match = String(text).match(/₹\s?(\d+)/);
  return match ? Number(match[1]) : null;
}

function normalizeLocationItem(stateItem, restaurant) {
  if (!stateItem && !restaurant) return null;
  const fallbackPrice = restaurant ? Math.round(restaurant.priceForTwo / 2) : 199;
  const parsedFromOffer = parsePrice(stateItem?.offer);
  return {
    name: stateItem?.name || restaurant?.name || "Food item",
    image: stateItem?.image || restaurant?.image || "/images/Pizza.jpg",
    offer: stateItem?.offer || restaurant?.offer || "SPECIAL OFFER",
    eta: stateItem?.eta || (restaurant ? `${restaurant.etaMin}-${restaurant.etaMax} mins` : ""),
    cuisines: stateItem?.cuisines || restaurant?.cuisines?.join(", ") || "Fast Food",
    area: stateItem?.area || restaurant?.area || "City Center",
    price: stateItem?.price ?? parsedFromOffer ?? fallbackPrice,
  };
}

function getAddressById(savedAddresses, selectedAddressId) {
  if (!selectedAddressId) return null;
  return savedAddresses.find((address) => address.id === selectedAddressId) || null;
}

function getOrderItems(order) {
  if (Array.isArray(order?.items) && order.items.length > 0) return order.items;
  if (order?.item) return [order.item];
  return [];
}

function normalizeOrderStatus(value) {
  const normalized = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");

  if (!normalized) return "confirmed";
  if (normalized === "out_for_delivery" || normalized === "on_the_way") return "on_the_way";
  if (normalized === "cancelled" || normalized === "canceled") return "cancelled";
  if (normalized === "confirmed" || normalized === "preparing" || normalized === "delivered") {
    return normalized;
  }
  return "confirmed";
}

function formatOrderStatus(value) {
  return ORDER_STATUS_LABELS[value] || "Confirmed";
}

function formatOrderDate(value) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "Just now" : parsed.toLocaleString();
}

export default function CheckoutPage({ view = "cart" }) {
  const location = useLocation();
  const didImportLocationItemRef = useRef(false);
  const pollingServiceRef = useRef(null);
  const [cartItems, setCartState] = useState(() => getCartItems());
  const [savedAddresses, setSavedAddresses] = useState(() => getSavedAddresses());
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [isPaying, setIsPaying] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [recentOrders, setRecentOrders] = useState(() => getRecentOrdersLocal());
  const [remoteOrders, setRemoteOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [couponInput, setCouponInput] = useState("");
  const [appliedCouponCode, setAppliedCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [successOrderMeta, setSuccessOrderMeta] = useState(null);
  const [trackingModal, setTrackingModal] = useState({ isOpen: false, order: null });
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    Notification?.permission === "granted"
  );
  const [deliveryDetails, setDeliveryDetails] = useState({
    fullName: localStorage.getItem("fullName") || "",
    phone: "",
    address: "",
    addressLabel: "Home",
    deliveryNote: "",
  });

  const showOrdersView = view === "orders";
  const hasToken = Boolean(localStorage.getItem("token"));

  useEffect(() => {
    const sync = () => {
      setCartState(getCartItems());
      setSavedAddresses(getSavedAddresses());
      setRecentOrders(getRecentOrdersLocal());
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
    if (didImportLocationItemRef.current) return;
    if (!location.state?.item || !location.state?.restaurantId) return;
    const restaurant = getRestaurantById(location.state.restaurantId);
    const normalized = normalizeLocationItem(location.state.item, restaurant);
    if (!normalized) return;

    addCartItem({
      restaurantId: location.state.restaurantId,
      restaurantName: restaurant?.name || "Restaurant",
      item: normalized,
      quantity: 1,
    });
    didImportLocationItemRef.current = true;
  }, [location.state]);

  useEffect(() => {
    if (!savedAddresses.length) return;
    if (!selectedAddressId) {
      setSelectedAddressId(savedAddresses[0].id);
      return;
    }
    const selected = getAddressById(savedAddresses, selectedAddressId);
    if (!selected) {
      setSelectedAddressId(savedAddresses[0].id);
    }
  }, [savedAddresses, selectedAddressId]);

  useEffect(() => {
    const selected = getAddressById(savedAddresses, selectedAddressId);
    if (!selected) return;
    setDeliveryDetails((prev) => ({
      ...prev,
      fullName: selected.fullName || prev.fullName,
      phone: selected.phone || prev.phone,
      address: selected.address || prev.address,
      addressLabel: selected.label || prev.addressLabel,
    }));
  }, [savedAddresses, selectedAddressId]);

  const subtotal = getCartSubtotal(cartItems);
  const deliveryFee = subtotal <= 0 ? 0 : subtotal >= 399 ? 0 : 39;
  const platformFee = subtotal <= 0 ? 0 : 6;
  const taxesAndCharges = Math.round(subtotal * 0.05);

  const appliedCoupon = appliedCouponCode ? COUPONS[appliedCouponCode] : null;
  const discount = appliedCoupon
    ? appliedCoupon.getDiscount({ subtotal, deliveryFee, platformFee, taxesAndCharges })
    : 0;

  const total = Math.max(0, subtotal + deliveryFee + platformFee + taxesAndCharges - discount);
  const orderList = remoteOrders.length ? remoteOrders : recentOrders;

  const filteredOrderList = useMemo(() => {
    const search = orderSearch.trim().toLowerCase();

    return [...orderList]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .filter((order) => {
        const normalizedStatus = normalizeOrderStatus(order?.status);
        if (orderStatusFilter !== "all" && normalizedStatus !== orderStatusFilter) return false;

        if (!search) return true;
        const orderId = String(order?.orderId || order?.id || "").toLowerCase();
        const restaurantName = String(order?.restaurant?.name || "").toLowerCase();
        const itemNames = getOrderItems(order)
          .map((item) => String(item?.name || "").toLowerCase())
          .join(" ");
        return (
          orderId.includes(search) ||
          restaurantName.includes(search) ||
          itemNames.includes(search)
        );
      });
  }, [orderList, orderSearch, orderStatusFilter]);

  const loadOrders = useCallback(async () => {
    if (!hasToken) {
      setRemoteOrders([]);
      return;
    }

    setOrdersLoading(true);
    setOrdersError("");
    try {
      const data = await apiRequest(API_ENDPOINTS.ORDERS.GET_MY_ORDERS, { method: "GET" });
      setRemoteOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      setOrdersError(error.message || "Unable to load orders right now.");
      setRemoteOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  }, [hasToken]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Initialize notification system
  useEffect(() => {
    const initNotifications = async () => {
      const granted = await NotificationManager.requestPermission();
      setNotificationsEnabled(granted);
      
      if (granted) {
        notifyApp("Notifications enabled! You'll get updates on your orders.", "success");
      }
    };

    if (hasToken && Notification?.permission === "default") {
      initNotifications();
    }
  }, [hasToken]);

  // Start order polling for real-time updates
  useEffect(() => {
    if (!hasToken || !showOrdersView) {
      // Stop polling if not logged in or not on orders view
      if (pollingServiceRef.current) {
        pollingServiceRef.current.stop();
      }
      return;
    }

    // Initialize polling service
    if (!pollingServiceRef.current) {
      pollingServiceRef.current = new OrderPollingService();
    }

    // Fetch function for polling
    const fetchOrders = async () => {
      try {
        const data = await apiRequest(API_ENDPOINTS.ORDERS.GET_MY_ORDERS, { method: "GET" });
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error("Polling error:", error);
        return [];
      }
    };

    // Callback when status changes
    const handleStatusChange = (order, oldStatus, newStatus) => {
      notifyApp(`Order ${order.orderId || order.id} status: ${formatOrderStatus(newStatus)}`, "info");
      // Reload orders to update UI (debounced)
      setTimeout(() => loadOrders(), 500);
    };

    // Start polling
    pollingServiceRef.current.start(fetchOrders, handleStatusChange);

    // Cleanup on unmount
    return () => {
      if (pollingServiceRef.current) {
        pollingServiceRef.current.stop();
      }
    };
  }, [hasToken, showOrdersView]);

  const handleQtyChange = (cartItem, delta) => {
    const nextQuantity = Number(cartItem.quantity) + delta;
    if (nextQuantity <= 0) {
      removeCartItem(cartItem.id);
      return;
    }
    updateCartItemQuantity(cartItem.id, nextQuantity);
  };

  const handleRemoveItem = (cartItemId) => {
    removeCartItem(cartItemId);
  };

  const applyCoupon = () => {
    const normalized = couponInput.trim().toUpperCase();
    if (!normalized) {
      const message = "Enter coupon code";
      setCouponError(message);
      notifyApp(message, "warning");
      return;
    }

    const coupon = COUPONS[normalized];
    if (!coupon) {
      const message = "Invalid coupon code";
      setCouponError(message);
      notifyApp(message, "error");
      return;
    }

    if (subtotal < coupon.minSubtotal) {
      const message = `Minimum subtotal ₹${coupon.minSubtotal} required for ${normalized}`;
      setCouponError(message);
      notifyApp(message, "warning");
      return;
    }

    setAppliedCouponCode(normalized);
    setCouponError("");
    notifyApp(`${normalized} applied`, "success");
  };

  const clearCoupon = () => {
    setAppliedCouponCode("");
    setCouponError("");
    setCouponInput("");
    notifyApp("Coupon removed", "info");
  };

  const saveCurrentAddress = () => {
    const payload = {
      label: deliveryDetails.addressLabel,
      fullName: deliveryDetails.fullName,
      phone: deliveryDetails.phone,
      address: deliveryDetails.address,
    };

    if (!payload.address.trim()) {
      notifyApp("Enter address before saving", "warning");
      return;
    }

    const updated = addSavedAddress(payload);
    setSavedAddresses(updated);
    if (updated.length > 0) {
      setSelectedAddressId(updated[0].id);
    }
    notifyApp("Address saved", "success");
  };

  const handleDeleteAddress = (addressId) => {
    const updated = removeSavedAddress(addressId);
    setSavedAddresses(updated);
    if (selectedAddressId === addressId) {
      setSelectedAddressId(updated[0]?.id || "");
    }
    notifyApp("Address removed", "info");
  };

  const handlePayment = async (event) => {
    event.preventDefault();
    
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      notifyApp("Please login to place an order", "warning");
      window.location.href = "/login";
      return;
    }
    
    if (!cartItems.length) {
      notifyApp("Your cart is empty", "warning");
      return;
    }
    if (
      !deliveryDetails.fullName.trim() ||
      !deliveryDetails.phone.trim() ||
      !deliveryDetails.address.trim()
    ) {
      notifyApp("Complete delivery details first", "warning");
      return;
    }

    setIsPaying(true);
    try {
      const firstItem = cartItems[0];
      const orderData = {
        items: cartItems.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        item: {
          name: firstItem.name,
          price: firstItem.price,
          image: firstItem.image,
        },
        restaurant: {
          id: firstItem.restaurantId,
          name: firstItem.restaurantName,
        },
        address: deliveryDetails.address.trim(),
        addressLabel: deliveryDetails.addressLabel.trim() || "Address",
        phone: deliveryDetails.phone.trim(),
        fullName: deliveryDetails.fullName.trim(),
        paymentMethod,
        subtotal,
        total,
        deliveryFee,
        platformFee,
        discount,
        couponCode: appliedCouponCode || null,
        deliveryNote: deliveryDetails.deliveryNote.trim(),
        taxesAndCharges,
      };

      const response = await apiRequest(API_ENDPOINTS.ORDERS.PLACE_ORDER, {
        method: "POST",
        body: JSON.stringify(orderData),
      });

      const orderMeta = {
        orderId: response.orderId,
        createdAt: new Date().toISOString(),
        total,
        items: orderData.items,
        restaurant: orderData.restaurant,
        status: "confirmed",
      };

      addRecentOrderLocal(orderMeta);
      setSuccessOrderMeta(orderMeta);
      setIsPaid(true);
      clearCartItems();
      setAppliedCouponCode("");
      setCouponInput("");
      notifyApp(`Order ${response.orderId} placed successfully`, "success");
      await loadOrders();
    } catch (error) {
      const message = error.message || "Payment failed. Please try again.";
      
      // Handle token expiration or invalid token
      if (message.includes("token") || message.includes("Token") || message.includes("Authentication")) {
        localStorage.removeItem("token");
        notifyApp("Session expired. Please login again.", "error");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
        return;
      }
      
      setCouponError(message);
      notifyApp(message, "error");
    } finally {
      setIsPaying(false);
    }
  };

  const handleReorder = (order) => {
    const items = getOrderItems(order);
    if (!items.length) {
      notifyApp("No items available to reorder", "warning");
      return;
    }

    const restaurantId = String(order?.restaurant?.id || order?.orderId || order?.id || "previous");
    const restaurantName = order?.restaurant?.name || "Previous order";

    items.forEach((item) => {
      const parsedPrice = Number(item?.price);
      const fallbackPrice = parsePrice(item?.offer) || 99;
      const normalizedPrice = Number.isFinite(parsedPrice) && parsedPrice > 0 ? parsedPrice : fallbackPrice;

      addCartItem({
        restaurantId,
        restaurantName,
        item: {
          name: item?.name || "Food item",
          image: item?.image || "/images/Pizza.jpg",
          offer: item?.offer || "REORDERED ITEM",
          eta: item?.eta || "",
          cuisines: item?.cuisines || "",
          area: item?.area || "",
          price: normalizedPrice,
        },
        quantity: Number(item?.quantity) > 0 ? Number(item.quantity) : 1,
      });
    });

    const itemCount = items.reduce((sum, item) => sum + (Number(item?.quantity) > 0 ? Number(item.quantity) : 1), 0);
    notifyApp(`${itemCount} item${itemCount === 1 ? "" : "s"} added to cart`, "success");
  };

  const handleCancelOrder = async (order) => {
    const orderId = order?.id;
    const orderDisplayId = order?.orderId || order?.id;

    if (!orderId) {
      notifyApp("Invalid order", "error");
      return;
    }

    // Check if order can be cancelled
    const normalizedStatus = normalizeOrderStatus(order?.status);
    if (normalizedStatus === "delivered") {
      notifyApp("Cannot cancel delivered order", "warning");
      return;
    }

    if (normalizedStatus === "cancelled") {
      notifyApp("Order already cancelled", "warning");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to cancel order ${orderDisplayId}?`
    );

    if (!confirmed) return;

    try {
      await apiRequest(API_ENDPOINTS.ORDERS.CANCEL_ORDER(orderId), {
        method: "PATCH",
        body: JSON.stringify({
          cancelled_reason: "Cancelled by user",
        }),
      });

      notifyApp(`Order ${orderDisplayId} cancelled successfully`, "success");
      await loadOrders(); // Reload orders to show updated status
    } catch (error) {
      const message = error.message || "Failed to cancel order";
      notifyApp(message, "error");
    }
  };

  const handleTrackOrder = (order) => {
    setTrackingModal({ isOpen: true, order });
  };

  const closeTrackingModal = () => {
    setTrackingModal({ isOpen: false, order: null });
  };

  const allowOnlyDigits = (event, maxLength) => {
    const input = event.currentTarget;
    input.value = input.value.replace(/\D/g, "").slice(0, maxLength);
  };

  const allowOnlyNameChars = (event) => {
    const input = event.currentTarget;
    input.value = input.value.replace(/[^A-Za-z\s'.-]/g, "").replace(/\s{2,}/g, " ");
  };

  const formatExpiry = (event) => {
    const input = event.currentTarget;
    const digits = input.value.replace(/\D/g, "").slice(0, 4);
    input.value = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };

  if (!cartItems.length && !showOrdersView && !isPaid) {
    return (
      <section className="checkout-page">
        <div className="checkout-shell container checkout-empty">
          <h1>Your cart is empty</h1>
          <p>Add dishes from restaurant pages to continue checkout.</p>
          <Link to="/" className="checkout-back-link">
            Browse restaurants
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="checkout-page">
      <div className="checkout-shell container">
        <header className="checkout-head">
          <p className="checkout-kicker">Secure Checkout</p>
          <h1>{showOrdersView ? "My orders" : "Place your order"}</h1>
          <p className="checkout-subtitle">
            {showOrdersView
              ? "Track your recent order activity"
              : `${cartItems.length} item${cartItems.length === 1 ? "" : "s"} in cart`}
          </p>
          <nav className="checkout-view-switch" aria-label="Checkout views">
            <Link to="/cart" className={`checkout-view-link${!showOrdersView ? " active" : ""}`}>
              Checkout
            </Link>
            <Link to="/orders" className={`checkout-view-link${showOrdersView ? " active" : ""}`}>
              Orders
            </Link>
          </nav>
        </header>

        {!showOrdersView && isPaid ? (
          <div className="checkout-success">
            <h2>Payment successful</h2>
            <p>
              Order <strong>{successOrderMeta?.orderId || "confirmed"}</strong> placed.
            </p>
            <div className="checkout-success-actions">
              <Link to="/" className="checkout-home-link">
                Continue shopping
              </Link>
              <Link to="/orders" className="checkout-back-link">
                View my orders
              </Link>
            </div>
          </div>
        ) : null}

        {!showOrdersView ? (
          <div className="checkout-layout">
            <aside className="checkout-summary">
              <div className="checkout-item-card checkout-item-card-list">
                {cartItems.map((item) => (
                  <article key={item.id} className="checkout-item-row">
                    <img src={item.image} alt={item.name} decoding="async" fetchPriority="high" />
                    <div className="checkout-item-row-info">
                      <h2>{item.name}</h2>
                      <p>{item.restaurantName}</p>
                      <div className="checkout-item-row-meta">
                        <span>₹{item.price}</span>
                        <div className="checkout-qty-control">
                          <button type="button" onClick={() => handleQtyChange(item, -1)}>
                            −
                          </button>
                          <strong>{item.quantity}</strong>
                          <button type="button" onClick={() => handleQtyChange(item, 1)}>
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          className="checkout-remove-btn"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="checkout-bill">
                <h3>Bill details</h3>
                <div className="checkout-bill-row">
                  <span>Item total</span>
                  <strong>₹{subtotal}</strong>
                </div>
                <div className="checkout-bill-row">
                  <span>Delivery fee</span>
                  <strong>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</strong>
                </div>
                <div className="checkout-bill-row">
                  <span>Platform fee</span>
                  <strong>₹{platformFee}</strong>
                </div>
                <div className="checkout-bill-row">
                  <span>Taxes and charges</span>
                  <strong>₹{taxesAndCharges}</strong>
                </div>
                {discount > 0 ? (
                  <div className="checkout-bill-row checkout-discount-row">
                    <span>Coupon discount</span>
                    <strong>-₹{discount}</strong>
                  </div>
                ) : null}
                <div className="checkout-bill-row checkout-bill-total">
                  <span>To pay</span>
                  <strong>₹{total}</strong>
                </div>
              </div>
            </aside>

            <form className="checkout-form" onSubmit={handlePayment}>
              <h2>Saved addresses</h2>
              {savedAddresses.length ? (
                <div className="checkout-addresses">
                  {savedAddresses.map((address) => (
                    <label key={address.id} className="checkout-address-item">
                      <input
                        type="radio"
                        name="savedAddress"
                        checked={selectedAddressId === address.id}
                        onChange={() => setSelectedAddressId(address.id)}
                      />
                      <div>
                        <strong>{address.label}</strong>
                        <p>{address.address}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteAddress(address.id)}
                        className="checkout-address-delete"
                      >
                        Remove
                      </button>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="checkout-cod-note">No saved addresses yet.</p>
              )}

              <h2>Delivery details</h2>
              <label className="checkout-field">
                <span>Label</span>
                <input
                  type="text"
                  placeholder="Home / Work"
                  value={deliveryDetails.addressLabel}
                  onChange={(e) =>
                    setDeliveryDetails((prev) => ({ ...prev, addressLabel: e.target.value }))
                  }
                />
              </label>

              <label className="checkout-field">
                <span>Full name</span>
                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  autoComplete="name"
                  inputMode="text"
                  pattern="[A-Za-z][A-Za-z\\s'.-]*"
                  value={deliveryDetails.fullName}
                  onChange={(e) =>
                    setDeliveryDetails((prev) => ({ ...prev, fullName: e.target.value }))
                  }
                  onInput={allowOnlyNameChars}
                  title="Use letters and spaces only"
                />
              </label>

              <label className="checkout-field">
                <span>Phone number</span>
                <input
                  type="tel"
                  required
                  placeholder="Enter mobile number"
                  inputMode="numeric"
                  autoComplete="tel"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  value={deliveryDetails.phone}
                  onChange={(e) =>
                    setDeliveryDetails((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  onInput={(event) => allowOnlyDigits(event, 10)}
                  title="Enter a 10-digit mobile number"
                />
              </label>

              <label className="checkout-field">
                <span>Delivery address</span>
                <textarea
                  required
                  rows={3}
                  placeholder="House no, street, area"
                  value={deliveryDetails.address}
                  onChange={(e) =>
                    setDeliveryDetails((prev) => ({ ...prev, address: e.target.value }))
                  }
                />
              </label>

              <label className="checkout-field">
                <span>Delivery note (optional)</span>
                <textarea
                  rows={2}
                  placeholder="Landmark, gate code, leave at door..."
                  value={deliveryDetails.deliveryNote}
                  onChange={(e) =>
                    setDeliveryDetails((prev) => ({ ...prev, deliveryNote: e.target.value }))
                  }
                />
              </label>

              <button type="button" className="checkout-home-link" onClick={saveCurrentAddress}>
                Save this address
              </button>

              <h2>Coupon</h2>
              <div className="checkout-coupon-row">
                <input
                  type="text"
                  placeholder="Enter coupon (WELCOME10, SAVE50, FREESHIP)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                />
                <button type="button" className="checkout-back-link" onClick={applyCoupon}>
                  Apply
                </button>
                {appliedCouponCode ? (
                  <button type="button" className="checkout-remove-btn" onClick={clearCoupon}>
                    Remove
                  </button>
                ) : null}
              </div>
              {appliedCoupon ? (
                <p className="checkout-coupon-success">
                  {appliedCouponCode} applied: {appliedCoupon.label}
                </p>
              ) : null}
              {couponError ? <p className="checkout-coupon-error">{couponError}</p> : null}

              <h2>Payment method</h2>
              <div className="checkout-pay-grid">
                {PAYMENT_METHODS.map((method) => (
                  <label
                    key={method.id}
                    className={`checkout-pay-option ${paymentMethod === method.id ? "active" : ""}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(event) => setPaymentMethod(event.target.value)}
                    />
                    <span className="checkout-pay-title">{method.label}</span>
                    <span className="checkout-pay-subtitle">{method.description}</span>
                  </label>
                ))}
              </div>

              {paymentMethod === "upi" ? (
                <label className="checkout-field">
                  <span>UPI ID</span>
                  <input type="text" required placeholder="name@bank" />
                </label>
              ) : null}

              {paymentMethod === "card" ? (
                <div className="checkout-card-grid">
                  <label className="checkout-field">
                    <span>Card number</span>
                    <input
                      type="text"
                      required
                      placeholder="1234 5678 9012 3456"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      pattern="[0-9]{16}"
                      maxLength={16}
                      onInput={(event) => allowOnlyDigits(event, 16)}
                      title="Enter a 16-digit card number"
                    />
                  </label>
                  <div className="checkout-card-expiry-cvv">
                    <label className="checkout-field">
                      <span>Expiry</span>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        pattern="(0[1-9]|1[0-2])\\/([0-9]{2})"
                        maxLength={5}
                        onInput={formatExpiry}
                        title="Use MM/YY format"
                      />
                    </label>
                    <label className="checkout-field">
                      <span>CVV</span>
                      <input
                        type="password"
                        required
                        placeholder="123"
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        pattern="[0-9]{3,4}"
                        maxLength={4}
                        onInput={(event) => allowOnlyDigits(event, 4)}
                        title="Enter 3 or 4 digit CVV"
                      />
                    </label>
                  </div>
                </div>
              ) : null}

              {paymentMethod === "cod" ? (
                <p className="checkout-cod-note">
                  Cash on delivery selected. Keep exact amount handy for quick handover.
                </p>
              ) : null}

              <button type="submit" className="checkout-pay-btn" disabled={isPaying}>
                {isPaying
                  ? "Processing payment..."
                  : !hasToken
                  ? `Login to Pay ₹${total}`
                  : `Pay ₹${total}`}
              </button>
              
              {!hasToken && (
                <p className="checkout-cod-note" style={{ marginTop: '10px', textAlign: 'center' }}>
                  <Link to="/login" style={{ color: '#ff6b35', textDecoration: 'underline' }}>
                    Login
                  </Link>
                  {' or '}
                  <Link to="/signup" style={{ color: '#ff6b35', textDecoration: 'underline' }}>
                    Sign up
                  </Link>
                  {' to place your order'}
                </p>
              )}
            </form>
          </div>
        ) : null}

        {showOrdersView ? (
          <section className="checkout-orders-panel" id="orders-panel">
            <div className="checkout-orders-head">
              <h2>Recent orders</h2>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {notificationsEnabled ? (
                  <span className="notification-status" title="Notifications enabled">
                    🔔 Live Updates
                  </span>
                ) : (
                  <button
                    type="button"
                    className="checkout-enable-notifications"
                    onClick={async () => {
                      const granted = await NotificationManager.requestPermission();
                      setNotificationsEnabled(granted);
                      if (granted) {
                        notifyApp("Notifications enabled!", "success");
                      } else {
                        notifyApp("Enable notifications in browser settings", "warning");
                      }
                    }}
                    title="Enable notifications for order updates"
                  >
                    🔕 Enable Alerts
                  </button>
                )}
                <button type="button" className="checkout-back-link" onClick={loadOrders}>
                  Refresh
                </button>
              </div>
            </div>

            <div className="checkout-orders-toolbar">
              <input
                type="search"
                className="checkout-order-search"
                value={orderSearch}
                onChange={(event) => setOrderSearch(event.target.value)}
                placeholder="Search by order ID, restaurant, or item"
                aria-label="Search orders"
              />
              <div className="checkout-order-filters" aria-label="Filter orders by status">
                {ORDER_STATUS_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`checkout-filter-chip checkout-filter-chip-${option.id}${
                      orderStatusFilter === option.id ? " active" : ""
                    }`}
                    onClick={() => setOrderStatusFilter(option.id)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {ordersLoading ? <p className="checkout-cod-note">Loading orders...</p> : null}
            {ordersError ? <p className="checkout-coupon-error">{ordersError}</p> : null}
            {!ordersLoading && !orderList.length ? (
              <p className="checkout-cod-note">No orders found yet.</p>
            ) : null}
            {!ordersLoading && orderList.length > 0 && !filteredOrderList.length ? (
              <p className="checkout-cod-note">No orders match your current filters.</p>
            ) : null}

            <div className="checkout-order-list">
              {filteredOrderList.map((order) => {
                const items = getOrderItems(order);
                const normalizedStatus = normalizeOrderStatus(order?.status);
                const restaurantName = order?.restaurant?.name || "";
                const totalAmount = Number.isFinite(Number(order?.total)) ? Number(order.total) : 0;

                return (
                  <article key={order.orderId || order.id} className="checkout-order-card">
                    <div className="checkout-order-card-head">
                      <strong>{order.orderId || order.id}</strong>
                      <span>{formatOrderDate(order.createdAt)}</span>
                    </div>
                    {restaurantName ? <p className="checkout-order-restaurant">{restaurantName}</p> : null}
                    <p>
                      {items.length} item{items.length === 1 ? "" : "s"} • ₹{totalAmount}
                    </p>
                    <ul>
                      {items.slice(0, 3).map((item, index) => (
                        <li key={`${item.name}-${index}`}>
                          {item.name} x{item.quantity || 1}
                        </li>
                      ))}
                    </ul>
                    <div className="checkout-order-card-footer">
                      <span className={`checkout-status-chip checkout-status-${normalizedStatus}`}>
                        {formatOrderStatus(normalizedStatus)}
                      </span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {normalizedStatus === "on_the_way" && (
                          <button
                            type="button"
                            className="checkout-track-btn"
                            onClick={() => handleTrackOrder(order)}
                          >
                            Track
                          </button>
                        )}
                        {normalizedStatus !== "delivered" && normalizedStatus !== "cancelled" && (
                          <button
                            type="button"
                            className="checkout-cancel-btn"
                            onClick={() => handleCancelOrder(order)}
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          type="button"
                          className="checkout-reorder-btn"
                          onClick={() => handleReorder(order)}
                        >
                          Reorder
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ) : (
          <section className="checkout-orders-shortcut">
            <h3>Want to track your orders?</h3>
            <p>Open your order history for status updates and past invoices.</p>
            <Link to="/orders" className="checkout-back-link">
              View order history
            </Link>
          </section>
        )}

        {trackingModal.isOpen && trackingModal.order && (
          <div className="tracking-modal-overlay" onClick={closeTrackingModal}>
            <div className="tracking-modal" onClick={(e) => e.stopPropagation()}>
              <div className="tracking-modal-header">
                <h2>Track Order</h2>
                <button className="tracking-modal-close" onClick={closeTrackingModal}>
                  ×
                </button>
              </div>
              <div className="tracking-modal-body">
                <div className="tracking-order-info">
                  <p className="tracking-order-id">
                    Order ID: <strong>{trackingModal.order.orderId || trackingModal.order.id}</strong>
                  </p>
                  <p className="tracking-restaurant">
                    {trackingModal.order.restaurant?.name || "Restaurant"}
                  </p>
                </div>

                {/* Live Tracking Map */}
                <LiveTrackingMap
                  orderId={trackingModal.order.orderId || trackingModal.order.id}
                  restaurantName={trackingModal.order.restaurant?.name || "Restaurant"}
                />

                <div className="tracking-timeline">
                  <div className="tracking-step completed">
                    <div className="tracking-step-icon">✓</div>
                    <div className="tracking-step-content">
                      <h3>Order Confirmed</h3>
                      <p>Your order has been received</p>
                      <span className="tracking-step-time">
                        {formatOrderDate(trackingModal.order.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="tracking-step completed">
                    <div className="tracking-step-icon">✓</div>
                    <div className="tracking-step-content">
                      <h3>Preparing</h3>
                      <p>Restaurant is preparing your food</p>
                      <span className="tracking-step-time">Demo: 5 mins ago</span>
                    </div>
                  </div>

                  <div className="tracking-step active">
                    <div className="tracking-step-icon">🚴</div>
                    <div className="tracking-step-content">
                      <h3>On the Way</h3>
                      <p>Your order is being delivered</p>
                      <span className="tracking-step-time">Demo: In progress</span>
                    </div>
                  </div>

                  <div className="tracking-step">
                    <div className="tracking-step-icon">📦</div>
                    <div className="tracking-step-content">
                      <h3>Delivered</h3>
                      <p>Order will be delivered soon</p>
                      <span className="tracking-step-time">Demo: ETA 15-20 mins</span>
                    </div>
                  </div>
                </div>

                <div className="tracking-items">
                  <h3>Order Items</h3>
                  <ul>
                    {getOrderItems(trackingModal.order).map((item, index) => (
                      <li key={`${item.name}-${index}`}>
                        {item.name} x{item.quantity || 1}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="tracking-total">
                  <span>Total Amount:</span>
                  <strong>₹{Number(trackingModal.order.total || 0)}</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
