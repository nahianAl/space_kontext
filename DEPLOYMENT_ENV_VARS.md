# Deployment Environment Variables

## Required Environment Variables for Vercel

### Database
```
DATABASE_URL=postgresql://space_kontext_user:ca6F69Q30QKxGhXNoCTkK5d2u7dZiZoT@dpg-d4puvm2dbo4c73biakg0-a.virginia-postgres.render.com/space_kontext
```

### Clerk Authentication
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_aGFwcHktZ25hdC00OC5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_XbNvdXKKM4qW8odMicifLElFVe66QWNSl3qm3b3fqy
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### Cloudflare R2 (File Storage)
```
R2_ACCOUNT_ID=d0d867b2aebf3038decc1929395ff0b8
R2_ACCESS_KEY_ID=f40c986118fbed7aa386285ee9bb9a5f
R2_SECRET_ACCESS_KEY=7018ffd8d0fa2c06e4cc08696f25ec7924e1ea49f3d50e44d2b8ecfb9a2c0c0c
R2_BUCKET_NAME=space-kontext-prod
R2_PUBLIC_URL=https://pub-c91e91785d21410d9142a9d6069b7c7f.r2.dev
```

### Other
```
NODE_ENV=production
```

## Notes
- All R2 credentials are now complete
- CLERK_WEBHOOK_SECRET: Will be added after webhook is configured in Clerk dashboard (Step 5 in deployment checklist)
