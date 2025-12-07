/**
 * Climate Service for site analysis
 * Fetches historical climate data and averages using Open-Meteo Climate API
 * Provides climate statistics, seasonal patterns, and long-term averages
 */
import { GeoDataService } from './geoDataService';

export interface ClimateData {
  latitude: number;
  longitude: number;
  elevation?: number;
  temperature: {
    daily: {
      min: number; // Average daily minimum temperature (°C)
      max: number; // Average daily maximum temperature (°C)
      mean: number; // Average daily mean temperature (°C)
    };
    monthly: {
      [month: string]: {
        min: number;
        max: number;
        mean: number;
      };
    };
  };
  precipitation: {
    daily: number; // Average daily precipitation (mm)
    monthly: {
      [month: string]: number;
    };
    annual: number; // Average annual precipitation (mm)
  };
  wind: {
    speed: number; // Average wind speed (km/h)
    direction: number; // Prevailing wind direction (degrees, 0-360)
    monthly: {
      [month: string]: {
        speed: number;
        direction: number;
      };
    };
  };
  sunshine: {
    daily: number; // Average daily sunshine hours
    monthly: {
      [month: string]: number;
    };
  };
  humidity: {
    daily: number; // Average daily relative humidity (%)
    monthly: {
      [month: string]: number;
    };
  };
  climateClassification?: string; // Köppen climate classification
}

export interface ClimateApiResponse {
  latitude: number;
  longitude: number;
  elevation: number;
  daily: {
    time: string[];
    temperature_2m_min: number[];
    temperature_2m_max: number[];
    temperature_2m_mean: number[];
    precipitation_sum: number[];
    wind_speed_10m_mean: number[];
    wind_direction_10m_dominant: number[];
    sunshine_duration: number[];
    relative_humidity_2m_mean: number[];
  };
}

/**
 * Fetch climate data from Open-Meteo APIs
 * Uses Climate API for wind, sunshine, and humidity (1 year of data)
 * Uses Archive API for temperature and precipitation (historical data)
 */
