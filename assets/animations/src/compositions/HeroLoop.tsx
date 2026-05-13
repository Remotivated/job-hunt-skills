// assets/animations/src/compositions/HeroLoop.tsx
import { Series, AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { Opener } from '../beats/Opener';
import { WorkflowChips } from '../beats/WorkflowChips';
import { Flywheel } from '../beats/Flywheel';
import { RealFiles } from '../beats/RealFiles';
import { colors, timing } from '../primitives/tokens';

type Props = {
  aspectRatio: '16x9' | '1x1' | '9x16';
};

// Each beat is 105 frames at 30fps = 3.5s. 4 beats = 420 frames. Plus 30 frames of loop-prep crossfade = 450.
export const HeroLoop: React.FC<Props> = ({ aspectRatio }) => {
  const frame = useCurrentFrame();
  // Soft navy flash on the last 12 frames to make the loop seam invisible
  const loopFade = interpolate(frame, [438, 450], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <>
      <Series>
        <Series.Sequence durationInFrames={timing.beatDuration}>
          <Opener aspectRatio={aspectRatio} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={timing.beatDuration}>
          <WorkflowChips aspectRatio={aspectRatio} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={timing.beatDuration}>
          <Flywheel aspectRatio={aspectRatio} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={timing.beatDuration + 30}>
          <RealFiles aspectRatio={aspectRatio} />
        </Series.Sequence>
      </Series>
      <AbsoluteFill style={{ background: colors.navy, opacity: loopFade, pointerEvents: 'none' }} />
    </>
  );
};
