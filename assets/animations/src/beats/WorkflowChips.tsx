// assets/animations/src/beats/WorkflowChips.tsx
import { AbsoluteFill } from 'remotion';
import { Headline } from '../primitives/Headline';
import { Chip } from '../primitives/Chip';
import { colors } from '../primitives/tokens';

type Props = {
  aspectRatio: '16x9' | '1x1' | '9x16';
};

const skills = ['research', 'tailor', 'claim-check', 'cover letter', 'interview prep'];

export const WorkflowChips: React.FC<Props> = ({ aspectRatio }) => {
  // Vertical stacking on 9:16, horizontal wrap on 16:9 and 1:1
  const flexDirection = aspectRatio === '9x16' ? 'column' : 'row';
  return (
    <AbsoluteFill style={{
      background: colors.navy,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 80,
      gap: 48,
    }}>
      <Headline size={aspectRatio === '9x16' ? 'sm' : 'md'} enterAt={6}>
        One workflow, resume to offer.
      </Headline>
      <div style={{
        display: 'flex',
        flexDirection,
        flexWrap: 'wrap',
        gap: 18,
        justifyContent: 'center',
        maxWidth: '90%',
      }}>
        {skills.map((s, i) => (
          <Chip key={s} label={s} enterAt={18 + i * 4} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
