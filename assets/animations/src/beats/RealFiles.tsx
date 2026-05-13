// assets/animations/src/beats/RealFiles.tsx
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { Headline } from '../primitives/Headline';
import { colors, fonts } from '../primitives/tokens';

type Props = {
  aspectRatio: '16x9' | '1x1' | '9x16';
};

const FilePreview: React.FC<{
  label: string;
  ext: 'md' | 'docx' | 'pdf';
  enterAt: number;
  exitAt: number;
}> = ({ label, ext, enterAt, exitAt }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [enterAt - 6, enterAt, exitAt, exitAt + 6], [0, 1, 1, 0]);
  const ty = interpolate(frame, [enterAt - 6, enterAt], [16, 0]);
  const extColor = { md: colors.lavender, docx: '#2b579a', pdf: colors.red }[ext];

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity,
      transform: `translateY(${ty}px)`,
    }}>
      <div style={{
        background: colors.white,
        borderRadius: 14,
        padding: 36,
        width: 360,
        height: 460,
        position: 'relative',
        boxShadow: '0 12px 32px rgba(10,15,30,0.35)',
        fontFamily: fonts.mono,
        color: colors.navy,
      }}>
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>{label}.{ext}</div>
        <div style={{ height: 12, background: colors.lavender, borderRadius: 6, marginBottom: 12, width: '90%' }} />
        <div style={{ height: 8, background: '#e5e8f0', borderRadius: 4, marginBottom: 8, width: '70%' }} />
        <div style={{ height: 8, background: '#e5e8f0', borderRadius: 4, marginBottom: 8, width: '85%' }} />
        <div style={{ height: 8, background: '#e5e8f0', borderRadius: 4, marginBottom: 18, width: '60%' }} />
        <div style={{ height: 8, background: '#e5e8f0', borderRadius: 4, marginBottom: 8, width: '75%' }} />
        <div style={{ height: 8, background: '#e5e8f0', borderRadius: 4, marginBottom: 8, width: '90%' }} />
        <div style={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          background: extColor,
          color: colors.white,
          padding: '4px 10px',
          borderRadius: 6,
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>
          .{ext}
        </div>
      </div>
    </div>
  );
};

export const RealFiles: React.FC<Props> = ({ aspectRatio }) => {
  return (
    <AbsoluteFill style={{
      background: colors.navy,
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: 80,
      gap: 48,
    }}>
      <Headline size={aspectRatio === '9x16' ? 'sm' : 'md'} enterAt={6}>
        Real DOCX and PDF — not copy-paste.
      </Headline>
      <div style={{ position: 'relative', flex: 1, width: '100%' }}>
        <FilePreview label="resume" ext="md"   enterAt={12} exitAt={36} />
        <FilePreview label="resume" ext="docx" enterAt={42} exitAt={66} />
        <FilePreview label="resume" ext="pdf"  enterAt={72} exitAt={104} />
      </div>
    </AbsoluteFill>
  );
};
