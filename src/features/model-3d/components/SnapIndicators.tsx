'use client';

import React from 'react';
import * as THREE from 'three';
import { useCADToolsStore } from '../store/cadToolsStore';

const ICON_SIZE = 0.08; // Size of snap indicators

/**
 * SketchUp-style snap indicators with different shapes per snap type
 * - Endpoint: Green square
 * - Midpoint: Cyan circle
 * - On Edge: Red circle (smaller)
 * - On Face: Blue diamond
 * - Intersection: Black X
 */
export const SnapIndicators = () => {
  const activeSnap = useCADToolsStore((state) => state.activeSnap);

  if (!activeSnap || activeSnap.type === 'none') {
    return null;
  }

  const color = activeSnap.color || '#FFFF00';
  const icon = activeSnap.icon || 'circle';

  return (
    <group position={activeSnap.point}>
      {/* Render appropriate icon shape */}
      {icon === 'square' && <SquareIndicator color={color} size={ICON_SIZE} />}
      {icon === 'circle' && <CircleIndicator color={color} size={ICON_SIZE} />}
      {icon === 'diamond' && <DiamondIndicator color={color} size={ICON_SIZE} />}
      {icon === 'x' && <XIndicator color={color} size={ICON_SIZE} />}
      {icon === 'line' && <LineIndicator color={color} size={ICON_SIZE} />}
    </group>
  );
};

// Square indicator for endpoints (green)
const SquareIndicator = ({ color, size }: { color: string; size: number }) => (
  <mesh renderOrder={9999}>
    <boxGeometry args={[size, size, size]} />
    <meshBasicMaterial
      color={color}
      depthTest={false}
      depthWrite={false}
      transparent
      opacity={1.0}
      toneMapped={false}
    />
  </mesh>
);

// Circle indicator for midpoints (cyan)
const CircleIndicator = ({ color, size }: { color: string; size: number }) => (
  <mesh renderOrder={9999}>
    <sphereGeometry args={[size / 2, 16, 16]} />
    <meshBasicMaterial
      color={color}
      depthTest={false}
      depthWrite={false}
      transparent
      opacity={1.0}
      toneMapped={false}
    />
  </mesh>
);

// Diamond indicator for on-face (blue)
const DiamondIndicator = ({ color, size }: { color: string; size: number }) => (
  <mesh renderOrder={9999} rotation={[0, Math.PI / 4, Math.PI / 4]}>
    <boxGeometry args={[size, size, size]} />
    <meshBasicMaterial
      color={color}
      depthTest={false}
      depthWrite={false}
      transparent
      opacity={1.0}
      toneMapped={false}
    />
  </mesh>
);

// X indicator for intersections (black)
const XIndicator = ({ color, size }: { color: string; size: number }) => {
  const geometry = React.useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const s = size;
    const positions = new Float32Array([
      -s, -s, 0, s, s, 0,
      -s, s, 0, s, -s, 0,
    ]);
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geom;
  }, [size]);

  return (
    <lineSegments geometry={geometry} renderOrder={9999}>
      <lineBasicMaterial
        color={color}
        linewidth={3}
        depthTest={false}
        depthWrite={false}
        toneMapped={false}
      />
    </lineSegments>
  );
};

// Line indicator for axis/perpendicular/parallel (colored by axis or magenta)
const LineIndicator = ({ color, size }: { color: string; size: number }) => {
  const geometry = React.useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const s = size * 2;
    const positions = new Float32Array([
      -s, 0, 0, s, 0, 0,
    ]);
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geom;
  }, [size]);

  return (
    <lineSegments geometry={geometry} renderOrder={9999}>
      <lineBasicMaterial
        color={color}
        linewidth={2}
        depthTest={false}
        depthWrite={false}
        toneMapped={false}
      />
    </lineSegments>
  );
};

