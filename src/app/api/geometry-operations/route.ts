export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import type { ManifoldToplevel } from 'manifold-3d';
import { z } from 'zod';

let manifoldModulePromise: Promise<typeof import('manifold-3d')> | null = null;

interface Vec3 extends Array<number> {
  0: number;
  1: number;
  2: number;
}

interface SerializedGeometryData {
  positions: number[];
  indices: number[] | null;
}

const requestSchema = z.object({
  operation: z.literal('extrude'),
  geometry: z.object({
    positions: z.array(z.number()),
    indices: z.array(z.number()).nullable().optional(),
  }),
  face: z.object({
    normal: z.tuple([z.number(), z.number(), z.number()]),
    planeOffset: z.number(),
    center: z.tuple([z.number(), z.number(), z.number()]),
    vertices: z.array(z.tuple([z.number(), z.number(), z.number()])),
  }),
  distance: z.number(),
});

let manifoldInstancePromise: Promise<ManifoldToplevel> | null = null;

const loadManifoldModule = async () => {
  if (!manifoldModulePromise) {
    manifoldModulePromise = import('manifold-3d');
  }
  return manifoldModulePromise;
};

const getManifoldInstance = async (): Promise<ManifoldToplevel> => {
  if (!manifoldInstancePromise) {
    const manifoldModule = await loadManifoldModule();
    manifoldInstancePromise = manifoldModule.default();
  }
  const instance = await manifoldInstancePromise;
  await instance.setup();
  return instance;
};

const normalize = (vector: Vec3): Vec3 => {
  const length = Math.hypot(vector[0], vector[1], vector[2]);
  if (length === 0) {
    throw new Error('Cannot normalize zero-length vector');
  }
  return [vector[0] / length, vector[1] / length, vector[2] / length];
};

const subtract = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a: Vec3, b: Vec3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

const cross = (a: Vec3, b: Vec3): Vec3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];

const createPlaneBasis = (normal: Vec3): { u: Vec3; v: Vec3; w: Vec3 } => {
  const normalizedNormal = normalize(normal);
  const reference: Vec3 =
    Math.abs(normalizedNormal[1]) < 0.99 ? [0, 1, 0] : [1, 0, 0];
  const u = normalize(cross(reference, normalizedNormal));
  const v = normalize(cross(normalizedNormal, u));
  return {
    u,
    v,
    w: normalizedNormal,
  };
};

const orderPolygonPoints = (points: Array<[number, number]>): Array<[number, number]> => {
  if (points.length <= 3) {
    return points;
  }
  const unique = Array.from(
    new Map(points.map((point) => [`${point[0]}:${point[1]}`, point])).values()
  );
  const centroid = unique.reduce<[number, number]>(
    (acc, point) => [acc[0] + point[0], acc[1] + point[1]],
    [0, 0]
  );
  centroid[0] /= unique.length;
  centroid[1] /= unique.length;

  unique.sort((a, b) => {
    const angleA = Math.atan2(a[1] - centroid[1], a[0] - centroid[0]);
    const angleB = Math.atan2(b[1] - centroid[1], b[0] - centroid[0]);
    return angleA - angleB;
  });

  let area = 0;
  for (let i = 0; i < unique.length; i += 1) {
    const current = unique[i];
    const next = unique[(i + 1) % unique.length];
    if (current && next) {
      area += current[0] * next[1] - current[1] * next[0];
    }
  }

  if (area < 0) {
    unique.reverse();
  }

  return unique;
};

const toManifoldTransform = (u: Vec3, v: Vec3, w: Vec3, translation: Vec3): Float32Array =>
  new Float32Array([
    u[0], u[1], u[2],
    v[0], v[1], v[2],
    w[0], w[1], w[2],
    translation[0], translation[1], translation[2],
  ]);

const ensureIndices = (indices: number[] | null, vertexCount: number): Uint32Array => {
  if (indices && indices.length > 0) {
    return new Uint32Array(indices);
  }
  const generated = new Uint32Array(vertexCount);
  for (let i = 0; i < vertexCount; i += 1) {
    generated[i] = i;
  }
  return generated;
};

