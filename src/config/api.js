// API Configuration - Updated for production deployment
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export const API_ENDPOINTS = {
  HEALTH: `${API_BASE_URL}/api/health`,
  AUTH: {
    SIGNUP: `${API_BASE_URL}/api/auth/signup`,
    SIGNUP_EMAIL: `${API_BASE_URL}/api/auth/signup-email`,
    RESEND_SIGNUP_OTP: `${API_BASE_URL}/api/auth/signup/resend-otp`,
    VERIFY_SIGNUP_OTP: `${API_BASE_URL}/api/auth/signup/verify-otp`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
  },
  RESTAURANTS: {
    GET_ALL: `${API_BASE_URL}/api/restaurants`,
    GET_BY_ID: (id) => `${API_BASE_URL}/api/restaurants/${id}`,
  },
  ORDERS: {
    PLACE_ORDER: `${API_BASE_URL}/api/orders/place-order`,
    GET_MY_ORDERS: `${API_BASE_URL}/api/orders/my-orders`,
    CANCEL_ORDER: (orderId) => `${API_BASE_URL}/api/orders/cancel-order/${orderId}`,
    UPDATE_STATUS: (orderId) => `${API_BASE_URL}/api/orders/${orderId}/status`,
  },
  ADMIN: {
    GET_ALL_ORDERS: `${API_BASE_URL}/api/admin/orders`,
    GET_STATS: `${API_BASE_URL}/api/admin/stats`,
  },
};

export const APP_SYNC_EVENT = "foodbyme:sync";
export const APP_TOAST_EVENT = "foodbyme:toast";

