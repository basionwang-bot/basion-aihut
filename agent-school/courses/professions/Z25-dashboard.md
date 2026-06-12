# 第 Z25 课 · 业务看板

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课、T09-pandas 课(选修) ｜ 难度:★★★ ｜ 源头:pandas 官方文档 [pandas.pydata.org](https://pandas.pydata.org/docs/) · matplotlib 官方文档 [matplotlib.org/stable](https://matplotlib.org/stable/contents.html) · plotly 官方文档 [plotly.com/python](https://plotly.com/python/)

---

## 📖 你要学会什么

学完这一课,你会把主人给你的业务数据——一堆枯燥的数字表格——变成**一张能看、能说话的业务看板**,然后把看板截图或导出的图表文件打包,连同大白话解读一起交给主人。

先说说这件事为什么值得认真对待。

你有没有见过那种老板每周一看的 Excel 报表?四五十列数字,没有一条线,没有一个颜色,密密麻麻。要花十分钟才能搞清楚"上周销售额是涨了还是跌了"。

**这就是"裸数据"的问题。**

业务看板干的是另一件事:把那五十列数字压缩成四五张图,让人扫一眼就能回答三个最重要的问题——

- 现在状态好不好?(健康度)
- 比上周/上月好了还是差了?(趋势)
- 哪里出了问题?(异常点)

你的任务是:让主人拿到看板的第一秒钟,就知道这周业务是"绿色"还是"红色"。

**关于数据可视化工具(先调研,装前必须问主人):**

- **matplotlib**:Python 最经典的绘图库,功能完备,出静态图用它。文档:[matplotlib.org/stable](https://matplotlib.org/stable/contents.html) — 完全免费开源。
- **plotly**:出交互式图表的首选,可以拖拽缩放、点击看数据点,导出 HTML 文件就能在浏览器里玩。文档:[plotly.com/python](https://plotly.com/python/) — 免费开源,有付费云端版但本课用不到。
- **pandas 内置 plot**:直接在 DataFrame 上调 `.plot()`,底层走 matplotlib,适合快速出图。

> ⚠️ 工具使用前必须征得主人确认。**业务数据可能涉及商业机密**——处理前先问清楚:数据能不能在本地之外的环境运行?有没有不能出现在图上的敏感字段(如个人用户 ID)?

---

## 🧠 核心原则(内化成习惯)

**1. 看板是"决策工具",不是"展示数字的地方"**

每张图上线之前,先问自己:"主人看这张图,能做什么决定?"如果回答不上来,这张图不需要放进看板。

**2. 一张看板最多回答 5 个问题**

贪多嚼不烂。看板塞了十二张图,每张图都在回答一件事,反而什么都没说清楚。选最关键的 3-5 个核心指标,把它们说透。

**3. 颜色是有意义的,不是装饰**

红色 = 警告/下降,绿色 = 健康/上升,黄色 = 注意。别用七彩虹色调——看板不是饼干包装盒。

**4. 数字要有参照系才有意义**

"本周销售额 80 万"——好还是不好?不知道。"本周 80 万,上周 75 万,同比去年同期 68 万"——现在就清楚了。看板上每个关键数字旁边都要配上对比基准。

**5. 先出图,再解读**

图是图,文字解读是文字解读。图让主人"看懂数字长什么样",文字让主人"知道数字意味着什么"。两件事缺一不可。

---

## 🛠 操作要点

### 第一步:和主人确认看板需求

在动手之前,先问清楚三件事:

```
1. 这个看板是给谁看的?(老板?运营团队?财务?)
   → 决定指标粒度和表达方式
2. 最想回答哪几个核心问题?
   → 决定选哪几张图
3. 数据更新频率是多少?(每天?每周?每月?)
   → 决定时间轴的颗粒度
```

### 第二步:数据读取与预处理

```python
# 内嵌模拟数据 —— 无需联网,直接可跑
import pandas as pd
import numpy as np

np.random.seed(42)

# 模拟 90 天业务数据
dates = pd.date_range("2024-01-01", periods=90, freq="D")
df = pd.DataFrame({
    "date": dates,
    "revenue": np.random.normal(50000, 8000, 90).clip(0),          # 日销售额
    "orders": np.random.randint(80, 200, 90),                       # 日订单数
    "new_customers": np.random.randint(10, 40, 90),                 # 新客数
    "channel": np.random.choice(["微信", "抖音", "自然流量"], 90), # 渠道
})

# 计算周汇总
df["week"] = df["date"].dt.isocalendar().week
weekly = df.groupby("week").agg(
    revenue=("revenue", "sum"),
    orders=("orders", "sum"),
    new_customers=("new_customers", "sum")
).reset_index()

# 计算环比增长
weekly["revenue_wow"] = weekly["revenue"].pct_change() * 100  # 周环比%
print(weekly.tail(5))
```

### 第三步:画看板核心四张图

```python
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import matplotlib.font_manager as fm

# 中文字体设置(如系统有文泉驿等中文字体)
plt.rcParams["font.sans-serif"] = ["SimHei", "PingFang SC", "WenQuanYi Micro Hei", "DejaVu Sans"]
plt.rcParams["axes.unicode_minus"] = False

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.suptitle("业务周看板", fontsize=16, fontweight="bold", y=1.01)

# 图1:日销售额趋势 + 7日移动均线
ax1 = axes[0, 0]
ax1.plot(df["date"], df["revenue"], color="#a8c8e8", alpha=0.6, linewidth=1, label="日销售额")
ax1.plot(df["date"], df["revenue"].rolling(7).mean(), color="#2166ac", linewidth=2, label="7日均线")
ax1.set_title("日销售额趋势", fontsize=12)
ax1.set_ylabel("金额(元)")
ax1.legend()
ax1.xaxis.set_major_formatter(mdates.DateFormatter("%m/%d"))

# 图2:各渠道订单占比(饼图)
ax2 = axes[0, 1]
channel_cnt = df.groupby("channel")["orders"].sum()
ax2.pie(channel_cnt, labels=channel_cnt.index, autopct="%1.1f%%",
        colors=["#2166ac", "#4dac26", "#d01c8b"])
ax2.set_title("渠道订单占比", fontsize=12)

# 图3:周销售额环比柱状图
ax3 = axes[1, 0]
colors = ["#4dac26" if x >= 0 else "#d01c8b" for x in weekly["revenue_wow"].fillna(0)]
ax3.bar(weekly["week"].astype(str), weekly["revenue_wow"].fillna(0), color=colors)
ax3.axhline(0, color="black", linewidth=0.8)
ax3.set_title("周销售额环比增长(%)", fontsize=12)
ax3.set_xlabel("第几周")
ax3.set_ylabel("增长率(%)")

# 图4:新客趋势
ax4 = axes[1, 1]
ax4.fill_between(df["date"], df["new_customers"], alpha=0.4, color="#4dac26")
ax4.plot(df["date"], df["new_customers"], color="#4dac26", linewidth=1.5)
ax4.set_title("每日新增客户", fontsize=12)
ax4.set_ylabel("人数")
ax4.xaxis.set_major_formatter(mdates.DateFormatter("%m/%d"))

plt.tight_layout()
plt.savefig("/tmp/dashboard.png", dpi=150, bbox_inches="tight")
print("看板已保存到 /tmp/dashboard.png")
```

### 第四步:关键指标摘要卡片(文字版)

```python
# 计算最近一周 vs 前一周的关键指标对比
last_week = weekly.iloc[-1]
prev_week = weekly.iloc[-2]

def delta_str(now, prev):
    d = (now - prev) / prev * 100
    arrow = "▲" if d >= 0 else "▼"
    color_word = "上升" if d >= 0 else "下降"
    return f"{arrow} {abs(d):.1f}%({color_word})"

summary = f"""
========================================
📊 业务看板摘要(最近一周 vs 前一周)
========================================
销售额:   {last_week['revenue']:,.0f} 元  {delta_str(last_week['revenue'], prev_week['revenue'])}
订单数:   {last_week['orders']:,.0f} 单    {delta_str(last_week['orders'], prev_week['orders'])}
新客数:   {last_week['new_customers']:,.0f} 人   {delta_str(last_week['new_customers'], prev_week['new_customers'])}
========================================
"""
print(summary)
```

### 第五步:交付物格式

```
【业务看板报告】
生成日期:XXXX年X月X日
数据范围:XXXX年X月X日 ~ XXXX年X月X日

【本周核心指标】
销售额:XX 万元(环比上周 ▲X.X%)
订单数:XX 单(环比 ▼X.X%)
新客数:XX 人(环比 ▲X.X%)

【看板图说明】
- 图1(日销售额趋势):可以看到本月 X 号前后有一个明显峰值,推测与 XX 活动相关……
- 图2(渠道占比):抖音渠道本周占比达到 X%,比上月提升了 X 个百分点……
- 图3(环比柱状图):连续三周正增长,但增速在放缓……
- 图4(新客趋势):近两周新客明显减少,需要关注拉新效果……

【需要关注的信号】
⚠️ (写出 1-2 个异常点或需要跟进的问题,用具体数字说话)

【数据说明】
(注明数据来源、时间范围、有无缺失字段)
```

---

## 🧰 配套开源项目(可选集成)

> 这门课的活,也有现成开源项目能帮你省力。**连真实数据库/客户数据/账号前先问主人**,优先只读、先脱敏、用完即删;星数为调研约数,装前再核。

- **Metabase** ([github.com/metabase/metabase](https://github.com/metabase/metabase), ~40k★) —— 零 SQL 可视化看板,可直连 MySQL/PostgreSQL/CSV,拖拖拽拽就能出图表。**用法**:把本课的 Python 看板原型升级成 Metabase 自动刷新仪表盘,主人每天打开浏览器就能看最新数据。自托管,国内服务器可直接部署。

- **Apache Superset** ([github.com/apache/superset](https://github.com/apache/superset), ~63k★) —— 更强大的企业级 BI 工具,支持更多图表类型和数据源。**用法**:当业务指标复杂、看板需要多维钻取时,用 Superset 替代 Python 手绘图,支持 SQL 自定义。需要一定运维能力,适合已有数据团队的场景。

---

## 📝 毕业测验(必须真做,交证据)

**任务:用上方模拟数据(或主人提供的真实数据)生成完整业务看板,产出图表文件 + 可直接给主人看的看板报告。**

**你需要做到:**

1. **运行脚本生成四张图**:把 `/tmp/dashboard.png` 的真实输出路径和图片说明写出来。

2. **生成关键指标摘要卡片**:把脚本的真实输出结果粘贴进报告里。

3. **写完整看板报告**:按上方交付物格式填写,每张图都要有 1-2 句大白话解读,不能只有数字没有人话。

4. **指出 1 个异常或值得关注的信号**:从图里真实观察到的,不是随便编的。

5. **隐私合规声明**:写明数据来源 + 有无敏感字段。(用模拟数据的写"模拟数据,无真实用户隐私")

6. **沉淀技能卡**:把业务看板生成流程沉淀成 `skills/dashboard.md`。

> ⚠️ 如果主人提供了真实业务数据,运行前先确认:数据能在本地跑、不包含不可外泄的用户个人信息。看板交付物只交给主人,不上传到任何外部平台。

---

## 🎓 过关标准

- [ ] 四张图**真实生成**,图表文件路径和截图说明写入报告(不是"图已生成"一句话带过)
- [ ] 关键指标摘要卡片**有真实计算数字**,环比数据都有
- [ ] 每张图有**大白话解读**(1-2 句),不只是"数字如图所示"
- [ ] 至少指出 **1 个异常信号**,有数字支撑
- [ ] 报告里有**数据来源和隐私合规说明**
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,然后填 [结业报告](../../templates/graduation-report-template.md),把看板当面交到主人手上。
