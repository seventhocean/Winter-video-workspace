import fs from "node:fs";
import path from "node:path";

const editDir = "/Users/winter/Movies/Videos/7月30日/edit";
const edl = JSON.parse(fs.readFileSync(path.join(editDir, "edl.json"), "utf8"));
const transcriptDir = path.join(editDir, "transcripts");
const outputFile = new URL("../public/captions.json", import.meta.url);
const transcriptCache = new Map();
const punctuation = /[，。！？；：、]/;

const loadWords = (source) => {
  if (!transcriptCache.has(source)) {
    const json = JSON.parse(
      fs.readFileSync(path.join(transcriptDir, `${source}.json`), "utf8"),
    );
    transcriptCache.set(
      source,
      json.words.filter((word) => word.type === "word"),
    );
  }
  return transcriptCache.get(source);
};

const captions = [];
let outputOffset = 0;

for (const range of edl.ranges) {
  const words = loadWords(range.source)
    .filter((word) => word.end >= range.start && word.start <= range.end)
    .map((word) => ({
      ...word,
      start: Math.max(0, outputOffset + word.start - range.start),
      end: Math.min(
        outputOffset + range.end - range.start,
        outputOffset + word.end - range.start,
      ),
    }))
    .filter((word) => !/^\[.*\]$/.test(word.text));

  let group = [];
  const flush = () => {
    if (group.length === 0) return;
    let text = "";
    for (const word of group) {
      const needsSpace =
        text.length > 0 &&
        /[A-Za-z0-9]$/.test(text) &&
        /^[A-Za-z0-9]/.test(word.text);
      text += `${needsSpace ? " " : ""}${word.text}`;
    }
    captions.push({
      text: text.replace(/[，。；、]$/, ""),
      start: Math.max(outputOffset, group[0].start - 0.04),
      end: Math.min(
        outputOffset + range.end - range.start,
        group.at(-1).end + 0.12,
      ),
    });
    group = [];
  };

  for (const word of words) {
    const previous = group.at(-1);
    const currentText = group.map((item) => item.text).join("");
    if (
      previous &&
      (word.start - previous.end > 0.58 ||
        word.end - group[0].start > 3.35 ||
        currentText.length >= 22)
    ) {
      flush();
    }
    group.push(word);
    if (punctuation.test(word.text) && group.length >= 5) flush();
  }
  flush();
  outputOffset += range.end - range.start;
}

for (let index = 0; index < captions.length - 1; index++) {
  captions[index].end = Math.min(
    captions[index].end,
    Math.max(captions[index].start + 0.18, captions[index + 1].start - 0.02),
  );
}

fs.writeFileSync(outputFile, `${JSON.stringify(captions, null, 2)}\n`);
console.log(`已生成 ${captions.length} 条字幕：${outputFile.pathname}`);
