// assets/animations/src/beats/Flywheel.tsx
import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from 'remotion';
import { Headline } from '../primitives/Headline';
import { colors, fonts } from '../primitives/tokens';

type Props = {
  aspectRatio: '16x9' | '1x1' | '9x16';
};

const FileCard: React.FC<{ label: string; sub: string; enterAt: number }> = ({ label, sub, enterAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - enterAt, fps, config: { damping: 14, stiffness: 90 } });
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const ty = interpolate(progress, [0, 1], [12, 0]);
  return (
    <div style={{
      background: colors.white,
      borderRadius: 14,
      padding: '24px 32px',
      minWidth: 280,
      textAlign: 'center',
      fontFamily: fonts.mono,
      color: colors.navy,
      opacity,
      transform: `translateY(${ty}px)`,
      boxShadow: '0 8px 24px rgba(10,15,30,0.25)',
    }}>
      <div style={{ fontSize: 28, fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: 18, opacity: 0.6, marginTop: 6 }}>{sub}</div>
    </div>
  );
};

export const Flywheel: React.FC<Props> = ({ aspectRatio }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Bullet travels along the arc from app → source on the return path
  const travelProgress = spring({
    frame: frame - 36,
    fps,
    config: { damping: 22, stiffness: 60 },
  });
  const bulletOpacity = interpolate(frame, [36, 48, 78, 90], [0, 1, 1, 0]);

  return (
    <AbsoluteFill style={{
      background: colors.navy,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 80,
      gap: 48,
    }}>
      <Headline size={aspectRatio === '9x16' ? 'sm' : 'md'} enterAt={6}>
        Every application makes the next easier.
      </Headline>

      <div style={{
        position: 'relative',
        display: 'flex',
        gap: 120,
        alignItems: 'center',
      }}>
        <FileCard label="resume.md" sub="source" enterAt={12} />
        {/* Curved arrow placeholder — for v1, use a simple horizontal arrow.
            Iterate visually in Remotion Studio. */}
        <svg width="180" height="80" style={{ overflow: 'visible' }}>
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 10 3, 0 6" fill={colors.red} />
            </marker>
          </defs>
          <path d="M 0 40 Q 90 -10, 180 40" stroke={colors.red} strokeWidth="3" fill="none" markerEnd="url(#arrowhead)" />
          <path d="M 180 50 Q 90 90, 0 50" stroke={colors.lavender} strokeWidth="3" fill="none" markerEnd="url(#arrowhead)" strokeDasharray="6 4" />
        </svg>
        <FileCard label="applications/" sub="polaris-data-senior-se" enterAt={18} />

        {/* Verified bullet flying along return arc */}
        <div style={{
          position: 'absolute',
          left: `${180 - travelProgress * 180}px`,
          top: `${80 + Math.sin(travelProgress * Math.PI) * 30}px`,
          opacity: bulletOpacity,
          background: colors.red,
          color: colors.white,
          padding: '6px 14px',
          borderRadius: 999,
          fontFamily: fonts.body,
          fontSize: 18,
          fontWeight: 600,
          whiteSpace: 'nowrap',
        }}>
          + verified bullet
        </div>
      </div>
    </AbsoluteFill>
  );
};
