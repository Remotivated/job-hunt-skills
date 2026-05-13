// assets/animations/src/beats/SetupStep.tsx
import { AbsoluteFill, Img, staticFile, interpolate, useCurrentFrame } from 'remotion';
import { Callout } from '../primitives/Callout';
import { colors, fonts } from '../primitives/tokens';

type CalloutSpec = {
  xPct: number;
  yPct: number;
  shape: 'circle' | 'arrow';
  radius?: number;
  angle?: number;
  length?: number;
};

type Props = {
  stepNumber: number;
  totalSteps: number;
  screenshotPath: string; // relative to public/ or src/assets
  caption: string;
  callouts?: CalloutSpec[];
};

export const SetupStep: React.FC<Props> = ({
  stepNumber, totalSteps, screenshotPath, caption, callouts = [],
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 8, 142, 150], [0, 1, 1, 0]);

  return (
    <AbsoluteFill style={{ background: colors.navy, opacity }}>
      <div style={{
        position: 'absolute',
        top: 32,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontFamily: fonts.body,
        color: colors.white,
        fontSize: 22,
        fontWeight: 600,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        opacity: 0.85,
      }}>
        Step {stepNumber} / {totalSteps}
      </div>

      <div style={{
        position: 'absolute',
        top: 100,
        left: 80,
        right: 80,
        bottom: 200,
        borderRadius: 14,
        overflow: 'hidden',
        boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
        background: colors.white,
      }}>
        <Img
          src={staticFile(screenshotPath)}
          style={{ width: '100%', height: '100%', objectFit: 'contain', background: colors.white }}
        />
        {callouts.map((c, i) => (
          <Callout key={i} {...c} enterAt={20 + i * 6} />
        ))}
      </div>

      <div style={{
        position: 'absolute',
        bottom: 60,
        left: 80,
        right: 80,
        fontFamily: fonts.body,
        color: colors.white,
        fontSize: 32,
        fontWeight: 600,
        textAlign: 'center',
        lineHeight: 1.3,
      }}>
        {caption}
      </div>
    </AbsoluteFill>
  );
};
