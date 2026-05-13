// assets/animations/src/primitives/Callout.tsx
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors } from './tokens';

type Props = {
  // Position in % of stage (so it scales with aspect ratio)
  xPct: number;
  yPct: number;
  shape: 'circle' | 'arrow';
  // For circle: radius in px
  radius?: number;
  // For arrow: angle in degrees (0 = right, 90 = down)
  angle?: number;
  length?: number;
  enterAt: number;
};

export const Callout: React.FC<Props> = ({
  xPct, yPct, shape, radius = 80, angle = 0, length = 120, enterAt,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - enterAt,
    fps,
    config: { damping: 12, stiffness: 90 },
  });
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const scale = interpolate(progress, [0, 1], [0.7, 1]);

  if (shape === 'circle') {
    return (
      <div
        style={{
          position: 'absolute',
          left: `${xPct}%`,
          top: `${yPct}%`,
          width: radius * 2,
          height: radius * 2,
          transform: `translate(-50%, -50%) scale(${scale})`,
          borderRadius: '50%',
          border: `5px solid ${colors.red}`,
          opacity,
        }}
      />
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: `${xPct}%`,
        top: `${yPct}%`,
        width: length,
        height: 5,
        background: colors.red,
        transformOrigin: 'left center',
        transform: `translate(0, -50%) rotate(${angle}deg) scaleX(${scale})`,
        opacity,
      }}
    />
  );
};
