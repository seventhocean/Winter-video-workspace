import {Video} from "@remotion/media";
import {
  AbsoluteFill,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import rawCaptions from "../public/captions.json";
import {ReusableWorkflow} from "./slots/ReusableWorkflow";
import {SkillReveal} from "./slots/SkillReveal";
import {TechBasis} from "./slots/TechBasis";
import {TemplateReel} from "./slots/TemplateReel";
import {TemplateStacked} from "./slots/TemplateStacked";
import {TimeSaving} from "./slots/TimeSaving";
import {UseCases} from "./slots/UseCases";
import {WheelPrinciple} from "./slots/WheelPrinciple";

type Caption = {text: string; start: number; end: number};
const captions = rawCaptions as Caption[];

const CaptionLayer = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const time = frame / fps;
  const caption = [...captions]
    .reverse()
    .find((item: Caption) => time >= item.start && time <= item.end);

  if (!caption) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: 180,
        right: 180,
        bottom: 54,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          maxWidth: 1480,
          padding: "15px 30px 18px",
          borderRadius: 18,
          color: "#fff",
          background: "rgba(3,6,13,.78)",
          boxShadow: "0 12px 42px rgba(0,0,0,.38)",
          fontFamily: '"PingFang SC","Helvetica Neue",sans-serif',
          fontSize: 54,
          fontWeight: 700,
          lineHeight: 1.24,
          letterSpacing: 1,
          textAlign: "center",
          textShadow: "0 3px 10px rgba(0,0,0,.75)",
        }}
      >
        {caption.text}
      </div>
    </div>
  );
};

export const FullEdit = () => (
  <AbsoluteFill style={{backgroundColor: "#05070d"}}>
    <Video
      src={staticFile("rough-cut-v1.mp4")}
      objectFit="cover"
      style={{width: "100%", height: "100%"}}
    />

    <Sequence from={276} durationInFrames={142}>
      <TechBasis />
    </Sequence>
    <Sequence from={418} durationInFrames={256}>
      <WheelPrinciple />
    </Sequence>
    <Sequence from={674} durationInFrames={181}>
      <SkillReveal />
    </Sequence>
    <Sequence from={1177} durationInFrames={170}>
      <TemplateReel />
    </Sequence>
    <Sequence from={1347} durationInFrames={123}>
      <TemplateStacked />
    </Sequence>
    <Sequence from={1470} durationInFrames={127}>
      <UseCases />
    </Sequence>
    <Sequence from={1597} durationInFrames={295}>
      <ReusableWorkflow />
    </Sequence>
    <Sequence from={1892} durationInFrames={202}>
      <TimeSaving />
    </Sequence>

    <CaptionLayer />
  </AbsoluteFill>
);
