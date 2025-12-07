/**
 * Three.js canvas component using React Three Fiber
 * Sets up the 3D scene with OrbitControls, Grid, and wall/opening rendering
 * Provides the 3D viewport for visualizing floorplans
 */
'use client';

import React from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { getWallGraphStore } from '@/features/floorplan-2d/store/wallGraphStore';
import { WallGenerator, RenderWalls, RenderOpenings } from './WallGenerator';
import { FloorGenerator, RenderFloors } from './FloorGenerator';
import { RenderCADObjects } from './RenderCADObjects';
import { TransformGizmo } from './TransformGizmo';
import { WallTransformGizmo } from './WallTransformGizmo';
import { useCADToolsStore } from '../store/cadToolsStore';
import { createCADObject } from '../utils/shapeGenerators';
import type { ShapeType } from '../store/cadToolsStore';
import * as THREE from 'three';
import { SnapIndicators } from './SnapIndicators';
import { PushPullTool } from './PushPullTool';
import { RectangleTool } from './RectangleTool';
import { LineTool } from './LineTool';
import { PolygonTool } from './PolygonTool';
import { ArcTool } from './ArcTool';
import { CircleTool } from './CircleTool';
import { BooleanTool } from './BooleanTool';
import { OffsetTool } from './OffsetTool';
import { TapeTool } from './TapeTool';
import { useSunLight } from '../hooks/useSunLight';
import { useSunPathStore } from '../store/sunPathStore';
import { useThreeSceneStore } from '../store/threeSceneStore';
import { DragSelectBox, DragSelectBoxOverlay } from './DragSelectBox';
import { RenderPlacedSketchfabModels } from '@/features/sketchfab/components/PlacedSketchfabModel';

interface ThreeCanvasProps {
  projectId: string;
}

const AxesLines = () => {
  const axisLength = 400;
  const positions = React.useMemo(() => {
    const offset = 0.05;
    return new Float32Array([
      -axisLength, offset, 0, axisLength, offset, 0,
      0, -axisLength + offset, 0, 0, axisLength + offset, 0,
      0, offset, -axisLength, 0, offset, axisLength,
    ]);
  }, [axisLength]);

  const colors = React.useMemo(
    () =>
      new Float32Array([
        0.45, 0.35, 0.35, 0.45, 0.35, 0.35, // X axis (deep muted red)
        0.35, 0.45, 0.35, 0.35, 0.45, 0.35, // Y axis (deep muted green)
        0.35, 0.40, 0.55, 0.35, 0.40, 0.55, // Z axis (deep muted blue)
      ]),
    []
  );

  return (
    <group renderOrder={999} position={[0, 0.01, 0]} frustumCulled={false}>
      <lineSegments frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={positions}
            itemSize={3}
          />
          <bufferAttribute attach="attributes-color" array={colors} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          linewidth={1}
          transparent
          opacity={0.45}
          depthTest={false}
          depthWrite={false}
          toneMapped={false}
          polygonOffset
          polygonOffsetFactor={-1}
          polygonOffsetUnits={-1}
        />
      </lineSegments>
    </group>
  );
};

