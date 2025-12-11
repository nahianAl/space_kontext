'use client';

import { useEffect, useRef } from 'react';
import { useMapStore } from '../store/mapStore';

interface WindLayerProps {
  map: L.Map | null;
  visible?: boolean;
}

/**
 * Wind Layer Component
 * Renders wind arrows showing wind direction and speed
 * Arrows are positioned around the site perimeter, not on top of the boundary
 */
export function WindLayer({
  map,
  visible = true,
}: WindLayerProps) {
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const { climateData, siteBoundary, siteCoordinates, capturedBounds } = useMapStore();

  useEffect(() => {
    // Cleanup if map/data/visibility invalid
    if (!map || !climateData || !siteBoundary || !siteCoordinates || !visible) {
      if (layerGroupRef.current) {
        try {
          if (map && typeof map.hasLayer === 'function' && map.hasLayer(layerGroupRef.current)) {
            map.removeLayer(layerGroupRef.current);
          }
        } catch (e) {
          console.debug('Error removing wind layer:', e);
        }
        layerGroupRef.current = null;
      }
      return;
    }

    const renderLayer = async () => {
      if (!map || !map.getContainer()) {return;}

      const L = await import('leaflet');

      // Wait for map to be fully ready and not in transition
      try {
        await new Promise<void>((resolve, reject) => {
          if (!map) {
            reject(new Error('Map is null'));
            return;
          }
          
          // Use whenReady if available
          if (typeof map.whenReady === 'function') {
            map.whenReady(() => {
              // Wait for any zoom/pan transitions to complete
              const checkMapReady = () => {
                if (!map || !map.getContainer()) {
                  reject(new Error('Map container invalid'));
                  return;
                }
                
                // Check if map is in a transition state
                // Leaflet stores transition state internally, but we can check by waiting
                // for the next frame to ensure DOM is stable
                requestAnimationFrame(() => {
                  requestAnimationFrame(() => {
                    if (map && map.getContainer()) {
                      resolve();
                    } else {
                      reject(new Error('Map container invalid'));
                    }
                  });
                });
              };
              
              // Small delay to let fitBounds complete if it was just called
              setTimeout(checkMapReady, 200);
            });
          } else {
            // Fallback: wait for map to initialize
            setTimeout(() => {
              if (map && map.getContainer()) {
                resolve();
              } else {
                reject(new Error('Map not ready'));
              }
            }, 300);
          }
        });
      } catch (e) {
        console.debug('Error waiting for map ready:', e);
        return;
      }
      
      // Double-check map is still valid after waiting
      if (!map || !map.getContainer()) {
        return;
      }

      // Initialize/Clear Layer Group
      let layerGroup = layerGroupRef.current;
      if (!layerGroup) {
        try {
          layerGroup = L.layerGroup().addTo(map);
          layerGroupRef.current = layerGroup;
        } catch (e) {
          console.debug('Error creating layer group:', e);
          return;
        }
      } else {
        try {
          if (!map.hasLayer(layerGroup)) {
            layerGroup.addTo(map);
          }
          layerGroup.clearLayers();
        } catch (e) {
          console.debug('Error managing layer group:', e);
          return;
        }
      }

      try {
        const wind = climateData.wind;
        if (!wind || !wind.direction || wind.speed === 0) {
          return;
        }

        // Get site boundary coordinates
        if (!siteBoundary.features || siteBoundary.features.length === 0) {
          return;
        }

        // Extract polygon coordinates from the first feature
        const firstFeature = siteBoundary.features[0];
        if (!firstFeature || !firstFeature.geometry || firstFeature.geometry.type !== 'Polygon') {
          return;
        }

        const polygon = firstFeature.geometry as GeoJSON.Polygon;
        const outerRing = polygon.coordinates[0]; // First ring is the outer boundary
        if (!outerRing || outerRing.length === 0) {
          return;
        }
        
        // Convert GeoJSON coordinates [lng, lat] to [lat, lng] for Leaflet
        const boundaryPoints = outerRing
          .filter((coord): coord is [number, number] => coord !== undefined && coord.length >= 2 && coord[0] !== undefined && coord[1] !== undefined)
          .map(coord => ({
            lat: coord[1],
            lng: coord[0]
          }));

        if (boundaryPoints.length < 3) {
          return;
        }

        // Calculate positions along the site boundary perimeter
        // Position arrows well outside the boundary, but ensure they're not too close to image edges
        const numArrows = 12; // Total number of arrows around the perimeter
        const offsetDistance = 0.002; // Offset in degrees (approximately 220 meters) - much further away
        
        // Get image bounds to ensure arrows stay away from edges
        let imageMargin = 0.0003; // Minimum margin from image edges (approximately 33 meters)
        if (capturedBounds) {
          const [imgSouth, imgWest] = capturedBounds[0];
          const [imgNorth, imgEast] = capturedBounds[1];
          imageMargin = Math.min(
            (imgNorth - imgSouth) * 0.1, // 10% of image height
            (imgEast - imgWest) * 0.1    // 10% of image width
          );
        }
        
        const arrowPositions: Array<{ lat: number; lng: number; normalAngle: number }> = [];
        
        for (let i = 0; i < numArrows; i++) {
          const t = i / numArrows;
          const index = Math.floor(t * (boundaryPoints.length - 1));
          const nextIndex = (index + 1) % (boundaryPoints.length - 1);
          
          const p1 = boundaryPoints[index];
          const p2 = boundaryPoints[nextIndex];
          
          if (!p1 || !p2) {
            continue;
          }
          
          // Interpolate position along the edge
          const edgeT = (t * (boundaryPoints.length - 1)) % 1;
          const position = {
            lat: p1.lat + (p2.lat - p1.lat) * edgeT,
            lng: p1.lng + (p2.lng - p1.lng) * edgeT,
          };
          
          // Calculate normal vector (perpendicular to the edge, pointing outward)
          const dx = p2.lng - p1.lng;
          const dy = p2.lat - p1.lat;
          const edgeLength = Math.sqrt(dx * dx + dy * dy);
          
          if (edgeLength > 0) {
            // Normal vector (rotated 90 degrees counterclockwise)
            const normalX = -dy / edgeLength;
            const normalY = dx / edgeLength;
            
            // Offset position outward from the boundary
            const offsetPosition = {
              lat: position.lat + normalY * offsetDistance,
              lng: position.lng + normalX * offsetDistance,
            };
            
            // Ensure arrow position is not too close to image edges
            if (capturedBounds) {
              const [imgSouth, imgWest] = capturedBounds[0];
              const [imgNorth, imgEast] = capturedBounds[1];
              
              // Adjust if too close to image edges
              if (offsetPosition.lat > imgNorth - imageMargin) {
                offsetPosition.lat = imgNorth - imageMargin;
              }
              if (offsetPosition.lat < imgSouth + imageMargin) {
                offsetPosition.lat = imgSouth + imageMargin;
              }
              if (offsetPosition.lng > imgEast - imageMargin) {
                offsetPosition.lng = imgEast - imageMargin;
              }
              if (offsetPosition.lng < imgWest + imageMargin) {
                offsetPosition.lng = imgWest + imageMargin;
              }
            }
            
            // Calculate angle of normal for arrow positioning
            const normalAngle = Math.atan2(normalY, normalX);
            
            arrowPositions.push({
              lat: offsetPosition.lat,
              lng: offsetPosition.lng,
              normalAngle,
            });
          }
        }

        // Convert wind direction from meteorological convention (where wind comes FROM)
        // to arrow direction (where wind goes TO)
        // Meteorological: 0° = North (wind from north), 90° = East (wind from east)
        // Arrow: We want to show where wind is going, so we reverse it
        const windDirectionDeg = wind.direction; // 0-360, where wind comes FROM
        const arrowDirectionDeg = (windDirectionDeg + 180) % 360; // Reverse to show where wind goes
        
        // Convert to radians for geodetic calculations
        // Mathematical convention: 0° = East, 90° = North, 180° = West, 270° = South
        // Meteorological convention: 0° = North, 90° = East, 180° = South, 270° = West
        // To convert: math_angle = 90° - meteo_angle
        // But we already reversed it, so: math_angle = 90° - arrowDirectionDeg
        const arrowDirectionRad = ((90 - arrowDirectionDeg) * Math.PI) / 180;
        
        // Calculate arrow length in meters based on wind speed
        // Wind speed is in km/h, convert to m/s and scale
        const maxSpeed = 50; // km/h - typical max for visualization
        const normalizedSpeed = Math.min(wind.speed / maxSpeed, 1);
        
        // Calculate average boundary size to scale arrows appropriately
        let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;
        boundaryPoints.forEach(p => {
          minLat = Math.min(minLat, p.lat);
          maxLat = Math.max(maxLat, p.lat);
          minLng = Math.min(minLng, p.lng);
          maxLng = Math.max(maxLng, p.lng);
        });
        const latRange = maxLat - minLat;
        const lngRange = maxLng - minLng;
        const avgRange = (latRange + lngRange) / 2;
        
        // Make arrows much longer - base length is 40% of average boundary dimension
        const baseLengthMeters = avgRange * 111000 * 0.4; // 40% of average dimension in meters (much longer)
        const arrowLengthMeters = baseLengthMeters * (0.8 + normalizedSpeed * 0.2); // Scale from 80% to 100% (minimum 80% for visibility)
        
        // Arrow properties - make them much bigger
        const arrowHeadLengthMeters = arrowLengthMeters * 0.35; // Arrowhead is 35% of total length (bigger head)
        const arrowHeadWidthMeters = arrowLengthMeters * 0.2; // Wider arrowhead
        const arrowStrokeWidth = Math.max(6, 6 + normalizedSpeed * 6); // Much thicker: 6-12px (very visible)

        // Color based on wind speed (brighter, more vibrant colors)
        const getWindColor = (speed: number): string => {
          if (speed < 10) {return '#0066FF';} // Bright blue - calm
          if (speed < 20) {return '#00CC00';} // Bright green - light breeze
          if (speed < 30) {return '#FFCC00';} // Bright yellow - moderate
          if (speed < 40) {return '#FF6600';} // Bright orange - strong
          return '#FF0000'; // Bright red - very strong
        };

        const arrowColor = getWindColor(wind.speed);

        // Helper function to calculate point at distance and bearing from a start point
        const destinationPoint = (lat: number, lng: number, distanceMeters: number, bearingRad: number): [number, number] => {
          const R = 6371000; // Earth radius in meters
          const lat1 = lat * Math.PI / 180;
          const lng1 = lng * Math.PI / 180;
          
          const lat2 = Math.asin(
            Math.sin(lat1) * Math.cos(distanceMeters / R) +
            Math.cos(lat1) * Math.sin(distanceMeters / R) * Math.cos(bearingRad)
          );
          
          const lng2 = lng1 + Math.atan2(
            Math.sin(bearingRad) * Math.sin(distanceMeters / R) * Math.cos(lat1),
            Math.cos(distanceMeters / R) - Math.sin(lat1) * Math.sin(lat2)
          );
          
          return [lat2 * 180 / Math.PI, lng2 * 180 / Math.PI];
        };

        // Draw wavy arrows at each position
        arrowPositions.forEach((position) => {
          try {
            // Validate position coordinates
            if (!isFinite(position.lat) || !isFinite(position.lng)) {
              return;
            }

            // Calculate arrow end point using proper geodetic calculation
            const [endLat, endLng] = destinationPoint(
              position.lat,
              position.lng,
              arrowLengthMeters,
              arrowDirectionRad
            );
            
            // Validate end coordinates
            if (!isFinite(endLat) || !isFinite(endLng)) {
              return;
            }
            
            // Draw arrow shaft (straight line) - bigger and brighter
            const arrowShaft = L.polyline(
              [[position.lat, position.lng], [endLat, endLng]],
              {
                color: arrowColor,
                weight: arrowStrokeWidth,
                opacity: 1.0, // Full opacity for maximum visibility
              }
            );
            layerGroup.addLayer(arrowShaft);

            // Draw arrowhead (triangle)
            // Calculate perpendicular direction for arrowhead base
            const perpAngle = arrowDirectionRad + Math.PI / 2;
            const [base1Lat, base1Lng] = destinationPoint(
              endLat,
              endLng,
              arrowHeadLengthMeters,
              arrowDirectionRad + Math.PI // Reverse direction
            );
            
            // Validate base coordinates
            if (!isFinite(base1Lat) || !isFinite(base1Lng)) {
              return;
            }
            
            const [base1OffsetLat, base1OffsetLng] = destinationPoint(
              base1Lat,
              base1Lng,
              arrowHeadWidthMeters,
              perpAngle
            );
            const [base2OffsetLat, base2OffsetLng] = destinationPoint(
              base1Lat,
              base1Lng,
              arrowHeadWidthMeters,
              perpAngle + Math.PI // Opposite direction
            );

            // Validate arrowhead coordinates
            if (!isFinite(base1OffsetLat) || !isFinite(base1OffsetLng) ||
                !isFinite(base2OffsetLat) || !isFinite(base2OffsetLng)) {
              return;
            }

            const arrowhead = L.polygon(
              [[endLat, endLng], [base1OffsetLat, base1OffsetLng], [base2OffsetLat, base2OffsetLng]],
              {
                color: arrowColor,
                fillColor: arrowColor,
                fillOpacity: 1.0, // Full opacity for maximum visibility
                weight: 3, // Thicker outline
              }
            );
            layerGroup.addLayer(arrowhead);
          } catch (error) {
            console.debug('Error rendering wind arrow:', error);
            // Continue with next arrow
          }
        });

      } catch (error) {
        console.error('Error rendering wind layer:', error);
      }
    };

    renderLayer();

    return () => {
      if (layerGroupRef.current) {
        try {
          if (map && typeof map.hasLayer === 'function' && map.hasLayer(layerGroupRef.current)) {
            map.removeLayer(layerGroupRef.current);
          }
        } catch (e) {
          console.debug('Cleanup error:', e);
        }
        layerGroupRef.current = null;
      }
    };
  }, [map, climateData, siteBoundary, siteCoordinates, capturedBounds, visible]);

  return null;
}

