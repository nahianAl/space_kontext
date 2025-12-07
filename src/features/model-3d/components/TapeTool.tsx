/**
 * Tape Measure Tool for 3D CAD mode
 * - Measures distance between two clicked points
 * - Displays measurements as floating 3D text labels
 * - Supports continuous measurement mode
 * - Can create guide lines at measured distances
 */
'use client';

import React from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { Text, Line as DreiLine } from '@react-three/drei';
import { useCADToolsStore } from '../store/cadToolsStore';
import { useThreeSceneStore } from '../store/threeSceneStore';
import { generateAllSnapCandidates } from '../utils/snapCandidateGenerator';
import { snapPoint } from '../utils/snapping';
import { formatMetersAsImperial, formatMetersAsMetric } from '@/lib/units/unitsSystem';
import { useWallGraphStoreContext } from '@/features/floorplan-2d/context/WallGraphStoreContext';

interface MeasurementData {
  id: string;
  startPoint: THREE.Vector3;
  endPoint: THREE.Vector3;
  distance: number;
  midPoint: THREE.Vector3;
}

interface TempMeasurement {
  startPoint: THREE.Vector3;
  currentPoint: THREE.Vector3;
}

const MEASUREMENT_LINE_COLOR = '#000000'; // Black lines
const PREVIEW_LINE_COLOR = '#666666'; // Gray for preview
const MARKER_COLOR = '#000000'; // Black markers
const TEXT_COLOR = '#000000';
const TEXT_BG_COLOR = '#FFFFFF'; // White background for labels
const DOT_RADIUS = 0.04; // Size of endpoint dots (reduced from 0.06)
const LINE_WIDTH = 1.5; // Thinner but legible lines (reduced from 3)
const TEXT_OFFSET = 0.2; // Distance to offset text from endpoint

/**
 * Convert distance (in meters) to display string with appropriate units
 * Uses the unit system from the wall graph store
 */
const formatDistance = (distance: number, unitSystem: 'imperial' | 'metric'): string => {
  if (unitSystem === 'imperial') {
    return formatMetersAsImperial(distance);
  }
  return formatMetersAsMetric(distance);
};

/**
 * Calculate text position and rotation to be parallel to measurement line
 * Positions text near the endpoint with proper orientation
 */
const getTextTransform = (
  startPoint: THREE.Vector3,
  endPoint: THREE.Vector3,
  offset: number = TEXT_OFFSET
): { position: [number, number, number]; rotation: [number, number, number] } => {
  // Calculate line direction in XZ plane (ignore Y for ground alignment)
  const direction = new THREE.Vector3()
    .subVectors(endPoint, startPoint);

  // Project to XZ plane and normalize
  const directionXZ = new THREE.Vector3(direction.x, 0, direction.z).normalize();

  // Calculate perpendicular offset direction (90 degrees to the right in XZ plane)
  const perpendicular = new THREE.Vector3(-directionXZ.z, 0, directionXZ.x);

  // Position text near endpoint, offset perpendicular to the line
  const offsetPosition = endPoint.clone().add(perpendicular.multiplyScalar(offset));

  // Calculate rotation angle around Y axis
  // Add PI to flip text right-side up when laying flat on ground
  const angle = Math.atan2(directionXZ.x, directionXZ.z) + Math.PI;

  // Return position and rotation
  // Rotation: [-90° on X to lay flat on ground, angle on Y to align with line, 0 on Z]
  return {
    position: [offsetPosition.x, 0.02, offsetPosition.z],
    rotation: [-Math.PI / 2, angle, 0],
  };
};


