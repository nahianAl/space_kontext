# Your Deployment Checklist - Space_KONTEXT

> **For**: You (the developer)
> **Purpose**: Tasks only YOU can do (accounts, API keys, dashboards)

---

## Progress Tracker

### Already Done
- [x] Database created on Render (URL copied)
- [x] TypeScript/ESLint errors fixed
- [x] Build compiles successfully
- [x] R2 storage code implemented
- [x] File upload API implemented
- [x] Auth code enabled (auth.ts, middleware.ts)
- [x] Prisma schema complete

### Remaining
- [ ] Cloudflare R2 setup (get credentials)
- [ ] Clerk authentication setup (get credentials)
- [ ] Enable sign-in/sign-up pages (AI task)
- [ ] Create webhook handler (AI task)
- [ ] Vercel deployment + env vars
- [ ] Database migration
- [ ] Final testing

---

## Step 1: Cloudflare R2 (File Storage)

### 1.1 Create R2 Bucket

1. Log into https://dash.cloudflare.com
2. Left sidebar → **R2**
3. If first time: Click "Purchase R2" (free, just enables service)
4. Click **Create bucket**
   - Name: `space-kontext-prod`
   - Location: Automatic
5. Click **Create bucket**

### 1.2 Create API Token

1. On R2 page → **Manage R2 API Tokens**
2. Click **Create API token**
   - Name: `space-kontext-api`
   - Permissions: **Object Read & Write**
   - Bucket: Select `space-kontext-prod`
3. Click **Create API token**
4. **COPY IMMEDIATELY** (can't see again):
   ```
   Account ID: _______________
   Access Key ID: _______________
   Secret Access Key: _______________
   ```

### 1.3 Enable Public Access

1. Go to bucket → **Settings**
2. Scroll to **Public Access**
3. Enable R2.dev subdomain OR connect custom domain
4. Copy public URL: `https://pub-_______.r2.dev`

---

## Step 2: Clerk (Authentication)

### 2.1 Create Application

1. Log into https://dashboard.clerk.com
2. Click **Add application**
   - Name: `Space Kontext`
   - Sign-in options: Check **Email** and **Password**
3. Click **Create application**

### 2.2 Get API Keys

1. Go to **API Keys** (left sidebar)
2. Copy:
   ```
   Publishable Key: pk_live_________________
   Secret Key: sk_live_________________
   ```

### 2.3 Configure Paths

1. Go to **Paths** in Clerk dashboard
2. Set:
   - Sign-in page: `/sign-in`
   - Sign-up page: `/sign-up`
   - After sign-in: `/dashboard`
   - After sign-up: `/dashboard`

---

## Step 3: Give Credentials to AI

Tell your AI agent:

> "Please read DEPLOYMENT_GUIDE_FOR_AI.md and complete the remaining tasks:
> 1. Enable sign-in/sign-up pages (rename from -disabled)
> 2. Create Clerk webhook handler
> 3. Install svix package
> 4. Run database migration
>
> My DATABASE_URL: [paste your Render URL]"

---

## Step 4: Deploy to Vercel

### 4.1 Create Project

1. Log into https://vercel.com
2. **Add New...** → **Project**
3. **Import** your GitHub repository
4. Framework: Next.js (auto-detected)
5. **Don't deploy yet** - add env vars first

### 4.2 Add Environment Variables

Click **Environment Variables** and add:

```
DATABASE_URL = [your Render PostgreSQL URL]

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_live_...
CLERK_SECRET_KEY = sk_live_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL = /sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL = /sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL = /dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL = /dashboard

R2_ACCOUNT_ID = [from Step 1.2]
R2_ACCESS_KEY_ID = [from Step 1.2]
R2_SECRET_ACCESS_KEY = [from Step 1.2]
R2_BUCKET_NAME = space-kontext-prod
R2_PUBLIC_URL = [from Step 1.3]

NODE_ENV = production
```

### 4.3 Deploy

1. Click **Deploy**
2. Wait 3-5 minutes
3. Note your URL: `https://your-app.vercel.app`

---

## Step 5: Complete Clerk Webhook

### 5.1 Add Webhook in Clerk

1. Clerk dashboard → **Webhooks**
2. Click **Add Endpoint**
   - URL: `https://your-app.vercel.app/api/webhooks/clerk`
   - Events: `user.created`, `user.updated`, `user.deleted`
3. Click **Create**
4. Copy **Signing Secret**: `whsec_...`

### 5.2 Add to Vercel

1. Vercel → Your project → **Settings** → **Environment Variables**
2. Add:
   ```
   CLERK_WEBHOOK_SECRET = whsec_...
   ```
3. Go to **Deployments** → Click **Redeploy**

---

## Step 6: Test Everything

Go to your live URL and test:

- [ ] Landing page loads
- [ ] Sign up works
- [ ] Redirects to dashboard
- [ ] Create a new project
- [ ] Open floorplan editor, draw walls, save
- [ ] Refresh - walls still there
- [ ] Open 3D editor, verify it loads

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Build failed | Check Vercel logs, fix error, redeploy |
| "Unauthorized" errors | Check Clerk keys in Vercel, redeploy |
| File upload fails | Check R2 keys in Vercel |
| Database errors | Check DATABASE_URL, verify migration ran |
| Webhook not working | Check CLERK_WEBHOOK_SECRET, redeploy |
