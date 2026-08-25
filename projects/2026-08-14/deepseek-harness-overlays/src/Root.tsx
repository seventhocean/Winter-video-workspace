import {Composition} from "remotion";
import {ClosingComposition, OpeningComposition} from "./DeepSeekHarness";

export const Root = () => (
  <>
    <Composition
      id="DeepSeekOpening"
      component={OpeningComposition}
      durationInFrames={312}
      fps={30}
      width={2880}
      height={2160}
    />
    <Composition
      id="DeepSeekClosing"
      component={ClosingComposition}
      durationInFrames={682}
      fps={30}
      width={2880}
      height={2160}
    />
  </>
);
