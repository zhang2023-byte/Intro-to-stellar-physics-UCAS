# 课程文件约定

一课一份 `lessons/<ID>.md`。用 `./tools/course build <ID>` 构建本课并更新首页；`all` 构建全部；`index` 只更新首页；`check` 核对源码与输出；`test` 跑工具测试。在项目根执行。

## 元数据

文件从一个 `lesson` 代码块开始，内容为 JSON，不使用 YAML 依赖：

```lesson
{"id":"example","version":"1.0.0","updated":"2026-09-07","title":"课程标题","summary":"一句话导读","scope":"教材范围","demo":false,"sources":["书名、版本、小节、已确认页码"]}
```

ID 以英文字母起始，仅含字母、数字、下划线或连字符，须与文件名一致。元数据用于页面展示和反馈定位；`sources` 只放人能阅读的书目定位，不写私有路径。版本使用三段数字，仅供内部答题进度隔离。`updated` 使用 YYYY-MM-DD；学生页面显示更新日期，不显示版本号或版本记录。反馈以更新日期及内容指纹定位。

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

## 内置活动

`activity` JSON 代码块支持 brightness、color、airmass、cmd、spectra、hydrogen、blackbody、temperature；范围、物理假设和模型限制由共用组件固定说明。历史活动支持 `{"id":"parallax-lab","type":"parallax"}`。它展示圆形地球轨道、黄道极方向、小角度关系，不能挪用于任意观测几何。辐射转移活动支持 projection（投影面积）、transfer（常源函数气层）、lineformation（窄带谱线）、stratification（分层源函数）。其数值模型位于 `physics.js`，假设随活动展示；包含 transfer 的课件额外内嵌 `radiative-transfer.css`。大气活动另支持 limb（线性及二次源函数的出射角分布）、grey（Eddington 灰大气温度律）、edges（氢束缚—自由能量阈值）；相应数值关系位于 `physics.js`，活动旁注明假设与归一化。其他活动须实现后才能使用，构建会拒绝未知类型。

## 反馈和修订

通过飞书问卷收集，公开配置 `tools/feedback.json` 仅包含 `formUrl`。未开通时为 null，不生成假链接。页面提供课程ID、版本、正文/题目ID、标签及内容指纹，学生复制到问卷的“课程位置”。实际预填能力需验证后接入，不臆造参数。

飞书多维表格字段预案见 `tools/feedback-schema.json`：姓名、反馈、课程位置、参考来源、是否已解决、处理说明、提交时间。姓名、反馈和课程位置必填；是否已解决和处理说明仅教师管理，表单不展示。默认不向学生开放表格。密钥、表格管理坐标和原始记录留本地忽略文件，不进入网页或Git。

## 自习组织

主线连续下拉；不设置逐步模式、上下步按钮或离线下载入口。深入解释和“教材补充与更新”用 details/summary，可包含公式及交互。所有习题放在最后。删去操作口号和装饰性短句，保留实际物理内容、假设、坐标、单位和阅读定位。

## 首页与分卷目录

`tools/books.mjs` 维护两卷的章节顺序、标题和范围概要。已有课程的标题、概要取自课程元数据；未生成课件的章节标为待制作。`./tools/course index` 生成首页和两卷目录。教师指定的中文封面背景存于 `assets/covers/`，构建时内嵌。

题干、选项和解析仍用纯文本。构建器通过 `tools/math-text.mjs` 将受支持的物理量下标与分数排为 MathML，其他内容统一转义；不能在题目 JSON 中写 HTML。新增符号格式需扩展此映射并验证。答题结果与命题本身的真假分开表达，解析用“该说法成立／不成立”，避免“回答正确。判断错误。”。
