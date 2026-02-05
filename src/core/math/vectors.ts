/**
 * Vector Mathematics
 *
 * 2D and 3D vector operations for simulations and visualizations.
 * Used in: particle trajectories, electromagnetic fields, spacetime diagrams.
 */

// ============================================================================
// Types
// ============================================================================

export interface Vector2D {
  x: number;
  y: number;
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

// ============================================================================
// 2D Vector Operations
// ============================================================================

/**
 * Create a 2D vector.
 */
export function vec2(x: number, y: number): Vector2D {
  return { x, y };
}

/**
 * 2D zero vector.
 */
export const ZERO_2D: Vector2D = { x: 0, y: 0 };

/**
 * Add two 2D vectors.
 */
export function add2D(v1: Vector2D, v2: Vector2D): Vector2D {
  return { x: v1.x + v2.x, y: v1.y + v2.y };
}

/**
 * Subtract 2D vectors: v1 - v2
 */
export function subtract2D(v1: Vector2D, v2: Vector2D): Vector2D {
  return { x: v1.x - v2.x, y: v1.y - v2.y };
}

/**
 * Scale a 2D vector by a scalar.
 */
export function scale2D(v: Vector2D, scalar: number): Vector2D {
  return { x: v.x * scalar, y: v.y * scalar };
}

/**
 * Negate a 2D vector.
 */
export function negate2D(v: Vector2D): Vector2D {
  return { x: -v.x, y: -v.y };
}

/**
 * Magnitude (length) of a 2D vector.
 */
export function magnitude2D(v: Vector2D): number {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

/**
 * Magnitude squared (avoids sqrt for performance).
 */
export function magnitudeSquared2D(v: Vector2D): number {
  return v.x * v.x + v.y * v.y;
}

/**
 * Normalize a 2D vector to unit length.
 */
export function normalize2D(v: Vector2D): Vector2D {
  const mag = magnitude2D(v);
  if (mag === 0) return ZERO_2D;
  return { x: v.x / mag, y: v.y / mag };
}

/**
 * Dot product of two 2D vectors.
 */
export function dot2D(v1: Vector2D, v2: Vector2D): number {
  return v1.x * v2.x + v1.y * v2.y;
}

/**
 * 2D cross product (returns scalar - the z-component of 3D cross product).
 *
 * Useful for determining rotation direction.
 */
export function cross2D(v1: Vector2D, v2: Vector2D): number {
  return v1.x * v2.y - v1.y * v2.x;
}

/**
 * Distance between two 2D points.
 */
export function distance2D(v1: Vector2D, v2: Vector2D): number {
  return magnitude2D(subtract2D(v1, v2));
}

/**
 * Rotate a 2D vector by an angle (in radians).
 */
export function rotate2D(v: Vector2D, angle: number): Vector2D {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: v.x * cos - v.y * sin,
    y: v.x * sin + v.y * cos,
  };
}

/**
 * Get the angle of a 2D vector (in radians, from positive x-axis).
 */
export function angle2D(v: Vector2D): number {
  return Math.atan2(v.y, v.x);
}

/**
 * Linear interpolation between two 2D vectors.
 *
 * @param t - interpolation parameter (0 = v1, 1 = v2)
 */
export function lerp2D(v1: Vector2D, v2: Vector2D, t: number): Vector2D {
  return {
    x: v1.x + (v2.x - v1.x) * t,
    y: v1.y + (v2.y - v1.y) * t,
  };
}

/**
 * Limit the magnitude of a 2D vector.
 */
export function limit2D(v: Vector2D, maxMag: number): Vector2D {
  const magSq = magnitudeSquared2D(v);
  if (magSq > maxMag * maxMag) {
    const mag = Math.sqrt(magSq);
    return { x: (v.x / mag) * maxMag, y: (v.y / mag) * maxMag };
  }
  return v;
}

/**
 * Create a 2D vector from polar coordinates.
 */
export function fromPolar2D(r: number, theta: number): Vector2D {
  return { x: r * Math.cos(theta), y: r * Math.sin(theta) };
}

// ============================================================================
// 3D Vector Operations
// ============================================================================

/**
 * Create a 3D vector.
 */
export function vec3(x: number, y: number, z: number): Vector3D {
  return { x, y, z };
}

/**
 * 3D zero vector.
 */
export const ZERO_3D: Vector3D = { x: 0, y: 0, z: 0 };

/**
 * Unit vectors.
 */
export const UNIT_X: Vector3D = { x: 1, y: 0, z: 0 };
export const UNIT_Y: Vector3D = { x: 0, y: 1, z: 0 };
export const UNIT_Z: Vector3D = { x: 0, y: 0, z: 1 };

/**
 * Add two 3D vectors.
 */
export function add3D(v1: Vector3D, v2: Vector3D): Vector3D {
  return { x: v1.x + v2.x, y: v1.y + v2.y, z: v1.z + v2.z };
}

/**
 * Subtract 3D vectors: v1 - v2
 */
export function subtract3D(v1: Vector3D, v2: Vector3D): Vector3D {
  return { x: v1.x - v2.x, y: v1.y - v2.y, z: v1.z - v2.z };
}

/**
 * Scale a 3D vector by a scalar.
 */
export function scale3D(v: Vector3D, scalar: number): Vector3D {
  return { x: v.x * scalar, y: v.y * scalar, z: v.z * scalar };
}

/**
 * Negate a 3D vector.
 */
export function negate3D(v: Vector3D): Vector3D {
  return { x: -v.x, y: -v.y, z: -v.z };
}

/**
 * Magnitude (length) of a 3D vector.
 */
export function magnitude3D(v: Vector3D): number {
  return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}

/**
 * Magnitude squared (avoids sqrt for performance).
 */
export function magnitudeSquared3D(v: Vector3D): number {
  return v.x * v.x + v.y * v.y + v.z * v.z;
}

/**
 * Normalize a 3D vector to unit length.
 */
export function normalize3D(v: Vector3D): Vector3D {
  const mag = magnitude3D(v);
  if (mag === 0) return ZERO_3D;
  return { x: v.x / mag, y: v.y / mag, z: v.z / mag };
}

/**
 * Dot product of two 3D vectors.
 */
export function dot3D(v1: Vector3D, v2: Vector3D): number {
  return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}

/**
 * Cross product of two 3D vectors.
 *
 * The result is perpendicular to both input vectors.
 * Used in: electromagnetic fields (E × B = Poynting vector)
 */
export function cross3D(v1: Vector3D, v2: Vector3D): Vector3D {
  return {
    x: v1.y * v2.z - v1.z * v2.y,
    y: v1.z * v2.x - v1.x * v2.z,
    z: v1.x * v2.y - v1.y * v2.x,
  };
}

/**
 * Distance between two 3D points.
 */
export function distance3D(v1: Vector3D, v2: Vector3D): number {
  return magnitude3D(subtract3D(v1, v2));
}

/**
 * Linear interpolation between two 3D vectors.
 */
export function lerp3D(v1: Vector3D, v2: Vector3D, t: number): Vector3D {
  return {
    x: v1.x + (v2.x - v1.x) * t,
    y: v1.y + (v2.y - v1.y) * t,
    z: v1.z + (v2.z - v1.z) * t,
  };
}

/**
 * Limit the magnitude of a 3D vector.
 */
export function limit3D(v: Vector3D, maxMag: number): Vector3D {
  const magSq = magnitudeSquared3D(v);
  if (magSq > maxMag * maxMag) {
    const mag = Math.sqrt(magSq);
    return {
      x: (v.x / mag) * maxMag,
      y: (v.y / mag) * maxMag,
      z: (v.z / mag) * maxMag,
    };
  }
  return v;
}

/**
 * Create a 3D vector from spherical coordinates.
 *
 * @param r - radius (distance from origin)
 * @param theta - polar angle from z-axis (0 to π)
 * @param phi - azimuthal angle in xy-plane from x-axis (0 to 2π)
 */
export function fromSpherical(r: number, theta: number, phi: number): Vector3D {
  const sinTheta = Math.sin(theta);
  return {
    x: r * sinTheta * Math.cos(phi),
    y: r * sinTheta * Math.sin(phi),
    z: r * Math.cos(theta),
  };
}

/**
 * Convert a 3D vector to spherical coordinates.
 *
 * @returns [r, theta, phi]
 */
export function toSpherical(v: Vector3D): [number, number, number] {
  const r = magnitude3D(v);
  if (r === 0) return [0, 0, 0];
  const theta = Math.acos(v.z / r);
  const phi = Math.atan2(v.y, v.x);
  return [r, theta, phi];
}

/**
 * Reflect a vector off a surface with given normal.
 */
export function reflect3D(v: Vector3D, normal: Vector3D): Vector3D {
  const d = dot3D(v, normal) * 2;
  return subtract3D(v, scale3D(normal, d));
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Check if two 2D vectors are approximately equal.
 */
export function equals2D(v1: Vector2D, v2: Vector2D, epsilon: number = 1e-10): boolean {
  return Math.abs(v1.x - v2.x) < epsilon && Math.abs(v1.y - v2.y) < epsilon;
}

/**
 * Check if two 3D vectors are approximately equal.
 */
export function equals3D(v1: Vector3D, v2: Vector3D, epsilon: number = 1e-10): boolean {
  return (
    Math.abs(v1.x - v2.x) < epsilon &&
    Math.abs(v1.y - v2.y) < epsilon &&
    Math.abs(v1.z - v2.z) < epsilon
  );
}
