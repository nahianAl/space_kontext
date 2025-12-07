'use client';

// Temporarily disabled authentication for development
// import { useUser, useAuth as useClerkAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

/**
 * Custom hook for authentication state and actions
 * Provides a clean interface for auth operations
 */
export function useAuth() {
  // const { user, isLoaded: userLoaded } = useUser();
  // const { signOut } = useClerkAuth();
  const router = useRouter();

  // Demo user for development
  const user = {
    id: 'demo-user',
    emailAddresses: [{ emailAddress: 'demo@spacekontext.com' }],
    firstName: 'Demo',
    lastName: 'User',
    fullName: 'Demo User',
    imageUrl: null
  };
  const userLoaded = true;

  /**
   * Sign out the current user
   */
  const handleSignOut = useCallback(async () => {
    try {
      // await signOut();
      router.push('/');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error signing out:', error);
    }
  }, [router]);

  /**
   * Redirect to sign-in page
   */
  const redirectToSignIn = useCallback(() => {
    router.push('/dashboard'); // Redirect to dashboard instead of sign-in
  }, [router]);

  /**
   * Redirect to sign-up page
   */
  const redirectToSignUp = useCallback(() => {
    router.push('/dashboard'); // Redirect to dashboard instead of sign-up
  }, [router]);

  /**
   * Redirect to dashboard
   */
  const redirectToDashboard = useCallback(() => {
    router.push('/dashboard');
  }, [router]);

  return {
    // User state
    user,
    isAuthenticated: true, // Always authenticated for development
    isLoading: false, // Always loaded for development
    
    // User info
    userId: user?.id,
    email: user?.emailAddresses?.[0]?.emailAddress,
    firstName: user?.firstName,
    lastName: user?.lastName,
    fullName: user?.fullName,
    imageUrl: user?.imageUrl,
    
    // Actions
    signOut: handleSignOut,
    redirectToSignIn,
    redirectToSignUp,
    redirectToDashboard,
  };
}
