import {Video} from "@remotion/media";
import {AbsoluteFill, staticFile} from "remotion";
import {theme} from "../theme";

export const BaseVideo = ({sourceFile}: {sourceFile: string}) => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(circle at 68% 24%, #183b58 0%, #07121d 48%, #03080d 100%)",
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
    ) : (
      <>
        <div
          style={{
            position: "absolute",
            left: "39%",
            top: "18%",
            width: "22%",
            height: "58%",
            borderRadius: "48% 48% 22% 22%",
            background:
              "linear-gradient(180deg, rgba(175,192,210,.25), rgba(50,174,255,.08))",
            border: `1px solid ${theme.border}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 28,
            textAlign: "center",
            color: theme.mutedText,
            fontFamily: theme.monoFont,
            fontSize: 18,
            letterSpacing: 4,
            opacity: 0.46,
          }}
        >
          LINK SOURCE VIDEO TO public/source.mov
        </div>
      </>
    )}
  </AbsoluteFill>
);
