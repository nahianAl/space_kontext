'use client';

import { useEffect, useRef } from 'react';
import { useMapStore } from '../store/mapStore';
import type { Position } from 'geojson';

interface ContoursLayerProps {
  map: L.Map | null;
  visible?: boolean;
  color?: string;
}

export function ContoursLayer({
  map,
  visible = true,
  color = '#8B4513', // SaddleBrown
}: ContoursLayerProps) {
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const { contours } = useMapStore();

  useEffect(() => {
    // Cleanup if map/data/visibility invalid
    if (!map || !contours || !visible) {
      if (layerGroupRef.current) {
        try {
          if (map && typeof map.hasLayer === 'function' && map.hasLayer(layerGroupRef.current)) {
             map.removeLayer(layerGroupRef.current);
          }
        } catch (e) {
          console.debug('Error removing contour layer:', e);
        }
        layerGroupRef.current = null;
      }
      return;
    }

    const renderLayer = async () => {
      if (!map || !map.getContainer()) {return;}

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

      if (!contours.features || contours.features.length === 0) {return;}

      try {
        // Manually iterate features to avoid L.geoJSON complexities
        contours.features.forEach((feature) => {
          if (!feature.geometry) {return;}

          // const elevation = feature.properties?.elevation; // Unused when tooltips disabled
          
          if (feature.geometry.type === 'LineString') {
            const coords = feature.geometry.coordinates;
            // Validate and convert coordinates
            const points = (coords as Position[])
              .map(p => {
                if (p && Array.isArray(p) && p.length >= 2) {
                  const lng = p[0];
                  const lat = p[1];
                  if (lng !== undefined && lat !== undefined && isFinite(lng) && isFinite(lat)) {
                    try {
                      return L.latLng(lat, lng); // GeoJSON is [lng, lat]
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
                color,
                weight: 1,
                opacity: 0.6,
                // Let it inherit map renderer (Canvas)
              });
              // Tooltips disabled to prevent rendering crashes
              /*
              if (elevation !== undefined) {
                polyline.bindTooltip(`${elevation}m`, {
                  permanent: false,
                  direction: 'center',
                  className: 'contour-label',
                  sticky: true
                });
              }
              */
              layerGroup.addLayer(polyline);
            }
          } else if (feature.geometry.type === 'MultiLineString') {
            const multiCoords = feature.geometry.coordinates;
            (multiCoords as Position[][]).forEach(line => {
              // Validate and convert coordinates
              const points = line
                .map(p => {
                  if (p && Array.isArray(p) && p.length >= 2) {
                    const lng = p[0];
                    const lat = p[1];
                    if (lng !== undefined && lat !== undefined && isFinite(lng) && isFinite(lat)) {
                      try {
                        return L.latLng(lat, lng); // GeoJSON is [lng, lat]
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
                  color,
                  weight: 1,
                  opacity: 0.6,
                  // Let it inherit map renderer (Canvas)
                });
                // Tooltips disabled to prevent rendering crashes
                /*
                if (elevation !== undefined) {
                  polyline.bindTooltip(`${elevation}m`, {
                    permanent: false,
                    direction: 'center',
                    className: 'contour-label',
                    sticky: true
                  });
                }
                */
                layerGroup.addLayer(polyline);
              }
            });
          }
        });
      } catch (error) {
        console.warn('Error manually rendering contours:', error);
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
  }, [map, contours, visible, color]);

  return null;
}
