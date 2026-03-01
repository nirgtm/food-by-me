# How to Test Order Placement

## Quick Test Guide

### Test 1: Order Without Login ✅

1. **Clear your browser data** (or use incognito mode)
2. Go to http://localhost:5173
3. Browse restaurants and add items to cart
4. Go to checkout (/cart)
5. Fill in delivery details
6. Click the "Login to Pay ₹XXX" button

**Expected Result**:
- You see message: "Please login to place an order"
- You're redirected to /login page
- After login, you can go back to /cart and complete the order

---

### Test 2: Order With Valid Login ✅

1. **Login first** at http://localhost:5173/login
2. Browse restaurants and add items to cart
3. Go to checkout (/cart)
4. Fill in delivery details:
   - Full name
   - Phone number (10 digits)
   - Delivery address
5. Select payment method (UPI/Card/COD)
6. Click "Pay ₹XXX" button

**Expected Result**:
- Order is placed successfully
- You see: "Order ORD123456789 placed successfully"
- Order appears in "My Orders" (/orders)
- Cart is cleared

---

### Test 3: Order With Expired Token ✅

1. **Login** at http://localhost:5173/login
2. **Wait for token to expire** (or manually edit token in localStorage to make it invalid)
3. Add items to cart
4. Go to checkout (/cart)
5. Fill in delivery details
6. Click "Pay ₹XXX" button

**Expected Result**:
- You see error: "Session expired. Please login again."
- Token is removed from localStorage
- After 2 seconds, you're redirected to /login
- After login, you can complete the order

---

### Test 4: Add Items from Different Pages ✅

#### From Home Page:
1. Go to http://localhost:5173
2. Click on any restaurant card
3. Click "Add to cart" on any item
4. Item added to cart ✅

#### From Restaurant Details Page:
1. Go to any restaurant page
2. Click "Add to cart" on menu items
3. Items added to cart ✅

#### From Premium Food Page:
1. Go to /premium-food or similar
2. Click "Add to cart" on items
3. Items added to cart ✅

---

### Test 5: Multiple Items from Different Restaurants ✅

1. Add item from Restaurant A
2. Add item from Restaurant B
3. Go to checkout
4. Both items should be in cart
5. Can place order with all items ✅

---

## Manual Testing Steps

### Step 1: Start Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

### Step 2: Create Test User

```bash
# Go to http://localhost:5173/signup
# Create account with:
Email: test@example.com
Password: Test@123
Phone: 9876543210
```

### Step 3: Test Order Flow

1. **Login** with test account
2. **Browse** restaurants
3. **Add** 2-3 items to cart
4. **Go to** /cart
5. **Fill** delivery details:
   ```
   Name: Test User
   Phone: 9876543210
   Address: 123 Test Street, Test City
   ```
6. **Select** payment method: COD
7. **Click** "Pay ₹XXX"
8. **Verify** order success message
9. **Check** /orders page for order

### Step 4: Test Error Scenarios

#### Test Invalid Token:
```javascript
// In browser console:
localStorage.setItem('token', 'invalid_token_here');
// Then try to place order
// Should show "Session expired" and redirect to login
```

#### Test No Token:
```javascript
// In browser console:
localStorage.removeItem('token');
// Then try to place order
// Should show "Please login" and redirect to login
```

---

## Automated Test Cases (For Future)

```javascript
describe('Order Placement', () => {
  test('should redirect to login when not authenticated', async () => {
    // Clear token
    // Add items to cart
    // Go to checkout
    // Click pay button
    // Expect redirect to /login
  });

  test('should place order when authenticated', async () => {
    // Login
    // Add items to cart
    // Fill delivery details
    // Click pay button
    // Expect success message
    // Expect order in /orders
  });

  test('should handle expired token', async () => {
    // Set expired token
    // Try to place order
    // Expect "Session expired" message
    // Expect redirect to /login
  });
});
```

---

## Common Issues & Solutions

### Issue: "Invalid token" error

**Solution**: 
- Clear browser cache and localStorage
- Login again
- Try placing order

### Issue: Order button disabled

**Solution**:
- Make sure you're logged in
- Check if cart has items
- Fill all required delivery details

### Issue: Order not appearing in /orders

**Solution**:
- Refresh the page
- Check if you're logged in with the same account
- Check backend logs for errors

### Issue: Can't add items to cart

**Solution**:
- Check browser console for errors
- Make sure restaurant data is loaded
- Try refreshing the page

---

## Backend Verification

### Check if order was created:

```sql
-- In Supabase SQL Editor:
SELECT * FROM orders ORDER BY created_at DESC LIMIT 5;
```

### Check user's orders:

```sql
-- Replace with your test email:
SELECT * FROM orders WHERE user_email = 'test@example.com';
```

### Check order details:

```sql
SELECT 
  order_id,
  full_name,
  phone,
  total,
  status,
  created_at
FROM orders
ORDER BY created_at DESC
LIMIT 10;
```

---

## Success Criteria

✅ Can add items from any page
✅ Can place order when logged in
✅ Gets clear error when not logged in
✅ Handles expired token gracefully
✅ Order appears in /orders page
✅ Order saved in database
✅ Cart clears after successful order
✅ User gets confirmation message

---

## Quick Debug Commands

```javascript
// Check if logged in
console.log('Token:', localStorage.getItem('token'));

// Check cart items
console.log('Cart:', localStorage.getItem('foodbyme_cart_v1'));

// Check recent orders
console.log('Orders:', localStorage.getItem('foodbyme_recent_orders_v1'));

// Clear everything
localStorage.clear();
```

---

**All tests should pass!** ✅

If you encounter any issues, check:
1. Backend is running (http://localhost:5000/api/health)
2. Frontend is running (http://localhost:5173)
3. Database is connected (check Supabase dashboard)
4. Browser console for errors
