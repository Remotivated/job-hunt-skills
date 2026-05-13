// assets/animations/src/Root.tsx
import { Composition } from 'remotion';
import { Placeholder } from './compositions/Placeholder';
import { HeroLoop } from './compositions/HeroLoop';
import { CoworkSetup } from './compositions/CoworkSetup';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="HeroLoop-16x9"
      component={HeroLoop}
      durationInFrames={450}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{ aspectRatio: '16x9' as const }}
    />
    <Composition
      id="HeroLoop-1x1"
      component={HeroLoop}
      durationInFrames={450}
      fps={30}
      width={1080}
      height={1080}
      defaultProps={{ aspectRatio: '1x1' as const }}
    />
    <Composition
      id="HeroLoop-9x16"
      component={HeroLoop}
      durationInFrames={450}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{ aspectRatio: '9x16' as const }}
    />
    <Composition
      id="CoworkSetup"
      component={CoworkSetup}
      durationInFrames={900}
      fps={30}
      width={1920}
      height={1080}
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