export const STORAGE_KEYS = {
  CART: "foodbyme_cart_v1",
  FAVORITES: "foodbyme_favorites_v1",
  ADDRESSES: "foodbyme_addresses_v1",
  RECENT_ORDERS: "foodbyme_recent_orders_v1",
};
function hasWindow() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function parseStoredJson(value, fallback) {
  try {
    const parsed = JSON.parse(value);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function readStorage(key, fallback) {
  if (!hasWindow()) return fallback;
  const raw = localStorage.getItem(key);
  return raw == null ? fallback : parseStoredJson(raw, fallback);
}

function writeStorage(key, value) {
  if (!hasWindow()) return value;
  localStorage.setItem(key, JSON.stringify(value));
  dispatchAppSync();
  return value;
}

export function dispatchAppSync() {
  if (!hasWindow()) return;
  window.dispatchEvent(new Event(APP_SYNC_EVENT));
}

export function notifyApp(payload, type = "info", duration = 2800) {
  if (!hasWindow()) return;

  const detail =
    typeof payload === "string"
      ? {
          id: `toast_${Date.now()}_${Math.floor(Math.random() * 1e5)}`,
          message: payload,
          type,
          duration,
        }
      : {
          id:
            payload?.id ||
            `toast_${Date.now()}_${Math.floor(Math.random() * 1e5)}`,
          message: payload?.message || "",
          type: payload?.type || "info",
          duration: Number(payload?.duration) || duration,
        };

  if (!detail.message) return;
  window.dispatchEvent(new CustomEvent(APP_TOAST_EVENT, { detail }));
}

function createCartItemId(restaurantId, name, price) {
  return `${restaurantId}-${name}-${price}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeQuantity(value) {
  const quantity = Number(value);
  if (!Number.isFinite(quantity) || quantity < 1) return 1;
  return Math.min(20, Math.round(quantity));
}

function isValidCartItem(item) {
  return Boolean(
    item &&
      item.id &&
      item.restaurantId &&
      item.restaurantName &&
      item.name &&
      Number.isFinite(Number(item.price))
  );
}

export function createCartItem({ restaurantId, restaurantName, item, quantity = 1 }) {
  const normalizedPrice = Number(item?.price || 0);
  const safeName = String(item?.name || "Food item").trim();
  const safeRestaurantId = String(restaurantId || "").trim();
  const safeRestaurantName = String(restaurantName || "Restaurant").trim();

  return {
    id: createCartItemId(safeRestaurantId, safeName.toLowerCase(), normalizedPrice),
    restaurantId: safeRestaurantId,
    restaurantName: safeRestaurantName,
    name: safeName,
    image: item?.image || "/images/Pizza.jpg",
    offer: item?.offer || "",
    eta: item?.eta || "",
    cuisines: item?.cuisines || "",
    area: item?.area || "",
    price: normalizedPrice > 0 ? normalizedPrice : 99,
    quantity: normalizeQuantity(quantity),
  };
}

export function getCartItems() {
  const rawItems = readStorage(STORAGE_KEYS.CART, []);
  if (!Array.isArray(rawItems)) return [];
  return rawItems.filter(isValidCartItem).map((item) => ({
    ...item,
    price: Number(item.price),
    quantity: normalizeQuantity(item.quantity),
  }));
}

export function setCartItems(items) {
  const safeItems = Array.isArray(items) ? items.filter(isValidCartItem) : [];
  return writeStorage(STORAGE_KEYS.CART, safeItems);
}

export function addCartItem(itemInput) {
  const nextItem = createCartItem(itemInput);
  const current = getCartItems();
  const existingIndex = current.findIndex((item) => item.id === nextItem.id);

  if (existingIndex >= 0) {
    current[existingIndex] = {
      ...current[existingIndex],
      quantity: normalizeQuantity(current[existingIndex].quantity + nextItem.quantity),
    };
    return setCartItems(current);
  }

  return setCartItems([...current, nextItem]);
}

export function updateCartItemQuantity(cartItemId, quantity) {
  const current = getCartItems();
  const next = current
    .map((item) =>
      item.id === cartItemId
        ? { ...item, quantity: normalizeQuantity(quantity) }
        : item
    )
    .filter((item) => item.quantity > 0);
  return setCartItems(next);
}

export function removeCartItem(cartItemId) {
  const current = getCartItems();
  return setCartItems(current.filter((item) => item.id !== cartItemId));
}

export function clearCartItems() {
  return setCartItems([]);
}

export function getCartCount(cartItems = getCartItems()) {
  return cartItems.reduce((sum, item) => sum + normalizeQuantity(item.quantity), 0);
}

export function getCartSubtotal(cartItems = getCartItems()) {
  return cartItems.reduce(
    (sum, item) => sum + Number(item.price) * normalizeQuantity(item.quantity),
    0
  );
}

export function getFavoriteRestaurantIds() {
  const ids = readStorage(STORAGE_KEYS.FAVORITES, []);
  return Array.isArray(ids) ? ids.map(String) : [];
}

export function isFavoriteRestaurant(restaurantId) {
  const id = String(restaurantId || "");
  return getFavoriteRestaurantIds().includes(id);
}

export function toggleFavoriteRestaurant(restaurantId) {
  const id = String(restaurantId || "").trim();
  if (!id) return getFavoriteRestaurantIds();
  const current = getFavoriteRestaurantIds();
  const next = current.includes(id)
    ? current.filter((value) => value !== id)
    : [...current, id];
  return writeStorage(STORAGE_KEYS.FAVORITES, next);
}

export function getSavedAddresses() {
  const addresses = readStorage(STORAGE_KEYS.ADDRESSES, []);
  return Array.isArray(addresses) ? addresses : [];
}

export function addSavedAddress(address) {
  const nextAddress = {
    id: `addr_${Date.now()}_${Math.floor(Math.random() * 1e5)}`,
    label: String(address?.label || "Address").trim() || "Address",
    fullName: String(address?.fullName || "").trim(),
    phone: String(address?.phone || "").trim(),
    address: String(address?.address || "").trim(),
  };

  if (!nextAddress.address) return getSavedAddresses();
  const current = getSavedAddresses();
  return writeStorage(STORAGE_KEYS.ADDRESSES, [nextAddress, ...current].slice(0, 8));
}

export function removeSavedAddress(addressId) {
  const id = String(addressId || "");
  const current = getSavedAddresses();
  return writeStorage(
    STORAGE_KEYS.ADDRESSES,
    current.filter((item) => item.id !== id)
  );
}

export function getRecentOrdersLocal() {
  const orders = readStorage(STORAGE_KEYS.RECENT_ORDERS, []);
  return Array.isArray(orders) ? orders : [];
}

export function addRecentOrderLocal(order) {
  const current = getRecentOrdersLocal();
  const nextOrder = {
    id: order?.orderId || `local_${Date.now()}`,
    orderId: order?.orderId || `local_${Date.now()}`,
    createdAt: order?.createdAt || new Date().toISOString(),
    total: Number(order?.total || 0),
    items: Array.isArray(order?.items) ? order.items : [],
    restaurant: order?.restaurant || null,
    status: order?.status || "confirmed",
  };
  return writeStorage(STORAGE_KEYS.RECENT_ORDERS, [nextOrder, ...current].slice(0, 12));
}

export const apiRequest = async (url, options = {}) => {
  if (!url || typeof url !== "string") {
    throw new Error("API endpoint is not configured");
  }

  const token = hasWindow() ? localStorage.getItem("token") : null;

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const raw = await response.text();
    let data = {};
    if (raw) {
      try {
        data = JSON.parse(raw);
      } catch {
        data = {};
      }
    }

    if (!response.ok) {
      const compactRaw = typeof raw === "string" ? raw.replace(/\s+/g, " ").trim() : "";
      const isHtmlResponse =
        compactRaw.toLowerCase().startsWith("<!doctype") ||
        compactRaw.toLowerCase().startsWith("<html");
      const fallbackMessage = isHtmlResponse
        ? `Request failed (${response.status})`
        : compactRaw || `Request failed (${response.status})`;

      throw new Error(data.message || data.error || fallbackMessage);
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export default API_BASE_URL;
// Force rebuild
