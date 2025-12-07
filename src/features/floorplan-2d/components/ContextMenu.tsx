/**
 * Context menu component for right-click actions on the canvas
 * Supports both mouse right-click and trackpad two-finger click
 */
'use client';

import React, { useEffect, useRef } from 'react';
import { Image as ImageIcon, FileIcon } from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onImportImage: () => void;
  onImportDXF: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose, onImportImage, onImportDXF }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  // Prevent context menu from going off-screen
  const menuStyle: React.CSSProperties = {
    position: 'fixed',
    left: `${x}px`,
    top: `${y}px`,
    zIndex: 10000,
  };

  return (
    <div
      ref={menuRef}
      className="bg-gray-800 border border-gray-700 rounded-md shadow-lg py-1 min-w-[180px]"
      style={menuStyle}
    >
      <button
        onClick={() => {
          onImportImage();
          onClose();
        }}
        className="w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-700 flex items-center space-x-2 transition-colors"
      >
        <ImageIcon size={16} />
        <span>Import Image</span>
      </button>
      <button
        onClick={() => {
          onImportDXF();
          onClose();
        }}
        className="w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-700 flex items-center space-x-2 transition-colors"
      >
        <FileIcon size={16} />
        <span>Import DXF Block</span>
      </button>
    </div>
  );
};

