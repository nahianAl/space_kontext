/**
 * Climate Panel Component
 * Displays climate data including temperature, precipitation, wind, and sunshine
 */
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { useClimate } from '../hooks/useClimate';
import { useMapStore } from '../store/mapStore';
import { useEffect, useRef } from 'react';
import { Loader2, RefreshCw, Thermometer, Droplets, Wind, Sun } from 'lucide-react';

export function ClimatePanel() {
  const { climate, classification, isLoading, error, fetchClimate } = useClimate({ autoFetch: false });
  const { capturedImage, siteCoordinates } = useMapStore();
  const hasFetchedAfterCaptureRef = useRef(false);

  // Auto-fetch when image is captured
  useEffect(() => {
    if (capturedImage && siteCoordinates?.center && !hasFetchedAfterCaptureRef.current) {
      hasFetchedAfterCaptureRef.current = true;
      fetchClimate();
    }
    // Reset ref when image is cleared
    if (!capturedImage) {
      hasFetchedAfterCaptureRef.current = false;
    }
  }, [capturedImage, siteCoordinates?.center?.lat, siteCoordinates?.center?.lng, fetchClimate]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Climate Data</CardTitle>
          <CardDescription>Loading climate information...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Climate Data</CardTitle>
          <CardDescription>Error loading climate information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-destructive">{error}</p>
            <Button onClick={fetchClimate} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!climate) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Climate Data</CardTitle>
          <CardDescription>No climate data available</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={fetchClimate} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Load Climate Data
          </Button>
        </CardContent>
      </Card>
    );
  }

  const formatTemperature = (temp: number): string => {
    return `${temp.toFixed(1)}°C (${((temp * 9) / 5 + 32).toFixed(1)}°F)`;
  };

  const formatPrecipitation = (mm: number): string => {
    return `${mm.toFixed(1)} mm (${(mm * 0.0393701).toFixed(2)} in)`;
  };

  const formatWindSpeed = (kmh: number): string => {
    return `${kmh.toFixed(1)} km/h (${(kmh * 0.621371).toFixed(1)} mph)`;
  };

  const getWindDirectionName = (degrees: number): string => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index] || 'N';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Climate Data</CardTitle>
            <CardDescription>
              Past year climate data (1-year averages)
              {classification && (
                <span className="ml-2 text-xs font-medium text-muted-foreground">
                  {classification} Climate
                </span>
              )}
            </CardDescription>
          </div>
          <Button onClick={fetchClimate} variant="ghost" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Temperature */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm">Temperature</h3>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Daily Min</p>
              <p className="font-medium">{formatTemperature(climate.temperature.daily.min)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Daily Max</p>
              <p className="font-medium">{formatTemperature(climate.temperature.daily.max)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Daily Mean</p>
              <p className="font-medium">{formatTemperature(climate.temperature.daily.mean)}</p>
            </div>
          </div>
        </div>

        {/* Precipitation */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm">Precipitation</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Daily Average</p>
              <p className="font-medium">{formatPrecipitation(climate.precipitation.daily)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Annual Total</p>
              <p className="font-medium">{formatPrecipitation(climate.precipitation.annual)}</p>
            </div>
          </div>
        </div>

        {/* Wind */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm">Wind</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Average Speed</p>
              <p className="font-medium">
                {climate.wind.speed > 0 
                  ? formatWindSpeed(climate.wind.speed)
                  : <span className="text-muted-foreground">Not available</span>
                }
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Prevailing Direction</p>
              <p className="font-medium">
                {climate.wind.direction > 0
                  ? `${getWindDirectionName(climate.wind.direction)} (${climate.wind.direction.toFixed(0)}°)`
                  : <span className="text-muted-foreground">Not available</span>
                }
              </p>
            </div>
          </div>
        </div>

        {/* Sunshine */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm">Sunshine</h3>
          </div>
          <div className="text-sm">
            <p className="text-muted-foreground">Daily Average</p>
            <p className="font-medium">
              {climate.sunshine.daily > 0
                ? `${climate.sunshine.daily.toFixed(1)} hours/day`
                : <span className="text-muted-foreground">Not available</span>
              }
            </p>
          </div>
        </div>

        {/* Humidity */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm">Humidity</h3>
          </div>
          <div className="text-sm">
            <p className="text-muted-foreground">Daily Average</p>
            <p className="font-medium">
              {climate.humidity.daily > 0
                ? `${climate.humidity.daily.toFixed(1)}%`
                : <span className="text-muted-foreground">Not available</span>
              }
            </p>
          </div>
        </div>

        {/* Monthly Summary */}
        <div className="space-y-2 pt-4 border-t">
          <h3 className="font-semibold text-sm">Monthly Averages</h3>
          <div className="text-xs space-y-1 max-h-48 overflow-y-auto">
            {Object.entries(climate.temperature.monthly).map(([month, temps]) => {
              const precip = climate.precipitation.monthly[month];
              return (
                <div key={month} className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground">{month}</span>
                  <div className="flex gap-4">
                    <span>{formatTemperature(temps.min)}</span>
                    <span className="text-muted-foreground">→</span>
                    <span>{formatTemperature(temps.max)}</span>
                    {precip !== undefined && (
                      <span className="text-muted-foreground ml-2">
                        {formatPrecipitation(precip)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

