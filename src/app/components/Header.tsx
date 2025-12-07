'use client';

import { Button } from '@/shared/components/ui/button';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';

export function Header() {
  const { isSignedIn, user } = useUser();

  return (
    <header className="architectural-header">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold text-architectural-blue">
          Space Kontext
        </h1>
        <span className="text-sm text-muted-foreground">
          Architectural Design Platform
        </span>
      </div>
      <nav className="flex items-center space-x-4">
        {isSignedIn ? (
          <>
            <a href="/test-files" className="text-sm text-muted-foreground hover:text-foreground">
              Test Files
            </a>
            <a href="/components-demo" className="text-sm text-muted-foreground hover:text-foreground">
              Components
            </a>
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.firstName || user?.emailAddresses[0]?.emailAddress}
            </span>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: 'w-8 h-8',
                },
              }}
            />
          </>
        ) : (
          <>
            <SignInButton mode="modal">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button size="sm">
                Get Started
              </Button>
            </SignUpButton>
          </>
        )}
      </nav>
    </header>
  );
}
