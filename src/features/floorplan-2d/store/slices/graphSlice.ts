/**
 * Graph slice providing base wall graph state and wall material/snapping configuration
 * Manages wall graph data, wall properties (thickness, height, fill, hatch patterns), and snap options
 * Handles wall creation, updates, deletion, and unit system management
 */
import { deepCopyGraph } from '../../utils/graphUtils';
import { pixelsToMeters, metersToPixels, inchesToMeters, centimetersToMeters } from '@/lib/units/unitsSystem';
import type { UnitSystem } from '@/lib/units/unitsSystem';
import {
  findSnapPointForDrawing,
  removeWallFromGraph,
  createWallGraph,
  updateNodePosition,
  synchronizeWallWithNodes,
  normalizeWallOpeningsAfterGeometryChange,
} from '../../utils/wallGraphUtils';
import { splitWallAtPoint as splitWallAtPointUtil, findIntersectingWalls } from '../../utils/wallSplitting';
import type { Point, WallEdge, WallGraph, WallNode } from '../../types/wallGraph';
import type {
  WallGraphStateCreator,
  GraphSlice,
  WallGeometryUpdateOptions,
  WallGeometryAnchor,
  SplitWallResult,
} from '../types';

const MIN_WALL_LENGTH_PIXELS = 1;

/**
 * Calculate grid size in pixels based on unit system
 * Imperial: 6 inches (minor grid for snapping)
 * Metric: 25 cm (minor grid for snapping)
 */
const getGridSizeForUnitSystem = (unitSystem: UnitSystem): number => {
  if (unitSystem === 'imperial') {
    // 6 inches = 0.1524 meters
    const gridMeters = inchesToMeters(6);
    return metersToPixels(gridMeters); // ≈ 15.24 pixels
  } else {
    // 25 cm = 0.25 meters
    const gridMeters = centimetersToMeters(25);
    return metersToPixels(gridMeters); // = 25 pixels
  }
};

const updateConnectedEdgesForNode = (graph: WallGraph, nodeId: string) => {
  const node = graph.nodes[nodeId];
  if (!node) {
    return;
  }

  node.connectedEdges.forEach((edgeId) => {
    synchronizeWallWithNodes(graph, edgeId);
    normalizeWallOpeningsAfterGeometryChange(graph, edgeId);
  });
};

const repositionWallAroundCenter = (
  graph: WallGraph,
  wall: WallEdge,
  targetAngle: number,
  targetLengthPixels: number // Length in pixels for positioning
) => {
  const startNode = graph.nodes[wall.startNodeId];
  const endNode = graph.nodes[wall.endNodeId];

  if (!startNode || !endNode) {
    return;
  }

  const lengthPixels = Math.max(targetLengthPixels, MIN_WALL_LENGTH_PIXELS);
  const halfLength = lengthPixels / 2;

  const centerX = (startNode.position[0] + endNode.position[0]) / 2;
  const centerY = (startNode.position[1] + endNode.position[1]) / 2;

  const directionX = Math.cos(targetAngle);
  const directionY = Math.sin(targetAngle);

  const startPosition: Point = [
    centerX - directionX * halfLength,
    centerY - directionY * halfLength,
  ];

  const endPosition: Point = [
    centerX + directionX * halfLength,
    centerY + directionY * halfLength,
  ];

  updateNodePosition(graph, wall.startNodeId, startPosition);
  updateNodePosition(graph, wall.endNodeId, endPosition);

  updateConnectedEdgesForNode(graph, wall.startNodeId);
  updateConnectedEdgesForNode(graph, wall.endNodeId);
};

