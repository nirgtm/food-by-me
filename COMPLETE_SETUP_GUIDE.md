# Complete Backend & Database Setup Guide

## Current Status

Your backend is **already configured** with:
- ✅ Supabase (Cloud PostgreSQL Database)
- ✅ User Authentication (JWT)
- ✅ Order Management
- ✅ Restaurant Data
- ✅ OTP Verification System

## Quick Start (Easiest Way)

### 1. Check if Supabase is configured:
```bash
cd backend
cat .env
```

Look for:
```
SUPABASE_URL=https://...
SUPABASE_SERVICE_ROLE_KEY=...
```

### 2. Start the backend:
```bash
npm run dev
```

You should see:
```
Server running on http://localhost:5001
```

### 3. Start the frontend (new terminal):
```bash
npm run dev
```

### 4. Test the connection:
Visit: **http://localhost:5173/test-connection**

---

## Understanding Your Database

### What is Supabase?
- Cloud-based PostgreSQL database
- Like Firebase but open-source
- Free tier: 500MB database, 2GB bandwidth
- Already set up in your project!

### Your Database Tables:

1. **users** - Stores user accounts
   - full_name, email, phone, password_hash
   
2. **orders** - Stores all orders
   - order_id, user_email, items, restaurant, total, status
   
3. **restaurants** - Stores restaurant data
   - id, name, cuisines, rating, image, etc.

---

## How to Access Your Database

### Method 1: Supabase Dashboard (Recommended)

1. Go to: https://supabase.com
2. Login with your account
3. Select your project
4. Click "Table Editor" to view data
5. You can see all users, orders, and restaurants

### Method 2: Through Your App

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `npm run dev`
3. Sign up a new user
4. Place an order
5. Check Supabase dashboard - data will appear!

### Method 3: API Endpoints

```bash
# Get all restaurants
curl http://localhost:5001/api/restaurants

# Health check
curl http://localhost:5001/api/health
```

---

## Frontend is Already Connected!

Your frontend (`src/config/api.js`) is already configured to talk to the backend:

```javascript
// Frontend automatically connects to:
http://localhost:5001/api/auth/signup
http://localhost:5001/api/auth/login
http://localhost:5001/api/restaurants
http://localhost:5001/api/orders/place-order
```

---

## Testing the Full Stack

### Test 1: User Signup
1. Start both servers
2. Go to: http://localhost:5173/signup
3. Fill in the form
4. Submit
5. Check Supabase dashboard → users table

### Test 2: Place Order
1. Login to your app
2. Browse restaurants
3. Add item to cart
4. Go to checkout
5. Place order
6. Check Supabase dashboard → orders table

### Test 3: View Orders
1. Login
2. Your orders will be fetched from database
3. Check browser console for API calls

---

## Troubleshooting

### Issue 1: "Missing Supabase configuration"

**Solution:**
```bash
cd backend
cat .env
```

Make sure you have:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-key-here
```

If missing, get them from:
1. Go to supabase.com
2. Your project → Settings → API
3. Copy URL and service_role key

### Issue 2: Port 5001 already in use

**Solution:**
```bash
# Mac/Linux
lsof -ti:5001 | xargs kill -9

# Windows
netstat -ano | findstr :5001
taskkill /PID <PID> /F
```

### Issue 3: Frontend can't connect to backend

**Check:**
1. Backend is running on port 5001
2. Frontend is running on port 5173
3. Check `src/config/api.js` has correct URL
4. Check browser console for errors

### Issue 4: Database not saving data

**Check:**
1. Supabase project is active
2. Tables exist (users, orders, restaurants)
3. Check backend console for errors
4. Verify .env has correct credentials

---

## Architecture Overview

```
Frontend (React)
    ↓
http://localhost:5173
    ↓
API Calls (fetch)
    ↓
Backend (Express)
    ↓
http://localhost:5001
    ↓
Supabase Client
    ↓
Supabase Database (Cloud)
```

---

## What Happens When You:

### Sign Up:
1. Frontend sends: email, password, phone → `/api/auth/signup`
2. Backend hashes password with bcrypt
3. Backend saves to Supabase `users` table
4. Returns success message

### Login:
1. Frontend sends: email, password → `/api/auth/login`
2. Backend checks Supabase `users` table
3. Verifies password with bcrypt
4. Creates JWT token
5. Returns token to frontend
6. Frontend stores token in localStorage

### Place Order:
1. Frontend sends: order details + JWT token → `/api/orders/place-order`
2. Backend verifies JWT token
3. Backend saves to Supabase `orders` table
4. Returns order ID

### View Restaurants:
1. Frontend requests → `/api/restaurants`
2. Backend fetches from Supabase `restaurants` table
3. Returns restaurant list
4. Frontend displays them

---

## Quick Commands

```bash
# Start backend
cd backend && npm run dev

# Start frontend (new terminal)
npm run dev

# Check backend is running
curl http://localhost:5001/api/health

# Check restaurants
curl http://localhost:5001/api/restaurants

# Kill port 5001
lsof -ti:5001 | xargs kill -9

# View backend logs
cd backend && npm run dev

# Install dependencies
cd backend && npm install
```

---

## Summary

✅ Your backend is **already set up** with Supabase
✅ Your frontend is **already connected** to backend
✅ Database tables are **already created**
✅ Authentication is **already working**

**Just start both servers and test!**

```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2  
npm run dev

# Browser
http://localhost:5173
```

Your full-stack app with database is ready to use! 🚀
