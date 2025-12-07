import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

/**
 * Get the current user's authentication state
 * @returns The current user or null if not authenticated
 */
export async function getCurrentUser() {
  const { userId } = await auth();
  return userId;
}

/**
 * Require authentication for a route
 * Redirects to sign-in if user is not authenticated
 * @param redirectTo - Optional redirect URL after sign-in
 * @returns The current user ID
 */
export async function requireAuth(redirectTo?: string) {
  const { userId } = await auth();
  
  if (!userId) {
    const signInUrl = redirectTo 
      ? `/sign-in?redirect_url=${encodeURIComponent(redirectTo)}`
      : '/sign-in';
    redirect(signInUrl);
  }
  
  return userId;
}

/**
 * Check if user is authenticated
 * @returns True if user is authenticated, false otherwise
 */
export async function isAuthenticated() {
  const { userId } = await auth();
  return !!userId;
}

/**
 * Get user session data
 * @returns Session data including user ID and session ID
 */
export async function getSession() {
  const { userId, sessionId } = await auth();
  return { userId, sessionId };
}
