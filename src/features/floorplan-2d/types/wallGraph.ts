/**
 * Graph-based wall system type definitions
 * Defines the core data structures for walls, nodes, edges, openings, and snapping
 */

export type Point = [number, number];

export interface WallNode {
  id: string;
  position: Point;
  connectedEdges: string[]; // IDs of connected wall edges
}

export interface WallEdge {
  id: string;
  startNodeId: string;
  endNodeId: string;
  centerline: [Point, Point];
  /** Wall thickness in METERS */
  thickness: number;
  // Wall metadata
  angle: number; // in radians
  /** Wall length in METERS (converted from pixel distance) */
  length: number;
  openings: Opening[];
  fill?: string; // Fill color (hex format, e.g., '#ffffff')
  layer?: string; // Layer identifier (placeholder for now)
  hatchPattern?: string; // Hatch pattern identifier (e.g., 'HBS2405S', 'HBS2406S')
  /** Wall height in METERS */
  height?: number;
}

export interface Opening {
  id: string;
  type: 'door' | 'window';
  wallId: string;
  /** Position along wall in METERS from start node */
  position: number;
  /** Width in METERS (NOT pixels) */
  width: number;
  sillHeight: number; // Sill height in millimeters (0 for doors)
  orientation?: 'left-in' | 'left-out' | 'right-in' | 'right-out';
  alignment?: 'center' | 'inner' | 'outer';
  
  /** User-specified width in their chosen unit system (inches or cm) */
  userWidth?: number;
  /** User-specified height in their chosen unit system (inches or cm) */
  userHeight?: number;
  /** User-specified sill height in their chosen unit system (inches or cm) - for windows only */
  userSillHeight?: number;
  /** Unit system used when user specified dimensions */
  unitSystem?: 'imperial' | 'metric';
  
  // Pre-calculated cutout box data for 3D rendering
  center2D?: Point; // [x, y] - Exact 2D center coordinates in pixels
  center3D?: [number, number, number]; // [x, y, z] - Exact 3D world position in meters
  angle?: number; // Angle in radians (wall angle) for cutout box rotation
  /** Opening height in METERS (calculated from wallHeight and sillHeight) */
  height?: number;
  
  // Layer assignment (inherits from parent wall if not set)
  layerId?: string; // Layer identifier for filtering and locking
}

export interface WallGraph {
  nodes: { [nodeId: string]: WallNode };
  edges: { [edgeId: string]: WallEdge };
}

export interface SnapResult {
  snapped: boolean;
  point: Point;
  nodeId?: string; // If snapped to existing node
  distance: number; // Distance to snap point
}

export interface SnapOptions {
  snapToGrid: boolean;
  snapToWalls: boolean;
  snapToNodes: boolean;
  snapToAngles: boolean;
  gridSize: number;
  snapTolerance: number;
}