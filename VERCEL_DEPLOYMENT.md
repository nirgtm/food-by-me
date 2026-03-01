# Vercel Deployment Guide

## 🚀 Quick Deployment Steps

### Step 1: Deploy Backend (5 minutes)

1. **Go to Vercel:** https://vercel.com/new
2. **Import your repository:** `Dharmendra0202/food_by_me`
3. **Configure:**
   - Project Name: `foodbyme-backend`
   - Framework: `Other`
   - Root Directory: Click "Edit" → Select `backend`
   - Build Command: (leave empty)
   - Output Directory: (leave empty)

4. **Add Environment Variables:**
   ```
   PORT=5001
   JWT_SECRET=foodbyme_secret_key_2026
   NODE_ENV=production
   DEFAULT_COUNTRY_CODE=+91
   ALLOW_DEV_OTP_FALLBACK=false
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

5. **Click Deploy**
6. **Save your backend URL:** `https://foodbyme-backend.vercel.app`

---

### Step 2: Deploy Frontend (3 minutes)

1. **Go to Vercel:** https://vercel.com/new
2. **Import same repository:** `Dharmendra0202/food_by_me`
3. **Configure:**
   - Project Name: `foodbyme`
   - Framework: `Vite`
   - Root Directory: `./` (keep as root)
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Add Environment Variable:**
   ```
   VITE_API_URL=https://foodbyme-backend.vercel.app
   ```
   (Use YOUR backend URL from Step 1)

5. **Click Deploy**

---

## ✅ Verification

After deployment:

1. **Test Backend:**
   - Visit: `https://your-backend.vercel.app/api/health`
   - Should show: `{"status": "success"}`

2. **Test Frontend:**
   - Visit: `https://your-frontend.vercel.app`
   - Try signup/login
   - Browse restaurants

---

## 🔧 If Something Goes Wrong

### Backend Issues:
- Check environment variables are set
- Verify Supabase credentials
- Check deployment logs

### Frontend Issues:
- Verify VITE_API_URL is correct
- Check browser console for errors
- Ensure backend is deployed first

---

## 📝 Environment Variables Reference

### Backend (.env):
```
PORT=5001
JWT_SECRET=foodbyme_secret_key_2026
NODE_ENV=production
DEFAULT_COUNTRY_CODE=+91
ALLOW_DEV_OTP_FALLBACK=false
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Frontend (.env):
```
VITE_API_URL=https://your-backend.vercel.app
```

---

## 🎉 Done!

Your app is now live on Vercel!
