/**
 * Components Demo Page
 * Showcases all the UI components we've built
 */

'use client';

import { useState } from 'react';
import { 
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Textarea
} from '@/shared/components/ui';

export default function ComponentsDemoPage() {
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Components Demo</h1>
          <p className="text-muted-foreground mt-2">
            Showcase of all UI components built for the architectural design platform
          </p>
        </div>

        {/* Basic UI Components */}
        <Card>
          <CardHeader>
            <CardTitle>Basic UI Components</CardTitle>
            <CardDescription>
              Core UI components for forms and interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="text-input">Text Input</Label>
                  <Input
                    id="text-input"
                    placeholder="Enter text..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="number-input">Number Input</Label>
                  <Input
                    id="number-input"
                    type="number"
                    placeholder="Enter number..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="textarea-input">Textarea</Label>
                  <Textarea
                    id="textarea-input"
                    placeholder="Enter long text..."
                    rows={4}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="required-input">Required Input</Label>
                  <Input
                    id="required-input"
                    placeholder="This field is required..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Button Variants</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button>Primary Button</Button>
                    <Button variant="outline">Outline Button</Button>
                    <Button variant="destructive">Destructive Button</Button>
                    <Button variant="ghost">Ghost Button</Button>
                    <Button variant="link">Link Button</Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Button Sizes</Label>
                  <div className="flex items-center gap-2">
                    <Button size="sm">Small</Button>
                    <Button size="default">Default</Button>
                    <Button size="lg">Large</Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card Components */}
        <Card>
          <CardHeader>
            <CardTitle>Card Components</CardTitle>
            <CardDescription>
              Different card layouts and styles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Simple Card</CardTitle>
                  <CardDescription>Basic card with header and content</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    This is a simple card component with basic content.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Card with Actions</CardTitle>
                  <CardDescription>Card with interactive elements</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    This card includes action buttons.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm">Action</Button>
                    <Button size="sm" variant="outline">Cancel</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Form Card</CardTitle>
                  <CardDescription>Card containing form elements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="card-input" className="text-xs">Name</Label>
                      <Input id="card-input" placeholder="Enter name..." />
                    </div>
                    <Button size="sm" className="w-full">Submit</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardHeader>
            <CardTitle>Component Status</CardTitle>
            <CardDescription>
              Current state of component development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Basic UI Components</h3>
                  <p className="text-sm text-muted-foreground">Button, Input, Label, Textarea, Card</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600">Complete</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Layout Components</h3>
                  <p className="text-sm text-muted-foreground">Header, Sidebar, MainContent, Layout</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600">Complete</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Design Components</h3>
                  <p className="text-sm text-muted-foreground">DesignToolbar, Canvas, PropertyPanel</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600">Complete</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Navigation Components</h3>
                  <p className="text-sm text-muted-foreground">Breadcrumb, Tabs</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600">Complete</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
