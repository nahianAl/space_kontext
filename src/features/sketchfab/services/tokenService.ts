/**
 * Token Service
 * Handles Sketchfab OAuth token refresh
 */

import { prisma } from '@/lib/prisma/client';

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
}

/**
 * Refresh a user's Sketchfab access token
 * @param userId - The user's internal ID
 * @returns The new access token
 * @throws Error if refresh fails
 */
export async function refreshToken(userId: string): Promise<string> {
  try {
    // Get user's current token record
    const tokenRecord = await prisma.sketchfabToken.findUnique({
      where: { userId },
    });

    if (!tokenRecord) {
      throw new Error('No Sketchfab token found for user');
    }

    // Validate environment variables
    const clientId = process.env.SKETCHFAB_CLIENT_ID;
    const clientSecret = process.env.SKETCHFAB_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('Missing Sketchfab OAuth credentials');
    }

    // Request new token from Sketchfab
    // Official docs: https://sketchfab.com/developers/oauth
    // Token endpoint: https://sketchfab.com/oauth2/token/
    const tokenUrl = 'https://sketchfab.com/oauth2/token/';
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: tokenRecord.refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Sketchfab token refresh failed:', errorText);
      throw new Error(`Token refresh failed: ${response.status} ${response.statusText}`);
    }

    const tokenData: TokenResponse = await response.json();

    if (!tokenData.access_token) {
      throw new Error('Invalid token response from Sketchfab');
    }

    // Calculate new expiration time
    // Access tokens last 1 month (30 days) according to Sketchfab docs
    const expiresIn = tokenData.expires_in || 2592000; // Default to 30 days in seconds
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + expiresIn);

    // Update token record in database
    await prisma.sketchfabToken.update({
      where: { userId },
      data: {
        accessToken: tokenData.access_token,
        // Use new refresh token if provided, otherwise keep the old one
        refreshToken: tokenData.refresh_token || tokenRecord.refreshToken,
        expiresAt: expiresAt,
        updatedAt: new Date(),
      },
    });

    return tokenData.access_token;
  } catch (error) {
    console.error('refreshToken error:', error);
    throw error;
  }
}

/**
 * Get a valid access token for a user
 * Automatically refreshes if the token is expired or about to expire
 * @param userId - The user's internal ID
 * @param refreshIfExpiringSoon - Refresh if token expires within this many seconds (default: 3600 = 1 hour)
 * @returns The access token
 * @throws Error if token doesn't exist or refresh fails
 */
export async function getValidAccessToken(
  userId: string,
  refreshIfExpiringSoon: number = 3600
): Promise<string> {
  let tokenRecord;
  try {
    tokenRecord = await prisma.sketchfabToken.findUnique({
      where: { userId },
    });
  } catch (dbError) {
    console.error('Database error in getValidAccessToken:', dbError);
    throw new Error('Database error while checking Sketchfab token. Please try again.');
  }

  if (!tokenRecord) {
    throw new Error('No Sketchfab token found for user. Please connect your Sketchfab account.');
  }

  // Check if token is expired or expiring soon
  const now = new Date();
  const expiresAt = new Date(tokenRecord.expiresAt);
  const secondsUntilExpiry = (expiresAt.getTime() - now.getTime()) / 1000;

  if (secondsUntilExpiry <= refreshIfExpiringSoon) {
    // Token is expired or expiring soon, refresh it
    console.log(`Token expiring soon (${secondsUntilExpiry}s), refreshing...`);
    return await refreshToken(userId);
  }

  // Token is still valid
  return tokenRecord.accessToken;
}

/**
 * Check if user has a valid Sketchfab token
 * @param userId - The user's internal ID
 * @returns True if user has a valid (non-expired) token
 */
export async function hasValidToken(userId: string): Promise<boolean> {
  try {
    const tokenRecord = await prisma.sketchfabToken.findUnique({
      where: { userId },
    });

    if (!tokenRecord) {
      return false;
    }

    // Check if token is expired
    const now = new Date();
    const expiresAt = new Date(tokenRecord.expiresAt);

    return expiresAt > now;
  } catch (error) {
    console.error('hasValidToken error:', error);
    return false;
  }
}

