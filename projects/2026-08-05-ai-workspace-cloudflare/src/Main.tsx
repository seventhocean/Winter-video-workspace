import {AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig} from "remotion";
import type {StageKitProps} from "./schema";
import {BaseVideo} from "./components/BaseVideo";
import {styleVariables, theme} from "./theme";
import {NarrativeScene} from "./components/NarrativeScene";

const localAsset = (filename: string) => `http://127.0.0.1:8765/${encodeURIComponent(filename)}`;

const subtitleCues = [
  [0.20, 5.90, "你做的 AI 工作台，是不是自己电脑上能打开，但是过一段时间链接就失效了？"],
  [6.00, 12.10, "之前那个方法我测试了一下，发现它其实只能生成一个临时链接，12 个小时之后就打不开了。"],
  [12.15, 16.35, "这个视频我们直接给它做成长期的，以后就不用再受 12 个小时的限制了。"],
  [16.40, 24.05, "先给大家看一下效果，现在这个工作台电脑上可以打开，手机上也可以打开，还可以保存到手机桌面，像 APP 一样使用。"],
  [24.10, 31.15, "第一步，我们来到 WorkBuddy，新建一个工作目录，然后点击个人工作台，再点击开始，创建一个属于自己的工作台。"],
  [31.20, 35.45, "第二步，告诉 WorkBuddy：帮我用 Cloudflare 部署这个工作台。"],
  [35.50, 44.15, "如果没有安装过，WorkBuddy 会自动下载部署工具 wrangler，然后弹出一个浏览器窗口让你登录 Cloudflare 账号。"],
  [44.15, 49.85, "Cloudflare 是什么？你可以把它理解成一个免费的云端服务器，它会给你的工作台配置一个固定的访问链接。"],
  [49.90, 53.30, "授权一次之后，以后每次部署都不需要再登录了。"],
  [53.35, 64.00, "授权成功后，回到 WorkBuddy，只需要等待大概二三十秒，它就会自动把工作台上传到云端服务器，部署完成后给你一个链接。"],
  [64.05, 67.75, "这个链接是永久的，不会像之前那样 12 小时就失效。"],
  [67.80, 82.65, "如果你已经有了工作台，操作更简单。把工作台文件放在一个文件夹里，然后告诉 WorkBuddy：帮我把这个文件夹部署到 Cloudflare。AI 会自动帮你完成所有步骤，你只需要在弹出的网页里点一次授权。"],
  [82.70, 92.50, "部署成功后，把链接发到手机上打开，然后点击浏览器底部的分享按钮，选择添加到主屏幕。这样你的工作台就像 APP 一样，随时点开就能用。"],
  [92.55, 98.18, "另外，你也可以把这个链接分享给其他人，他们打开就能用你的工作台。"],
  [98.20, 105.15, "到这里，你的工作台就不只是自己电脑里的一个文件了，而是一个可以长期打开、也可以分享给别人用的在线工具。"],
  [105.20, 109.70, "工作台做出来只是第一步，能长期打开、拿来使用，才算真的做好了。"],
  [109.75, 112.63, "评论区让我看看你的专属工作台什么样子。"],
] as const;

const SubtitleTrack = ({portrait}: {portrait: boolean}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const time = frame / fps;
  const cue = subtitleCues.find(([start, end]) => time >= start && time < end);
  if (!cue) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: portrait ? "7%" : "12%",
        right: portrait ? "7%" : "12%",
        bottom: portrait ? 94 : 34,
        zIndex: 100,
        padding: portrait ? "16px 20px" : "10px 18px",
        color: "white",
        fontFamily: theme.bodyFont,
        fontSize: portrait ? 36 : 28,
        fontWeight: 700,
        lineHeight: 1.35,
        textAlign: "center",
        textShadow: "0 2px 10px rgba(0,0,0,.9)",
        background: "rgba(0,0,0,.28)",
        borderRadius: 14,
      }}
    >
      {cue[2]}
    </div>
  );
};

export const Main = ({
  sourceFile,
  timeline,
}: StageKitProps) => {
  const {fps, width, height} = useVideoConfig();
  const portrait = height > width;
  const designWidth = portrait ? 1080 : 1920;
  const designHeight = portrait ? 1920 : 1080;
  const scale = width / designWidth;
  const source = sourceFile?.startsWith("http://") || sourceFile?.startsWith("https://")
    ? sourceFile
    : sourceFile
      ? sourceFile
      : localAsset("8月4日.mov");

  return (
    <AbsoluteFill
      style={{
        ...styleVariables(timeline.scenes[0]?.styleProfile ?? "editorial-neutral"),
        backgroundColor: theme.background,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: designWidth,
          height: designHeight,
          scale,
          transformOrigin: "top left",
        }}
      >
        <BaseVideo sourceFile={source} />
        {timeline.scenes.map((scene) => (
          <Sequence
            key={scene.sceneId}
            from={Math.round(scene.start * fps)}
            durationInFrames={Math.round(scene.duration * fps)}
          >
            <NarrativeScene
              sceneId={scene.sceneId}
              sourceFile={source}
              sourceStart={scene.start}
            />
          </Sequence>
        ))}
        <SubtitleTrack portrait={portrait} />
      </div>
    </AbsoluteFill>
  );
};
