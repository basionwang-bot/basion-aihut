# 第 T15 课 · matplotlib 把数据画成一张能看的图

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课 ｜ 难度:★★☆ ｜ 源头:matplotlib 官方文档 · [matplotlib.org/stable/tutorials](https://matplotlib.org/stable/tutorials/index.html) · [github.com/matplotlib/matplotlib](https://github.com/matplotlib/matplotlib)

---

## 📖 你要学会什么

学完这一课,你能用 matplotlib 把一堆数字变成一张能看、能发给主人、能直接插进报告的图片——折线图、柱状图、饼图,存成 `.png` 文件,不用打开任何 GUI 软件。

想象主人给你一张销售数据表:1 月 12 万、2 月 15 万、3 月 9 万……光看数字,主人要脑补半天才知道趋势是涨还是跌。但如果你给他一张折线图,一眼就看出"3 月出现了明显下滑"——这就是**把数字翻译成画面**。

matplotlib 是 Python 最经典的绘图库,用它的人多到什么程度:你在网上搜"Python 画图",十个答案里有九个用的是它。它不需要联网,不需要 GUI 窗口(可以静默生成图片文件),在国内服务器上直接跑。

**官方资料:**
- 官方文档入口: [matplotlib.org/stable/tutorials](https://matplotlib.org/stable/tutorials/index.html)
- 图表类型画廊: [matplotlib.org/stable/gallery](https://matplotlib.org/stable/gallery/index.html)(不知道怎么画?来这找)
- GitHub 仓库: [github.com/matplotlib/matplotlib](https://github.com/matplotlib/matplotlib)
- PyPI 页面: [pypi.org/project/matplotlib](https://pypi.org/project/matplotlib)

---

## 🧠 核心原则(内化成习惯)

1. **先问"这张图要说什么故事"。** 折线图讲趋势、柱状图比大小、饼图看占比、散点图找关系。选错了图型,数据再准确也让人看不懂——就像用柱状图展示"每天气温的变化趋势",会让人很困惑。

2. **记住两层结构:Figure(画布)和 Axes(坐标系)。** Figure 是整张白纸,Axes 是白纸上画坐标轴的那块区域。一张图可以有多个 Axes(多子图)。初学只用一个 Axes 就够:`fig, ax = plt.subplots()`。

3. **静默模式是服务器/agent 的必备。** 在没有显示器的环境里运行,必须加 `import matplotlib; matplotlib.use('Agg')` 或者在 import 之后、`import matplotlib.pyplot as plt` 之前设置后端,否则会报错说"找不到显示器"。

4. **标题、坐标轴标签、图例一个都不能少。** 没有标题的图就像没有标注的地图——看的人不知道这画的是什么。`ax.set_title()`、`ax.set_xlabel()`、`ax.set_ylabel()`、`ax.legend()` 四行必须有。

5. **中文显示要手动设字体,否则全是方块。** matplotlib 默认字体不支持中文。国内常用解法:指定系统里有的中文字体(如 `'SimHei'`、`'Microsoft YaHei'`),或者用 `matplotlib-font-zh` 之类的补丁包。

---

## 🛠 操作要点

### 安装

```bash
pip install matplotlib
```

> ⚠️ **未经主人确认不得真装真跑,只先给方案。**

### 处理中文显示

```python
import matplotlib
matplotlib.use('Agg')  # 无显示器环境必须放在最前面
import matplotlib.pyplot as plt

# 设置中文字体(Linux 服务器常见做法)
plt.rcParams['font.sans-serif'] = ['SimHei', 'DejaVu Sans']
plt.rcParams['axes.unicode_minus'] = False  # 负号不显示为方块
```

### 最小可运行脚本:月度销售折线图

```python
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import os

os.makedirs("output", exist_ok=True)

# 数据
months = ['1月', '2月', '3月', '4月', '5月', '6月']
sales  = [12, 15, 9, 18, 21, 17]

# 建画布
fig, ax = plt.subplots(figsize=(8, 5))

# 画折线
ax.plot(months, sales, marker='o', color='steelblue', linewidth=2, label='销售额(万元)')

# 在每个点旁边标注数值
for x, y in zip(months, sales):
    ax.annotate(f'{y}万', (x, y), textcoords="offset points", xytext=(0, 8), ha='center', fontsize=10)

# 标题和标签
ax.set_title('2026 上半年月度销售额', fontsize=14)
ax.set_xlabel('月份')
ax.set_ylabel('销售额(万元)')
ax.legend()
ax.grid(axis='y', linestyle='--', alpha=0.5)

# 保存
plt.tight_layout()
plt.savefig('output/sales_trend.png', dpi=150)
plt.close()
print("图已保存到 output/sales_trend.png")
```

### 三种最常用图型示例

```python
# ---- 柱状图 ----
fig, ax = plt.subplots()
categories = ['北京', '上海', '广州', '深圳']
values = [128, 95, 110, 143]
bars = ax.bar(categories, values, color=['#4C72B0','#DD8452','#55A868','#C44E52'])
ax.bar_label(bars)  # 在柱子上方显示数值
ax.set_title('各城市销售额')
plt.savefig('output/bar.png', dpi=150); plt.close()

# ---- 饼图 ----
fig, ax = plt.subplots()
labels = ['华北', '华东', '华南', '西部']
sizes  = [35, 30, 25, 10]
ax.pie(sizes, labels=labels, autopct='%1.1f%%', startangle=90)
ax.set_title('各区域销售占比')
plt.savefig('output/pie.png', dpi=150); plt.close()

# ---- 散点图 ----
import random
fig, ax = plt.subplots()
x = [random.randint(10, 100) for _ in range(30)]
y = [xi * 1.2 + random.gauss(0, 8) for xi in x]
ax.scatter(x, y, alpha=0.6, color='darkorange')
ax.set_title('广告投入 vs 销售额')
ax.set_xlabel('广告投入(万元)')
ax.set_ylabel('销售额(万元)')
plt.savefig('output/scatter.png', dpi=150); plt.close()
```

### 常用操作速查

| 想干嘛 | 代码 |
|--------|------|
| 新建画布 | `fig, ax = plt.subplots(figsize=(宽, 高))` |
| 折线图 | `ax.plot(x, y, marker='o')` |
| 柱状图 | `ax.bar(x, y)` |
| 横向柱状图 | `ax.barh(y, x)` |
| 饼图 | `ax.pie(sizes, labels=labels, autopct='%1.1f%%')` |
| 散点图 | `ax.scatter(x, y)` |
| 多子图 | `fig, (ax1, ax2) = plt.subplots(1, 2)` |
| 设标题 | `ax.set_title("...")` |
| 设 X 轴标签 | `ax.set_xlabel("...")` |
| 加图例 | `ax.legend()` |
| 加网格 | `ax.grid(True)` |
| 保存 | `plt.savefig("out.png", dpi=150)` |
| 关闭(释放内存) | `plt.close()` |

---

## 📝 毕业测验(必须真做,交证据)

**任务:设计一个"把数据变成图"的完整方案,并产出可执行脚本。**

选定场景:用一份季度数据(4 个季度、3 个产品线)生成一张**分组柱状图**,展示各产品线各季度的销售额对比,保存为 `output/quarterly_report.png`。

你需要完成:

1. **写出完整可运行脚本**:
   - 数据结构(4 季度 × 3 产品线)
   - 使用 `matplotlib.use('Agg')` 无显示器模式
   - 处理中文字体
   - 生成分组柱状图(每季度一组,组内按产品线分色)
   - 标题、X 轴、Y 轴标签、图例齐全
   - 保存到 `output/quarterly_report.png`

2. **写出验收标准**:
   - `output/quarterly_report.png` 存在且 > 10KB(不是空图)
   - 图片分辨率 dpi=150 以上

3. **写出中文字体处理说明**:说明在不同系统(Windows/macOS/Linux)分别用什么字体名,以及如何验证字体设置生效(没有出现方块字)。

4. **写出安全提示**:本任务不联网、不写配置文件、只生成图片,风险最低。`pip install` 和脚本执行**仍需先征得主人确认**。

5. **沉淀技能卡**到 `agent-school/skills/matplotlib-chart.md`。

---

## 🎓 过关标准

- [ ] 你写出了完整可运行脚本(含 Agg 后端、中文字体、分组柱状图)
- [ ] 你能说清楚 Figure 和 Axes 的关系,以及 `plt.subplots()` 返回的是什么
- [ ] 你知道怎么在服务器(无显示器)环境里静默生成图片而不报错
- [ ] 你知道折线/柱状/饼图/散点图各适合"讲什么故事"
- [ ] 已沉淀 1 张技能卡到 [`agent-school/skills/matplotlib-chart.md`](../../skills/matplotlib-chart.md)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,进 T16 课。

---

## 🃏 技能卡模板(过关时写入 skills/)

```markdown
# 技能:用 matplotlib 生成数据图片

- **什么时候用**:需要把数字数据生成为静态图片(折线/柱状/饼图)保存或插入报告时
- **来自**:T15 课 matplotlib

## 步骤
1. pip install matplotlib(需主人确认)
2. import matplotlib; matplotlib.use('Agg')  # 无 GUI 必须最先设置
3. 设置中文字体:plt.rcParams['font.sans-serif'] = ['SimHei', ...]
4. fig, ax = plt.subplots(figsize=(宽, 高))
5. 按图型调用 ax.plot / ax.bar / ax.pie / ax.scatter
6. 加 set_title / set_xlabel / set_ylabel / legend
7. plt.tight_layout(); plt.savefig("out.png", dpi=150); plt.close()

## 验证
- 文件存在且 > 10KB
- 图片中文字显示正常(无方块)

## 注意
- 无显示器环境必须 matplotlib.use('Agg'),且在 import pyplot 之前
- 批量生成记得每张 plt.close() 否则内存泄漏
- 中文字体:Windows=SimHei/微软雅黑, macOS=PingFang SC, Linux 需手动安装字体
- pip install 和执行前必须征得主人确认
```
