/**
 * TimelineScrubber Component
 *
 * A drag-to-scrub timeline bar for rewinding simulations.
 * Click and drag left to rewind into history. Release to resume
 * from that point — demonstrating that the future is fully
 * determined by any moment in time (Laplace's Demon).
 *
 * Usage:
 *   <TimelineScrubber
 *     historyLength={history.length}
 *     maxHistory={300}
 *     currentIndex={historyIndex}
 *     onScrubStart={() => setScrubbing(true)}
 *     onScrub={(index) => setScrubFrame(index)}
 *     onScrubEnd={() => setScrubbing(false)}
 *   />
 */

import { type Component } from 'solid-js';
import './TimelineScrubber.css';

export interface TimelineScrubberProps {
  /** Number of frames currently in the history buffer */
  historyLength: number;
  /** Maximum frames the buffer can hold */
  maxHistory: number;
  /** The frame index currently being displayed */
  currentIndex: number;
  /** Called when the user starts dragging */
  onScrubStart: () => void;
  /** Called continuously while dragging with the target frame index */
  onScrub: (frameIndex: number) => void;
  /** Called when the user releases — simulation resumes from scrubbed frame */
  onScrubEnd: () => void;
}

export const TimelineScrubber: Component<TimelineScrubberProps> = (props) => {
  let barRef: HTMLDivElement | undefined;
  let isDragging = false;

  // ========================================================================
  // Mouse position → frame index
  // ========================================================================

  const frameFromMouseX = (clientX: number): number => {
    if (!barRef) return props.historyLength - 1;
    const rect = barRef.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return Math.round(ratio * (props.historyLength - 1));
  };

  // ========================================================================
  // Event handlers
  // ========================================================================

  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    isDragging = true;
    props.onScrubStart();
    props.onScrub(frameFromMouseX(e.clientX));

    // Attach move/up to window so drag works even outside the bar
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    props.onScrub(frameFromMouseX(e.clientX));
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (!isDragging) return;
    isDragging = false;
    props.onScrub(frameFromMouseX(e.clientX));
    props.onScrubEnd();

    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  // Touch support
  const handleTouchStart = (e: TouchEvent) => {
    e.preventDefault();
    isDragging = true;
    props.onScrubStart();
    props.onScrub(frameFromMouseX(e.touches[0].clientX));
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    props.onScrub(frameFromMouseX(e.touches[0].clientX));
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    isDragging = false;
    props.onScrubEnd();
  };

  // ========================================================================
  // Derived positions (0–100%)
  // ========================================================================

  const filledPercent = () =>
    props.historyLength > 0 ? (props.historyLength / props.maxHistory) * 100 : 0;

  const playheadPercent = () =>
    props.historyLength > 1
      ? (props.currentIndex / (props.historyLength - 1)) * 100
      : 0;

  // Time labels
  const currentTime = () => (props.currentIndex / 60).toFixed(2); // assuming 60fps
  const totalTime = () => ((props.historyLength - 1) / 60).toFixed(2);

  return (
    <div class="timeline-scrubber">
      <div class="timeline-labels">
        <span class="timeline-label">
          ⟲ Drag to rewind
        </span>
        <span class="timeline-time">
          {currentTime()}s / {totalTime()}s
        </span>
      </div>

      <div
        class="timeline-bar"
        ref={barRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Background track */}
        <div class="timeline-track" />

        {/* Filled portion showing buffered history */}
        <div
          class="timeline-filled"
          style={{ width: `${filledPercent()}%` }}
        />

        {/* Playhead */}
        <div
          class="timeline-playhead"
          style={{ left: `${playheadPercent()}%` }}
        >
          <div class="timeline-playhead-line" />
          <div class="timeline-playhead-dot" />
        </div>
      </div>
    </div>
  );
};

export default TimelineScrubber;
