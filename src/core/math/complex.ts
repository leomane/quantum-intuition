/**
 * Complex Number Operations
 *
 * Complex numbers are fundamental to quantum mechanics - wave functions
 * are complex-valued, and interference arises from complex addition.
 *
 * A complex number z = a + bi where:
 *   a = real part (Re(z))
 *   b = imaginary part (Im(z))
 *   i = sqrt(-1)
 */

export interface Complex {
  re: number;
  im: number;
}

// ============================================================================
// Construction
// ============================================================================

/**
 * Create a complex number from real and imaginary parts.
 */
export function complex(re: number, im: number = 0): Complex {
  return { re, im };
}

/**
 * Create a complex number from polar form: r * e^(i*theta)
 *
 * @param r - magnitude (modulus)
 * @param theta - phase angle in radians
 */
export function fromPolar(r: number, theta: number): Complex {
  return {
    re: r * Math.cos(theta),
    im: r * Math.sin(theta),
  };
}

/**
 * Complex zero: 0 + 0i
 */
export const ZERO: Complex = { re: 0, im: 0 };

/**
 * Complex one: 1 + 0i
 */
export const ONE: Complex = { re: 1, im: 0 };

/**
 * Imaginary unit: 0 + 1i
 */
export const I: Complex = { re: 0, im: 1 };

// ============================================================================
// Basic Operations
// ============================================================================

/**
 * Add two complex numbers: (a + bi) + (c + di) = (a+c) + (b+d)i
 */
export function add(z1: Complex, z2: Complex): Complex {
  return {
    re: z1.re + z2.re,
    im: z1.im + z2.im,
  };
}

/**
 * Subtract complex numbers: (a + bi) - (c + di) = (a-c) + (b-d)i
 */
export function subtract(z1: Complex, z2: Complex): Complex {
  return {
    re: z1.re - z2.re,
    im: z1.im - z2.im,
  };
}

/**
 * Multiply complex numbers: (a + bi)(c + di) = (ac - bd) + (ad + bc)i
 */
export function multiply(z1: Complex, z2: Complex): Complex {
  return {
    re: z1.re * z2.re - z1.im * z2.im,
    im: z1.re * z2.im + z1.im * z2.re,
  };
}

/**
 * Divide complex numbers: (a + bi) / (c + di)
 *
 * Uses the identity: z1/z2 = z1 * conj(z2) / |z2|^2
 */
export function divide(z1: Complex, z2: Complex): Complex {
  const denom = z2.re * z2.re + z2.im * z2.im;
  if (denom === 0) {
    throw new Error('Division by zero');
  }
  return {
    re: (z1.re * z2.re + z1.im * z2.im) / denom,
    im: (z1.im * z2.re - z1.re * z2.im) / denom,
  };
}

/**
 * Multiply a complex number by a real scalar.
 */
export function scale(z: Complex, scalar: number): Complex {
  return {
    re: z.re * scalar,
    im: z.im * scalar,
  };
}

/**
 * Negate a complex number: -(a + bi) = -a - bi
 */
export function negate(z: Complex): Complex {
  return { re: -z.re, im: -z.im };
}

// ============================================================================
// Complex-specific Operations
// ============================================================================

/**
 * Complex conjugate: conj(a + bi) = a - bi
 *
 * Important property: z * conj(z) = |z|^2 (always real)
 * Used in: probability density |ψ|² = ψ * conj(ψ)
 */
export function conjugate(z: Complex): Complex {
  return { re: z.re, im: -z.im };
}

/**
 * Magnitude (modulus): |z| = sqrt(a² + b²)
 *
 * For wave functions: |ψ| is the probability amplitude
 */
export function magnitude(z: Complex): number {
  return Math.sqrt(z.re * z.re + z.im * z.im);
}

/**
 * Magnitude squared: |z|² = a² + b²
 *
 * For wave functions: |ψ|² is the probability density
 * This is more efficient than magnitude() when you don't need the sqrt.
 */
export function magnitudeSquared(z: Complex): number {
  return z.re * z.re + z.im * z.im;
}

/**
 * Phase angle: arg(z) = atan2(b, a)
 *
 * Returns angle in radians in range (-π, π]
 * The phase is crucial for interference effects.
 */
export function phase(z: Complex): number {
  return Math.atan2(z.im, z.re);
}