export async function fetchClimateData(
  latitude: number,
  longitude: number
): Promise<ClimateData> {
  // Use past year for climate data (not 30-year average)
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 1);
  
  const startDateStr = startDate.toISOString().split('T')[0];
  const endDateStr = endDate.toISOString().split('T')[0];
  
  // Archive API supports ALL parameters including wind, sunshine, and humidity!
  // Use correct parameter name: relative_humidity_2m_mean (with underscores)
  const archiveApiUrl = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${startDateStr}&end_date=${endDateStr}&daily=temperature_2m_min,temperature_2m_max,precipitation_sum,windspeed_10m_mean,winddirection_10m_dominant,sunshine_duration,relative_humidity_2m_mean&timezone=auto`;

  try {
    // Fetch all data from Archive API (it supports all parameters!)
    const response = await GeoDataService.fetchWithRetry(
      archiveApiUrl,
      { method: 'GET' },
      {
        cache: true,
        cacheTTL: 86400000, // Cache for 24 hours
        retries: 2,
        timeout: 15000,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Archive API returned ${response.status}: ${errorText}`);
    }

    const archiveData = await response.json();
    console.log('Archive API response keys:', Object.keys(archiveData.daily || {}));

    // Check if we have the required data
    if (!archiveData.daily || !archiveData.daily.time || archiveData.daily.time.length === 0) {
      throw new Error('No climate data available for this location and date range');
    }

    // Use data from Archive API (it has everything!)
    const data: any = {
      latitude: archiveData.latitude,
      longitude: archiveData.longitude,
      elevation: archiveData.elevation || 0,
      daily: {
        time: archiveData.daily.time || [],
        temperature_2m_min: archiveData.daily.temperature_2m_min || [],
        temperature_2m_max: archiveData.daily.temperature_2m_max || [],
        temperature_2m_mean: [], // Will be calculated
        precipitation_sum: archiveData.daily.precipitation_sum || [],
        // All from Archive API with correct parameter names
        wind_speed_10m_mean: archiveData.daily.windspeed_10m_mean || [],
        wind_direction_10m_dominant: archiveData.daily.winddirection_10m_dominant || [],
        sunshine_duration: archiveData.daily.sunshine_duration || [],
        relative_humidity_2m_mean: archiveData.daily.relative_humidity_2m_mean || [],
      },
    };

    // Check if we have at least some data
    if (!data.daily || !data.daily.time || data.daily.time.length === 0) {
      console.error('Invalid API response structure:', data);
      throw new Error('No climate data available for this location and date range');
    }

    // Transform Open-Meteo response to our format
    // Calculate mean temperature from min and max
    const tempMin = data.daily.temperature_2m_min || [];
    const tempMax = data.daily.temperature_2m_max || [];
    const tempMean = tempMin.map((min: number, i: number) => {
      const max = tempMax[i];
      if (min !== null && max !== null && !isNaN(min) && !isNaN(max)) {
        return (min + max) / 2;
      }
      return null;
    });

    // Convert sunshine duration from seconds to hours (Archive API returns seconds)
    const sunshineDurationSeconds = data.daily.sunshine_duration || [];
    const sunshineDuration = sunshineDurationSeconds.map((seconds: number) => {
      if (seconds === null || seconds === undefined || isNaN(seconds)) {
        return null;
      }
      // Convert seconds to hours
      return seconds / 3600;
    });

    const transformedData: ClimateApiResponse = {
      latitude: data.latitude,
      longitude: data.longitude,
      elevation: data.elevation || 0,
      daily: {
        time: data.daily?.time || [],
        temperature_2m_min: tempMin,
        temperature_2m_max: tempMax,
        temperature_2m_mean: tempMean,
        precipitation_sum: data.daily?.precipitation_sum || [],
        // Use data from Climate API (already merged above)
        wind_speed_10m_mean: data.daily.wind_speed_10m_mean || [],
        wind_direction_10m_dominant: data.daily.wind_direction_10m_dominant || [],
        sunshine_duration: sunshineDuration, // Calculated from radiation or existing data
        relative_humidity_2m_mean: data.daily.relative_humidity_2m_mean || [],
      },
    };

    // Process and aggregate the data
    return processClimateData(transformedData);
  } catch (error) {
    console.error('Error fetching climate data:', error);
    throw new Error(`Failed to fetch climate data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Process raw API response into structured climate data
 */
function processClimateData(data: ClimateApiResponse): ClimateData {
  const { daily } = data;
  const monthlyData: {
    [key: string]: {
      tempMin: number[];
      tempMax: number[];
      tempMean: number[];
      precipitation: number[];
      windSpeed: number[];
      windDirection: number[];
      sunshine: number[];
      humidity: number[];
    };
  } = {};

  // Group data by month
  daily.time.forEach((dateStr, index) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1; // 1-12
    const monthKey = month.toString().padStart(2, '0');

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        tempMin: [],
        tempMax: [],
        tempMean: [],
        precipitation: [],
        windSpeed: [],
        windDirection: [],
        sunshine: [],
        humidity: [],
      };
    }

    const tempMin = daily.temperature_2m_min[index];
    const tempMax = daily.temperature_2m_max[index];
    const tempMean = daily.temperature_2m_mean[index];
    const precip = daily.precipitation_sum[index];
    const windSpeed = daily.wind_speed_10m_mean[index];
    const windDir = daily.wind_direction_10m_dominant[index];
    const sunshine = daily.sunshine_duration[index];
    const humidity = daily.relative_humidity_2m_mean[index];

    if (tempMin !== null && tempMin !== undefined && !isNaN(tempMin)) {
      monthlyData[monthKey].tempMin.push(tempMin);
    }
    if (tempMax !== null && tempMax !== undefined && !isNaN(tempMax)) {
      monthlyData[monthKey].tempMax.push(tempMax);
    }
    if (tempMean !== null && tempMean !== undefined && !isNaN(tempMean)) {
      monthlyData[monthKey].tempMean.push(tempMean);
    }
    if (precip !== null && precip !== undefined && !isNaN(precip)) {
      monthlyData[monthKey].precipitation.push(precip);
    }
    if (windSpeed !== null && windSpeed !== undefined && !isNaN(windSpeed)) {
      monthlyData[monthKey].windSpeed.push(windSpeed);
    }
    if (windDir !== null && windDir !== undefined && !isNaN(windDir)) {
      monthlyData[monthKey].windDirection.push(windDir);
    }
    if (sunshine !== null && sunshine !== undefined && !isNaN(sunshine)) {
      // Sunshine is already in hours (converted in fetchClimateData)
      monthlyData[monthKey].sunshine.push(sunshine);
    }
    if (humidity !== null && humidity !== undefined && !isNaN(humidity)) {
      monthlyData[monthKey].humidity.push(humidity);
    }
  });

  // Calculate averages
  const calculateAverage = (values: number[]): number => {
    const validValues = values.filter((v) => v !== null && !isNaN(v) && isFinite(v));
    if (validValues.length === 0) return 0;
    return validValues.reduce((sum, v) => sum + v, 0) / validValues.length;
  };

  // Calculate prevailing wind direction (most common direction)
  const calculatePrevailingWind = (directions: number[]): number => {
    const validDirections = directions.filter((d) => d !== null && !isNaN(d) && isFinite(d));
    if (validDirections.length === 0) return 0;

    // Group directions into 8 compass points
    const compassPoints: { [key: number]: number } = {};
    validDirections.forEach((dir) => {
      const point = Math.round(dir / 45) * 45;
      compassPoints[point] = (compassPoints[point] || 0) + 1;
    });

    // Find most common direction
    let maxCount = 0;
    let prevailing = 0;
    Object.entries(compassPoints).forEach(([dir, count]) => {
      if (count > maxCount) {
        maxCount = count;
        prevailing = parseInt(dir, 10);
      }
    });

    return prevailing;
  };

  // Calculate monthly averages
  const monthlyAverages: {
    [month: string]: {
      tempMin: number;
      tempMax: number;
      tempMean: number;
      precipitation: number;
      windSpeed: number;
      windDirection: number;
      sunshine: number;
      humidity: number;
    };
  } = {};

  Object.entries(monthlyData).forEach(([month, values]) => {
    monthlyAverages[month] = {
      tempMin: calculateAverage(values.tempMin),
      tempMax: calculateAverage(values.tempMax),
      tempMean: calculateAverage(values.tempMean),
      precipitation: calculateAverage(values.precipitation),
      windSpeed: calculateAverage(values.windSpeed),
      windDirection: calculatePrevailingWind(values.windDirection),
      sunshine: calculateAverage(values.sunshine),
      humidity: calculateAverage(values.humidity),
    };
  });

  // Calculate overall daily averages
  const allTempMin = daily.temperature_2m_min.filter((v) => v !== null && !isNaN(v));
  const allTempMax = daily.temperature_2m_max.filter((v) => v !== null && !isNaN(v));
  const allTempMean = daily.temperature_2m_mean.filter((v) => v !== null && !isNaN(v));
  const allPrecipitation = daily.precipitation_sum.filter((v) => v !== null && !isNaN(v));
  const allWindSpeed = daily.wind_speed_10m_mean.filter((v) => v !== null && !isNaN(v));
  const allWindDirection = daily.wind_direction_10m_dominant.filter((v) => v !== null && !isNaN(v));
    // Sunshine duration is already in hours (converted in fetchClimateData)
    const allSunshine = daily.sunshine_duration.filter((v) => v !== null && !isNaN(v));
  const allHumidity = daily.relative_humidity_2m_mean.filter((v) => v !== null && !isNaN(v));

  // Format monthly data for output
  const monthlyTemp: { [month: string]: { min: number; max: number; mean: number } } = {};
  const monthlyPrecip: { [month: string]: number } = {};
  const monthlyWind: { [month: string]: { speed: number; direction: number } } = {};
  const monthlySunshine: { [month: string]: number } = {};
  const monthlyHumidity: { [month: string]: number } = {};

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  Object.entries(monthlyAverages).forEach(([monthKey, avg]) => {
    const monthIndex = parseInt(monthKey, 10) - 1;
    if (monthIndex < 0 || monthIndex >= monthNames.length) {
      console.warn(`Invalid month index: ${monthIndex} for key ${monthKey}`);
      return;
    }
    const monthName = monthNames[monthIndex];
    if (!monthName) {
      console.warn(`No month name found for index: ${monthIndex}`);
      return;
    }

    monthlyTemp[monthName] = {
      min: avg.tempMin,
      max: avg.tempMax,
      mean: avg.tempMean,
    };
    monthlyPrecip[monthName] = avg.precipitation;
    monthlyWind[monthName] = {
      speed: avg.windSpeed,
      direction: avg.windDirection,
    };
    monthlySunshine[monthName] = avg.sunshine;
    monthlyHumidity[monthName] = avg.humidity;
  });

  return {
    latitude: data.latitude,
    longitude: data.longitude,
    elevation: data.elevation,
    temperature: {
      daily: {
        min: calculateAverage(allTempMin),
        max: calculateAverage(allTempMax),
        mean: calculateAverage(allTempMean),
      },
      monthly: monthlyTemp,
    },
    precipitation: {
      daily: calculateAverage(allPrecipitation),
      monthly: monthlyPrecip,
      annual: calculateAverage(allPrecipitation) * 365,
    },
    wind: {
      speed: calculateAverage(allWindSpeed),
      direction: calculatePrevailingWind(allWindDirection),
      monthly: monthlyWind,
    },
    sunshine: {
      daily: calculateAverage(allSunshine),
      monthly: monthlySunshine,
    },
    humidity: {
      daily: calculateAverage(allHumidity),
      monthly: monthlyHumidity,
    },
  };
}

/**
 * Get climate classification (simplified Köppen classification)
 */
export function getClimateClassification(climate: ClimateData): string {
  const { temperature, precipitation } = climate;
  const avgTemp = temperature.daily.mean;
  const annualPrecip = precipitation.annual;

  // Simplified Köppen classification
  if (avgTemp >= 18 && annualPrecip >= 60) {
    return 'Tropical';
  }
  if (avgTemp >= 0 && annualPrecip < 30) {
    return 'Desert';
  }
  if (avgTemp >= 0 && annualPrecip >= 30 && annualPrecip < 60) {
    return 'Steppe';
  }
  if (avgTemp < 0 && annualPrecip < 30) {
    return 'Polar Desert';
  }
  if (avgTemp >= 0 && avgTemp < 18) {
    return 'Temperate';
  }
  if (avgTemp < 0) {
    return 'Polar';
  }

  return 'Unknown';
}

