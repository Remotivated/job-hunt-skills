// assets/animations/src/primitives/Headline.tsx
import { interpolate, useCurrentFrame, spring, useVideoConfig } from 'remotion';
import { colors, fonts } from './tokens';

type Props = {
  children: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  align?: 'left' | 'center';
  enterAt?: number; // frames offset
};

const sizeMap = { sm: 56, md: 88, lg: 120 };

export const Headline: React.FC<Props> = ({
  children,
  color = colors.white,
  size = 'lg',
  align = 'center',
  enterAt = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - enterAt,
    fps,
    config: { damping: 14, stiffness: 80 },
  });
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateY = interpolate(progress, [0, 1], [16, 0]);

  return (
    <div
      style={{
        fontFamily: fonts.headline,
        fontSize: sizeMap[size],
        fontWeight: 800,
        lineHeight: 1.05,
        letterSpacing: '-0.02em',
        color,
        textAlign: align,
        opacity,
        transform: `translateY(${translateY}px)`,
        maxWidth: '85%',
        margin: align === 'center' ? '0 auto' : 0,
      }}
    >
      {children}
    </div>
  );
};
