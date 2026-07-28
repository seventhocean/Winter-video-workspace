import {Video} from "@remotion/media";
import {staticFile} from "remotion";

export const HyperFramesOverlay = ({assetId}: {assetId?: string}) => {
  if (!assetId) return null;

  return (
    <Video
      src={staticFile(assetId)}
      muted
      objectFit="contain"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
      }}
    />
  );
};
