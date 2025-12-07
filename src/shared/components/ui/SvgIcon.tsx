'use client';

import React from 'react';

interface SvgIconProps {
  src: string;
  className?: string;
}

export const SvgIcon: React.FC<SvgIconProps> = ({ src, className = 'w-6 h-6' }) => (
  <img 
    src={src} 
    alt="icon" 
    className={`filter invert ${className}`}
  />
);
