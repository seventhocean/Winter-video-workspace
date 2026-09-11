# AGENTS.md

这是 Winter 唯一的视频项目管理、剪辑、动画制作与渲染工作区。

工作区只负责集中保存单期项目、共享依赖、素材链接、缓存、工程输出和正式交付；视频制作能力、规则、校验器和公共工程底座完整归属于各自 Skill，不在工作区维护第二份 Skill 模板。

必须使用中文交流，项目文档也使用中文。

## 硬性规则

1. 所有新视频项目只创建在 `projects/<YYYY-MM-DD>/<项目名>/`；日期目录只负责归类，不是独立工程。旧的 `projects/<项目名>/` 工程保持原位并继续兼容。
2. 所有项目共用根目录唯一的 `node_modules`；禁止在 `projects/`、Obsidian 或 `/Users/winter/Movies/Videos` 中运行 `npm install`。
3. 原始口播与录屏保留在 `/Users/winter/Movies/Videos/<当天目录>/`，通过 `npm run link-asset` 链接，不复制大体积原片。
4. 项目源码、时间轴、生成素材和工程输出保留在本工作区。
5. 正式成片通过 `npm run deliver` 复制到当天目录的 `edit/`，必须完成 SHA-256 校验。
6. Obsidian 只保存口播稿、分镜、事实口径、制作记录和成片路径，不再保存可安装的视频工程。
7. 根目录的 `node_modules`、Remotion 浏览器、`~/.npm` 和 HyperFrames NPX 缓存属于共享工具缓存，默认保留。
8. 清理单期项目时不得删除共享依赖；先区分原始素材、最终资产、可再生预览和工具缓存。
9. 首次在本会话执行项目创建、制作或渲染前，读取本 AGENTS.md 和对应 Skill，并运行 `npm run check`；环境变化或出现相关故障时再复检。纯阅读、审阅和文案整理不以运行环境检查为前置。预检失败时定位受影响资源，只暂停依赖该资源的步骤，其余已授权工作继续。恢复历史项目状态时再读取 `docs/history/2026-07-28-workspace-handoff.md`，其中的历史流程按当前规则核对。原有的正式渲染前风格确认要求保留在 `winter-video-create` 的“先做短样片”一节，已有明确批准可按其范围复用。
10. `npm run new` 直接从 `winter-video-create/assets/remotion-project-base/` 创建项目；工作区不得再维护一份独立的 Remotion 模板副本。
11. `projects/` 是可删除的单期工作数据，不进入 Git；共享能力只能留在 Skill、根目录脚本或经过复用验证的 `shared/` 中。
12. 新项目默认在正式交付后保留 30 天；可调整为 7 天、其他天数或永久保留。自动清理只处理已交付且到期的完整项目目录，并必须再次验证交付文件的 SHA-256。

## 常用外部目录

- `/Users/winter/Documents/Obsidian/Owner_known/02-AI自媒体/`：自媒体工作目录，常作为视频制作的素材来源。需要使用时，通过 `npm run link-asset` 链接到对应项目，不在此目录创建视频工程或安装视频依赖。
- `/Users/winter/Movies/Videos/`：视频存储目录。原始口播与录屏按当天目录保留，正式成片通过 `npm run deliver` 复制到当天目录的 `edit/`。
- `../threeui/`：可选的 ThreeUI 视觉源码资产库。默认从工作区同级目录发现，也可用 `THREEUI_ROOT` 指向其他克隆；只读取并把选中的 Community 源码复制进单期项目适配，不在仓库内安装依赖，不作为工作区硬依赖。

## 常用命令

```bash
npm run new -- <项目名> <YYYY-MM-DD>
npm run new:shotcraft -- <项目名> <YYYY-MM-DD>
npm run link-asset -- <项目名> <原始素材绝对路径> <项目内文件名>
npm run shotcraft:capture -- <项目名>
npm run check:shotcraft
npm run check:threeui
npm run smoke:shotcraft
npm run lint -- <项目名>
npm run compositions -- <项目名>
npm run studio -- <项目名>
npm run still -- <项目名> <Composition> <帧号>
npm run render -- <项目名> <Composition> <输出文件名> --crf=18
npm run deliver -- <项目名> <工程内输出> <当天交付目录> <交付文件名>
npm run projects
npm run retention -- <项目名> <7|30|keep>
npm run cleanup
npm run cleanup -- --confirm
npm run audit
npm run smoke
```

项目名只使用小写字母、数字和连字符。

## Skill

- `winter-video-create`：完整的视频分镜、动画编排、公共工程底座和质量规范。
- `video-use`：口播剪辑、转写、字幕、音频边界和成片 QA。
- `video-shotcraft`：产品页面采集、2.5D/3D 运镜、动效节奏与高质量宣传片镜头语言；项目仍由本工作区统一创建和渲染。

项目级 Skill 入口位于 `.codex/skills/`，真实源仍在各自 Skill 仓库中；工作区只调用，不拆分或复制 Skill 能力。
