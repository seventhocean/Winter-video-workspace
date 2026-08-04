import {Composition} from "remotion";
import rawContent from "../work/content.json";
import {ContentWheel} from "./ContentWheel";

const content = rawContent as {fps: number; duration: number};

export const Root = () => (
  <Composition
    id="ContentWheel"
    component={ContentWheel}
    durationInFrames={Math.round(content.duration * content.fps)}
    fps={content.fps}
    width={1080}
    height={1920}
  />
);
