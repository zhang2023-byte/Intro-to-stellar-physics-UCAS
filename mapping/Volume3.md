# Volume3 与 Ref 的粗对应

> 历史翻译对应资料；日常制课与修订请直接读取 [教材 PDF](../textbooks/pdf/README.md)，无需维护本表。

本表用于从 E. Böhm-Vitense《Introduction to Stellar Astrophysics》Volume3 的 20 个正文编号章节，导航到 Carroll 与 Ostlie《当代天体物理学导论》中的可能对应位置。旧书章节和小节以本地 [四书目录](catalog.md) 为入口；表中只写章节/小节号和标题，不猜测页码。

“候选对应”表示本轮根据目录、小节标题及少量 MinerU 正文建立的粗对应，尚未完成公式、数字、图表和版本差异的逐课核查；“已核实”保留给逐课精读后可以确认边界的对应；“暂未找到”表示在本轮已浏览的 Ref 目录和正文中没有找到同主题的专门小节。Ref 有相关背景并不等于两书结论、参数或科学史叙述已经一致。特别是历史数据质量、对流处理、混合长度、超调、锂丰度和太阳中微子问题，均不据模型记忆宣布“已解决”或“已过时”。

## 第 1 章 Introduction

旧书入口：[catalog.md#volume3-ch01](catalog.md#volume3-ch01)。Ref 候选入口：[catalog.md#ref-ch03](catalog.md#ref-ch03)、[catalog.md#ref-ch07](catalog.md#ref-ch07)、[catalog.md#ref-ch08](catalog.md#ref-ch08)。

| 旧书范围 | 主题 | Ref 候选范围（具体章/节号和标题） | 理由/覆盖边界 | 状态 |
|---|---|---|---|---|
| 1.1 Color magnitude diagrams；1.1.1 Apparent magnitudes of stars；1.1.2 The colors；1.1.4 The absolute magnitudes of the stars | 星等、颜色、绝对星等和颜色-星等图的观测基础 | Ref 第3章 3.2「星等大小」、3.2.1「视星等」、3.2.3「绝对星等」、3.2.4「距离模数」；3.6「色指数」 | 共享视星等、绝对星等、颜色/色指数的定义；旧书的颜色-星等图和星团应用超出 Ref 第3章的基础定义。 | 候选对应 |
| 1.1.3 Interstellar reddening；1.1.5 The color magnitude diagram of nearby stars；1.1.6 Galactic or open clusters；1.1.7 Globular clusters | 红化、邻近星、疏散/球状星团图的位置比较 | Ref 第3章 3.6.2「色指数和热改正」；第13章 13.3.2「球状星团和银河（疏散）星团」、13.3.4「颜色-星等图」 | Ref 第13章更接近星团图和演化检验；星际红化的定量改正、不同图形和样本边界仍需逐课核查。 | 候选对应 |
| 1.2 Stellar luminosities；1.3 Effective temperatures of stars | 光度、有效温度及黑体近似 | Ref 第3章 3.2.2「流量、光度和平方反比定律」、3.4「黑体辐射」、3.4.1「颜色与温度的联系」、3.4.2「斯特藩-玻尔兹曼公式」 | Ref 给出由流量、温度到光度的基础链条；旧书如何把这些量放入结构模型，需结合 Volume3 正文和附录核对。 | 候选对应 |
| 1.4 Stellar masses；1.5 The mass-luminosity relation | 双星质量和经验质量-光度关系 | Ref 第7章 7.2「利用目视双星确定质量」、7.3.2「质量函数与质量-光度关系」；第10章 10.6.2「主序恒星参数随质量的变化」 | Ref 第7章是观测质量和经验关系，第10章是理论主序关系；两者的样本、拟合和物理假设不应混并。 | 候选对应 |
| 1.6 Spectral classification；1.7 The chemical composition of stars | 光谱型、光度分类和由谱线推断成分 | Ref 第8章 8.1.1「恒星的光谱型」、8.1.3「玻尔兹曼公式」、8.1.4「萨哈公式」、8.1.5「结合玻尔兹曼公式和萨哈公式」、8.2.2「摩根-基南 (Morgan-Keenan) 光度分类」 | Ref 覆盖分类和 LTE 下的激发/电离基础；丰度测量、模型大气和谱线选择仍需转到 Ref 第9章核查。 | 候选对应 |

## 第 2 章 Hydrostatic equilibrium

旧书入口：[catalog.md#volume3-ch02](catalog.md#volume3-ch02)。Ref 候选入口：[catalog.md#ref-ch02](catalog.md#ref-ch02)、[catalog.md#ref-ch10](catalog.md#ref-ch10)。

| 旧书范围 | 主题 | Ref 候选范围（具体章/节号和标题） | 理由/覆盖边界 | 状态 |
|---|---|---|---|---|
| 2.1 The hydrostatic equilibrium equation | 恒星内部流体静力学平衡 | Ref 第10章 10.1「流体静力学平衡」、10.1.1「确定恒星的内部结构」、10.1.2「流体静力学平衡公式的推导」 | 章节主题和推导入口直接相同；几何、质量坐标和忽略项仍须逐式核对。 | 候选对应 |
| 2.2 Consequences of hydrostatic equilibrium | 平衡方程对压强、密度和结构的后果 | Ref 第10章 10.1.1「确定恒星的内部结构」、10.1.3「质量守恒公式」 | Ref 将结构确定与质量守恒分节讨论；旧书的定性后果可能还使用状态方程和边界条件，不能只按标题判定完全覆盖。 | 候选对应 |
| 2.3 Relation between thermal and gravitational energy: the virial theorem；2.3.1 Thermal energy；2.3.2 Gravitational energy | 热能、引力能与位力定理 | Ref 第2章 2.4「位力定理」；第10章 10.3.1「引力和开尔文-亥姆霍兹 (Kelvin-Helmholtz) 时标」 | Ref 第2章提供一般力学背景，第10章连接恒星能源；两书边界条件、符号和能量项需核对。 | 候选对应 |
| 2.4 Consequences of the virial theorem | 位力定理对恒星温度、收缩和能量的后果 | Ref 第10章 10.3.1「引力和开尔文-亥姆霍兹 (Kelvin-Helmholtz) 时标」 | Ref 有引力时标和热时标入口；旧书具体比例、收缩阶段和假设尚未逐课核实。 | 候选对应 |

## 第 3 章 Thermal equilibrium

旧书入口：[catalog.md#volume3-ch03](catalog.md#volume3-ch03)。Ref 候选入口：[catalog.md#ref-ch09](catalog.md#ref-ch09)、[catalog.md#ref-ch10](catalog.md#ref-ch10)。

| 旧书范围 | 主题 | Ref 候选范围（具体章/节号和标题） | 理由/覆盖边界 | 状态 |
|---|---|---|---|---|
| 3.1 Definition and consequences of thermal equilibrium | 热平衡和能量流守恒 | Ref 第10章 10.4「能量传输和热力学」、10.4.1「三种能量传输机制」 | Ref 给出能量传输总览；旧书对恒热平衡、局部条件和结构后果的处理可能更专门。 | 候选对应 |
| 3.2 Radiative energy transport and temperature gradient | 辐射输运和辐射温度梯度 | Ref 第10章 10.4.1「三种能量传输机制」、10.4.2「辐射温度梯度」；第9章 9.3「辐射转移」、9.4「转移方程」 | Ref 第10章更接近恒星内部梯度，第9章更接近大气辐射转移；不能把两个层次当作同一公式的完整替代。 | 候选对应 |
| 3.3 A first approximation for the mass-luminosity relation | 辐射平衡下质量-光度关系的一阶近似 | Ref 第10章 10.6.2「主序恒星参数随质量的变化」 | Ref 讨论主序参数随质量变化；旧书的一阶幂律、均匀成分和不透明度假设需逐式核对。 | 候选对应 |
| 3.4 Energy transport by heat conduction | 热传导能量输运 | Ref 第10章 10.4.1「三种能量传输机制」 | Ref 标出传输机制，但本轮未确认有旧书同等详细的热传导系数推导；只作为背景候选。 | 候选对应 |

## 第 4 章 The opacities

旧书入口：[catalog.md#volume3-ch04](catalog.md#volume3-ch04)。Ref 候选入口：[catalog.md#ref-ch09](catalog.md#ref-ch09)。

| 旧书范围 | 主题 | Ref 候选范围（具体章/节号和标题） | 理由/覆盖边界 | 状态 |
|---|---|---|---|---|
| 4.1 Bound-free and free-free absorption coefficients；4.1.1 The bound-free absorption coefficients | 束缚-自由和自由-自由连续吸收 | Ref 第9章 9.2「恒星不透明度」、9.2.4「不透明度的来源」、9.2.5「连续不透明度和 H−」 | Ref 明确提供不透明度来源和连续不透明度入口；旧书吸收系数公式、离子种类及近似精度仍需查拆分 PDF。 | 候选对应 |
| 4.2 Electron scattering | 电子散射不透明度 | Ref 第9章 9.2.4「不透明度的来源」；9.1.4「辐射压强」 | Ref 可作为散射来源和辐射压背景；数值系数、成分依赖和高温条件尚未核实。 | 候选对应 |
| 4.3 The line absorption coefficients | 谱线吸收系数及线不透明度 | Ref 第9章 9.2.4「不透明度的来源」、9.5「谱线轮廓」、9.5.1「等值宽度」、9.5.4「生长曲线」 | Ref 从不透明度来源连接到谱线观测量；旧书线吸收系数的模型和线列表不一定相同。历史不透明度数据的质量与适用范围待查，不能据标题宣布旧处理过时。 | 候选对应 |

## 第 5 章 Convective instability

旧书入口：[catalog.md#volume3-ch05](catalog.md#volume3-ch05)。Ref 候选入口：[catalog.md#ref-ch10](catalog.md#ref-ch10)。

| 旧书范围 | 主题 | Ref 候选范围（具体章/节号和标题） | 理由/覆盖边界 | 状态 |
|---|---|---|---|---|
| 5.1 General discussion；5.2 The Schwarzschild criterion for convective instability | 对流、浮力和 Schwarzschild 判据 | Ref 第10章 10.4.8「绝热温度梯度」、10.4.9「恒星对流的判据」 | Ref 标题直接对应绝热梯度和对流判据；旧书以气泡/周围介质推导的符号和稳定性约定需核对。 | 候选对应 |
| 5.3 The adiabatic temperature gradient | 绝热温度梯度、比热和状态方程 | Ref 第10章 10.2「状态方程」、10.4.5「比热」、10.4.6「绝热气体定律」、10.4.8「绝热温度梯度」 | Ref 有相关基础分节；电离区、辐射压和非理想状态对梯度的影响尚未逐课核查。 | 候选对应 |
| 5.4 Reasons for convective instabilities；5.4.1 Convective instability due to a steep increase in the absorption coefficient | 不透明度、辐射梯度导致的失稳 | Ref 第10章 10.4.2「辐射温度梯度」、10.4.9「恒星对流的判据」；第9章 9.2.4「不透明度的来源」 | 可把辐射梯度和不透明度接起来；旧书关于不透明度深度依赖的历史参数化仍需核实。 | 候选对应 |
| 5.4.2 Convective instability due to large energy flux F；5.4.3 Convective instability due to small values of the adiabatic gradient；5.4.4 Convective instability due to molecular dissociation；5.4.5 Summary | 大能流、小绝热梯度、电离/分子解离和总结 | Ref 第10章 10.4.5「比热」、10.4.8「绝热温度梯度」、10.4.9「恒星对流的判据」 | Ref 提供物理入口但未在本轮确认逐一复现旧书原因分类；对流判据和参数化的历史质量待核查，不作“已经解决/过时”判断。 | 候选对应 |

## 第 6 章 Theory of convective energy transport

旧书入口：[catalog.md#volume3-ch06](catalog.md#volume3-ch06)。Ref 候选入口：[catalog.md#ref-ch10](catalog.md#ref-ch10)。

| 旧书范围 | 主题 | Ref 候选范围（具体章/节号和标题） | 理由/覆盖边界 | 状态 |
|---|---|---|---|---|
| 6.1 Basic equations for convective energy transport | 对流通量和总能流 | Ref 第10章 10.4.1「三种能量传输机制」、10.4.9「恒星对流的判据」 | Ref 给出三种输运及判据背景；旧书上升/下降气柱的通量方程需逐式核查。 | 候选对应 |
| 6.2 Mixing length theory of convective energy transport；6.3 Choice of characteristic travel length l；6.3.1 The pressure scale height；6.3.2 Relation between pressure scale height and characteristic length l | 混合长度、特征路程和压强标高 | Ref 第10章 10.4.3「压强标高」、10.4.10「超绝热对流的混合长度理论」 | Ref 直接讨论混合长度及自由参数；其正文也指出理论不完备和时间依赖问题，因此只作为主题对应，参数值和适用范围待核查。 | 候选对应 |
| 6.4 Energy exchange between rising or falling gas and surroundings | 对流元与环境的热交换 | Ref 第10章 10.4.10「超绝热对流的混合长度理论」 | Ref 有气泡热交换的唯象处理；旧书交换效率参数、边界行为和符号约定需精核。 | 候选对应 |
| 6.5 Temperature gradient with convection；6.6 Temperature stratification with convection in stellar interiors | 对流温度梯度与内部分层 | Ref 第10章 10.4.8「绝热温度梯度」、10.4.9「恒星对流的判据」、10.4.10「超绝热对流的混合长度理论」 | Ref 覆盖判据到超绝热混合长度的链条；旧书具体极限和分层图表尚未核实。 | 候选对应 |
| 6.7 Convective overshoot | 对流区边界外的超调/额外混合 | Ref 第10章 10.4.10「超绝热对流的混合长度理论」（仅一般背景） | 本轮未找到 Ref 中专门的 overshoot 小节；旧书本身也把超调距离和计算可用性作为问题，不能用模型记忆补足。 | 暂未找到 |
| 6.8 Convective versus radiative energy transport | 对流与辐射输运的分工 | Ref 第10章 10.4.1「三种能量传输机制」、10.4.2「辐射温度梯度」、10.4.9「恒星对流的判据」 | Ref 可导航到机制比较和判据；具体能流比例、结构反馈和模型参数仍待查。 | 候选对应 |

## 第 7 章 Depths of the outer convection zones

旧书入口：[catalog.md#volume3-ch07](catalog.md#volume3-ch07)。Ref 候选入口：[catalog.md#ref-ch10](catalog.md#ref-ch10)、[catalog.md#ref-ch11](catalog.md#ref-ch11)、[catalog.md#ref-ch13](catalog.md#ref-ch13)、[catalog.md#ref-ch15](catalog.md#ref-ch15)。

| 旧书范围 | 主题 | Ref 候选范围（具体章/节号和标题） | 理由/覆盖边界 | 状态 |
|---|---|---|---|---|
| 7.1 General discussion | 外层对流区的形成和深度 | Ref 第10章 10.4.9「恒星对流的判据」、10.4.10「超绝热对流的混合长度理论」；第11章 11.1.2「太阳现今的内部结构」 | Ref 给出对流判据、参数化和太阳结构观测入口；旧书外层对流区的定义与深度测量需核实。 | 候选对应 |
| 7.2 Dependence of convection zone depths on Teff；7.3 Dependence of convection zone depths on chemical abundances | 温度、成分对外层对流区深度的影响 | Ref 第10章 10.6.2「主序恒星参数随质量的变化」；第11章 11.1.2「太阳现今的内部结构」；第13章 13.3.1「星族Ⅰ、Ⅱ和Ⅲ」 | Ref 能支持质量、成分和太阳内部的背景联系；不同温度和金属丰度下的深度曲线不应仅按标题视为已覆盖。 | 候选对应 |
| 7.4 The lithium problem | 对流深度、超调混合与锂耗竭 | Ref 第15章 15.3.8「宇宙中的化学丰度比」；第13章 13.2.2「亚巨星支」；第12章 12.3.11「金牛座 T 型星 (T Tauri 恒星)」 | Ref 第15章正文明确把太阳表面锂丰度与标准模型不一致称为太阳锂问题，并非给出本表可直接采用的解决结论；F 星、超调和额外混合的对应仍待核查。 | 候选对应 |

## 第 8 章 Energy generation in stars

旧书入口：[catalog.md#volume3-ch08](catalog.md#volume3-ch08)。Ref 候选入口：[catalog.md#ref-ch10](catalog.md#ref-ch10)、[catalog.md#ref-ch13](catalog.md#ref-ch13)。

| 旧书范围 | 主题 | Ref 候选范围（具体章/节号和标题） | 理由/覆盖边界 | 状态 |
|---|---|---|---|---|
| 8.1 Available energy sources；8.2 Nuclear energy sources | 引力、核能及能源时标 | Ref 第10章 10.3.1「引力和开尔文-亥姆霍兹 (Kelvin-Helmholtz) 时标」、10.3.2「核时标」 | Ref 按时标介绍引力和核能源；旧书能源预算与历史数值仍需逐式核对。 | 候选对应 |
| 8.3 The tunnel effect | 核反应中的量子隧穿 | Ref 第10章 10.3.3「量子力学隧穿效应」、10.3.4「核反应率和伽莫夫峰」 | 标题和物理主题直接对应；反应率近似、单位和指数因子需查正文。 | 候选对应 |
| 8.4 The proton-proton chain；8.5 The carbon-nitrogen cycle | pp 链和 CNO 循环 | Ref 第10章 10.3.10「质子-质子链」、10.3.11「CNO 循环」 | Ref 有专门同名小节；各分支比例、温度依赖和模型采用值仍待精核。 | 候选对应 |
| 8.6 The triple-alpha reaction；8.7 Element production in stars | 三重氦反应和恒星核合成 | Ref 第10章 10.3.9「恒星核合成与守恒定律」、10.3.12「氦燃烧的 3α 过程」、10.3.13「碳和氧燃烧」 | Ref 覆盖反应及元素产物；旧书元素生成叙述可能延伸到演化阶段，需和 Ref 第13、15章分开核查。 | 候选对应 |
| 8.8 Comparison of different energy generation mechanisms；8.9 Equilibrium abundances | 机制比较、平衡丰度和反应率尺度 | Ref 第10章 10.3.4「核反应率和伽莫夫峰」、10.3.7「用幂律表示核反应率」、10.3.14「每个核子的结合能」 | Ref 提供反应率和结合能工具；不同机制的旧图表、历史反应数据及丰度假设待查。 | 候选对应 |
| 8.10 Age determination for star clusters | 以星团演化确定年龄 | Ref 第13章 13.3.5「等年龄线和星团年龄」、13.3.4「颜色-星等图」 | Ref 直接覆盖等年龄线和图形方法；旧书所用模型网格和年龄尺度须逐图核实。 | 候选对应 |

## 第 9 章 Basic stellar structure equations

旧书入口：[catalog.md#volume3-ch09](catalog.md#volume3-ch09)。Ref 候选入口：[catalog.md#ref-ch10](catalog.md#ref-ch10)。

| 旧书范围 | 主题 | Ref 候选范围（具体章/节号和标题） | 理由/覆盖边界 | 状态 |
|---|---|---|---|---|
| 9.1 The temperature gradient | 恒星内部温度梯度 | Ref 第10章 10.4.2「辐射温度梯度」、10.4.8「绝热温度梯度」 | Ref 对应辐射和绝热两种梯度；旧书将梯度写入结构方程的变量选择需核对。 | 候选对应 |
| 9.2 The pressure gradient | 压强梯度和静力学平衡 | Ref 第10章 10.1「流体静力学平衡」、10.1.2「流体静力学平衡公式的推导」 | 直接同题；压力坐标、质量坐标和球对称假设仍需逐式核查。 | 候选对应 |
| 9.3 The boundary conditions | 中心和表面边界条件 | Ref 第10章 10.5.4「边界条件」 | 标题直接对应；旧书边界层的具体近似可能来自前面辐射输运章节。 | 候选对应 |
| 9.4 Dimensionless structure equations | 无量纲恒星结构方程 | Ref 第10章 10.5.1「恒星结构公式综述」、10.5.7「多方模型与莱恩-埃姆登 (Lane-Emden) 公式」 | Ref 提供结构方程总览和无量纲多方模型入口；变量规范化和方程组是否同形待核查。 | 候选对应 |

## 第 10 章 Homologous stars in radiative equilibrium

旧书入口：[catalog.md#volume3-ch10](catalog.md#volume3-ch10)。Ref 候选入口：[catalog.md#ref-ch10](catalog.md#ref-ch10)、[catalog.md#ref-ch12](catalog.md#ref-ch12)、[catalog.md#ref-ch13](catalog.md#ref-ch13)。

| 旧书范围 | 主题 | Ref 候选范围（具体章/节号和标题） | 理由/覆盖边界 | 状态 |
|---|---|---|---|---|
| 10.1 The dependence of stellar parameters on mass | 辐射平衡恒星的质量标度 | Ref 第10章 10.6.2「主序恒星参数随质量的变化」 | Ref 直接讨论主序参数和质量；旧书齐性关系的幂律推导和假设需精核。 | 候选对应 |
| 10.2 Dependence of stellar parameters on the mean atomic weight or evolution of mixed stars | 平均原子量、均匀成分和演化 | Ref 第10章 10.5.5「沃格特-罗素 (Vogt-Russell) 定理」；第13章 13.1.3「小质量主序星的演化」、13.1.6「大质量恒星的主序演化」 | Ref 连接成分、质量和演化；旧书“混合星”定义及适用条件仍需查看正文和图。 | 候选对应 |
| 10.3 Changes of main sequence position for decreasing heavy element abundances | 金属丰度改变时主序位置变化 | Ref 第13章 13.3.1「星族Ⅰ、Ⅱ和Ⅲ」；第10章 10.6.2「主序恒星参数随质量的变化」 | Ref 有星族和主序参数背景；旧书低丰度轨迹的具体变化及历史丰度标度待核查。 | 候选对应 |
| 10.4 Homologous contracting stars in radiative equilibrium；10.4.1 Teff-luminosity relations；10.4.2 Energy release in a contracting star | 辐射平衡收缩、有效温度-光度关系和收缩释能 | Ref 第10章 10.3.1「引力和开尔文-亥姆霍兹 (Kelvin-Helmholtz) 时标」；第12章 12.3.1「林忠四郎线」、12.3.2「主序前演化的经典计算」 | Ref 可连接收缩释能和主序前轨迹；旧书齐性收缩近似与林忠四郎线不应视为同一完整模型。 | 候选对应 |

## 第 11 章 Influence of convection zones on stellar structure

旧书入口：[catalog.md#volume3-ch11](catalog.md#volume3-ch11)。Ref 候选入口：[catalog.md#ref-ch10](catalog.md#ref-ch10)、[catalog.md#ref-ch12](catalog.md#ref-ch12)、[catalog.md#ref-ch13](catalog.md#ref-ch13)。

| 旧书范围 | 主题 | Ref 候选范围（具体章/节号和标题） | 理由/覆盖边界 | 状态 |
|---|---|---|---|---|
| 11.1 Changes in radius, luminosity and effective temperature | 对流区对半径、光度和有效温度的反馈 | Ref 第10章 10.4.9「恒星对流的判据」、10.4.10「超绝热对流的混合长度理论」；第13章 13.2.3「红巨星支」 | Ref 可支持对流与演化量的联系；旧书结构变化的定量轨迹和边界需核对。 | 候选对应 |
| 11.2 The Hayashi line；11.3 Physical interpretation of the Hayashi line | Hayashi 线及物理解释 | Ref 第12章 12.3.1「林忠四郎线」；第10章 10.4.10「超绝热对流的混合长度理论」 | Ref 第12章明确讨论林忠四郎线，且以深对流包层为背景；名称、历史叙述和可达边界仍需逐段核查。 | 候选对应 |
| 11.4 Stars on the cool side of the Hayashi line | Hayashi 线冷侧的恒星 | Ref 第12章 12.3.1「林忠四郎线」、12.3.2「主序前演化的经典计算」；第13章 13.2.3「红巨星支」 | Ref 覆盖主序前和红巨星支的相关轨迹；旧书冷侧稳定性/不可达性论证及适用质量范围待查。 | 候选对应 |

## 第 12 章 Calculation of stellar models

旧书入口：[catalog.md#volume3-ch12](catalog.md#volume3-ch12)。Ref 候选入口：[catalog.md#ref-ch10](catalog.md#ref-ch10)、[catalog.md#ref-ch13](catalog.md#ref-ch13)。

| 旧书范围 | 主题 | Ref 候选范围（具体章/节号和标题） | 理由/覆盖边界 | 状态 |
|---|---|---|---|---|
| 12.1 Schwarzschild's method；12.2 Henyey's method | 恒星模型的数值积分方法 | Ref 第10章 10.5.6「恒星结构公式的数值模拟」；该书附录 L「恒星结构的计算程序 StatStar」可作补充入口 | Ref 有数值模型总览和简化程序，但本轮未确认两种旧书算法逐项对应；算法、变量和收敛策略待查。 | 候选对应 |
| 12.2.1 The basic equations；12.2.2 The choice of variables | 模型方程和变量选择 | Ref 第10章 10.5.1「恒星结构公式综述」、10.5.3「本构关系」、10.5.6「恒星结构公式的数值模拟」 | Ref 给出方程、本构关系和数值实现背景；旧书变量的具体质量坐标/网格定义需精核。 | 候选对应 |
| 12.2.3 Replacing differentials with differences；12.2.4 Solution of the system of equations | 差分化与方程组求解 | Ref 第10章 10.5.6「恒星结构公式的数值模拟」 | Ref 是最接近的数值入口；未找到逐一对应的差分格式或求解器说明。 | 候选对应 |
| 12.3 Stellar evolution；12.3.1 Reason for stellar evolution；12.3.2 Changes in chemical abundances；12.3.3 Gravitational energy release；12.3.4 Evolution computations | 演化计算、成分变化和引力释能 | Ref 第10章 10.3.1「引力和开尔文-亥姆霍兹 (Kelvin-Helmholtz) 时标」、10.5.5「沃格特-罗素 (Vogt-Russell) 定理」、10.5.6「恒星结构公式的数值模拟」；第13章 13.1「主序星的演化」 | Ref 连接演化原因、结构唯一性和数值模型；旧书的程序流程和成分更新需逐课核查。 | 候选对应 |

## 第 13 章 Models for main sequence stars

旧书入口：[catalog.md#volume3-ch13](catalog.md#volume3-ch13)。Ref 候选入口：[catalog.md#ref-ch08](catalog.md#ref-ch08)、[catalog.md#ref-ch10](catalog.md#ref-ch10)、[catalog.md#ref-ch11](catalog.md#ref-ch11)、[catalog.md#ref-ch13](catalog.md#ref-ch13)。

| 旧书范围 | 主题 | Ref 候选范围（具体章/节号和标题） | 理由/覆盖边界 | 状态 |
|---|---|---|---|---|
| 13.1 Solar models | 太阳模型 | Ref 第11章 11.1「太阳内部」、11.1.1「太阳的演化史」、11.1.2「太阳现今的内部结构」 | Ref 直接提供太阳内部和演化背景；旧书太阳模型输入、校准和数值差异待核查。 | 候选对应 |
| 13.2 The solar neutrino problem | 太阳中微子问题 | Ref 第11章 11.1.3「太阳中微子问题：已经解决了的侦探故事」 | Ref 标题和正文提供历史对照入口；本表不据该标题独立宣布问题已解决，旧书结论、实验范围和时代差异待查。 | 候选对应 |
| 13.3 Hot star models | 热主序星模型 | Ref 第10章 10.6.2「主序恒星参数随质量的变化」；第13章 13.1.6「大质量恒星的主序演化」 | Ref 可覆盖质量依赖和大质量主序演化；旧书热星模型的内部结构、能量源和边界假设需精核。 | 候选对应 |
| 13.4 Semi-convection | 半对流 | Ref 第10章 10.4.9「恒星对流的判据」、10.4.10「超绝热对流的混合长度理论」（仅一般对流背景） | 本轮未找到 Ref 专门的 semi-convection 小节；相关对流背景不能替代半对流处理。 | 暂未找到 |
| 13.5 Structure of main sequence A stars | A 型主序星结构 | Ref 第10章 10.6.2「主序恒星参数随质量的变化」；第8章 8.2.2「摩根-基南 (Morgan-Keenan) 光度分类」 | Ref 分别提供内部质量标度和观测分类背景；A 星模型的对流核、辐射包层和具体成分待核查。 | 候选对应 |
| 13.6 The peculiar A stars | 特殊 A 星与成分异常 | Ref 第8章 8.1.1「恒星的光谱型」、8.1.4「萨哈公式」、8.2.2「摩根-基南 (Morgan-Keenan) 光度分类」 | Ref 主要覆盖光谱和分类；旧书涉及的扩散、磁场或内部结构没有在本轮确认专门对应。 | 候选对应 |

## 第 14 章 Evolution of low mass stars

旧书入口：[catalog.md#volume3-ch14](catalog.md#volume3-ch14)。Ref 候选入口：[catalog.md#ref-ch13](catalog.md#ref-ch13)、[catalog.md#ref-ch16](catalog.md#ref-ch16)。

| 旧书范围 | 主题 | Ref 候选范围（具体章/节号和标题） | 理由/覆盖边界 | 状态 |
|---|---|---|---|---|
| 14.1 Evolution along the subgiant branch；14.1.1 Solar mass stars；14.1.2 Stars with M ≥ M⊙ | 亚巨星支和低/中等质量分支 | Ref 第13章 13.2.1「脱离主序的演化」、13.2.2「亚巨星支」 | Ref 直接覆盖脱离主序和亚巨星支；旧书按质量划分的轨迹和时标待核对。 | 候选对应 |
| 14.2 Advanced stages of low mass stellar evolution；14.5 Onset of helium burning, the helium flash；14.5.1 Stars with solar metal abundances；14.5.2 Metal poor globular clusters | 红巨星后期、简并氦核和氦闪 | Ref 第13章 13.2.3「红巨星支」、13.2.4「红巨星顶端」、13.2.5「氦闪」、13.2.6「水平支」 | Ref 依次提供 RGB 顶端、氦闪和水平支；金属丰度与阈值、闪变细节和历史数字仍需查 PDF。 | 候选对应 |
| 14.3 Degeneracy；14.4 Equation of state for complete degeneracy | 简并物质和状态方程 | Ref 第16章 16.3「简并物质物理学」、16.3.1「泡利不相容原理与电子简并」、16.3.2「费米能」、16.3.3「简并的条件」、16.3.4「电子简并压」 | Ref 是直接候选；旧书完全简并近似与 Ref 的状态方程边界需逐式核对。 | 候选对应 |
| 14.6 Post core helium burning evolution | 核心氦燃烧后的演化、AGB 和质量损失 | Ref 第13章 13.2.7「早期渐近巨星支」、13.2.8「热脉冲渐近巨星支」、13.2.9「第三次挖掘和碳星」、13.2.10「s-过程核合成」、13.2.11「质量损失与 AGB 演化」、13.2.12「后渐近巨星支」 | Ref 章节覆盖链条较完整；旧书模型的质量边界、脉冲和挖掘深度待精核。 | 候选对应 |
| 14.7 Planetary nebulae | 行星状星云和低质量恒星终点 | Ref 第13章 13.2.13「行星状星云」；第16章 16.2「白矮星」 | Ref 可连接行星状星云到白矮星；形成机制和观测判据仍需逐课核实。 | 候选对应 |

## 第 15 章 Evolution of massive stars

旧书入口：[catalog.md#volume3-ch15](catalog.md#volume3-ch15)。Ref 候选入口：[catalog.md#ref-ch13](catalog.md#ref-ch13)、[catalog.md#ref-ch15](catalog.md#ref-ch15)。

| 旧书范围 | 主题 | Ref 候选范围（具体章/节号和标题） | 理由/覆盖边界 | 状态 |
|---|---|---|---|---|
| 15.1 Evolution along the giant branch；15.2 Blue loop excursions | 大质量星巨星支和蓝环 | Ref 第13章 13.2.3「红巨星支」、13.2.6「水平支」；第15章 15.1「大质量恒星的主序后演化」 | Ref 能提供巨星/主序后演化的邻近入口；未确认 Blue loop 专门小节，轨迹形状和质量范围待查。 | 候选对应 |
| 15.3 Dependence of evolution on interior mixing | 内部混合对演化的影响 | Ref 第13章 13.1.6「大质量恒星的主序演化」；第10章 10.4.9「恒星对流的判据」、10.4.10「超绝热对流的混合长度理论」 | Ref 讨论对流核和混合背景；大质量星混合、超调和质量损失的具体处理不应由标题替代。 | 候选对应 |
| 15.4 Evolution after helium core burning；15.6 Evolution of massive stars beyond the blue loops | 氦核燃烧后的演化及蓝环之后 | Ref 第13章 13.2.7「早期渐近巨星支」、13.2.8「热脉冲渐近巨星支」；第15章 15.1.3「大质量恒星的常规演化方案」 | Ref 有阶段性演化方案，但旧书的大质量星后氦燃烧路径未逐段对应；质量损失和旋转边界待查。 | 候选对应 |
| 15.5 The carbon flash | 碳闪 | Ref 第10章 10.3.13「碳和氧燃烧」；第15章 15.3「核坍缩超新星」 | Ref 有碳/氧燃烧和坍缩超新星背景，但本轮未确认专门的 carbon flash 小节，不能视为完整覆盖。 | 候选对应 |
| 15.7 Type II supernovae | II 型超新星 | Ref 第15章 15.2「超新星的分类」、15.3「核坍缩超新星」、15.3.1「核球坍缩超新星机制」、15.3.2「核球坍缩超新星的恒星残骸」 | Ref 有直接章节和机制/残骸分节；旧书前身质量、爆发机制及类型划分仍需逐图逐式核查。 | 候选对应 |

## 第 16 章 Late stages of stellar evolution

旧书入口：[catalog.md#volume3-ch16](catalog.md#volume3-ch16)。Ref 候选入口：[catalog.md#ref-ch15](catalog.md#ref-ch15)、[catalog.md#ref-ch16](catalog.md#ref-ch16)。

| 旧书范围 | 主题 | Ref 候选范围（具体章/节号和标题） | 理由/覆盖边界 | 状态 |
|---|---|---|---|---|
| 16.1 Completely degenerate stars, white dwarfs | 完全简并星和白矮星 | Ref 第16章 16.2「白矮星」、16.3「简并物质物理学」、16.4「钱德拉塞卡极限」、16.5「白矮星的冷却」 | Ref 覆盖白矮星物理、极限和冷却；旧书的完全简并近似与观测联系待核对。 | 候选对应 |
| 16.2 Neutron stars | 中子星、简并和结构 | Ref 第16章 16.6「中子星」、16.6.1「中子简并」、16.6.2「中子星的密度」、16.6.3「物态公式」、16.6.4「中子星模型」 | Ref 直接对应；旧书中子物态、质量上限和模型假设需逐式核查。 | 候选对应 |

## 第 17 章 Observational tests of stellar evolution theory

旧书入口：[catalog.md#volume3-ch17](catalog.md#volume3-ch17)。Ref 候选入口：[catalog.md#ref-ch13](catalog.md#ref-ch13)、[catalog.md#ref-ch15](catalog.md#ref-ch15)、[catalog.md#ref-ch16](catalog.md#ref-ch16)、[catalog.md#ref-ch17](catalog.md#ref-ch17)。

| 旧书范围 | 主题 | Ref 候选范围（具体章/节号和标题） | 理由/覆盖边界 | 状态 |
|---|---|---|---|---|
| 17.1 Color magnitude diagrams for globular clusters | 球状星团颜色-星等图检验 | Ref 第13章 13.3.2「球状星团和银河（疏散）星团」、13.3.4「颜色-星等图」、13.3.5「等年龄线和星团年龄」 | Ref 直接覆盖图形、星团和年龄；旧书用图检验模型的具体样本和参数待查。 | 候选对应 |
| 17.2 Color magnitude diagrams of young clusters | 年轻星团图和年轻恒星演化 | Ref 第13章 13.3.4「颜色-星等图」、13.3.5「等年龄线和星团年龄」；第12章 12.3.6「零龄主序 (ZAMS)」 | Ref 可连接 ZAMS、图形和年龄；旧书的年轻星团边界、距离和模型网格需精核。 | 候选对应 |
| 17.3 Observed masses of white dwarfs | 白矮星质量的观测检验 | Ref 第16章 16.2「白矮星」、16.4「钱德拉塞卡极限」；第7章 7.2「利用目视双星确定质量」、7.3「食分光双星」 | Ref 同时提供白矮星理论和双星测质量方法；具体观测样本和误差模型尚未逐课对应。 | 候选对应 |
| 17.4 Supernovae, neutron stars and black holes；17.4.1 Supernovae and neutron stars；17.4.2 Black holes | 超新星、致密残骸和黑洞观测检验 | Ref 第15章 15.3「核坍缩超新星」、15.3.2「核球坍缩超新星的恒星残骸」；第16章 16.6「中子星」；第17章 17.3「黑洞」、17.3.7「恒星质量黑洞候选体」 | Ref 分章覆盖三类对象；旧书把它们作为演化理论检验的组合论证，残骸判据、候选体和历史观测仍需精核。 | 候选对应 |

## 第 18 章 Pulsating stars

旧书入口：[catalog.md#volume3-ch18](catalog.md#volume3-ch18)。Ref 候选入口：[catalog.md#ref-ch14](catalog.md#ref-ch14)。

| 旧书范围 | 主题 | Ref 候选范围（具体章/节号和标题） | 理由/覆盖边界 | 状态 |
|---|---|---|---|---|
| 18.1 Period-density relation；18.2 Evolutionary state of Cepheids | 周期-密度关系和造父变星演化位置 | Ref 第14章 14.1「脉动恒星的观测」、14.1.1「周期-光度关系」、14.2.1「周期-密度关系」、14.1.3「不稳定带」 | Ref 直接覆盖观测关系和周期-密度；旧书演化位置、质量和轨迹的联系仍待核对。 | 候选对应 |
| 18.3 Analysis of pendulum oscillations；18.4 Adiabatic pulsations | 简谐/摆振类比和绝热脉动 | Ref 第14章 14.2.2「径向脉动的模式」、14.3.2「流体动力学公式的线性化」；14.4「恒星非径向脉动」 | Ref 有径向模式、线性化和非径向背景；旧书类比推导与符号约定需逐式核查。 | 候选对应 |
| 18.5 Excitation of pulsations by the κ mechanism；18.6 Excitation by nuclear energy generation? | κ 机制和核能激发 | Ref 第14章 14.2.4「核 ε-机制」、14.2.5「爱丁顿阀门」、14.2.6「不透明度效应以及 κ 和 γ 机制」、14.2.7「氢和氦部分电离区」、14.2.8「β Cephei 恒星和铁不透明度“鼓包”」 | Ref 有详细机制入口；旧书驱动条件、相位和模型假设仍需精核。 | 候选对应 |
| 18.7 Limits of pulsation amplitudes；18.8 The edges of the instability strip；18.8.1 The blue edge；18.8.2 The red edge | 振幅限制和不稳定带边缘 | Ref 第14章 14.1.3「不稳定带」、14.3.3「非线性和非绝热计算」、14.3.4「动力学稳定性」 | Ref 连接观测带宽与非线性稳定性；红边缘涉及对流耦合，不能凭标题认定模型已解决。 | 候选对应 |

## 第 19 章 The Cepheid mass problem

旧书入口：[catalog.md#volume3-ch19](catalog.md#volume3-ch19)。Ref 候选入口：[catalog.md#ref-ch07](catalog.md#ref-ch07)、[catalog.md#ref-ch13](catalog.md#ref-ch13)、[catalog.md#ref-ch14](catalog.md#ref-ch14)。

| 旧书范围 | 主题 | Ref 候选范围（具体章/节号和标题） | 理由/覆盖边界 | 状态 |
|---|---|---|---|---|
| 19.1 Importance of Cepheid mass determinations；19.2 The period-luminosity relation | 造父变星质量重要性和周光关系 | Ref 第14章 14.1.1「周期-光度关系」、14.1.4「脉动恒星的类型」 | Ref 覆盖周光关系和造父变星类别；质量问题的历史争议、校准和误差需另查旧书正文。 | 候选对应 |
| 19.3 Evolutionary masses | 演化质量 | Ref 第13章 13.1「主序星的演化」、13.2「恒星演化的晚期阶段」 | Ref 可作演化轨迹和质量定义的背景；本轮未确认 Cepheid 专门质量比较。 | 候选对应 |
| 19.4 Pulsational masses | 脉动质量和周期-密度模型 | Ref 第14章 14.2.1「周期-密度关系」、14.3.2「流体动力学公式的线性化」、14.3.4「动力学稳定性」 | Ref 有脉动模型工具；质量反演的具体公式和模型误差待精核。 | 候选对应 |
| 19.5 Baade-Wesselink masses | Baade-Wesselink 质量 | — | 本轮浏览 Ref 第7、13、14章目录及相关正文，未找到专门的 Baade-Wesselink 质量小节；Ref 的周光关系和脉动模型只能作为背景。 | 暂未找到 |
| 19.6 Bump masses and beat masses；19.6.1 Bump masses；19.6.2 Beat masses | 隆起质量和拍频质量 | Ref 第14章 14.1「脉动恒星的观测」、14.2「恒星脉动物理学」（仅一般脉动背景） | 本轮未找到 Ref 专门的 bump/beat 质量小节；具体质量差异和历史争议待逐课核查。 | 暂未找到 |
| 19.7 Dynamical masses | 动力学质量 | Ref 第7章 7.2「利用目视双星确定质量」、7.3「食分光双星」、7.3.2「质量函数与质量-光度关系」、7.3.3「利用食来确定半径和温度比」 | Ref 直接提供双星动力学测质量方法；Cepheid 特定系统和质量比较仍需查旧书图表。 | 候选对应 |

## 第 20 章 Star formation

旧书入口：[catalog.md#volume3-ch20](catalog.md#volume3-ch20)。Ref 候选入口：[catalog.md#ref-ch12](catalog.md#ref-ch12)。

| 旧书范围 | 主题 | Ref 候选范围（具体章/节号和标题） | 理由/覆盖边界 | 状态 |
|---|---|---|---|---|
| 20.1 Introduction | 恒星形成与演化循环的引入 | Ref 第12章 12.1「星际尘埃和气体」、12.2「原恒星的形成」、12.3「主序前演化」 | Ref 以 ISM、原恒星和主序前演化组织材料；旧书引入的结构演化回顾需逐段核对。 | 候选对应 |
| 20.2 Jeans' criterion for gravitational instability | Jeans 引力失稳判据 | Ref 第12章 12.2.1「金斯判据」 | 标题直接对应；公式假设、几何和单位仍需逐式核查。 | 候选对应 |
| 20.3 Adiabatic contraction or expansion of a homogeneous cloud；20.4 Non-adiabatic expansion and contraction of optically thin clouds；20.4.1 Evolution of expanding clouds；20.4.2 Evolution of contracting clouds | 云的绝热/非绝热膨胀收缩和光学薄阶段 | Ref 第12章 12.2.2「相似坍缩」、12.2.4「原恒星形成的其他物理过程」 | Ref 有坍缩和过程背景；旧书均匀云、冷却和轨迹近似未逐项确认。 | 候选对应 |
| 20.5 Optically thick clouds and protostars；20.6 Fragmentation；20.7 Fragmentation limits | 光学厚原恒星、碎裂及质量界限 | Ref 第12章 12.2.2「相似坍缩」、12.2.3「坍缩云的碎裂」、12.3.3「褐矮星的形成」 | Ref 直接覆盖碎裂和褐矮星形成；旧书质量限值、热力学转折和模型历史待核查。 | 候选对应 |
| 20.8 Influence of magnetic fields | 磁场对坍缩和碎裂的影响 | Ref 第12章 12.2.4「原恒星形成的其他物理过程」、12.2.5「双极扩散」 | Ref 提供磁场/双极扩散入口；旧书磁支持和具体近似未确认同等覆盖。 | 候选对应 |
| 20.9 Position of protostars in the color magnitude diagram, Hayashi theory | 原恒星在颜色-星等图的位置和 Hayashi 理论 | Ref 第12章 12.3.1「林忠四郎线」、12.3.2「主序前演化的经典计算」 | Ref 直接讨论主序前轨迹和林忠四郎线；旧书图形、出生线和对流边界需查正文。 | 候选对应 |
| 20.10 The initial mass function；20.11 Inhomogeneous collapse of protostars | 初始质量函数和非均匀坍缩 | Ref 第12章 12.3.7「初始质量函数 (IMF)」、12.2.2「相似坍缩」、12.2.3「坍缩云的碎裂」 | Ref 有 IMF 和坍缩/碎裂分节；旧书 IMF 预测与非均匀模型的关系待核查。 | 候选对应 |
| 20.12 Conclusion | 恒星形成问题和开放问题总结 | Ref 第12章 12.1「星际尘埃和气体」、12.2「原恒星的形成」、12.3「主序前演化」 | Ref 章节范围可作总览索引；两书对未解决问题的年代和证据边界不能直接互换。 | 候选对应 |

## 跨卷联系与缺口

- Volume3 第1章承接 Volume1 的观测量、光谱分类和星团图；在 Ref 中分别落在第3、7、8、9章。进入 Volume3 第2–13章后，观测量转为恒星内部结构、能源和模型，主要落在 Ref 第9–13章。
- Volume3 第4–7章是“不透明度—辐射梯度—对流—混合长度—外层对流区”的连续链条。Ref 第9、10、11、13、15章有分散入口，但本轮未把它们合并成完整对应；混合长度自由参数、超调距离、半对流和额外混合都保留待核查。
- Volume3 第8–13章把核反应、结构方程、数值模型和主序模型连在一起；Ref 第10章的结构方程和附录 L 的简化程序可作入口，第11、13章用于太阳和演化检验。不同年代的核反应率、不透明度、成分和模型校准需逐式逐图比较。
- Volume3 第14–17章与 Ref 第13、15、16、17章有较强主题重叠，覆盖低质量/大质量演化、白矮星、中子星、超新星和黑洞；质量阈值、质量损失、旋转、残骸判据和观测历史仍不是本粗表可以定论的内容。
- Volume3 第18章与 Ref 第14章的脉动章节基本同主题；第19章只在周光关系、一般脉动模型和双星动力学质量上找到邻近入口，Baade-Wesselink、bump/beat 质量未找到专门 Ref 小节。
- Volume3 第20章与 Ref 第12章直接相连，但 Ref 更强调 ISM 的观测和化学，Volume3 更集中在云坍缩、能量方程和早期模型；应在精核时分开记录这两个覆盖面。
- 需要优先精核的缺口包括：第6章 6.7「Convective overshoot」、第7章 7.4 的 F 星锂耗竭与超调、第13章 13.2 太阳中微子问题、第13章 13.4「Semi-convection」、第15章 15.5「The carbon flash」、第19章 19.5 和 19.6。以上均只表示本轮 Ref 专门小节未找到或覆盖不完整，不表示相关科学问题已经解决或过时。

## 20 章覆盖与状态统计

| 统计层级 | 候选对应 | 已核实 | 暂未找到 | 说明 |
|---|---:|---:|---:|---|
| 章节层级 | 20 | 0 | 0 | 20 个章节均至少有一个 Ref 候选入口；本轮是粗调研，未把任何章节升级为已核实。 |
| 行级开放缺口 | — | — | 4 | 具体见第6章 6.7、第13章 13.4、第19章 19.5 和 19.6；其他表行仍可能存在部分覆盖边界，须逐课精核。 |
