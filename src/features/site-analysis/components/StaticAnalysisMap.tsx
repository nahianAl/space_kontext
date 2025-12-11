'use client';

import { useEffect, useRef, useState } from 'react';
import { useMapStore } from '../store/mapStore';
import { SunPathLayer } from './SunPathLayer';
import { ContoursLayer } from './ContoursLayer';
import { BuildingsLayer } from './BuildingsLayer';
import { RoadsLayer } from './RoadsLayer';
import { WindLayer } from './WindLayer';
import type { SunPathData } from '../services/sunPathService';

// Tooltip Component (matching TopToolbar style)
const Tooltip = ({ label, children }: { label: string, children: React.ReactNode }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div 
      className="relative"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md shadow-lg z-10 whitespace-nowrap">
          {label}
        </div>
      )}
    </div>
  );
};

// SvgIcon Component (matching TopToolbar style)
const SvgIcon = ({ 
  src, 
  isActive, 
  isWhite = false,
  size = 'normal',
  strokeAdjustment = 'none'
}: { 
  src: string, 
  isActive: boolean, 
  isWhite?: boolean,
  size?: 'small' | 'normal' | 'large' | 'xlarge',
  strokeAdjustment?: 'none' | 'thicker' | 'thinner' | 'much-thicker'
}) => {
  const iconSize = size === 'small' ? '20px' : size === 'large' ? '28px' : size === 'xlarge' ? '32px' : '24px';
  
  // Base filter for bright white - increased brightness
  // For SVG files, we need to handle them differently - they may have their own fill/stroke colors
  let filter = 'invert(1) brightness(3.0) contrast(1.4)';
  
  // Adjust for stroke thickness
  if (strokeAdjustment === 'much-thicker') {
    filter += ' drop-shadow(0 0 1.5px white)';
  } else if (strokeAdjustment === 'thicker') {
    filter += ' drop-shadow(0 0 1px white)';
  } else if (strokeAdjustment === 'thinner') {
    filter += ' contrast(0.8)';
  }
  
  // Screenshot icon special case
  if (isWhite) {
    filter = 'brightness(0) invert(1) brightness(3.0)';
  }
  
  return (
    <img 
      src={src} 
      alt="tool icon" 
      className="w-6 h-6"
      style={{ 
        filter,
        opacity: isActive ? 1.0 : 0.85,
        width: iconSize,
        height: iconSize
      }}
    />
  );
};

// ToolButton Component (matching TopToolbar style)
const ToolButton = ({ label, isActive, onClick, children }: { label: string, isActive: boolean, onClick: () => void, children: React.ReactNode }) => (
  <Tooltip label={label}>
    <button
      onClick={onClick}
      className="w-12 h-12 flex items-center justify-center group"
      aria-label={label}
    >
      <div className={`flex items-center justify-center rounded-md transition-colors ${isActive ? 'bg-[#0f7787] w-10 h-10' : 'group-hover:bg-gray-700 w-10 h-10'}`}>
        {children}
      </div>
    </button>
  </Tooltip>
);

interface StaticAnalysisMapProps {
  className?: string;
  height?: string;
  sunPath?: SunPathData | null;
}

