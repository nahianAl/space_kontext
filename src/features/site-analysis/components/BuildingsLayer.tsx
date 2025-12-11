'use client';

import { useEffect, useRef } from 'react';
import { useMapStore } from '../store/mapStore';
import type { Feature, FeatureCollection, Geometry } from 'geojson';

interface BuildingsLayerProps {
  map: L.Map | null;
  visible?: boolean;
  color?: string;
}

export function BuildingsLayer({
  map,
  visible = true,
  color = '#555555',
}: BuildingsLayerProps) {
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const { buildings } = useMapStore();

  useEffect(() => {
    // Cleanup if map/data/visibility invalid
    if (!map || !buildings || !visible) {
      if (layerGroupRef.current) {
        try {
          if (map && typeof map.hasLayer === 'function' && map.hasLayer(layerGroupRef.current)) {
             map.removeLayer(layerGroupRef.current);
          }
        } catch (e) {
          console.debug('Error removing buildings layer:', e);
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

      if (!buildings.features || buildings.features.length === 0) {return;}

      try {
        // Use L.geoJSON for buildings as it handles polygons/multipolygons well
        const geoJsonLayer = L.geoJSON(buildings, {
          style: {
            color: color,
            weight: 1,
            fillColor: '#888888',
            fillOpacity: 0.5,
            // renderer: L.canvas() // Let it inherit map renderer
          },
          onEachFeature: (feature, layer) => {
            // Add popup with tags if available
            if (feature.properties) {
              const props = feature.properties;
              let content = '<div><strong>Building</strong></div>';
              if (props.name) {content += `<div>Name: ${props.name}</div>`;}
              if (props['addr:street']) {content += `<div>Address: ${props['addr:housenumber'] || ''} ${props['addr:street']}</div>`;}
              if (props.levels) {content += `<div>Levels: ${props.levels}</div>`;}
              
              layer.bindPopup(content);
            }
          }
        });
        
        layerGroup.addLayer(geoJsonLayer);
        
      } catch (error) {
        console.warn('Error rendering buildings:', error);
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
  }, [map, buildings, visible, color]);

  return null;
}

