'use client';

import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useCADToolsStore } from '../store/cadToolsStore';

const HIGHLIGHT_COLOR = '#F97316';
const HIGHLIGHT_OPACITY = 0.35;

export const PushPullTool = () => {
  const activeTool = useCADToolsStore((state) => state.activeTool);
  const { selectedFace, distance } = useCADToolsStore((state) => state.pushPullState);

  const triangleSignature = selectedFace?.triangleIndices?.join(',') ?? '';

  const highlightGeometry = useMemo(() => {
    if (!selectedFace || !selectedFace.mesh) {
      return null;
    }

    const sourceGeometry = selectedFace.mesh.geometry as THREE.BufferGeometry;
    const positionAttribute = sourceGeometry.getAttribute('position') as THREE.BufferAttribute | undefined;

    if (!positionAttribute) {
      return null;
    }

    const indexAttribute = sourceGeometry.getIndex();
    const triangleIndices = selectedFace.triangleIndices.length
      ? selectedFace.triangleIndices
      : [selectedFace.faceIndex];

    const highlightPositions = new Float32Array(triangleIndices.length * 9);
    const temp = new THREE.Vector3();

    triangleIndices.forEach((triangleIndex, idx) => {
      const vertexIndices = indexAttribute
        ? [
            indexAttribute.getX(triangleIndex * 3),
            indexAttribute.getX(triangleIndex * 3 + 1),
            indexAttribute.getX(triangleIndex * 3 + 2),
          ]
        : [
            triangleIndex * 3,
            triangleIndex * 3 + 1,
            triangleIndex * 3 + 2,
          ];

      vertexIndices.forEach((vertexIndex, vertexPosition) => {
        temp.fromBufferAttribute(positionAttribute, vertexIndex);
        const offset = idx * 9 + vertexPosition * 3;
        highlightPositions[offset] = temp.x;
        highlightPositions[offset + 1] = temp.y;
        highlightPositions[offset + 2] = temp.z;
      });
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(highlightPositions, 3));
    geometry.computeVertexNormals();

    return geometry;
  }, [selectedFace, triangleSignature, distance]);

  useEffect(() => {
    return () => {
      highlightGeometry?.dispose();
    };
  }, [highlightGeometry]);

  const highlightRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!highlightRef.current || !selectedFace?.mesh) {
      return;
    }

    highlightRef.current.matrix.copy(selectedFace.mesh.matrixWorld);
  });

  useEffect(() => {
    if (highlightRef.current && selectedFace?.mesh) {
      highlightRef.current.matrix.copy(selectedFace.mesh.matrixWorld);
    }
  }, [selectedFace]);

  const labelPosition = useMemo(() => {
    if (!selectedFace) {
      return null;
    }

    const offsetNormal = selectedFace.worldNormal.clone().normalize();
    const offsetDistance = 0.6 + Math.abs(distance);
    const worldPosition = selectedFace.worldCenter.clone().addScaledVector(offsetNormal, offsetDistance);
    return worldPosition.toArray() as [number, number, number];
  }, [distance, selectedFace]);

  const formattedDistance = distance >= 0
    ? `+${distance.toFixed(3)} m`
    : `${distance.toFixed(3)} m`;

  if (activeTool !== 'push-pull' || !selectedFace || !highlightGeometry) {
    return null;
  }

  return (
    <group>
      {/* Face highlight */}
      <mesh
        ref={highlightRef}
        geometry={highlightGeometry}
        matrixAutoUpdate={false}
        renderOrder={1003}
        >
        <meshBasicMaterial
          color={HIGHLIGHT_COLOR}
          opacity={HIGHLIGHT_OPACITY}
          transparent
          depthWrite={false}
          polygonOffset
          polygonOffsetFactor={-1}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Distance label */}
      {labelPosition && (
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
            Push / Pull · {formattedDistance}
          </div>
        </Html>
      )}
    </group>
  );
};
