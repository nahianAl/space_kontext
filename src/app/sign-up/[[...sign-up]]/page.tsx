import { SignUp } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Card className="architectural-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-architectural-blue">
              Create Account
            </CardTitle>
            <CardDescription>
              Join Space Kontext and start designing with real-world intelligence
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignUp 
              appearance={{
                elements: {
                  rootBox: 'w-full',
                  card: 'shadow-none border-0 bg-transparent',
                },
              }}
              redirectUrl="/dashboard"
              signInUrl="/sign-in"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
