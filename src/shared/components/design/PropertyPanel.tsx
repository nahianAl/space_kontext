/**
 * Property Panel component for the architectural design platform
 * Displays and edits properties of selected objects
 */

'use client';

import { useState, ReactNode } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { 
  ChevronDown, 
  ChevronRight, 
  Copy, 
  Trash2, 
  Lock, 
  Unlock,
  Eye,
  EyeOff,
  Move,
  RotateCw,
  Scale
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface PropertyGroup {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  properties: Property[];
  collapsed?: boolean;
}

interface Property {
  id: string;
  label: string;
  type: 'text' | 'number' | 'color' | 'select' | 'boolean' | 'slider';
  value: any;
  options?: { label: string; value: any }[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  disabled?: boolean;
  onChange?: (value: any) => void;
}

interface PropertyPanelProps {
  selectedObjects?: any[];
  onPropertyChange?: (objectId: string, propertyId: string, value: any) => void;
  onObjectAction?: (action: string, objectId: string) => void;
  className?: string;
}

export function PropertyPanel({
  selectedObjects = [],
  onPropertyChange,
  onObjectAction,
  className
}: PropertyPanelProps) {
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (groupId: string) => {
    const newCollapsed = new Set(collapsedGroups);
    if (newCollapsed.has(groupId)) {
      newCollapsed.delete(groupId);
    } else {
      newCollapsed.add(groupId);
    }
    setCollapsedGroups(newCollapsed);
  };

  const handlePropertyChange = (objectId: string, propertyId: string, value: any) => {
    onPropertyChange?.(objectId, propertyId, value);
  };

  const handleObjectAction = (action: string, objectId: string) => {
    onObjectAction?.(action, objectId);
  };

  // Generate property groups based on selected objects
  const generatePropertyGroups = (): PropertyGroup[] => {
    if (selectedObjects.length === 0) {
      return [
        {
          id: 'no-selection',
          label: 'No Selection',
          properties: [
            {
              id: 'message',
              label: 'Select an object to edit its properties',
              type: 'text',
              value: '',
              disabled: true
            }
          ]
        }
      ];
    }

    if (selectedObjects.length === 1) {
      const obj = selectedObjects[0];
      return [
        {
          id: 'transform',
          label: 'Transform',
          icon: Move as React.ComponentType<{ className?: string }>,
          properties: [
            {
              id: 'x',
              label: 'X Position',
              type: 'number',
              value: obj.x || 0,
              unit: 'px',
              onChange: (value) => handlePropertyChange(obj.id, 'x', value)
            },
            {
              id: 'y',
              label: 'Y Position',
              type: 'number',
              value: obj.y || 0,
              unit: 'px',
              onChange: (value) => handlePropertyChange(obj.id, 'y', value)
            },
            {
              id: 'width',
              label: 'Width',
              type: 'number',
              value: obj.width || 100,
              unit: 'px',
              min: 1,
              onChange: (value) => handlePropertyChange(obj.id, 'width', value)
            },
            {
              id: 'height',
              label: 'Height',
              type: 'number',
              value: obj.height || 100,
              unit: 'px',
              min: 1,
              onChange: (value) => handlePropertyChange(obj.id, 'height', value)
            },
            {
              id: 'rotation',
              label: 'Rotation',
              type: 'number',
              value: obj.rotation || 0,
              unit: '°',
              min: 0,
              max: 360,
              onChange: (value) => handlePropertyChange(obj.id, 'rotation', value)
            }
          ]
        },
        {
          id: 'appearance',
          label: 'Appearance',
          properties: [
            {
              id: 'fill',
              label: 'Fill Color',
              type: 'color',
              value: obj.fill || '#000000',
              onChange: (value) => handlePropertyChange(obj.id, 'fill', value)
            },
            {
              id: 'stroke',
              label: 'Stroke Color',
              type: 'color',
              value: obj.stroke || '#000000',
              onChange: (value) => handlePropertyChange(obj.id, 'stroke', value)
            },
            {
              id: 'strokeWidth',
              label: 'Stroke Width',
              type: 'number',
              value: obj.strokeWidth || 1,
              unit: 'px',
              min: 0,
              onChange: (value) => handlePropertyChange(obj.id, 'strokeWidth', value)
            },
            {
              id: 'opacity',
              label: 'Opacity',
              type: 'slider',
              value: obj.opacity || 1,
              min: 0,
              max: 1,
              step: 0.1,
              onChange: (value) => handlePropertyChange(obj.id, 'opacity', value)
            }
          ]
        },
        {
          id: 'layer',
          label: 'Layer',
          properties: [
            {
              id: 'visible',
              label: 'Visible',
              type: 'boolean',
              value: obj.visible !== false,
              onChange: (value) => handlePropertyChange(obj.id, 'visible', value)
            },
            {
              id: 'locked',
              label: 'Locked',
              type: 'boolean',
              value: obj.locked || false,
              onChange: (value) => handlePropertyChange(obj.id, 'locked', value)
            },
            {
              id: 'layer',
              label: 'Layer',
              type: 'select',
              value: obj.layer || 'default',
              options: [
                { label: 'Default', value: 'default' },
                { label: 'Background', value: 'background' },
                { label: 'Foreground', value: 'foreground' }
              ],
              onChange: (value) => handlePropertyChange(obj.id, 'layer', value)
            }
          ]
        }
      ];
    }

    // Multiple objects selected
    return [
      {
        id: 'multi-selection',
        label: 'Multiple Selection',
        properties: [
          {
            id: 'count',
            label: 'Objects Selected',
            type: 'text',
            value: `${selectedObjects.length} objects`,
            disabled: true
          }
        ]
      }
    ];
  };

  const propertyGroups = generatePropertyGroups();

  const renderProperty = (property: Property, objectId?: string) => {
    const commonProps = {
      value: property.value,
      disabled: property.disabled,
      onChange: (e: any) => {
        const value = e.target ? e.target.value : e;
        if (objectId) {
          handlePropertyChange(objectId, property.id, value);
        }
        property.onChange?.(value);
      }
    };

    switch (property.type) {
      case 'text':
        return (
          <Input
            {...commonProps}
            placeholder={property.label}
            className="h-8"
          />
        );
      
      case 'number':
        return (
          <div className="flex items-center space-x-2">
            <Input
              {...commonProps}
              type="number"
              min={property.min}
              max={property.max}
              step={property.step}
              className="h-8"
            />
            {property.unit && (
              <span className="text-xs text-muted-foreground">{property.unit}</span>
            )}
          </div>
        );
      
      case 'color':
        return (
          <div className="flex items-center space-x-2">
            <Input
              {...commonProps}
              type="color"
              className="h-8 w-16 p-1"
            />
            <Input
              {...commonProps}
              placeholder="#000000"
              className="h-8 flex-1"
            />
          </div>
        );
      
      case 'select':
        return (
          <select
            {...commonProps}
            className="h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
          >
            {property.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'boolean':
        return (
          <Button
            variant={property.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => commonProps.onChange(!property.value)}
            className="h-8"
          >
            {property.value ? 'Yes' : 'No'}
          </Button>
        );
      
      case 'slider':
        return (
          <div className="space-y-2">
            <input
              {...commonProps}
              type="range"
              min={property.min}
              max={property.max}
              step={property.step}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground text-center">
              {property.value}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={cn('w-full h-full bg-background border-l border-border', className)}>
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-sm">Properties</h3>
        {selectedObjects.length > 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            {selectedObjects.length} object{selectedObjects.length > 1 ? 's' : ''} selected
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {propertyGroups.map((group) => (
          <Card key={group.id} className="border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {group.icon && <group.icon className="h-4 w-4" />}
                  <CardTitle className="text-sm">{group.label}</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleGroup(group.id)}
                  className="h-6 w-6 p-0"
                >
                  {collapsedGroups.has(group.id) ? (
                    <ChevronRight className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </CardHeader>
            
            {!collapsedGroups.has(group.id) && (
              <CardContent className="pt-0 space-y-3">
                {group.properties.map((property) => (
                  <div key={property.id} className="space-y-1">
                    <Label className="text-xs font-medium">{property.label}</Label>
                    {renderProperty(property, selectedObjects[0]?.id)}
                  </div>
                ))}
              </CardContent>
            )}
          </Card>
        ))}

        {/* Object Actions */}
        {selectedObjects.length > 0 && (
          <Card className="border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Actions</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => selectedObjects.forEach(obj => handleObjectAction('copy', obj.id))}
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => selectedObjects.forEach(obj => handleObjectAction('delete', obj.id))}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
