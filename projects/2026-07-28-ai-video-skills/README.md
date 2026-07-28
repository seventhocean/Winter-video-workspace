# 四个视频 Skill 讲解动画

本工程制作抖音视频真人开场之后的四段无声讲解动画。

## 合成

| Composition ID | 内容 | 时长 |
|---|---|---|
| `Skill01HyperFrames` | HyperFrames | 17 秒 |
| `Skill02Remotion` | Remotion | 16 秒 |
| `Skill03VideoUse` | video-use | 17 秒 |
| `Skill04Seedance` | Seedance | 16 秒 |
| `FourSkillsCombined` | 四段连续版 | 66 秒 |

统一规格：1920×1080、30fps、无音轨。

## 输出

成片位于 `output/`：

- `01-HyperFrames-无声讲解.mp4`
- `02-Remotion-无声讲解.mp4`
- `03-video-use-无声讲解.mp4`
- `04-Seedance-无声讲解.mp4`
- `四个Skill讲解-无声合并版.mp4`

## 素材

- `public/video-use.mp4`：Winter 真人口播的 6 秒无声展示片段。
- `public/seedance-storyboard.png`：使用 ImageGen 生成的三镜头静态分镜。

## 后续加入旁白

收到最终旁白后：

1. 根据四段实际语速修改 `src/Composition.tsx` 中的帧数。
2. 将旁白放入 `public/`，再在合并版中加入音频。
3. 重新渲染并检查段落切点。

## 本地验证

```bash
npm run lint
```

预览：

```bash
npm run dev
```

渲染合并版：

```bash
./node_modules/.bin/remotion render FourSkillsCombined output/四个Skill讲解-无声合并版.mp4 --codec=h264 --crf=18 --muted
```
