/**
 * MaterialCard component
 * Displays a single material with its PBR texture preview
 */
'use client';

import React from 'react';
import Image from 'next/image';

export interface Material {
  id: string;
  name: string;
  category: string;
  basePath: string;
  diffuse: string;
  normal: string;
  rough: string;
  ao: string;
}

interface MaterialCardProps {
  material: Material;
  onSelect: (material: Material) => void;
  isSelected?: boolean;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({
  material,
  onSelect,
  isSelected = false
}) => {
  return (
    <button
      onClick={() => onSelect(material)}
      className={`
        relative group overflow-hidden rounded-lg transition-all duration-200
        ${isSelected
          ? 'ring-2 ring-[#0f7787] shadow-lg'
          : 'hover:ring-2 hover:ring-gray-400 hover:shadow-md'
        }
      `}
    >
      {/* Material Preview - using diffuse texture */}
      <div className="aspect-square bg-gray-800 relative">
        <img
          src={material.diffuse}
          alt={material.name}
          className="w-full h-full object-cover"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-200" />
      </div>

      {/* Material Info */}
      <div className="p-2 bg-gray-900 text-white text-left">
        <h3 className="text-sm font-medium truncate">{material.name}</h3>
        <p className="text-xs text-gray-400 truncate">{material.category}</p>
      </div>

      {/* Selected Indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-[#0f7787] rounded-full flex items-center justify-center">
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}
    </button>
  );
};
