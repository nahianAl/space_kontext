/**
 * Simple Leaflet map component with Leaflet.draw integration
 * Provides interactive map with drawing tools for site boundary definition
 * Uses Leaflet.draw plugin for professional drawing capabilities
 */
'use client';

import { useEffect, useRef } from 'react';
import { calculateAreaSqFeet } from '../utils/areaCalculation';

/**
 * Simple screenshot - captures exactly what's on screen
 * With Canvas renderer, html2canvas can properly capture polygons
 */
async function captureMapAsImage(
  map: L.Map,
  drawnItems: L.FeatureGroup | null
): Promise<string> {
  if (!map || !map.getContainer()) {
    throw new Error('Map not ready');
  }

  // Stop any animations
  map.stop();
  
  // Wait for map to be fully rendered
  await new Promise(resolve => requestAnimationFrame(resolve));
  await new Promise(resolve => requestAnimationFrame(resolve));

  const html2canvas = await import('html2canvas');
  const mapContainer = map.getContainer();
  
  // Capture directly - Canvas renderer makes this work reliably
  const options = {
    useCORS: true,
    logging: false,
    background: '#ffffff',
    ignoreElements: (element: Element) => {
      return element.classList?.contains('leaflet-control-container') || false;
    },
    scale: 4,
  } as Parameters<typeof html2canvas.default>[1] & { scale?: number; ignoreElements?: (element: Element) => boolean };
  const canvas = await html2canvas.default(mapContainer, options);
  
  return canvas.toDataURL('image/png', 1.0);
}

interface SimpleMapProps {
  className?: string;
  height?: string;
  center?: [number, number]; // Center coordinates [lat, lng]
  zoom?: number; // Zoom level
  onMapReady?: (map: L.Map) => void;
  onBoundaryDrawn?: (boundary: GeoJSON.FeatureCollection, areaSqFeet: number) => void;
  showDrawingControls?: boolean;
  enableDrawing?: boolean; // Enable/disable drawing controls
  existingBoundary?: GeoJSON.FeatureCollection | null; // Load existing boundary
  onCaptureImage?: (captureFn: () => Promise<string>) => void; // Expose capture function to parent
}

