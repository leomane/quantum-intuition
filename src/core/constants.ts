/**
 * Physical Constants
 *
 * Fundamental constants of nature used throughout quantum mechanics
 * and related physics simulations.
 *
 * All values in SI units unless otherwise noted.
 * Source: CODATA 2018 recommended values
 */

// ============================================================================
// Fundamental Constants
// ============================================================================

/**
 * Speed of light in vacuum (m/s)
 *
 * Exact value since 2019 redefinition of SI units.
 */
export const SPEED_OF_LIGHT = 299792458;
export const c = SPEED_OF_LIGHT;

/**
 * Planck constant (J·s)
 *
 * The quantum of action. E = hf relates energy to frequency.
 * Exact value since 2019 redefinition.
 */
export const PLANCK_CONSTANT = 6.62607015e-34;
export const h = PLANCK_CONSTANT;

/**
 * Reduced Planck constant (ℏ = h/2π) (J·s)
 *
 * More convenient in quantum mechanics. Appears in Schrödinger's equation.
 */
export const HBAR = 1.054571817e-34;

/**
 * Elementary charge (C)
 *
 * Charge of a proton (electron has -e). Exact since 2019.
 */
export const ELEMENTARY_CHARGE = 1.602176634e-19;
export const e = ELEMENTARY_CHARGE;

/**
 * Electron mass (kg)
 */
export const ELECTRON_MASS = 9.1093837015e-31;
export const m_e = ELECTRON_MASS;

/**
 * Proton mass (kg)
 */
export const PROTON_MASS = 1.67262192369e-27;
export const m_p = PROTON_MASS;

/**
 * Boltzmann constant (J/K)
 *
 * Relates temperature to energy. Exact since 2019.
 * k_B * T gives thermal energy scale.
 */
export const BOLTZMANN_CONSTANT = 1.380649e-23;
export const k_B = BOLTZMANN_CONSTANT;

/**
 * Avogadro constant (mol⁻¹)
 *
 * Number of particles in a mole. Exact since 2019.
 */
export const AVOGADRO_CONSTANT = 6.02214076e23;
export const N_A = AVOGADRO_CONSTANT;

/**
 * Gas constant R = N_A * k_B (J/(mol·K))
 */
export const GAS_CONSTANT = 8.314462618;
export const R = GAS_CONSTANT;

/**
 * Vacuum permittivity ε₀ (F/m)
 *
 * Electric constant. Appears in Coulomb's law.
 */
export const VACUUM_PERMITTIVITY = 8.8541878128e-12;
export const epsilon_0 = VACUUM_PERMITTIVITY;

/**
 * Vacuum permeability μ₀ (N/A² or H/m)
 *
 * Magnetic constant. Note: c² = 1/(ε₀μ₀)
 */
export const VACUUM_PERMEABILITY = 1.25663706212e-6;
export const mu_0 = VACUUM_PERMEABILITY;

// ============================================================================
// Derived Constants
// ============================================================================

/**
 * Fine structure constant α ≈ 1/137
 *
 * Dimensionless constant governing electromagnetic interactions.
 * α = e²/(4πε₀ℏc)
 */
export const FINE_STRUCTURE_CONSTANT = 7.2973525693e-3;
export const alpha = FINE_STRUCTURE_CONSTANT;

/**
 * Bohr radius a₀ (m)
 *
 * Most probable distance of electron from nucleus in hydrogen ground state.
 * a₀ = 4πε₀ℏ²/(m_e·e²) ≈ 0.529 Å
 */
export const BOHR_RADIUS = 5.29177210903e-11;
export const a_0 = BOHR_RADIUS;

/**
 * Rydberg energy (J)
 *
 * Energy scale for hydrogen atom: E_n = -R_y/n²
 */
export const RYDBERG_ENERGY = 2.1798723611035e-18;
export const R_y = RYDBERG_ENERGY;

/**
 * Rydberg energy in electron volts (eV)
 */
export const RYDBERG_ENERGY_EV = 13.605693122994;

/**
 * Hartree energy E_h = 2R_y (J)
 *
 * Natural energy unit in atomic physics.
 */
export const HARTREE_ENERGY = 4.3597447222071e-18;
export const E_h = HARTREE_ENERGY;

// ============================================================================
// Unit Conversions
// ============================================================================

/**
 * Electron volt to Joules
 */
export const EV_TO_JOULES = 1.602176634e-19;

/**
 * Joules to electron volts
 */
export const JOULES_TO_EV = 1 / EV_TO_JOULES;

/**
 * Angstrom to meters
 */
export const ANGSTROM_TO_METERS = 1e-10;

/**
 * Nanometer to meters
 */
export const NANOMETER_TO_METERS = 1e-9;

// ============================================================================
// Natural Units (ℏ = c = 1)
// ============================================================================

/**
 * In natural units, we set ℏ = c = 1.
 * This simplifies equations but requires careful unit conversion.
 *
 * Conversion factors:
 * - Energy: 1 eV ↔ natural unit of energy
 * - Length: ℏc/eV ≈ 197.3 nm ↔ 1/(natural unit of length)
 * - Time: ℏ/eV ≈ 6.58 × 10⁻¹⁶ s ↔ 1/(natural unit of time)
 */

export const NATURAL_LENGTH_SCALE = 1.9732697e-7; // ℏc in eV·m
export const NATURAL_TIME_SCALE = 6.582119569e-16; // ℏ in eV·s

// ============================================================================
// Useful Derived Quantities
// ============================================================================

/**
 * Thermal wavelength prefactor
 *
 * λ_thermal = h / sqrt(2π m k_B T)
 * This gives the thermal de Broglie wavelength.
 */
export function thermalWavelength(mass: number, temperature: number): number {
  return h / Math.sqrt(2 * Math.PI * mass * k_B * temperature);
}

/**
 * de Broglie wavelength: λ = h/p
 *
 * The wavelength associated with a particle of momentum p.
 */
export function deBroglieWavelength(momentum: number): number {
  return h / momentum;
}

/**
 * Photon energy from wavelength: E = hc/λ
 */
export function photonEnergy(wavelength: number): number {
  return (h * c) / wavelength;
}

/**
 * Photon wavelength from energy: λ = hc/E
 */
export function photonWavelength(energy: number): number {
  return (h * c) / energy;
}

/**
 * Photon frequency from wavelength: f = c/λ
 */
export function photonFrequency(wavelength: number): number {
  return c / wavelength;
}
