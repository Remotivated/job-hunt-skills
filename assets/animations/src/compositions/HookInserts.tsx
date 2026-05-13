// assets/animations/src/compositions/HookInserts.tsx
import { Series } from 'remotion';
import { WorkflowChips } from '../beats/WorkflowChips';
import { Flywheel } from '../beats/Flywheel';
import { RealFiles } from '../beats/RealFiles';

// Hook video uses these beats at slightly faster pacing:
// WorkflowChips:  5s (150 frames) — 0:15-0:20 in 45s hook
// Flywheel:       5s (150 frames) — 0:20-0:25
// RealFiles:     10s (300 frames) — 0:25-0:35

export const HookInserts: React.FC = () => (
  <Series>
    <Series.Sequence durationInFrames={150}>
      <WorkflowChips aspectRatio="16x9" />
    </Series.Sequence>
    <Series.Sequence durationInFrames={150}>
      <Flywheel aspectRatio="16x9" />
    </Series.Sequence>
    <Series.Sequence durationInFrames={300}>
      <RealFiles aspectRatio="16x9" />
    </Series.Sequence>
  </Series>
);
