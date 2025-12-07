/**
 * Opening slice coordinating door and window selection, sizing, and drag interactions
 * Manages opening tool state, preview, dimensions, orientation, alignment, and drag operations
 * Handles opening creation, updates, deletion, and position calculations
 */
import { timeAction } from '../../utils/performanceUtils';
import { deepCopyGraph } from '../../utils/graphUtils';
import { findClosestPointOnLine } from '../../utils/geometryUtils';
import {
  heightToMeters,
  pixelsToMeters,
  metersToPixels,
  sillHeightToMillimeters,
  userHeightToUnitMeters,
  userSillToMillimeters,
  millimetersToMeters,
} from '../../utils/unitConversions';
import type { Opening, Point } from '../../types/wallGraph';
import type { WallGraphStateCreator, OpeningSlice, WallGraphStore } from '../types';

const DOOR_SILL_HEIGHT = 0;
const MIN_OPENING_DISTANCE = 0.01;

const createOpeningId = () => `op-${Date.now()}`;

export const createOpeningSlice: WallGraphStateCreator<OpeningSlice> = (set, get) => ({
  openingPreviewPoint: null,
  openingPreviewDirection: null,
  openingPreviewWallId: null,
  doorOrientation: 'left-out',
  doorAlignment: 'center',
  windowAlignment: 'center',
  selectedOpeningId: null,
  selectedOpeningIds: [],
  isOpeningToolActive: false,
  activeOpeningType: null,
  sillHeight: 30,
  openingWidth: 36,
  openingHeight: 84,
  openingDragState: null,

  setOpeningToolActive: (active) => {
    set((state) => ({
      isOpeningToolActive: active,
      isToolActive: active ? false : state.isToolActive,
      // Clear active opening type when tool is deactivated
      activeOpeningType: active ? state.activeOpeningType : null,
    }));
  },
  setActiveOpeningType: (type) => {
    set({ activeOpeningType: type });
  },
  setOpeningPreview: (point, direction, wallId) => {
    set({
      openingPreviewPoint: point,
      openingPreviewDirection: direction,
      openingPreviewWallId: wallId ?? null
    });
  },
  setDoorOrientation: (orientation) => {
    let changed = false;
    set((state) => {
      const selectedIds = state.selectedOpeningIds;
      if (!selectedIds.length) {
        return { doorOrientation: orientation };
      }
      const graphCopy = deepCopyGraph(state.graph);
      Object.values(graphCopy.edges).forEach((edge) => {
        if (!edge?.openings?.length) {
          return;
        }
        edge.openings = edge.openings.map((opening) => {
          if (selectedIds.includes(opening.id) && opening.type === 'door') {
            changed = true;
            return { ...opening, orientation } as Opening;
          }
          return opening;
        });
      });
      return changed ? { doorOrientation: orientation, graph: graphCopy } : { doorOrientation: orientation };
    });
    if (changed) {
      get().saveToHistory();
    }
  },
  setDoorAlignment: (alignment) => {
    let changed = false;
    set((state) => {
      const selectedIds = state.selectedOpeningIds;
      if (!selectedIds.length) {
        return { doorAlignment: alignment };
      }
      const graphCopy = deepCopyGraph(state.graph);
      Object.values(graphCopy.edges).forEach((edge) => {
        if (!edge?.openings?.length) {
          return;
        }
        edge.openings = edge.openings.map((opening) => {
          if (selectedIds.includes(opening.id) && opening.type === 'door') {
            changed = true;
            return { ...opening, alignment } as Opening;
          }
          return opening;
        });
      });
      return changed ? { doorAlignment: alignment, graph: graphCopy } : { doorAlignment: alignment };
    });
    if (changed) {
      get().saveToHistory();
    }
  },
  setWindowAlignment: (alignment) => {
    let changed = false;
    set((state) => {
      const selectedIds = state.selectedOpeningIds;
      if (!selectedIds.length) {
        return { windowAlignment: alignment };
      }
      const graphCopy = deepCopyGraph(state.graph);
      Object.values(graphCopy.edges).forEach((edge) => {
        if (!edge?.openings?.length) {
          return;
        }
        edge.openings = edge.openings.map((opening) => {
          if (selectedIds.includes(opening.id) && opening.type === 'window') {
            changed = true;
            return { ...opening, alignment } as Opening;
          }
          return opening;
        });
      });
      return changed ? { windowAlignment: alignment, graph: graphCopy } : { windowAlignment: alignment };
    });
    if (changed) {
      get().saveToHistory();
    }
  },
  selectOpening: (id) => {
    set(() => {
      const next: Partial<WallGraphStore> = {
        selectedOpeningId: id,
        selectedOpeningIds: id ? [id] : [],
      };
      if (id) {
        next.selectedWallId = null;
        next.selectedWallIds = [];
      }
      return next;
    });
  },
  selectOpenings: (ids) => {
    set(() => {
      const next: Partial<WallGraphStore> = {
        selectedOpeningIds: ids,
        selectedOpeningId: ids.length === 1 ? ids[0] ?? null : null,
      };
      if (ids.length > 0) {
        next.selectedWallId = null;
        next.selectedWallIds = [];
      }
      return next;
    });
  },
  addOpeningToSelection: (id) => {
    set((state) => {
      if (state.selectedOpeningIds.includes(id)) {
        return {};
      }
      const nextIds = [...state.selectedOpeningIds, id];
      const nextState: Partial<WallGraphStore> = {
        selectedOpeningIds: nextIds,
        selectedOpeningId: state.selectedOpeningId ?? id,
      };
      if (state.selectedOpeningIds.length === 0) {
        nextState.selectedWallId = null;
        nextState.selectedWallIds = [];
      }
      return nextState;
    });
  },
  removeOpeningFromSelection: (id) => {
    set((state) => {
      const filtered = state.selectedOpeningIds.filter((openingId) => openingId !== id);
      return {
        selectedOpeningIds: filtered,
        selectedOpeningId: filtered.length === 1 ? filtered[0] ?? null : null,
      };
    });
  },
  clearOpeningSelection: () => {
    set({ selectedOpeningIds: [], selectedOpeningId: null });
  },
  updateSelectedOpeningsDimensions: (width, height) => {
    let changed = false;
    set((state) => {
      const selectedIds = state.selectedOpeningIds;
      if (!selectedIds.length) {
        return {};
      }
      const graphCopy = deepCopyGraph(state.graph);
      Object.values(graphCopy.edges).forEach((edge) => {
        if (!edge?.openings?.length) {
          return;
        }
        edge.openings = edge.openings.map((opening) => {
          if (!selectedIds.includes(opening.id)) {
            return opening;
          }
          const updated = { ...opening } as Opening;
          if (width !== undefined) {
            // width is in display units (inches or cm), convert to meters for storage
            const widthMeters = heightToMeters(width, state.unitSystem); // Reuse heightToMeters for width conversion
            updated.width = widthMeters; // Store in meters
            (updated as Opening & { userWidth?: number; unitSystem?: string }).userWidth = width;
            (updated as Opening & { userHeight?: number; unitSystem?: string }).unitSystem = state.unitSystem;
            changed = true;
          }
          if (height !== undefined) {
            // height is in display units (inches or cm), convert to meters for storage
            const heightMeters = heightToMeters(height, state.unitSystem);
            (updated as Opening & { userHeight?: number; unitSystem?: string }).userHeight = height;
            updated.height = heightMeters; // Store in meters
            (updated as Opening & { userHeight?: number; unitSystem?: string }).unitSystem = state.unitSystem;
            changed = true;
          }
          return updated;
        });
      });
      return changed ? { graph: graphCopy } : {};
    });
    if (changed) {
      get().saveToHistory();
    }
  },
  updateSelectedOpeningSillHeight: (sillHeight) => {
    let changed = false;
    set((state) => {
      const selectedIds = state.selectedOpeningIds;
      if (!selectedIds.length) {
        return {};
      }
      const graphCopy = deepCopyGraph(state.graph);
      const sillHeightMm = sillHeightToMillimeters(sillHeight, state.unitSystem);
      Object.values(graphCopy.edges).forEach((edge) => {
        if (!edge?.openings?.length) {
          return;
        }
        edge.openings = edge.openings.map((opening) => {
          if (!selectedIds.includes(opening.id) || opening.type !== 'window') {
            return opening;
          }
          changed = true;
          return {
            ...opening,
            sillHeight: sillHeightMm,
            userSillHeight: sillHeight,
            unitSystem: state.unitSystem,
          };
        });
      });
      return changed ? { graph: graphCopy } : {};
    });
    if (changed) {
      get().saveToHistory();
    }
  },
  deleteSelectedOpenings: () => {
    const selectedIds = get().selectedOpeningIds;
    if (!selectedIds.length) {
      return;
    }
    const graphCopy = deepCopyGraph(get().graph);
    let changed = false;
    Object.values(graphCopy.edges).forEach((edge) => {
      if (!edge?.openings?.length) {
        return;
      }
      const filtered = edge.openings.filter((opening) => !selectedIds.includes(opening.id));
      if (filtered.length !== edge.openings.length) {
        changed = true;
        edge.openings = filtered;
      }
    });
    if (changed) {
      set({
        graph: graphCopy,
        selectedOpeningId: null,
        selectedOpeningIds: [],
      });
      get().saveToHistory();
    }
  },
  setSillHeight: (height) => {
    set({ sillHeight: height });
  },
  setOpeningWidth: (width) => {
    set({ openingWidth: width });
  },
  setOpeningHeight: (height) => {
    set({ openingHeight: height });
  },
  addOpening: (wallId, position, type, width, sillHeight, userWidth, userHeight) => {
    const timedAddOpening = timeAction('addOpening', () => {
      set((state) => {
        const wall = state.graph.edges[wallId];
        if (!wall) {
          return state;
        }

        const startNode = state.graph.nodes[wall.startNodeId];
        const endNode = state.graph.nodes[wall.endNodeId];
        if (!startNode || !endNode) {
          console.warn('⚠️ Cannot add opening: wall nodes not found');
          return state;
        }

        const finalUserSillHeight = type === 'door' ? DOOR_SILL_HEIGHT : sillHeight ?? state.sillHeight;
        const finalSillHeightMm =
          type === 'door'
            ? DOOR_SILL_HEIGHT
            : sillHeightToMillimeters(finalUserSillHeight, state.unitSystem);

        const finalUserWidth = userWidth ?? state.openingWidth;
        const finalUserHeight = userHeight ?? state.openingHeight;

        // Convert user input to meters for storage
        // finalUserWidth is in inches (imperial) or cm (metric)
        const openingWidthM = heightToMeters(finalUserWidth, state.unitSystem); // Reuse heightToMeters for width conversion
        let openingHeightM = heightToMeters(finalUserHeight, state.unitSystem);

        const start = startNode.position as Point;
        const end = endNode.position as Point;
        const wallVector: [number, number] = [end[0] - start[0], end[1] - start[1]];
        const wallLengthPixels = Math.sqrt(wallVector[0] ** 2 + wallVector[1] ** 2);
        const wallLengthMeters = pixelsToMeters(wallLengthPixels);

        if (wallLengthMeters <= MIN_OPENING_DISTANCE) {
          console.warn('⚠️ Cannot add opening: wall has zero length');
          return state;
        }

        // position is in meters (from wall.length which is in meters)
        // Convert to pixels for 2D center calculation
        const positionPixels = metersToPixels(position); // Convert meters to pixels
        const directionX = wallVector[0] / wallLengthPixels;
        const directionY = wallVector[1] / wallLengthPixels;
        const center2D: Point = [
          start[0] + directionX * positionPixels,
          start[1] + directionY * positionPixels,
        ];

        // wallHeight is already in METERS (per units fix plan)
        const wallHeightM = state.wallHeight;
        const openingSillHeightM = millimetersToMeters(finalSillHeightMm);

        if (type === 'door') {
          openingHeightM = Math.min(openingHeightM, wallHeightM);
        } else {
          const totalWindowHeight = openingSillHeightM + openingHeightM;
          if (totalWindowHeight > wallHeightM) {
            openingHeightM = Math.max(0, wallHeightM - openingSillHeightM);
            console.warn(
              `⚠️ Window height reduced to fit within wall. Sill: ${openingSillHeightM.toFixed(3)}m, Max opening: ${openingHeightM.toFixed(3)}m`
            );
          }
        }

        const center3D: [number, number, number] = [
          pixelsToMeters(center2D[0]),
          type === 'door' ? openingHeightM / 2 : openingSillHeightM + openingHeightM / 2,
          pixelsToMeters(center2D[1]),
        ];

        // Inherit layerId from parent wall (default to 'default' if wall has no layer)
        const wallLayerId = wall.layer || 'default';

        const newOpening: Opening = {
          id: createOpeningId(),
          wallId,
          position, // Already in meters
          type,
          width: openingWidthM, // Store in meters
          sillHeight: finalSillHeightMm,
          ...(type === 'door'
            ? { orientation: state.doorOrientation, alignment: state.doorAlignment }
            : { alignment: state.windowAlignment }),
          userWidth: finalUserWidth,
          userHeight: finalUserHeight,
          userSillHeight: finalUserSillHeight,
          unitSystem: state.unitSystem,
          center2D,
          center3D,
          angle: wall.angle,
          height: openingHeightM,
          layerId: wallLayerId, // Inherit from parent wall
        };

        const newGraph = {
          nodes: { ...state.graph.nodes },
          edges: {
            ...state.graph.edges,
            [wallId]: {
              ...wall,
              centerline: [[...wall.centerline[0]], [...wall.centerline[1]]] as [Point, Point],
              openings: [...(wall.openings || []), newOpening],
            },
          },
        };

        return { graph: newGraph };
      });
      get().saveToHistory();
    });
    timedAddOpening();
  },
  beginOpeningDrag: (wallId, openingId) => {
    const state = get();
    const wall = state.graph.edges[wallId];
    if (!wall) {
      return;
    }
    const opening = wall.openings?.find((item) => item.id === openingId);
    if (!opening) {
      return;
    }
    set({
      openingDragState: {
        wallId,
        openingId,
        initialPosition: opening.position,
        hasMoved: false,
      },
    });
  },
  updateOpeningPositionFromPoint: (wallId, openingId, point) => {
    const state = get();
    const wall = state.graph.edges[wallId];
    if (!wall) {
      return;
    }
    const opening = wall.openings?.find((item) => item.id === openingId);
    if (!opening) {
      return;
    }

    const startNode = state.graph.nodes[wall.startNodeId];
    const endNode = state.graph.nodes[wall.endNodeId];
    if (!startNode || !endNode) {
      return;
    }

    const closest = findClosestPointOnLine(startNode.position, endNode.position, point);
    const projectedPosition = Math.max(0, Math.min(1, closest.t)) * wall.length;

    const halfWidth = opening.width / 2;
    const minPosition = Math.min(wall.length, Math.max(0, halfWidth));
    const maxPosition = Math.max(minPosition, wall.length - halfWidth);
    const clampedPosition = Math.max(minPosition, Math.min(maxPosition, projectedPosition));

    if (Math.abs(clampedPosition - opening.position) < MIN_OPENING_DISTANCE) {
      return;
    }

    const wallVectorX = endNode.position[0] - startNode.position[0];
    const wallVectorY = endNode.position[1] - startNode.position[1];
    const directionX = wallVectorX / wall.length;
    const directionY = wallVectorY / wall.length;
    const normalX = -directionY;
    const normalY = directionX;

    const alignment = opening.alignment ?? 'center';
    const alignmentOffset = alignment === 'inner' ? wall.thickness / 2 : alignment === 'outer' ? -wall.thickness / 2 : 0;

    const center2D: Point = [
      startNode.position[0] + directionX * clampedPosition + normalX * alignmentOffset,
      startNode.position[1] + directionY * clampedPosition + normalY * alignmentOffset,
    ];

    const openingUnitSystem = opening.unitSystem ?? state.unitSystem;
    const fallbackHeightMeters = heightToMeters(state.openingHeight, state.unitSystem);
    const computedHeightMeters = userHeightToUnitMeters(opening.userHeight, openingUnitSystem, fallbackHeightMeters);

    const defaultSillHeightMm = sillHeightToMillimeters(state.sillHeight, state.unitSystem);
    const sillHeightMm =
      opening.type === 'door'
        ? DOOR_SILL_HEIGHT
        : userSillToMillimeters(opening.userSillHeight, openingUnitSystem, state.unitSystem, state.sillHeight);

    const sillHeightMeters = millimetersToMeters(sillHeightMm);
    const heightMeters = Math.max(0, opening.height ?? computedHeightMeters);
    const center3DY = opening.type === 'door' ? heightMeters / 2 : sillHeightMeters + heightMeters / 2;

    const updatedOpening: Opening = {
      ...opening,
      position: clampedPosition,
      center2D,
      center3D: [pixelsToMeters(center2D[0]), center3DY, pixelsToMeters(center2D[1])],
      angle: wall.angle,
    };

    const graphCopy = deepCopyGraph(state.graph);
    const wallCopy = graphCopy.edges[wallId];
    if (!wallCopy) {
      return;
    }

    const updatedOpenings = (wallCopy.openings || []).map((existing) => (existing.id === openingId ? { ...existing, ...updatedOpening } : existing));
    graphCopy.edges[wallId] = {
      ...wallCopy,
      openings: updatedOpenings as Opening[],
    };

    set((prevState) => ({
      graph: graphCopy,
      openingDragState:
        prevState.openingDragState &&
        prevState.openingDragState.wallId === wallId &&
        prevState.openingDragState.openingId === openingId
          ? { ...prevState.openingDragState, hasMoved: true }
          : prevState.openingDragState,
    }));
  },
  finishOpeningDrag: () => {
    const dragState = get().openingDragState;
    if (!dragState) {
      return;
    }
    set({ openingDragState: null });
    if (dragState.hasMoved) {
      get().saveToHistory();
    }
  },
  assignOpeningsToLayer: (openingIds, layerId) => {
    if (!openingIds.length) {
      return;
    }
    
    set((state) => {
      const graphCopy = deepCopyGraph(state.graph);
      let changed = false;
      
      Object.values(graphCopy.edges).forEach((wall) => {
        if (!wall.openings?.length) {
          return;
        }
        
        wall.openings = wall.openings.map((opening) => {
          if (openingIds.includes(opening.id)) {
            changed = true;
            return { ...opening, layerId } as Opening;
          }
          return opening;
        });
      });
      
      return changed ? { graph: graphCopy } : state;
    });
    
    get().saveToHistory();
  },
});

