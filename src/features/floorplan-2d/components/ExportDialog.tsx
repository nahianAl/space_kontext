/**
 * Export dialog component for floor plan export
 * Provides UI for selecting export format and content options
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { exportToDXF } from '../exporters/dxfExporter';
import { exportToSVG } from '../exporters/svgExporter';
import { exportToJPG } from '../exporters/rasterExporter';
import { exportToPDF } from '../exporters/pdfExporter';
import { DEFAULT_EXPORT_OPTIONS, type ExportFormat, type ExportOptions } from '../types/export';
import { useWallGraphStoreContext } from '../context/WallGraphStoreContext';
import type { getWallGraphStore } from '../store/wallGraphStore';
import type Konva from 'konva';

type WallGraphStoreInstance = ReturnType<typeof getWallGraphStore>;

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  stageRef: React.RefObject<Konva.Stage>;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({
  isOpen,
  onClose,
  stageRef
}) => {
  const [format, setFormat] = useState<ExportFormat>('dxf');
  const [options, setOptions] = useState<ExportOptions>(DEFAULT_EXPORT_OPTIONS);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const useWallGraphStore = useWallGraphStoreContext();

  if (!isOpen) {
    return null;
  }

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);

    try {
      let blob: Blob;
      let filename: string;

      const wallGraphStore = useWallGraphStore;

      switch (format) {
        case 'dxf':
          blob = await exportToDXF(options, wallGraphStore);
          filename = `floorplan-${Date.now()}.dxf`;
          break;
        case 'svg':
          blob = await exportToSVG(options, wallGraphStore);
          filename = `floorplan-${Date.now()}.svg`;
          break;
        case 'jpg':
          blob = await exportToJPG(stageRef, options, wallGraphStore);
          filename = `floorplan-${Date.now()}.jpg`;
          break;
        case 'pdf':
          blob = await exportToPDF(stageRef, options, wallGraphStore);
          filename = `floorplan-${Date.now()}.pdf`;
          break;
        default:
          throw new Error('Unknown export format');
      }

      // Download file
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      onClose();
    } catch (err) {
      console.error('Export failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsExporting(false);
    }
  };

  const updateOption = (key: keyof ExportOptions, value: boolean | number) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <Card className="w-full max-w-md max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <CardTitle>Export Floor Plan</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Format Selection */}
          <div>
            <Label className="block text-sm font-medium mb-2">Export Format</Label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value="dxf"
                  checked={format === 'dxf'}
                  onChange={(e) => setFormat(e.target.value as ExportFormat)}
                  className="w-4 h-4"
                />
                <span>DXF (AutoCAD)</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value="svg"
                  checked={format === 'svg'}
                  onChange={(e) => setFormat(e.target.value as ExportFormat)}
                  className="w-4 h-4"
                />
                <span>SVG (Scalable Vector)</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value="jpg"
                  checked={format === 'jpg'}
                  onChange={(e) => setFormat(e.target.value as ExportFormat)}
                  className="w-4 h-4"
                />
                <span>JPG (High-res Image)</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value="pdf"
                  checked={format === 'pdf'}
                  onChange={(e) => setFormat(e.target.value as ExportFormat)}
                  className="w-4 h-4"
                />
                <span>PDF (Print Document)</span>
              </label>
            </div>
          </div>

          {/* Content Options */}
          <div>
            <Label className="block text-sm font-medium mb-2">Include Content</Label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.includeWalls}
                  onChange={(e) => updateOption('includeWalls', e.target.checked)}
                  className="w-4 h-4"
                />
                <span>Walls</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.includeOpenings}
                  onChange={(e) => updateOption('includeOpenings', e.target.checked)}
                  className="w-4 h-4"
                />
                <span>Doors & Windows</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.includeFurniture}
                  onChange={(e) => updateOption('includeFurniture', e.target.checked)}
                  className="w-4 h-4"
                />
                <span>Furniture & Fixtures</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.includeShapes}
                  onChange={(e) => updateOption('includeShapes', e.target.checked)}
                  className="w-4 h-4"
                />
                <span>Shapes & Lines</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.includeAnnotations}
                  onChange={(e) => updateOption('includeAnnotations', e.target.checked)}
                  className="w-4 h-4"
                />
                <span>Annotations & Dimensions</span>
              </label>
              {(format === 'jpg' || format === 'pdf') && (
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.includeImages}
                    onChange={(e) => updateOption('includeImages', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span>Reference Images</span>
                </label>
              )}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end">
            <Button onClick={onClose} variant="ghost" disabled={isExporting}>
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={isExporting}>
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

