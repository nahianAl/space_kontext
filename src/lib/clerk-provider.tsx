'use client';

import { ClerkProvider as BaseClerkProvider } from '@clerk/nextjs';
import { ReactNode } from 'react';

interface ClerkProviderProps {
  children: ReactNode;
}

/**
 * Clerk authentication provider wrapper
 * Provides authentication context to the entire application
 */
export function ClerkProvider({ children }: ClerkProviderProps) {
  // Check if we have valid Clerk keys
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isPlaceholder = publishableKey?.includes('placeholder');

  // If using placeholder keys, show a warning and disable auth
  if (isPlaceholder) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center p-8 max-w-md">
            <h1 className="text-2xl font-bold text-architectural-blue mb-4">
              Space Kontext
            </h1>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-yellow-800 text-sm">
                <strong>Authentication Setup Required</strong>
              </p>
              <p className="text-yellow-700 text-sm mt-2">
                To test authentication, you need to set up Clerk API keys.
              </p>
            </div>
            <div className="text-left text-sm text-muted-foreground space-y-2">
              <p><strong>Steps to enable authentication:</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Go to <a href="https://dashboard.clerk.com/" target="_blank" rel="noopener noreferrer" className="text-architectural-blue hover:underline">dashboard.clerk.com</a></li>
                <li>Create a new application</li>
                <li>Copy your API keys</li>
                <li>Update .env.local with your real keys</li>
                <li>Restart the development server</li>
              </ol>
            </div>
            <div className="mt-6">
              <button 
                onClick={() => window.location.reload()} 
                className="bg-architectural-blue text-white px-4 py-2 rounded-md hover:bg-architectural-blue/90"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <BaseClerkProvider
      appearance={{
        elements: {
          formButtonPrimary: 'bg-architectural-blue hover:bg-architectural-blue/90 text-white',
          card: 'bg-card border border-border shadow-lg',
          headerTitle: 'text-foreground',
          headerSubtitle: 'text-muted-foreground',
          socialButtonsBlockButton: 'border border-border hover:bg-muted',
          formFieldInput: 'border border-input bg-background text-foreground',
          footerActionLink: 'text-architectural-blue hover:text-architectural-blue/80',
          identityPreviewText: 'text-foreground',
          formFieldLabel: 'text-foreground',
          formFieldSuccessText: 'text-architectural-green',
          formFieldErrorText: 'text-destructive',
          formFieldWarningText: 'text-architectural-sun',
        },
        layout: {
          socialButtonsPlacement: 'bottom',
          showOptionalFields: true,
        },
        variables: {
          colorPrimary: '#0f7787',
          colorBackground: 'hsl(var(--background))',
          colorInputBackground: 'hsl(var(--background))',
          colorInputText: 'hsl(var(--foreground))',
          colorText: 'hsl(var(--foreground))',
          colorTextSecondary: 'hsl(var(--muted-foreground))',
          borderRadius: '0.5rem',
        },
      }}
    >
      {children}
    </BaseClerkProvider>
  );
}
