/**
 * Boolean operations component
 * Provides UI and logic for Union, Subtract, and Intersect operations
 * Uses three-bvh-csg for boolean operations
 */

'use client';

import React from 'react';
import { useCADToolsStore } from '../store/cadToolsStore';
import { performBoolean, validateMeshesForBoolean } from '../utils/booleanOperations';
import type { BooleanOperation } from '../types/cadObjects';

interface BooleanOperationsProps {
  // No props - reads from store
}

export const BooleanOperations = ({}: BooleanOperationsProps) => {
  const selectedObjectIds = useCADToolsStore((state) => state.selectedObjectIds);
  const objects = useCADToolsStore((state) => state.objects);
  const applyBoolean = useCADToolsStore((state) => state.applyBoolean);
  const removeObject = useCADToolsStore((state) => state.removeObject);
  const addObject = useCADToolsStore((state) => state.addObject);
  const clearSelection = useCADToolsStore((state) => state.clearSelection);
  
  const handleBooleanOperation = async (operation: BooleanOperation) => {
    if (selectedObjectIds.length !== 2) {
      console.warn('Boolean operations require exactly 2 selected objects');
      return;
    }
    
    const baseObject = objects.find(obj => obj.id === selectedObjectIds[0]);
    const toolObject = objects.find(obj => obj.id === selectedObjectIds[1]);
    
    if (!baseObject || !toolObject) {
      console.warn('Selected objects not found');
      return;
    }
    
    // Validate meshes
    const validation = validateMeshesForBoolean(baseObject.mesh, toolObject.mesh);
    if (!validation.valid) {
      console.error('Boolean operation validation failed:', validation.error);
      return;
    }
    
    try {
      // Perform boolean operation
      const resultMesh = performBoolean(baseObject.mesh, toolObject.mesh, operation);
      
      // Create result object
      const resultObject = {
        id: resultMesh.userData.cadObjectId,
        type: baseObject.type, // Keep base type
        mesh: resultMesh,
        position: [
          resultMesh.position.x,
          resultMesh.position.y,
          resultMesh.position.z,
        ] as [number, number, number],
        rotation: [
          resultMesh.rotation.x,
          resultMesh.rotation.y,
          resultMesh.rotation.z,
        ] as [number, number, number],
        scale: [
          resultMesh.scale.x,
          resultMesh.scale.y,
          resultMesh.scale.z,
        ] as [number, number, number],
        ...(baseObject.material && { material: baseObject.material }),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      
      // Remove original objects
      removeObject(baseObject.id);
      removeObject(toolObject.id);
      
      // Add result object
      addObject(resultObject);
      
      // Clear selection
      clearSelection();
      
      // Record in store
      applyBoolean(baseObject.id, toolObject.id, operation);
    } catch (error) {
      console.error('Boolean operation failed:', error);
    }
  };
  
  const canPerformBoolean = selectedObjectIds.length === 2;
  
  return (
    <div className="boolean-operations-panel">
      <h4>Boolean Operations</h4>
      <div className="flex gap-2">
        <button
          onClick={() => handleBooleanOperation('union')}
          disabled={!canPerformBoolean}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Union
        </button>
        <button
          onClick={() => handleBooleanOperation('subtract')}
          disabled={!canPerformBoolean}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
        >
          Subtract
        </button>
        <button
          onClick={() => handleBooleanOperation('intersect')}
          disabled={!canPerformBoolean}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          Intersect
        </button>
      </div>
      {!canPerformBoolean && (
        <p className="text-sm text-gray-500 mt-2">
          Select 2 objects to perform boolean operation
        </p>
      )}
    </div>
  );
};

