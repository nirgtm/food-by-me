# Automatic Order Status Progression

## Overview
Orders now automatically progress through different stages to simulate a real restaurant and delivery experience.

## Order Stages & Timing

### Timeline (Total: ~19 minutes)

1. **Confirmed** (0 mins)
   - Order is placed and confirmed
   - Restaurant receives the order
   - Duration: 2 minutes

2. **Preparing** (2 mins)
   - Restaurant is cooking your food
   - Kitchen is working on your order
   - Duration: 5 minutes

3. **Track Order / On the Way** (7 mins)
   - Food is ready and out for delivery
   - Delivery partner is on the way
   - **Track button appears** - Click to see live tracking demo
   - Duration: 12 minutes

4. **Delivered** (19 mins)
   - Order has been delivered
   - Enjoy your meal!
   - Final status

## How It Works

### Automatic Updates
- Backend checks order statuses **every 1 minute**
- Automatically progresses orders based on time elapsed
- No manual intervention needed

### Status Progression Logic
```
Order Created
    ↓ (2 minutes)
Confirmed → Preparing
    ↓ (5 minutes)
Preparing → On the Way (Track Order)
    ↓ (12 minutes)
On the Way → Delivered
```

## Testing the Feature

### 1. Place an Order
1. Go to Restaurant page
2. Add items to cart
3. Complete checkout
4. Order starts as "Confirmed"

### 2. Watch It Progress
- **After 2 minutes**: Order moves to "Preparing"
- **After 7 minutes total**: Order moves to "Track Order" (on_the_way)
  - Blue "Track" button appears
  - Click to see tracking modal
- **After 19 minutes total**: Order moves to "Delivered"

### 3. View in Different Filters
- Click "Confirmed" to see new orders
- Click "Preparing" to see orders being cooked
- Click "Track Order" to see orders in transit (with Track button)
- Click "Delivered" to see completed orders

## API Endpoints

### Manual Status Update
```bash
POST /api/order-simulator/update-statuses
```
Manually trigger status check and update for all orders.

### Get Progression Info
```bash
GET /api/order-simulator/progression-info
```
Returns timing information and stage descriptions.

### Start Auto Updater
```bash
POST /api/order-simulator/auto-updater/start
```
Start the automatic status updater (runs by default).

### Stop Auto Updater
```bash
POST /api/order-simulator/auto-updater/stop
```
Stop the automatic status updater.

## Files Added/Modified

### New Files:
- `backend/routes/order-simulator.js` - Auto status updater logic

### Modified Files:
- `backend/server.js` - Added order simulator route and auto-start

## Configuration

### Customize Timings
Edit `backend/routes/order-simulator.js`:

```javascript
const ORDER_TIMINGS = {
  confirmed_to_preparing: 2 * 60 * 1000,      // 2 minutes
  preparing_to_on_the_way: 5 * 60 * 1000,    // 5 minutes
  on_the_way_to_delivered: 12 * 60 * 1000,   // 12 minutes
};
```

Change the numbers to adjust timing:
- `2 * 60 * 1000` = 2 minutes (in milliseconds)
- `5 * 60 * 1000` = 5 minutes
- `12 * 60 * 1000` = 12 minutes

### Example: Faster Testing
For faster testing, use shorter times:

```javascript
const ORDER_TIMINGS = {
  confirmed_to_preparing: 30 * 1000,      // 30 seconds
  preparing_to_on_the_way: 60 * 1000,    // 1 minute
  on_the_way_to_delivered: 2 * 60 * 1000, // 2 minutes
};
```

## How to Deploy

### Local Development
```bash
cd backend
npm install
npm start
```

The auto-updater starts automatically when the server starts.

### Production (Vercel)
1. Commit and push changes:
```bash
git add .
git commit -m "feat: Add automatic order status progression"
git push
```

2. Vercel will automatically deploy
3. Auto-updater runs on the serverless backend

## Monitoring

### Server Logs
Watch the console for status updates:
```
✓ Order ORD1234567: confirmed → preparing
✓ Order ORD1234567: preparing → on_the_way
✓ Order ORD1234567: on_the_way → delivered
```

### Check Status Manually
```bash
# Get progression info
curl https://your-backend.vercel.app/api/order-simulator/progression-info

# Trigger manual update
curl -X POST https://your-backend.vercel.app/api/order-simulator/update-statuses
```

## Features

### ✅ Automatic
- No manual status changes needed
- Runs in background
- Updates every minute

### ✅ Realistic
- Mimics real restaurant workflow
- Proper timing between stages
- Natural progression

### ✅ Track Order Integration
- "Track" button appears when order is "on_the_way"
- Shows live tracking demo modal
- Visual timeline with progress

### ✅ Flexible
- Easy to customize timings
- Can be started/stopped via API
- Manual trigger available

## Troubleshooting

### Orders not progressing
1. Check if backend server is running
2. Look for errors in server console
3. Verify Supabase connection
4. Try manual trigger: `POST /api/order-simulator/update-statuses`

### Timing seems off
1. Check server timezone
2. Verify `created_at` timestamp in database
3. Adjust timings in `order-simulator.js`

### Auto-updater not starting
1. Check server logs for errors
2. Verify `order-simulator.js` is loaded
3. Manually start: `POST /api/order-simulator/auto-updater/start`

## Demo Flow

1. **Place Order** → Status: Confirmed
2. **Wait 2 mins** → Status: Preparing
3. **Wait 5 more mins** → Status: Track Order (on_the_way)
   - Click "Track Order" filter
   - See your order with blue "Track" button
   - Click "Track" to see demo modal
4. **Wait 12 more mins** → Status: Delivered
   - Order complete!

Total time: ~19 minutes from order to delivery

## Production Notes

- Auto-updater runs continuously in background
- Checks all active orders every minute
- Only updates orders that need status change
- Adds `delivered_at` timestamp when delivered
- Skips cancelled orders
- Efficient database queries

Enjoy your automated order tracking system! 🎉
