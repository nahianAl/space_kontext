'use client';

import { useState, useRef, useEffect } from 'react';
import { Map as LeafletMap } from 'leaflet';
import { Camera } from 'lucide-react';
import { SimpleMap, SunPathLayer, ClimatePanel, useSunPath } from '@/features/site-analysis';
import { StaticAnalysisMap } from '@/features/site-analysis/components/StaticAnalysisMap';
import { useMapStore } from '@/features/site-analysis/store/mapStore';
import { SiteAnalysisService } from '@/features/site-analysis/services/siteAnalysisService';
import { ElevationService } from '@/features/site-analysis/services/elevationService'; // Import ElevationService
import { OsmService } from '@/features/site-analysis/services/osmService'; // Import OsmService
import { formatArea, sqFeetToSqMeters } from '@/features/site-analysis/utils/areaCalculation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

export default function SiteAnalysisTab({ projectId }: { projectId: string }) {
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
    capturedImage,
    capturedBounds,
    setContours,
    setBuildings,
    setRoads
  } = useMapStore();


  // Fetch analysis data when captured bounds change (Static Analysis Mode)
  useEffect(() => {
    if (!capturedBounds) {return;}

    const fetchAnalysisData = async () => {
      // Convert Leaflet bounds [[S, W], [N, E]] to [S, W, N, E]
      const flatBounds: [number, number, number, number] = [
        capturedBounds[0][0],
        capturedBounds[0][1],
        capturedBounds[1][0],
        capturedBounds[1][1]
      ];

      // 1. Fetch Contours
      try {
        console.log('Fetching contours for captured bounds...');
        // Low resolution 10x10 to avoid rate limits
        const grid = await ElevationService.fetchElevationGrid(flatBounds, 10);
        const generatedContours = ElevationService.generateContours(grid, 2);
        setContours(generatedContours);
        console.log('Contours generated and saved to store');
      } catch (error) {
        console.error('Error fetching/generating contours:', error);
      }

      // 2. Fetch Buildings (OSM)
      try {
        console.log('Fetching context buildings...');
        const buildings = await OsmService.fetchBuildings(flatBounds);
        setBuildings(buildings);
        console.log('Buildings fetched and saved to store:', buildings.features.length);
      } catch (error) {
        console.error('Error fetching buildings:', error);
      }

      // 3. Fetch Roads (OSM)
      try {
        console.log('Fetching roads...');
        const roads = await OsmService.fetchRoads(flatBounds);
        setRoads(roads);
        console.log('Roads fetched and saved to store:', roads.features.length);
      } catch (error) {
        console.error('Error fetching roads:', error);
      }
    };

    fetchAnalysisData();
  }, [capturedBounds, setContours, setBuildings, setRoads]);

  // Sun path hook - only calculate if we have site coordinates
  const sunPath = useSunPath({
    latitude: siteCoordinates?.center.lat || center[0],
    longitude: siteCoordinates?.center.lng || center[1],
    date: sunPathDate,
    interval: 15, // 15 minute intervals
    includeNight: false,
  });

  // Load site data when component mounts or projectId changes
  useEffect(() => {
    if (projectId) {
      loadSiteData(projectId);
    }
  }, [projectId]);

  const loadSiteData = async (projId: string) => {
    try {
      if (!projId) {
        console.warn('No project ID provided for loading site data');
        return;
      }
      
      const siteAnalysis = await SiteAnalysisService.load(projId);
      if (siteAnalysis && siteAnalysis.coordinates) {
        setSiteCoordinates(siteAnalysis.coordinates);
        setSiteBoundary(siteAnalysis.boundary);
        // Use square feet if available, otherwise convert from square meters
        const areaSqFeet = siteAnalysis.coordinates.areaSqFeet 
          || (siteAnalysis.coordinates.areaSqMeters ? siteAnalysis.coordinates.areaSqMeters * 10.7639 : 0);
        setSiteArea(areaSqFeet);
        
        // Update map center to site location
        if (siteAnalysis.coordinates.center) {
          setCenter([siteAnalysis.coordinates.center.lat, siteAnalysis.coordinates.center.lng]);
        }
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        // This is expected if no site data exists yet for this project.
        console.log(`No site analysis data found for project ${projId}. This is normal for new projects.`);
      } else {
        console.error('Failed to load site data:', error);
      }
    }
  };
  
  // Handle map ready
  const handleMapReady = (map: LeafletMap) => {
    mapRef.current = map;
  };
  
  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {return;}
    
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
          // Update store
          const { setCenter, setZoom } = useMapStore.getState();
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
          // Update store
          const { setCenter, setZoom } = useMapStore.getState();
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
    console.log('🔘 [SiteAnalysisTab] Capture button clicked', {
      hasCaptureFunction: !!captureImageRef.current,
      hasMap: !!mapRef.current,
    });
    
    if (!captureImageRef.current || !mapRef.current) {
      console.error('❌ [SiteAnalysisTab] Capture function or map not available', {
        hasCaptureFunction: !!captureImageRef.current,
        hasMap: !!mapRef.current,
      });
      alert('Map not ready. Please wait for the map to load completely.');
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

      console.log('📐 [SiteAnalysisTab] Getting map bounds', boundsArray);

      // 2. Capture the image
      console.log('📸 [SiteAnalysisTab] Starting image capture...');
      const imageUrl = await captureImageRef.current();
      
      if (!imageUrl) {
        throw new Error('Image capture returned empty result');
      }
      
      console.log('📸 [SiteAnalysisTab] Image captured successfully', {
        imageUrlLength: imageUrl.length,
        isDataURL: imageUrl.startsWith('data:'),
        boundsArray,
      });
      
      // 3. Save to store to switch view
      console.log('💾 [SiteAnalysisTab] Storing data in mapStore...');
      
      // Store bounds first (small data, can be persisted)
      setCapturedBounds(boundsArray);
      
      // Store image (large data, kept in memory only - not persisted to localStorage)
      // Note: This will be lost on page refresh due to localStorage quota limits
      try {
        setCapturedImage(imageUrl);
        console.log('✅ [SiteAnalysisTab] Image stored in memory (not persisted due to size)');
      } catch (error) {
        console.error('❌ [SiteAnalysisTab] Failed to store image:', error);
        // Continue anyway - bounds are stored
      }
      
      // Wait a moment for store to update, then verify
      setTimeout(() => {
        const storeState = useMapStore.getState();
        console.log('✅ [SiteAnalysisTab] Data stored in mapStore (verified)', {
          hasCapturedImage: !!storeState.capturedImage,
          hasCapturedBounds: !!storeState.capturedBounds,
          capturedImageLength: storeState.capturedImage?.length || 0,
          capturedBounds: storeState.capturedBounds,
          note: 'Image is in memory only (not persisted to localStorage due to size)',
        });
        
        if (!storeState.capturedImage || !storeState.capturedBounds) {
          console.error('❌ [SiteAnalysisTab] WARNING: Data was not stored correctly!');
        }
      }, 100);
      
    } catch (error) {
      console.error('❌ [SiteAnalysisTab] Error capturing image:', error);
      alert(`Failed to capture image: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      if (!feature) {
        console.error('No feature found in boundary');
        return;
      }
      if (feature.geometry.type !== 'Polygon') {
        console.error('Expected polygon geometry, got:', feature.geometry.type);
        return;
      }

      // Calculate center from polygon coordinates
      if (feature.geometry.type !== 'Polygon') {
        return;
      }
      const coordinates = feature.geometry.coordinates[0];
      if (!coordinates || coordinates.length === 0) {
        console.error('Polygon has no coordinates');
        return;
      }
      const latSum = coordinates.reduce((sum, coord) => sum + (coord?.[1] ?? 0), 0);
      const lngSum = coordinates.reduce((sum, coord) => sum + (coord?.[0] ?? 0), 0);
      const center = {
        lat: latSum / coordinates.length,
        lng: lngSum / coordinates.length,
      };

      // Calculate approximate scale (1 pixel = ? meters)
      // This is a rough estimate based on zoom level and latitude
      const zoomLevel = mapRef.current?.getZoom() || 13;
      const metersPerPixel = (156543.03392 * Math.cos(center.lat * Math.PI / 180)) / Math.pow(2, zoomLevel);

      // Convert square feet to square meters for compatibility
      const areaSqMeters = sqFeetToSqMeters(areaSqFeet);

      console.log('Calculated site data:', {
        areaSqFeet,
        areaSqMeters,
        center,
        coordinatesCount: coordinates.length
      });

      const siteCoords = {
        center,
        boundary: feature.geometry,
        areaSqFeet,
        areaSqMeters,
        scale: metersPerPixel,
        rotation: 0, // Default rotation
      };

      // Update local store
      console.log('Updating store with area:', areaSqFeet);
      setSiteCoordinates(siteCoords);
      setSiteBoundary(boundary);
      setSiteArea(areaSqFeet);

      // Save to database
      try {
        await SiteAnalysisService.save({
          projectId,
          coordinates: siteCoords,
          boundary,
        });
        console.log('Site data saved successfully');
      } catch (error) {
        console.error('Failed to save site data:', error);
        // Don't show alert for auto-save failures, just log
      }
    } catch (error) {
      console.error('Error processing boundary:', error);
    }
  };

  return (
    <div className="h-full flex">
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
                console.log('✅ [SiteAnalysisTab] Capture function received from SimpleMap', {
                  hasFunction: !!captureFn,
                });
              }}
            />
            {/* Sun Path Layer - Only render in static view, not in interactive map */}
          </>
        )}
      </div>

      {/* Right Panel - Tools & Info */}
      <div className="w-80 flex-shrink-0 overflow-y-auto border-l bg-background">
        <div className="p-6 space-y-6">
          {/* Search Location - only show if not captured */}
          {!capturedImage && (
            <Card>
              <CardHeader>
                <CardTitle>Search Location</CardTitle>
                <CardDescription>
                  Enter coordinates or address
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="search">Location</Label>
                  <Input
                    id="search"
                    placeholder="40.7128, -74.0060 or address"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleSearch}
                  disabled={isSearching}
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
                {siteCoordinates ? 'Your site details' : 'No site selected'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {siteCoordinates ? (
                <>
                  <div>
                    <Label className="text-sm font-medium">Area</Label>
                    <p className="text-2xl font-bold text-architectural-blue">
                      {siteArea ? formatArea(siteArea) : '0.00 sq ft'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Center</Label>
                    <p className="text-sm text-muted-foreground">
                      {siteCoordinates.center.lat.toFixed(6)}, {siteCoordinates.center.lng.toFixed(6)}
                    </p>
                  </div>
                  
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
                        title={!captureImageRef.current ? 'Waiting for map to load...' : 'Capture the current map view as an image'}
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        {isCapturing ? 'Capturing...' : 'Capture & Analyze'}
                      </Button>
                      {!captureImageRef.current && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Waiting for map to be ready...
                        </p>
                      )}
                    </>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Draw a site boundary to see information
                </p>
              )}
            </CardContent>
          </Card>

          {/* Site Boundary Tools - only show if not captured */}
          {!capturedImage && (
            <Card>
              <CardHeader>
                <CardTitle>Site Boundary</CardTitle>
                <CardDescription>
                  Use the drawing tools on the map to create your site boundary
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 p-3 bg-muted rounded-md">
                  <p className="text-sm font-medium">Instructions:</p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Click the polygon tool in the top-right corner of the map</li>
                    <li>Click on the map to add points to your boundary</li>
                    <li>Press <kbd className="px-1.5 py-0.5 bg-background border rounded text-xs font-mono">Enter</kbd> or click the first point to finish</li>
                    <li>Click "Capture & Analyze" when ready</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2">
                    <strong>Tip:</strong> The site is automatically saved when you finish drawing.
                  </p>
                </div>
                {siteBoundary && siteBoundary.features.length > 0 && (
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={async () => {
                      clearSiteBoundary();
                      setSiteCoordinates(null);
                      setSiteArea(0);
                    }}
                  >
                    Clear Boundary
                  </Button>
                )}
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
  );
}
