import { SignIn } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Card className="architectural-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-architectural-blue">
              Welcome Back
            </CardTitle>
            <CardDescription>
              Sign in to your Space Kontext account to continue designing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignIn 
              appearance={{
                elements: {
                  rootBox: 'w-full',
                  card: 'shadow-none border-0 bg-transparent',
                },
              }}
              redirectUrl="/dashboard"
              signUpUrl="/sign-up"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
