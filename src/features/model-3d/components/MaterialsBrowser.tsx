/**
 * MaterialsBrowser component
 * Displays available materials organized by category
 * Designed to fit in the SettingsSidebar
 */
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { MaterialCard, type Material } from './MaterialCard';

interface MaterialsBrowserProps {
  onMaterialSelect?: (material: Material) => void;
  selectedMaterialId?: string;
}

export const MaterialsBrowser: React.FC<MaterialsBrowserProps> = ({
  onMaterialSelect,
  selectedMaterialId
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch materials from API
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/materials');
        const data = await response.json();

        if (data.error) {
          setError(data.error);
        } else {
          setMaterials(data.materials || []);
        }
      } catch (err) {
        setError('Failed to load materials');
        console.error('Error fetching materials:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(materials.map(m => m.category));
    return ['All', ...Array.from(cats)];
  }, [materials]);

  const filteredMaterials = useMemo(() => {
    if (selectedCategory === 'All') {
      return materials;
    }
    return materials.filter(m => m.category === selectedCategory);
  }, [materials, selectedCategory]);

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        Loading materials...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-400 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-1">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`
              px-3 py-1 rounded text-xs font-medium transition-colors
              ${selectedCategory === category
                ? 'bg-[#0f7787] text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }
            `}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto pr-1">
        {filteredMaterials.map((material) => (
          <MaterialCard
            key={material.id}
            material={material}
            onSelect={onMaterialSelect || (() => {})}
            isSelected={material.id === selectedMaterialId}
          />
        ))}
      </div>

      {/* Info */}
      {filteredMaterials.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500 text-sm">
          No materials found
        </div>
      )}
    </div>
  );
};