export function StaticAnalysisMap({ 
  className, 
  height = '500px',
  sunPath = null
}: StaticAnalysisMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const imageOverlayRef = useRef<L.ImageOverlay | null>(null);
  
  const { 
    capturedImage, 
    capturedBounds,
    layerVisibility,
    siteBoundary,
  } = useMapStore();

  // Initialize Map
  useEffect(() => {
    if (typeof window === 'undefined') {return;}
    if (!mapRef.current || !capturedImage || !capturedBounds) {return;}

    const initMap = async () => {
      const L = await import('leaflet');
      
      if (!mapInstanceRef.current && mapRef.current) {
        // Initialize map with standard CRS but disable interactions and animations
        const mapOptions = {
          zoomControl: false,
          dragging: false,
          touchZoom: false,
          doubleClickZoom: false,
          scrollWheelZoom: false,
          boxZoom: false,
          keyboard: false,
          attributionControl: false,
          crs: L.CRS.EPSG3857, // Standard web mercator
          renderer: L.canvas({ padding: 0.5 }), // Use Canvas renderer for performance
          zoomAnimation: false, // Disable zoom animations to prevent transition errors
          fadeAnimation: false, // Disable fade animations
          markerZoomAnimation: false, // Disable marker zoom animations
        } as unknown as L.MapOptions;
        const map = (L.map as unknown as (element: HTMLElement, options?: L.MapOptions) => L.Map)(mapRef.current, mapOptions);

        // Add the captured image as an overlay
        const imageBounds: L.LatLngBoundsExpression = [
          [capturedBounds[0][0], capturedBounds[0][1]], // South West
          [capturedBounds[1][0], capturedBounds[1][1]]  // North East
        ];

        const imageOverlay = L.imageOverlay(capturedImage, imageBounds).addTo(map);
        imageOverlayRef.current = imageOverlay; // Store reference for toggling
        
        // Fit bounds to the image (without animation to prevent transition errors)
        map.fitBounds(imageBounds, { animate: false, padding: [0, 0] });

        // Add Site Boundary Layer
        if (siteBoundary) {
          L.geoJSON(siteBoundary, {
            style: {
              color: '#0f7787',
              weight: 3,
              fillColor: '#0f7787',
              fillOpacity: 0.1,
            }
          }).addTo(map);
        }

        mapInstanceRef.current = map;
        setMapInstance(map);
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        setMapInstance(null);
        imageOverlayRef.current = null; // Clear image overlay ref
      }
    };
  }, [capturedImage, capturedBounds, siteBoundary]);

  // Toggle image overlay visibility based on layerVisibility.osm
  useEffect(() => {
    if (!imageOverlayRef.current || !mapInstanceRef.current) {return;}

    if (layerVisibility.osm) {
      // Show the image overlay
      if (!mapInstanceRef.current.hasLayer(imageOverlayRef.current)) {
        imageOverlayRef.current.addTo(mapInstanceRef.current);
      }
    } else {
      // Hide the image overlay
      if (mapInstanceRef.current.hasLayer(imageOverlayRef.current)) {
        mapInstanceRef.current.removeLayer(imageOverlayRef.current);
      }
    }
  }, [layerVisibility.osm]);

  if (!capturedImage) {return null;}

  // Create bounds expression for SunPathLayer
  const boundsExpression: L.LatLngBoundsExpression | null = capturedBounds 
    ? [
        [capturedBounds[0][0], capturedBounds[0][1]], 
        [capturedBounds[1][0], capturedBounds[1][1]]
      ] 
    : null;

  return (
    <div className={`relative ${className}`} style={{ height }}>
      {/* White background when OSM layer is hidden */}
      {!layerVisibility.osm && (
        <div 
          className="absolute inset-0 bg-white z-0"
          style={{ 
            width: '100%', 
            height: '100%',
            pointerEvents: 'none' // Allow map interactions to pass through
          }}
        />
      )}
      <div ref={mapRef} className="w-full h-full z-0" />
      
      {/* Render Sun Path Layer - always render but control visibility */}
      {sunPath && (
        <SunPathLayer
          sunPath={sunPath}
          map={mapInstance}
          visible={layerVisibility.sunPath || false}
          bounds={boundsExpression}
        />
      )}

      {/* Render Contours Layer if visible */}
      {layerVisibility.contours && (
        <ContoursLayer
          map={mapInstance}
          visible={layerVisibility.contours}
        />
      )}

      {/* Render Buildings Layer if visible */}
      {layerVisibility.buildings && (
        <BuildingsLayer
          map={mapInstance}
          visible={layerVisibility.buildings}
        />
      )}

      {/* Render Roads Layer if visible */}
      {layerVisibility.roads && (
        <RoadsLayer
          map={mapInstance}
          visible={layerVisibility.roads}
        />
      )}

      {/* Render Wind Layer if visible */}
      {layerVisibility.wind && (
        <WindLayer
          map={mapInstance}
          visible={layerVisibility.wind}
        />
      )}

      {/* Bottom Toolbar - 7 Layer Toggle Buttons */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000]">
        <div className="bg-black text-white p-0 rounded-lg shadow-lg border border-gray-800">
          <div className="flex items-center divide-x divide-gray-700">
            <ToolButton 
              label="Map" 
              isActive={layerVisibility.osm ?? false} 
              onClick={() => {
                const { toggleLayer } = useMapStore.getState();
                toggleLayer('osm');
              }}
            >
              <SvgIcon src="/site_map.svg" isActive={layerVisibility.osm ?? false} />
            </ToolButton>
            <ToolButton 
              label="Roads" 
              isActive={layerVisibility.roads ?? false} 
              onClick={() => {
                const { toggleLayer } = useMapStore.getState();
                toggleLayer('roads');
              }}
            >
              <SvgIcon src="/site_road.svg" isActive={layerVisibility.roads ?? false} />
            </ToolButton>
            <ToolButton 
              label="Buildings" 
              isActive={layerVisibility.buildings ?? false} 
              onClick={() => {
                const { toggleLayer } = useMapStore.getState();
                toggleLayer('buildings');
              }}
            >
              <SvgIcon src="/site_buildings.svg" isActive={layerVisibility.buildings ?? false} />
            </ToolButton>
            <ToolButton 
              label="Sun Path" 
              isActive={layerVisibility.sunPath || false} 
              onClick={() => {
                const { toggleLayer } = useMapStore.getState();
                toggleLayer('sunPath');
              }}
            >
              <SvgIcon src="/site_sun.svg" isActive={layerVisibility.sunPath || false} />
            </ToolButton>
            <ToolButton 
              label="Wind Path" 
              isActive={layerVisibility.wind ?? false} 
              onClick={() => {
                const { toggleLayer } = useMapStore.getState();
                toggleLayer('wind');
              }}
            >
              <SvgIcon src="/site_wind.svg" isActive={layerVisibility.wind ?? false} />
            </ToolButton>
            <ToolButton 
              label="Boundary" 
              isActive={true} 
              onClick={() => {
                // Boundary is always visible, but could toggle in future
              }}
            >
              <SvgIcon src="/site_boundary.svg" isActive={true} />
            </ToolButton>
            <ToolButton 
              label="Contour Map" 
              isActive={layerVisibility.contours ?? false} 
              onClick={() => {
                const { toggleLayer } = useMapStore.getState();
                toggleLayer('contours');
              }}
            >
              <SvgIcon src="/site_contour.svg" isActive={layerVisibility.contours ?? false} />
            </ToolButton>
          </div>
        </div>
      </div>
    </div>
  );
}
