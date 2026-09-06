# 恒星物理 · 教学与探究

全书粗对应，逐课精核实。每个指定学习范围是一份独立、自包含的中文自习 HTML，用交互建立直觉，再回到教材和概念自测。

**先打开 [课程首页](site/index.html) 或 [Volume2 第1章自习网页](site/lessons/v2-ch01.html)。** 当前三章是本次指定的试做范围。在线地址：https://zhang2023-byte.github.io/Intro-to-stellar-physics-UCAS/ 。

## 日常只需关注三个地方

- `mapping/`：先查[四书目录](mapping/catalog.md)，再查 [Volume1](mapping/Volume1.md)、[Volume2](mapping/Volume2.md)、[Volume3](mapping/Volume3.md) 的候选对应。候选是导航，不是内容已精核的承诺。
- `lessons/`：一课一份 Markdown，包括正文、Quiz、活动、教材定位和修改记录。
- `site/`：首页和每堂课的 HTML。这里只放可公开的课程成果。

教材、拆分 PDF、MinerU 和完整译文在 `library/`，只在本地读取、不进入 Git。原翻译工程保存在 `archive/translation/`；本地 `archive/README.md`解释原位置与保留范围。生成的临时文件以后可放 `tmp/`，它不进入 Git。

## 请智能体制作或修改

在本项目中提出：

> 使用 $stellar-lesson-create，按 Volume1 第 X 章的指定小节制作自习网页。学生基础为……，预计自习时长为……。

> 使用 $stellar-lesson-revise，处理 v2-ch01 v1.1.0 的以下反馈……。需要科学内容更新时，请附材料，并说明哪些修改已获教师批准。

没有正式教材范围时，skill 会询问范围；不会自行确定课表。学生点击正文或题目旁的反馈入口，前往飞书问卷。问卷已接通：学生复制页面提供的课程位置，打开问卷填写姓名和反馈。姓名、反馈和课程位置必填；教师在多维表格维护解决状态与处理说明。公开配置在 `tools/feedback.json`，管理坐标保存在本地忽略的 `archive/feishu-feedback.local.json`。原始反馈放临时位置或 `feedback-raw/`，不进 Git。

智能体不主动联网搜索科学进展。Ref 中有益解释放入折叠知识卡片；仍缺少证据的具体问题可设开放调研，由学生查证并提交、教师审核。教师明确批准的更新可以直接执行；证据不足继续保留待核查。原理、不同近似、观测资料的年代不混为一谈。

## 本地构建

使用 Node.js 20+。入口会优先使用 `STELLAR_NODE`，其次使用 PATH 中的 Node；本机也支持 Codex 捆绑运行时。依赖已可用时无须安装；在其他机器上可于 `tools` 目录执行 `npm install`。依赖版本固定在 `tools/package.json`。构建依赖 marked，浏览器测试依赖 Playwright；不需要向量库或 Python Web 框架。

```sh
./tools/course build v2-ch01
./tools/course all
./tools/course index
./tools/course check
./tools/course test
./tools/course browser-test
```

`build` 更新指定课与首页；`all` 重建全部课程。`check` 检查源文件和生成文件一致。不要手改输出 HTML。

浏览器测试使用隔离的临时浏览器上下文；如 Playwright 自带 Chromium 不存在，本机使用已安装 Chrome。可用 `STELLAR_CHROMIUM` 指定浏览器可执行文件。测试在临时目录生成截图，检查窄屏、反馈入口和章末习题；不读取个人浏览器资料。

课程文件格式和内置活动见 [tools/FORMAT.md](tools/FORMAT.md)。公式用原生 MathML，图片在构建时内嵌；不依赖外部 CDN。当前支持测光、颜色、大气消光、颜色—星等图、光谱序列、氢的激发/电离、黑体谱与温度—半径交互；其他课程按教学需要扩展。

索引与迁移/Git 审计使用 Python 3 标准库：

```sh
python3 tools/catalog.py
python3 tools/audit.py
```

重建目录不会改变人工对应表。若教材缺失或更换版本，先恢复/核对本地材料，不凭旧路径猜测。

## 保存与发布

项目源码通过 Git 保存到 GitHub；提交、推送与网站发布分别按明确授权执行。`.codex/`、`archive/`、教材、完整译文、MinerU、出版 PDF、原始反馈和凭据均被排除；项目 skill 位于 `.agents/skills/`，纳入 Git。**Git 不备份这些本地资料，请另行备份 `library/`、`archive/` 和本机 `.codex/` 配置。**

GitHub Pages 通过 `.github/workflows/pages.yml` 仅发布 `site/`。推送到 `main` 的 `site/` 或发布工作流变更会触发部署，也可手动运行。修改课件后先重建和检查，再按授权提交、推送；部署成功后确认线上版本。首页使用相对链接，不提供离线下载入口。

初始化证据与已知边界见 本地 `archive/initialization-report.md`。

## 当前自习课件

面向已有辐射与热统基础的高年级本科或研究生。第1–3章各自独立、自包含，连续阅读，Ref 折叠卡片，章末习题和飞书问卷反馈入口。

- [第1章：看到的亮，代表什么？](site/lessons/v2-ch01.html)
- [第2章：光里的暗线，告诉了你什么？](site/lessons/v2-ch02.html)
- [第3章：怎样给恒星量体温？](site/lessons/v2-ch03.html)

视差示范已退出学生页面；仅保留 `tools/fixtures/demo-parallax.md` 作为构建器测试样例，旧 HTML 已删除。当前验收记录保存在本地 `archive/self-study-design.md`。初始化报告是改版前的历史快照，当前课件以 `lessons/` 和 `site/` 为准。
