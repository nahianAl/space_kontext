/**
 * Public API for sketchfab feature
 * Exports all public components, hooks, stores, and types
 */

// Components
export { SketchfabSearchPanel } from './components/SketchfabSearchPanel';
export { ModelCard } from './components/ModelCard';
export { ModelPreviewModal } from './components/ModelPreviewModal';
export { AttributionBadge } from './components/AttributionBadge';
export { RenderPlacedSketchfabModels } from './components/PlacedSketchfabModel';

// Stores
export { useSketchfabStore } from './store/sketchfabStore';
export { usePlacedModelsStore } from './store/placedModelsStore';

// Types
export type {
  SketchfabModel,
  SketchfabSearchParams,
  SketchfabSearchResponse,
  SketchfabAttribution,
} from './types';
export type { PlacedSketchfabModel } from './store/placedModelsStore';

// Services
export { searchModels as searchSketchfabModels } from './services/sketchfabService';
export { refreshToken, getValidAccessToken, hasValidToken } from './services/tokenService';

// Utils
export { loadGLBModel, getBoundingBox, centerModelAtOrigin, placeModelOnGround } from './utils/glbLoader';