export const TapeTool = () => {
  const activeTool = useCADToolsStore((state) => state.activeTool);
  const cadObjects = useCADToolsStore((state) => state.objects);
  const snapSettings = useCADToolsStore((state) => state.snapSettings);
  const gridSize = useCADToolsStore((state) => state.gridSize);
  const tapeState = useCADToolsStore((state) => state.tapeState);
  const setTapeStart = useCADToolsStore((state) => state.setTapeStart);
  const setTapeEnd = useCADToolsStore((state) => state.setTapeEnd);
  const updateTapeDistance = useCADToolsStore((state) => state.updateTapeDistance);
  const useWallGraphStore = useWallGraphStoreContext();
  const unitSystem = useWallGraphStore((state) => state.unitSystem);
  const cancelTape = useCADToolsStore((state) => state.cancelTape);
  const wallMeshes = useThreeSceneStore((state) => state.meshes);
  const { camera, gl, raycaster, controls, size } = useThree((state) => ({
    camera: state.camera,
    gl: state.gl,
    raycaster: state.raycaster,
    controls: state.controls as THREE.EventDispatcher & { enabled?: boolean } | undefined,
    size: state.size,
  }));

  // Store all completed measurements
  const [measurements, setMeasurements] = React.useState<MeasurementData[]>([]);
  // Track cursor position for preview
  const [cursorPoint, setCursorPoint] = React.useState<THREE.Vector3 | null>(null);

  const measurementIdCounter = React.useRef(0);
  const mouseRef = React.useRef(new THREE.Vector2());

  const setOrbitControlsEnabled = React.useCallback(
    (enabled: boolean) => {
      if (controls && 'enabled' in controls) {
        (controls as { enabled: boolean }).enabled = enabled;
      }
    },
    [controls]
  );

  /**
   * Raycast to find intersection point in 3D space
   * Checks CAD objects, wall meshes, and ground plane
   * Applies snapping to the result
   */
  const getIntersectionPoint = React.useCallback(
    (event: PointerEvent | MouseEvent): THREE.Vector3 | null => {
      const rect = gl.domElement.getBoundingClientRect();
      const mouse = mouseRef.current;
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      let rawPoint: THREE.Vector3 | null = null;

      // Check CAD objects
      const cadMeshes = cadObjects.map((obj) => obj.mesh);
      const cadIntersects = raycaster.intersectObjects(cadMeshes, false);
      if (cadIntersects.length > 0 && cadIntersects[0]) {
        rawPoint = cadIntersects[0].point.clone();
      }

      // Check wall meshes if no CAD object hit
      if (!rawPoint) {
        const wallIntersects = raycaster.intersectObjects(wallMeshes, false);
        if (wallIntersects.length > 0 && wallIntersects[0]) {
          rawPoint = wallIntersects[0].point.clone();
        }
      }

      // Check ground plane (y=0) if nothing else hit
      if (!rawPoint) {
        const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const intersectionPoint = new THREE.Vector3();
        const hit = raycaster.ray.intersectPlane(groundPlane, intersectionPoint);
        if (hit) {
          rawPoint = intersectionPoint.clone();
        }
      }

      if (!rawPoint) {
        useCADToolsStore.setState({ activeSnap: null });
        return null;
      }

      // Apply snapping to the intersection point
      const candidates = generateAllSnapCandidates(cadObjects, wallMeshes, rawPoint);
      const snapResult = snapPoint(
        rawPoint,
        candidates,
        {
          settings: snapSettings,
          gridSize: gridSize,
          objectSnapDistance: 0.2,
          hitFace: true, // We hit a face/ground to get this point
        },
        camera,
        size.width,
        size.height
      );

      // Update snap indicator
      useCADToolsStore.setState({ activeSnap: snapResult });

      // Use snapped point
      return snapResult.point;
    },
    [camera, gl, raycaster, cadObjects, wallMeshes, snapSettings, gridSize, size]
  );

  /**
   * Handle pointer down - start a new measurement
   */
  const handlePointerDown = React.useCallback(
    (event: PointerEvent) => {
      if (activeTool !== 'tape') {
        return;
      }
      if (event.button !== 0) {
        return; // Left click only
      }

      const point = getIntersectionPoint(event);
      if (!point) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (!tapeState.active) {
        // Start new measurement
        console.log('[TapeTool] Starting measurement at:', point);
        setTapeStart(point);
        setOrbitControlsEnabled(false);
      } else {
        // Complete measurement
        console.log('[TapeTool] Completing measurement at:', point);

        // Store completed measurement in local history
        if (tapeState.startPoint) {
          const distance = tapeState.startPoint.distanceTo(point);
          const midPoint = new THREE.Vector3()
            .addVectors(tapeState.startPoint, point)
            .multiplyScalar(0.5);

          const newMeasurement: MeasurementData = {
            id: `measurement-${measurementIdCounter.current++}`,
            startPoint: tapeState.startPoint.clone(),
            endPoint: point.clone(),
            distance,
            midPoint,
          };

          setMeasurements((prev) => [...prev, newMeasurement]);
        }

        // Reset tape state to disengage measurement
        cancelTape();
        setCursorPoint(null);
        setOrbitControlsEnabled(true);
      }
    },
    [activeTool, tapeState, getIntersectionPoint, setOrbitControlsEnabled, setTapeStart, setTapeEnd, cancelTape]
  );

  /**
   * Handle pointer move - update cursor position and temp measurement preview
   */
  const handlePointerMove = React.useCallback(
    (event: PointerEvent) => {
      if (activeTool !== 'tape') {
        return;
      }

      const point = getIntersectionPoint(event);
      if (!point) {
        setCursorPoint(null);
        return;
      }

      // Always update cursor position
      setCursorPoint(point.clone());

      // Update tape measurement if one is active
      if (tapeState.active && tapeState.startPoint) {
        console.log('[TapeTool] Updating preview to:', point);
        const distance = tapeState.startPoint.distanceTo(point);
        setTapeEnd(point);
        updateTapeDistance(distance);
      }
    },
    [activeTool, tapeState, getIntersectionPoint, setTapeEnd, updateTapeDistance]
  );

  /**
   * Handle escape key - cancel current measurement
   */
  const handleKeyDown = React.useCallback(
    (event: KeyboardEvent) => {
      if (activeTool !== 'tape') {
        return;
      }

      if (event.key === 'Escape') {
        cancelTape();
        setOrbitControlsEnabled(true);
        useCADToolsStore.setState({ activeSnap: null });
      } else if (event.key === 'c' || event.key === 'C') {
        // Clear all measurements
        setMeasurements([]);
        cancelTape();
        setOrbitControlsEnabled(true);
        useCADToolsStore.setState({ activeSnap: null });
      }
    },
    [activeTool, setOrbitControlsEnabled, cancelTape]
  );

  // Clean up when tool changes
  React.useEffect(() => {
    if (activeTool !== 'tape') {
      // Clear measurements when tool is deactivated
      setMeasurements([]);
      useCADToolsStore.getState().cancelTape();
      setCursorPoint(null);
      setOrbitControlsEnabled(true);
      useCADToolsStore.setState({ activeSnap: null });
    }
  }, [activeTool, setOrbitControlsEnabled]);

  // Attach event listeners
  React.useEffect(() => {
    if (activeTool !== 'tape') {
      return;
    }

    const canvas = gl.domElement;
    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeTool, handlePointerDown, handlePointerMove, handleKeyDown, gl]);

  // Don't render anything if tool is not active
  if (activeTool !== 'tape') {
    return null;
  }

  console.log('[TapeTool] Rendering - tapeState.active:', tapeState.active, 'cursorPoint:', !!cursorPoint);

  return (
    <group name="tape-tool">
      {/* Cursor indicator - small sphere that follows mouse */}
      {cursorPoint && (
        <mesh position={cursorPoint.toArray()}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#FF0000" opacity={0.5} transparent />
        </mesh>
      )}

      {/* Render completed measurements */}
      {measurements.map((measurement) => {
        const direction = new THREE.Vector3()
          .subVectors(measurement.endPoint, measurement.startPoint)
          .normalize();
        const length = measurement.distance;

        return (
          <group key={measurement.id}>
            {/* Measurement line */}
            <DreiLine
              points={[
                measurement.startPoint.toArray(),
                measurement.endPoint.toArray(),
              ]}
              color={MEASUREMENT_LINE_COLOR}
              lineWidth={LINE_WIDTH}
            />

            {/* Start point dot */}
            <mesh position={measurement.startPoint.toArray()}>
              <sphereGeometry args={[DOT_RADIUS, 16, 16]} />
              <meshBasicMaterial color={MARKER_COLOR} />
            </mesh>

            {/* End point dot */}
            <mesh position={measurement.endPoint.toArray()}>
              <sphereGeometry args={[DOT_RADIUS, 16, 16]} />
              <meshBasicMaterial color={MARKER_COLOR} />
            </mesh>

            {/* Text label parallel to line and offset for visibility */}
            {(() => {
              const { position, rotation } = getTextTransform(
                measurement.startPoint,
                measurement.endPoint
              );
              return (
                <Text
                  position={position}
                  rotation={rotation}
                  fontSize={0.25}
                  color={TEXT_COLOR}
                  anchorX="center"
                  anchorY="middle"
                  outlineWidth={0.02}
                  outlineColor={TEXT_BG_COLOR}
                >
                  {formatDistance(measurement.distance, unitSystem)}
                </Text>
              );
            })()}
          </group>
        );
      })}

      {/* Render temporary measurement preview */}
      {tapeState.active && tapeState.startPoint && tapeState.endPoint && (
        <group name="temp-measurement" key={`preview-${Date.now()}`}>
          {/* Preview line using drei Line for better updates */}
          <DreiLine
            points={[
              tapeState.startPoint.toArray(),
              tapeState.endPoint.toArray(),
            ]}
            color={MEASUREMENT_LINE_COLOR}
            lineWidth={LINE_WIDTH}
            opacity={0.5}
            transparent={true}
          />

          {/* Start point dot */}
          <mesh position={tapeState.startPoint.toArray()}>
            <sphereGeometry args={[DOT_RADIUS, 16, 16]} />
            <meshBasicMaterial color={MARKER_COLOR} opacity={0.5} transparent />
          </mesh>

          {/* Current point dot */}
          <mesh position={tapeState.endPoint.toArray()}>
            <sphereGeometry args={[DOT_RADIUS, 16, 16]} />
            <meshBasicMaterial color={MARKER_COLOR} opacity={0.5} transparent />
          </mesh>

          {/* Preview distance label parallel to line */}
          {(() => {
            const { position, rotation } = getTextTransform(
              tapeState.startPoint,
              tapeState.endPoint
            );

            return (
              <Text
                position={position}
                rotation={rotation}
                fontSize={0.25}
                color={TEXT_COLOR}
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.02}
                outlineColor={TEXT_BG_COLOR}
              >
                {formatDistance(tapeState.distance, unitSystem)}
              </Text>
            );
          })()}
        </group>
      )}
    </group>
  );
};
