/**
 * Breadcrumb component for navigation
 */

'use client';

import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
}

export function Breadcrumb({ items, className, onItemClick }: BreadcrumbProps) {
  return (
    <nav className={cn('flex items-center space-x-1 text-sm', className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const Icon = item.icon;

        return (
          <div key={index} className="flex items-center">
            {index === 0 && Icon && (
              <Icon className="h-4 w-4 mr-1 text-muted-foreground" />
            )}
            
            {item.href && !isLast ? (
              <button
                onClick={() => onItemClick?.(item, index)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </button>
            ) : (
              <span className={cn(
                isLast ? 'text-foreground font-medium' : 'text-muted-foreground'
              )}>
                {item.label}
              </span>
            )}

            {!isLast && (
              <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
            )}
          </div>
        );
      })}
    </nav>
  );
}

/**
 * Breadcrumb with home icon
 */
interface BreadcrumbWithHomeProps extends Omit<BreadcrumbProps, 'items'> {
  items: Omit<BreadcrumbItem, 'icon'>[];
}

export function BreadcrumbWithHome({ items, ...props }: BreadcrumbWithHomeProps) {
  const itemsWithHome = [
    { label: 'Home', href: '/', icon: Home as React.ComponentType<{ className?: string }> },
    ...items
  ];

  return <Breadcrumb items={itemsWithHome} {...props} />;
}
