# Verify Deployment - Order Fix

## 🚀 Your Deployment URLs

Based on your configuration:
- **Frontend**: Your Vercel frontend URL (e.g., https://foodbyme.vercel.app)
- **Backend**: https://foodbymebackend.vercel.app

## ✅ Step-by-Step Verification

### Step 1: Check Backend is Running

Open this URL in your browser:
```
https://foodbymebackend.vercel.app/api/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "FoodByMe API is running"
}
```

If you see this, your backend is deployed correctly! ✅

---

### Step 2: Check Frontend is Deployed

1. Open your frontend URL (e.g., https://foodbyme.vercel.app)
2. You should see the home page with restaurants
3. Check browser console (F12) for any errors

**Expected**: No errors, page loads normally ✅

---

### Step 3: Test Order Flow (Not Logged In)

1. **Browse** restaurants on your deployed site
2. **Add** items to cart (click any restaurant → add items)
3. **Go to** cart (click cart icon or go to /cart)
4. **Fill** delivery details:
   - Full name
   - Phone number
   - Address
5. **Click** the "Login to Pay ₹XXX" button

**Expected Result:**
- You see: "Please login to place an order" notification
- You're redirected to /login page ✅

---

### Step 4: Test Order Flow (Logged In)

1. **Sign up** or **login** at your-site.vercel.app/login
2. **Add** items to cart
3. **Go to** /cart
4. **Fill** delivery details
5. **Select** payment method
6. **Click** "Pay ₹XXX" button

**Expected Result:**
- Order is placed successfully
- You see: "Order ORD123456789 placed successfully"
- Order appears in /orders page ✅

---

### Step 5: Test Token Expiration

This will happen automatically if you:
1. Login
2. Wait 24 hours (token expires)
3. Try to place order

**Expected Result:**
- You see: "Session expired. Please login again."
- Redirected to login page
- After login, can complete order ✅

---

## 🔍 Quick Verification Tests

### Test 1: Add to Cart from Home Page
```
1. Go to: https://your-site.vercel.app
2. Click any restaurant
3. Click "Add to cart" on any item
4. Check cart icon - should show item count
✅ Pass if item count increases
```

### Test 2: Add to Cart from Restaurant Page
```
1. Go to any restaurant page
2. Click "Add to cart" on menu items
3. Check cart icon
✅ Pass if items are added
```

### Test 3: Checkout Without Login
```
1. Add items to cart
2. Go to /cart
3. Try to pay
✅ Pass if redirected to login
```

### Test 4: Checkout With Login
```
1. Login first
2. Add items to cart
3. Go to /cart
4. Fill details and pay
✅ Pass if order is placed
```

### Test 5: View Orders
```
1. Login
2. Go to /orders
3. Should see your order history
✅ Pass if orders are displayed
```

---

## 🐛 Common Deployment Issues

### Issue 1: "Failed to fetch" errors

**Cause**: Backend not deployed or CORS issue

**Check**:
```bash
# Test backend health
curl https://foodbymebackend.vercel.app/api/health
```

**Solution**:
- Verify backend is deployed on Vercel
- Check backend environment variables are set
- Check CORS settings in backend/server.js

---

### Issue 2: "Invalid token" on deployed site

**Cause**: JWT_SECRET mismatch between local and production

**Solution**:
1. Go to Vercel dashboard → Your backend project
2. Settings → Environment Variables
3. Verify JWT_SECRET is set correctly
4. Redeploy backend if needed

---

### Issue 3: Orders not saving

**Cause**: Database connection issue

**Solution**:
1. Check Supabase credentials in Vercel environment variables:
   - SUPABASE_URL
   - SUPABASE_KEY
2. Verify database tables exist
3. Check backend logs in Vercel

---

### Issue 4: Login not working

**Cause**: Environment variables not set

**Solution**:
1. Verify in Vercel backend settings:
   - JWT_SECRET
   - SUPABASE_URL
   - SUPABASE_KEY
2. Redeploy after setting variables

---

## 📊 Verify in Supabase Dashboard

After placing a test order:

1. Go to https://supabase.com/dashboard
2. Open your project
3. Go to Table Editor → orders
4. You should see your test order ✅

**Check these fields:**
- order_id (e.g., ORD1234567890)
- user_email (your email)
- total (order amount)
- status (should be "confirmed")
- created_at (timestamp)

---

## 🎯 Success Criteria

Your deployment is successful if:

✅ Backend health check returns OK
✅ Frontend loads without errors
✅ Can browse restaurants
✅ Can add items to cart
✅ Cart persists across pages
✅ Login/signup works
✅ Can place orders when logged in
✅ Gets proper error when not logged in
✅ Orders appear in /orders page
✅ Orders saved in Supabase database

---

## 🔧 Debugging Tools

### Check Backend Logs (Vercel)
1. Go to Vercel dashboard
2. Select your backend project
3. Click "Deployments"
4. Click latest deployment
5. Click "Functions" tab
6. View logs for errors

### Check Frontend Logs (Browser)
1. Open your deployed site
2. Press F12 (Developer Tools)
3. Go to Console tab
4. Look for errors (red text)

### Check Network Requests
1. Open Developer Tools (F12)
2. Go to Network tab
3. Try to place an order
4. Check the request to /api/orders/place-order
5. Look at Response tab for error details

---

## 📱 Test on Different Devices

After verifying on desktop, test on:
- [ ] Mobile phone (Chrome/Safari)
- [ ] Tablet
- [ ] Different browsers (Chrome, Firefox, Safari)

---

## 🎉 Final Verification

Run through this complete flow:

1. **Open** your deployed site
2. **Browse** restaurants
3. **Add** 2-3 items to cart
4. **Go to** /cart
5. **Try to pay** (should ask for login)
6. **Login** or **signup**
7. **Return to** /cart
8. **Fill** delivery details
9. **Select** payment method (COD is easiest)
10. **Click** "Pay ₹XXX"
11. **Verify** success message
12. **Go to** /orders
13. **See** your order listed
14. **Check** Supabase dashboard for order

**If all steps work → Deployment is successful!** 🎉

---

## 📞 Need Help?

If something doesn't work:

1. Check browser console for errors
2. Check Vercel function logs
3. Verify environment variables
4. Test backend health endpoint
5. Check Supabase connection

---

## 🔄 Redeployment

If you need to redeploy:

```bash
# Push changes
git add .
git commit -m "Fix order placement"
git push

# Vercel will auto-deploy
# Or manually trigger in Vercel dashboard
```

---

**Your deployment should be working now!** ✅

Test it and let me know if you encounter any issues.
