#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";

const [asarPath, outputAsarPath] = process.argv.slice(2);

if (!asarPath || !outputAsarPath) {
  throw new Error("用法：node patch-recordly-hud.mjs <原始app.asar> <修复后app.asar>");
}

const source = fs.readFileSync(asarPath);
const headerJsonLength = source.readUInt32LE(12);
const oldDataStart = 16 + headerJsonLength;
const header = JSON.parse(source.toString("utf8", 16, oldDataStart));

const packedFiles = [];

function collectFiles(node, path) {
  if (!node.files) return;
  for (const [name, child] of Object.entries(node.files)) {
    const childPath = `${path}/${name}`;
    if (child.files) {
      collectFiles(child, childPath);
      continue;
    }
    if (child.offset === undefined || child.size === undefined) continue;
    const offset = Number(child.offset);
    const size = Number(child.size);
    packedFiles.push({
      path: childPath,
      node: child,
      data: Buffer.from(source.subarray(oldDataStart + offset, oldDataStart + offset + size)),
    });
  }
}

collectFiles(header, "");

function findFile(suffix) {
  const match = packedFiles.find((entry) => entry.path.endsWith(suffix));
  if (!match) throw new Error(`找不到 ASAR 文件：${suffix}`);
  return match;
}

function replaceOnce(text, before, after, label) {
  const count = text.split(before).length - 1;
  if (count !== 1) {
    throw new Error(`${label}：预期找到 1 处，实际找到 ${count} 处；停止修改以避免误 patch。`);
  }
  return text.replace(before, after);
}

const mainFile = findFile("/dist-electron/main.cjs");
let mainText = mainFile.data.toString("utf8");

mainText = replaceOnce(
  mainText,
  "return Og(e,zt()&&!Rt,t)",
  "return Og(e,zt(),t)",
  "HUD 录制窗口尺寸",
);
mainText = replaceOnce(
  mainText,
  'zt()&&(Rt?(ui=!1,r.setIgnoreMouseEvents(!1)):(ui=!0,r.setIgnoreMouseEvents(!0,{forward:!0})))',
  'zt()&&(ui=!0,r.setIgnoreMouseEvents(!0,{forward:!0}))',
  "HUD 初始鼠标穿透",
);
mainText = replaceOnce(
  mainText,
  "function _a(e){if(ui=Rt?!1:e,_n&&(clearTimeout(_n),_n=null),!ae||ae.isDestroyed())return;if(Rt){_i=!1,Go(),ae.setIgnoreMouseEvents(!1);return}const t=zt();if(!t){A_(t,Rt)&&W_(!e),ae.setIgnoreMouseEvents(!1);return}if(e){ae.setIgnoreMouseEvents(!0,{forward:!0});return}ae.setIgnoreMouseEvents(!1)}",
  "function _a(e){if(ui=e,_n&&(clearTimeout(_n),_n=null),!ae||ae.isDestroyed())return;const t=zt();if(Rt&&!t){ae.setIgnoreMouseEvents(!1);return}if(!t){A_(t,Rt)&&W_(!e),ae.setIgnoreMouseEvents(!1);return}if(e){ae.setIgnoreMouseEvents(!0,{forward:!0});return}ae.setIgnoreMouseEvents(!1)}",
  "HUD 鼠标穿透状态",
);
mainText = replaceOnce(
  mainText,
  "function G_(e){Rt=!!e,_i=!1,Go(),_a(!Rt)}",
  "function G_(e){Rt=!!e,_i=!1,Go(),_a(ui)}",
  "HUD 录制状态切换",
);
mainFile.data = Buffer.from(mainText, "utf8");

const rendererFile = findFile("/dist/assets/index-diQUNidV.js");
let rendererText = rendererFile.data.toString("utf8");
rendererText = replaceOnce(
  rendererText,
  'G.jsxs("div",{className:"flex flex-col items-center pointer-events-auto p-2",onMouseEnter:He,onMouseLeave:Me,children:[G.jsx("div",{ref:ue,style:{transform:`translate3d(${de.x}px, ${de.y}px, 0)`},children:',
  'G.jsxs("div",{className:"flex flex-col items-center p-2",children:[G.jsx("div",{ref:ue,className:"pointer-events-auto",onMouseEnter:He,onMouseLeave:Me,style:{transform:`translate3d(${de.x}px, ${de.y}px, 0)`},children:',
  "HUD 控制条交互区域",
);
rendererFile.data = Buffer.from(rendererText, "utf8");

const orderedFiles = [...packedFiles].sort((a, b) => Number(a.node.offset) - Number(b.node.offset));
const originalPackedEnd = orderedFiles.reduce(
  (end, entry) => Math.max(end, Number(entry.node.offset) + Number(entry.node.size)),
  0,
);
const trailingData = source.subarray(oldDataStart + originalPackedEnd);
let nextOffset = 0;
for (const entry of orderedFiles) {
  entry.node.offset = String(nextOffset);
  entry.node.size = entry.data.length;
  if (entry.node.integrity) {
    const blockSize = Number(entry.node.integrity.blockSize) || 4 * 1024 * 1024;
    const blocks = [];
    for (let start = 0; start < entry.data.length; start += blockSize) {
      blocks.push(crypto.createHash("sha256").update(entry.data.subarray(start, start + blockSize)).digest("hex"));
    }
    entry.node.integrity = {
      algorithm: "SHA256",
      hash: crypto.createHash("sha256").update(entry.data).digest("hex"),
      blockSize,
      blocks,
    };
  }
  nextOffset += entry.data.length;
}

const headerBuffer = Buffer.from(JSON.stringify(header), "utf8");
const prefix = Buffer.alloc(16);
prefix.writeUInt32LE(4, 0);
prefix.writeUInt32LE(headerBuffer.length + 11, 4);
prefix.writeUInt32LE(headerBuffer.length + 7, 8);
prefix.writeUInt32LE(headerBuffer.length, 12);

const output = Buffer.concat([prefix, headerBuffer, ...orderedFiles.map((entry) => entry.data), trailingData]);
fs.mkdirSync(outputAsarPath.replace(/\/[^/]+$/, ""), { recursive: true });
fs.writeFileSync(outputAsarPath, output);

process.stdout.write(JSON.stringify({
  outputAsarPath,
  bytes: output.length,
  sha256: crypto.createHash("sha256").update(output).digest("hex"),
  patched: [mainFile.path, rendererFile.path],
}));
