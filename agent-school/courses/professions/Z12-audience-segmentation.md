# 第 Z12 课 · 人群分层与选品分析

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课、T04-jq 课、T09-pandas 课(选修) ｜ 难度:★★★ ｜ 源头:pandas 官方文档 [pandas.pydata.org](https://pandas.pydata.org/docs/) · DuckDB 文档 [duckdb.org/docs](https://duckdb.org/docs/) · 淘宝生意参谋数据定义 [sycm.taobao.com](https://sycm.taobao.com/) · 飞瓜数据电商分析 [www.feigua.tv](https://www.feigua.tv/)

---

## 📖 你要学会什么

学完这一课,你会帮主人把一份**真实的订单/客户数据**分析出"不同类型的买家是谁、他们各自买什么、怎么留住他们",并给出**基于数据的选品建议**——两件事打包交付。

先解释一下这件事为什么重要。

很多店主对自己的客户有一种模糊的感觉:"我的买家大概是年轻女性吧""应该是注重性价比的群体"——但这些感觉是对的吗?

说白了你不知道。感觉只是感觉。

真正厉害的运营是:我能说出来"我的买家里有三类人——A 类占 60%、月均下单 2 次、偏好买 XX 品类;B 类占 25%、客单价高、一次性购买大件;C 类是沉睡客户、三个月没回来了、需要召回。"

有了这个分层,选品就不是拍脑袋了:"A 类买家下一步适合推 XX;B 类买家值得做高端产品线;C 类买家发一个专属优惠码可能把他们叫回来。"

你的任务是把**一堆订单数据**变成**可以指导运营决策的洞察**。

**关于数据工具(先调研,装前必须问主人):**

- **pandas**:Python 数据分析最核心的库,适合做分群统计、数据清洗、汇总透视。文档:[pandas.pydata.org](https://pandas.pydata.org/docs/) — 完全免费,需要 Python 环境。
- **DuckDB**:不需要搭数据库服务,直接用 SQL 查 CSV 文件,百万行秒级出结果。文档:[duckdb.org/docs](https://duckdb.org/docs/) — 完全免费开源。
- **飞瓜数据**:抖音/快手电商数据分析平台,可以看竞品选品趋势。[www.feigua.tv](https://www.feigua.tv/) — 有免费基础版,完整版需付费。

> ⚠️ 工具使用前必须征得主人确认。**客户数据是极度敏感的隐私数据**——处理前必须向主人确认数据来源合规、是否已脱敏。本课绝不替主人登录任何电商后台导出数据。

---

## 🧠 核心原则(内化成习惯)

**1. 数据分析先问"为了做什么决策"**

拿到一份订单表,漫无目的地分析是浪费时间。开始之前先问主人:"你做这个分析,最想搞清楚的是什么?"

- 想知道哪类客户最赚钱?→ 分群+价值分层
- 想知道哪些商品卖得好?→ 选品分析
- 想降低退货率?→ 看退货和哪些字段有关
- 想召回流失客户?→ 找沉睡客户群体特征

决策目标清晰了,才知道该算什么。

**2. 先看数据质量,再做分析**

真实的订单数据几乎100%有脏数据——缺失值、错误格式、重复记录、异常值。如果不先清洗就直接分析,结论会出大错。

所以分析流程第一步永远是:**把数据质量说清楚**,而不是直接给结论。

**3. 客户分层不是标签游戏,是用来指导动作的**

分出来的每一个"群体"都要能回答:"我应该对这群人做什么?"——如果一个分群没有对应的运营动作,这个分群没有意义。

**4. 隐私保护是红线**

客户姓名、手机号、收货地址——这些是个人隐私信息。你在分析时**必须使用脱敏数据**。如果拿到的数据没有脱敏,第一件事是提醒主人,而不是直接开始分析。

**5. 选品建议要有数据支撑**

不能说"我觉得应该上 XX 产品"——要说"现有 A 类客户(占 60%)中,买了 X 品类的客户复购率比没买的高 2.3 倍,建议扩充 X 品类的 SKU。"结论要有数字支撑。

---

## 🛠 操作要点

### 第一步:数据接收与质检

在开始任何分析之前,先出一份数据质检报告:

```python
# 数据质检脚本(pandas 版)
import pandas as pd

df = pd.read_csv("orders.csv")  # 主人提供的订单文件

# 基础信息
print("总行数:", len(df))
print("字段列表:", df.columns.tolist())
print("\n各字段缺失值统计:")
print(df.isnull().sum())
print("\n数据时间范围:")
print(df["order_date"].min(), "~", df["order_date"].max())

# 异常值检查
print("\n订单金额描述统计:")
print(df["amount"].describe())
```

**质检报告要写明:**
- 数据时间范围、总订单数、总客户数
- 有没有明显缺失字段(如大量空客户 ID)
- 金额/数量有没有明显异常(如负数订单金额)
- 是否有重复订单号

### 第二步:客户分层(RFM 模型)

RFM 是电商客户分层最经典的框架:

```
R = Recency    最近一次购买是多久前?
F = Frequency  总共买了几次?
M = Monetary   总消费金额是多少?
```

把每个客户在这三个维度上打分(1-3分或1-5分),组合出人群标签:

| 组合特征 | 人群标签 | 建议运营动作 |
|----------|----------|------------|
| R高F高M高 | 超级 VIP | 专属权益/提前新品试用 |
| R高F低M中 | 新客/潜力 | 新手礼包/引导复购 |
| R低F高M高 | 沉睡高价值 | 定向召回优惠 |
| R低F低M低 | 流失客 | 低成本试探(小优惠)/放弃 |

```python
# RFM 计算示例(pandas 版)
import pandas as pd
from datetime import datetime

df = pd.read_csv("orders.csv", parse_dates=["order_date"])
now = pd.Timestamp.now()

rfm = df.groupby("customer_id").agg(
    recency=("order_date", lambda x: (now - x.max()).days),
    frequency=("order_id", "count"),
    monetary=("amount", "sum")
).reset_index()

# 分段打分(1=低, 3=高)
rfm["r_score"] = pd.qcut(rfm["recency"], 3, labels=[3,2,1])  # 越近越高
rfm["f_score"] = pd.qcut(rfm["frequency"].rank(method="first"), 3, labels=[1,2,3])
rfm["m_score"] = pd.qcut(rfm["monetary"].rank(method="first"), 3, labels=[1,2,3])

rfm["rfm_segment"] = rfm["r_score"].astype(str) + rfm["f_score"].astype(str) + rfm["m_score"].astype(str)
print(rfm["rfm_segment"].value_counts())
```

> ⚠️ 运行脚本前先确认数据已脱敏——customer_id 应为匿名 ID,不是真实手机号或姓名。

### 第三步:选品分析

**方向一:复购驱动品类**

```python
# 找出"买了这个还会买什么"
from itertools import combinations
from collections import Counter

# 把同一客户的多次购买品类组合起来
basket = df.groupby("customer_id")["category"].apply(list)
pairs = Counter()
for items in basket:
    for pair in combinations(set(items), 2):
        pairs[pair] += 1

print("最常共购的品类组合:")
print(pairs.most_common(10))
```

**方向二:利润贡献品类**

```python
# 按品类算销售额 + 件数 + 客单价
by_cat = df.groupby("category").agg(
    total_revenue=("amount", "sum"),
    order_count=("order_id", "nunique"),
    avg_order_value=("amount", "mean")
).sort_values("total_revenue", ascending=False)
print(by_cat.head(10))
```

**方向三:竞品选品参考**

如果主人有账号,可以去飞瓜数据([www.feigua.tv](https://www.feigua.tv/))查同类目竞品的爆款 SKU 趋势。这部分需要主人自己操作账号,你负责告诉主人要看哪些指标:近 30 天销量趋势、竞品定价区间、买家年龄/性别分布。

### 第四步:选品建议报告(交付物格式)

```
【数据概况】
分析时间范围:XXXX年X月~XXXX年X月
总订单数:XX 笔 / 总客户数:XX 人 / 总GMV:XX 万元

【客户分层结果】
超级 VIP(RFM 高):XX 人,占比 X%,贡献 GMV X%
潜力客户:XX 人,占比 X%
沉睡高价值:XX 人,占比 X%,流失风险最大
流失客:XX 人,占比 X%

【各分群运营建议】
- VIP 群:建议做 XX(具体动作)
- 沉睡高价值:建议在 X 月前发 XX 挽留优惠,预计可召回 X% 左右
- 新客:建议在首次购买后 7 天内推 XX 引导复购

【选品分析发现】
- 高复购组合:A品类 + B品类 共购率高(X%的买了A的客户也买了B)
  → 建议:在A品类详情页推B品类商品
- 利润贡献前三品类:X / Y / Z
  → 建议:加大X品类的SKU广度,/Y品类重点做拉新
- 成长型品类(近 3 个月销量增速 >30%):___
  → 建议:提前布局库存

【数据质量备注】
(写明数据的局限性:如时间范围短、某些字段缺失等,不要隐瞒数据局限)
```

---

## 🧰 配套开源项目(可选集成)

> 这门课的活,也有现成的优秀开源项目能帮你省力。**装/连账号/联网前先问主人**;星数为调研时约数,装前自己再核一眼。

- **marketingskills(customer-research 模块)** ([github.com/coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills), ~33k ⭐) —— 营销全家桶中的 customer-research Skill,涵盖人群细分框架、用户画像生成、需求洞察提炼。**用法**:在完成 RFM 分层后,调用 customer-research Skill 辅助为每个分群撰写"人群画像描述"和"运营动作建议"文字,让数据分析报告更易读懂。⚠️ **该项目以英文定性研究场景为主,适合补充文字描述部分;RFM 计算本身仍需本课提供的 pandas 脚本来完成**。

## 📝 毕业测验(必须真做,交证据)

**任务:对主人提供的订单/客户数据,完成人群分层 + 选品分析,产出可直接给主人看的分析报告。**

**如果没有真实数据:**
用以下模拟数据完成练习——
```python
import pandas as pd
import numpy as np

np.random.seed(42)
n = 500
df = pd.DataFrame({
    "order_id": [f"ORD{i:05d}" for i in range(n)],
    "customer_id": [f"C{np.random.randint(1,150):04d}" for _ in range(n)],
    "order_date": pd.date_range("2024-01-01", periods=n, freq="12H"),
    "category": np.random.choice(["服饰", "家居", "食品", "数码", "美妆"], n),
    "amount": np.random.exponential(scale=150, size=n).round(2),
    "quantity": np.random.randint(1, 5, n)
})
df.to_csv("/tmp/sample_orders.csv", index=False)
```

**你需要做到:**

1. **数据质检报告**:运行质检脚本,写出真实输出结果,并对"数据质量是否适合分析"给出结论。

2. **RFM 分层**:运行 RFM 脚本,写出各分层的客户数量和占比。

3. **选品分析**:运行共购分析脚本,找出前 5 组高频共购品类组合,并给出 1 条具体选品/推荐建议。

4. **交付给主人的分析报告**:按上方报告格式写完整,字数不限但每个模块必须有实质内容(不能只贴数字、没有解读)。

5. **隐私合规声明**:在报告开头写明:数据来源 + 是否已脱敏 + 敏感字段处理方式。(模拟数据写"使用模拟数据,无真实用户隐私")

6. **沉淀技能卡**:把人群分层分析流程沉淀成 `skills/audience-segmentation.md`。

> ⚠️ **铁律再重申:只做分析、只交报告,绝不替主人登录后台或操作真实账号。** 如果主人提供的是未脱敏数据,必须先提醒主人处理后再接手。

---

## 🎓 过关标准

- [ ] 数据质检报告**真实输出**,写明了数据质量结论(不是"数据很好"一句话带过)
- [ ] RFM 分层**有真实计算结果**,各分层客户数量和占比都有
- [ ] 选品分析**有具体发现**,不是"可以考虑扩充选品"这种废话,而是"A+B共购率X%,建议做XX"
- [ ] 分析报告里有**隐私合规声明**
- [ ] 全程**没有登录、没有导出、没有操作任何真实电商后台账号**(可核验)
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,然后填 [结业报告](../../templates/graduation-report-template.md),把分析报告当面交到主人手上。
