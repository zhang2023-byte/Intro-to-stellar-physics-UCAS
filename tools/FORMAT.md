# 课程文件约定

一课一份 `lessons/<ID>.md`。用 `./tools/course build <ID>` 构建本课并更新首页；`all` 构建全部；`index` 只更新首页；`check` 核对源码与输出；`test` 跑工具测试。在项目根执行。

## 安装与本地预览

首次配置和克隆步骤见 [README](../README.md#新成员开始)。在项目根目录执行 `npm --prefix tools ci` 安装锁定依赖；Node.js 最低版本为 20，自动检查配置使用 24。

npm 命令适用于 macOS、Linux 和 Windows PowerShell；Windows 若拦截 `npm.ps1`，可使用 `npm.cmd` 执行同样参数。`./tools/course` 是 macOS/Linux/Git Bash 的便利入口，PowerShell 使用 npm 或以下 Node 命令。

修改后构建、验证（在仓库根目录执行，将课程 ID 替换为目标课程）：

```sh
node tools/build.mjs build v2-ch04
npm --prefix tools run check
npm --prefix tools test
```

共用样式、交互或构建器变化时，使用 `npm --prefix tools run build` 全站重建。只查看或审核 PR 时先执行 check，不要先构建来掩盖作者漏提交生成网页的问题。

本地预览只提供 `site/`。有 Python 3 时，在仓库根执行 macOS/Linux 的 `python3 -m http.server 8000 --bind 127.0.0.1 --directory site`，Windows 执行 `py -3 -m http.server 8000 --bind 127.0.0.1 --directory site`，然后打开 `http://127.0.0.1:8000/`；按 Ctrl+C 停止。缺少 Python 或端口占用时，让 Agent 配置仅服务 `site/` 的等效本地预览或换端口，不要把含私有教材的仓库根目录作为服务目录。

首次运行浏览器回归前，进入 `tools/` 执行 `npx playwright install chromium`（Linux 如缺系统库，按 Playwright 提示安装，CI 可用 `npx playwright install --with-deps chromium`），再回到仓库根执行 `npm --prefix tools run browser-test`。测试覆盖范围以实际输出为准；人工还需查看受影响公式、全部相关题目、手机宽度与交互。飞书入口检查不等于真实问卷提交。

## 自动检查与部署

`.github/workflows/course-check.yml` 定义 Ubuntu/Windows 的源码输出一致性检查和工具测试，不包含浏览器回归。文件推送并触发后才能取得远端结果；是否为合并必需检查以 GitHub 当前配置为准。自动检查不能替代科学判断。

`.github/workflows/pages.yml` 在 main 的 site/ 或发布工作流变化后部署；上传已生成的 site/，不在发布时构建。部署是否成功须核对本次提交的实际运行结果。分支交付、人工审核和反馈收尾按网页修订 skill。

## 元数据

文件从一个 `lesson` 代码块开始，内容为 JSON，不使用 YAML 依赖：

```lesson
{"id":"example","version":"1.0.0","updated":"2026-09-07","title":"课程标题","summary":"一句话导读","scope":"教材范围","demo":false,"sources":["书名、版本、卷章、小节标题或编号"]}
```

ID 以英文字母起始，仅含字母、数字、下划线或连字符，须与文件名一致。元数据用于页面展示和反馈定位；`sources` 只放人能阅读的书目定位，不写私有路径。版本使用三段数字，供内部答题进度隔离；措辞/显示修正增加 patch，影响理解、题干或答案的修订增加 minor。`updated` 使用 YYYY-MM-DD；学生页面显示更新日期，不显示版本号或版本记录。反馈以更新日期及内容指纹定位。脱敏改动依据写在 PR，具体反馈结论写在内部表，不要求新增学生可见的维护日志。

学生看到的教材阅读指引和 `sources` 使用书名、版本、卷章、小节标题或编号，需要时补充公式、图或例题编号，不写具体页数或“拆分 PDF”等本地资料信息。先核对现用教材；小节编号有冲突时，用标题和公式等明确定位。实际核实的 PDF 页序、印刷页码及文件版本记在本机过程记录中。教材仅重新排版时无需更改网页定位；章节、标题或编号变动时再核对相关指引。

正文从 `## 小节标题 {#stable-id}` 开始，每个二级标题都要有全课唯一 ID。三级标题可以不带 ID。稳定 ID 与题目、活动共用命名空间。支持普通 Markdown、表格、原生 MathML 和自制内联 SVG；禁止正文脚本、内联事件、样式和手写 HTML ID。需要新交互时修改共用工具并测试。

## 公式与素材

公式使用浏览器原生 MathML，添加中文 aria-label，不需要外部字体/CDN：

```html
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block" aria-label="距离等于一除以视差"><mrow><mi>d</mi><mo>=</mo><mfrac><mn>1</mn><mi>p</mi></mfrac></mrow></math>
```

简单符号也可用 Unicode/普通文字。不能留下 `$$...$$` 等未渲染 LaTeX。图片只能引用项目内、教材和归档以外的原创或可公开 PNG/JPEG/WebP，构建时内嵌；不使用远程图片。SVG 可以直接写入正文；不复制教材原图。复杂交互源代码放 `tools/`，再由构建器内嵌。

## Quiz

一课仅在末尾“习题”小节放一个 `quiz` 代码块，内容为 JSON 数组，每题包括：

```quiz
[{"id":"q-example","type":"truefalse","question":"题干（明确适用条件）","options":[{"id":"T","text":"正确"},{"id":"F","text":"错误"}],"answer":"T","explanation":"答案的依据与误区。","concept":"stable-id"}]
```

`choice` 为单选，至少两个选项；`truefalse` 为判断，恰好两个选项。answer 引用唯一选项 ID；concept 引用本课正文 ID。仅一个正确答案，不以未解决的前沿争议作单一标准答案。选择改变后重新判题；浏览器进度按课程、版本、题目指纹隔离。

点击“回看相关概念”后，页面记住出发题目，并在原题离开视野时显示右下角“返回课后题”按钮。按钮返回该题并恢复键盘焦点，保留本次已选答案与判题结果；原题进入视野时隐藏。概念紧邻习题区时，仍可直接返回原题。回看链接只占文字及必要触控留白，避免整行空白触发跳转。

题干、选项和解析仍用纯文本。构建器通过 `tools/math-text.mjs` 将受支持的物理量下标与分数排为 MathML，其他内容统一转义；不能在题目 JSON 中写 HTML。新增符号格式需扩展此映射并验证。答题结果与命题本身的真假分开表达，解析用“该说法成立／不成立”，避免“回答正确。判断错误。”。

## 内置活动

`activity` JSON 代码块支持 brightness、color、airmass、cmd、spectra、hydrogen、blackbody、temperature；范围、物理假设和模型限制由共用组件固定说明。历史活动支持 `{"id":"parallax-lab","type":"parallax"}`。它展示圆形地球轨道、黄道极方向、小角度关系，不能挪用于任意观测几何。辐射转移活动支持 projection（投影面积）、transfer（常源函数气层）、lineformation（窄带谱线）、stratification（分层源函数）。其数值模型位于 `physics.js`，假设随活动展示；包含 transfer 的课件额外内嵌 `radiative-transfer.css`。大气活动另支持 limb（线性及二次源函数的出射角分布）、grey（Eddington 灰大气温度律）、edges（氢束缚—自由能量阈值）；相应数值关系位于 `physics.js`，活动旁注明假设与归一化。其他活动须实现后才能使用，构建会拒绝未知类型。

## 反馈和修订

通过飞书问卷收集，公开配置 `tools/feedback.json` 仅包含 `formUrl`。未开通时为 null，不生成假链接。页面提供课程ID、更新日期、正文/题目ID、标签及内容指纹，学生复制到问卷的“反馈位置”（底层表字段为“课程位置”）。旧反馈若携带 version，先比较对应版本与现版。实际预填能力需验证后接入，不臆造参数。

多维表格字段说明见 `feedback-schema.json`；它是字段参考，`group_editable` 表示协作约定，不是权限配置，也不会自动修改远端表。公开问卷的姓名、反馈对象、反馈位置、反馈为必填；补充材料与邮箱选填。字段操作权限见 AGENTS，工作状态和关闭语义统一见网页修订 skill。

## 首页与分卷目录

`tools/books.mjs` 维护两卷的章节顺序、标题和范围概要。已有课程的标题、概要取自课程元数据；未生成课件的章节标为待制作。`./tools/course index` 生成首页和两卷目录。教师指定的中文封面背景存于 `assets/covers/`，构建时内嵌。
