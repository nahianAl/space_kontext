/**
 * Model card component
 * Displays a Sketchfab model with thumbnail, attribution, and actions
 */

'use client';

import React from 'react';
import { Eye, Download } from 'lucide-react';
import type { SketchfabModel } from '../types';
import { AttributionBadge } from './AttributionBadge';

interface ModelCardProps {
  model: SketchfabModel;
  onPreview: (model: SketchfabModel) => void;
  onAddToScene?: (model: SketchfabModel) => void;
}

export const ModelCard = ({ model, onPreview, onAddToScene }: ModelCardProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Thumbnail */}
      <div className="relative aspect-square bg-gray-100">
        {model.thumbnail ? (
          <img
            src={model.thumbnail}
            alt={model.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No thumbnail
          </div>
        )}
        {model.is_downloadable && (
          <div className="absolute top-2 right-2">
            <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded">
              Downloadable
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-medium text-sm text-gray-900 mb-1 line-clamp-2" title={model.name}>
          {model.name}
        </h3>

        {/* Attribution */}
        <AttributionBadge model={model} className="mb-3" />

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onPreview(model)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded transition-colors"
          >
            <Eye size={14} />
            Preview
          </button>
          {onAddToScene && (
            <button
              onClick={() => onAddToScene(model)}
              disabled={!model.is_downloadable}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 text-white text-xs font-medium rounded transition-colors"
              title={!model.is_downloadable ? 'This model is not downloadable' : 'Add to scene (Phase 2)'}
            >
              <Download size={14} />
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

