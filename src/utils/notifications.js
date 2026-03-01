// Browser Notification System for Order Updates

export const NotificationManager = {
  // Request permission for browser notifications
  async requestPermission() {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications");
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }

    return false;
  },

  // Show browser notification
  showNotification(title, options = {}) {
    if (!("Notification" in window)) {
      console.warn("Notifications not supported");
      return null;
    }

    if (Notification.permission !== "granted") {
      console.warn("Notification permission not granted");
      return null;
    }

    const defaultOptions = {
      icon: "/images/Pizza.jpg",
      badge: "/images/Pizza.jpg",
      vibrate: [200, 100, 200],
      requireInteraction: false,
      ...options,
    };

    try {
      const notification = new Notification(title, defaultOptions);
      
      // Auto close after 5 seconds
      setTimeout(() => notification.close(), 5000);
      
      return notification;
    } catch (error) {
      console.error("Failed to show notification:", error);
      return null;
    }
  },

  // Order status change notification
  notifyOrderStatus(orderId, status, restaurantName) {
    const statusMessages = {
      confirmed: {
        title: "Order Confirmed! 🎉",
        body: `Your order #${orderId} from ${restaurantName} has been confirmed.`,
      },
      preparing: {
        title: "Preparing Your Food 👨‍🍳",
        body: `${restaurantName} is preparing your order #${orderId}.`,
      },
      on_the_way: {
        title: "On the Way! 🚴",
        body: `Your order #${orderId} is on the way. Get ready!`,
      },
      delivered: {
        title: "Delivered! 📦",
        body: `Your order #${orderId} has been delivered. Enjoy your meal!`,
      },
      cancelled: {
        title: "Order Cancelled",
        body: `Order #${orderId} has been cancelled.`,
      },
    };

    const message = statusMessages[status] || {
      title: "Order Update",
      body: `Your order #${orderId} status has been updated.`,
    };

    return this.showNotification(message.title, {
      body: message.body,
      tag: `order-${orderId}`,
      data: { orderId, status },
    });
  },

  // Delivery ETA notification
  notifyDeliveryETA(orderId, minutes) {
    return this.showNotification(`Arriving in ${minutes} minutes! ⏰`, {
      body: `Your order #${orderId} will arrive soon.`,
      tag: `eta-${orderId}`,
    });
  },

  // Offer/Promotion notification
  notifyOffer(title, message) {
    return this.showNotification(title, {
      body: message,
      tag: "offer",
      icon: "/images/Pizza.jpg",
    });
  },
};

// Order polling service for real-time updates
export class OrderPollingService {
  constructor() {
    this.pollingInterval = null;
    this.lastOrderStatuses = new Map();
    this.pollFrequency = 60000; // 60 seconds (reduced from 30)
  }

  start(fetchOrdersFn, onStatusChange) {
    if (this.pollingInterval) {
      this.stop();
    }

    // Initial fetch
    this.checkOrders(fetchOrdersFn, onStatusChange);

    // Set up polling
    this.pollingInterval = setInterval(() => {
      this.checkOrders(fetchOrdersFn, onStatusChange);
    }, this.pollFrequency);
  }

  async checkOrders(fetchOrdersFn, onStatusChange) {
    try {
      const orders = await fetchOrdersFn();
      
      if (!Array.isArray(orders)) return;

      orders.forEach((order) => {
        const orderId = order.id || order.orderId;
        const currentStatus = order.status;
        const previousStatus = this.lastOrderStatuses.get(orderId);

        // Check if status changed
        if (previousStatus && previousStatus !== currentStatus) {
          // Status changed - trigger notification
          const restaurantName = order.restaurant?.name || "Restaurant";
          NotificationManager.notifyOrderStatus(orderId, currentStatus, restaurantName);
          
          // Call callback
          if (onStatusChange) {
            onStatusChange(order, previousStatus, currentStatus);
          }
        }

        // Update stored status
        this.lastOrderStatuses.set(orderId, currentStatus);
      });
    } catch (error) {
      console.error("Error polling orders:", error);
    }
  }

  stop() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  updateFrequency(milliseconds) {
    this.pollFrequency = milliseconds;
    // Restart if already running
    if (this.pollingInterval) {
      const wasRunning = true;
      this.stop();
      if (wasRunning) {
        // Will need to restart with same params - handled by caller
      }
    }
  }
}

// In-app notification toast
export const showToast = (message, type = "info") => {
  const toast = document.createElement("div");
  toast.className = `notification-toast notification-toast-${type}`;
  toast.textContent = message;
  
  const styles = {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    padding: "16px 24px",
    borderRadius: "12px",
    backgroundColor: type === "success" ? "#10b981" : type === "error" ? "#ef4444" : "#3b82f6",
    color: "white",
    fontWeight: "600",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    zIndex: "10000",
    animation: "slideIn 0.3s ease",
    maxWidth: "400px",
  };

  Object.assign(toast.style, styles);
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "slideOut 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};
