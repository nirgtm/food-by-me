# Create Test Order for Tracking Demo

## Option 1: Place a New Order (Recommended)

1. **Go to Home Page**: Click "Restaurant" in the navigation
2. **Browse Restaurants**: Click on any restaurant
3. **Add Items to Cart**: Click "Add to Cart" on any food item
4. **Go to Checkout**: Click the cart icon or "Cart" in navigation
5. **Fill Details**: 
   - Enter your delivery address
   - Enter phone number
   - Select payment method
6. **Place Order**: Click "Pay" button
7. **Go to Orders**: Click "Orders" in navigation

## Option 2: Update Existing Order Status (If you have orders)

If you already have orders in the database, you can update one to "on_the_way" status:

### Using Supabase Dashboard:
1. Go to your Supabase project dashboard
2. Click "Table Editor" in the left sidebar
3. Select "orders" table
4. Find an order you want to track
5. Click on the "status" field
6. Change it to: `on_the_way`
7. Save the changes

### Using SQL Query:
Run this in Supabase SQL Editor:

```sql
-- Update the most recent order to "on_the_way" status
UPDATE orders 
SET status = 'on_the_way'
WHERE id = (
  SELECT id 
  FROM orders 
  ORDER BY created_at DESC 
  LIMIT 1
);
```

Or update a specific order:

```sql
-- Replace 'YOUR_ORDER_ID' with actual order ID
UPDATE orders 
SET status = 'on_the_way'
WHERE order_id = 'YOUR_ORDER_ID';
```

## Option 3: Create Test Order via SQL

If you want to create a test order directly in the database:

```sql
INSERT INTO orders (
  order_id,
  user_email,
  full_name,
  phone,
  address,
  address_label,
  items,
  restaurant,
  payment_method,
  subtotal,
  total,
  delivery_fee,
  platform_fee,
  taxes_and_charges,
  status
) VALUES (
  'ORD' || FLOOR(RANDOM() * 1000000)::TEXT,
  'your-email@example.com',  -- Replace with your email
  'Test User',
  '9876543210',
  '123 Test Street, Test City',
  'Home',
  '[{"name": "Chicken Biryani", "price": 299, "quantity": 1, "image": "/images/my-biryani-1.jpg"}]'::jsonb,
  '{"id": "test-restaurant", "name": "Test Restaurant"}'::jsonb,
  'cod',
  299,
  344,
  39,
  6,
  15,
  'on_the_way'  -- This is the key status for tracking
);
```

## After Creating/Updating Order

1. **Refresh Orders Page**: Click the "Refresh" button
2. **Click "Track Order" Filter**: The orange button in the filter row
3. **See Your Order**: It should now appear
4. **Click "Track" Button**: Blue button on the order card
5. **View Tracking Modal**: See the demo tracking timeline!

## Troubleshooting

### "No orders match your current filters"
- Make sure you clicked "Track Order" filter (not "All" or other filters)
- Verify the order status is exactly `on_the_way` in database
- Click "Refresh" button to reload orders

### Order not showing at all
- Make sure you're logged in with the same email as the order
- Check if the order exists in Supabase orders table
- Verify `user_email` in order matches your logged-in email

### Track button not appearing
- Order status must be exactly `on_the_way`
- Check browser console for any errors
- Make sure latest code is deployed

## Quick Test Flow

1. Login to your app
2. Add any item to cart
3. Go to checkout and place order
4. Go to Supabase dashboard
5. Update that order's status to `on_the_way`
6. Refresh orders page
7. Click "Track Order" filter
8. Click "Track" button
9. Enjoy the demo tracking modal! 🎉
