'use client';

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';

interface CadBlock {
  id: string;
  slug: string;
  name: string;
  category: string;
  subcategory?: string;
  thumbnailUrl: string;
  dxfUrl: string;
  width?: number;
  depth?: number;
  tags: string[];
}

interface CadBlocksLibraryProps {
  category: string;
  subcategory?: string | null;
}

export const CadBlocksLibrary: React.FC<CadBlocksLibraryProps> = ({
  category,
  subcategory,
}) => {
  const [blocks, setBlocks] = useState<CadBlock[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch blocks when category changes
  useEffect(() => {
    loadBlocks();
  }, [category, subcategory]);

  const loadBlocks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (subcategory) params.append('subcategory', subcategory);

      const res = await fetch(`/api/cad-blocks?${params}`);
      const data = await res.json();
      setBlocks(data.blocks || []);
    } catch (error) {
      console.error('Failed to load CAD blocks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter blocks by search query
  const filteredBlocks = blocks.filter(
    (block) =>
      block.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  // Handle drag start - attach DXF URL and metadata
  const handleDragStart = (e: React.DragEvent, block: CadBlock) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({
        type: 'cad-block',
        blockId: block.id,
        slug: block.slug,
        name: block.name,
        category: block.category,
        dxfUrl: block.dxfUrl,
        thumbnailUrl: block.thumbnailUrl,
        width: block.width,
        depth: block.depth,
      })
    );
  };

  return (
    <div className="px-2 py-2 space-y-2">
      {/* Search Bar */}
      <div className="relative px-2">
        <Search size={14} className="absolute left-4 top-2.5 text-gray-400" />
        <Input
          placeholder="Search blocks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 h-8 text-xs bg-gray-800 border-gray-700"
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-8 text-gray-400 text-xs">
          Loading blocks...
        </div>
      ) : filteredBlocks.length === 0 ? (
        /* Empty State */
        <div className="text-center py-8 text-gray-400 text-xs">
          No blocks found
        </div>
      ) : (
        /* Blocks Grid */
        <div className="grid grid-cols-2 gap-2 px-2 max-h-96 overflow-y-auto">
          {filteredBlocks.map((block) => (
            <div
              key={block.id}
              draggable
              onDragStart={(e) => handleDragStart(e, block)}
              className="bg-gray-800 rounded-md p-2 cursor-move hover:bg-gray-700 transition-colors group"
              title={block.name}
            >
              {/* Thumbnail Image */}
              <div className="w-full h-20 bg-white rounded mb-1 flex items-center justify-center overflow-hidden">
                <img
                  src={block.thumbnailUrl}
                  alt={block.name}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    // Fallback if image fails to load
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>

              {/* Block Name */}
              <p className="text-xs text-gray-200 truncate text-center">
                {block.name}
              </p>

              {/* Dimensions (if available) */}
              {block.width && block.depth && (
                <p className="text-[10px] text-gray-400 text-center">
                  {block.width}' × {block.depth}'
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
