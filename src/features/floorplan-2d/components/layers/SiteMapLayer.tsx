/**
 * Site Map Layer component for displaying the captured site analysis map
 * Converts geographic coordinates (lat/lng) to canvas pixels (100px = 1ft)
 * Renders the map image as a background reference layer
 */
'use client';

import React, { useEffect, useState } from 'react';
import { Image as KonvaImage, Text } from 'react-konva';
import { useMapStore } from '@/features/site-analysis/store/mapStore';
import { useSiteLayoutStore } from '../../store/siteLayoutStore';

// Constants for coordinate conversion
const METERS_PER_DEGREE_LAT = 111320; // Approximately constant
const METERS_TO_FEET = 3.28084;
const FEET_TO_PIXELS = 100; // 100px = 1ft

/**
 * Convert latitude to meters (relative to a center point)
 */
function latToMeters(lat: number, centerLat: number): number {
  return (lat - centerLat) * METERS_PER_DEGREE_LAT;
}

/**
 * Convert longitude to meters (relative to a center point)
 */
function lngToMeters(lng: number, centerLng: number, centerLat: number): number {
  return (lng - centerLng) * METERS_PER_DEGREE_LAT * Math.cos(centerLat * Math.PI / 180);
}

/**
 * Convert meters to canvas pixels (100px = 1ft)
 */
function metersToPixels(meters: number): number {
  const feet = meters * METERS_TO_FEET;
  return feet * FEET_TO_PIXELS;
}

/**
 * Convert lat/lng bounds to canvas pixel bounds
 * Uses the image's actual pixel dimensions and geographic bounds to calculate proper scale
 * Positions image so its center aligns with the site center (canvas 0,0)
 * Returns position and size in canvas pixels (100px = 1ft)
 */
function convertBoundsToPixels(
  bounds: [[number, number], [number, number]],
  centerLat: number,
  centerLng: number,
  imageWidth: number,
  imageHeight: number
): { x: number; y: number; width: number; height: number } {
  const [[south, west], [north, east]] = bounds;
  
  // Calculate geographic extent in meters
  const latSpanMeters = latToMeters(north, south); // Always positive (north > south)
  const lngSpanMeters = lngToMeters(east, west, centerLat); // Always positive (east > west)
  
  // Calculate meters per pixel in the captured image
  const metersPerPixelX = lngSpanMeters / imageWidth;
  const metersPerPixelY = latSpanMeters / imageHeight;
  
  // Convert to canvas pixels: meters → feet → pixels (100px = 1ft)
  const canvasPixelsPerMeter = METERS_TO_FEET * FEET_TO_PIXELS; // 328.084 pixels per meter
  
  // Calculate canvas dimensions (maintain aspect ratio)
  const canvasWidth = lngSpanMeters * canvasPixelsPerMeter;
  const canvasHeight = latSpanMeters * canvasPixelsPerMeter;
  
  // Calculate position: center the image at (0,0) which represents the site center
  // The image bounds are relative to the center
  const westMeters = lngToMeters(west, centerLng, centerLat);
  const eastMeters = lngToMeters(east, centerLng, centerLat);
  const northMeters = latToMeters(north, centerLat);
  const southMeters = latToMeters(south, centerLat);
  
  // Convert to canvas pixels
  const westPixels = westMeters * canvasPixelsPerMeter;
  const eastPixels = eastMeters * canvasPixelsPerMeter;
  const northPixels = northMeters * canvasPixelsPerMeter;
  const southPixels = southMeters * canvasPixelsPerMeter;
  
  // Position: top-left corner of the image
  // Canvas Y increases downward, so north (up) should be negative Y
  const x = westPixels;
  const y = -northPixels; // Invert because canvas Y increases down
  const width = eastPixels - westPixels;
  const height = northPixels - southPixels; // Always positive
  
  return { x, y, width, height };
}

