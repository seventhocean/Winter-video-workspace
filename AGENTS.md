# AGENTS.md

这是 Winter 唯一的视频剪辑、动画制作与渲染工作区。

必须使用中文交流，项目文档也使用中文。

## 硬性规则

1. 所有新视频项目只创建在 `projects/`。
2. 所有项目共用根目录唯一的 `node_modules`；禁止在 `projects/`、Obsidian 或 `/Users/winter/Movies/Videos` 中运行 `npm install`。
3. 原始口播与录屏保留在 `/Users/winter/Movies/Videos/<当天目录>/`，通过 `npm run link-asset` 链接，不复制大体积原片。
4. 项目源码、时间轴、生成素材和工程输出保留在本工作区。
5. 正式成片通过 `npm run deliver` 复制到当天目录的 `edit/`，必须完成 SHA-256 校验。
6. Obsidian 只保存口播稿、分镜、事实口径、制作记录和成片路径，不再保存可安装的视频工程。
7. 根目录的 `node_modules`、Remotion 浏览器、`~/.npm` 和 HyperFrames NPX 缓存属于共享工具缓存，默认保留。
8. 清理单期项目时不得删除共享依赖；先区分原始素材、最终资产、可再生预览和工具缓存。
9. 开始新任务前先读取 `会话交接（2026-07-28）.md`，再运行 `npm run check`。

## 常用命令

```bash
npm run new -- <项目名> <YYYY-MM-DD>
npm run link-asset -- <项目名> <原始素材绝对路径> <项目内文件名>
npm run lint -- <项目名>
npm run compositions -- <项目名>
npm run studio -- <项目名>
npm run still -- <项目名> <Composition> <帧号>
npm run render -- <项目名> <Composition> <输出文件名> --crf=18
npm run deliver -- <项目名> <工程内输出> <当天交付目录> <交付文件名>
```

项目名只使用小写字母、数字和连字符。

## Skill

- `winter-video-create`：视频分镜、动画舞台、集中工作区与交付规范。
- `video-use`：口播剪辑、转写、字幕、音频边界和成片 QA。

项目级 Skill 入口位于 `.codex/skills/`，真实源仍在各自项目仓库中。
