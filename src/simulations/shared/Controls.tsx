/**
 * Simulation Controls Components
 *
 * Reusable UI components for controlling simulation parameters.
 */

import { type Component, type JSX, For, Show } from 'solid-js';
import './Controls.css';

// ============================================================================
// Slider Component
// ============================================================================

export interface SliderProps {
  /** Label displayed above the slider */
  label: string;
  /** Current value */
  value: number;
  /** Callback when value changes */
  onChange: (value: number) => void;
  /** Minimum value */
  min: number;
  /** Maximum value */
  max: number;
  /** Step increment (default: any) */
  step?: number;
  /** Unit to display after value (e.g., "Hz", "nm") */
  unit?: string;
  /** Whether to show the current value */
  showValue?: boolean;
  /** Number of decimal places for displayed value */
  precision?: number;
  /** Whether the slider is disabled */
  disabled?: boolean;
}

export const Slider: Component<SliderProps> = (props) => {
  const displayValue = () => {
    const precision = props.precision ?? 2;
    return props.value.toFixed(precision);
  };

  return (
    <div class="control-slider">
      <div class="control-header">
        <label class="control-label">{props.label}</label>
        <Show when={props.showValue !== false}>
          <span class="control-value">
            {displayValue()}
            {props.unit && <span class="control-unit">{props.unit}</span>}
          </span>
        </Show>
      </div>
      <input
        type="range"
        class="slider-input"
        min={props.min}
        max={props.max}
        step={props.step ?? 'any'}
        value={props.value}
        disabled={props.disabled}
        onInput={(e) => props.onChange(parseFloat(e.currentTarget.value))}
      />
    </div>
  );
};

// ============================================================================
// Toggle Component
// ============================================================================

export interface ToggleProps {
  /** Label for the toggle */
  label: string;
  /** Current state */
  checked: boolean;
  /** Callback when toggled */
  onChange: (checked: boolean) => void;
  /** Whether the toggle is disabled */
  disabled?: boolean;
}

export const Toggle: Component<ToggleProps> = (props) => {
  return (
    <label class="control-toggle" classList={{ disabled: props.disabled }}>
      <span class="toggle-label">{props.label}</span>
      <input
        type="checkbox"
        class="toggle-input"
        checked={props.checked}
        disabled={props.disabled}
        onChange={(e) => props.onChange(e.currentTarget.checked)}
      />
      <span class="toggle-switch" />
    </label>
  );
};

// ============================================================================
// Select Component
// ============================================================================

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  /** Label for the select */
  label: string;
  /** Current value */
  value: string;
  /** Callback when selection changes */
  onChange: (value: string) => void;
  /** Available options */
  options: SelectOption[];
  /** Whether the select is disabled */
  disabled?: boolean;
}

export const Select: Component<SelectProps> = (props) => {
  return (
    <div class="control-select">
      <label class="control-label">{props.label}</label>
      <select
        class="select-input"
        value={props.value}
        disabled={props.disabled}
        onChange={(e) => props.onChange(e.currentTarget.value)}
      >
        <For each={props.options}>
          {(option) => <option value={option.value}>{option.label}</option>}
        </For>
      </select>
    </div>
  );
};

// ============================================================================
// Button Component
// ============================================================================

export interface ButtonProps {
  /** Button text */
  children: JSX.Element;
  /** Click handler */
  onClick: () => void;
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'ghost';
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Additional CSS class */
  class?: string;
}

export const Button: Component<ButtonProps> = (props) => {
  return (
    <button
      class={`control-button ${props.variant ?? 'secondary'} ${props.class ?? ''}`}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

// ============================================================================
// Controls Panel Container
// ============================================================================

export interface ControlsPanelProps {
  /** Panel title */
  title?: string;
  /** Child controls */
  children: JSX.Element;
  /** Whether the panel is collapsible */
  collapsible?: boolean;
  /** Initial collapsed state */
  defaultCollapsed?: boolean;
}

export const ControlsPanel: Component<ControlsPanelProps> = (props) => {
  return (
    <div class="controls-panel">
      <Show when={props.title}>
        <h3 class="controls-title">{props.title}</h3>
      </Show>
      <div class="controls-content">{props.children}</div>
    </div>
  );
};

// ============================================================================
// Playback Controls
// ============================================================================

export interface PlaybackControlsProps {
  /** Whether the simulation is playing */
  playing: boolean;
  /** Toggle play/pause */
  onTogglePlay: () => void;
  /** Reset simulation */
  onReset: () => void;
  /** Step forward one frame (when paused) */
  onStep?: () => void;
  /** Current playback speed */
  speed?: number;
  /** Change playback speed */
  onSpeedChange?: (speed: number) => void;
}

export const PlaybackControls: Component<PlaybackControlsProps> = (props) => {
  return (
    <div class="playback-controls">
      <Button
        variant="primary"
        onClick={props.onTogglePlay}
        class="play-button"
      >
        {props.playing ? '⏸ Pause' : '▶ Play'}
      </Button>
      <Show when={props.onStep}>
        <Button
          variant="secondary"
          onClick={props.onStep!}
          disabled={props.playing}
          class="step-button"
        >
          ⏭ Step
        </Button>
      </Show>
      <Button variant="ghost" onClick={props.onReset} class="reset-button">
        ↺ Reset
      </Button>
      <Show when={props.onSpeedChange}>
        <Slider
          label="Speed"
          value={props.speed ?? 1}
          onChange={props.onSpeedChange!}
          min={0.1}
          max={3}
          step={0.1}
          unit="×"
          precision={1}
        />
      </Show>
    </div>
  );
};

export default {
  Slider,
  Toggle,
  Select,
  Button,
  ControlsPanel,
  PlaybackControls,
};
