# Winter 视频中央工作区

这里是一条稳定的视频生产线，不是长期素材库，也不是 Skill 仓库。

## 长期保留

```text
package.json / package-lock.json   共享依赖清单
node_modules/                      所有项目共用的依赖
scripts/                           建项目、素材链接、检查、渲染、交付和清理工具
.codex/skills/                     Skill 入口链接，真实 Skill 保存在各自仓库
shared/                            至少被两个真实项目验证过的公共组件
cache/                             确实会跨项目复用的工具缓存
docs/history/                      只在恢复旧工程时查阅的历史记录
```

## 单期工作目录

```text
projects/<YYYY-MM-DD>/<项目名>/
├── project.json   项目身份、交付记录和保留策略
├── src/           本期画面与动画代码
├── public/        指向 Videos 原片的硬链接，以及本期生成素材
├── work/          时间轴、字幕、分镜和 QA 过程文件
├── output/        可再生成的预览和渲染结果
└── edit/          工程内部的临时剪辑文件
```

`projects/` 整体不进入 Git。删除一个完整的单期目录不会删除根目录依赖、其他项目、Skill、`Videos` 原片或已交付成片。

## 外部长期内容

- 原始口播和录屏：`/Users/winter/Movies/Videos/<当天目录>/`
- 正式成片：当天目录的 `edit/` 或用户明确指定的交付目录
- 口播稿、分镜和制作记录：Obsidian

## 日常使用

```bash
# 建立一期工程，默认交付后保留 30 天
npm run new -- <项目名> <YYYY-MM-DD>

# 零拷贝链接原片
npm run link-asset -- <日期/项目名> <原片绝对路径> source.mov

# 查看所有项目、状态和真正可释放的空间
npm run projects

# 审计顶层残留、孤立脚本、缓存和项目内重复依赖
npm run audit

# 改为交付后保留 7 天、30 天或永久保留
npm run retention -- <日期/项目名> 7
npm run retention -- <日期/项目名> 30
npm run retention -- <日期/项目名> keep

# 交付并累计登记每个正式文件的 SHA-256、交付时间和预计删除日
npm run deliver -- <日期/项目名> output/final.mp4 <交付目录> <文件名>

# 只预览达到清理条件的工程
npm run cleanup

# 删除到期工程；仍会逐个验证正式成片存在且 SHA-256 一致
npm run cleanup -- --confirm
```

清理永远以完整单期目录为边界。未交付、永久保留、尚未到期，或任一已登记交付文件缺失、哈希变化的项目都会被跳过。
