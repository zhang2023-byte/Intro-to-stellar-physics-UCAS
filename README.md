# UCAS 恒星内部结构与演化

面向已有辐射与热统基础的高年级本科生和研究生的中文交互自习课程，围绕恒星大气、恒星内部结构与演化组织学习内容。

**[进入课程网站](https://zhang2023-byte.github.io/Intro-to-stellar-physics-UCAS/)** · 课程目录与可用章节以网站为准。

## 教材与学习方式

以 Erika Böhm-Vitense《恒星天体物理学导论》为主线，结合 Carroll 与 Ostlie《当代天体物理学导论》（原书第二版）补充解释与推导。

课件将物理概念、关键公式、交互图示和教材阅读指引结合，提供可展开的深入说明与章末概念自测。内容注明来源、适用条件及待核查问题；学生可通过课程页面提交反馈，由教师审核处理。

## 项目维护

课程源码位于 `lessons/`，构建工具与交互组件位于 `tools/`，生成的网站位于 `site/`。教材对应与核实记录位于 `mapping/`。

修改源码后重建网站，并检查生成结果。具体约定与操作入口：

- [课程格式与构建说明](tools/FORMAT.md)
- [项目协作与教材核实规则](AGENTS.md)
- [课程制作流程](.agents/skills/stellar-lesson-create/SKILL.md)
- [课程修订流程](.agents/skills/stellar-lesson-revise/SKILL.md)
- [GitHub Pages 发布工作流](.github/workflows/pages.yml)

教材全文、完整译文、原始学生反馈、凭据及本地工作记录不纳入公开仓库或网站，需另行保管与备份。

本机课本修订资料集中在 `textbooks/`：`pdf/` 存放三卷中文课本，`publishing/` 保存出版工具与素材；资料说明见本机 `textbooks/README.md`。原文和译文基线保留在 `library/`。这两个目录均由 Git 忽略。
