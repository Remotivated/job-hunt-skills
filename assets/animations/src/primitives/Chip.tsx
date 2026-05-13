// assets/animations/src/primitives/Chip.tsx
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors, fonts } from './tokens';

type Props = {
  label: string;
  enterAt: number;
  variant?: 'navy' | 'white' | 'red';
};

const variants = {
  navy:  { bg: colors.navy,  fg: colors.white,   border: 'transparent' },
  white: { bg: colors.white, fg: colors.navy,    border: colors.lavender },
  red:   { bg: colors.red,   fg: colors.white,   border: 'transparent' },
};

export const Chip: React.FC<Props> = ({ label, enterAt, variant = 'white' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const v = variants[variant];

  const progress = spring({
    frame: frame - enterAt,
    fps,
    config: { damping: 18, stiffness: 110 },
  });
  const scale = interpolate(progress, [0, 1], [0.85, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        display: 'inline-block',
        background: v.bg,
        color: v.fg,
        border: `2px solid ${v.border}`,
        padding: '14px 28px',
        borderRadius: 999,
        fontFamily: fonts.body,
        fontSize: 32,
        fontWeight: 600,
        opacity,
        transform: `scale(${scale})`,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </div>
  );
};
