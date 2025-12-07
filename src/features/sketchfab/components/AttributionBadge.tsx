/**
 * Attribution badge component
 * Displays license and attribution information for Sketchfab models
 */

'use client';

import React from 'react';
import type { SketchfabModel } from '../types';

interface AttributionBadgeProps {
  model: SketchfabModel;
  className?: string;
}

export const AttributionBadge = ({ model, className = '' }: AttributionBadgeProps) => {
  const licenseDisplay = model.license === 'cc-by' ? 'CC BY' : model.license === 'cc-by-sa' ? 'CC BY-SA' : model.license;

  return (
    <div className={`text-xs text-gray-500 ${className}`}>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-medium text-gray-700">License:</span>
        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium">
          {licenseDisplay}
        </span>
      </div>
      <div className="mt-1">
        <span className="text-gray-600">By </span>
        <a
          href={`https://sketchfab.com/${model.author}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {model.author}
        </a>
      </div>
      {model.license === 'cc-by' || model.license === 'cc-by-sa' ? (
        <div className="mt-1 text-gray-500 italic">
          Creative Commons — attribution required
        </div>
      ) : null}
    </div>
  );
};