/**
 * Complex exponential: e^(a + bi) = e^a * (cos(b) + i*sin(b))
 *
 * Euler's formula when a = 0: e^(i*theta) = cos(theta) + i*sin(theta)
 * This is fundamental to quantum mechanics - time evolution is e^(-iHt/ℏ)
 */
export function exp(z: Complex): Complex {
  const expReal = Math.exp(z.re);
  return {
    re: expReal * Math.cos(z.im),
    im: expReal * Math.sin(z.im),
  };
}

/**
 * Complex natural logarithm: ln(z) = ln|z| + i*arg(z)
 */
export function ln(z: Complex): Complex {
  return {
    re: Math.log(magnitude(z)),
    im: phase(z),
  };
}

/**
 * Complex square root: sqrt(z)
 *
 * Returns the principal square root.
 */
export function sqrt(z: Complex): Complex {
  const r = magnitude(z);
  const theta = phase(z);
  return fromPolar(Math.sqrt(r), theta / 2);
}

/**
 * Complex power: z^n where n is a real number
 */
export function pow(z: Complex, n: number): Complex {
  const r = magnitude(z);
  const theta = phase(z);
  return fromPolar(Math.pow(r, n), n * theta);
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Check if two complex numbers are approximately equal.
 */
export function equals(z1: Complex, z2: Complex, epsilon: number = 1e-10): boolean {
  return (
    Math.abs(z1.re - z2.re) < epsilon &&
    Math.abs(z1.im - z2.im) < epsilon
  );
}

/**
 * Check if a complex number is approximately zero.
 */
export function isZero(z: Complex, epsilon: number = 1e-10): boolean {
  return magnitudeSquared(z) < epsilon * epsilon;
}

/**
 * Check if a complex number is approximately real (imaginary part ≈ 0).
 */
export function isReal(z: Complex, epsilon: number = 1e-10): boolean {
  return Math.abs(z.im) < epsilon;
}

/**
 * Check if a complex number is approximately imaginary (real part ≈ 0).
 */
export function isImaginary(z: Complex, epsilon: number = 1e-10): boolean {
  return Math.abs(z.re) < epsilon;
}

/**
 * Format a complex number as a string.
 */
export function toString(z: Complex, precision: number = 4): string {
  const re = z.re.toFixed(precision);
  const im = Math.abs(z.im).toFixed(precision);

  if (Math.abs(z.im) < 1e-10) {
    return re;
  }
  if (Math.abs(z.re) < 1e-10) {
    return z.im >= 0 ? `${im}i` : `-${im}i`;
  }

  const sign = z.im >= 0 ? '+' : '-';
  return `${re} ${sign} ${im}i`;
}

// ============================================================================
// Array Operations (for wave functions)
// ============================================================================

/**
 * Add two arrays of complex numbers element-wise.
 */
export function addArrays(arr1: Complex[], arr2: Complex[]): Complex[] {
  if (arr1.length !== arr2.length) {
    throw new Error('Arrays must have the same length');
  }
  return arr1.map((z, i) => add(z, arr2[i]));
}

/**
 * Scale an array of complex numbers by a complex factor.
 */
export function scaleArray(arr: Complex[], factor: Complex): Complex[] {
  return arr.map(z => multiply(z, factor));
}

/**
 * Compute the inner product (dot product) of two complex arrays.
 *
 * <ψ|φ> = Σ conj(ψᵢ) * φᵢ
 *
 * This is the quantum mechanical inner product.
 */
export function innerProduct(arr1: Complex[], arr2: Complex[]): Complex {
  if (arr1.length !== arr2.length) {
    throw new Error('Arrays must have the same length');
  }
  return arr1.reduce(
    (sum, z, i) => add(sum, multiply(conjugate(z), arr2[i])),
    ZERO
  );
}

/**
 * Compute the norm of a complex array: ||ψ|| = sqrt(<ψ|ψ>)
 */
export function norm(arr: Complex[]): number {
  const inner = innerProduct(arr, arr);
  return Math.sqrt(inner.re); // Inner product with self is always real
}

/**
 * Normalize a complex array to unit norm.
 *
 * For wave functions: ensures ∫|ψ|² = 1 (total probability = 1)
 */
export function normalize(arr: Complex[]): Complex[] {
  const n = norm(arr);
  if (n === 0) {
    throw new Error('Cannot normalize zero vector');
  }
  return arr.map(z => scale(z, 1 / n));
}
