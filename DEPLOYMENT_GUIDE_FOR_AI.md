# Space_KONTEXT - AI Agent Deployment Guide

> **For**: AI Coding Agents (Claude, Cursor, etc.)
> **Status**: Most code already implemented, only 4 tasks remain

---

## Already Implemented (Do NOT recreate)

- `src/lib/storage/r2-storage.ts` - R2 integration
- `src/app/api/files/upload/route.ts` - File upload API
- `src/lib/auth.ts` - Auth helpers
- `src/middleware.ts` - Clerk middleware
- `prisma/schema.prisma` - All models including User, File

---

## Task 1: Enable Sign-In/Sign-Up Pages

The pages exist but are disabled. Rename the directories:

```bash
mv src/app/sign-in-disabled src/app/sign-in
mv src/app/sign-up-disabled src/app/sign-up
```

Or manually rename:
- `src/app/sign-in-disabled/` → `src/app/sign-in/`
- `src/app/sign-up-disabled/` → `src/app/sign-up/`

---

## Task 2: Install Svix Package

```bash
npm install svix
```

---

## Task 3: Create Clerk Webhook Handler

Create file: `src/app/api/webhooks/clerk/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { prisma } from '@/lib/prisma/client';

interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses: Array<{ email_address: string }>;
    first_name: string | null;
    last_name: string | null;
    image_url: string | null;
  };
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('CLERK_WEBHOOK_SECRET not configured');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  const payload = await request.text();
  const headers = {
    'svix-id': request.headers.get('svix-id') || '',
    'svix-timestamp': request.headers.get('svix-timestamp') || '',
    'svix-signature': request.headers.get('svix-signature') || '',
  };

  const wh = new Webhook(webhookSecret);
  let evt: ClerkWebhookEvent;

  try {
    evt = wh.verify(payload, headers) as ClerkWebhookEvent;
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const { type, data } = evt;

  try {
    if (type === 'user.created') {
      await prisma.user.create({
        data: {
          clerkId: data.id,
          email: data.email_addresses[0]?.email_address || '',
          firstName: data.first_name,
          lastName: data.last_name,
          imageUrl: data.image_url,
        },
      });
    }

    if (type === 'user.updated') {
      await prisma.user.update({
        where: { clerkId: data.id },
        data: {
          email: data.email_addresses[0]?.email_address,
          firstName: data.first_name,
          lastName: data.last_name,
          imageUrl: data.image_url,
        },
      });
    }

    if (type === 'user.deleted') {
      await prisma.user.delete({
        where: { clerkId: data.id },
      });
    }
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
```

---

## Task 4: Run Database Migration

User will provide their DATABASE_URL. Run:

```bash
npx prisma generate
DATABASE_URL="[user-provided-url]" npx prisma db push
```

---

## Task 5: Verify Build

```bash
npm run build
```

Build must pass before deployment.

---

## Checklist

- [ ] Sign-in/sign-up pages renamed (removed -disabled)
- [ ] svix package installed
- [ ] Clerk webhook handler created
- [ ] Database migration run
- [ ] Build passes
