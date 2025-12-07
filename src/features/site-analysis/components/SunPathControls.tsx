/**
 * Sun Path Controls Component
 * Simple visibility toggle for sun path diagrams
 */
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Label } from '@/shared/components/ui/label';

interface SunPathControlsProps {
  visible: boolean;
  onVisibilityChange: (visible: boolean) => void;
}

/**
 * Sun Path Controls Component
 * Provides a simple visibility toggle for sun path visualization
 */
export function SunPathControls({
  visible,
  onVisibilityChange,
}: SunPathControlsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sun Path Analysis</CardTitle>
        <CardDescription>
          Toggle sun path diagrams visibility
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Label htmlFor="sun-path-visible">Show Sun Path</Label>
          <input
            type="checkbox"
            id="sun-path-visible"
            checked={visible}
            onChange={(e) => onVisibilityChange(e.target.checked)}
            className="w-4 h-4 cursor-pointer"
          />
        </div>
      </CardContent>
    </Card>
  );
}

