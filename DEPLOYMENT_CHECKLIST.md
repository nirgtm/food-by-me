# Deployment Checklist ✅

## Before Testing Deployed Site

### 1. Verify Backend is Deployed
- [ ] Go to: https://foodbymebackend.vercel.app/api/health
- [ ] Should see: `{"status":"ok",...}`
- [ ] If not working, check Vercel backend deployment

### 2. Verify Frontend is Deployed
- [ ] Go to your frontend URL (e.g., https://foodbyme.vercel.app)
- [ ] Home page loads correctly
- [ ] No errors in browser console (F12)

### 3. Check Environment Variables (Vercel Dashboard)

**Backend Environment Variables:**
- [ ] SUPABASE_URL is set
- [ ] SUPABASE_KEY is set
- [ ] JWT_SECRET is set
- [ ] NODE_ENV is set to "production"

**Frontend Environment Variables:**
- [ ] VITE_API_URL is set (or using default)

---

## Testing Order Flow

### Test 1: Guest User (Not Logged In)
- [ ] Open your deployed site
- [ ] Browse restaurants
- [ ] Add items to cart
- [ ] Go to /cart
- [ ] Click "Login to Pay ₹XXX"
- [ ] Should redirect to /login ✅

### Test 2: Logged In User
- [ ] Login or signup
- [ ] Add items to cart
- [ ] Go to /cart
- [ ] Fill delivery details:
  - [ ] Full name
  - [ ] Phone (10 digits)
  - [ ] Address
- [ ] Select payment method
- [ ] Click "Pay ₹XXX"
- [ ] Should see success message ✅
- [ ] Order should appear in /orders ✅

### Test 3: Add Items from Different Pages
- [ ] Add from home page ✅
- [ ] Add from restaurant details page ✅
- [ ] Add from category page ✅
- [ ] All items appear in cart ✅

### Test 4: Order History
- [ ] Login
- [ ] Go to /orders
- [ ] Should see your orders ✅
- [ ] Can click "Reorder" ✅

---

## Verify in Database

- [ ] Go to Supabase dashboard
- [ ] Open Table Editor → orders
- [ ] Your test order is there ✅
- [ ] Check order details are correct ✅

---

## Quick Test Commands

### Test Backend Health
```bash
curl https://foodbymebackend.vercel.app/api/health
```

### Test Frontend
```
Open: https://your-frontend-url.vercel.app
```

---

## If Something Doesn't Work

### Backend Issues
1. Check Vercel backend logs
2. Verify environment variables
3. Test health endpoint
4. Redeploy if needed

### Frontend Issues
1. Check browser console (F12)
2. Check Network tab for failed requests
3. Verify API_BASE_URL is correct
4. Clear browser cache

### Database Issues
1. Check Supabase dashboard
2. Verify tables exist
3. Check connection credentials
4. Test with SQL query

---

## Success Indicators

✅ Backend health check passes
✅ Frontend loads without errors
✅ Can add items to cart
✅ Login/signup works
✅ Can place orders
✅ Orders appear in /orders
✅ Orders saved in database
✅ Token validation works
✅ Error messages are clear

---

## Final Test

**Complete Order Flow:**
1. Open deployed site
2. Browse → Add to cart → Checkout
3. Login → Fill details → Pay
4. Success message → Order in history
5. Order in Supabase database

**If all steps work → You're good to go!** 🎉

---

## Your Deployed URLs

**Frontend**: https://your-frontend.vercel.app
**Backend**: https://foodbymebackend.vercel.app
**Database**: Supabase (check dashboard)

---

**Ready to test!** 🚀

Just open your deployed frontend URL and follow the test steps above.
