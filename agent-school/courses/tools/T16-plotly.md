# 第 T16 课 · plotly 做可交互的图表/看板

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课、T15(matplotlib 基础图表概念) ｜ 难度:★★☆ ｜ 源头:Plotly 官方文档 · [plotly.com/python](https://plotly.com/python/) · [github.com/plotly/plotly.py](https://github.com/plotly/plotly.py)

---

## 📖 你要学会什么

学完这一课,你能用 plotly 生成**可以鼠标悬停、点击、缩放**的交互图表,导出为一个独立 HTML 文件——主人直接在浏览器打开,鼠标一划就能看每个数据点的详细数值,不再需要对着静态图片盯着猜。

想象 matplotlib 画出来的图是一张**印好的地图**——漂亮,但你只能看;plotly 画出来的图是**Google 地图**——你可以放大、缩小、点一个位置看详情、框选某个区域。当主人要"自己探索数据"而不只是"看一个结论"时,plotly 就是那个更好的选择。

plotly.py 是 Plotly 公司开源的 Python 图表库,核心功能免费,生成的图基于 JavaScript(D3.js/WebGL),可导出为 HTML 文件——在国内浏览器里直接打开,不需要翻墙,不需要任何插件。

**官方资料:**
- 官方文档: [plotly.com/python](https://plotly.com/python/)
- 图表类型画廊: [plotly.com/python/basic-charts](https://plotly.com/python/basic-charts/)
- GitHub 仓库: [github.com/plotly/plotly.py](https://github.com/plotly/plotly.py)
- PyPI 页面: [pypi.org/project/plotly](https://pypi.org/project/plotly)
- Express 快速入门: [plotly.com/python/plotly-express](https://plotly.com/python/plotly-express/)

---

## 🧠 核心原则(内化成习惯)

1. **plotly.express(px)是新手最快的路。** plotly 有两套 API:底层的 `plotly.graph_objects(go)` 功能全但写法复杂;上层的 `plotly.express(px)` 一行出图。先用 px,需要更精细控制再换 go——**别一上来就去啃 graph_objects。**

2. **交互图保存为 HTML,静态图保存为 PNG/SVG。** `fig.write_html("out.html")` 是保留全部交互的最省事方式;`fig.write_image("out.png")` 需要额外装 `kaleido` 库。给主人看交互图用 HTML,插进 Word/PPT 再用图片。

3. **Dash 是 plotly 的看板框架,两者是兄弟关系但分开学。** 这门课只讲 plotly 画图本体;如果主人要"多图联动的数据看板",那是 Dash 的事(另一门课)。不要把这两个搞混。

4. **数据最好用 pandas DataFrame 喂给 px。** px 的设计就是围绕 DataFrame 的:一列当 X 轴、一列当 Y 轴、一列决定颜色——非常直觉。当然,用普通 Python 列表也能跑。

5. **中文没有 matplotlib 那个麻烦。** plotly 图表的文字显示在浏览器里,浏览器天然支持中文——你直接写中文字符串就行,不用折腾字体。

---

## 🛠 操作要点

### 安装

```bash
pip install plotly

# 如果需要导出为静态图片(PNG/SVG),额外安装:
pip install kaleido
```

> ⚠️ **未经主人确认不得真装真跑,只先给方案。**

### 最小可运行脚本:月度销售折线图(交互版)

```python
import plotly.express as px
import os

os.makedirs("output", exist_ok=True)

# 数据
data = {
    "月份": ["1月","2月","3月","4月","5月","6月"],
    "北京": [128, 134, 119, 145, 152, 141],
    "上海": [95,  102, 88,  110, 118, 107],
    "深圳": [143, 148, 135, 160, 171, 158],
}

# plotly express 一行出折线图
import pandas as pd
df = pd.DataFrame(data)
df_long = df.melt(id_vars="月份", var_name="城市", value_name="销售额(万元)")

fig = px.line(
    df_long,
    x="月份",
    y="销售额(万元)",
    color="城市",
    markers=True,
    title="2026 上半年各城市月度销售额",
    labels={"销售额(万元)": "销售额(万元)", "月份": "月份"},
)
fig.update_layout(hovermode="x unified")  # 悬停时显示同一 X 上所有城市

# 保存为交互 HTML
fig.write_html("output/sales_trend.html")
print("交互图已保存:output/sales_trend.html")

# 保存为静态图片(需要 kaleido)
# fig.write_image("output/sales_trend.png")
```

### 常见图型快速示例

```python
import plotly.express as px
import pandas as pd

# ---- 柱状图 ----
df = pd.DataFrame({
    "城市": ["北京","上海","广州","深圳"],
    "Q1销售": [128, 95, 110, 143],
    "Q2销售": [145, 110, 125, 160],
})
df_long = df.melt("城市", var_name="季度", value_name="销售额")
fig = px.bar(df_long, x="城市", y="销售额", color="季度", barmode="group", title="Q1 vs Q2 各城市销售")
fig.write_html("output/bar.html")

# ---- 饼图 ----
fig = px.pie(values=[35,30,25,10], names=["华北","华东","华南","西部"], title="区域销售占比")
fig.write_html("output/pie.html")

# ---- 散点图(带气泡大小) ----
df2 = pd.DataFrame({
    "广告投入": [10,20,35,50,70,90],
    "销售额": [18,30,48,65,88,112],
    "城市": ["北京","上海","广州","深圳","成都","杭州"],
    "团队规模": [5,8,12,15,10,7],
})
fig = px.scatter(df2, x="广告投入", y="销售额", size="团队规模", color="城市",
                 hover_name="城市", title="广告投入 vs 销售额")
fig.write_html("output/scatter.html")
```

### 常用操作速查

| 想干嘛 | 代码 |
|--------|------|
| 折线图 | `px.line(df, x=..., y=..., color=...)` |
| 柱状图 | `px.bar(df, x=..., y=..., barmode='group')` |
| 散点图 | `px.scatter(df, x=..., y=..., size=..., color=...)` |
| 饼图 | `px.pie(values=..., names=...)` |
| 热力图 | `px.imshow(matrix)` |
| 多子图 | `from plotly.subplots import make_subplots` |
| 修改标题 | `fig.update_layout(title="...")` |
| 悬停模式 | `fig.update_layout(hovermode="x unified")` |
| 保存 HTML | `fig.write_html("out.html")` |
| 保存图片 | `fig.write_image("out.png")` (需 kaleido) |
| 在 Jupyter 显示 | `fig.show()` |

### 多图组合成一个 HTML 看板

```python
from plotly.subplots import make_subplots
import plotly.graph_objects as go

fig = make_subplots(rows=1, cols=2, subplot_titles=("月度趋势", "城市对比"))

fig.add_trace(go.Scatter(x=["1月","2月","3月"], y=[12,15,9], name="趋势"), row=1, col=1)
fig.add_trace(go.Bar(x=["北京","上海","深圳"], y=[128,95,143], name="城市"), row=1, col=2)

fig.update_layout(title_text="销售看板 · 2026 上半年")
fig.write_html("output/dashboard.html")
print("看板已保存:output/dashboard.html")
```

---

## 📝 毕业测验(必须真做,交证据)

**任务:设计一个"多图联动数据看板"的完整方案,并产出可执行脚本。**

选定场景:用一份电商数据(至少 3 个品类 × 6 个月)生成一个单页 HTML 看板,包含:① 折线图(各品类月度趋势)、② 柱状图(各品类总销售额对比)。两张图放在同一个 HTML 文件里,保存为 `output/ecommerce_dashboard.html`。

你需要完成:

1. **写出完整可运行脚本**:
   - 数据结构(3 品类 × 6 月)
   - 用 `make_subplots` 把折线图和柱状图放同一个 figure
   - 标题、图例、悬停提示齐全
   - `fig.write_html("output/ecommerce_dashboard.html")`

2. **写出验收标准**:
   - `output/ecommerce_dashboard.html` 存在且 > 50KB
   - 用浏览器打开,能看到两张图
   - 鼠标悬停在折线图上能看到数值提示

3. **写出环境说明**:`pip install plotly pandas`(pandas 用于处理 DataFrame,可选但推荐)。

4. **写出 HTML vs PNG 导出的对比说明**:什么时候给 HTML,什么时候给静态图,各有什么优劣。

5. **写出安全提示**:本任务本地运行不联网,风险低。`pip install` 和脚本执行**仍需先征得主人确认**。

6. **沉淀技能卡**到 `agent-school/skills/plotly-dashboard.md`。

---

## 🎓 过关标准

- [ ] 你写出了完整可运行脚本(多图 + make_subplots + write_html)
- [ ] 你能说清楚 `px`(Express)和 `go`(graph_objects)各适合什么场景
- [ ] 你知道 `write_html` 和 `write_image` 的区别,以及什么时候用哪个
- [ ] 你能解释 plotly 图和 matplotlib 图在"中文处理"上为什么体验不同
- [ ] 已沉淀 1 张技能卡到 [`agent-school/skills/plotly-dashboard.md`](../../skills/plotly-dashboard.md)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,进 T17 课。

---

## 🃏 技能卡模板(过关时写入 skills/)

```markdown
# 技能:用 plotly 生成交互图表 / HTML 看板

- **什么时候用**:需要可交互图表(悬停看数值、缩放、多图联动)并以 HTML 交付时
- **来自**:T16 课 plotly

## 步骤
1. pip install plotly pandas(需主人确认)
2. 准备数据(DataFrame 或列表)
3. 简单图:px.line/bar/scatter/pie(...) → fig
4. 多图看板:make_subplots + fig.add_trace(go.Xxx, row, col)
5. fig.update_layout(title, hovermode...)
6. fig.write_html("out.html") 或 fig.write_image("out.png")(需 kaleido)

## 验证
- HTML 文件存在且 > 50KB
- 浏览器打开可见图表、可悬停交互

## 注意
- px 是快速入口,go 是精细控制,先用 px
- write_image 需要额外 pip install kaleido
- plotly 中文无需特殊字体配置(浏览器渲染)
- pip install 和执行前必须征得主人确认
```
