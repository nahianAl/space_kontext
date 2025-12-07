/**
 * Hatch pattern selector component for choosing wall fill patterns
 * Allows users to select from available SVG hatch patterns for wall rendering
 */
'use client';

import React, { useState, useEffect } from 'react';
import { useWallGraphStoreContext } from '../context/WallGraphStoreContext';

interface HatchPattern {
  name: string;
  label: string;
  previewUrl: string;
}

const HATCH_PATTERNS: HatchPattern[] = [
  { name: 'HBS2405S', label: 'BS 1192 2.405', previewUrl: '/Hatches/HBS2405S.svg' },
  { name: 'HBS2406S', label: 'BS 1192 2.406', previewUrl: '/Hatches/HBS2406S.svg' },
];

interface HatchPatternSelectorProps {
  value: string | null;
  onChange: (pattern: string | null) => void;
}

export const HatchPatternSelector: React.FC<HatchPatternSelectorProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const useWallGraphStore = useWallGraphStoreContext();
  const loadHatchPatternImage = useWallGraphStore((state) => state.loadHatchPatternImage);

  // Preload pattern images when component mounts
  useEffect(() => {
    HATCH_PATTERNS.forEach(pattern => {
      loadHatchPatternImage(pattern.name);
    });
  }, [loadHatchPatternImage]);

  // Get the selected pattern
  const selectedPattern = value ? HATCH_PATTERNS.find(p => p.name === value) : null;

  const handlePatternSelect = (patternName: string | null) => {
    onChange(patternName);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 w-16 rounded overflow-hidden relative"
        style={{ border: '1px solid #778f8e' }}
      >
        <div 
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={
            selectedPattern
              ? {
                  backgroundImage: `url(${selectedPattern.previewUrl})`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'repeat',
                  backgroundPosition: 'center'
                }
              : {
                  backgroundColor: '#000000'
                }
          }
        />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-20 overflow-hidden">
            <div 
              className="px-2 py-1 cursor-pointer hover:bg-gray-700 transition-colors"
              onClick={() => handlePatternSelect(null)}
            >
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-gray-700 rounded border border-gray-600 flex items-center justify-center">
                  <div className="w-full h-full bg-black rounded" />
                </div>
                <span className="text-sm text-gray-200">Solid Fill</span>
              </div>
            </div>
            {HATCH_PATTERNS.map((pattern) => (
              <div
                key={pattern.name}
                className={`px-2 py-1 cursor-pointer hover:bg-gray-700 transition-colors ${
                  value === pattern.name ? 'bg-gray-700' : ''
                }`}
                onClick={() => handlePatternSelect(pattern.name)}
              >
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-12 h-12 bg-gray-700 rounded border border-gray-600 flex items-center justify-center overflow-hidden"
                    style={{
                      backgroundImage: `url(${pattern.previewUrl})`,
                      backgroundSize: 'cover',
                      backgroundRepeat: 'repeat',
                      backgroundPosition: 'center'
                    }}
                  />
                  <span className="text-sm text-gray-200">{pattern.label}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

