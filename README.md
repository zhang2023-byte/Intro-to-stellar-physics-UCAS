# UCAS 恒星内部结构与演化

面向已有辐射与热统基础的高年级本科生和研究生的中文交互自习课程，围绕恒星大气、恒星内部结构与演化组织学习内容。

**[进入课程网站](https://zhang2023-byte.github.io/Intro-to-stellar-physics-UCAS/)** · 课程目录与可用章节以网站为准。

## 两条路径

先选一条：

- **[学习时](#学习时)**：用这门课学习恒星物理，不参与课程维护。
- **[维护时](#维护时)**：参与课件、反馈、PR、教材译本与发布。

## 教材与学习方式

以 Erika Böhm-Vitense《恒星天体物理学导论》为主线，结合 Carroll 与 Ostlie《当代天体物理学导论》（原书第二版）补充解释与推导。

课件将物理概念、关键公式、交互图示和教材阅读指引结合，提供可展开的深入说明与章末概念自测。内容注明来源、适用条件及待核查问题；学生可通过课程页面提交反馈，由课程优化组依据教材修改、独立互审，疑难问题交助教。

## 学习时

如果你是用这门课学习恒星物理的同学，不需要先成为维护者，也不需要安装课程构建工具：

1. 取得本仓库的本地副本（克隆或助教提供的工作副本），用能读写文件的 Agent 打开仓库根目录。
2. 直接说你想学什么，例如“我想学恒星光谱分类，先看看我缺哪些基础，再安排第一课”；也可以输入 `/teach`。
3. Agent 会读取 [teach skill](.agents/skills/teach/SKILL.md)，在 `study/` 中建立学习目标、单课网页、参考资料和学习记录。

这个教学 skill 来自 [mattpocock/skills](https://github.com/mattpocock/skills) 的 `teach`，已针对本课程的工作区、资料来源和中文教学做了适配。

`study/` 是你的本机学习工作区，已在 `.gitignore` 中，不会进入 Git 或课程网站，也不参与 `site/` 构建与发布。学习材料以课程正文和教材为依据，外部资料注明来源，不修改课程源码。

## 维护时

把 GitHub 用户名交给助教，接受协作者邀请。使用本人账号配置 Git、GitHub CLI、Node.js 24（含 npm）及能读取飞书反馈的工具；已有 Node.js 20+ 环境也可运行课程工具。让 Agent 检查现有环境后补齐即可。

```sh
git clone https://github.com/zhang2023-byte/Intro-to-stellar-physics-UCAS.git
cd Intro-to-stellar-physics-UCAS
npm --prefix tools ci
npm --prefix tools run check
npm --prefix tools test
```

将克隆目录作为 Agent 工作空间。教材目录结构随 Git 提供，PDF 需自己提供：按[教材说明](textbooks/pdf/README.md)放入原版和译本，并实际验证 Agent 能读取相关页面。只补齐本轮需要的教材。

可以直接把下面这句话交给 Agent：

> 请读取项目 AGENTS.md，按维护时的网页修订流程处理我指定的课程反馈或 PR。先确认当前任务阶段；需要教材时检查 textbooks/pdf/，缺少哪本就具体向我索取。

每轮一位同学处理、另一位同学审核；助教负责新课件、译本和疑难问题。人员安排与内部反馈入口见项目组飞书规范，完整网页工作流只维护在[修订 skill](.agents/skills/stellar-lesson-revise/SKILL.md)。

## 按需查阅

| 内容 | 入口 |
| --- | --- |
| 两条路径与通用边界 | [AGENTS.md](AGENTS.md) |
| 学习时教学流程 | [teach skill](.agents/skills/teach/SKILL.md) |
| 本地预览、检查命令和课程文件格式 | [tools/FORMAT.md](tools/FORMAT.md) |
| 讲解写法、符号约定与范本 | [讲解写法](.agents/skills/stellar-lesson-create/references/explanation-guide.md)、[符号约定](.agents/skills/stellar-lesson-create/references/notation.md)，范本 `lessons/v2-ch07.md` |
| 原版与译本 PDF | [textbooks/pdf/README.md](textbooks/pdf/README.md) |
| 助教新建课程 | [制作 skill](.agents/skills/stellar-lesson-create/SKILL.md) |
| 助教修订教材 | [教材 skill](.agents/skills/stellar-textbook-revise/SKILL.md) |
| 助教复盘指定 PR 与反馈 | [复盘 skill](.agents/skills/stellar-collaboration-retrospective/SKILL.md) |

课程源码在 `lessons/`，共用工具在 `tools/`，生成网页在 `site/`；学习者在本地 `study/`（已忽略）学习。教材和内部记录不进入公开仓库。`archive/library/`、`mapping/` 属于历史翻译资料，日常课程维护无需读取。
