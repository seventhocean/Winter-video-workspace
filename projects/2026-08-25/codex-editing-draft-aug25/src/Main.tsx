import {AbsoluteFill, useVideoConfig} from "remotion";
import {Video} from "@remotion/media";
import {staticFile} from "remotion";
import {DraftOverlay} from "./DraftOverlay";

export const Main = ({
  sourceFile,
}: {
  sourceFile: string;
}) => {
  const {width} = useVideoConfig();
  const scale = width / 1080;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1080,
          height: 2339,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <Video
          src={staticFile(sourceFile)}
          objectFit="contain"
          style={{position: "absolute", inset: 0, width: "100%", height: "100%"}}
        />
        <DraftOverlay />
      </div>
    </AbsoluteFill>
  );
};
