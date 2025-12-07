'use client';

import * as THREE from 'three';

// SketchUp-style snap types
export type SnapType =
  | 'none'
  | 'endpoint'      // Vertex/corner - Green square
  | 'midpoint'      // Edge midpoint - Cyan circle
  | 'on-edge'       // Any point on edge - Red circle
  | 'on-face'       // Any point on face - Blue diamond
  | 'intersection'  // Edge-edge crossing - Black X
  | 'perpendicular' // Perpendicular to edge - Magenta
  | 'parallel'      // Parallel to edge - Magenta
  | 'axis'          // Locked to X/Y/Z axis - Colored line
  | 'constraint';   // Constraint-based snapping

export type SnapCandidateType =
  | 'endpoint'
  | 'midpoint'
  | 'edge'
  | 'face'
  | 'intersection'
  | 'object-center'
  | 'vertex';

export interface SnapCandidate {
  id: string;
  type: SnapCandidateType;
  position: THREE.Vector3;
  objectId?: string;
  edgeStart?: THREE.Vector3;  // For edge snapping
  edgeEnd?: THREE.Vector3;    // For edge snapping
  normal?: THREE.Vector3;      // For face snapping
  metadata?: Record<string, unknown>;
}

export interface ConstraintCandidate {
  id: string;
  description?: string;
  resolve: (point: THREE.Vector3) => THREE.Vector3 | null;
}

export interface SnapSettings {
  grid: boolean;
  object: boolean;
  constraint: boolean;
}

export type AxisLock = 'x' | 'y' | 'z' | null;

export interface InferenceResult {
  type: 'perpendicular' | 'parallel';
  direction: THREE.Vector3;
  referenceEdge: {
    start: THREE.Vector3;
    end: THREE.Vector3;
  };
}

export interface SnapPointOptions {
  settings: SnapSettings;
  gridSize: number;
  objectSnapDistance: number;
  constraints?: ConstraintCandidate[];
  hitFace?: boolean; // Whether the raw point is on a face (for on-face snapping)
  axisLock?: AxisLock; // Which axis is locked (Shift + arrow keys)
  axisLockOrigin?: THREE.Vector3; // Origin point for axis lock constraint
  drawingOrigin?: THREE.Vector3; // Origin point for perpendicular/parallel inference
  edgeCandidates?: Array<{ start: THREE.Vector3; end: THREE.Vector3; objectId: string }>; // Nearby edges for inference
}

export interface SnapResult {
  type: SnapType;
  point: THREE.Vector3;
  candidate?: SnapCandidate;
  constraintId?: string;
  // Visual feedback
  color?: string;
  icon?: 'square' | 'circle' | 'diamond' | 'x' | 'line';
  label?: string;
  priority?: number;
  // Inference information
  inference?: InferenceResult;
}

// Visual styling for each snap type (SketchUp-style)
export const SNAP_VISUALS: Record<SnapType, { color: string; icon: 'square' | 'circle' | 'diamond' | 'x' | 'line'; label: string; priority: number }> = {
  'endpoint': { color: '#00FF00', icon: 'square', label: 'Endpoint', priority: 10 },
  'midpoint': { color: '#00FFFF', icon: 'circle', label: 'Midpoint', priority: 9 },
  'on-edge': { color: '#FF0000', icon: 'circle', label: 'On Edge', priority: 7 },
  'on-face': { color: '#00FF00', icon: 'square', label: 'On Face', priority: 6 }, // Changed to green square
  'intersection': { color: '#000000', icon: 'x', label: 'Intersection', priority: 8 },
  'perpendicular': { color: '#FF00FF', icon: 'line', label: 'Perpendicular', priority: 8 },
  'parallel': { color: '#FF00FF', icon: 'line', label: 'Parallel', priority: 8 },
  'axis': { color: '#FF0000', icon: 'line', label: 'On Axis', priority: 9 },
  'constraint': { color: '#FFFF00', icon: 'circle', label: 'Constraint', priority: 7 },
  'none': { color: '#FFFFFF', icon: 'circle', label: '', priority: 0 },
};

/**
 * Convert world space distance to screen space pixels
 * Used for SketchUp-style 8-10px snap tolerance
 */
