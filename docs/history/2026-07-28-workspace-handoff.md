---
created: 2026-07-28
status: 可开始下一期视频
workspace: /Users/winter/Documents/Project/Winter-video-workspace
---
# Winter 视频集中工作区·会话交接

## 一句话状态

中央视频工作区已经创建并通过完整冒烟测试。它只负责集中管理单期项目、共享依赖、素材链接、缓存、工程输出和正式交付；视频制作能力、规则、校验器和 Remotion 公共工程底座完整归属于 `winter-video-create`，不再由工作区维护第二份模板。`Owner_known/02-AI自媒体` 常作为素材来源，`Videos` 日期目录只保存原始录制与最终交付，Obsidian 只保存内容文档和成片路径。

## 新会话进入方式

遵循当前根目录 `AGENTS.md` 的进入与预检规则。本文件保存历史状态，恢复历史项目时按需读取；下文中的旧组件、制作模式和验证记录不覆盖当前 Skill。原有的正式渲染前风格确认要求已保留在 `winter-video-create` 的“先做短样片”一节，不因交接文件转为历史参考而取消。

## 工作区结构

```text
Winter-video-workspace/
├── AGENTS.md
├── package.json
├── package-lock.json
├── node_modules/                    # 唯一共享依赖
├── projects/
│   ├── YYYY-MM-DD/                  # 新项目按制作日期归类
│   │   └── 项目名/
│   └── 2026-07-28-ai-video-skills/  # 日期分层前的旧工程，继续兼容
├── shared/                          # 跨项目验证后再进入的公共组件
├── scripts/                         # 新建、链接、渲染、交付
├── cache/                           # 共享可复用缓存
└── .codex/skills/                   # Skill 软链接入口
```

`npm run new` 通过 `.codex/skills/winter-video-create` 读取 Skill 真源中的 `assets/remotion-project-base/`，再复制到 `projects/<YYYY-MM-DD>/<项目名>/`。工作区不保存独立模板，也不迁移日期分层前的旧工程。

## 常用外部目录

```text
/Users/winter/Documents/Obsidian/Owner_known/02-AI自媒体/
└── 自媒体工作目录：经常提供视频制作所需素材

/Users/winter/Movies/Videos/
└── 视频存储目录：保存当天原始录制，并接收正式成片到当天目录/edit/
```

使用规则：素材从 `Owner_known/02-AI自媒体` 或其他外部来源进入项目时，优先使用 `npm run link-asset`，不复制大体积原片；正式成片使用 `npm run deliver` 复制到 `Videos/<当天目录>/edit/`，并完成 SHA-256 校验。

## 已准备的运行环境

- Node.js：`25.9.0`
- npm：`11.12.1`
- Remotion：固定 `4.0.499`
- React / React DOM：`19.2.3`
- HyperFrames：通过共享 NPX 缓存固定调用 `0.7.77`
- FFmpeg / FFprobe：系统命令可用
- Remotion Chrome Headless Shell：位于根目录 `node_modules/.remotion/`
- Shotcraft：Puppeteer `25.4.0`、Three.js `0.185.1`、React Three Fiber `9.7.0`、Remotion Three / Motion Blur `4.0.499`
- Google Chrome：供 Shotcraft 真实网页 2x 截图与元素切片复用，不重复下载 Chromium
- uv：用于按需运行 librosa / scipy 节奏分析环境，不污染系统 Python

当前共享依赖来自原“四个 Skill”工程的 `node_modules`：迁移时约 668MB，整理 Remotion 缓存后当前约 624MB。采用移动而非复制，原工程路径留下了指向中央依赖的软链接，因此仍能运行，没有新增第三份依赖。

## Video Shotcraft 使用入口

Shotcraft 复用中央工作区的唯一依赖，不在 Skill 或单期项目里安装 `node_modules`：

```bash
npm run check:shotcraft
npm run new:shotcraft -- product-promo 2026-08-03
npm run shotcraft:capture -- product-promo
npm run studio -- product-promo
npm run still -- product-promo AiflPromo 150
npm run render -- product-promo AiflPromo final.mp4 --crf=18
```

`new:shotcraft` 会把已验证的 Ink Press 宣传片模板复制到本期项目，并生成专用的网页采集脚本。先修改 `projects/<YYYY-MM-DD>/<项目>/scripts/capture-pages.mjs` 中的地址、路由和选择器，再运行采集。采集结果包括全页 2x 截图、元素级 PNG 切片和真实坐标 `layout.json`，用于后续 2.5D/3D 运镜。

自由创作时不要求照搬 Ink Press 成片；模板提供的是节奏骨架、清晰度方案、运镜和声音钉帧方法。只有本期确认采用该风格时，才保留其完整视觉表现。

## 已验证参考工程

项目：

```text
projects/2026-07-28-ai-video-skills
```

它是“AI 做视频必备的 4 个 Skill”60 秒成片的源码参考，已在中央依赖下成功识别以下 Composition：

- `OpeningManualToFourSkills`
- `FullOneMinutePreview`
- `ClosingWorkflow`
- `FourSkillsCombined`
- `Skill01HyperFrames`
- `Skill02Remotion`
- `Skill03VideoUse`
- `Skill04Seedance`

最终成片通过项目 `output/参考成片-待字幕BGM.mp4` 软链接到原 Obsidian 主题目录，没有复制文件。

## 新一期标准流程

### 1. 新建项目

```bash
npm run new -- topic-slug 2026-07-29
```

新工程会创建在 `projects/2026-07-29/topic-slug/`。后续命令可继续只写项目名；若不同日期存在同名项目，则使用完整标识 `2026-07-29/topic-slug`。

