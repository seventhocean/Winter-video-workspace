# Shotcraft 动画重构说明

本轮不再沿用“每章一张静态卡片”的旧舞台，而是按旁白语义，为 11 章分别选择一套 Shotcraft 主动效机制。色彩统一为纸张米白、深墨黑、电光蓝、青色和警示红；统一的是视觉语言，不是版式模板。

| 章节 | Shotcraft 动效卡 / 变体 | 本片中的叙事用途 |
|---|---|---|
| 01 重复提示词 | `timeline-travel` | 同一任务沿周次反复出现，最终合并为 Skill |
| 02 Skill 是什么 | `basic-3d-scene` | 镜头依次穿过触发、流程、验收三层工作空间 |
| 03 何时值得做 | `type-and-filter` | 四个判断条件进入筛选器，最后收紧任务范围 |
| 04 工作流卡片 | `assemble-then-type-flyin` | 六块工作流骨架组装，再逐项灌入内容 |
| 05 三种触发测试 | `bezier-source-converge-merge` | 三种真实说法沿曲线汇入同一个 Skill |
| 06 最小文件结构 | `canvas-materialize-moves` 的 `diagram-cascade` 变体 | SKILL.md 先落地，其他目录按需级联并可收回 |
| 07 交给 WorkBuddy | `terminal-3d` | 输入、Skill Creator、输出三块终端空间接力，最后展开完整提示词 |
| 08 SKILL.md | `document-typewriter-reveal` | 文档内容逐块擦写，光标跟随书写前沿 |
| 09 验证与实测 | `before-after-slider-scrub` | 同一成品上划开“格式正确”和“真实好用” |
| 10 五个坑 | `word-relay-filmstrip` | 左侧证据胶片只在换坑时步进，右侧修正词原位接力 |
| 11 结尾行动 | `ui-strip-away-outro` | 流程 UI 分层剥离，最终只留下核心方法 |

## 节奏原则

- 动画在对应语义出现前启动约 0.2–0.5 秒，避免旁白说完后画面才开始反应。
- 每个长章节内部都有多次状态变化；动画不以章节标题为唯一触发点。
- 完整提示词和 SKILL.md 使用可阅读的文档镜头，不拆成零碎短句。
- 字幕只承担逐句跟读，主体动画承担解释，不再重复把字幕做成大卡片。
- 第 10 章严格按五段旁白切点步进，停顿时胶片停止，避免背景式持续滚动。
