// assets/animations/src/compositions/CoworkSetup.tsx
import { Series } from 'remotion';
import { SetupStep } from '../beats/SetupStep';

const STEP_FRAMES = 150; // 5s per step

export const CoworkSetup: React.FC = () => (
  <Series>
    <Series.Sequence durationInFrames={STEP_FRAMES}>
      <SetupStep
        stepNumber={1}
        totalSteps={6}
        screenshotPath="screenshots/01-github-releases.png"
        caption="Download job-hunt-skills.zip"
        callouts={[
          { xPct: 50, yPct: 60, shape: 'circle', radius: 90 },
        ]}
      />
    </Series.Sequence>
    <Series.Sequence durationInFrames={STEP_FRAMES}>
      <SetupStep
        stepNumber={2}
        totalSteps={6}
        screenshotPath="screenshots/02-cowork-main.png"
        caption="Open Customize"
        callouts={[
          { xPct: 80, yPct: 20, shape: 'circle', radius: 70 },
        ]}
      />
    </Series.Sequence>
    <Series.Sequence durationInFrames={STEP_FRAMES}>
      <SetupStep
        stepNumber={3}
        totalSteps={6}
        screenshotPath="screenshots/03-customize-panel.png"
        caption="Browse plugins → Custom upload"
        callouts={[
          { xPct: 50, yPct: 45, shape: 'circle', radius: 100 },
        ]}
      />
    </Series.Sequence>
    <Series.Sequence durationInFrames={STEP_FRAMES}>
      <SetupStep
        stepNumber={4}
        totalSteps={6}
        screenshotPath="screenshots/04-file-picker.png"
        caption="Select the ZIP you just downloaded"
      />
    </Series.Sequence>
    <Series.Sequence durationInFrames={STEP_FRAMES}>
      <SetupStep
        stepNumber={5}
        totalSteps={6}
        screenshotPath="screenshots/05-folder-prompt.png"
        caption="Pick or create a local folder for your job-search files"
      />
    </Series.Sequence>
    <Series.Sequence durationInFrames={STEP_FRAMES}>
      <SetupStep
        stepNumber={6}
        totalSteps={6}
        screenshotPath="screenshots/06-chat-input.png"
        caption="Ask: 'Help me get started.'"
      />
    </Series.Sequence>
  </Series>
);
