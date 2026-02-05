/**
 * Complex Number Tests
 *
 * Verifies the complex number operations used in quantum mechanics.
 */

import { describe, it, expect } from 'vitest';
import {
  complex,
  fromPolar,
  add,
  subtract,
  multiply,
  divide,
  conjugate,
  magnitude,
  magnitudeSquared,
  phase,
  exp,
  equals,
  normalize,
  innerProduct,
  ZERO,
  ONE,
  I,
} from '../../src/core/math/complex';

describe('Complex Number Operations', () => {
  describe('Construction', () => {
    it('creates complex numbers from real and imaginary parts', () => {
      const z = complex(3, 4);
      expect(z.re).toBe(3);
      expect(z.im).toBe(4);
    });

    it('creates real numbers when imaginary part is omitted', () => {
      const z = complex(5);
      expect(z.re).toBe(5);
      expect(z.im).toBe(0);
    });

    it('creates complex numbers from polar form', () => {
      const z = fromPolar(1, Math.PI / 2); // e^(i*π/2) = i
      expect(z.re).toBeCloseTo(0, 10);
      expect(z.im).toBeCloseTo(1, 10);
    });
  });

  describe('Basic Operations', () => {
    it('adds complex numbers correctly', () => {
      const z1 = complex(3, 4);
      const z2 = complex(1, 2);
      const result = add(z1, z2);
      expect(result.re).toBe(4);
      expect(result.im).toBe(6);
    });

    it('subtracts complex numbers correctly', () => {
      const z1 = complex(3, 4);
      const z2 = complex(1, 2);
      const result = subtract(z1, z2);
      expect(result.re).toBe(2);
      expect(result.im).toBe(2);
    });

    it('multiplies complex numbers correctly', () => {
      // (3 + 4i)(1 + 2i) = 3 + 6i + 4i + 8i² = 3 + 10i - 8 = -5 + 10i
      const z1 = complex(3, 4);
      const z2 = complex(1, 2);
      const result = multiply(z1, z2);
      expect(result.re).toBe(-5);
      expect(result.im).toBe(10);
    });

    it('divides complex numbers correctly', () => {
      // (3 + 4i) / (1 + 2i) = (3 + 4i)(1 - 2i) / |1 + 2i|²
      // = (3 - 6i + 4i - 8i²) / 5 = (3 - 2i + 8) / 5 = (11 - 2i) / 5
      const z1 = complex(3, 4);
      const z2 = complex(1, 2);
      const result = divide(z1, z2);
      expect(result.re).toBeCloseTo(2.2, 10);
      expect(result.im).toBeCloseTo(-0.4, 10);
    });
  });

  describe('Complex-specific Operations', () => {
    it('computes conjugate correctly', () => {
      const z = complex(3, 4);
      const conj = conjugate(z);
      expect(conj.re).toBe(3);
      expect(conj.im).toBe(-4);
    });

    it('computes magnitude correctly', () => {
      // |3 + 4i| = 5 (Pythagorean theorem)
      const z = complex(3, 4);
      expect(magnitude(z)).toBe(5);
    });

    it('computes magnitude squared correctly', () => {
      const z = complex(3, 4);
      expect(magnitudeSquared(z)).toBe(25);
    });

    it('computes phase correctly', () => {
      const z = complex(1, 1); // 45 degrees
      expect(phase(z)).toBeCloseTo(Math.PI / 4, 10);
    });
  });

  describe('Euler\'s Formula', () => {
    it('e^(i*π) = -1', () => {
      const z = exp(complex(0, Math.PI));
      expect(z.re).toBeCloseTo(-1, 10);
      expect(z.im).toBeCloseTo(0, 10);
    });

    it('e^(i*π/2) = i', () => {
      const z = exp(complex(0, Math.PI / 2));
      expect(z.re).toBeCloseTo(0, 10);
      expect(z.im).toBeCloseTo(1, 10);
    });
  });

  describe('Quantum Mechanics Applications', () => {
    it('z * conj(z) = |z|² (always real)', () => {
      const z = complex(3, 4);
      const product = multiply(z, conjugate(z));
      expect(product.re).toBe(25);
      expect(product.im).toBe(0);
    });

    it('normalizes wave function arrays', () => {
      const waveFunction = [
        complex(1, 0),
        complex(1, 0),
        complex(1, 0),
        complex(1, 0),
      ];
      const normalized = normalize(waveFunction);

      // Check normalization: sum of |ψ|² should be 1
      const totalProb = normalized.reduce(
        (sum, z) => sum + magnitudeSquared(z),
        0
      );
      expect(totalProb).toBeCloseTo(1, 10);
    });

    it('computes inner product correctly', () => {
      // <ψ|φ> where ψ = [1, i] and φ = [1, 1]
      // = conj(1)*1 + conj(i)*1 = 1 - i
      const psi = [complex(1, 0), complex(0, 1)];
      const phi = [complex(1, 0), complex(1, 0)];
      const inner = innerProduct(psi, phi);
      expect(inner.re).toBeCloseTo(1, 10);
      expect(inner.im).toBeCloseTo(-1, 10);
    });

    it('orthogonal states have zero inner product', () => {
      // |+⟩ = [1, 1]/√2 and |-⟩ = [1, -1]/√2 are orthogonal
      const plus = normalize([complex(1, 0), complex(1, 0)]);
      const minus = normalize([complex(1, 0), complex(-1, 0)]);
      const inner = innerProduct(plus, minus);
      expect(magnitude(inner)).toBeCloseTo(0, 10);
    });
  });

  describe('Constants', () => {
    it('ZERO is 0 + 0i', () => {
      expect(ZERO.re).toBe(0);
      expect(ZERO.im).toBe(0);
    });

    it('ONE is 1 + 0i', () => {
      expect(ONE.re).toBe(1);
      expect(ONE.im).toBe(0);
    });

    it('I is 0 + 1i', () => {
      expect(I.re).toBe(0);
      expect(I.im).toBe(1);
    });

    it('i² = -1', () => {
      const result = multiply(I, I);
      expect(result.re).toBe(-1);
      expect(result.im).toBe(0);
    });
  });
});
