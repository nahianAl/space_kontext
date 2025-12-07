# Vercel Deployment Steps for Space Kontext

## Quick Deployment Guide

### Step 1: Create Project in Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click **Add New...** → **Project**
3. Click **Import Git Repository**
4. Select `nahianAl/space_kontext` from the list
5. Click **Import**
6. Framework: **Next.js** (should auto-detect)
7. **Root Directory**: Leave as default (`.`)
8. **Build Command**: `npm run build` (default)
9. **Output Directory**: `.next` (default)
10. **Install Command**: `npm install` (default)
11. **Don't deploy yet** - we need to add environment variables first

### Step 2: Add Environment Variables

Before deploying, click **Environment Variables** and add all of these:

#### Database
```
DATABASE_URL
postgresql://space_kontext_user:ca6F69Q30QKxGhXNoCTkK5d2u7dZiZoT@dpg-d4puvm2dbo4c73biakg0-a.virginia-postgres.render.com/space_kontext
```
- Target: Production, Preview, Development

#### Clerk Authentication
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
pk_test_aGFwcHktZ25hdC00OC5jbGVyay5hY2NvdW50cy5kZXYk
```
- Target: Production, Preview, Development

```
CLERK_SECRET_KEY
sk_test_XbNvdXKKM4qW8odMicifLElFVe66QWNSl3qm3b3fqy
```
- Target: Production, Preview, Development

```
NEXT_PUBLIC_CLERK_SIGN_IN_URL
/sign-in
```
- Target: Production, Preview, Development

```
NEXT_PUBLIC_CLERK_SIGN_UP_URL
/sign-up
```
- Target: Production, Preview, Development

```
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
/dashboard
```
- Target: Production, Preview, Development

```
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL
/dashboard
```
- Target: Production, Preview, Development

#### Cloudflare R2
```
R2_ACCOUNT_ID
d0d867b2aebf3038decc1929395ff0b8
```
- Target: Production, Preview, Development

```
R2_ACCESS_KEY_ID
f40c986118fbed7aa386285ee9bb9a5f
```
- Target: Production, Preview, Development

```
R2_SECRET_ACCESS_KEY
7018ffd8d0fa2c06e4cc08696f25ec7924e1ea49f3d50e44d2b8ecfb9a2c0c0c
```
- Target: Production, Preview, Development

```
R2_BUCKET_NAME
space-kontext-prod
```
- Target: Production, Preview, Development

```
R2_PUBLIC_URL
https://pub-c91e91785d21410d9142a9d6069b7c7f.r2.dev
```
- Target: Production, Preview, Development

#### Other
```
NODE_ENV
production
```
- Target: Production only

### Step 3: Deploy

1. After adding all environment variables, click **Deploy**
2. Wait 3-5 minutes for the build to complete
3. Your app will be available at: `https://space-kontext-[random].vercel.app`
4. Note your deployment URL for the next step

### Step 4: Configure Clerk Webhook

1. Go to https://dashboard.clerk.com
2. Navigate to **Webhooks** (left sidebar)
3. Click **Add Endpoint**
4. Enter your Vercel URL: `https://your-app.vercel.app/api/webhooks/clerk`
5. Select events:
   - ✅ `user.created`
   - ✅ `user.updated`
   - ✅ `user.deleted`
6. Click **Create**
7. **Copy the Signing Secret** (starts with `whsec_...`)

### Step 5: Add Webhook Secret to Vercel

1. Go back to Vercel dashboard
2. Your project → **Settings** → **Environment Variables**
3. Add:
   ```
   CLERK_WEBHOOK_SECRET
   whsec_... (paste the secret from Clerk)
   ```
   - Target: Production, Preview, Development
4. Go to **Deployments** tab
5. Click the **⋯** menu on the latest deployment
6. Click **Redeploy**

### Step 6: Test Everything

Visit your live URL and test:
- [ ] Landing page loads
- [ ] Sign up works
- [ ] Redirects to dashboard after sign up
- [ ] Create a new project
- [ ] Open floorplan editor, draw walls, save
- [ ] Refresh - walls still there
- [ ] Open 3D editor, verify it loads

## Troubleshooting

- **Build fails**: Check Vercel build logs for errors
- **"Unauthorized" errors**: Verify Clerk keys are correct in Vercel env vars
- **File upload fails**: Check R2 credentials in Vercel env vars
- **Database errors**: Verify DATABASE_URL is correct
- **Webhook not working**: Check CLERK_WEBHOOK_SECRET is set and redeploy