export const createGraphSlice: WallGraphStateCreator<GraphSlice> = (set, get) => {
  // Determine initial unit system from localStorage or default to imperial
  const initialUnitSystem: UnitSystem = (() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('preferredUnitSystem');
      if (stored === 'imperial' || stored === 'metric') {
        return stored;
      }
    }
    return 'imperial';
  })();

  return {
    graph: createWallGraph(),
    // Store in METERS (per units fix plan)
    // Default: 6 inches = 0.1524m, 9 feet = 2.7432m
    wallThickness: 0.1524,  // 6 inches in meters
    wallHeight: 2.7432,      // 9 feet in meters
    wallFill: '#2c2a3b',
    wallLayer: 'default',
    wallHatchPattern: null,
    strokeWeight: 'fine',
    hatchPatternImages: new Map<string, HTMLImageElement>(),
    snapOptions: {
      snapToGrid: true,
      snapToWalls: true,
      snapToNodes: true,
      snapToAngles: false,
      gridSize: getGridSizeForUnitSystem(initialUnitSystem), // Unit-aware grid size
      snapTolerance: 10,
    },
    unitSystem: initialUnitSystem,
    wallGeometryDragState: null,

  setWallThickness: (thickness) => {
    set({ wallThickness: thickness });
  },
  setWallHeight: (height) => {
    set({ wallHeight: height });
  },
  setWallFill: (fill) => {
    set({ wallFill: fill });
  },
  setWallLayer: (layer) => {
    set({ wallLayer: layer });
  },
  setWallHatchPattern: (pattern) => {
    set({ wallHatchPattern: pattern });
  },
  setStrokeWeight: (weight) => {
    set({ strokeWeight: weight });
  },
  loadHatchPatternImage: async (patternName) => {
    const { hatchPatternImages } = get();
    if (hatchPatternImages.has(patternName)) {
      return hatchPatternImages.get(patternName) ?? null;
    }

    try {
      const image = new Image();
      const imageUrl = `/Hatches/${patternName}.svg`;
      return await new Promise((resolve) => {
        image.onload = () => {
          set((state) => {
            const updated = new Map(state.hatchPatternImages);
            updated.set(patternName, image);
            return { hatchPatternImages: updated };
          });
          resolve(image);
        };
        image.onerror = () => {
          console.error(`Failed to load hatch pattern: ${patternName}`);
          resolve(null);
        };
        image.src = imageUrl;
      });
    } catch (error) {
      console.error(`Error loading hatch pattern ${patternName}:`, error);
      return null;
    }
  },
  updateWallThickness: (wallId, thickness) => {
    set((state) => {
      const graphCopy = deepCopyGraph(state.graph);
      if (graphCopy.edges[wallId]) {
        graphCopy.edges[wallId].thickness = thickness;
      }
      return { graph: graphCopy };
    });
  },
  updateWallFill: (wallId, fill) => {
    set((state) => {
      const graphCopy = deepCopyGraph(state.graph);
      if (graphCopy.edges[wallId]) {
        graphCopy.edges[wallId].fill = fill;
      }
      return { graph: graphCopy };
    });
  },
  updateWallHatchPattern: (wallId, pattern) => {
    set((state) => {
      const graphCopy = deepCopyGraph(state.graph);
      const wall = graphCopy.edges[wallId];
      if (wall) {
        if (pattern) {
          wall.hatchPattern = pattern;
        } else {
          delete wall.hatchPattern;
        }
      }
      return { graph: graphCopy };
    });
  },
  beginWallGeometryDrag: (wallId, anchor) => {
    set((state) => {
      const wall = state.graph.edges[wallId];
      if (!wall) {
        return {};
      }
      return {
        wallGeometryDragState: {
          wallId,
          anchor,
          initialGraphSnapshot: deepCopyGraph(state.graph),
        },
      };
    });
  },
  updateWallGeometryDrag: (point, options) => {
    const state = get();
    const dragState = state.wallGeometryDragState;
    if (!dragState) {
      return;
    }

    const wall = state.graph.edges[dragState.wallId];
    if (!wall) {
      return;
    }

    const anchorNodeId =
      dragState.anchor === 'start' ? wall.startNodeId : wall.endNodeId;
    const anchorNode = state.graph.nodes[anchorNodeId];
    if (!anchorNode) {
      return;
    }

    let targetPoint = point;
    if (!options?.skipSnap) {
      const snapResult = findSnapPointForDrawing(point, state.graph, state.snapOptions);
      targetPoint = snapResult.point;
    }

    const anchorPosition = anchorNode.position;
    let dx: number;
    let dy: number;
    if (dragState.anchor === 'start') {
      dx = targetPoint[0] - anchorPosition[0];
      dy = targetPoint[1] - anchorPosition[1];
    } else {
      dx = anchorPosition[0] - targetPoint[0];
      dy = anchorPosition[1] - targetPoint[1];
    }

    let nextLength = Math.hypot(dx, dy);
    if (!Number.isFinite(nextLength) || nextLength < MIN_WALL_LENGTH_PIXELS) {
      nextLength = MIN_WALL_LENGTH_PIXELS;
    }
    const nextAngle = Math.atan2(dy, dx);

    state.updateWallGeometry(dragState.wallId, {
      lengthPixels: nextLength,
      angleRadians: nextAngle,
      anchor: dragState.anchor,
      commit: false,
    });
  },
  finishWallGeometryDrag: () => {
    const dragState = get().wallGeometryDragState;
    if (!dragState) {
      return;
    }
    set({ wallGeometryDragState: null });
    get().saveToHistory();
  },
  cancelWallGeometryDrag: () => {
    const dragState = get().wallGeometryDragState;
    if (!dragState) {
      return;
    }
    set({
      graph: dragState.initialGraphSnapshot,
      wallGeometryDragState: null,
    });
  },
  deleteWall: (id) => {
    set((state) => {
      const newGraph = deepCopyGraph(state.graph);
      removeWallFromGraph(newGraph, id);
      const shouldClearSelection = state.selectedWallId === id;
      return {
        graph: newGraph,
        selectedWallId: shouldClearSelection ? null : state.selectedWallId,
      };
    });
    get().saveToHistory();
  },
  updateWallGeometry: (wallId: string, options: WallGeometryUpdateOptions) => {
    const {
      lengthPixels,
      angleRadians,
      thickness,
      anchor = 'start',
      commit = true,
    } = options;

    set((state) => {
      const existingWall = state.graph.edges[wallId];
      if (!existingWall) {
        return {};
      }

      const graphCopy = deepCopyGraph(state.graph);
      const wall = graphCopy.edges[wallId];
      if (!wall) {
        return {};
      }

      const resolvedAnchor: WallGeometryAnchor = anchor;
      const anchorNodeId = resolvedAnchor === 'start' ? wall.startNodeId : wall.endNodeId;
      const movingNodeId = resolvedAnchor === 'start' ? wall.endNodeId : wall.startNodeId;
      const anchorNode = graphCopy.nodes[anchorNodeId];
      const movingNode = graphCopy.nodes[movingNodeId];

      if (!anchorNode || !movingNode) {
        return {};
      }

      // wall.length is now in meters, convert to pixels for positioning calculations
      const currentLengthPixels = metersToPixels(wall.length);
      const currentAngle = wall.angle;

      const nextLength = typeof lengthPixels === 'number' && Number.isFinite(lengthPixels)
        ? Math.max(lengthPixels, MIN_WALL_LENGTH_PIXELS)
        : currentLengthPixels;
      const nextAngle = typeof angleRadians === 'number' && Number.isFinite(angleRadians)
        ? angleRadians
        : currentAngle;

      const deltaX = Math.cos(nextAngle) * nextLength;
      const deltaY = Math.sin(nextAngle) * nextLength;

      const anchorPosition = anchorNode.position;
      const newMovingPosition: Point =
        resolvedAnchor === 'start'
          ? [anchorPosition[0] + deltaX, anchorPosition[1] + deltaY]
          : [anchorPosition[0] - deltaX, anchorPosition[1] - deltaY];

      updateNodePosition(graphCopy, movingNodeId, newMovingPosition);

      if (typeof thickness === 'number' && Number.isFinite(thickness)) {
        wall.thickness = thickness;
      }

      synchronizeWallWithNodes(graphCopy, wallId);
      normalizeWallOpeningsAfterGeometryChange(graphCopy, wallId);

      const movingNodeRef = graphCopy.nodes[movingNodeId];
      if (movingNodeRef) {
        movingNodeRef.connectedEdges.forEach((edgeId) => {
          if (edgeId === wallId) {
            return;
          }
          normalizeWallOpeningsAfterGeometryChange(graphCopy, edgeId);
        });
      }

      return { graph: graphCopy };
    });
    if (commit) {
      get().saveToHistory();
    }
  },
  translateWalls: (wallIds, delta) => {
    if (!wallIds.length) {
      return;
    }
    const dx = Number.isFinite(delta[0]) ? delta[0] : 0;
    const dy = Number.isFinite(delta[1]) ? delta[1] : 0;
    if (Math.abs(dx) < 0.0001 && Math.abs(dy) < 0.0001) {
      return;
    }

    set((state) => {
      const graphCopy = deepCopyGraph(state.graph);
      const nodesToMove = new Set<string>();

      wallIds.forEach((wallId) => {
        const wall = graphCopy.edges[wallId];
        if (wall) {
          nodesToMove.add(wall.startNodeId);
          nodesToMove.add(wall.endNodeId);
        }
      });

      if (!nodesToMove.size) {
        return {};
      }

      nodesToMove.forEach((nodeId) => {
        const node = graphCopy.nodes[nodeId];
        if (!node) {
          return;
        }
        const newPosition: Point = [node.position[0] + dx, node.position[1] + dy];
        updateNodePosition(graphCopy, nodeId, newPosition);
      });

      nodesToMove.forEach((nodeId) => updateConnectedEdgesForNode(graphCopy, nodeId));

      return { graph: graphCopy };
    });

    get().saveToHistory();
  },
  rotateWalls: (wallIds, deltaRadians) => {
    if (!wallIds.length || !Number.isFinite(deltaRadians) || Math.abs(deltaRadians) < 0.0001) {
      return;
    }

    set((state) => {
      const graphCopy = deepCopyGraph(state.graph);

      wallIds.forEach((wallId) => {
        const wall = graphCopy.edges[wallId];
        if (!wall) {
          return;
        }
        const targetAngle = wall.angle + deltaRadians;
        // wall.length is in meters, convert to pixels for positioning
        const wallLengthPixels = metersToPixels(wall.length);
        repositionWallAroundCenter(graphCopy, wall, targetAngle, wallLengthPixels);
      });

      return { graph: graphCopy };
    });

    get().saveToHistory();
  },
  setWallLength: (wallId, lengthPixels) => {
    if (!wallId || !Number.isFinite(lengthPixels)) {
      return;
    }

    set((state) => {
      const graphCopy = deepCopyGraph(state.graph);
      const wall = graphCopy.edges[wallId];
      if (!wall) {
        return {};
      }

      // lengthPixels is in pixels, use directly for positioning
      // synchronizeWallWithNodes will convert to meters when storing
      repositionWallAroundCenter(graphCopy, wall, wall.angle, lengthPixels);

      return { graph: graphCopy };
    });

    get().saveToHistory();
  },
  setWallAngle: (wallId, angleRadians) => {
    if (!wallId || !Number.isFinite(angleRadians)) {
      return;
    }

    set((state) => {
      const graphCopy = deepCopyGraph(state.graph);
      const wall = graphCopy.edges[wallId];
      if (!wall) {
        return {};
      }

      repositionWallAroundCenter(graphCopy, wall, angleRadians, wall.length);

      return { graph: graphCopy };
    });

    get().saveToHistory();
  },
  setSnapOptions: (options) => {
    set((state) => ({
      snapOptions: {
        ...state.snapOptions,
        ...options,
      },
    }));
  },
  setUnitSystem: (system) => {
    set((state) => ({
      unitSystem: system,
      snapOptions: {
        ...state.snapOptions,
        gridSize: getGridSizeForUnitSystem(system), // Update grid size when unit system changes
      },
    }));
    // Persist to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferredUnitSystem', system);
    }
  },
  snapPoint: (point: Point) => {
    const { snapOptions, graph } = get();
    const snapResult = findSnapPointForDrawing(point, graph, snapOptions);
    return snapResult.point;
  },
  assignWallsToLayer: (wallIds, layerId) => {
    if (!wallIds.length) {
      return;
    }
    
    set((state) => {
      const graphCopy = deepCopyGraph(state.graph);
      wallIds.forEach((wallId) => {
        const wall = graphCopy.edges[wallId];
        if (wall) {
          wall.layer = layerId;
        }
      });
      return { graph: graphCopy };
    });
    
    get().saveToHistory();
  },
  splitWallAtPoint: (wallId, point) => {
    const state = get();
    const wasSelected = state.selectedWallIds.includes(wallId) || state.selectedWallId === wallId;

    const result = splitWallAtPointUtil(
      wallId,
      point,
      state.graph,
      () => `node-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      () => `wall-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    );

    if (!result) {
      return null;
    }

    set((currentState) => {
      const newGraph = deepCopyGraph(currentState.graph);

      // Get original wall before modification
      const originalWall = newGraph.edges[wallId];
      if (!originalWall) {
        return {};
      }

      // Add new node at intersection
      const newNode: WallNode = {
        id: result.newNodeId,
        position: [...point] as Point,
        connectedEdges: [wallId, result.wall2.id]
      };
      newGraph.nodes[result.newNodeId] = newNode;

      // Update start node - remove old wall connection, add wall1 connection
      const startNode = newGraph.nodes[originalWall.startNodeId];
      if (startNode) {
        // Start node already has wallId in its connections, no change needed
      }

      // Update old end node - remove old wall connection, add wall2 connection
      const oldEndNode = newGraph.nodes[originalWall.endNodeId];
      if (oldEndNode) {
        oldEndNode.connectedEdges = oldEndNode.connectedEdges.filter(id => id !== wallId);
        oldEndNode.connectedEdges.push(result.wall2.id);
      }

      // Update wall1 (replaces original wall at same ID)
      newGraph.edges[wallId] = result.wall1;

      // Add wall2 (new segment)
      newGraph.edges[result.wall2.id] = result.wall2;

      // Preserve selection state if wall was selected
      const updates: Partial<typeof currentState> = { graph: newGraph };
      if (wasSelected) {
        // Keep both segments selected
        updates.selectedWallIds = [
          ...currentState.selectedWallIds.filter(id => id !== wallId),
          result.wall1.id,
          result.wall2.id
        ];
        // Clear single selection in favor of multi-selection
        if (currentState.selectedWallId === wallId) {
          updates.selectedWallId = null;
        }
      }

      return updates;
    });

    get().saveToHistory();
    return result;
  },
  splitWallsAtIntersections: (startPoint, endPoint) => {
    const graph = get().graph;

    // Find intersections at both endpoints
    const startIntersections = findIntersectingWalls(startPoint, graph);
    const endIntersections = findIntersectingWalls(endPoint, graph);

    // Split walls at intersections
    startIntersections.forEach(intersection => {
      get().splitWallAtPoint(intersection.wallId, intersection.intersectionPoint);
    });

    endIntersections.forEach(intersection => {
      get().splitWallAtPoint(intersection.wallId, intersection.intersectionPoint);
    });
  },
  };
};

