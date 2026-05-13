// assets/animations/src/compositions/Placeholder.tsx
import { AbsoluteFill } from 'remotion';
import { colors, fonts } from '../primitives/tokens';

export const Placeholder: React.FC<{ label: string }> = ({ label }) => (
  <AbsoluteFill style={{
    background: colors.navy,
    color: colors.white,
    fontFamily: fonts.body,
    fontSize: 48,
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    {label} — placeholder
  </AbsoluteFill>
);
