/**
 * OAuth Start Route
 * Initiates Sketchfab OAuth flow by generating state token and redirecting to Sketchfab
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const userId = await getCurrentUser();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate environment variables
    const clientId = process.env.SKETCHFAB_CLIENT_ID;
    const redirectUri = process.env.SKETCHFAB_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      console.error('Missing Sketchfab OAuth credentials');
      return NextResponse.json(
        { error: 'OAuth configuration error' },
        { status: 500 }
      );
    }

    // Generate random state token for CSRF protection
    const state = crypto.randomUUID();

    // Store state in cookie (httpOnly, secure in production)
    const cookieStore = await cookies();
    cookieStore.set('skf_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/',
    });

    // Also store userId in cookie for callback verification
    cookieStore.set('skf_oauth_user_id', userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600,
      path: '/',
    });

    // Build Sketchfab OAuth authorize URL
    // Official docs: https://sketchfab.com/developers/oauth
    // Authorization Code grant type (standard flow for server-side apps)
    const authorizeUrl = new URL('https://sketchfab.com/oauth2/authorize/');
    authorizeUrl.searchParams.set('response_type', 'code');
    authorizeUrl.searchParams.set('client_id', clientId);
    authorizeUrl.searchParams.set('redirect_uri', redirectUri);
    authorizeUrl.searchParams.set('state', state);

    // Redirect to Sketchfab OAuth page
    return NextResponse.redirect(authorizeUrl.toString());
  } catch (error) {
    console.error('GET /api/sketchfab/oauth/start:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

