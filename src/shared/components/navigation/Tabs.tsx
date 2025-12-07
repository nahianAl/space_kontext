/**
 * Tabs component for navigation and content organization
 */

'use client';

import { useState, ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
  badge?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface TabsProps {
  items: TabItem[];
  defaultActiveTab?: string;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  contentClassName?: string;
}

export function Tabs({
  items,
  defaultActiveTab,
  activeTab,
  onTabChange,
  variant = 'default',
  size = 'md',
  className,
  contentClassName
}: TabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(
    activeTab || defaultActiveTab || items[0]?.id
  );

  const currentActiveTab = activeTab || internalActiveTab;

  const handleTabClick = (tabId: string) => {
    if (activeTab === undefined) {
      setInternalActiveTab(tabId);
    }
    onTabChange?.(tabId);
  };

  const variantClasses = {
    default: 'border-b border-border',
    pills: 'bg-muted rounded-lg p-1',
    underline: 'border-b border-border'
  };

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3'
  };

  const activeTabContent = items.find(item => item.id === currentActiveTab)?.content;

  return (
    <div className={cn('w-full', className)}>
      {/* Tab Headers */}
      <div className={cn('flex', variantClasses[variant])}>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentActiveTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => !item.disabled && handleTabClick(item.id)}
              disabled={item.disabled}
              className={cn(
                'flex items-center space-x-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                sizeClasses[size],
                variant === 'default' && [
                  'border-b-2 border-transparent',
                  isActive 
                    ? 'border-architectural-blue text-architectural-blue' 
                    : 'text-muted-foreground hover:text-foreground'
                ],
                variant === 'pills' && [
                  'rounded-md',
                  isActive 
                    ? 'bg-background text-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                ],
                variant === 'underline' && [
                  'border-b-2 border-transparent',
                  isActive 
                    ? 'border-architectural-blue text-architectural-blue' 
                    : 'text-muted-foreground hover:text-foreground'
                ],
                item.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {Icon && <Icon className="h-4 w-4" />}
              <span>{item.label}</span>
              {item.badge && (
                <span className={cn(
                  'px-2 py-0.5 text-xs rounded-full',
                  isActive 
                    ? 'bg-architectural-blue/10 text-architectural-blue' 
                    : 'bg-muted text-muted-foreground'
                )}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTabContent && (
        <div className={cn('mt-4', contentClassName)}>
          {activeTabContent}
        </div>
      )}
    </div>
  );
}

/**
 * Vertical Tabs component
 */
interface VerticalTabsProps extends Omit<TabsProps, 'variant'> {
  variant?: 'default' | 'pills';
  tabWidth?: string;
}

export function VerticalTabs({
  items,
  defaultActiveTab,
  activeTab,
  onTabChange,
  variant = 'default',
  size = 'md',
  tabWidth = 'w-48',
  className,
  contentClassName
}: VerticalTabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(
    activeTab || defaultActiveTab || items[0]?.id
  );

  const currentActiveTab = activeTab || internalActiveTab;

  const handleTabClick = (tabId: string) => {
    if (activeTab === undefined) {
      setInternalActiveTab(tabId);
    }
    onTabChange?.(tabId);
  };

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3'
  };

  const activeTabContent = items.find(item => item.id === currentActiveTab)?.content;

  return (
    <div className={cn('flex w-full', className)}>
      {/* Tab Headers */}
      <div className={cn('flex flex-col space-y-1', tabWidth)}>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentActiveTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => !item.disabled && handleTabClick(item.id)}
              disabled={item.disabled}
              className={cn(
                'flex items-center space-x-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-left',
                sizeClasses[size],
                variant === 'default' && [
                  'border-r-2 border-transparent',
                  isActive 
                    ? 'border-architectural-blue text-architectural-blue bg-architectural-blue/5' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                ],
                variant === 'pills' && [
                  'rounded-md',
                  isActive 
                    ? 'bg-architectural-blue text-white' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                ],
                item.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {Icon && <Icon className="h-4 w-4" />}
              <span>{item.label}</span>
              {item.badge && (
                <span className={cn(
                  'px-2 py-0.5 text-xs rounded-full ml-auto',
                  isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-muted text-muted-foreground'
                )}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTabContent && (
        <div className={cn('flex-1 ml-6', contentClassName)}>
          {activeTabContent}
        </div>
      )}
    </div>
  );
}