export function worldToScreenDistance(
  worldPoint: THREE.Vector3,
  camera: THREE.Camera,
  canvasWidth: number,
  canvasHeight: number
): number {
  const screenPoint = worldPoint.clone().project(camera);
  const offsetPoint = worldPoint.clone().add(new THREE.Vector3(1, 0, 0)).project(camera);

  const dx = (offsetPoint.x - screenPoint.x) * canvasWidth / 2;
  const dy = (offsetPoint.y - screenPoint.y) * canvasHeight / 2;

  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Check if a candidate is within screen-space snap tolerance (8-10px)
 */
export function isWithinSnapTolerance(
  point: THREE.Vector3,
  candidate: THREE.Vector3,
  camera: THREE.Camera,
  canvasWidth: number,
  canvasHeight: number,
  tolerancePx: number = 10
): boolean {
  const pointScreen = point.clone().project(camera);
  const candidateScreen = candidate.clone().project(camera);

  const dx = (candidateScreen.x - pointScreen.x) * canvasWidth / 2;
  const dy = (candidateScreen.y - pointScreen.y) * canvasHeight / 2;
  const distancePx = Math.sqrt(dx * dx + dy * dy);

  return distancePx <= tolerancePx;
}

/**
 * Apply axis lock constraint to a point
 * Constrains point to move only along the specified axis from origin
 */
function applyAxisLock(
  point: THREE.Vector3,
  axisLock: AxisLock,
  origin: THREE.Vector3
): THREE.Vector3 {
  if (!axisLock) return point;

  const constrained = origin.clone();

  switch (axisLock) {
    case 'x':
      constrained.x = point.x;
      break;
    case 'y':
      constrained.y = point.y;
      break;
    case 'z':
      constrained.z = point.z;
      break;
  }

  return constrained;
}

/**
 * Detect perpendicular or parallel inference with nearby edges
 * Returns inference result if drawing direction aligns with an edge
 */
function detectInference(
  origin: THREE.Vector3,
  currentPoint: THREE.Vector3,
  edgeCandidates: Array<{ start: THREE.Vector3; end: THREE.Vector3; objectId: string }>
): InferenceResult | null {
  const ANGLE_TOLERANCE = 5; // degrees
  const PARALLEL_THRESHOLD = Math.cos((ANGLE_TOLERANCE * Math.PI) / 180);
  const PERPENDICULAR_THRESHOLD = Math.sin((ANGLE_TOLERANCE * Math.PI) / 180);

  // Drawing direction
  const drawingDir = new THREE.Vector3().subVectors(currentPoint, origin).normalize();

  // Check each edge for perpendicular or parallel relationship
  for (const edge of edgeCandidates) {
    const edgeDir = new THREE.Vector3().subVectors(edge.end, edge.start).normalize();
    const dotProduct = Math.abs(drawingDir.dot(edgeDir));

    // Parallel check (dot product close to 1)
    if (dotProduct >= PARALLEL_THRESHOLD) {
      return {
        type: 'parallel',
        direction: edgeDir.clone(),
        referenceEdge: edge,
      };
    }

    // Perpendicular check (dot product close to 0)
    if (dotProduct <= PERPENDICULAR_THRESHOLD) {
      return {
        type: 'perpendicular',
        direction: edgeDir.clone(),
        referenceEdge: edge,
      };
    }
  }

  return null;
}

/**
 * Snap a raw point to the best available target according to the provided settings.
 * Uses SketchUp-style priority: Endpoint > Midpoint > Intersection > Grid
 * Requires camera and canvas size for screen-space distance calculation
 */
export function snapPoint(
  rawPoint: THREE.Vector3,
  candidates: SnapCandidate[],
  options: SnapPointOptions,
  camera?: THREE.Camera,
  canvasWidth?: number,
  canvasHeight?: number
): SnapResult {
  const SNAP_TOLERANCE_PX = 10; // SketchUp-style 8-10px tolerance

  // Detect perpendicular/parallel inference first (before axis lock)
  let inference: InferenceResult | null = null;
  if (options.drawingOrigin && options.edgeCandidates && options.edgeCandidates.length > 0) {
    inference = detectInference(options.drawingOrigin, rawPoint, options.edgeCandidates);
  }

  // Apply axis lock if active (overrides inference)
  let constrainedPoint = rawPoint;
  if (options.axisLock && options.axisLockOrigin) {
    constrainedPoint = applyAxisLock(rawPoint, options.axisLock, options.axisLockOrigin);

    // Return axis lock result immediately (highest priority)
    const axisColors = { x: '#FF0000', y: '#00FF00', z: '#0000FF' };
    const axisLabels = { x: 'On Red Axis', y: 'On Green Axis', z: 'On Blue Axis' };

    return {
      type: 'axis',
      point: constrainedPoint,
      color: axisColors[options.axisLock],
      icon: 'line',
      label: axisLabels[options.axisLock],
      priority: 9,
      // inference is omitted - axis lock overrides inference
    };
  }

  // If camera info provided, use screen-space snapping (preferred)
  if (camera && canvasWidth && canvasHeight && options.settings.object && candidates.length > 0) {
    // Sort candidates by priority (endpoint > midpoint > edge > others)
    const sortedCandidates = [...candidates].sort((a, b) => {
      const priorityMap: Record<SnapCandidateType, number> = {
        'endpoint': 10,
        'midpoint': 9,
        'intersection': 8,
        'edge': 7,
        'face': 6,
        'object-center': 5,
        'vertex': 4,
      };
      return (priorityMap[b.type] || 0) - (priorityMap[a.type] || 0);
    });

    // Find first candidate within screen-space tolerance
    for (const candidate of sortedCandidates) {
      let snapPosition = candidate.position;

      // For edge candidates, find the closest point on the edge
      if (candidate.type === 'edge' && candidate.edgeStart && candidate.edgeEnd) {
        const edge = new THREE.Vector3().subVectors(candidate.edgeEnd, candidate.edgeStart);
        const cursorToStart = new THREE.Vector3().subVectors(rawPoint, candidate.edgeStart);
        const edgeLengthSq = edge.lengthSq();

        if (edgeLengthSq > 0) {
          const t = Math.max(0, Math.min(1, cursorToStart.dot(edge) / edgeLengthSq));
          snapPosition = candidate.edgeStart.clone().add(edge.multiplyScalar(t));
        }
      }

      if (isWithinSnapTolerance(rawPoint, snapPosition, camera, canvasWidth, canvasHeight, SNAP_TOLERANCE_PX)) {
        const snapType: SnapType = candidate.type === 'endpoint' ? 'endpoint' :
                                     candidate.type === 'midpoint' ? 'midpoint' :
                                     candidate.type === 'edge' ? 'on-edge' :
                                     candidate.type === 'face' ? 'on-face' :
                                     candidate.type === 'intersection' ? 'intersection' : 'none';

        const visuals = SNAP_VISUALS[snapType];

        const result: SnapResult = {
          type: snapType,
          point: snapPosition.clone(),
          candidate,
          color: visuals.color,
          icon: visuals.icon,
          label: visuals.label,
          priority: visuals.priority,
        };
        
        if (inference) {
          result.inference = inference;
        }
        
        return result;
      }
    }
  }

  // Fallback to world-space object snapping (legacy)
  if (options.settings.object && candidates.length > 0) {
    const objectResult = getObjectSnapPoint(rawPoint, candidates, options.objectSnapDistance);
    if (objectResult) {
      return objectResult;
    }
  }

  // Constraint snapping
  if (options.settings.constraint && options.constraints?.length) {
    const constraintResult = getConstraintSnapPoint(rawPoint, options.constraints);
    if (constraintResult) {
      return constraintResult;
    }
  }

  // On-face snapping (lowest priority, only if we hit a face)
  if (options.hitFace) {
    const visuals = SNAP_VISUALS['on-face'];
    const faceResult: SnapResult = {
      type: 'on-face',
      point: rawPoint.clone(),
      color: visuals.color,
      icon: visuals.icon,
      label: visuals.label,
      priority: visuals.priority,
    };
    if (inference) {
      faceResult.inference = inference;
    }
    return faceResult;
  }

  // No snapping applied - return raw point with inference if available
  if (inference) {
    const inferenceType = inference.type;
    const result: SnapResult = {
      type: inferenceType,
      point: rawPoint.clone(),
      color: '#FF00FF',
      icon: 'line',
      label: inferenceType === 'parallel' ? 'Parallel' : 'Perpendicular',
      priority: 8,
    };
    result.inference = inference;
    return result;
  }

  // No snapping applied - return raw point
  return {
    type: 'none',
    point: rawPoint.clone(),
  };
}

/**
 * Snap a point to the nearest grid intersection based on grid size.
 */
export function getGridSnapPoint(point: THREE.Vector3, gridSize: number): THREE.Vector3 {
  const snapped = point.clone();
  snapped.x = Math.round(snapped.x / gridSize) * gridSize;
  snapped.y = Math.round(snapped.y / gridSize) * gridSize;
  snapped.z = Math.round(snapped.z / gridSize) * gridSize;
  return snapped;
}

/**
 * Snap a point to the closest candidate within the provided distance threshold.
 */
export function getObjectSnapPoint(
  point: THREE.Vector3,
  candidates: SnapCandidate[],
  threshold: number
): SnapResult | null {
  let closestCandidate: SnapCandidate | null = null;
  let closestDistance = Number.POSITIVE_INFINITY;

  for (const candidate of candidates) {
    const distance = candidate.position.distanceTo(point);
    if (distance <= threshold && distance < closestDistance) {
      closestCandidate = candidate;
      closestDistance = distance;
    }
  }

  if (!closestCandidate) {
    return null;
  }

  // Map candidate type to snap type
  const snapType: SnapType = 
    closestCandidate.type === 'endpoint' ? 'endpoint' :
    closestCandidate.type === 'midpoint' ? 'midpoint' :
    closestCandidate.type === 'edge' ? 'on-edge' :
    closestCandidate.type === 'face' ? 'on-face' :
    closestCandidate.type === 'intersection' ? 'intersection' :
    'none';
  
  return {
    type: snapType,
    point: closestCandidate.position.clone(),
    candidate: closestCandidate,
  };
}

/**
 * Evaluate registered constraints and snap to the first valid solution.
 * Returns null when no constraints can be satisfied.
 */
export function getConstraintSnapPoint(
  point: THREE.Vector3,
  constraints: ConstraintCandidate[]
): SnapResult | null {
  for (const constraint of constraints) {
    const resolved = constraint.resolve(point);
    if (resolved) {
      return {
        type: 'constraint',
        point: resolved,
        constraintId: constraint.id,
      };
    }
  }

  return null;
}
