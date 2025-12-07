/**
 * Public API for model-3d feature
 * Exports 3D visualization components for viewing floorplans in Three.js
 */
export { ThreeCanvas } from './components/ThreeCanvas';
export { Floorplan3DView } from './components/Floorplan3DView';
export { SettingsSidebar } from './components/SettingsSidebar';
export { ThreeToolbar } from './components/ThreeToolbar';

// CAD Tools exports
export { RenderCADObjects } from './components/RenderCADObjects';
export { TransformGizmo } from './components/TransformGizmo';
export { PushPullTool } from './components/PushPullTool';
export { BooleanOperations } from './components/BooleanOperations';
export { TapeTool } from './components/TapeTool';
export { useCADToolsStore } from './store/cadToolsStore';
export type { CADObject, ShapeType, ActiveTool, TransformMode } from './store/cadToolsStore';
export type { FaceData, BooleanOperation, SnapResult, Constraint } from './types/cadObjects';

// Sun lighting exports
export { useSunLight } from './hooks/useSunLight';
export {
  calculateSunPosition,
  sunPositionToThreeJS,
  getSunIntensity,
  getSunriseSunset,
  calculateDateFromMonthAndTime,
} from './services/sunLightService';
export type { SunPosition, SunLightConfig } from './services/sunLightService';
export type { UseSunLightOptions, SunLightState } from './hooks/useSunLight';
export { useSunPathStore } from './store/sunPathStore';
