'use client';

import React, { useState, useRef, useEffect } from 'react';
import { SvgIcon } from '../ui/SvgIcon';
// Note: Using SvgIcon component instead of lucide-react icons for custom icons

const Tooltip = ({ label, children }: { label: string, children: React.ReactNode }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div 
      className="relative flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-xs rounded-md shadow-lg z-10 whitespace-nowrap">
          {label}
        </div>
      )}
    </div>
  );
};

export const ProjectMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { label: 'Site', icon: '/site.svg', href: '#' },
    { label: 'Massing', icon: '/MASS.svg', href: '#' },
    { label: '2D Editor', icon: '/new_fp.svg', href: '#' },
    { label: '3D Editor', icon: '/3D.svg', href: '#' },
  ];

  return (
    <div ref={menuRef} className="relative">
      <Tooltip label="Project">
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md hover:bg-gray-800">
          <SvgIcon src="/new_proj.svg" className="w-7 h-7" />
        </button>
      </Tooltip>
      
      {isOpen && (
        <div className="absolute left-full top-0 ml-2 w-48 bg-black rounded-md shadow-lg py-1 z-20">
          {menuItems.map(item => (
            <a key={item.label} href={item.href} className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800">
              {typeof item.icon === 'string' ? <SvgIcon src={item.icon} className="w-5 h-5 mr-3" /> : <div className="w-5 h-5 mr-3">{item.icon}</div>}
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
