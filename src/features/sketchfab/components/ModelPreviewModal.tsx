/**
 * Model preview modal component
 * Embeds Sketchfab Viewer API iframe for model preview
 */

'use client';

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import type { SketchfabModel } from '../types';

interface ModelPreviewModalProps {
  model: SketchfabModel | null;
  onClose: () => void;
}

export const ModelPreviewModal = ({ model, onClose }: ModelPreviewModalProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (model && iframeRef.current) {
      // Initialize Sketchfab Viewer API if available
      // The iframe will load the embed URL directly
    }
  }, [model]);

  if (!model) {return null;}

  const embedUrl = `https://sketchfab.com/models/${model.uid}/embed?autostart=1&ui_controls=1&ui_infos=1&ui_stop=1&ui_watermark=1`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={onClose}>
      <div
        className="relative w-full h-full max-w-6xl max-h-[90vh] m-4 bg-white rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/60 to-transparent p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-white font-semibold text-lg mb-1">{model.name}</h2>
              <p className="text-white/80 text-sm">
                By{' '}
                <a
                  href={`https://sketchfab.com/${model.author}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-white"
                >
                  {model.author}
                </a>
              </p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors"
              aria-label="Close preview"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Iframe */}
        <iframe
          ref={iframeRef}
          src={embedUrl}
          className="w-full h-full"
          allow="autoplay; fullscreen; xr-spatial-tracking; accelerometer; gyroscope; magnetometer"
          title={`Preview of ${model.name}`}
        />

        {/* Footer with attribution */}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="text-white text-xs">
            <a
              href={model.viewer_url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white/80"
            >
              View on Sketchfab
            </a>
            {' • '}
            <span>License: {model.license === 'cc-by' ? 'CC BY' : model.license === 'cc-by-sa' ? 'CC BY-SA' : model.license}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

