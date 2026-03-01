import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import './TestConnection.css';

export default function TestConnection() {
  const backendOrigin = new URL(API_ENDPOINTS.HEALTH).origin;

  const [status, setStatus] = useState({
    health: { loading: true, success: false, data: null, error: null },
    restaurants: { loading: true, success: false, data: null, error: null }
  });

  const testEndpoint = async (name, url) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      setStatus(prev => ({
        ...prev,
        [name]: {
          loading: false,
          success: response.ok,
          data,
          error: null
        }
      }));
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        [name]: {
          loading: false,
          success: false,
          data: null,
          error: error.message
        }
      }));
    }
  };

  useEffect(() => {
    testEndpoint('health', API_ENDPOINTS.HEALTH);
    testEndpoint('restaurants', API_ENDPOINTS.RESTAURANTS.GET_ALL);
  }, []);

  const retryTest = () => {
    setStatus({
      health: { loading: true, success: false, data: null, error: null },
      restaurants: { loading: true, success: false, data: null, error: null }
    });
    testEndpoint('health', API_ENDPOINTS.HEALTH);
    testEndpoint('restaurants', API_ENDPOINTS.RESTAURANTS.GET_ALL);
  };

  return (
    <div className="test-connection-page">
      <div className="test-container">
        <h1>Backend Connection Test</h1>
        <p className="test-subtitle">Check if your backend server is running and connected</p>

        <div className="test-cards">
          {/* Health Check */}
          <div className={`test-card ${status.health.success ? 'success' : status.health.error ? 'error' : 'loading'}`}>
            <div className="test-card-header">
              <h3>Health Check</h3>
              <span className={`status-badge ${status.health.loading ? 'loading' : status.health.success ? 'success' : 'error'}`}>
                {status.health.loading ? '⏳ Testing...' : status.health.success ? '✓ Connected' : '✗ Failed'}
              </span>
            </div>
            <div className="test-card-body">
              <p className="endpoint">GET /api/health</p>
              {status.health.success && status.health.data && (
                <div className="test-result">
                  <p><strong>Status:</strong> {status.health.data.status}</p>
                  <p><strong>Message:</strong> {status.health.data.message}</p>
                  <p><strong>Time:</strong> {new Date(status.health.data.timestamp).toLocaleString()}</p>
                </div>
              )}
              {status.health.error && (
                <div className="test-error">
                  <p><strong>Error:</strong> {status.health.error}</p>
                  <p className="error-hint">Make sure backend is running at {backendOrigin}</p>
                </div>
              )}
            </div>
          </div>

          {/* Restaurants API */}
          <div className={`test-card ${status.restaurants.success ? 'success' : status.restaurants.error ? 'error' : 'loading'}`}>
            <div className="test-card-header">
              <h3>Restaurants API</h3>
              <span className={`status-badge ${status.restaurants.loading ? 'loading' : status.restaurants.success ? 'success' : 'error'}`}>
                {status.restaurants.loading ? '⏳ Testing...' : status.restaurants.success ? '✓ Connected' : '✗ Failed'}
              </span>
            </div>
            <div className="test-card-body">
              <p className="endpoint">GET /api/restaurants</p>
              {status.restaurants.success && status.restaurants.data && (
                <div className="test-result">
                  <p><strong>Restaurants Found:</strong> {status.restaurants.data.length}</p>
                  <p><strong>Sample:</strong> {status.restaurants.data[0]?.name}</p>
                </div>
              )}
              {status.restaurants.error && (
                <div className="test-error">
                  <p><strong>Error:</strong> {status.restaurants.error}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="test-actions">
          <button onClick={retryTest} className="retry-btn">
            🔄 Retry Connection
          </button>
        </div>

        <div className="test-instructions">
          <h3>How to Start Backend:</h3>
          <div className="code-block">
            <code>cd backend</code>
            <code>npm run dev</code>
          </div>
          <p>Backend should be running on: <strong>{backendOrigin}</strong></p>
        </div>
      </div>
    </div>
  );
}
