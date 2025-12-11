/**
 * Geo Data Service Layer
 * Centralized service for external geospatial API calls
 * Provides caching, error handling, retries, and rate limiting
 */
import type { GeoJSON } from 'geojson';

export interface GeoDataCache {
  [key: string]: {
    data: unknown;
    timestamp: number;
    ttl: number; // Time to live in milliseconds
  };
}

export interface GeoApiOptions {
  retries?: number;
  retryDelay?: number; // milliseconds
  timeout?: number; // milliseconds
  cache?: boolean;
  cacheTTL?: number; // milliseconds
}

export interface GeoApiError {
  message: string;
  status?: number;
  retries?: number;
  originalError?: Error;
}

/**
 * Base class for geo data services
 * Handles caching, retries, and error handling
 */
export class GeoDataService {
  private static cache: GeoDataCache = {};
  private static rateLimitMap: Map<string, number[]> = new Map(); // Track API calls per endpoint
  private static readonly DEFAULT_RETRIES = 3;
  private static readonly DEFAULT_RETRY_DELAY = 1000; // 1 second
  private static readonly DEFAULT_TIMEOUT = 30000; // 30 seconds
  private static readonly DEFAULT_CACHE_TTL = 3600000; // 1 hour
  private static readonly RATE_LIMIT_WINDOW = 60000; // 1 minute
  private static readonly MAX_REQUESTS_PER_WINDOW = 60; // 60 requests per minute

  /**
   * Make a fetch request with retries, timeout, and rate limiting
   */
  static async fetchWithRetry(
    url: string,
    options: RequestInit = {},
    apiOptions: GeoApiOptions = {}
  ): Promise<Response> {
    const {
      retries = this.DEFAULT_RETRIES,
      retryDelay = this.DEFAULT_RETRY_DELAY,
      timeout = this.DEFAULT_TIMEOUT,
    } = apiOptions;

    // Check rate limiting
    this.checkRateLimit(url);

    // Generate cache key that includes URL and request body (for POST requests)
    // This ensures different queries to the same endpoint are cached separately
    const cacheKey = GeoDataService.generateCacheKey(url, options);

    // Check cache first
    if (apiOptions.cache !== false) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return new Response(JSON.stringify(cached), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          // Don't retry on 4xx errors (client errors)
          if (response.status >= 400 && response.status < 500) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
          }
          // Retry on 5xx errors (server errors)
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }

        // Cache successful responses
        if (apiOptions.cache !== false) {
          const data = await response.clone().json();
          this.setCache(cacheKey, data, apiOptions.cacheTTL);
        }

        return response;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');

        // Don't retry on abort (timeout) or 4xx errors
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error(`Request timeout after ${timeout}ms`);
        }

        // Wait before retrying (exponential backoff)
        if (attempt < retries) {
          const delay = retryDelay * Math.pow(2, attempt);
          await this.sleep(delay);
        }
      }
    }

    throw lastError || new Error('Request failed after all retries');
  }

  /**
   * Generate cache key from URL and request options
   * Includes request body for POST requests to ensure different queries are cached separately
   */
  private static generateCacheKey(url: string, options: RequestInit): string {
    // For POST requests, include the body in the cache key
    if (options.method === 'POST' && options.body) {
      // Create a hash of the body to keep cache keys manageable
      const bodyStr = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
      let hash = 0;
      for (let i = 0; i < bodyStr.length; i++) {
        const char = bodyStr.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      return `${url}::${hash}`;
    }
    return url;
  }

  /**
   * Check and enforce rate limiting
   */
  private static checkRateLimit(url: string): void {
    const now = Date.now();
    const endpoint = new URL(url).origin + new URL(url).pathname;
    let calls = this.rateLimitMap.get(endpoint) || [];

    // Remove calls outside the time window
    calls = calls.filter((timestamp) => now - timestamp < this.RATE_LIMIT_WINDOW);

    if (calls.length >= this.MAX_REQUESTS_PER_WINDOW) {
      const oldestCall = calls[0];
      if (oldestCall) {
        const waitTime = this.RATE_LIMIT_WINDOW - (now - oldestCall);
        throw new Error(
          `Rate limit exceeded. Please wait ${Math.ceil(waitTime / 1000)} seconds.`
        );
      }
    }

    // Add current call
    calls.push(now);
    this.rateLimitMap.set(endpoint, calls);
  }

  /**
   * Get data from cache
   */
  private static getFromCache(key: string): unknown | null {
    const cached = this.cache[key];
    if (!cached) {return null;}

    const now = Date.now();
    if (now - cached.timestamp > cached.ttl) {
      // Cache expired
      delete this.cache[key];
      return null;
    }

    return cached.data;
  }

  /**
   * Set data in cache
   */
  private static setCache(key: string, data: unknown, ttl?: number): void {
    this.cache[key] = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.DEFAULT_CACHE_TTL,
    };
  }

  /**
   * Clear cache for a specific key or all cache
   */
  static clearCache(key?: string): void {
    if (key) {
      delete this.cache[key];
    } else {
      this.cache = {};
    }
  }

  /**
   * Sleep utility for retry delays
   */
  private static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Transform coordinates array to GeoJSON format
   */
  static coordinatesToGeoJSON(
    coordinates: number[][],
    type: 'Point' | 'LineString' | 'Polygon' = 'Polygon'
  ): GeoJSON.Geometry {
    if (type === 'Point') {
      return {
        type: 'Point',
        coordinates: coordinates[0] || [0, 0],
      };
    }

    if (type === 'LineString') {
      return {
        type: 'LineString',
        coordinates: coordinates,
      };
    }

    // Polygon - ensure first and last coordinates match
    const polygonCoords = [...coordinates];
    const first = polygonCoords[0];
    const last = polygonCoords[polygonCoords.length - 1];
    if (first && last && (first[0] !== last[0] || first[1] !== last[1])) {
      polygonCoords.push(first);
    }

    return {
      type: 'Polygon',
      coordinates: [polygonCoords],
    };
  }

  /**
   * Extract coordinates from GeoJSON geometry
   */
  static extractCoordinates(geometry: GeoJSON.Geometry): number[][] {
    if (geometry.type === 'Point') {
      return [geometry.coordinates as [number, number]];
    }

    if (geometry.type === 'LineString') {
      return geometry.coordinates as number[][];
    }

    if (geometry.type === 'Polygon') {
      const firstRing = geometry.coordinates[0];
      return firstRing || [];
    }

    return [];
  }

  /**
   * Calculate center point from coordinates
   */
  static calculateCenter(coordinates: number[][]): { lat: number; lng: number } {
    if (coordinates.length === 0) {
      return { lat: 0, lng: 0 };
    }

    const latSum = coordinates.reduce((sum, coord) => {
      const lat = coord[1];
      return sum + (typeof lat === 'number' ? lat : 0);
    }, 0);
    const lngSum = coordinates.reduce((sum, coord) => {
      const lng = coord[0];
      return sum + (typeof lng === 'number' ? lng : 0);
    }, 0);

    return {
      lat: latSum / coordinates.length,
      lng: lngSum / coordinates.length,
    };
  }
}