export const SiteMapLayer: React.FC = () => {
  const isSiteLayoutVisible = useSiteLayoutStore((state) => state.isSiteLayoutVisible);
  
  // Subscribe to store values - use individual selectors to ensure reactivity
  const capturedImage = useMapStore((state) => state.capturedImage);
  const capturedBounds = useMapStore((state) => state.capturedBounds);
  const siteCoordinates = useMapStore((state) => state.siteCoordinates);
  
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageBounds, setImageBounds] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  
  // Also check store directly as fallback (in case of subscription timing issues)
  const getStoreData = () => {
    const storeState = useMapStore.getState();
    return {
      capturedImage: storeState.capturedImage,
      capturedBounds: storeState.capturedBounds,
      siteCoordinates: storeState.siteCoordinates,
    };
  };

  // Debug logging - also check store directly
  useEffect(() => {
    if (isSiteLayoutVisible) {
      // Check store directly to see if data exists (in case of timing issues)
      const storeState = useMapStore.getState();
      const directCapturedImage = storeState.capturedImage;
      const directCapturedBounds = storeState.capturedBounds;
      
      // Also check localStorage directly to see if data was persisted
      let persistedData = null;
      try {
        const stored = localStorage.getItem('map-store');
        if (stored) {
          persistedData = JSON.parse(stored);
        }
      } catch (e) {
        console.error('Failed to read localStorage:', e);
      }
      
      console.log('🗺️ [SiteMapLayer] Visibility toggled ON', {
        hasCapturedImage: !!capturedImage,
        hasCapturedBounds: !!capturedBounds,
        hasSiteCoordinates: !!siteCoordinates,
        siteCoordinatesCenter: siteCoordinates?.center,
        capturedBounds,
        // Check store directly
        storeCapturedImage: !!directCapturedImage,
        storeCapturedBounds: !!directCapturedBounds,
        directCapturedImageLength: directCapturedImage?.length || 0,
        capturedImageLength: capturedImage?.length || 0,
        // Check localStorage
        persistedHasImage: !!persistedData?.state?.capturedImage,
        persistedHasBounds: !!persistedData?.state?.capturedBounds,
        persistedImageLength: persistedData?.state?.capturedImage?.length || 0,
        fullStoreState: {
          capturedImage: directCapturedImage ? `[${directCapturedImage.length} chars]` : null,
          capturedBounds: directCapturedBounds,
          siteCoordinates: storeState.siteCoordinates,
        },
      });
      
      // If data is missing, log a helpful message
      if ((!capturedImage && !directCapturedImage) || (!capturedBounds && !directCapturedBounds)) {
        console.warn('⚠️ [SiteMapLayer] Missing required data. Steps to fix:');
        console.warn('1. Go to Site Analysis tab');
        console.warn('2. Draw your site boundary (polygon)');
        console.warn('3. Click "Capture & Analyze" button (this captures the map image)');
        console.warn('4. Return to Floorplan 2D tab and toggle Site Layout');
        console.warn('💡 Make sure you see "✅ [SiteAnalysisTab] Data stored in mapStore" in console after clicking Capture & Analyze');
      }
    }
  }, [isSiteLayoutVisible, capturedImage, capturedBounds, siteCoordinates]);

  // Load image when capturedImage changes - also check store directly as fallback
  useEffect(() => {
    if (!isSiteLayoutVisible) {
      setImage(null);
      setImageBounds(null);
      return;
    }
    
    // Use capturedImage from hook, or fallback to direct store access
    const imageToUse = capturedImage || getStoreData().capturedImage;
    
    if (!imageToUse) {
      setImage(null);
      setImageBounds(null);
      return;
    }

    console.log('🖼️ [SiteMapLayer] Loading image...', {
      imageLength: imageToUse.length,
      isDataURL: imageToUse.startsWith('data:'),
      source: capturedImage ? 'hook' : 'direct-store',
    });

    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      console.log('✅ [SiteMapLayer] Image loaded successfully', {
        width: img.width,
        height: img.height,
      });
      setImage(img);
    };
    img.onerror = (error) => {
      console.error('❌ [SiteMapLayer] Failed to load site map image:', error);
      setImage(null);
    };
    img.src = imageToUse;
  }, [capturedImage, isSiteLayoutVisible]);

  // Calculate bounds when image and bounds are available - also check store directly as fallback
  useEffect(() => {
    if (!isSiteLayoutVisible || !image) {
      setImageBounds(null);
      return;
    }
    
    // Use values from hook, or fallback to direct store access
    const storeData = getStoreData();
    const boundsToUse = capturedBounds || storeData.capturedBounds;
    const coordsToUse = siteCoordinates || storeData.siteCoordinates;
    
    if (!boundsToUse || !coordsToUse?.center) {
      if (isSiteLayoutVisible) {
        console.log('⚠️ [SiteMapLayer] Missing data for bounds calculation', {
          hasImage: !!image,
          hasCapturedBounds: !!boundsToUse,
          hasSiteCoordinates: !!coordsToUse,
          hasCenter: !!coordsToUse?.center,
          source: capturedBounds ? 'hook' : 'direct-store',
        });
      }
      setImageBounds(null);
      return;
    }

    const { center } = coordsToUse;
    const bounds = convertBoundsToPixels(
      boundsToUse, 
      center.lat, 
      center.lng,
      image.width,
      image.height
    );
    
    console.log('📐 [SiteMapLayer] Calculated bounds', {
      bounds,
      center,
      capturedBounds: boundsToUse,
      imageSize: { width: image.width, height: image.height },
    });
    
    setImageBounds(bounds);
  }, [image, capturedBounds, siteCoordinates, isSiteLayoutVisible]);

  if (!isSiteLayoutVisible) {
    return null;
  }

  // Show helpful message if data is missing - also check store directly as fallback
  const storeData = getStoreData();
  const imageToUse = capturedImage || storeData.capturedImage;
  const boundsToUse = capturedBounds || storeData.capturedBounds;
  
  if (!imageToUse || !boundsToUse) {
    return (
      <>
        <Text
          x={-250}
          y={-30}
          text="⚠️ No site map available"
          fontSize={16}
          fill="#ffaa00"
          fontStyle="bold"
          listening={false}
        />
        <Text
          x={-300}
          y={-10}
          text="1. Go to Site Analysis tab"
          fontSize={12}
          fill="#ffffff"
          listening={false}
        />
        <Text
          x={-300}
          y={5}
          text="2. Draw boundary, then click 'Capture & Analyze'"
          fontSize={12}
          fill="#ffffff"
          listening={false}
        />
        <Text
          x={-300}
          y={20}
          text="3. Return here and toggle Site Layout"
          fontSize={12}
          fill="#ffffff"
          listening={false}
        />
      </>
    );
  }

  if (!image) {
    return (
      <Text
        x={-100}
        y={-10}
        text="Loading site map..."
        fontSize={14}
        fill="#ffffff"
        listening={false}
      />
    );
  }

  if (!imageBounds) {
    return (
      <Text
        x={-150}
        y={-10}
        text="Calculating site map position..."
        fontSize={14}
        fill="#ffffff"
        listening={false}
      />
    );
  }

  return (
    <KonvaImage
      image={image}
      x={imageBounds.x}
      y={imageBounds.y}
      width={imageBounds.width}
      height={imageBounds.height}
      opacity={0.5} // Semi-transparent so it doesn't obscure the floorplan
      listening={false} // Don't capture mouse events
    />
  );
};