const toSerializedGeometry = (mesh: any): SerializedGeometryData => ({
  positions: Array.from(mesh.vertProperties),
  indices: Array.from(mesh.triVerts),
});

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = requestSchema.parse(json);

    const { geometry, face, distance } = parsed;

    console.log('[geometry-operations] request received', {
      vertexCount: geometry.positions.length / 3,
      hasIndices: !!geometry.indices && geometry.indices.length > 0,
      distance,
      faceVertices: face.vertices.length,
      normal: face.normal,
    });

    if (face.vertices.length < 3) {
      return NextResponse.json(
        { error: 'Face requires at least three vertices' },
        { status: 400 }
      );
    }

    if (Math.abs(distance) < 1e-6) {
      return NextResponse.json({ geometry }, { status: 200 });
    }

    const manifold = await getManifoldInstance();
    const { Mesh, Manifold, CrossSection } = manifold;

    const vertProperties = new Float32Array(geometry.positions);
    const vertexCount = vertProperties.length / 3;
    const triVerts = ensureIndices(geometry.indices ?? null, vertexCount);

    if (triVerts.length % 3 !== 0) {
      return NextResponse.json(
        { error: 'Triangle indices length must be divisible by 3' },
        { status: 400 }
      );
    }

    const cleanup: Array<() => void> = [];

    try {
      const mesh = new Mesh({
        numProp: 3,
        vertProperties,
        triVerts,
      });

      const subject = new Manifold(mesh);
      cleanup.push(() => subject.delete());
      // Note: Mesh doesn't have delete() method, memory is managed by Manifold

      const basis = createPlaneBasis(face.normal);
      const outward = basis.w;
      const epsilon = Math.max(Math.abs(distance) * 1e-6, 1e-5);
      const extrudeHeight = Math.abs(distance) + epsilon;

      const push = distance >= 0;

      const localVertices = face.vertices.map<Vec3>((vertex) => [
        vertex[0] - face.center[0],
        vertex[1] - face.center[1],
        vertex[2] - face.center[2],
      ]);

      const projected = localVertices.map<[number, number]>((vertex) => [
        dot(vertex, basis.u),
        dot(vertex, basis.v),
      ]);

      const orderedPolygon = orderPolygonPoints(projected);

      const crossSection = new CrossSection([orderedPolygon]);
      cleanup.push(() => crossSection.delete());

      const extruded = crossSection.extrude(extrudeHeight);
      cleanup.push(() => extruded.delete());

      // Always keep W pointing outward for correct orientation
      const orientedW: Vec3 = [outward[0], outward[1], outward[2]];

      // For push (add): position base slightly inside face
      // For pull (subtract): position base at the distance point (negative = below face)
      const translation: Vec3 = push
        ? [
            face.center[0] - outward[0] * epsilon,
            face.center[1] - outward[1] * epsilon,
            face.center[2] - outward[2] * epsilon,
          ]
        : [
            face.center[0] + outward[0] * distance,
            face.center[1] + outward[1] * distance,
            face.center[2] + outward[2] * distance,
          ];

      const transform = toManifoldTransform(
        basis.u,
        basis.v,
        orientedW,
        translation
      );

      // @ts-expect-error - manifold-3d Mat4 type is compatible with Float32Array
      const extrudedManifold = extruded.transform(transform);
      cleanup.push(() => extrudedManifold.delete());

      // SketchUp-style behavior:
      // Positive distance = ADD volume (extrude up)
      // Negative distance = SUBTRACT volume (cut down into solid)
      const resultManifold = push
        ? subject.add(extrudedManifold)
        : subject.subtract(extrudedManifold);
      cleanup.push(() => resultManifold.delete());

      const resultMesh = resultManifold.getMesh();

      const responseGeometry = toSerializedGeometry(resultMesh);
      // Note: Mesh doesn't have delete() method, memory is managed by Manifold

      const response = NextResponse.json(
        { geometry: responseGeometry },
        { status: 200 }
      );
      console.log('[geometry-operations] success', {
        vertexCount: responseGeometry.positions.length / 3,
        hasIndices: !!responseGeometry.indices && responseGeometry.indices.length > 0,
      });
      return response;
    } finally {
      for (let i = cleanup.length - 1; i >= 0; i -= 1) {
        try {
          const cleanupFn = cleanup[i];
          if (cleanupFn) {
            cleanupFn();
          }
        } catch (disposeError) {
          console.error('geometry-operations cleanup error', disposeError);
        }
      }
    }
  } catch (error) {
    console.error('/api/geometry-operations error', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid payload', details: error.flatten() },
        { status: 400 }
      );
    }
    const message =
      error instanceof Error
        ? error.message
        : typeof error === 'string'
          ? error
          : JSON.stringify(error);
    return NextResponse.json(
      { error: 'Geometry operation failed', message },
      { status: 500 }
    );
  }
}
