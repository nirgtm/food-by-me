import React, { useEffect, useState } from "react";
import "./LiveTrackingMap.css";

// Demo delivery person locations (simulated movement)
const DEMO_ROUTE = [
  { lat: 28.6139, lng: 77.2090, label: "Restaurant" },
  { lat: 28.6149, lng: 77.2100, label: "Moving..." },
  { lat: 28.6159, lng: 77.2110, label: "Moving..." },
  { lat: 28.6169, lng: 77.2120, label: "Moving..." },
  { lat: 28.6179, lng: 77.2130, label: "Almost there..." },
  { lat: 28.6189, lng: 77.2140, label: "Your Location" },
];

export default function LiveTrackingMap({ orderId, restaurantName }) {
  const [currentPosition, setCurrentPosition] = useState(0);
  const [eta, setEta] = useState(15);

  useEffect(() => {
    // Simulate delivery person movement
    const interval = setInterval(() => {
      setCurrentPosition((prev) => {
        if (prev >= DEMO_ROUTE.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });

      setEta((prev) => Math.max(0, prev - 3));
    }, 3000); // Move every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const progress = ((currentPosition + 1) / DEMO_ROUTE.length) * 100;
  const currentLocation = DEMO_ROUTE[currentPosition];

  return (
    <div className="live-tracking-map">
      <div className="tracking-map-header">
        <h3>Live Tracking</h3>
        <div className="tracking-eta">
          <span className="eta-icon">⏱️</span>
          <span className="eta-time">{eta} min</span>
        </div>
      </div>

      <div className="tracking-map-container">
        {/* Demo map visualization */}
        <div className="demo-map">
          <div className="map-route">
            {DEMO_ROUTE.map((point, index) => (
              <div
                key={index}
                className={`map-point ${index === 0 ? "restaurant" : ""} ${
                  index === DEMO_ROUTE.length - 1 ? "destination" : ""
                } ${index === currentPosition ? "active" : ""} ${
                  index < currentPosition ? "passed" : ""
                }`}
              >
                {index === 0 && "🏪"}
                {index === currentPosition && index !== 0 && index !== DEMO_ROUTE.length - 1 && "🚴"}
                {index === DEMO_ROUTE.length - 1 && "📍"}
              </div>
            ))}
          </div>
          <div className="map-progress-bar">
            <div className="map-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="tracking-status">
          <p className="status-text">{currentLocation.label}</p>
          <p className="status-detail">
            {currentPosition === 0 && "Picked up from restaurant"}
            {currentPosition > 0 && currentPosition < DEMO_ROUTE.length - 1 && "On the way to you"}
            {currentPosition === DEMO_ROUTE.length - 1 && "Arrived at your location!"}
          </p>
        </div>
      </div>

      <div className="tracking-info">
        <div className="info-row">
          <span className="info-label">Order ID:</span>
          <span className="info-value">{orderId}</span>
        </div>
        <div className="info-row">
          <span className="info-label">From:</span>
          <span className="info-value">{restaurantName}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Delivery Partner:</span>
          <span className="info-value">Demo Driver (Demo Mode)</span>
        </div>
      </div>

      <div className="tracking-demo-badge">
        <strong>Demo Mode:</strong> This shows simulated real-time tracking.
        In production, this would display actual GPS location of your delivery partner.
      </div>
    </div>
  );
}