const SceneLighting = () => {
  // Default coordinates: Denver, Colorado
  const DEFAULT_LATITUDE = 39.72656773584472;
  const DEFAULT_LONGITUDE = -104.65310681881742;

  // Get month and time of day from store
  const month = useSunPathStore((state) => state.month);
  const timeOfDay = useSunPathStore((state) => state.timeOfDay);

  const { position, intensity, isDaytime } = useSunLight({
    latitude: DEFAULT_LATITUDE,
    longitude: DEFAULT_LONGITUDE,
    month,
    timeOfDay,
    lightDistance: 50,
  });

  // Use ref to configure the light's shadow camera
  const lightRef = React.useRef<THREE.DirectionalLight>(null);
  const { scene } = useThree();

  React.useEffect(() => {
    if (lightRef.current) {
      // Configure shadow camera to look at the scene center
      lightRef.current.shadow.camera.left = -50;
      lightRef.current.shadow.camera.right = 50;
      lightRef.current.shadow.camera.top = 50;
      lightRef.current.shadow.camera.bottom = -50;
      lightRef.current.shadow.camera.near = 0.1;
      lightRef.current.shadow.camera.far = 200;
      lightRef.current.shadow.camera.updateProjectionMatrix();

      // Set light target to scene center (where objects are)
      lightRef.current.target.position.set(0, 0, 0);
      lightRef.current.target.updateMatrixWorld();

      // Add target to scene if not already added
      if (!scene.getObjectByName('light-target')) {
        lightRef.current.target.name = 'light-target';
        scene.add(lightRef.current.target);
      }

      // Update light position to ensure it's looking at the target
      lightRef.current.position.set(...position);
      lightRef.current.updateMatrixWorld();
    }
  }, [position, scene]);

  return (
    <>
      {/* Hemisphere light for more realistic ambient fill - simulates sky and ground bounce */}
      <hemisphereLight
        color="#b8d4ff"        // Sky color (soft blue)
        groundColor="#8b7355"  // Ground bounce color (warm earth tone)
        intensity={isDaytime ? 1.2 : 0.4}  // Significantly increased for shadow-side visibility
        position={[0, 50, 0]}
      />

      {/* Ambient light for global fill - ensures shadow sides aren't completely black */}
      <ambientLight
        intensity={isDaytime ? 0.35 : 0.15}  // Increased to illuminate shadow-facing surfaces
        color="#e8f4ff"  // Slightly cool tone to simulate sky bounce
      />

      {/* Main directional sunlight with optimized shadow settings */}
      <directionalLight
        ref={lightRef}
        position={position}
        intensity={Math.max(intensity * 1.2, 1.5)}  // Reduced slightly since ambient is higher
        color="#fff8e1"
        castShadow
        shadow-mapSize={[1024, 1024]}  // Balanced quality/performance
        shadow-bias={-0.0005}           // Reduced artifacts
        shadow-normalBias={0.015}       // Fine-tuned for smoother shadows
        shadow-radius={6}                // Increased for softer shadow edges
      />
    </>
  );
};

// Component to handle click-to-place for shape creation
const ClickToPlaceHandler = () => {
  const { camera, raycaster, gl } = useThree();
  const activeTool = useCADToolsStore((state) => state.activeTool);
  const addObject = useCADToolsStore((state) => state.addObject);
  const setActiveTool = useCADToolsStore((state) => state.setActiveTool);
  
  const handleClick = React.useCallback(
    (event: MouseEvent) => {
      // Only handle if a shape tool is active
      if (
        !activeTool ||
        activeTool === 'select' ||
        activeTool === 'push-pull' ||
        activeTool === 'boolean' ||
        activeTool === 'rectangle' ||
        activeTool === 'erase' ||
        activeTool === 'line' ||
        activeTool === 'polygon' ||
        activeTool === 'arc' ||
        activeTool === 'circle' ||
        activeTool === 'offset' ||
        activeTool === 'tape'
      ) {
        return;
      }
      
      // Get mouse position in normalized device coordinates
      const rect = gl.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      // First, check if we clicked on an existing CAD object
      raycaster.setFromCamera(mouse, camera);
      const cadObjects = useCADToolsStore.getState().objects;
      let hitObject = false;
      
      for (const obj of cadObjects) {
        const intersects = raycaster.intersectObject(obj.mesh, false);
        if (intersects.length > 0) {
          hitObject = true;
          break;
        }
      }
      
      // If we hit an object, don't create a new one (let selection handle it)
      if (hitObject) {
        return;
      }
      
      // Raycast to find intersection with ground plane (y=0)
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const intersectionPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersectionPoint);
      
      // Create shape at intersection point
      const shapeType = activeTool as ShapeType;
      const newObject = createCADObject(
        shapeType,
        [intersectionPoint.x, intersectionPoint.y, intersectionPoint.z],
        [0, 0, 0],
        [1, 1, 1]
      );
      addObject(newObject);
      
      // Set tool back to select after creating
      setActiveTool('select');
    },
    [activeTool, addObject, setActiveTool, camera, raycaster, gl]
  );
  
  React.useEffect(() => {
    if (activeTool && activeTool !== 'select' && activeTool !== 'push-pull' && activeTool !== 'boolean') {
      // Use a slight delay to ensure object selection happens first
      const timeoutId = setTimeout(() => {
        gl.domElement.addEventListener('click', handleClick);
      }, 0);
      
      return () => {
        clearTimeout(timeoutId);
        gl.domElement.removeEventListener('click', handleClick);
      };
    }
    return undefined;
  }, [activeTool, handleClick, gl]);
  
  return null;
};

