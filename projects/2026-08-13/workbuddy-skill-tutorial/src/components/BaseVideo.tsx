import {Video} from "@remotion/media";
import {AbsoluteFill, staticFile} from "remotion";

export const BaseVideo = ({sourceFile}: {sourceFile: string}) => (
  <AbsoluteFill
    style={{
      background:
        sourceFile
          ? "radial-gradient(circle at 68% 24%, #183b58 0%, #07121d 48%, #03080d 100%)"
          : "radial-gradient(circle at 84% 13%, rgba(108,92,231,.16), transparent 31%), #f4f0e8",
    }}
  >
    {sourceFile ? (
      <>
        <Video
          src={staticFile(sourceFile)}
          objectFit="cover"
          style={{width: "100%", height: "100%"}}
        />
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(90deg, rgba(3,8,13,.42), transparent 48%, rgba(3,8,13,.16))",
          }}
        />
      </>
    ) : null}
  </AbsoluteFill>
);