export function SimpleMap({ 
  className, 
  height = '500px', 
  center = [40.7128, -74.0060], // Default to NYC
  zoom = 13, // Default zoom level
  onMapReady, 
  onBoundaryDrawn,
  showDrawingControls = false,
  enableDrawing = true,
  existingBoundary = null,
  onCaptureImage,
}: SimpleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const drawControlRef = useRef<L.Control.Draw | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
  const currentDrawHandlerRef = useRef<any>(null);
  const isDrawingRef = useRef<boolean>(false);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const initMap = async () => {
      const L = await import('leaflet');
      const LDraw = await import('leaflet-draw');
      
      if (mapRef.current && !mapInstanceRef.current) {
        // Initialize map with Canvas renderer for better html2canvas compatibility
        // SVG renderer causes polygons to disappear/shift when captured
        const map = L.map(mapRef.current, {
          renderer: L.canvas({ padding: 0.5 })
        }).setView(center, zoom);
        
        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);
        
        // Initialize drawn items layer (where Leaflet.draw stores drawn features)
        // Canvas renderer is set at map level, so all layers will use it
        const drawnItems = new L.FeatureGroup();
        map.addLayer(drawnItems);
        drawnItemsRef.current = drawnItems;
        
        // Configure draw control options
        const drawControlOptions: any = {
          position: 'topright',
          draw: {
            polygon: {
              allowIntersection: false, // Don't allow self-intersecting polygons
              showArea: true, // Show area while drawing
              shapeOptions: {
                color: '#0f7787',
                fillColor: '#0f7787',
                fillOpacity: 0.25,
                weight: 3,
              },
            },
            polyline: false, // Disable polyline
            rectangle: false, // Disable rectangle
            circle: false, // Disable circle
            marker: false, // Disable marker
            circlemarker: false, // Disable circle marker
          },
          edit: {
            featureGroup: drawnItems,
            remove: true, // Allow deletion
          },
        };
        
        // Create and add draw control if drawing is enabled
        if (enableDrawing) {
          const drawControl = new L.Control.Draw(drawControlOptions);
          map.addControl(drawControl);
          drawControlRef.current = drawControl;
        }
        
        // Track when drawing starts
        map.on('draw:drawstart' as any, (e: any) => {
          isDrawingRef.current = true;
          // Store reference to the current draw handler
          // The handler is in e.handler, but we can also get it from the draw control
          const handler = e.handler || (drawControlRef.current as any)?._toolbars?.draw?._activeMode?.handler;
          if (handler) {
            currentDrawHandlerRef.current = handler;
            console.log('Drawing started, handler:', {
              type: handler.constructor.name,
              hasCompleteShape: typeof handler.completeShape === 'function',
              hasFinishShape: typeof handler._finishShape === 'function',
              markers: handler._markers?.length || 0
            });
          } else {
            console.warn('No handler found in draw:drawstart event');
          }
        });
        
        // Track when drawing stops
        map.on('draw:drawstop' as any, () => {
          isDrawingRef.current = false;
          currentDrawHandlerRef.current = null;
        });
        
        // Handle draw:created event (when user finishes drawing a polygon)
        map.on('draw:created' as any, (e: any) => {
          const layer = e.layer;
          const geoJSON = layer.toGeoJSON();
          
          // Add to drawn items - this keeps it visible on the map
          drawnItems.addLayer(layer);
          
          // Calculate area in square feet
          const featureCollection: GeoJSON.FeatureCollection = {
            type: 'FeatureCollection',
            features: [geoJSON]
          };
          
          // Calculate area - the function can handle FeatureCollection
          const areaSqFeet = calculateAreaSqFeet(featureCollection);
          
          console.log('Boundary created:', {
            areaSqFeet,
            feature: geoJSON,
          });
          
          // Notify parent component
          if (onBoundaryDrawn) {
            onBoundaryDrawn(featureCollection, areaSqFeet);
          }
        });
        
        // Handle draw:edited event (when user edits an existing polygon)
        map.on('draw:edited' as any, (e: any) => {
          const layers = e.layers;
          const featureCollection: GeoJSON.Feature[] = [];
          
          layers.eachLayer((layer: L.Layer) => {
            if (layer instanceof L.Polygon) {
              const geoJSON = layer.toGeoJSON();
              featureCollection.push(geoJSON);
            }
          });
          
          if (featureCollection.length > 0) {
            // Calculate total area
            const totalAreaSqFeet = calculateAreaSqFeet({
              type: 'FeatureCollection',
              features: featureCollection
            });
            
            // Notify parent component
            if (onBoundaryDrawn) {
              onBoundaryDrawn({
                type: 'FeatureCollection',
                features: featureCollection
              }, totalAreaSqFeet);
            }
          }
        });
        
        // Handle draw:deleted event (when user deletes a polygon)
        map.on('draw:deleted' as any, () => {
          // Notify parent that boundary was cleared
          if (onBoundaryDrawn) {
            onBoundaryDrawn({
              type: 'FeatureCollection',
              features: []
            }, 0);
          }
        });
        
        mapInstanceRef.current = map;
        
        // Expose capture function to parent
        if (onCaptureImage) {
          onCaptureImage(async () => {
            if (!map) {
              throw new Error('Map not initialized');
            }
            return await captureMapAsImage(map, drawnItemsRef.current);
          });
        }
        
        // Notify parent that map is ready
        if (onMapReady) {
          onMapReady(map);
        }
      }
    };
    
    initMap();
    
    // Add keyboard event listener for Enter key to finish drawing
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if focus is on an input field to avoid unwanted actions
      const activeElement = document.activeElement?.tagName;
      if (activeElement === 'INPUT' || activeElement === 'TEXTAREA' || activeElement === 'SELECT') {
        return;
      }
      
      // If Enter is pressed and we're currently drawing
      if (event.key === 'Enter' && isDrawingRef.current) {
        // Try to get handler from ref first, then from draw control
        let handler = currentDrawHandlerRef.current;
        
        // If no handler in ref, try to get it from the draw control
        if (!handler && drawControlRef.current && mapInstanceRef.current) {
          const drawControl = drawControlRef.current as any;
          handler = drawControl._toolbars?.draw?._activeMode?.handler;
        }
        
        if (!handler) {
          console.log('No handler found for Enter key');
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        
        // Check if we have enough points (at least 3 for a polygon)
        const markers = (handler as any)._markers || [];
        
        if (markers.length >= 3) {
          // Finish the drawing by closing the polygon
          try {
            // Method 1: Use completeShape() - the official Leaflet.draw method
            if (typeof (handler as any).completeShape === 'function') {
              console.log('Calling completeShape()');
              (handler as any).completeShape();
              return;
            }
            
            // Method 2: Try _finishShape (internal method)
            if (typeof (handler as any)._finishShape === 'function') {
              console.log('Calling _finishShape()');
              (handler as any)._finishShape();
              return;
            }
            
            // Method 3: Click the first marker to close the polygon
            const firstMarker = markers[0];
            if (firstMarker) {
              // Try to get the marker's icon and click it
              const iconElement = (firstMarker as any)._icon;
              if (iconElement) {
                console.log('Clicking first marker icon');
                // Create a proper click event
                const clickEvent = new MouseEvent('click', {
                  bubbles: true,
                  cancelable: true,
                  view: window,
                  button: 0,
                });
                iconElement.dispatchEvent(clickEvent);
                return;
              }
              
              // If no icon, try to get the latlng and simulate a map click
              if (firstMarker.getLatLng) {
                const firstLatLng = firstMarker.getLatLng();
                const map = mapInstanceRef.current;
                if (map) {
                  console.log('Simulating map click at first point');
                  // Get the container point
                  const containerPoint = map.latLngToContainerPoint(firstLatLng);
                  const mapContainer = map.getContainer();
                  const rect = mapContainer.getBoundingClientRect();
                  
                  // Create a synthetic click event at the exact position
                  const syntheticEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    clientX: rect.left + containerPoint.x,
                    clientY: rect.top + containerPoint.y,
                    button: 0,
                  });
                  
                  // Dispatch on the map container
                  mapContainer.dispatchEvent(syntheticEvent);
                  return;
                }
              }
            }
            
            console.warn('Could not find a way to finish the drawing');
          } catch (error) {
            console.error('Error finishing drawing:', error);
          }
        } else {
          console.log('Not enough points to finish (need 3, have', markers.length, ')');
        }
      }
    };
    
    // Add keyboard event listener for Enter key
    window.addEventListener('keydown', handleKeyDown, true); // Use capture phase for better reliability
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      if (mapInstanceRef.current) {
        try {
          const map = mapInstanceRef.current;
          
          // Check if map container still exists
          if (!map.getContainer() || !map.getContainer().parentNode) {
            // Map container is already removed from DOM, just clear refs
            mapInstanceRef.current = null;
            drawControlRef.current = null;
            drawnItemsRef.current = null;
            return;
          }

          // Remove draw control if it exists
          if (drawControlRef.current) {
            try {
              map.removeControl(drawControlRef.current);
            } catch (e) {
              console.debug('Error removing draw control:', e);
            }
            drawControlRef.current = null;
          }

          // Remove drawn items layer if it exists
          if (drawnItemsRef.current) {
            try {
              if (map.hasLayer && map.hasLayer(drawnItemsRef.current)) {
                map.removeLayer(drawnItemsRef.current);
              }
            } catch (e) {
              console.debug('Error removing drawn items layer:', e);
            }
            drawnItemsRef.current = null;
          }

          // Remove the map itself
          try {
            map.remove();
          } catch (e) {
            console.debug('Error removing map:', e);
            // If remove fails, try to clear the container
            try {
              if (map.getContainer()) {
                map.getContainer().innerHTML = '';
              }
            } catch (e2) {
              console.debug('Error clearing map container:', e2);
            }
          }
        } catch (e) {
          console.debug('Error during map cleanup:', e);
        } finally {
          mapInstanceRef.current = null;
        }
      }
    };
  }, []); // Only run once on mount

  // Handle existing boundary updates
  useEffect(() => {
    if (!mapInstanceRef.current || !drawnItemsRef.current) return;
    
    const loadBoundary = async () => {
      const L = await import('leaflet');
      const map = mapInstanceRef.current!;
      const drawnItems = drawnItemsRef.current!;
      
      // Clear existing layers
      drawnItems.clearLayers();
      
      // Load new boundary if provided
      if (existingBoundary && existingBoundary.features.length > 0) {
        const layers: L.Layer[] = [];
        existingBoundary.features.forEach((feature) => {
          if (feature.geometry.type === 'Polygon') {
            const polygon = L.geoJSON(feature, {
              style: {
                color: '#0f7787',
                fillColor: '#0f7787',
                fillOpacity: 0.25,
                weight: 3,
              },
            });
            drawnItems.addLayer(polygon);
            layers.push(polygon);
          }
        });
        
        // Just load the boundary, no automatic fitting
        // User controls zoom/pan manually
        if (layers.length > 0) {
          // Boundary is loaded and visible, user can adjust view as needed
        }
      } else {
        // Remove maxBounds if boundary is cleared
        map.setMaxBounds(undefined);
        // Re-enable map interaction when boundary is cleared
        map.dragging.enable();
        map.touchZoom.enable();
        map.doubleClickZoom.enable();
        map.scrollWheelZoom.enable();
        map.boxZoom.enable();
        map.keyboard.enable();
        if ((map as unknown as { tap?: { enable: () => void } }).tap) {
          (map as unknown as { tap: { enable: () => void } }).tap.enable();
        }
      }
    };
    
    loadBoundary();
  }, [existingBoundary]);
  
  return (
    <div 
      ref={mapRef}
      className={className}
      style={{ height, width: '100%' }}
    />
  );
}