interface UndoRedoButtonsProps {
  projectId: string;
}

const IconButton = ({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    className="rounded-full bg-black/60 p-3 text-white backdrop-blur transition hover:bg-black/80 disabled:opacity-40 disabled:hover:bg-black/60"
  >
    {children}
  </button>
);

const UndoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    <path d="M9 5H5v4" />
    <path d="M5 9c2.5-2.5 5.5-4 9-4a7 7 0 1 1-7 7" />
  </svg>
);

const RedoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    <path d="M15 5h4v4" />
    <path d="M19 9c-2.5-2.5-5.5-4-9-4a7 7 0 1 0 7 7" />
  </svg>
);

const UndoRedoButtons = ({ projectId }: UndoRedoButtonsProps) => {
  const useWallGraphStore = React.useMemo(() => getWallGraphStore(projectId), [projectId]);
  const wallUndo = useWallGraphStore((state) => state.undo);
  const wallRedo = useWallGraphStore((state) => state.redo);
  const cadUndo = useCADToolsStore((state) => state.undo);
  const cadRedo = useCADToolsStore((state) => state.redo);
  const canUndoCad = useCADToolsStore((state) => state.history.past.length > 0);
  const canRedoCad = useCADToolsStore((state) => state.history.future.length > 0);

  const handleUndo = React.useCallback(() => {
    cadUndo();
    wallUndo();
  }, [cadUndo, wallUndo]);

  const handleRedo = React.useCallback(() => {
    cadRedo();
    wallRedo();
  }, [cadRedo, wallRedo]);

  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="pointer-events-auto absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-black/40 p-2 backdrop-blur">
        <IconButton label="Undo" onClick={handleUndo} disabled={!canUndoCad}>
          <UndoIcon />
        </IconButton>
        <IconButton label="Redo" onClick={handleRedo} disabled={!canRedoCad}>
          <RedoIcon />
        </IconButton>
      </div>
    </div>
  );
};

