import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { prisma } from '@/lib/prisma/client';

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!;
  const payload = await request.text();
  const headers = {
    'svix-id': request.headers.get('svix-id')!,
    'svix-timestamp': request.headers.get('svix-timestamp')!,
    'svix-signature': request.headers.get('svix-signature')!,
  };

  const wh = new Webhook(webhookSecret);
  let evt: { type: string; data: any };

  try {
    evt = wh.verify(payload, headers) as { type: string; data: any };
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const { type, data } = evt;

  if (type === 'user.created') {
    await prisma.user.create({
      data: {
        clerkId: data.id,
        email: data.email_addresses[0].email_address,
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
        email: data.email_addresses[0].email_address,
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

  return NextResponse.json({ received: true });
}
