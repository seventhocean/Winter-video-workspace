import {Composition} from "remotion";
import {DeepSeekPriceProgressive} from "./DeepSeekPriceProgressive";

export const Root = () => (
  <>
    <Composition
      id="DeepSeekPriceEffects"
        component={DeepSeekPriceProgressive}
      durationInFrames={2437}
      fps={30}
      width={2160}
      height={4678}
    />
  </>
);
