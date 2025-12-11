/**
 * Sun Path Layer Component
 * Visualizes sun path on the map using Leaflet
 * Renders multiple seasonal paths to create a "dome" effect
 */
'use client';

import { useEffect, useRef } from 'react';
import { generateSunPath as getSunPath, type SunPathData } from '../services/sunPathService';

interface SunPathLayerProps {
  sunPath: SunPathData | null; // Current date's sun path (highlighted)
  map: L.Map | null;
  visible?: boolean;
  color?: string;
  opacity?: number;
  bounds?: L.LatLngBoundsExpression | null; // View bounds to scale the sun path
}

/**
 * Sun Path Layer Component
 * Renders sun path visualization on Leaflet map
 */
export function SunPathLayer({
  sunPath,
  map,
  visible = true,
  color = '#FF8C00', // Darker orange for better visibility
  opacity = 0.9, // Higher opacity
  bounds = null,
}: SunPathLayerProps) {
  // Use a ref to store the layer group
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Effect to initialize and manage the layer group
  useEffect(() => {
    if (!map) {return;}

    // Initialize layer group if it doesn't exist
    let layerGroup = layerGroupRef.current;
    if (!layerGroup) {
      import('leaflet').then((L) => {
        if (!map || !map.getContainer()) {return;}
        try {
          layerGroup = L.layerGroup().addTo(map);
          layerGroupRef.current = layerGroup;
        } catch (e) {
          console.warn('Error initializing layer group:', e);
        }
      });
    } else {
      // Ensure it's on the map
      try {
        if (!map.hasLayer(layerGroup) && map.getContainer()) {
          layerGroup.addTo(map);
        }
      } catch (e) {
        console.warn('Error adding layer group to map:', e);
      }
    }

    // Cleanup: Remove layer group from map when component unmounts or map changes
    return () => {
      if (layerGroup && map) {
        // Don't remove the group itself to avoid flickering, just clear it?
        // Or remove it if the map is being destroyed.
        // For now, remove it to be clean.
        try {
          map.removeLayer(layerGroup);
        } catch (e) {
          // Ignore errors during removal (e.g. map already destroyed)
          console.debug('Error removing layer group:', e);
        }
      }
    };
  }, [map]);

  // Effect to update the content of the layer group
  useEffect(() => {
    if (!map || !sunPath) {
      // If invalid, clear layers
      if (layerGroupRef.current) {
        layerGroupRef.current.clearLayers();
      }
      return;
    }

    if (!visible) {
      // If hidden, clear layers and remove from map
      if (layerGroupRef.current) {
        layerGroupRef.current.clearLayers();
        try {
          if (map.hasLayer(layerGroupRef.current)) {
            map.removeLayer(layerGroupRef.current);
          }
        } catch (e) {
          console.debug('Error removing sun path layer:', e);
        }
      }
      return;
    }

    const updateLayers = async () => {
      try {
        const L = await import('leaflet');

        // Remove custom pane for now to rule out pane issues
        // if (!map.getPane('sunPathPane')) {
        //   map.createPane('sunPathPane');
        //   map.getPane('sunPathPane')!.style.zIndex = '600';
        // }

        // Create a custom pane for sun path to ensure it's on top
        if (!map.getPane('sunPathPane')) {
          map.createPane('sunPathPane');
          map.getPane('sunPathPane')!.style.zIndex = '800'; // Very high z-index
          map.getPane('sunPathPane')!.style.pointerEvents = 'none'; // Let clicks pass through
        }

        // Ensure layer group exists and is on the map
        if (!layerGroupRef.current) {
          // Create new layer group if it doesn't exist
          layerGroupRef.current = L.layerGroup();
        }
        // Re-add to map if it was removed (e.g., when visibility was toggled off)
        if (!map.hasLayer(layerGroupRef.current)) {
          layerGroupRef.current.addTo(map);
        }
        
        const layerGroup = layerGroupRef.current;
        layerGroup.clearLayers(); // Clear existing layers before adding new ones

        // Define dates for the 4 seasonal paths (using current year)
        const year = new Date().getFullYear();
        const seasonalDates = [
          new Date(year, 11, 21), // December 21 (Winter Solstice)
          new Date(year, 2, 21),  // March 21 (Equinox)
          new Date(year, 5, 21),  // June 21 (Summer Solstice)
          new Date(year, 9, 21),  // October 21
        ];

            // Center of the site - validate coordinates
            if (!sunPath.latitude || !sunPath.longitude || 
                !isFinite(sunPath.latitude) || !isFinite(sunPath.longitude)) {
              console.warn('Invalid sun path coordinates:', sunPath);
              return;
            }

            const center = { lat: sunPath.latitude, lng: sunPath.longitude };

        // Calculate radius based on bounds
        let radius = 0;
        if (bounds) {
          const latLngBounds = Array.isArray(bounds) 
            ? L.latLngBounds(bounds as L.LatLngExpression[])
            : bounds instanceof L.LatLngBounds
            ? bounds
            : L.latLngBounds(bounds);
          const southWest = latLngBounds.getSouthWest();
          const northEast = latLngBounds.getNorthEast();
          
          const latDiff = northEast.lat - southWest.lat;
          const lngDiff = northEast.lng - southWest.lng;
          
          const maxDimension = Math.max(latDiff, lngDiff);
          radius = maxDimension * 0.25; // Reduced to 0.25
          console.log('Sun Dome Radius (Bounds):', radius, 'Max Dim:', maxDimension);
        } else {
          const zoom = map.getZoom();
          const baseRadius = 0.015;
          radius = baseRadius / Math.pow(1.5, Math.max(0, zoom - 13));
          console.log('Sun Dome Radius (Zoom):', radius, 'Zoom:', zoom);
        }

        // Function to draw a single sun path
        const drawPath = (date: Date, isCurrent: boolean) => {
          // Validate center coordinates
          if (!center || !isFinite(center.lat) || !isFinite(center.lng)) {
            console.warn('Invalid center coordinates for sun path:', center);
            return;
          }

          // Fix: Pass date inside an options object, not as the 3rd argument directly
          const pathData = getSunPath(center.lat, center.lng, { date });
          const positions = pathData.positions.filter((pos) => pos.altitude >= 0);

          if (positions.length === 0) {return;}

          const latlngs: [number, number][] = [];

          for (const pos of positions) {
            // Validate position data
            if (!isFinite(pos.altitude) || !isFinite(pos.azimuth)) {
              continue;
            }

            // Stereographic-like Projection
            const r = radius * (1 - (pos.altitude / 90));
            
            // Standard Math Angle: 0=E, 90=N
            const azimuthRad = (90 - pos.azimuth) * (Math.PI / 180);
            
            const latScale = 1;
            // Approximate lng scale correction
            const lngScale = 1 / Math.cos(center.lat * Math.PI / 180);

            const latOffset = r * Math.sin(azimuthRad) * latScale;
            const lngOffset = r * Math.cos(azimuthRad) * lngScale;

            const finalLat = center.lat + latOffset;
            const finalLng = center.lng + lngOffset;

            // Validate final coordinates before adding
            if (isFinite(finalLat) && isFinite(finalLng)) {
              latlngs.push([finalLat, finalLng]);
            }
          }

          if (latlngs.length < 2) {return;}

          // Draw the path - validate all coordinates before creating polyline
          const validLatlngs = latlngs
            .map(c => {
              if (isFinite(c[0]) && isFinite(c[1])) {
                try {
                  return L.latLng(c[0], c[1]);
                } catch (e) {
                  console.debug('Invalid LatLng:', c, e);
                  return null;
                }
              }
              return null;
            })
            .filter((ll): ll is L.LatLng => ll !== null);

          if (validLatlngs.length < 2) {return;}

          const polyline = L.polyline(validLatlngs, {
            color: '#FF8C00', // Uniform orange color
            weight: 4, // Thicker lines (increased from 2)
            opacity: 1.0, // Full opacity
            dashArray: '12, 8', // Bolder dashes (longer dash, shorter gap)
            pane: 'sunPathPane',
          });
          layerGroup.addLayer(polyline);

          // Add Sun Icons at Start, End, and Middle
          const startIndex = 0;
          const endIndex = validLatlngs.length - 1;
          const midIndex = Math.floor(validLatlngs.length / 2);
          
          [startIndex, midIndex, endIndex].forEach(index => {
            const latlng = validLatlngs[index];
            if (!latlng || !isFinite(latlng.lat) || !isFinite(latlng.lng)) {
              return;
            }

            try {
              const sunIcon = L.divIcon({
                className: 'sun-icon',
                // Add white background and shadow for better visibility and to mask the line
                html: `<div style="
                  font-size: 24px;
                  line-height: 30px;
                  width: 30px;
                  height: 30px;
                  text-align: center;
                  background: white;
                  border-radius: 50%;
                  box-shadow: 0 0 4px rgba(0,0,0,0.3);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                ">☀️</div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 15] // Center anchor
              });
              layerGroup.addLayer(L.marker(latlng, {
                icon: sunIcon,
                pane: 'sunPathPane' // Ensure marker is in the same high-z-index pane, on top of line
              }));
            } catch (e) {
              console.debug('Error creating sun icon marker:', e);
            }
          });

          // Removed Month Label as requested
        };

        // Draw all seasonal paths
        seasonalDates.forEach(date => drawPath(date, false));

        // Draw current selected path (ONLY if requested - User asked to remove the "extra curve")
        // The user said "remove that" referring to the extra curve for Nov.
        // So we ONLY draw the 4 seasonal curves.
        // const currentDate = sunPath.date ? new Date(sunPath.date) : new Date();
        // drawPath(currentDate, true);

      } catch (error) {
        console.error('Error rendering sun dome:', error);
      }
    };

    updateLayers();

  }, [map, sunPath, visible, color, opacity, bounds]);

  return null;
}
