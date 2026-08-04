#!/usr/bin/env node
import fs from "node:fs";

const sampleRate = 48000;
const duration = 3;
const frameCount = sampleRate * duration;
const left = new Float64Array(frameCount);
const right = new Float64Array(frameCount);
const output =
  "/Users/winter/Documents/Project/Winter-video-workspace/projects/2026-07-29-contact-wheel-stacked-source-audio-smoke/output/gear-crisp-ratchet-clean-v3.wav";

let state = 0x26a4d93b;
const random = () => {
  state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
  return (state / 0xffffffff) * 2 - 1;
};

const speedAt = (time) => {
  if (time < 0.28) {
    return 0.3 + (time / 0.28) * 0.7;
  }
  if (time < 2.28) {
    return 0.94 + Math.sin(time * 8.5) * 0.06;
  }
  if (time < 2.76) {
    return 0.98 * (1 - (time - 2.28) / 0.48) ** 1.35 + 0.04;
  }
  return 0;
};

const addCrispClick = (time, strength, pan = 0, bright = 1) => {
  const start = Math.round(time * sampleRate);
  const length = Math.round(0.052 * sampleRate);
  let previousNoise = 0;
  for (
    let index = 0;
    index < length && start + index < frameCount;
    index += 1
  ) {
    const seconds = index / sampleRate;
    const attack = Math.min(1, seconds / 0.00045);
    const decay = Math.exp(-seconds * 88);
    const rawNoise = random();
    const highNoise = rawNoise - previousNoise * 0.88;
    previousNoise = rawNoise;
    const ring =
      Math.sin(2 * Math.PI * 720 * seconds) * 0.28 +
      Math.sin(2 * Math.PI * 1680 * seconds + 0.4) * 0.3 +
      Math.sin(2 * Math.PI * 3180 * seconds + 1.2) * 0.14 * bright;
    const sample =
      strength *
      attack *
      decay *
      (ring + highNoise * Math.exp(-seconds * 145) * 0.5);
    const leftGain = Math.sqrt((1 - pan) * 0.5);
    const rightGain = Math.sqrt((1 + pan) * 0.5);
    left[start + index] += sample * leftGain;
    right[start + index] += sample * rightGain;
  }
};

let clickTime = 0.045;
let clickIndex = 0;
while (clickTime < 2.74) {
  const speed = Math.max(0.04, speedAt(clickTime));
  const interval = 0.044 + (1 - speed) * 0.115;
  const strength = 0.42 + speed * 0.23 + (clickIndex % 3) * 0.025;
  const pan = ((clickIndex % 5) - 2) * 0.07;
  addCrispClick(clickTime, strength, pan, 0.86 + (clickIndex % 4) * 0.05);
  clickTime += interval;
  clickIndex += 1;
}

addCrispClick(2.76, 0.92, -0.06, 1.05);
addCrispClick(2.875, 0.7, 0.08, 0.96);
addCrispClick(2.94, 0.25, 0, 0.82);

let peak = 0;
for (let index = 0; index < frameCount; index += 1) {
  peak = Math.max(peak, Math.abs(left[index]), Math.abs(right[index]));
}
const gain = 10 ** (-4 / 20) / peak;
const fadeFrames = Math.round(0.03 * sampleRate);
const buffer = Buffer.alloc(44 + frameCount * 4);

buffer.write("RIFF", 0);
buffer.writeUInt32LE(36 + frameCount * 4, 4);
buffer.write("WAVE", 8);
buffer.write("fmt ", 12);
buffer.writeUInt32LE(16, 16);
buffer.writeUInt16LE(1, 20);
buffer.writeUInt16LE(2, 22);
buffer.writeUInt32LE(sampleRate, 24);
buffer.writeUInt32LE(sampleRate * 4, 28);
buffer.writeUInt16LE(4, 32);
buffer.writeUInt16LE(16, 34);
buffer.write("data", 36);
buffer.writeUInt32LE(frameCount * 4, 40);

for (let index = 0; index < frameCount; index += 1) {
  const fade = Math.min(
    1,
    index / fadeFrames,
    (frameCount - 1 - index) / fadeFrames,
  );
  const encode = (sample) =>
    Math.round(
      Math.max(-1, Math.min(1, Math.tanh(sample * gain * fade * 1.08))) *
        32767,
    );
  buffer.writeInt16LE(encode(left[index]), 44 + index * 4);
  buffer.writeInt16LE(encode(right[index]), 46 + index * 4);
}

fs.writeFileSync(output, buffer);
console.log(
  JSON.stringify(
    {
      ok: true,
      output,
      duration,
      sampleRate,
      channels: 2,
      clickCount: clickIndex + 3,
    },
    null,
    2,
  ),
);
