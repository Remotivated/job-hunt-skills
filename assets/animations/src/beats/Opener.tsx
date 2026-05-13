// assets/animations/src/beats/Opener.tsx
import { AbsoluteFill } from 'remotion';
import { Headline } from '../primitives/Headline';
import { colors } from '../primitives/tokens';

type Props = {
  aspectRatio: '16x9' | '1x1' | '9x16';
};

export const Opener: React.FC<Props> = ({ aspectRatio }) => {
  const size = aspectRatio === '9x16' ? 'md' : 'lg';
  return (
    <AbsoluteFill style={{
      background: colors.navy,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 80,
    }}>
      <Headline size={size} enterAt={6}>
        Open-source AI for a smarter job hunt.
      </Headline>
    </AbsoluteFill>
  );
};
