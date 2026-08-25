import {Composition} from "remotion";
import {ClosingPluginOverlay, OpeningPluginOverlay} from "./DeepSeekPluginOverlay";

export const Root = () => (
  <>
    <Composition
      id="DeepSeekPluginOpening"
      component={OpeningPluginOverlay}
      durationInFrames={295}
      fps={30}
      width={2160}
      height={3840}
    />
    <Composition
      id="DeepSeekPluginClosing"
      component={ClosingPluginOverlay}
      durationInFrames={210}
      fps={30}
      width={2160}
      height={3840}
    />
  </>
);
