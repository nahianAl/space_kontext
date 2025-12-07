'use client';

import { useState, useRef, useEffect } from 'react';
import { Map as LeafletMap } from 'leaflet';
import { Camera } from 'lucide-react';
import { SimpleMap, SunPathLayer, ClimatePanel, useSunPath } from '@/features/site-analysis';
import { StaticAnalysisMap } from '@/features/site-analysis/components/StaticAnalysisMap';
import { useMapStore } from '@/features/site-analysis/store/mapStore';
import { SiteAnalysisService } from '@/features/site-analysis/services/siteAnalysisService';
import { formatArea, sqFeetToSqMeters } from '@/features/site-analysis/utils/areaCalculation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

export default function SiteAnalysisPage() {
  const mapRef = useRef<LeafletMap | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [sunPathDate, setSunPathDate] = useState<Date>(new Date());
  const [isCapturing, setIsCapturing] = useState(false);
  const captureImageRef = useRef<(() => Promise<string>) | null>(null);

  const {
    center,
    zoom,
    siteBoundary,
    siteArea,
    siteCoordinates,
    layerVisibility,
    toggleLayer,
    clearSiteBoundary,
    setSiteBoundary,
    setSiteArea,
    setSiteCoordinates,
    setCenter,
    setZoom,
    setCapturedImage,
    setCapturedBounds,
    capturedImage
  } = useMapStore();

  // Sun path hook
  const sunPath = useSunPath({
    latitude: siteCoordinates?.center.lat || center[0],
    longitude: siteCoordinates?.center.lng || center[1],
    date: sunPathDate,
    interval: 15,
    includeNight: false,
  });


  // Handle map ready
  const handleMapReady = (map: LeafletMap) => {
    mapRef.current = map;
  };

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      return;
    }

    setIsSearching(true);
    try {
      // Check if input is coordinates (lat, lng format)
      const coordMatch = searchQuery.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);

      if (coordMatch && coordMatch[1] && coordMatch[2]) {
        // Handle coordinate input
        const lat = parseFloat(coordMatch[1]);
        const lng = parseFloat(coordMatch[2]);

        // Validate coordinates
        if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          if (mapRef.current) {
            mapRef.current.setView([lat, lng], 16);
          }
          setCenter([lat, lng]);
          setZoom(16);
        } else {
          alert('Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180.');
        }
      } else {
        // Handle address/place name input using Nominatim
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&addressdetails=1`
        );

        if (!response.ok) {
          throw new Error('Geocoding service unavailable');
        }

        const results = await response.json();

        if (results.length > 0) {
          const location = results[0];
          const lat = parseFloat(location.lat);
          const lng = parseFloat(location.lon);

          if (mapRef.current) {
            mapRef.current.setView([lat, lng], 16);
          }
          setCenter([lat, lng]);
          setZoom(16);
        } else {
          alert('Location not found. Try a different search term or use coordinates.');
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Handle capture image button click
  const handleCaptureImage = async () => {
    if (!captureImageRef.current || !mapRef.current) {
      console.error('Capture function or map not available');
      return;
    }
    
    setIsCapturing(true);
    try {
      // 1. Get current bounds BEFORE capture to preserve geospatial context
      const bounds = mapRef.current.getBounds();
      const boundsArray: [[number, number], [number, number]] = [
        [bounds.getSouth(), bounds.getWest()],
        [bounds.getNorth(), bounds.getEast()]
      ];

      // 2. Capture the image
      const imageUrl = await captureImageRef.current();
      
      // 3. Save to store to switch view
      setCapturedBounds(boundsArray);
      setCapturedImage(imageUrl);

      // Optional: Allow downloading as well
      // const link = document.createElement('a');
      // link.href = imageUrl;
      // link.download = `site-map-${new Date().toISOString().split('T')[0]}-${Date.now()}.png`;
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
    } catch (error) {
      console.error('Error capturing image:', error);
      alert('Failed to capture image. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  // Handle boundary drawn/edited/deleted from Leaflet.draw
  const handleBoundaryDrawn = async (
    boundary: GeoJSON.FeatureCollection,
    areaSqFeet: number
  ) => {
    console.log('handleBoundaryDrawn called:', {
      featuresCount: boundary.features.length,
      areaSqFeet,
      boundary
    });

    if (!boundary.features.length) {
      // Boundary was deleted
      clearSiteBoundary();
      setSiteCoordinates(null);
      setSiteArea(0);
      return;
    }

    try {
      // Get the polygon from the first feature
      const feature = boundary.features[0];
      if (!feature || feature.geometry.type !== 'Polygon') {
        console.error('Expected polygon geometry, got:', feature?.geometry?.type);
        return;
      }

      // Calculate center from polygon coordinates
      const coordinates = feature.geometry.coordinates?.[0];
      if (!coordinates || coordinates.length === 0) {
        console.error('Invalid polygon coordinates');
        return;
      }
      
      const latSum = coordinates.reduce((sum, coord) => sum + (coord[1] || 0), 0);
      const lngSum = coordinates.reduce((sum, coord) => sum + (coord[0] || 0), 0);
      const center = {
        lat: latSum / coordinates.length,
        lng: lngSum / coordinates.length,
      };

      // Calculate approximate scale (1 pixel = ? meters)
      const zoomLevel = mapRef.current?.getZoom() || 13;
      const metersPerPixel = (156543.03392 * Math.cos(center.lat * Math.PI / 180)) / Math.pow(2, zoomLevel);

      // Convert square feet to square meters for compatibility
      const areaSqMeters = sqFeetToSqMeters(areaSqFeet);

      const siteCoords = {
        center,
        boundary: feature.geometry,
        areaSqFeet,
        areaSqMeters,
        scale: metersPerPixel,
        rotation: 0,
      };

      // Update local store
      setSiteCoordinates(siteCoords);
      setSiteBoundary(boundary);
      setSiteArea(areaSqFeet);
    } catch (error) {
      console.error('Error processing boundary:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-architectural-blue">
                Site Analysis
              </h1>
              <p className="text-muted-foreground">
                Analyze your site with geospatial data and context
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                {center[0].toFixed(6)}, {center[1].toFixed(6)}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Map */}
        <div className="flex-1 relative">
          {capturedImage ? (
            <>
              <StaticAnalysisMap
                height="100%"
                className="rounded-lg"
                sunPath={sunPath?.sunPath || null}
              />
              <div className="absolute top-4 left-4 z-[1000]">
                <Button 
                  variant="secondary"
                  onClick={() => {
                    setCapturedImage(null);
                    setCapturedBounds(null);
                  }}
                >
                  Return to Interactive Map
                </Button>
              </div>
            </>
          ) : (
            <>
            <SimpleMap
              height="100%"
              className="rounded-lg"
              center={center}
              zoom={zoom}
              onMapReady={handleMapReady}
              onBoundaryDrawn={handleBoundaryDrawn}
              enableDrawing={true}
              existingBoundary={siteBoundary}
                onCaptureImage={(captureFn) => {
                  captureImageRef.current = captureFn;
                }}
              />
              {/* Sun Path Layer - Only render in static view, not in interactive map */}
            </>
          )}
        </div>

        {/* Right Panel - Controls */}
        <div className="w-80 border-l border-border bg-background overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Search - only show if not captured */}
            {!capturedImage && (
            <Card>
              <CardHeader>
                <CardTitle>Search Location</CardTitle>
                <CardDescription>
                  Enter an address, place name, or coordinates (lat, lng)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="search-input">Location</Label>
                  <Input
                    id="search-input"
                    placeholder="e.g., 'New York' or '40.7128, -74.0060'"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={isSearching || !searchQuery.trim()}
                  className="w-full"
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </Button>
              </CardContent>
            </Card>
            )}

            {/* Site Information */}
            <Card>
              <CardHeader>
                <CardTitle>Site Information</CardTitle>
                <CardDescription>
                  {siteBoundary ? 'Site boundary defined' : 'Draw a boundary to start'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {siteBoundary ? (
                  <>
                    <div>
                      <Label className="text-sm font-medium">Area</Label>
                      <p className="text-2xl font-bold text-architectural-blue">
                        {siteArea ? formatArea(siteArea) : '0.00 sq ft'}
                      </p>
                    </div>
                    {siteCoordinates && (
                      <div>
                        <Label className="text-sm font-medium">Center</Label>
                        <p className="text-sm text-muted-foreground font-mono">
                          {siteCoordinates.center.lat.toFixed(6)}, {siteCoordinates.center.lng.toFixed(6)}
                        </p>
                      </div>
                    )}
                    
                    {!capturedImage && (
                      <>
                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={() => {
                            clearSiteBoundary();
                            setSiteCoordinates(null);
                          }}
                        >
                          Clear Site
                        </Button>
                        <Button 
                          variant="default"
                          className="w-full bg-architectural-blue hover:bg-architectural-blue/90"
                          onClick={handleCaptureImage}
                          disabled={isCapturing || !captureImageRef.current}
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          {isCapturing ? 'Capturing...' : 'Capture & Analyze'}
                        </Button>
                      </>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Use the drawing tools to define your site boundary
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Drawing Instructions - only show if not captured */}
            {!capturedImage && (
              <Card>
                <CardHeader>
                  <CardTitle>Site Boundary</CardTitle>
                  <CardDescription>
                    Use the drawing tools on the map
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 p-3 bg-muted rounded-md">
                    <p className="text-sm font-medium">Instructions:</p>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Click the polygon tool in the top-right</li>
                      <li>Click on the map to add boundary points</li>
                      <li>Press <kbd className="px-1.5 py-0.5 bg-background border rounded text-xs font-mono">Enter</kbd> or click first point to finish</li>
                      <li>Click &quot;Capture &amp; Analyze&quot; when ready</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Climate Data */}
            {siteCoordinates && (
              <ClimatePanel />
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
