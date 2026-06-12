# 第 Z27 课 · 销售数据分析

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课、T09-pandas 课(选修)、Z26-data-cleaning 课(建议先修) ｜ 难度:★★☆ ｜ 源头:pandas 官方文档 [pandas.pydata.org](https://pandas.pydata.org/docs/) · matplotlib 官方文档 [matplotlib.org/stable](https://matplotlib.org/stable/contents.html)

---

## 📖 你要学会什么

学完这一课,你会把主人的销售流水数据变成一份**真正有用的月度销售分析报告**——里面有同比、有环比、有 TOP 品类/TOP 销售员排名,最后附上你的业务洞察。主人拿到这份报告,不需要再自己动手算任何东西。

先说一个场景,你就懂了。

每个月月初,老板都会问:"上个月卖得怎么样?"

公司里有个销售负责人,他打开 Excel,复制粘贴、手动求和、手动画折线图……折腾两个小时,最后交出去一张图,图上只写着"总销售额 85 万"——然后老板问:"比上个月怎么样?比去年同期呢?哪个产品卖得最好?哪个区域掉队了?"

销售负责人又开始找数……

**你要解决的正是这件事。** 一份好的销售月报,应该让老板一眼看完就能做三件事:
1. 判断这个月业绩是好是坏(靠同比/环比)
2. 知道哪里是亮点、哪里是隐患(靠 TOP 分析)
3. 拍板下一步怎么做(靠你的洞察建议)

**关于分析工具(先调研,装前必须问主人):**

- **pandas**:数据汇总、同比环比计算的主力。文档:[pandas.pydata.org](https://pandas.pydata.org/docs/) — 完全免费。
- **matplotlib**:销售趋势图、TOP 排名图用它画。文档:[matplotlib.org/stable](https://matplotlib.org/stable/contents.html) — 完全免费。

> ⚠️ 销售数据可能涉及商业机密(如客户名单、销售员业绩)。处理前先确认主人数据是否可在本地分析环境运行,不得将任何销售数据上传至外部平台。

---

## 🧠 核心原则(内化成习惯)

**1. 同比、环比是两把不同的尺子,不要混淆**

- **环比**:这个月 vs 上个月。反映**短期趋势**。"本月比上月涨了 5%"——是在好转还是在反弹?
- **同比**:这个月 vs 去年同一个月。过滤掉季节因素,反映**真实增长**。"本月比去年同期跌了 8%"——这才是结构性的问题信号。

两把尺子结论相反是很正常的事:"环比涨了 12%,同比跌了 5%"——说明这个月比上个月好了,但比去年同期仍在下滑。这种矛盾正是洞察的切入点。

**2. TOP 分析不只是"排个名"**

最重要的不是知道谁第一,而是知道"**冠军和末尾的差距有多大**"、"**这个月的 TOP 和上个月 TOP 换人了没有**"。如果 TOP1 产品的销售额占到全部的 60%,这叫集中度风险。

**3. 洞察要说"所以怎样",不只是描述现象**

"A 品类本月销售额下降了 18%"——这是描述。

"A 品类本月销售额下降 18%,结合季节规律(去年同期也有类似下降),初步判断属于季节性波动,无需恐慌;但如果下月继续跌超 10%,建议关注竞品动向"——这才是洞察。

**4. 数据截止时间要写清楚**

月报里的数字必须说清楚"统计截止到 X 月 X 日,是否含当日数据"。没有时间戳的数字是不可信的。

---

## 🛠 操作要点

### 第一步:生成模拟销售数据(内嵌,直接可跑)

```python
import pandas as pd
import numpy as np

np.random.seed(2024)
n = 800

# 模拟 24 个月的销售流水
months = pd.date_range("2023-01-01", periods=24, freq="MS")
df = pd.DataFrame({
    "order_id":   [f"S{i:05d}" for i in range(n)],
    "order_date": np.random.choice(months, n),
    "category":   np.random.choice(["服饰", "家居", "食品", "数码", "美妆"], n,
                                    p=[0.30, 0.25, 0.20, 0.15, 0.10]),
    "region":     np.random.choice(["华东", "华南", "华北", "西部"], n,
                                    p=[0.40, 0.30, 0.20, 0.10]),
    "salesperson":np.random.choice([f"销售{c}" for c in "ABCDE"], n),
    "amount":     np.random.lognormal(mean=7.5, sigma=0.8, size=n).round(2),
    "quantity":   np.random.randint(1, 10, n),
})
df["year_month"] = df["order_date"].dt.to_period("M")
df.to_csv("/tmp/sales.csv", index=False)
print(f"模拟销售数据生成完毕,共 {len(df)} 行,时间跨度 2023-01 ~ 2024-12")
```

### 第二步:月度汇总 + 同比/环比计算

```python
import pandas as pd

df = pd.read_csv("/tmp/sales.csv")
df["order_date"] = pd.to_datetime(df["order_date"])
df["year_month"] = df["order_date"].dt.to_period("M")

# 按月汇总
monthly = df.groupby("year_month").agg(
    revenue=("amount", "sum"),
    orders=("order_id", "count"),
    avg_order=("amount", "mean")
).sort_index().reset_index()

monthly["year_month"] = monthly["year_month"].astype(str)

# 环比(Month over Month)
monthly["mom_pct"] = monthly["revenue"].pct_change() * 100

# 同比(Year over Year):同月份偏移 12 行
monthly["yoy_pct"] = monthly["revenue"].pct_change(periods=12) * 100

print("\n月度销售汇总(最近 6 个月):")
print(monthly.tail(6)[["year_month", "revenue", "orders", "mom_pct", "yoy_pct"]].to_string(index=False))
```

### 第三步:TOP 品类 / TOP 销售员分析

```python
import pandas as pd

df = pd.read_csv("/tmp/sales.csv")

# 取最近一个月数据
df["order_date"] = pd.to_datetime(df["order_date"])
last_month = df["order_date"].dt.to_period("M").max()
df_last = df[df["order_date"].dt.to_period("M") == last_month]

print(f"\n分析月份:{last_month}")

# TOP 品类
top_cat = df_last.groupby("category")["amount"].sum().sort_values(ascending=False)
top_cat_pct = (top_cat / top_cat.sum() * 100).round(1)
print("\n品类销售额 TOP5:")
for cat, rev, pct in zip(top_cat.index, top_cat.values, top_cat_pct.values):
    bar = "█" * int(pct // 5)
    print(f"  {cat:5s}  {rev:>10,.0f} 元  {pct:5.1f}%  {bar}")

# TOP 销售员
top_sales = df_last.groupby("salesperson")["amount"].sum().sort_values(ascending=False)
print("\n销售员业绩排名:")
for i, (name, rev) in enumerate(top_sales.items(), 1):
    print(f"  第{i}名 {name}: {rev:>10,.0f} 元")

# 区域分布
print("\n区域销售额:")
print(df_last.groupby("region")["amount"].sum().sort_values(ascending=False).to_string())
```

### 第四步:趋势图(可选,matplotlib)

```python
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("/tmp/sales.csv")
df["order_date"] = pd.to_datetime(df["order_date"])
df["year_month"] = df["order_date"].dt.to_period("M")
monthly = df.groupby("year_month")["amount"].sum()

plt.rcParams["font.sans-serif"] = ["SimHei", "PingFang SC", "WenQuanYi Micro Hei", "DejaVu Sans"]
plt.rcParams["axes.unicode_minus"] = False

fig, ax = plt.subplots(figsize=(12, 4))
x_labels = [str(m) for m in monthly.index]
ax.plot(x_labels, monthly.values, marker="o", color="#2166ac", linewidth=2)
ax.set_title("月度销售额趋势(2023~2024)", fontsize=13)
ax.set_ylabel("销售额(元)")
ax.tick_params(axis="x", rotation=45)
plt.tight_layout()
plt.savefig("/tmp/sales_trend.png", dpi=150)
print("趋势图已保存到 /tmp/sales_trend.png")
```

### 第五步:交付给主人的报告格式

```
【月度销售分析报告】
统计月份:XXXX 年 X 月(数据截止 X 月 X 日)
数据来源:主人提供的销售流水文件

【本月核心数字】
总销售额:XX 万元
  · 环比上月:▲/▼ X.X%(上月 XX 万元)
  · 同比去年同期:▲/▼ X.X%(去年同期 XX 万元)
总订单数:XX 单  均单价:XX 元

【品类 TOP 分析】
第 1 名:服饰,XX 万元,占比 X%
第 2 名:……
(写前 5 名,并说明有无黑马或掉队品类)

【销售员排名】
第 1 名:销售A,XX 万元
……
冠亚军差距:XX%,排名有无变化:(本月 XX 首次进前三/与上月相同)

【区域表现】
最强区域:华东,XX 万元(占比 X%)
需关注:西部,环比下降 X%

【洞察与建议】
1. (一句话说最重要的发现,要有数字)
   → 建议:(具体行动)
2. (第二个洞察)
   → 建议:
(2-3 条,每条都要"发现 → 建议"配对)

【数据局限说明】
(写明数据覆盖范围、有无线下渠道、退款是否已扣除等)
```

---

## 🧰 配套开源项目(可选集成)

> 这门课的活,也有现成开源项目能帮你省力。**连真实数据库/客户数据/账号前先问主人**,优先只读、先脱敏、用完即删;星数为调研约数,装前再核。

- **Metabase** ([github.com/metabase/metabase](https://github.com/metabase/metabase), ~40k★) —— 零 SQL 销售看板,可直连数据库自动刷新销售数据。**用法**:把本课产出的月度销售分析报告升级成 Metabase 实时看板,销售经理每天自助查看各渠道/产品/销售员的完成率,不用每次找 AI 重跑。自托管,中国服务器可直接部署。

- **anthropics/skills 的 xlsx 技能** ([github.com/anthropics/anthropic-quickstarts](https://github.com/anthropics/anthropic-quickstarts), 官方) —— Anthropic 官方技能库中的 Excel/xlsx 操作能力,支持读写 150k token 级别的大表格,出报表/汇总表的利器。**用法**:让 AI 直接读取主人提供的销售 Excel 原文件,输出分析结果并写回格式化报告,省去手动导入导出。

---

## 📝 毕业测验(必须真做,交证据)

**任务:用模拟数据(或主人提供的真实销售数据)产出一份完整月度销售分析报告。**

**你需要做到:**

1. **运行月度汇总脚本**:把最近 3 个月的同比/环比数字粘贴进报告。

2. **运行 TOP 分析脚本**:把品类 TOP5 和销售员排名的真实结果写入报告。

3. **写完整月报**:按上方格式填写,每个模块都要有实质内容。

4. **给出 2-3 条洞察建议**:每条要有数字支撑,且有"所以建议 XX"的动作指向。

5. **隐私合规声明**:写明数据来源。(模拟数据写"使用模拟数据,销售员名称为虚构代号,无真实人员信息")

6. **沉淀技能卡**:把销售月报分析流程沉淀成 `skills/sales-analysis.md`。

> ⚠️ 如果主人提供的是含真实销售员姓名、客户名称的数据,提醒主人评估是否需要脱敏后再分析。分析报告只交给主人,不对外分享。

---

## 🎓 过关标准

- [ ] 同比/环比数字**真实计算**,报告里写明了对比基准和计算逻辑
- [ ] TOP 分析**有真实排名**,品类 TOP5 和销售员排名数字都有
- [ ] 报告里有 **2-3 条洞察建议**,每条有数字支撑 + 具体行动建议
- [ ] 同比/环比含义在报告里**有一句话区分说明**(不能混用)
- [ ] 写明了**数据统计截止时间**和来源
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,然后填 [结业报告](../../templates/graduation-report-template.md),把月报当面交到主人手上。
