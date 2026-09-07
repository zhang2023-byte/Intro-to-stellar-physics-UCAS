# Volume2《Stellar Atmospheres》与 Ref 的粗对应

本文件只做 Volume2 16 个正文编号章节与 Ref 的主题级导航。Volume2 章节名称、MinerU 小节和 Ref 章节入口均以 [mapping/catalog.md](catalog.md) 为定位索引；调研不联网，候选关系不等于全书逐式核实；后续第1–3章的具体核实另记在下方。旧书范围保留 Volume2 的原小节编号，表中的主题是对内容的原创概括。

状态约定：

- **候选对应**：由两书目录、MinerU 标题和局部正文作出的合理初配，仍需在具体课程使用前查对应拆分 PDF。
- **候选对应（已浏览正文，待逐课核实）**：本轮已直接阅读对应的 Ref MinerU 正文局部，主题和基本概念可以对接，但仍需逐课核对公式、数字、图表和覆盖深度。
- **暂未找到完整对应**：本轮暂未找到能承担该主题的完整对应；表中若列出近邻章节，只表示局部候选或背景，不扩大为完整覆盖。

## 第 1 章 Stellar magnitudes and stellar colors

来源：[Volume2 第 1 章](catalog.md#volume2-ch01)；候选来源：[Ref 第 3 章](catalog.md#ref-ch03)、[Ref 第 6 章](catalog.md#ref-ch06)、[Ref 第 8 章](catalog.md#ref-ch08)。

| 旧书范围 | 主题 | Ref 候选范围（具体章/节号和标题） | 理由/覆盖边界 | 状态 |
|---|---|---|---|---|
| 1.1 The apparent magnitudes；1.4 Absolute magnitudes of stars；1.5 The luminosities of the stars | 视星等、绝对星等、流量和光度之间的观测量关系 | [Ref 第 3 章 3.2.1–3.2.4：视星等；流量、光度和平方反比定律；绝对星等；距离模数](catalog.md#ref-ch03) | Ref 第 3 章把视星等、流量/光度、绝对星等和距离模数放在同一连续谱框架中，主题覆盖直接。Volume2 对恒星光度量的组织和推导细节仍需单独核对。 | 候选对应 |
| 1.2 Stellar colors；1.6 The color magnitude diagram of the stars | 色指数、颜色图和颜色—星等图 | [Ref 第 3 章 3.6.1–3.6.3：UBV 波长滤光片；色指数和热改正；双色图](catalog.md#ref-ch03)<br>[Ref 第 8 章 8.2–8.2.2：赫兹伯隆—罗素图；恒星半径的巨大范围；摩根—基南光度分类](catalog.md#ref-ch08) | Ref 3.6 覆盖滤光片、色指数和双色图，Ref 8.2 可承接颜色/光度在 H-R 图上的组织。双色图与颜色—星等图不是同一个图，不能据此声称 Ref 覆盖 Volume2 的全部图示。 | 候选对应（部分） |
| 1.3 Correction for absorption in the Earth's atmosphere | 地球大气消光的观测改正 | [Ref 第 6 章 6.4.1–6.4.2：电磁波谱的大气窗口；在大气层外观测](catalog.md#ref-ch06) | Ref 6.4 说明哪些波段受大气窗口限制以及为什么要在大气层外观测，但后续逐课核实已在 Ref §9.2.3 例9.2.3 找到理想消光外推，见下方核实记录；实际仪器标定仍待独立材料。 | 候选对应（参见下方补充核实） |

## 第 2 章 Stellar spectra

来源：[Volume2 第 2 章](catalog.md#volume2-ch02)；候选来源：[Ref 第 5 章](catalog.md#ref-ch05)、[Ref 第 8 章](catalog.md#ref-ch08)。

| 旧书范围 | 主题 | Ref 候选范围（具体章/节号和标题） | 理由/覆盖边界 | 状态 |
|---|---|---|---|---|
| 2.1 The spectral sequence | 光谱序列以及用谱线区分恒星类型 | [Ref 第 8 章 8.1–8.1.5：谱线的形成；恒星的光谱型；麦克斯韦—玻尔兹曼速度分布；玻尔兹曼公式；萨哈公式及其结合](catalog.md#ref-ch08)<br>[Ref 第 5 章 5.1–5.1.3：谱线；基尔霍夫定律；恒星光谱数据的应用；光谱仪](catalog.md#ref-ch05) | Ref 8.1 直接以谱线形成、激发和电离解释光谱型，Ref 5.1 补充谱线观测和基本判别。Ref 的分类叙述是综合教材层级，尚未确认覆盖 Volume2 对序列的全部图表和经验细节。 | 候选对应 |

## 第 3 章 Temperature estimates for stars

来源：[Volume2 第 3 章](catalog.md#volume2-ch03)；候选来源：[Ref 第 3 章](catalog.md#ref-ch03)、[Ref 第 8 章](catalog.md#ref-ch08)、[Ref 第 9 章](catalog.md#ref-ch09)。

| 旧书范围 | 主题 | Ref 候选范围（具体章/节号和标题） | 理由/覆盖边界 | 状态 |
|---|---|---|---|---|
| 3.1 The black body；3.3 Wien temperatures | 黑体谱、峰值波长与温度估计 | [Ref 第 3 章 3.4.1–3.4.2：颜色与温度的联系；斯特藩—玻尔兹曼公式](catalog.md#ref-ch03)<br>[Ref 第 3 章 3.5.1–3.5.2：黑体辐射曲线的普朗克函数；普朗克函数与天体物理](catalog.md#ref-ch03) | Ref 3.4–3.5 同时提供黑体、颜色/温度和普朗克函数的基础，可承接 Wien 型温度估计。是否给出 Volume2 相同的估计流程和误差讨论，尚未查拆分 PDF。 | 候选对应 |
| 3.2 Effective temperatures of stars；3.4 Discussion of temperature measurements in stars | 有效温度与不同“温度”定义的区别 | [Ref 第 3 章 3.4.2：斯特藩—玻尔兹曼公式](catalog.md#ref-ch03)<br>[Ref 第 8 章 8.1.3–8.1.5：玻尔兹曼公式；萨哈公式；结合玻尔兹曼公式和萨哈公式](catalog.md#ref-ch08)<br>[Ref 第 9 章 9.2.1：温度和局部热动平衡](catalog.md#ref-ch09) | Ref 3.4.2 负责有效温度的全局定义，Ref 8.1 和 Ref 9.2.1 分别提供激发/电离温度与 LTE 背景。尚未确认 Ref 是否按 Volume2 的术语和测温比较组织材料。 | 候选对应（部分） |

### 本次逐课核实（2026-09-06，自习第1–3章）

以下只核实课件实际采用的范围，不代表 Ref 全章或所有现代解释已完成审核。

| 旧书范围 | 主题 | Ref 范围 | 已核实内容及定位 | 状态 |
|---|---|---|---|---|
| §1.1、§1.4–1.5 | 自习采用的具体定义/关系 | §3.2、§3.6.2 | 星等、距离模数、热改正定义；V2 印刷页1–3、9–13（拆分PDF同页）；Ref 页51–53、64–68（第3章PDF页3–5、16–20）。BC的两种符号约定不混用。 | 已核实（所列定义） |
| §1.2 | 自习采用的具体定义/关系 | §3.6 | 色指数、零点、宽带响应；V2 页3–6、10，Ref 页64–68；教学窄窗曲线不作为 Johnson 标定。 | 已核实（所列定义） |
| §1.3 | 自习采用的具体定义/关系 | §9.2.3 例9.2.3 | 发现直接对应的消光外推例题，修正此前仅找到大气窗口的粗对应；V2 页7–9，Ref 页201（第9章PDF页11）。具体仪器颜色项标定仍未覆盖。 | 已核实（理想外推） |
| §2.1 | 自习采用的具体定义/关系 | §§8.1.1、8.1.3–8.1.5 | OBAFGKM、巴耳末峰、激发与电离解释；V2 页15–17（第2章PDF页1–3）；Ref 页168–182（第8章PDF页1–15），关键公式页175、177。 | 已核实（分类及关系式） |
| §§3.1–3.3 | 自习采用的具体定义/关系 | §§3.4–3.5 | Planck 两种谱密度、Wien、总流量、角半径与有效温度；V2 页20–23（第3章PDF页3–6）；Ref 页59–60、62–64（第3章PDF页11–12、14–16）。频率峰由公式求极值而得，另做数值测试。 | 已核实（所列关系式） |
| §3.4 | 自习采用的具体定义/关系 | §9.2.1 | 温度定义与LTE边界；V2 页25（第3章PDF页8），Ref 页197（第9章PDF页7）。 | 已核实（定义与局部性） |

## 第 4 章 Basics about radiative transfer

来源：[Volume2 第 4 章](catalog.md#volume2-ch04)；候选来源：[Ref 第 5 章](catalog.md#ref-ch05)、[Ref 第 9 章](catalog.md#ref-ch09)。

| 旧书范围 | 主题 | Ref 候选范围（具体章/节号和标题） | 理由/覆盖边界 | 状态 |
|---|---|---|---|---|
| 4.1 Definition of the intensity；4.2 Radiative energy transport；4.3 The source function | 比强度、辐射能量传输、源函数及光学描述 | [Ref 第 9 章 9.1.1–9.1.4：比强度和平均强度；比能量密度；比辐射流量；辐射压强](catalog.md#ref-ch09)<br>[Ref 第 9 章 9.3.1–9.3.2：光子发射过程；随机游走](catalog.md#ref-ch09)<br>[Ref 第 9 章 9.4.1–9.4.3：发射系数；源函数和转移方程；黑体辐射的特例](catalog.md#ref-ch09) | 已直接阅读 Ref 9.1 的强度、能量密度、流量和辐射压定义以及 9.4 的发射/源函数入口，主题链条与 Volume2 基础章一致。Ref 9 的符号、归一化和推导顺序仍需逐式对照。 | 候选对应（已浏览正文，待逐课核实） |
| 4.4 Absorption versus emission lines | 吸收线、发射线及其与介质相互作用的基本判断 | [Ref 第 5 章 5.1–5.1.2：谱线；基尔霍夫定律；恒星光谱数据的应用](catalog.md#ref-ch05)<br>[Ref 第 9 章 9.4.1–9.4.3：发射系数；源函数和转移方程；黑体辐射的特例](catalog.md#ref-ch09) | Ref 5.1 直接提供谱线/基尔霍夫背景，Ref 9.4 提供辐射转移语言。尚未确认 Ref 是否覆盖 Volume2 对吸收线和发射线的全部例图与条件讨论。 | 候选对应（已浏览正文，待逐课核实） |

### 本次逐课核实：v2-ch04（Astra，2026-09-07）

以下仅确认本课实际采用的关系；上述其他候选范围维持原状态。

| 旧书范围 | 主题 | Ref 核实范围 | PDF 核实定位与边界 | 状态 |
|---|---|---|---|---|
| §§4.1–4.2 | 比强度与投影，吸收发射收支 | §§9.1.1、9.1.3、9.4.2 | V2 印刷26–28（拆分页1–3）；Ref 印刷191–194（拆分页1–4）、211（页21）。κ的按长度/质量定义及ρ因子逐式区分；只引入通量作为折叠解释。 | 已核实（所列定义） |
| §§4.2–4.3 | 光学厚度、源函数、LTE | §§9.4.2–9.4.4的相关段落 | V2 印刷28–29（拆分页3–4）；Ref 211–213（页21–23）。固定路径累计光深正号；LTE热发射关系不等于辐射场为黑体。无散射模型边界明示。 | 已核实（所列关系） |
| §4.4 | 常S形式解，薄厚极限，谱线对比 | §9.4.3例9.4.1 | V2 印刷30–33、35–36（拆分页5–8、10–11），式4.21–4.29及示意条件；Ref 212（页22）。窄带谱线差值为本课从形式解推导，另做解析数值检验。 | 已核实（解与条件） |
| §4.4后半 | 分层源函数和非LTE边界 | §9.4.2–9.4.3 | V2 印刷33、35–38（拆分页8、10–13）；Ref 211–212（页21–22）。逐层模型为原创教学离散化；太阳历史图谱不采用精确波长阈值、不复制图像。非LTE定量模型不在本课覆盖范围。 | 已核实（定性链与限制） |

## 第 5 章 Radiative transfer in stellar atmospheres

来源：[Volume2 第 5 章](catalog.md#volume2-ch05)；候选来源：[Ref 第 9 章](catalog.md#ref-ch09)。

| 旧书范围 | 主题 | Ref 候选范围（具体章/节号和标题） | 理由/覆盖边界 | 状态 |
|---|---|---|---|---|
| 5.1 The radiative transfer equation；5.2 Surface intensities；5.3 The fluxes | 平面平行大气中的转移方程、表面强度和辐射流量 | [Ref 第 9 章 9.1.1–9.1.3：比强度和平均强度；比能量密度；比辐射流量](catalog.md#ref-ch09)<br>[Ref 第 9 章 9.3–9.4.2：辐射转移；转移方程；发射系数；源函数和转移方程](catalog.md#ref-ch09) | 直接核读的 Ref 9.1 与 9.4.2 已出现强度、能量密度、流量、源函数和转移方程，Ref 9.3 还引入光子输运。Volume2 的表面强度积分和角度记号是否逐项一致，仍需拆分 PDF 精核。 | 候选对应（已浏览正文，待逐课核实） |
| 5.4 Surface flux and effective temperature；5.5 The flux F and the anisotropy of the radiation field；5.6 Radiation density | 表面通量、有效温度、辐射场各向异性和辐射能量密度 | [Ref 第 9 章 9.1.1–9.1.4：比强度和平均强度；比能量密度；比辐射流量；辐射压强](catalog.md#ref-ch09)<br>[Ref 第 9 章 9.3.3：临边昏暗](catalog.md#ref-ch09)<br>[Ref 第 9 章 9.4.3–9.4.6：黑体辐射的特例；平面平行大气假设；爱丁顿近似；临边昏暗现象的重新审视](catalog.md#ref-ch09) | Ref 9 的场量定义、平面平行近似、临边昏暗和 Eddington 近似与 Volume2 的观测/模型链条相接。Ref 的章节更概论化，尚未确认可直接承担 Volume2 的各向异性积分和辐射密度推导。 | 候选对应（已浏览正文，待逐课核实） |

## 第 6 章 The depth dependence of the source function

来源：[Volume2 第 6 章](catalog.md#volume2-ch06)；候选来源：[Ref 第 9 章](catalog.md#ref-ch09)、[Ref 第 11 章](catalog.md#ref-ch11)。

| 旧书范围 | 主题 | Ref 候选范围（具体章/节号和标题） | 理由/覆盖边界 | 状态 |
|---|---|---|---|---|
| 6.1 Empirical determination of the depth dependence of the source function for the sun | 由太阳中心到边缘强度变化反推源函数随深度的变化 | [Ref 第 9 章 9.3.3、9.4.6：临边昏暗；临边昏暗现象的重新审视](catalog.md#ref-ch09)<br>[Ref 第 11 章 11.2.1–11.2.2：光球层；太阳米粒组织](catalog.md#ref-ch11) | Ref 9 有临边昏暗和转移方程，Ref 11 有太阳光球和米粒组织观测背景。本轮暂未找到足以确认 Volume2 那种从观测反演源函数的完整流程。 | 候选对应（部分） |
| 6.2 Wavelength dependence of the absorption coefficient；6.3 Radiative equilibrium | 波长相关不透明度与辐射平衡 | [Ref 第 9 章 9.2.4–9.2.6：不透明度的来源；连续不透明度和 H−；罗斯兰平均不透明度](catalog.md#ref-ch09)<br>[Ref 第 9 章 9.4.3–9.4.4：黑体辐射的特例；平面平行大气假设](catalog.md#ref-ch09) | Ref 9 直接提供不透明度、H−、Rosseland 平均和辐射转移背景，可作候选入口。尚未确认 Ref 是否以太阳多波长观测建立不透明度比值。 | 候选对应（部分） |
| 6.4 The theoretical temperature stratification in a grey atmosphere in radiative equilibrium | 灰大气辐射平衡中的温度分层 | [Ref 第 9 章 9.2.6：罗斯兰平均不透明度](catalog.md#ref-ch09)<br>[Ref 第 9 章 9.4.3–9.4.5：黑体辐射的特例；平面平行大气假设；爱丁顿近似](catalog.md#ref-ch09) | 这些小节可能支撑灰大气的近似背景，但本轮尚未确认 Ref 给出与 Volume2 同等的温度分层数学推导。 | 候选对应（覆盖边界待核） |

## 第 7 章 The continuous absorption coefficient

来源：[Volume2 第 7 章](catalog.md#volume2-ch07)；候选来源：[Ref 第 5 章](catalog.md#ref-ch05)、[Ref 第 8 章](catalog.md#ref-ch08)、[Ref 第 9 章](catalog.md#ref-ch09)。

| 旧书范围 | 主题 | Ref 候选范围（具体章/节号和标题） | 理由/覆盖边界 | 状态 |
|---|---|---|---|---|
| 7.1 Different absorption processes for hydrogen | 氢的束缚—自由、自由—自由和线跃迁造成的吸收过程 | [Ref 第 5 章 5.3.1–5.3.2：氢的波长；玻尔的半经典原子](catalog.md#ref-ch05)<br>[Ref 第 9 章 9.2.2–9.2.5：不透明度的定义；光学深度；不透明度的来源；连续不透明度和 H−](catalog.md#ref-ch09) | Ref 5 提供氢原子跃迁基础，Ref 9 提供不透明度和连续吸收入口。尚未确认 Ref 的综合层级详列 Volume2 的各类氢连续过程及阈值。 | 候选对应（部分） |
| 7.2 The Boltzmann formula；7.3 The Saha equation | 激发占据数、电离平衡与温度/密度的联系 | [Ref 第 8 章 8.1.3–8.1.5：玻尔兹曼公式；萨哈公式；结合玻尔兹曼公式和萨哈公式](catalog.md#ref-ch08) | 小节标题和主题直接对应，Ref 8.1 还把两式用于解释光谱型。是否覆盖 Volume2 的具体占据数应用和数值例题，需要拆分 PDF。 | 候选对应 |
| 7.4 H− absorption coefficient；7.5 Helium absorption；7.6 Metallic absorption；7.7–7.8 Scattering；7.9 Absorption coefficients for A and B stars | 太阳及 A/B 星的大气连续吸收、散射和组分差异 | [Ref 第 9 章 9.2.4–9.2.6：不透明度的来源；连续不透明度和 H−；罗斯兰平均不透明度](catalog.md#ref-ch09)<br>[Ref 第 9 章 9.1.4：辐射压强](catalog.md#ref-ch09) | Ref 9.2.4–9.2.6 可承接不透明度来源、H− 和平均不透明度，9.1.4 可作散射/辐射动量背景。本轮暂未找到对 Volume2 的 He、金属、Thomson 散射和 A/B 星系数表的完整对应。 | 候选对应（部分） |

## 第 8 章 The influence of the non-greyness of the absorption coefficient

来源：[Volume2 第 8 章](catalog.md#volume2-ch08)；候选来源：[Ref 第 3 章](catalog.md#ref-ch03)、[Ref 第 8 章](catalog.md#ref-ch08)、[Ref 第 9 章](catalog.md#ref-ch09)。

| 旧书范围 | 主题 | Ref 候选范围（具体章/节号和标题） | 理由/覆盖边界 | 状态 |
|---|---|---|---|---|
| 8.1 The continuum energy distribution | 非灰不透明度如何改变连续谱能量分布 | [Ref 第 3 章 3.4–3.6：黑体辐射；能量的量子化；色指数](catalog.md#ref-ch03)<br>[Ref 第 9 章 9.2.4–9.2.6：不透明度的来源；连续不透明度和 H−；罗斯兰平均不透明度](catalog.md#ref-ch09) | Ref 3 给出观测连续谱和颜色基础，Ref 9 给出不透明度背景；两者合起来可作候选阅读路径。尚未确认 Ref 有 Volume2 同样的非灰连续谱推导。 | 候选对应（部分） |
| 8.2 The dependence of the Balmer discontinuity on temperature and electron density；8.3 The influence of the Balmer jump on the UBV colors | Balmer 跳变、电子密度、UBV 颜色的联系 | [Ref 第 3 章 3.6.1–3.6.3：UBV 波长滤光片；色指数和热改正；双色图](catalog.md#ref-ch03)<br>[Ref 第 8 章 8.1.1、8.1.3–8.1.5：恒星的光谱型；玻尔兹曼公式；萨哈公式；结合玻尔兹曼公式和萨哈公式](catalog.md#ref-ch08)<br>[Ref 第 9 章 9.2.5：连续不透明度和 H−](catalog.md#ref-ch09) | Ref 3.6 和 Ref 8.1 可分别承接颜色和氢线/电离背景，Ref 9.2.5 承接连续不透明度。尚未确认 Ref 中有按温度和电子密度定量推导 Balmer 跳变的完整段落。 | 候选对应（部分） |
| 8.4 The influence of the non-greyness on the temperature stratification | 非灰吸收对大气温度分层的影响 | [Ref 第 9 章 9.2.1–9.2.6：温度和局部热动平衡；不透明度的定义；光学深度；不透明度来源；连续不透明度和 H−；罗斯兰平均不透明度](catalog.md#ref-ch09)<br>[Ref 第 9 章 9.4.3–9.4.5：黑体辐射的特例；平面平行大气假设；爱丁顿近似](catalog.md#ref-ch09) | Ref 9 可提供 LTE、不透明度、光学深度和 Eddington 近似的背景，但非灰温度分层的具体模型和数值变化仍是 Volume2 专业内容。 | 暂未找到完整对应（近邻候选） |

## 第 9 章 The pressure stratification

来源：[Volume2 第 9 章](catalog.md#volume2-ch09)；候选来源：[Ref 第 9 章](catalog.md#ref-ch09)、[Ref 第 10 章](catalog.md#ref-ch10)。

| 旧书范围 | 主题 | Ref 候选范围（具体章/节号和标题） | 理由/覆盖边界 | 状态 |
|---|---|---|---|---|
| 9.1 The hydrostatic equilibrium equation；9.2 Integration of the hydrostatic equilibrium equation；9.3 Dependence of gas pressure on gravitational acceleration；9.4 Electron pressure | 大气静力平衡、气体压强随深度和表面重力的变化 | [Ref 第 10 章 10.1–10.2.2：流体静力学平衡；确定恒星的内部结构；流体静力学平衡公式的推导；质量守恒公式；状态方程；压强积分的推导；用平均分子量表示的理想气体定律](catalog.md#ref-ch10)<br>[Ref 第 9 章 9.1.4：辐射压强](catalog.md#ref-ch09) | Ref 10.1–10.2.2 给出一般恒星结构中的静力平衡和状态方程，Ref 9.1.4 补充辐射压。Ref 的主体是恒星内部，尚未确认可直接承担 Volume2 的平面平行大气积分和电子压强专题。 | 候选对应（部分） |
| 9.5 The effects of turbulent pressure | 湍流压强在大气分层中的作用 | [Ref 第 10 章 10.4.3：压强标高](catalog.md#ref-ch10)<br>[Ref 第 10 章 10.4.10：超绝热对流的混合长度理论](catalog.md#ref-ch10) | Ref 10.4 能提供压强标高和对流背景，但本轮暂未找到对湍流压强项及其在 A/B 星大气中作用的明确小节。 | 暂未找到完整对应 |
| 9.6 Effects of radiation pressure | 辐射压对压强分层和表层支撑的影响 | [Ref 第 9 章 9.1.4：辐射压强](catalog.md#ref-ch09)<br>[Ref 第 10 章 10.2.5：辐射压的贡献](catalog.md#ref-ch10)<br>[Ref 第 10 章 10.6.1：爱丁顿光度极限](catalog.md#ref-ch10) | Ref 9.1.4 和 Ref 10.2.5 有直接的辐射压概念入口，Ref 10.6.1 可联系高光度恒星的极限。尚未确认三者合起来能复现 Volume2 的大气分层推导。 | 候选对应 |

## 第 10 章 Theory of line formation

来源：[Volume2 第 10 章](catalog.md#volume2-ch10)；候选来源：[Ref 第 5 章](catalog.md#ref-ch05)、[Ref 第 8 章](catalog.md#ref-ch08)、[Ref 第 9 章](catalog.md#ref-ch09)。

| 旧书范围 | 主题 | Ref 候选范围（具体章/节号和标题） | 理由/覆盖边界 | 状态 |
|---|---|---|---|---|
| 10.1–10.4 Formation of optically thin lines；line absorption coefficient；Doppler profile；Voigt profile | 光学薄谱线、线吸收系数、Doppler/Voigt 线型 | [Ref 第 9 章 9.5.1–9.5.3：等值宽度；谱线致宽的过程；沃伊特轮廓](catalog.md#ref-ch09)<br>[Ref 第 9 章 9.4.1–9.4.2：发射系数；源函数和转移方程](catalog.md#ref-ch09) | Ref 9.5 的标题和顺序直接落在等值宽度、致宽和 Voigt 轮廓，Ref 9.4 提供辐射转移连接。本轮已浏览对应正文，确认主题级对接，但尚未逐式核验 Volume2 的光学薄近似和线吸收系数表达式。 | 候选对应（已浏览正文，待逐课核实） |
| 10.5–10.6 Line broadening due to turbulent motions；other distortions of line profiles；10.7 Equivalent widths for optically thin lines | 湍流致宽、其他线型变形和等值宽度 | [Ref 第 9 章 9.5.1–9.5.2：等值宽度；谱线致宽的过程](catalog.md#ref-ch09) | Ref 9.5.1–9.5.2 提供直接入口。尚未确认 Ref 是否逐项区分 Volume2 的全部致宽来源及湍流参数化。 | 候选对应（已浏览正文，待逐课核实） |
| 10.8–10.9 Optically thick lines；the curve of growth | 光学厚线和生长曲线 | [Ref 第 9 章 9.5.1、9.5.4：等值宽度；生长曲线](catalog.md#ref-ch09)<br>[Ref 第 9 章 9.5.5：恒星大气的计算机模型](catalog.md#ref-ch09) | 生长曲线是 Ref 9.5.4 的明确主题，可承接等值宽度到丰度分析的桥梁；光学厚度分区、阻尼常数影响和 Volume2 的详细数值例仍待拆分 PDF。 | 候选对应（已浏览正文，待逐课核实） |

## 第 11 章 The hydrogen lines

来源：[Volume2 第 11 章](catalog.md#volume2-ch11)；候选来源：[Ref 第 3 章](catalog.md#ref-ch03)、[Ref 第 8 章](catalog.md#ref-ch08)、[Ref 第 9 章](catalog.md#ref-ch09)。

| 旧书范围 | 主题 | Ref 候选范围（具体章/节号和标题） | 理由/覆盖边界 | 状态 |
|---|---|---|---|---|
| 全章 The hydrogen lines | 氢线的形成、强度随恒星条件的变化以及光谱判别 | [Ref 第 8 章 8.1.1、8.1.3–8.1.5：恒星的光谱型；玻尔兹曼公式；萨哈公式；结合玻尔兹曼公式和萨哈公式](catalog.md#ref-ch08)<br>[Ref 第 9 章 9.5.1–9.5.4：等值宽度；谱线致宽的过程；沃伊特轮廓；生长曲线](catalog.md#ref-ch09)<br>[Ref 第 3 章 3.4–3.6：黑体辐射；能量的量子化；色指数](catalog.md#ref-ch03) | Ref 8.1 可承接氢线与激发/电离的关系，Ref 9.5 可承接线型和等值宽度，Ref 3 提供连续谱背景。本轮尚未确认 Ref 有与 Volume2 同名的独立氢线专章，因此氢线的完整专题覆盖仍需精核。 | 候选对应（部分） |

## 第 12 章 Spectrum analysis

来源：[Volume2 第 12 章](catalog.md#volume2-ch12)；候选来源：[Ref 第 3 章](catalog.md#ref-ch03)、[Ref 第 8 章](catalog.md#ref-ch08)、[Ref 第 9 章](catalog.md#ref-ch09)、[Ref 第 13 章](catalog.md#ref-ch13)。

| 旧书范围 | 主题 | Ref 候选范围（具体章/节号和标题） | 理由/覆盖边界 | 状态 |
|---|---|---|---|---|
| 12.1 The Balmer jump and the hydrogen lines；12.2 The Strömgren colors | Balmer 跳变、氢线和 Strömgren 光电颜色 | [Ref 第 3 章 3.6.1–3.6.3：UBV 波长滤光片；色指数和热改正；双色图](catalog.md#ref-ch03)<br>[Ref 第 8 章 8.1.1、8.1.3–8.1.5：恒星的光谱型；玻尔兹曼公式；萨哈公式；结合玻尔兹曼公式和萨哈公式](catalog.md#ref-ch08) | Ref 3.6 是颜色观测和颜色图的候选入口，Ref 8.1 是氢线强度、激发和电离的候选入口。尚未确认 Ref 讲解 Strömgren 系统或 Balmer 跳变的完整测量方案。 | 候选对应（部分） |
| 12.3 The curve of growth analysis（含线识别、线 multiplet、Doppler 宽度、激发/电离/动力学温度和电子压强） | 从生长曲线反推温度、压强、线宽和元素丰度 | [Ref 第 9 章 9.5.1–9.5.5：等值宽度；谱线致宽的过程；沃伊特轮廓；生长曲线；恒星大气的计算机模型](catalog.md#ref-ch09)<br>[Ref 第 8 章 8.1.3–8.1.5：玻尔兹曼公式；萨哈公式；结合玻尔兹曼公式和萨哈公式](catalog.md#ref-ch08) | Ref 9.5 明确覆盖等值宽度、致宽、Voigt 轮廓和生长曲线，Ref 8.1 提供激发/电离解释；尚未确认 Ref 有 Volume2 那种按 multiplet 逐步求 T、电子压强和丰度的分析流程。 | 候选对应（部分） |
| 12.4 Observed element abundances；12.4.1–12.4.2 Population I/II stars | 观测元素丰度及恒星族群差异 | [Ref 第 8 章 8.1.5：结合玻尔兹曼公式和萨哈公式](catalog.md#ref-ch08)<br>[Ref 第 13 章 13.3.1：星族 I、II 和 III](catalog.md#ref-ch13)<br>[Ref 第 9 章 9.5.5：恒星大气的计算机模型](catalog.md#ref-ch09) | Ref 13.3.1 可提供 Pop I/II 背景，Ref 8.1.5 和 Ref 9.5.5 可作谱线丰度和模型大气的近邻入口。本轮暂未找到 Ref 中与 Volume2 “observed element abundances”同范围的完整分析章。 | 候选对应（部分） |

## 第 13 章 Basics about non-local thermodynamic equilibrium

来源：[Volume2 第 13 章](catalog.md#volume2-ch13)；候选来源：[Ref 第 5 章](catalog.md#ref-ch05)、[Ref 第 9 章](catalog.md#ref-ch09)、[Ref 第 13 章](catalog.md#ref-ch13)。

| 旧书范围 | 主题 | Ref 候选范围（具体章/节号和标题） | 理由/覆盖边界 | 状态 |
|---|---|---|---|---|
| 13.1 Einstein transition probabilities；13.3 The source function for a bound-bound transition；13.4 Excitation of energy levels | Einstein 跃迁概率、束缚—束缚源函数、碰撞/辐射激发和退激发 | [Ref 第 5 章 5.2–5.4：光子；原子的玻尔模型；量子力学和波粒二象性](catalog.md#ref-ch05)<br>[Ref 第 9 章 9.2.1、9.4.1–9.4.3：温度和局部热动平衡；发射系数；源函数和转移方程；黑体辐射的特例](catalog.md#ref-ch09) | Ref 5 提供原子跃迁的量子背景，Ref 9 提供 LTE、发射系数和源函数背景；这些是局部连接，不能替代 Volume2 的 NLTE 速率和占据数处理。 | 暂未找到完整对应（部分候选） |
| 13.2 Induced emissions and lasers and masers；13.5 Summary | 受激发射、激光/脉泽以及 NLTE 总结 | [Ref 第 13 章 13.2.11：质量损失与 AGB 演化（含 OH/IR 源脉泽背景）](catalog.md#ref-ch13)<br>[Ref 第 5 章 5.2–5.4：光子；原子模型；量子力学和波粒二象性](catalog.md#ref-ch05) | Ref 13.2.11 只是在 AGB 质量损失语境下提及脉泽，Ref 5 说明光子和原子跃迁基础；本次未找到讲解 Volume2 全部 Einstein 系数、受激发射增益和 NLTE 总结的对应章节。 | 暂未找到 |

## 第 14 章 The hydrogen convection zone

来源：[Volume2 第 14 章](catalog.md#volume2-ch14)；候选来源：[Ref 第 10 章](catalog.md#ref-ch10)、[Ref 第 11 章](catalog.md#ref-ch11)。

| 旧书范围 | 主题 | Ref 候选范围（具体章/节号和标题） | 理由/覆盖边界 | 状态 |
|---|---|---|---|---|
| 14.1–14.3 Introduction；Schwarzschild instability criterion；radiative and adiabatic temperature gradients | 对流不稳定判据、辐射/绝热温度梯度 | [Ref 第 10 章 10.4.1–10.4.2、10.4.6–10.4.10：三种能量传输机制；辐射温度梯度；绝热气体定律；绝热温度梯度；恒星对流的判据；超绝热对流的混合长度理论](catalog.md#ref-ch10) | Ref 10.4 的标题与这些基础概念直接相接，并包含对流判据和混合长度理论。其讨论对象是一般恒星结构，未确认针对 Volume2 的氢电离层和大气上边界。 | 候选对应 |
| 14.4 Upper boundaries for the hydrogen convection zones；14.5–14.6 Convective energy transport and importance | 氢对流区上边界、对流能量输运及其在恒星大气中的重要性 | [Ref 第 10 章 10.4.1、10.4.9–10.4.10：三种能量传输机制；恒星对流的判据；超绝热对流的混合长度理论](catalog.md#ref-ch10)<br>[Ref 第 11 章 11.1.2、11.2.2：太阳现今的内部结构；太阳米粒组织](catalog.md#ref-ch11) | Ref 10.4 可承接能量输运/混合长度，Ref 11 可提供太阳对流区和米粒组织观测背景。没有确认 Ref 对氢对流区上边界和 Volume2 的专门模型有完整覆盖。 | 候选对应（部分） |

## 第 15 章 Stellar chromospheres, transition layers, and coronae

来源：[Volume2 第 15 章](catalog.md#volume2-ch15)；候选来源：[Ref 第 9 章](catalog.md#ref-ch09)、[Ref 第 11 章](catalog.md#ref-ch11)。

| 旧书范围 | 主题 | Ref 候选范围（具体章/节号和标题） | 理由/覆盖边界 | 状态 |
|---|---|---|---|---|
| 15.1 Solar observations；15.1.1 The solar chromosphere；15.1.2 The transition layer | 太阳色球、过渡区及其谱线观测 | [Ref 第 11 章 11.2.4–11.2.6：色球层；过渡区；日冕层](catalog.md#ref-ch11)<br>[Ref 第 9 章 9.3–9.4：辐射转移；转移方程](catalog.md#ref-ch09) | Ref 11.2.4–11.2.6 是直接的太阳外层大气候选，Ref 9 提供光谱和辐射转移背景。Ref 的太阳章节与 Volume2 的观察量可能不完全同年代或同深度。 | 候选对应 |
| 15.2 Stellar observations；15.3 Theory of stellar chromospheres, transition layers and coronae | F/G/K 星外层大气观测、加热/辐射损失/导热和能量平衡 | [Ref 第 11 章 11.2.6–11.2.11：日冕层；冕洞和太阳风；帕克风模型；太阳高层大气的流体动力学本质；磁流体力学与阿尔芬波；其他恒星的外层大气](catalog.md#ref-ch11)<br>[Ref 第 9 章 9.2.1、9.3–9.4：局部热动平衡；辐射转移；转移方程](catalog.md#ref-ch09) | Ref 11.2.11 明确承接其他恒星外层大气，太阳色球/日冕和风的前置小节可作物理背景。未确认 Ref 完整给出 Volume2 的 Joule 加热、辐射损失、导热和能量平衡模型；这些是专业大气内容的局部覆盖。 | 候选对应（部分） |

## 第 16 章 Stellar winds

来源：[Volume2 第 16 章](catalog.md#volume2-ch16)；候选来源：[Ref 第 9 章](catalog.md#ref-ch09)、[Ref 第 10 章](catalog.md#ref-ch10)、[Ref 第 11 章](catalog.md#ref-ch11)、[Ref 第 13 章](catalog.md#ref-ch13)、[Ref 第 15 章](catalog.md#ref-ch15)。

| 旧书范围 | 主题 | Ref 候选范围（具体章/节号和标题） | 理由/覆盖边界 | 状态 |
|---|---|---|---|---|
| 16.1 Observations of stellar winds；16.1.1–16.1.3 solar, cool luminous, and hot luminous star winds | 太阳风、冷/热高光度星风的观测和质量损失 | [Ref 第 11 章 11.2.7–11.2.11：冕洞和太阳风；帕克风模型；太阳高层大气的流体动力学本质；磁流体力学与阿尔芬波；其他恒星的外层大气](catalog.md#ref-ch11)<br>[Ref 第 13 章 13.2.11：质量损失与 AGB 演化](catalog.md#ref-ch13)<br>[Ref 第 15 章 15.1.1–15.1.4：高光度蓝变星；沃尔夫—拉叶星；大质量恒星的常规演化方案；汉弗莱斯—戴维森光度极限](catalog.md#ref-ch15) | Ref 11 对太阳风和外层大气最直接，Ref 13/15 分别提供 AGB 与大质量星质量损失背景。它们覆盖不同恒星族群，不能合并声称存在一个统一的 Volume2 星风观测章。 | 候选对应（部分） |
| 16.2 Theory of stellar winds；16.2.1–16.2.2 hydrostatic and hydrodynamic theory | 静力平衡为何失效、星风流体动力学 | [Ref 第 11 章 11.2.8–11.2.10：帕克风模型；太阳高层大气的流体动力学本质；磁流体力学与阿尔芬波](catalog.md#ref-ch11)<br>[Ref 第 10 章 10.1、10.4：流体静力学平衡；能量传输和热力学](catalog.md#ref-ch10) | Ref 11 给出 Parker 风和高层大气流体动力学入口，Ref 10 提供静力平衡/能量输运背景。未确认 Ref 对 Volume2 的一般化临界点、密度—速度关系和积分推导有同等覆盖。 | 候选对应（部分） |
| 16.3 Theoretical properties of stellar winds；16.4 The Eddington limit | 临界速度/温度、日冕温度、临界点距离和爱丁顿极限 | [Ref 第 11 章 11.2.8–11.2.10：帕克风模型；太阳高层大气的流体动力学本质；磁流体力学与阿尔芬波](catalog.md#ref-ch11)<br>[Ref 第 10 章 10.6.1：爱丁顿光度极限](catalog.md#ref-ch10)<br>[Ref 第 9 章 9.1.4：辐射压强](catalog.md#ref-ch09) | Ref 10.6.1 和 Ref 9.1.4 是爱丁顿极限/辐射压的明确入口，Ref 11 可承接日冕风和 Parker 结构。未找到涵盖 Volume2 全部临界点尺度、热力学性质和一般恒星风的单一对应章节。 | 候选对应（部分） |

## 跨卷联系、缺口与覆盖统计

Volume2 第 1–3 章与 Volume1 的测光、颜色、有效温度和光谱基础相接；在 Ref 中主要落到第 3、5、8 章。第 4–12 章构成从辐射场、转移方程、不透明度到谱线分析的连续链条，Ref 第 9 章是主要入口，Ref 第 5、8 章提供原子和光谱分类背景。第 13–16 章则跨到恒星结构和演化：NLTE、对流区、太阳外层大气和星风分别与 Ref 第 5、9、10、11、13、15 章发生局部联系。

本轮明确的覆盖缺口如下：

- 本轮暂未在 Ref 中找到与 Volume2 第 13 章同等范围的 NLTE 基础章；Einstein 系数、碰撞/辐射占据数和受激发射只能找到背景或局部提及。
- Volume2 第 8 章的非灰温度分层、第 9 章的湍流压强与大气压强分层、第 14 章氢对流区上边界，超出 Ref 综合章节已确认的直接覆盖范围。
- Volume2 第 15 章的色球—过渡区—日冕能量平衡和第 16 章的一般恒星风理论，在 Ref 第 11 章有太阳及外层大气材料，但仍是跨小节的部分覆盖。
- Ref 第 3 章的双色图、Ref 第 8 章的 H-R 图、Volume2 第 1 章的颜色—星等图名称相近但图义不同，不能自动合并。

按章节导航状态统计（每章计一次；有候选入口不等于完整覆盖）：

| 整体状态 | 章节数 | 章节 |
|---|---:|---|
| 候选对应 | 15 | 第 1–12、14–16 章 |
| 暂未找到完整对应（有背景入口） | 1 | 第 13 章 |
| 已核实 | 0 | 本轮未做逐课 PDF 精核 |
| 合计 | 16 | Volume2 全部正文编号章节 |

第 4、5、10 章的部分 Ref 正文已浏览，仍属候选，不升级整章为已核实。第 13 章只有局部背景入口，尚未找到可承担全章的完整对应；其他章节也可能有行级缺口。后续逐课使用时，应优先查第 8、9、13、14、15、16 章的正文和拆分 PDF，确认公式、模型假设、图表及专业深度。
