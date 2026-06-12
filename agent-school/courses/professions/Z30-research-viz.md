# 第 Z30 课 · 调研数据可视化

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课、T09-pandas 课(选修)、Z26-data-cleaning 课(建议先修) ｜ 难度:★★☆ ｜ 源头:pandas 官方文档 [pandas.pydata.org](https://pandas.pydata.org/docs/) · matplotlib 官方文档 [matplotlib.org/stable](https://matplotlib.org/stable/contents.html) · plotly 官方文档 [plotly.com/python](https://plotly.com/python/) · 问卷星帮助中心 [wjx.cn/help](https://www.wjx.cn/help/)

---

## 📖 你要学会什么

学完这一课,你会把主人做的一份**问卷或调研数据**——从问卷星/腾讯问卷/飞书问卷导出的那个 Excel——变成**一套图表 + 一份有结论的调研报告**,主人可以直接拿去做汇报或发布。

为什么这件事需要认真学?

很多人做完调研,数据收集回来了,然后就不知道怎么办了——把所有题目的选项数量列出来,做一堆饼图和条形图,然后说"如图所示,选择A的有35人,选择B的有28人……"

这不是分析,这叫"数数"。

真正的调研报告要回答三件事:
1. **受访者是谁?** (样本特征,确认问卷回收质量)
2. **他们觉得怎样?** (核心问题的答案分布,找共识和分歧)
3. **不同群体有差异吗?** (交叉分析:年龄不同的人,答案一样吗?)

最后把这三件事翻译成**3-5句可以指导决策的结论**——这才是调研的价值。

**关于工具(先调研,装前必须问主人):**

- **问卷星**:国内主流问卷平台,导出 Excel 支持原始数据下载。[wjx.cn](https://www.wjx.cn/) — 基础版免费。
- **腾讯问卷**:同类产品,也有 Excel 导出。[wj.qq.com](https://wj.qq.com/) — 免费。
- **pandas**:数据处理和统计。文档:[pandas.pydata.org](https://pandas.pydata.org/docs/) — 免费。
- **matplotlib / plotly**:图表生成。前者适合静态导出,后者适合交互式图表。

> ⚠️ 问卷数据可能含受访者的真实姓名、手机号、公司名。处理前先向主人确认:这份数据是否已脱敏?分析报告和图表对外发布时,是否需要对个体信息做匿名处理?

---

## 🧠 核心原则(内化成习惯)

**1. 先看"这份问卷在问什么",再决定用什么图**

单选题 → 饼图或条形图(看占比);
多选题 → 多条形图(看各选项独立选中率,不能用饼图!);
评分题(1-5分) → 均值柱状图 + 标准差说明;
开放题(填空) → 词频分析或人工归类后柱状图。

用错图类型会让结论误导人。多选题用饼图是最常见的错误——因为百分比加起来会超过 100%。

**2. 样本质量先于结论**

回收了 200 份问卷,但有 30 份是同一个 IP 提交的,有 15 份在 10 秒内完成——这些"水货"不清洗就用,结论会偏。报告开头必须说明"有效样本 X 份(原始 X 份,剔除 X 份无效问卷)"。

**3. 交叉分析才能找到"有意思"的东西**

单看每道题的答案分布,通常没什么惊喜——大家总体满意,大家觉得价格还行。但一做交叉:"25岁以下的人满意度 82%,45岁以上的人满意度 51%"——这就是值得关注的发现。

**4. 结论要和决策挂钩**

"有 60% 的人认为产品操作复杂"——这是发现。
"建议优化 XX 功能的引导流程,预计可降低 XX 处的用户流失"——这才是结论。

**5. 图表要自己"说话"**

每张图都要有标题、数据标签、必要的图例。"看图说话"不是你的工作,你的工作是让图本身把话说清楚。

---

## 🛠 操作要点

### 第一步:生成模拟问卷数据(内嵌,直接可跑)

```python
import pandas as pd
import numpy as np

np.random.seed(55)
n = 150

# 模拟一份产品满意度问卷(类似问卷星导出格式)
df = pd.DataFrame({
    "提交时间":     pd.date_range("2024-03-01", periods=n, freq="2H"),
    "年龄段":       np.random.choice(["18-24岁","25-34岁","35-44岁","45岁以上"], n,
                                     p=[0.20, 0.40, 0.25, 0.15]),
    "使用频率":     np.random.choice(["每天","每周2-3次","每周1次","偶尔"], n,
                                     p=[0.30, 0.35, 0.20, 0.15]),
    "整体满意度":   np.random.choice([1,2,3,4,5], n, p=[0.05,0.10,0.20,0.40,0.25]),
    "最喜欢功能_A": np.random.choice([0,1], n, p=[0.4,0.6]),  # 多选:界面设计
    "最喜欢功能_B": np.random.choice([0,1], n, p=[0.5,0.5]),  # 多选:操作流畅
    "最喜欢功能_C": np.random.choice([0,1], n, p=[0.7,0.3]),  # 多选:功能丰富
    "最喜欢功能_D": np.random.choice([0,1], n, p=[0.6,0.4]),  # 多选:价格实惠
    "愿意推荐":     np.random.choice(["非常愿意","愿意","一般","不太愿意","不愿意"], n,
                                     p=[0.25,0.35,0.25,0.10,0.05]),
    "主要痛点":     np.random.choice(["加载速度慢","功能难找","客服响应慢","价格偏高","其他"], n),
})

# 制造 5 条明显无效问卷(完成时间极短,可在真实项目里用完成时长字段过滤)
df.to_csv("/tmp/survey.csv", index=False, encoding="utf-8-sig")
print(f"模拟问卷数据生成完毕,共 {len(df)} 份")
print(df["整体满意度"].value_counts().sort_index())
```

### 第二步:样本质检 + 基础描述统计

```python
import pandas as pd

df = pd.read_csv("/tmp/survey.csv", encoding="utf-8-sig")

print("=" * 50)
print("📋 样本质检")
print("=" * 50)
print(f"原始回收: {len(df)} 份")
# 真实项目里可按"完成时长<30秒"或"所有题答案相同"过滤无效问卷
valid_df = df.copy()  # 本次模拟全部有效
print(f"有效样本: {len(valid_df)} 份")

print("\n样本结构(年龄段分布):")
age_dist = valid_df["年龄段"].value_counts()
for age, cnt in age_dist.items():
    pct = cnt / len(valid_df) * 100
    print(f"  {age}: {cnt} 人 ({pct:.1f}%)")

print("\n整体满意度均值:", round(valid_df["整体满意度"].mean(), 2))
print("满意度分布:")
print(valid_df["整体满意度"].value_counts().sort_index())
```

### 第三步:出图(满意度 + 多选题 + 交叉分析)

```python
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

df = pd.read_csv("/tmp/survey.csv", encoding="utf-8-sig")
plt.rcParams["font.sans-serif"] = ["SimHei", "PingFang SC", "WenQuanYi Micro Hei", "DejaVu Sans"]
plt.rcParams["axes.unicode_minus"] = False

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.suptitle("产品满意度调研报告·图表集", fontsize=14, fontweight="bold")

# 图1:整体满意度分布(条形图)
ax1 = axes[0, 0]
sat_cnt = df["整体满意度"].value_counts().sort_index()
colors_sat = ["#d01c8b","#f1b6da","#b8b8b8","#92c5de","#2166ac"]
bars = ax1.bar(sat_cnt.index.astype(str), sat_cnt.values, color=colors_sat)
ax1.set_title("整体满意度分布(1=非常不满意, 5=非常满意)")
ax1.set_xlabel("满意度评分")
ax1.set_ylabel("人数")
for bar, val in zip(bars, sat_cnt.values):
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.5,
             str(val), ha="center", va="bottom", fontsize=10)

# 图2:多选题(最喜欢功能)选中率
ax2 = axes[0, 1]
features = {"界面设计": "最喜欢功能_A",
            "操作流畅": "最喜欢功能_B",
            "功能丰富": "最喜欢功能_C",
            "价格实惠": "最喜欢功能_D"}
rates = {k: df[v].mean() * 100 for k, v in features.items()}
ax2.barh(list(rates.keys()), list(rates.values()), color="#2166ac")
ax2.set_title("最喜欢的功能(多选,选中率%)")
ax2.set_xlabel("选中率(%)")
for i, (k, v) in enumerate(rates.items()):
    ax2.text(v + 0.5, i, f"{v:.1f}%", va="center")
ax2.set_xlim(0, 100)

# 图3:主要痛点分布
ax3 = axes[1, 0]
pain_cnt = df["主要痛点"].value_counts()
ax3.pie(pain_cnt.values, labels=pain_cnt.index, autopct="%1.1f%%",
        colors=["#d01c8b","#f1b6da","#4dac26","#92c5de","#b8b8b8"])
ax3.set_title("主要痛点分布")

# 图4:交叉分析 - 各年龄段满意度均值
ax4 = axes[1, 1]
age_order = ["18-24岁","25-34岁","35-44岁","45岁以上"]
age_sat = df.groupby("年龄段")["整体满意度"].mean().reindex(age_order)
bars4 = ax4.bar(age_sat.index, age_sat.values, color=["#2166ac","#4dac26","#f1a340","#d01c8b"])
ax4.set_title("各年龄段满意度均值(交叉分析)")
ax4.set_ylabel("满意度均值(满分5)")
ax4.set_ylim(0, 5.5)
for bar, val in zip(bars4, age_sat.values):
    ax4.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.05,
             f"{val:.2f}", ha="center", va="bottom")

plt.tight_layout()
plt.savefig("/tmp/survey_charts.png", dpi=150, bbox_inches="tight")
print("图表已保存到 /tmp/survey_charts.png")
```

### 第四步:交叉分析文字提取 + 结论生成

```python
import pandas as pd

df = pd.read_csv("/tmp/survey.csv", encoding="utf-8-sig")

# 按年龄段分组的满意度
age_order = ["18-24岁","25-34岁","35-44岁","45岁以上"]
age_sat = df.groupby("年龄段")["整体满意度"].mean().reindex(age_order).round(2)

# NPS 类计算:愿意推荐分布
nps_map = {"非常愿意":2,"愿意":1,"一般":0,"不太愿意":-1,"不愿意":-1}
df["nps_score"] = df["愿意推荐"].map(nps_map)
promoters_pct  = (df["nps_score"] == 2).mean() * 100
detractors_pct = (df["nps_score"] < 0).mean() * 100

print(f"推荐意愿(愿意+非常愿意): {(df['nps_score'] > 0).mean()*100:.1f}%")
print(f"不推荐比例: {detractors_pct:.1f}%")
print("\n年龄段满意度差异:")
print(age_sat)
max_age = age_sat.idxmax()
min_age = age_sat.idxmin()
print(f"\n最满意群体:{max_age}(均分 {age_sat[max_age]})")
print(f"满意度最低:{min_age}(均分 {age_sat[min_age]})")
gap = age_sat[max_age] - age_sat[min_age]
print(f"两者差距:{gap:.2f} 分{'(较大,值得关注)' if gap > 0.5 else '(差距不大)'}")
```

### 第五步:调研报告格式(给主人的)

```
【调研数据分析报告】
问卷主题:产品满意度调研
数据来源:问卷星导出 / 腾讯问卷导出(具体来源写实际情况)
有效样本:XXX 份(原始回收 XXX 份,剔除无效 X 份)
统计截止:XXXX年X月X日

【样本结构】
年龄构成:25-34岁占比最高(X%),样本以中青年为主
使用频率:每天使用占 X%,说明核心用户黏性较高

【核心发现】
1. 整体满意度:均分 X.XX 分(满分5分)
   → X% 的用户给出4分及以上(满意 + 非常满意)
   
2. 最受欢迎功能:界面设计(X% 选中),其次是操作流畅(X%)
   → 用户最看重的是"好不好用",而不是"功能多不多"
   
3. 主要痛点:加载速度慢(X%)是最高频投诉
   → 建议优先优化核心流程的加载速度

4. 推荐意愿:X% 愿意向他人推荐,X% 不愿意推荐
   → 口碑传播潜力(整体偏好 / 需改善)

【⚠️  值得关注的分群差异】
45岁以上用户满意度均分 X.XX,明显低于 25-34 岁(X.XX)
→ 两组差距 X.X 分,说明产品对中老年用户的适配存在问题
→ 建议:增大字号、简化操作步骤

【调研结论与建议(3条)】
1. (发现) → (建议行动)
2. (发现) → (建议行动)
3. (发现) → (建议行动)

【数据局限说明】
- 样本来源:(说明是否限定渠道)
- 有无偏差:(如大部分受访者来自同一渠道,结论代表性有限)
- 开放题处理:(如未做词频分析,写明"开放题未统计")
```

---

## 🧰 配套开源项目(可选集成)

> 这门课的活,也有现成开源项目能帮你省力。**连真实数据库/客户数据/账号前先问主人**,优先只读、先脱敏、用完即删;星数为调研约数,装前再核。

- **Apache Superset** ([github.com/apache/superset](https://github.com/apache/superset), ~63k★) —— 企业级可视化平台,支持调研数据的多维交叉分析和漂亮图表导出。**用法**:把本课的问卷分析结果导入 Superset,用交互式图表替代静态 PNG,让主人可以自己筛选查看不同维度的结论。

- **anthropics/skills 的 xlsx/pptx 技能** ([github.com/anthropics/anthropic-quickstarts](https://github.com/anthropics/anthropic-quickstarts), 官方) —— Anthropic 官方技能库中的 Excel/PPT 操作能力,150k token 级别,出调研报告 PPT 的利器。**用法**:让 AI 把可视化图表和结论摘要直接写入 PPT 模板,产出可直接向主人或客户汇报的调研报告幻灯片。

---

## 📝 毕业测验(必须真做,交证据)

**任务:用上方模拟问卷数据(或主人提供的真实问卷数据)完成可视化分析,产出图表集 + 调研报告。**

**你需要做到:**

1. **样本质检**:把有效样本数量、年龄分布的真实统计结果写入报告。

2. **生成四张图表**:把 `/tmp/survey_charts.png` 的实际输出路径写入报告,并对每张图做 1 句大白话说明。

3. **交叉分析**:把各年龄段满意度均值的对比结果写入报告,并说明差距是否值得关注。

4. **写完整调研报告**:按上方格式填写,结论至少 3 条,每条都要有数字支撑 + 建议行动。

5. **找一个"反直觉发现"**:从交叉分析或分布图里找一个"你没想到、但数据说了"的发现,写进报告的"值得关注的分群差异"里。

6. **隐私合规声明**:写明数据来源和处理方式。(模拟数据写"使用模拟数据,无真实受访者信息")

7. **沉淀技能卡**:把调研可视化分析流程沉淀成 `skills/research-viz.md`。

> ⚠️ 如果主人给的是真实问卷数据,处理前先确认是否含受访者姓名/手机号等个人信息;分析报告和图表对外发布时需做匿名处理。

---

## 🎓 过关标准

- [ ] 样本质检完成,有效样本数量和年龄分布**有真实统计数字**
- [ ] **四张图表真实生成**,每张图有 1 句大白话说明
- [ ] 多选题用了条形图而非饼图(守住这条常识红线)
- [ ] 报告里有**交叉分析发现**,且说明了差距是否显著
- [ ] 至少 **3 条结论**,每条有数字支撑 + 具体行动建议
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,然后填 [结业报告](../../templates/graduation-report-template.md),把图表集和调研报告一起交到主人手上。
