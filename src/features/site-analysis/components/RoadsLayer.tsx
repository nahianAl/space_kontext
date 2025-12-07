'use client';

import { useEffect, useRef } from 'react';
import { useMapStore } from '../store/mapStore';

interface RoadsLayerProps {
  map: L.Map | null;
  visible?: boolean;
  color?: string;
}

/**
 * Roads Layer Component
 * Renders road/street network from OpenStreetMap data
 * Displays all highway types (motorway, trunk, primary, secondary, tertiary, residential, etc.)
 */
export function RoadsLayer({
  map,
  visible = true,
  color = '#FF0000', // Bright red for debugging
}: RoadsLayerProps) {
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const { roads } = useMapStore();

  useEffect(() => {
    // Cleanup if map/data/visibility invalid
    if (!map || !roads || !visible) {
      if (layerGroupRef.current) {
        try {
          if (map && typeof map.hasLayer === 'function' && map.hasLayer(layerGroupRef.current)) {
             map.removeLayer(layerGroupRef.current);
          }
        } catch (e) {
          console.debug('Error removing roads layer:', e);
        }
        layerGroupRef.current = null;
      }
      return;
    }

    const renderLayer = async () => {
      if (!map || !map.getContainer()) return;

      const L = await import('leaflet');

      // Initialize/Clear Layer Group
      let layerGroup = layerGroupRef.current;
      if (!layerGroup) {
        layerGroup = L.layerGroup().addTo(map);
        layerGroupRef.current = layerGroup;
      } else {
        if (!map.hasLayer(layerGroup)) {
          layerGroup.addTo(map);
        }
        layerGroup.clearLayers();
      }

      if (!roads.features || roads.features.length === 0) {
        console.warn('RoadsLayer: No roads data available');
        return;
      }

      try {
        // Filter to only include LineString and MultiLineString geometries (roads are lines, not points)
        const roadFeatures = roads.features.filter(feature => {
          const geomType = feature.geometry?.type;
          return geomType === 'LineString' || geomType === 'MultiLineString';
        });

        // Convert any remaining Polygon features to LineString (fallback)
        const polygonFeatures = roads.features.filter(feature => {
          const geomType = feature.geometry?.type;
          return geomType === 'Polygon' || geomType === 'MultiPolygon';
        });

        if (polygonFeatures.length > 0) {
          const convertedPolygons = polygonFeatures.map(feature => {
            if (feature.geometry.type === 'Polygon') {
              const coords = feature.geometry.coordinates[0];
              if (!coords || coords.length === 0) {
                return null;
              }
              const firstCoord = coords[0];
              const lastCoord = coords[coords.length - 1];
              const lineCoords = coords.length > 1 && 
                firstCoord && lastCoord &&
                firstCoord[0] !== undefined && firstCoord[1] !== undefined &&
                lastCoord[0] !== undefined && lastCoord[1] !== undefined &&
                firstCoord[0] === lastCoord[0] && 
                firstCoord[1] === lastCoord[1]
                ? coords.slice(0, -1) 
                : coords;
              
              return {
                ...feature,
                geometry: {
                  type: 'LineString' as const,
                  coordinates: lineCoords
                }
              };
            }
            if (feature.geometry.type === 'MultiPolygon') {
              const lineStrings = feature.geometry.coordinates.map(polygon => {
                const outerRing = polygon[0];
                if (!outerRing || outerRing.length === 0) {
                  return [];
                }
                const firstCoord = outerRing[0];
                const lastCoord = outerRing[outerRing.length - 1];
                if (outerRing.length > 1 && 
                    firstCoord && lastCoord &&
                    firstCoord[0] !== undefined && firstCoord[1] !== undefined &&
                    lastCoord[0] !== undefined && lastCoord[1] !== undefined &&
                    firstCoord[0] === lastCoord[0] && 
                    firstCoord[1] === lastCoord[1]) {
                  return outerRing.slice(0, -1);
                }
                return outerRing;
              });
              return {
                ...feature,
                geometry: {
                  type: 'MultiLineString' as const,
                  coordinates: lineStrings
                }
              };
            }
            return null;
          }).filter(f => f !== null);
          
          roadFeatures.push(...convertedPolygons);
        }

        if (roadFeatures.length === 0) {
          return;
        }

        // Manually create polylines to ensure they render as lines, not polygons
        // This is more reliable than L.geoJSON which might render closed LineStrings as polygons
        roadFeatures.forEach((feature) => {
          if (!feature.geometry) return;

          const highwayType = feature.properties?.highway;
          
          // Styling based on road importance - all roads are black, thickness varies by type
          let weight = 2;
          let opacity = 0.8;
          const roadColor = '#000000'; // Black for all roads

          if (highwayType === 'motorway' || highwayType === 'trunk') {
            weight = 4;
            opacity = 0.9;
          } else if (highwayType === 'primary') {
            weight = 3.5;
            opacity = 0.85;
          } else if (highwayType === 'secondary') {
            weight = 3;
            opacity = 0.8;
          } else if (highwayType === 'tertiary') {
            weight = 2.5;
            opacity = 0.75;
          } else if (highwayType === 'residential' || highwayType === 'unclassified') {
            weight = 2;
            opacity = 0.7;
          } else if (highwayType === 'service' || highwayType === 'track') {
            weight = 1.5;
            opacity = 0.6;
          } else {
            // Other road types (footway, path, etc.)
            weight = 1;
            opacity = 0.5;
          }

          if (feature.geometry.type === 'LineString') {
            const coords = feature.geometry.coordinates;
            // Convert GeoJSON coordinates [lng, lat] to Leaflet LatLng [lat, lng]
            // Validate coordinates before creating LatLng objects
            const points = (coords as number[][])
              .map(p => {
                if (p && Array.isArray(p) && p.length >= 2) {
                  const lng = p[0];
                  const lat = p[1];
                  if (lng !== undefined && lat !== undefined && isFinite(lng) && isFinite(lat)) {
                    try {
                      return L.latLng(lat, lng);
                    } catch (e) {
                      console.debug('Invalid coordinate in LineString:', p, e);
                      return null;
                    }
                  }
                }
                return null;
              })
              .filter((ll): ll is L.LatLng => ll !== null);
            
            if (points.length > 0) {
              const polyline = L.polyline(points, {
                color: roadColor,
                weight: weight,
                opacity: opacity,
                fill: false,
              });
              
              // Add popup if properties available
              if (feature.properties) {
                const props = feature.properties;
                let content = '<div><strong>Road</strong></div>';
                if (props.name) content += `<div>Name: ${props.name}</div>`;
                if (props.highway) content += `<div>Type: ${props.highway}</div>`;
                if (props.ref) content += `<div>Ref: ${props.ref}</div>`;
                polyline.bindPopup(content);
              }
              
              layerGroup.addLayer(polyline);
            }
          } else if (feature.geometry.type === 'MultiLineString') {
            // Handle MultiLineString - create a polyline for each line
            const multiCoords = feature.geometry.coordinates;
            (multiCoords as number[][][]).forEach(line => {
              // Validate coordinates before creating LatLng objects
              const points = line
                .map(p => {
                  if (p && Array.isArray(p) && p.length >= 2) {
                    const lng = p[0];
                    const lat = p[1];
                    if (lng !== undefined && lat !== undefined && isFinite(lng) && isFinite(lat)) {
                      try {
                        return L.latLng(lat, lng);
                      } catch (e) {
                        console.debug('Invalid coordinate in MultiLineString:', p, e);
                        return null;
                      }
                    }
                  }
                  return null;
                })
                .filter((ll): ll is L.LatLng => ll !== null);
              
              if (points.length > 0) {
                const polyline = L.polyline(points, {
                  color: roadColor,
                  weight: weight,
                  opacity: opacity,
                  fill: false,
                });
                
                // Add popup if properties available
                if (feature.properties) {
                  const props = feature.properties;
                  let content = '<div><strong>Road</strong></div>';
                  if (props.name) content += `<div>Name: ${props.name}</div>`;
                  if (props.highway) content += `<div>Type: ${props.highway}</div>`;
                  if (props.ref) content += `<div>Ref: ${props.ref}</div>`;
                  polyline.bindPopup(content);
                }
                
                layerGroup.addLayer(polyline);
              }
            });
          }
        });
        
      } catch (error) {
        console.error('RoadsLayer: Error rendering roads:', error);
        console.error('Error details:', error instanceof Error ? error.stack : error);
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
  }, [map, roads, visible, color]);

  return null;
}

