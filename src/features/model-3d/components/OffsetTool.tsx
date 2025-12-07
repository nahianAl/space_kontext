'use client';

import React, { useEffect, useMemo, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Brush, Evaluator, SUBTRACTION } from 'three-bvh-csg';
import { useCADToolsStore } from '../store/cadToolsStore';
import { useThreeSceneStore } from '../store/threeSceneStore';
import { buildFaceData } from '../utils/pushPull';
import type { FaceData } from '../types/cadObjects';

const PREVIEW_COLOR = '#3B82F6';
const PREVIEW_OPACITY = 0.6;

/**
 * OffsetTool - SketchUp-style offset tool for creating inset/outset copies of faces
 *
 * Workflow:
 * 1. Hover over a face to highlight it
 * 2. Click to select the face and activate offset mode
 * 3. Move mouse to adjust offset distance (inward/outward)
 * 4. Click to create the offset geometry
 * 5. ESC to cancel
 */
export const OffsetTool = () => {
  const activeTool = useCADToolsStore((state) => state.activeTool);
  const offsetState = useCADToolsStore((state) => state.offsetState);
  const setOffsetFace = useCADToolsStore((state) => state.setOffsetFace);
  const startOffset = useCADToolsStore((state) => state.startOffset);
  const updateOffsetDistance = useCADToolsStore((state) => state.updateOffsetDistance);
  const applyOffset = useCADToolsStore((state) => state.applyOffset);
  const cancelOffset = useCADToolsStore((state) => state.cancelOffset);
  const addObject = useCADToolsStore((state) => state.addObject);
  const setActiveTool = useCADToolsStore((state) => state.setActiveTool);

  const cadObjects = useCADToolsStore((state) => state.objects);
  const wallMeshes = useThreeSceneStore((state) => state.meshes);
  const { camera, gl, raycaster, controls } = useThree((state) => ({
    camera: state.camera,
    gl: state.gl,
    raycaster: state.raycaster,
    controls: state.controls as THREE.EventDispatcher & { enabled?: boolean } | undefined,
  }));

  const [hoveredFace, setHoveredFace] = React.useState<FaceData | null>(null);
  const mouseRef = useRef(new THREE.Vector2());
  const previewLinesRef = useRef<THREE.LineSegments>(null);
  const baseDistanceRef = useRef<number>(0);
  const planeRef = useRef<THREE.Plane | null>(null);

  // Create the offset geometry with boolean subtraction
  const createOffsetGeometry = useCallback(() => {
    const face = offsetState.selectedFace;
    const distance = offsetState.distance;

    console.log('[OffsetTool] createOffsetGeometry called');
    console.log('[OffsetTool] Distance:', distance);

    if (!face || !face.mesh) {
      console.warn('[OffsetTool] No face or mesh selected');
      return;
    }

    const targetObject = cadObjects.find((obj) => obj.id === face.objectId);
    if (!targetObject) {
      console.warn('[OffsetTool] Target object not found:', face.objectId);
      return;
    }

    // Get face vertices in world space
    const faceGeometry = face.mesh.geometry;
    const positionAttr = faceGeometry.getAttribute('position') as THREE.BufferAttribute;

    if (!positionAttr || !face.vertices || face.vertices.length < 3) {
      console.warn('[OffsetTool] Invalid face data');
      return;
    }

    const worldVertices: THREE.Vector3[] = [];
    for (const vertexIndex of face.vertices) {
      const localVertex = new THREE.Vector3();
      localVertex.fromBufferAttribute(positionAttr, vertexIndex);
      const worldVertex = localVertex.applyMatrix4(face.mesh.matrixWorld);
      worldVertices.push(worldVertex);
    }

    // Create local coordinate system for the face
    const faceCenter = face.worldCenter;
    const faceNormal = face.worldNormal.clone().normalize();

    const tangent1 = new THREE.Vector3();
    const tangent2 = new THREE.Vector3();

    if (Math.abs(faceNormal.x) < 0.9) {
      tangent1.crossVectors(faceNormal, new THREE.Vector3(1, 0, 0)).normalize();
    } else {
      tangent1.crossVectors(faceNormal, new THREE.Vector3(0, 1, 0)).normalize();
    }
    tangent2.crossVectors(faceNormal, tangent1).normalize();

    // Project vertices onto tangent plane to get dimensions
    let minU = Infinity, maxU = -Infinity;
    let minV = Infinity, maxV = -Infinity;

    for (const vertex of worldVertices) {
      const relativePos = vertex.clone().sub(faceCenter);
      const u = relativePos.dot(tangent1);
      const v = relativePos.dot(tangent2);
      minU = Math.min(minU, u);
      maxU = Math.max(maxU, u);
      minV = Math.min(minV, v);
      maxV = Math.max(maxV, v);
    }

    const faceWidth = maxU - minU;
    const faceHeight = maxV - minV;
    const depth = 0.01;

    const centerU = (minU + maxU) / 2;
    const centerV = (minV + maxV) / 2;
    const boundingBoxCenter = faceCenter.clone()
      .addScaledVector(tangent1, centerU)
      .addScaledVector(tangent2, centerV);

    // Calculate offset dimensions
    const absDistance = Math.abs(distance);
    const offsetWidth = distance < 0 ? faceWidth - 2 * absDistance : faceWidth + 2 * absDistance;
    const offsetHeight = distance < 0 ? faceHeight - 2 * absDistance : faceHeight + 2 * absDistance;

    if (offsetWidth <= 0 || offsetHeight <= 0) {
      console.warn('[OffsetTool] Offset would create invalid geometry');
      return;
    }

    // Create rotation matrix for orienting shapes
    const rotationMatrix = new THREE.Matrix4();
    rotationMatrix.makeBasis(tangent1, tangent2, faceNormal);
    const quaternion = new THREE.Quaternion();
    quaternion.setFromRotationMatrix(rotationMatrix);

    // Create ORIGINAL face shape (exact same size as selected face)
    const originalGeometry = new THREE.BoxGeometry(faceWidth, faceHeight, depth);
    originalGeometry.computeVertexNormals();
    if (!originalGeometry.attributes.uv) {
      const positionAttribute = originalGeometry.attributes.position;
      if (!positionAttribute) {
        console.error('[OffsetTool] Geometry has no position attribute');
        return;
      }
      const positionCount = positionAttribute.count;
      const uvs = new Float32Array(positionCount * 2);
      originalGeometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    }

    const originalMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    const originalBrush = new Brush(originalGeometry, originalMaterial);
    const originalCenter = boundingBoxCenter.clone().addScaledVector(faceNormal, depth / 2);
    originalBrush.position.copy(originalCenter);
    originalBrush.setRotationFromQuaternion(quaternion);
    originalBrush.updateMatrix();
    originalBrush.updateMatrixWorld(true);

    // Create OFFSET shape (smaller if inward, larger if outward)
    const offsetGeometry = new THREE.BoxGeometry(offsetWidth, offsetHeight, depth);
    offsetGeometry.computeVertexNormals();
    if (!offsetGeometry.attributes.uv) {
      const positionAttribute = offsetGeometry.attributes.position;
      if (!positionAttribute) {
        console.error('[OffsetTool] Offset geometry has no position attribute');
        return;
      }
      const positionCount = positionAttribute.count;
      const uvs = new Float32Array(positionCount * 2);
      offsetGeometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    }

    const offsetMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    const offsetBrush = new Brush(offsetGeometry, offsetMaterial);
    offsetBrush.position.copy(originalCenter);
    offsetBrush.setRotationFromQuaternion(quaternion);
    offsetBrush.updateMatrix();
    offsetBrush.updateMatrixWorld(true);

    // Perform boolean subtraction to create ring
    const evaluator = new Evaluator();
    let resultBrush: Brush;

    if (distance < 0) {
      // Inward offset: original - offset = ring
      console.log('[OffsetTool] Creating inward ring: original - offset');
      resultBrush = evaluator.evaluate(originalBrush, offsetBrush, SUBTRACTION);
    } else {
      // Outward offset: offset - original = ring
      console.log('[OffsetTool] Creating outward ring: offset - original');
      resultBrush = evaluator.evaluate(offsetBrush, originalBrush, SUBTRACTION);
    }

    // Prepare final geometry
    resultBrush.prepareGeometry();
    resultBrush.markUpdated();

    const finalGeometry = resultBrush.geometry.toNonIndexed();
    finalGeometry.deleteAttribute('normal'); // Flat shading will compute its own
    finalGeometry.computeBoundingBox();
    finalGeometry.computeBoundingSphere();

    const finalMaterial = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      metalness: 0.1,
      roughness: 0.7,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
      flatShading: true,
    });

    const finalMesh = new THREE.Mesh(finalGeometry, finalMaterial);
    finalMesh.position.copy(resultBrush.position);
    finalMesh.rotation.copy(resultBrush.rotation);
    finalMesh.scale.copy(resultBrush.scale);
    finalMesh.castShadow = true;
    finalMesh.receiveShadow = true;
    finalMesh.updateMatrix();
    finalMesh.updateMatrixWorld(true);

    const id = `cad-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    finalMesh.userData.cadObjectId = id;
    finalMesh.userData.originFeature = 'offset-tool';
    finalMesh.userData.sourceObjectId = face.objectId;

    const euler = new THREE.Euler().setFromQuaternion(finalMesh.quaternion);

    const newObject = {
      id,
      type: 'plane' as const,
      mesh: finalMesh,
      position: [finalMesh.position.x, finalMesh.position.y, finalMesh.position.z] as [number, number, number],
      rotation: [euler.x, euler.y, euler.z] as [number, number, number],
      scale: [finalMesh.scale.x, finalMesh.scale.y, finalMesh.scale.z] as [number, number, number],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    console.log('[OffsetTool] Created offset ring with ID:', id);
    addObject(newObject);
    setActiveTool('select');
  }, [offsetState, cadObjects, addObject, setActiveTool]);

  // Update mouse position
  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      if (!gl.domElement) return;

      const rect = gl.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      if (offsetState.active && planeRef.current) {
        // Update offset distance based on mouse movement
        raycaster.setFromCamera(mouseRef.current, camera);

        const intersectPoint = new THREE.Vector3();
        const didHit = raycaster.ray.intersectPlane(planeRef.current, intersectPoint);

        if (didHit) {
          // Calculate perpendicular distance from base point
          // Use the distance along the plane, not 3D distance
          const faceCenter = offsetState.selectedFace?.worldCenter;
          if (!faceCenter) return;

          const delta = intersectPoint.clone().sub(faceCenter);
          const distance = delta.length();

          // Calculate the change from base distance
          const deltaDistance = distance - baseDistanceRef.current;

          // Scale down the sensitivity (make it 4x less sensitive)
          const scaledDistance = deltaDistance * 0.25;

          updateOffsetDistance(scaledDistance);
        }
      }
    },
    [offsetState.active, offsetState.selectedFace, camera, gl, raycaster, updateOffsetDistance]
  );

  // Handle clicks
  const handlePointerDown = useCallback(
    (event: PointerEvent) => {
      if (activeTool !== 'offset' || event.button !== 0) return;

      event.preventDefault();
      event.stopPropagation();

      if (offsetState.active) {
        console.log('[OffsetTool] Applying offset, distance:', offsetState.distance);
        // Apply the offset
        if (Math.abs(offsetState.distance) > 0.01) {
          createOffsetGeometry();
        } else {
          console.log('[OffsetTool] Distance too small, not creating geometry');
        }
        applyOffset();
        baseDistanceRef.current = 0;
        planeRef.current = null;
        return;
      }

      // Select face to offset
      if (hoveredFace) {
        console.log('[OffsetTool] Starting offset on face:', hoveredFace.objectId);
        startOffset(hoveredFace);

        // Store the plane and initial distance for relative movement
        const faceCenter = hoveredFace.worldCenter;
        const faceNormal = hoveredFace.worldNormal;

        planeRef.current = new THREE.Plane().setFromNormalAndCoplanarPoint(faceNormal, faceCenter);

        // Calculate initial distance from face center to mouse
        raycaster.setFromCamera(mouseRef.current, camera);
        const intersectPoint = new THREE.Vector3();
        const didHit = raycaster.ray.intersectPlane(planeRef.current, intersectPoint);

        if (didHit) {
          baseDistanceRef.current = intersectPoint.distanceTo(faceCenter);
          console.log('[OffsetTool] Base distance set to:', baseDistanceRef.current);
        }
      } else {
        console.log('[OffsetTool] No hovered face to select');
      }
    },
    [activeTool, offsetState.active, offsetState.distance, hoveredFace, startOffset, applyOffset, camera, raycaster, createOffsetGeometry]
  );

  // Handle hover detection
  useFrame(() => {
    if (activeTool !== 'offset' || offsetState.active) {
      if (hoveredFace) {
        setHoveredFace(null);
      }
      return;
    }

    raycaster.setFromCamera(mouseRef.current, camera);

    // Get all intersectable meshes
    const cadMeshes = cadObjects.map((obj) => obj.mesh).filter((mesh): mesh is THREE.Mesh => !!mesh);
    const intersectables: THREE.Object3D[] = [...wallMeshes, ...cadMeshes];

    if (intersectables.length === 0) {
      if (hoveredFace) {
        setHoveredFace(null);
      }
      return;
    }

    const intersections = raycaster.intersectObjects(intersectables, true);
    const hit = intersections.find(
      (intersection) => intersection.faceIndex !== null && intersection.faceIndex !== undefined && intersection.object instanceof THREE.Mesh
    );

    if (hit && hit.faceIndex !== null && hit.faceIndex !== undefined && hit.object instanceof THREE.Mesh) {
      const faceData = buildFaceData(hit.object, hit.faceIndex, hit.point);

      // Make sure we have the correct object ID from userData
      if (hit.object.userData && hit.object.userData.cadObjectId) {
        faceData.objectId = hit.object.userData.cadObjectId as string;
      } else {
        // Try to find the CAD object by mesh reference
        const cadObj = cadObjects.find(obj => obj.mesh === hit.object);
        if (cadObj) {
          faceData.objectId = cadObj.id;
        }
      }

      // Only set if we have a valid objectId and it's different from current
      if (faceData.objectId) {
        if (!hoveredFace || hoveredFace.objectId !== faceData.objectId || hoveredFace.faceIndex !== faceData.faceIndex) {
          setHoveredFace(faceData);
        }
      } else if (hoveredFace) {
        setHoveredFace(null);
      }
    } else {
      if (hoveredFace) {
        setHoveredFace(null);
      }
    }
  });

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && activeTool === 'offset') {
        event.preventDefault();
        cancelOffset();
        baseDistanceRef.current = 0;
        planeRef.current = null;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeTool, cancelOffset]);

  // Add event listeners
  useEffect(() => {
    if (activeTool !== 'offset') return;

    const canvas = gl.domElement;
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerdown', handlePointerDown, { capture: true });

    return () => {
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerdown', handlePointerDown, { capture: true });
    };
  }, [activeTool, gl, handlePointerMove, handlePointerDown]);

  // Create preview edges for offset shape
  const previewEdges = useMemo(() => {
    if (!offsetState.active || !offsetState.selectedFace) return null;

    const face = offsetState.selectedFace;
    if (!face.mesh || !face.vertices || face.vertices.length < 3) return null;

    // Get the actual face dimensions by examining face vertices
    const faceGeometry = face.mesh.geometry;
    const positionAttr = faceGeometry.getAttribute('position') as THREE.BufferAttribute;
    if (!positionAttr) return null;

    // Get face vertices in world space
    const worldVertices: THREE.Vector3[] = [];
    for (const vertexIndex of face.vertices) {
      const localVertex = new THREE.Vector3();
      localVertex.fromBufferAttribute(positionAttr, vertexIndex);
      const worldVertex = localVertex.applyMatrix4(face.mesh.matrixWorld);
      worldVertices.push(worldVertex);
    }

    // Calculate face dimensions
    const faceCenter = face.worldCenter;
    const faceNormal = face.worldNormal.clone().normalize();

    // Create a local coordinate system for the face
    const tangent1 = new THREE.Vector3();
    const tangent2 = new THREE.Vector3();

    // Find a perpendicular vector to the normal
    if (Math.abs(faceNormal.x) < 0.9) {
      tangent1.crossVectors(faceNormal, new THREE.Vector3(1, 0, 0)).normalize();
    } else {
      tangent1.crossVectors(faceNormal, new THREE.Vector3(0, 1, 0)).normalize();
    }
    tangent2.crossVectors(faceNormal, tangent1).normalize();

    // Project vertices onto the tangent plane and find min/max
    let minU = Infinity, maxU = -Infinity;
    let minV = Infinity, maxV = -Infinity;

    for (const vertex of worldVertices) {
      const relativePos = vertex.clone().sub(faceCenter);
      const u = relativePos.dot(tangent1);
      const v = relativePos.dot(tangent2);
      minU = Math.min(minU, u);
      maxU = Math.max(maxU, u);
      minV = Math.min(minV, v);
      maxV = Math.max(maxV, v);
    }

    const faceWidth = maxU - minU;
    const faceHeight = maxV - minV;

    // Calculate the center of the bounding box in the face's local coordinate system
    const centerU = (minU + maxU) / 2;
    const centerV = (minV + maxV) / 2;

    // The actual center of the face's bounding box in world space
    const boundingBoxCenter = faceCenter.clone()
      .addScaledVector(tangent1, centerU)
      .addScaledVector(tangent2, centerV);

    // Calculate new dimensions based on offset distance
    const absDistance = Math.abs(offsetState.distance);
    const newWidth = offsetState.distance < 0 ? faceWidth - 2 * absDistance : faceWidth + 2 * absDistance;
    const newHeight = offsetState.distance < 0 ? faceHeight - 2 * absDistance : faceHeight + 2 * absDistance;

    // Only show preview if dimensions are valid
    if (newWidth <= 0.001 || newHeight <= 0.001) return null;

    // Create edges geometry for the rectangle outline
    const halfWidth = newWidth / 2;
    const halfHeight = newHeight / 2;

    // Rectangle vertices on XY plane (Z = 0)
    const vertices = new Float32Array([
      -halfWidth, -halfHeight, 0,  // bottom-left
      halfWidth, -halfHeight, 0,   // bottom-right
      halfWidth, halfHeight, 0,    // top-right
      -halfWidth, halfHeight, 0,   // top-left
    ]);

    // Line indices for rectangle edges
    const indices = new Uint16Array([
      0, 1,  // bottom edge
      1, 2,  // right edge
      2, 3,  // top edge
      3, 0,  // left edge
    ]);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));

    // Calculate the correct orientation for the preview using rotation matrix
    // Build a rotation matrix from the face's local coordinate system
    const rotationMatrix = new THREE.Matrix4();
    rotationMatrix.makeBasis(tangent1, tangent2, faceNormal);

    // Extract rotation from the matrix
    const quaternion = new THREE.Quaternion();
    quaternion.setFromRotationMatrix(rotationMatrix);

    // Offset position by half depth along normal so preview sits on top of face
    const previewDepth = 0.01;
    const previewPosition = boundingBoxCenter.clone().addScaledVector(faceNormal, previewDepth / 2);

    return {
      geometry,
      position: previewPosition,
      quaternion: quaternion,
    };
  }, [offsetState.active, offsetState.selectedFace, offsetState.distance, cadObjects]);

  // Update preview lines
  useEffect(() => {
    if (!previewLinesRef.current || !previewEdges) return;

    // Update geometry
    const oldGeometry = previewLinesRef.current.geometry;
    previewLinesRef.current.geometry = previewEdges.geometry;
    oldGeometry.dispose();

    // Update transform
    previewLinesRef.current.position.copy(previewEdges.position);
    previewLinesRef.current.setRotationFromQuaternion(previewEdges.quaternion);
  }, [previewEdges]);

  // Label position
  const labelPosition = useMemo(() => {
    if (!offsetState.active || !offsetState.selectedFace) return null;

    const offsetNormal = offsetState.selectedFace.worldNormal.clone().normalize();
    const offsetDistance = 0.6 + Math.abs(offsetState.distance);
    const worldPosition = offsetState.selectedFace.worldCenter
      .clone()
      .addScaledVector(offsetNormal, offsetDistance);
    return worldPosition.toArray() as [number, number, number];
  }, [offsetState]);

  const formattedDistance = useMemo(() => {
    if (!offsetState.active) return '';
    const distance = offsetState.distance;
    const sign = distance >= 0 ? 'Outward' : 'Inward';
    return `${sign} ${Math.abs(distance).toFixed(3)} m`;
  }, [offsetState]);

  if (activeTool !== 'offset') return null;

  return (
    <group>
      {/* Preview edges of offset shape */}
      {offsetState.active && previewEdges && (
        <lineSegments
          ref={previewLinesRef}
          renderOrder={1003}
        >
          <bufferGeometry />
          <lineBasicMaterial
            color={PREVIEW_COLOR}
            linewidth={2}
            depthTest={false}
            depthWrite={false}
          />
        </lineSegments>
      )}

      {/* Distance label */}
      {offsetState.active && labelPosition && (
        <Html position={labelPosition} center>
          <div
            style={{
              background: '#1f1f1f',
              color: '#f8f5f0',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              boxShadow: '0 1px 6px rgba(0, 0, 0, 0.35)',
            }}
          >
            Offset · {formattedDistance}
          </div>
        </Html>
      )}
    </group>
  );
};
