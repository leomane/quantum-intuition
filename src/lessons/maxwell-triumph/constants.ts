/**
 * Maxwell's Triumph — Physics Constants & Utilities
 *
 * Constants for electromagnetic wave simulation and
 * wavelength-to-color conversion.
 */

// =============================================================================
// Physical Constants
// =============================================================================

/** Permittivity of free space (F/m) */
export const EPSILON_0 = 8.854187817e-12;

/** Permeability of free space (H/m) */
export const MU_0 = 4 * Math.PI * 1e-7; // ~1.2566370614e-6

/** Speed of light in vacuum (m/s) - derived from ε₀ and μ₀ */
export const SPEED_OF_LIGHT = 1 / Math.sqrt(EPSILON_0 * MU_0); // ~299,792,458

/**
 * Calculate speed of light from permittivity and permeability.
 * c = 1 / √(ε₀μ₀)
 */
export function calculateSpeedOfLight(epsilon: number, mu: number): number {
  return 1 / Math.sqrt(epsilon * mu);
}

// =============================================================================
// Wavelength Ranges
// =============================================================================

/** Visible light range in nanometers */
export const VISIBLE_MIN_NM = 380; // violet
export const VISIBLE_MAX_NM = 780; // red

/** Simulation wavelength range in nanometers */
export const WAVELENGTH_MIN_NM = 100; // deep UV
export const WAVELENGTH_MAX_NM = 1_000_000; // 1mm (radio)

/** Default wavelength (green light) */
export const DEFAULT_WAVELENGTH_NM = 550;

// =============================================================================
// Slider Ranges for ε₀ and μ₀
// =============================================================================

export const EPSILON_SLIDER_MIN = EPSILON_0 * 0.5;
export const EPSILON_SLIDER_MAX = EPSILON_0 * 2.0;

export const MU_SLIDER_MIN = MU_0 * 0.5;
export const MU_SLIDER_MAX = MU_0 * 2.0;

// =============================================================================
// Wavelength-to-Color Conversion
// =============================================================================

interface WavelengthInfo {
  /** RGB color array [r, g, b] (0-255) */
  rgb: [number, number, number];
  /** Human-readable label for the wavelength region */
  label: string;
  /** Whether this is in the visible spectrum */
  isVisible: boolean;
}

/**
 * Convert wavelength (in nm) to approximate RGB color and label.
 * Based on Dan Bruton's algorithm for visible spectrum.
 */
export function wavelengthToInfo(wavelengthNm: number): WavelengthInfo {
  // Non-visible regions
  if (wavelengthNm < 380) {
    return {
      rgb: [138, 90, 180], // purple-ish for UV
      label: 'Ultraviolet',
      isVisible: false,
    };
  }

  if (wavelengthNm > 780) {
    if (wavelengthNm < 1_000_000) {
      return {
        rgb: [120, 60, 60], // dark red for IR
        label: 'Infrared',
        isVisible: false,
      };
    }
    return {
      rgb: [80, 80, 80], // gray for radio
      label: 'Radio',
      isVisible: false,
    };
  }

  // Visible spectrum: use Dan Bruton's approximation
  let r = 0, g = 0, b = 0;

  if (wavelengthNm >= 380 && wavelengthNm < 440) {
    r = -(wavelengthNm - 440) / (440 - 380);
    g = 0;
    b = 1;
  } else if (wavelengthNm >= 440 && wavelengthNm < 490) {
    r = 0;
    g = (wavelengthNm - 440) / (490 - 440);
    b = 1;
  } else if (wavelengthNm >= 490 && wavelengthNm < 510) {
    r = 0;
    g = 1;
    b = -(wavelengthNm - 510) / (510 - 490);
  } else if (wavelengthNm >= 510 && wavelengthNm < 580) {
    r = (wavelengthNm - 510) / (580 - 510);
    g = 1;
    b = 0;
  } else if (wavelengthNm >= 580 && wavelengthNm < 645) {
    r = 1;
    g = -(wavelengthNm - 645) / (645 - 580);
    b = 0;
  } else if (wavelengthNm >= 645 && wavelengthNm <= 780) {
    r = 1;
    g = 0;
    b = 0;
  }

  // Intensity falloff at edges of visible spectrum
  let intensity = 1;
  if (wavelengthNm >= 380 && wavelengthNm < 420) {
    intensity = 0.3 + 0.7 * (wavelengthNm - 380) / (420 - 380);
  } else if (wavelengthNm > 700 && wavelengthNm <= 780) {
    intensity = 0.3 + 0.7 * (780 - wavelengthNm) / (780 - 700);
  }

  // Apply intensity and convert to 0-255
  const rgb: [number, number, number] = [
    Math.round(r * intensity * 255),
    Math.round(g * intensity * 255),
    Math.round(b * intensity * 255),
  ];

  // Label for visible colors
  let label = 'Visible';
  if (wavelengthNm < 450) label = 'Violet';
  else if (wavelengthNm < 495) label = 'Blue';
  else if (wavelengthNm < 520) label = 'Cyan';
  else if (wavelengthNm < 565) label = 'Green';
  else if (wavelengthNm < 590) label = 'Yellow';
  else if (wavelengthNm < 625) label = 'Orange';
  else label = 'Red';

  return { rgb, label, isVisible: true };
}

/**
 * Format wavelength for display.
 * Uses nm for small values, μm for mid-range, mm for large.
 */
export function formatWavelength(wavelengthNm: number): string {
  if (wavelengthNm < 1000) {
    return `${wavelengthNm.toFixed(0)} nm`;
  } else if (wavelengthNm < 1_000_000) {
    return `${(wavelengthNm / 1000).toFixed(2)} μm`;
  } else {
    return `${(wavelengthNm / 1_000_000).toFixed(2)} mm`;
  }
}

/**
 * Format frequency for display.
 * Uses THz for high frequencies, GHz for lower.
 */
export function formatFrequency(frequencyHz: number): string {
  if (frequencyHz >= 1e12) {
    return `${(frequencyHz / 1e12).toFixed(1)} THz`;
  } else if (frequencyHz >= 1e9) {
    return `${(frequencyHz / 1e9).toFixed(1)} GHz`;
  } else if (frequencyHz >= 1e6) {
    return `${(frequencyHz / 1e6).toFixed(1)} MHz`;
  } else {
    return `${(frequencyHz / 1e3).toFixed(1)} kHz`;
  }
}

/**
 * Format speed of light for display.
 */
export function formatSpeedOfLight(c: number): string {
  return `${(c / 1e8).toFixed(3)} × 10⁸ m/s`;
}

/**
 * Calculate frequency from wavelength and speed of light.
 * f = c / λ
 */
export function calculateFrequency(wavelengthM: number, c: number): number {
  return c / wavelengthM;
}

/**
 * Convert nanometers to meters.
 */
export function nmToM(nm: number): number {
  return nm * 1e-9;
}