export const ThreeCanvas = ({ projectId }: ThreeCanvasProps) => {
  const useWallGraphStore = React.useMemo(() => getWallGraphStore(projectId), [projectId]);
  const clearSelection = useWallGraphStore((state) => state.clearSelection);
  const setHoveredWallId = useWallGraphStore((state) => state.setHoveredWallId);
  const selectedWallIds = useWallGraphStore((state) => state.selectedWallIds);
  
  // CAD Tools store
  const clearCADSelection = useCADToolsStore((state) => state.clearSelection);
  const setHoveredCADObjectId = useCADToolsStore((state) => state.setHoveredObjectId);
  const selectedCADObjectIds = useCADToolsStore((state) => state.selectedObjectIds);
  const cadObjects = useCADToolsStore((state) => state.objects);
  const wallMeshes = useThreeSceneStore((state) => state.meshes);
  const selectedWallMesh = React.useMemo(() => {
    if (selectedWallIds.length !== 1) {
      return null;
    }
    const targetId = selectedWallIds[0];
    return wallMeshes.find((mesh) => mesh.userData?.wallId === targetId) ?? null;
  }, [selectedWallIds, wallMeshes]);
  const cancelPushPull = useCADToolsStore((state) => state.cancelPushPull);
  const activeTool = useCADToolsStore((state) => state.activeTool);
  
  // Get selected CAD object for transform gizmo
  const selectedCADObject = React.useMemo(() => {
    if (selectedCADObjectIds.length === 1) {
      const obj = cadObjects.find(obj => obj.id === selectedCADObjectIds[0]);
      if (obj) {
        return obj.mesh;
      }
    }
    return null;
  }, [selectedCADObjectIds, cadObjects]);

  const handlePointerMissed = React.useCallback(
    (event: unknown) => {
      const pointerEvent = event as PointerEvent;
      if (pointerEvent.button === 0) {
        clearSelection(); // Clear wall selection
        setHoveredWallId(null);
        clearCADSelection(); // Clear CAD object selection
        setHoveredCADObjectId(null);
        cancelPushPull();
        // Clear push-pull face when clicking on empty space
        useCADToolsStore.getState().setPushPullFace(null);
      }
    },
    [cancelPushPull, clearSelection, setHoveredWallId, clearCADSelection, setHoveredCADObjectId]
  );

  return (
    <div className="relative h-full w-full">
      <Canvas
        camera={{ position: [10, 10, 10], fov: 50 }}
        style={{ background: '#f0f0f0' }}
        shadows
        gl={(canvas) => {
          const gl = new THREE.WebGLRenderer({ canvas, antialias: true });
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
          return gl;
        }}
        onPointerMissed={handlePointerMissed}
        onCreated={() => {
          // Canvas created
        }}
      >
        <SceneLighting />

        {/* Ground plane to receive shadows - at grid level (y=0) */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, 0]}
          receiveShadow
          name="ground-plane"
        >
          <planeGeometry args={[800, 800]} />
          <meshStandardMaterial
            color="#f0f0f0"
            transparent={false}
            opacity={1}
            side={THREE.FrontSide}
            polygonOffset
            polygonOffsetFactor={1}
            polygonOffsetUnits={1}
          />
        </mesh>

        {/* Auto-generated from 2D floorplan */}
        <WallGenerator projectId={projectId} />
        <FloorGenerator projectId={projectId} />
        <RenderFloors projectId={projectId} />
        <RenderOpenings projectId={projectId} />
        <RenderWalls projectId={projectId} />
        
        {/* User-created CAD objects */}
        <RenderCADObjects />
        
        {/* Placed Sketchfab models */}
        <RenderPlacedSketchfabModels />
        
        <SnapIndicators />
        {/* <PushPullTool /> */}
        <OffsetTool />
        <RectangleTool />
        <LineTool />
        <PolygonTool />
        <ArcTool />
        <CircleTool />
        <BooleanTool />
        <TapeTool />
        {/* <AxesLines /> */}
        
        {/* Transform gizmo for selected CAD object */}
        {activeTool !== 'push-pull' && activeTool !== 'offset' && selectedCADObject && (
          <TransformGizmo object={selectedCADObject} />
        )}
        {activeTool !== 'push-pull' && activeTool !== 'offset' && !selectedCADObject && selectedWallMesh && selectedWallIds.length === 1 && selectedWallIds[0] && (
          <WallTransformGizmo projectId={projectId} wallId={selectedWallIds[0]} mesh={selectedWallMesh} />
        )}
        
        {/* Axes helper */}
        <axesHelper args={[200]} />

        {/* Click-to-place handler for shape creation */}
        <ClickToPlaceHandler />

        {/* Drag select handler */}
        <DragSelectBox />

        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.1}
          minDistance={2}
          maxDistance={150}
        />
      </Canvas>
      <UndoRedoButtons projectId={projectId} />
      <DragSelectBoxOverlay />
    </div>
  );
};
