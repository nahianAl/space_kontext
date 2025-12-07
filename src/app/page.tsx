'use client';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
// import { SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'; // Temporarily disabled for development
import { Header } from './components/Header';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 px-6 py-12">
        <div className="mx-auto max-w-6xl">
          {/* Hero Section */}
          <section className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-foreground">
              Design Architecture with Real-World Intelligence
            </h2>
            <p className="mb-8 text-xl text-muted-foreground">
              All-in-one platform for conceptual design with geospatial data, 2D floorplan editing, 
              automatic 3D generation, and sun analysis.
            </p>
            <div className="flex justify-center space-x-4">
              {/* <SignUpButton mode="modal"> */}
                <Button size="lg" onClick={() => window.location.href = '/dashboard'}>
                  Start Designing
                </Button>
              {/* </SignUpButton> */}
              <Button variant="outline" size="lg">
                View Demo
              </Button>
            </div>
          </section>

          {/* Features Grid */}
          <section className="mb-16">
            <h3 className="mb-8 text-center text-3xl font-bold">
              Core Features
            </h3>
            <div className="grid grid-cols-4 gap-6 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1">
              <Card className="architectural-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded bg-architectural-blue/10 flex items-center justify-center">
                      <span className="text-architectural-blue text-sm font-bold">1</span>
                    </div>
                    <span>Site Analysis</span>
                  </CardTitle>
                  <CardDescription>
                    Real-world geospatial data integration with sun path, weather, topography, and context buildings.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Interactive map selection</li>
                    <li>• Sun path visualization</li>
                    <li>• Weather data overlay</li>
                    <li>• Context building analysis</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="architectural-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded bg-architectural-green/10 flex items-center justify-center">
                      <span className="text-architectural-green text-sm font-bold">2</span>
                    </div>
                    <span>2D Floorplan Editor</span>
                  </CardTitle>
                  <CardDescription>
                    Professional floorplan drawing with intuitive tools, object library, and multi-floor support.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Wall, door, window tools</li>
                    <li>• Furniture library</li>
                    <li>• Multi-floor buildings</li>
                    <li>• Snap-to-grid precision</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="architectural-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded bg-architectural-sun/10 flex items-center justify-center">
                      <span className="text-architectural-sun text-sm font-bold">3</span>
                    </div>
                    <span>3D Model Generation</span>
                  </CardTitle>
                  <CardDescription>
                    Automatic 3D generation from 2D floorplans with sun simulation and realistic shadows.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Instant 3D conversion</li>
                    <li>• Sun simulation</li>
                    <li>• Shadow analysis</li>
                    <li>• Export to GLTF/OBJ</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="architectural-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded bg-architectural-neutral-500/10 flex items-center justify-center">
                      <span className="text-architectural-neutral-500 text-sm font-bold">4</span>
                    </div>
                    <span>Massing Diagrams</span>
                  </CardTitle>
                  <CardDescription>
                    Quick volumetric studies with primitive shapes and comprehensive analysis tools.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Primitive shape tools</li>
                    <li>• Volume calculations</li>
                    <li>• FAR analysis</li>
                    <li>• Sun studies</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center">
            <Card className="architectural-card mx-auto max-w-2xl">
              <CardHeader>
                <CardTitle>Ready to Start Designing?</CardTitle>
                <CardDescription>
                  Join architects and designers who are creating better buildings with real-world context.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center space-x-4">
                  {/* <SignUpButton mode="modal"> */}
                    <Button size="lg" onClick={() => window.location.href = '/dashboard'}>
                      Create Free Account
                    </Button>
                  {/* </SignUpButton> */}
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/50 px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-row items-center justify-between space-y-0 md:flex-row sm:flex-col sm:space-y-4">
            <div className="flex items-center space-x-4">
              <h4 className="font-semibold text-architectural-blue">
                Space Kontext
              </h4>
              <span className="text-sm text-muted-foreground">
                © 2024 All rights reserved
              </span>
            </div>
            <nav className="flex items-center space-x-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Support
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
