// assets/animations/src/Root.tsx
import { Composition } from 'remotion';
import { Placeholder } from './compositions/Placeholder';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="HeroLoop-16x9"
      component={Placeholder}
      durationInFrames={450}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{ label: 'HeroLoop-16x9' }}
    />
    <Composition
      id="HeroLoop-1x1"
      component={Placeholder}
      durationInFrames={450}
      fps={30}
      width={1080}
      height={1080}
      defaultProps={{ label: 'HeroLoop-1x1' }}
    />
    <Composition
      id="HeroLoop-9x16"
      component={Placeholder}
      durationInFrames={450}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{ label: 'HeroLoop-9x16' }}
    />
    <Composition
      id="CoworkSetup"
      component={Placeholder}
      durationInFrames={900}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{ label: 'CoworkSetup' }}
    />
    <Composition
      id="HookInserts"
      component={Placeholder}
      durationInFrames={600}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{ label: 'HookInserts' }}
    />
  </>
);
