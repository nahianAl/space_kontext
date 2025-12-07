/**
 * OAuth Callback Route
 * Handles the redirect from Sketchfab after user authorization
 * Exchanges authorization code for access/refresh tokens and stores them
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma/client';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Extract code and state from query parameters
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Handle OAuth errors
    if (error) {
      console.error('Sketchfab OAuth error:', error);
      const errorDescription = searchParams.get('error_description') || 'OAuth authorization failed';
      return NextResponse.redirect(
        new URL(`/projects?error=${encodeURIComponent(errorDescription)}`, request.url)
      );
    }

    // Validate required parameters
    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/projects?error=missing_oauth_parameters', request.url)
      );
    }

    // Validate state token (CSRF protection)
    const cookieStore = await cookies();
    const storedState = cookieStore.get('skf_oauth_state')?.value;
    const storedUserId = cookieStore.get('skf_oauth_user_id')?.value;

    if (!storedState || state !== storedState) {
      console.error('Invalid OAuth state token');
      return NextResponse.redirect(
        new URL('/projects?error=invalid_state_token', request.url)
      );
    }

    if (!storedUserId) {
      console.error('Missing user ID in OAuth callback');
      return NextResponse.redirect(
        new URL('/projects?error=missing_user_id', request.url)
      );
    }

    // Verify current user matches stored user
    const currentUserId = await getCurrentUser();
    if (currentUserId !== storedUserId) {
      console.error('User ID mismatch in OAuth callback');
      return NextResponse.redirect(
        new URL('/projects?error=user_mismatch', request.url)
      );
    }

    // Validate environment variables
    const clientId = process.env.SKETCHFAB_CLIENT_ID;
    const clientSecret = process.env.SKETCHFAB_CLIENT_SECRET;
    const redirectUri = process.env.SKETCHFAB_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      console.error('Missing Sketchfab OAuth credentials');
      return NextResponse.redirect(
        new URL('/projects?error=oauth_config_error', request.url)
      );
    }

    // Exchange authorization code for access token
    // Official docs: https://sketchfab.com/developers/oauth
    const tokenUrl = 'https://sketchfab.com/oauth2/token/';
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Sketchfab token exchange failed:', errorText);
      return NextResponse.redirect(
        new URL('/projects?error=token_exchange_failed', request.url)
      );
    }

    const tokenData = await tokenResponse.json();

    // Validate token response
    if (!tokenData.access_token || !tokenData.refresh_token) {
      console.error('Invalid token response from Sketchfab:', tokenData);
      return NextResponse.redirect(
        new URL('/projects?error=invalid_token_response', request.url)
      );
    }

    // Calculate expiration time
    // Access tokens last 1 month (30 days) according to Sketchfab docs
    const expiresIn = tokenData.expires_in || 2592000; // Default to 30 days in seconds
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + expiresIn);

    // Find or create user in database
    // In development, getCurrentUser() returns 'demo-user' string
    // We need to find the actual user record
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: currentUserId },
          { clerkId: currentUserId },
        ],
      },
    });

    if (!user) {
      // In development mode, create a demo user if it doesn't exist
      if (currentUserId === 'demo-user') {
        user = await prisma.user.upsert({
          where: { clerkId: 'demo-user-clerk' },
          update: {},
          create: {
            clerkId: 'demo-user-clerk',
            email: 'demo@example.com',
          },
        });
      } else {
        console.error('User not found:', currentUserId);
        return NextResponse.redirect(
          new URL('/projects?error=user_not_found', request.url)
        );
      }
    }

    // Store or update tokens in database
    await prisma.sketchfabToken.upsert({
      where: { userId: user.id },
      update: {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresAt: expiresAt,
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresAt: expiresAt,
      },
    });

    // Clear OAuth state cookies
    cookieStore.delete('skf_oauth_state');
    cookieStore.delete('skf_oauth_user_id');

    // Redirect to 3D view (or projects page)
    // You can customize this redirect URL based on your app structure
    const redirectUrl = new URL('/projects', request.url);
    redirectUrl.searchParams.set('sketchfab_connected', 'true');
    
    return NextResponse.redirect(redirectUrl.toString());
  } catch (error) {
    console.error('GET /api/sketchfab/oauth/callback:', error);
    return NextResponse.redirect(
      new URL(
        `/projects?error=${encodeURIComponent(
          error instanceof Error ? error.message : 'oauth_callback_error'
        )}`,
        request.url
      )
    );
  }
}

