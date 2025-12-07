/**
 * Three.js scene Zustand store for managing 3D scene state
 * Tracks wall meshes, opening models, and cutout boxes for the 3D scene
 * Manages 3D geometry updates when wall graph changes
 */
'use client';

import { create } from 'zustand';
import * as THREE from 'three';

interface ThreeSceneStore {
  meshes: THREE.Mesh[];
  openingModels: THREE.Group[];
  cutoutBoxes: THREE.Mesh[]; // DEBUG: Visible cutout boxes
  baseFloorMesh: THREE.Mesh | null;
  zoneMeshes: THREE.Mesh[];
  setMeshes: (meshes: THREE.Mesh[]) => void;
  setOpeningModels: (models: THREE.Group[]) => void;
  setCutoutBoxes: (boxes: THREE.Mesh[]) => void;
  setBaseFloor: (mesh: THREE.Mesh | null) => void;
  setZoneMeshes: (meshes: THREE.Mesh[]) => void;
  addMesh: (mesh: THREE.Mesh) => void;
  addOpeningModel: (model: THREE.Group) => void;
  clearMeshes: () => void;
  clearOpeningModels: () => void;
  clearCutoutBoxes: () => void;
  clearFloors: () => void;
  clearAll: () => void;
}

export const useThreeSceneStore = create<ThreeSceneStore>((set) => ({
  meshes: [],
  openingModels: [],
  cutoutBoxes: [],
  baseFloorMesh: null,
  zoneMeshes: [],
  setMeshes: (meshes) => set({ meshes }),
  setOpeningModels: (models) => set({ openingModels: models }),
  setCutoutBoxes: (boxes) => set({ cutoutBoxes: boxes }),
  setBaseFloor: (mesh) => set({ baseFloorMesh: mesh }),
  setZoneMeshes: (meshes) => set({ zoneMeshes: meshes }),
  addMesh: (mesh) => set((state) => ({ meshes: [...state.meshes, mesh] })),
  addOpeningModel: (model) => set((state) => ({ openingModels: [...state.openingModels, model] })),
  clearMeshes: () => set({ meshes: [] }),
  clearOpeningModels: () => set({ openingModels: [] }),
  clearCutoutBoxes: () => set({ cutoutBoxes: [] }),
  clearFloors: () => set({ baseFloorMesh: null, zoneMeshes: [] }),
  clearAll: () => set({ meshes: [], openingModels: [], cutoutBoxes: [], baseFloorMesh: null, zoneMeshes: [] }),
}));