### 2. 链接当天原始素材

```bash
npm run link-asset -- topic-slug \
  "/Users/winter/Movies/Videos/7月29日/口播.mov" source.mov
```

不要手动复制大型 MOV / MP4 到 `public/`。

### 3. 建立制作规格与时间轴

- 编辑 `projects/<YYYY-MM-DD>/<项目>/work/制作规格.md`
- 编辑 `projects/<YYYY-MM-DD>/<项目>/work/timeline.json`
- 6 秒以上纯动画章节填写 `motionBeats`
- 口播视频剪辑遵守 `video-use`
- 动画舞台遵守 `winter-video-create`

### 4. 预览与正式渲染

```bash
npm run lint -- <项目名>
npm run compositions -- <项目名>
npm run still -- <项目名> Main 120
npm run render -- <项目名> Main preview-v1.mp4 --crf=18
```

按当前 `winter-video-create` 的“先做短样片”一节取得或沿用本期明确的风格批准后，继续使用同一工程渲染正式版本，不复制临时工程；本文件不另设重复确认。

### 5. 交付到当天目录

```bash
npm run deliver -- <项目名> \
  output/final.mp4 \
  "/Users/winter/Movies/Videos/当天目录/edit" \
  主题名-成片.mp4
```

交付脚本不会覆盖同名不同内容的文件，并在复制后校验 SHA-256。它默认保留工程输出。

## 自动化脚本验证结果

已经完成以下测试：

1. 创建临时项目。
2. 建立素材软链接。
3. 识别 `Main` Composition。
4. 渲染 3 秒、1920×1080、H.264 MP4。
5. 复制到临时交付目录。
6. 源文件与交付文件 SHA-256 一致。
7. 临时测试项目已移入废纸篓。

## Skill 已更新

`winter-video-create` 已改为：

- 固定使用本中央工作区。
- 禁止在 Obsidian 与日期目录安装视频依赖。
- 原始素材采用链接策略。
- 正式成片采用复制与哈希校验策略。
- Skill 完整拥有制作规范、时间轴校验器和 `assets/remotion-project-base/` 公共工程底座。
- 工作区的 `npm run new` 直接从 Skill 底座创建单期项目，工作区只负责集中管理和运行。
- 公共底座包含 `BaseVideo`、`Stage`、`LayerTimeline`、保护区、拓扑、指标、资料堆叠、节点网络、真实素材框与 HyperFrames 媒体桥接。
- 公共底座不是万能画面模板：人物口播可复用局部信息层；纯动画讲解和高级商业动画按项目新增独立镜头组件。
- 修改 Skill 公共底座后，在工作区运行 `npm run smoke`，自动验证时间轴、Lint、TypeScript、Composition 和横竖屏结构帧。

真实源：

```text
/Users/winter/Documents/Project/Winter-private-skill/winter-video-create
```

## 已知事项

- Remotion 在项目子目录运行时会提示“推荐从根目录执行”，但 Composition 识别和正式渲染均已成功。这是非阻断提示。
- `npm install --package-lock-only` 报告 13 个依赖漏洞：1 个低风险、12 个高风险。没有执行 `npm audit fix`，因为自动升级可能破坏固定的 Remotion 版本；后续单独评估。
- `/Users/winter/Movies/Videos/7月26日/edit/skill-manager-effects/node_modules` 的旧 Remotion `4.0.495` 依赖仍然存在，约 610MB。本次没有删除，等中央工作区完成下一期真实项目后再决定归档。
- 历史目录中两组完全相同的大型媒体副本仍未删除，本次只完成架构迁移。

## 清理记录（2026-08-25）

- 已将各项目 `output/` 中可再生的预览 MP4、QA/抽帧/联系表图片，以及本期已被最终版替代的旧版整片移入 macOS 废纸篓；未触碰源码、时间轴、制作记录、原始素材链接、正式最终成片或被其他项目引用的输出。
- 25 日 Codex 项目保留原始口播硬链接与最终工程成片；被后续项目引用的 `book-cover-carousel-preview-v6.mp4` 已恢复。
- 工作区占用由约 8.4G 降至约 7.0G；共享 `node_modules` 保留，`.git` 中的 Codex turn-diff/checkpoint 历史暂不清理，以免影响回溯。
- 根目录 `.gitignore` 已补充 `projects/<日期>/<项目>/public|output|edit` 的忽略规则，避免未来生成物进入版本控制。

## 清理记录（2026-08-30）

- 按最新参考片级语义动效标准，已将 `projects/` 下 28 个历史顶层目录整体移入 macOS 废纸篓；唯一保留 `projects/2026-08-30/lovart-speaking-effects` 作为当前项目和后续最低标准样板。
- 共享 `node_modules`、Remotion/Chrome 工具缓存、`cache`、`.git`、Skill 真源和当前项目源码、时间轴、原始素材链接、最终输出均未删除。
- `winter-video-create` 新增“对象先动、文字后落点”契约：每个强化句必须有可见的对象状态变化（滚动、填充、移动、散落/收拢、组装或解锁），禁止用整片文案和小图标替代语义动画；公共工程底座已支持数字起止值、温度起止值和步骤/流程逐项进入。

## 下一会话建议起点

直接告诉 Codex：

> 阅读 AGENTS.md 和 `docs/history/2026-07-28-workspace-handoff.md`，确认集中工作区状态。以后所有视频剪辑只在这里创建项目；原始素材从当天 Videos 目录链接，成片交付回当天目录。

如果下一期素材已经准备好，随后提供主题、口播稿、原始视频绝对路径和当天交付目录即可。
