#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const sampleRate = 48000;
const duration = 3;
const frameCount = Math.round(sampleRate * duration);
const left = new Float64Array(frameCount);
const right = new Float64Array(frameCount);
const outputPath = path.resolve(
  process.argv[2] ||
    "/Users/winter/Documents/Project/Winter-video-workspace/projects/2026-07-29-contact-wheel-stacked-source-audio-smoke/output/gear-mechanical-preview-v1.wav",
);

let randomState = 0x8f3c51a7;
const noise = () => {
  randomState =
    (Math.imul(randomState, 1664525) + 1013904223) >>> 0;
  return (randomState / 0xffffffff) * 2 - 1;
};

const speedAt = (time) => {
  if (time < 0.34) {
    const progress = time / 0.34;
    return 0.18 + progress * progress * 0.82;
  }
  if (time < 2.18) {
    return 0.94 + Math.sin(time * 7.2) * 0.06;
  }
  if (time < 2.76) {
    const progress = (time - 2.18) / 0.58;
    return 0.94 * (1 - progress) ** 1.65 + 0.08;
  }
  return 0;
};

const addTooth = (time, strength, pan, baseFrequency) => {
  const start = Math.round(time * sampleRate);
  const length = Math.round(0.115 * sampleRate);
  let filteredNoise = 0;
  for (
    let index = 0;
    index < length && start + index < frameCount;
    index += 1
  ) {
    const seconds = index / sampleRate;
    const attack = Math.min(1, seconds / 0.0012);
    const decay = Math.exp(-seconds * 41);
    filteredNoise = filteredNoise * 0.63 + noise() * 0.37;
    const metal =
      Math.sin(2 * Math.PI * baseFrequency * seconds) * 0.52 +
      Math.sin(2 * Math.PI * (baseFrequency * 2.74) * seconds + 0.7) *
        0.25 +
      Math.sin(2 * Math.PI * (baseFrequency * 5.1) * seconds + 1.4) *
        0.1;
    const sample =
      strength *
      attack *
      decay *
      (metal + filteredNoise * Math.exp(-seconds * 74) * 0.72);
    const leftGain = Math.sqrt((1 - pan) * 0.5);
    const rightGain = Math.sqrt((1 + pan) * 0.5);
    left[start + index] += sample * leftGain;
    right[start + index] += sample * rightGain;
  }
};

const addHeavyLock = (time, strength, pan = 0) => {
  const start = Math.round(time * sampleRate);
  const length = Math.round(0.48 * sampleRate);
  let bodyNoise = 0;
  for (
    let index = 0;
    index < length && start + index < frameCount;
    index += 1
  ) {
    const seconds = index / sampleRate;
    bodyNoise = bodyNoise * 0.9 + noise() * 0.1;
    const attack = Math.min(1, seconds / 0.0025);
    const decay = Math.exp(-seconds * 11.5);
    const body =
      Math.sin(2 * Math.PI * 72 * seconds) * 0.63 +
      Math.sin(2 * Math.PI * 143 * seconds + 0.45) * 0.33 +
      Math.sin(2 * Math.PI * 422 * seconds + 1.1) * 0.17 +
      bodyNoise * 0.3;
    const sample = strength * attack * decay * body;
    const leftGain = Math.sqrt((1 - pan) * 0.5);
    const rightGain = Math.sqrt((1 + pan) * 0.5);
    left[start + index] += sample * leftGain;
    right[start + index] += sample * rightGain;
  }
};

let bearingNoise = 0;
for (let index = 0; index < frameCount; index += 1) {
  const time = index / sampleRate;
  const speed = speedAt(time);
  bearingNoise = bearingNoise * 0.996 + noise() * 0.004;
  const wobble = 1 + Math.sin(2 * Math.PI * 5.4 * time) * 0.12;
  const rumble =
    Math.sin(2 * Math.PI * 43 * time) * 0.075 +
    Math.sin(2 * Math.PI * 67 * time + 0.8) * 0.045 +
    bearingNoise * 0.42;
  const sample = rumble * speed * wobble;
  left[index] += sample * 0.92;
  right[index] += sample;
}

let toothTime = 0.07;
let toothIndex = 0;
while (toothTime < 2.73) {
  const speed = Math.max(0.08, speedAt(toothTime));
  const interval = 0.052 + (1 - speed) * 0.145;
  const strength =
    0.28 + speed * 0.34 + ((toothIndex * 7) % 5) * 0.018;
  const pan = ((toothIndex % 4) - 1.5) * 0.12;
  const frequency = 118 + (toothIndex % 3) * 24;
  addTooth(toothTime, strength, pan, frequency);
  toothTime += interval;
  toothIndex += 1;
}

addHeavyLock(2.72, 1.05, -0.08);
addHeavyLock(2.805, 0.72, 0.08);
addTooth(2.91, 0.24, 0, 176);

let peak = 0;
for (let index = 0; index < frameCount; index += 1) {
  peak = Math.max(peak, Math.abs(left[index]), Math.abs(right[index]));
}
const targetPeak = 10 ** (-3 / 20);
const gain = peak > 0 ? targetPeak / peak : 1;
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
  const fadeIn = Math.min(1, index / fadeFrames);
  const fadeOut = Math.min(1, (frameCount - 1 - index) / fadeFrames);
  const fade = Math.max(0, Math.min(fadeIn, fadeOut));
  const softClip = (sample) => Math.tanh(sample * gain * fade * 1.12);
  buffer.writeInt16LE(
    Math.round(Math.max(-1, Math.min(1, softClip(left[index]))) * 32767),
    44 + index * 4,
  );
  buffer.writeInt16LE(
    Math.round(Math.max(-1, Math.min(1, softClip(right[index]))) * 32767),
    46 + index * 4,
  );
}

fs.mkdirSync(path.dirname(outputPath), {recursive: true});
fs.writeFileSync(outputPath, buffer);
console.log(
  JSON.stringify(
    {
      ok: true,
      output: outputPath,
      duration,
      sampleRate,
      channels: 2,
      toothCount: toothIndex,
    },
    null,
    2,
  ),
);
