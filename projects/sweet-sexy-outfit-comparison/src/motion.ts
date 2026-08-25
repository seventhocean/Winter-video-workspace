import {Easing, interpolate} from "remotion";

export const progress = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, Math.max(from + 1, to)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

export const lifecycle = (
  frame: number,
  durationInFrames: number,
  enterFrames = 12,
  exitFrames = 10,
) => {
  const safeDuration = Math.max(2, durationInFrames);
  const enterEnd = Math.min(enterFrames, Math.floor(safeDuration / 2));
  const exitStart = Math.max(enterEnd, safeDuration - exitFrames);

  return interpolate(
    frame,
    [0, enterEnd, exitStart, safeDuration],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    },
  );
};
