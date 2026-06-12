# 第 Z26 课 · 数据清洗与质检

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课、T09-pandas 课(选修) ｜ 难度:★★☆ ｜ 源头:pandas 官方文档 [pandas.pydata.org](https://pandas.pydata.org/docs/) · Great Expectations 文档 [docs.greatexpectations.io](https://docs.greatexpectations.io/)

---

## 📖 你要学会什么

学完这一课,你会把主人给你的**一份脏数据**——满是缺失值、格式乱、重复行、异常数字——清洗成一份可以放心分析的干净表格,并同时出具**一份数据质检报告**交给主人。

为什么要先学这个?因为**数据分析里有个铁律:垃圾进,垃圾出。**

想象你是一家餐厅的大厨。食材是顾客送来的,你得先做"验货"——这批蔬菜有没有烂的?肉新不新鲜?有没有夹杂异物?验完货、处理干净,才能下锅。如果厨师跳过验货直接炒菜,做出来的东西能吃吗?

数据清洗干的就是"验货 + 处理"这件事。

真实世界里,主人拿来的数据有多脏?举几个你一定会遇到的情况:
- 同一个客户 ID 出现了 3 次(重复记录)
- "下单日期"这一列有人填的是"2024/01/05",有人填的是"2024年1月5日",还有人填的是空白
- 订单金额出现了"-99999"(系统错误导致的占位符)
- 手机号那列混进了邮箱地址
- 本来应该有 5000 行,但有 800 行的"城市"字段是空的

你的任务是:**把脏数据逐一清干净,然后出一份质检报告,告诉主人数据质量如何、做了哪些处理、还剩什么局限。**

**关于数据质检工具(先调研,装前必须问主人):**

- **pandas**:清洗操作的主力——去重、填空、格式转换、异常值处理,全靠它。文档:[pandas.pydata.org](https://pandas.pydata.org/docs/) — 完全免费。
- **Great Expectations**:专业数据质量断言库,可以设定"手机号列不能有空值"这类规则并自动验证。文档:[docs.greatexpectations.io](https://docs.greatexpectations.io/) — 开源免费。装它前先问主人。

> ⚠️ 数据清洗过程中**不得删除原始文件**。所有操作在副本上进行,保留原始数据备查。如果拿到的数据包含手机号、姓名、身份证等个人信息,第一件事是提醒主人:这份数据需要脱敏处理才能继续操作。

---

## 🧠 核心原则(内化成习惯)

**1. 先观察,再动手**

拿到数据别急着改。先用 5 分钟把整张表"扫一遍"——有多少行?多少列?每列是什么类型?有多少空值?有没有一眼就看出来的异常?做完这个全局观察,你才知道要清洗什么。

**2. 只处理"确定是错的",别猜**

有时候数据模糊——这个年龄写"0",是系统默认值还是真有个零岁用户?这个时候不要自作主张猜测和填值,要**问主人确认**。宁可留一个问号,也不要填一个错误答案。

**3. 每一步操作都要能"解释给主人听"**

你做的每个清洗动作,都应该能一句话说清楚是什么、为什么这么做。"把订单金额为负数的行删掉了,共 12 行,因为负数金额在该业务场景下不合理"——这才是有价值的操作记录。

**4. 原始数据永远不碰**

清洗的操作全在数据副本上做。万一你哪步清洗出了偏差,主人还能找回原始数据重来。这是最基本的数据安全习惯。

**5. 质检报告是交给人看的,不是给机器看的**

质检报告写完别堆一堆数字了事。要用大白话告诉主人:"这份数据总体质量中等,主要问题集中在 XX 字段,已处理了 XX 问题,处理后可以支撑 XX 类型的分析,但注意不适合用于 XX。"

---

## 🛠 操作要点

### 第一步:生成脏数据(内嵌模拟,直接可跑)

```python
import pandas as pd
import numpy as np

np.random.seed(7)
n = 300

# 造一份模拟脏数据
df_raw = pd.DataFrame({
    "order_id":     [f"ORD{i:04d}" for i in range(n)],
    "customer_name": [f"用户{np.random.randint(1,100):03d}" for _ in range(n)],
    "phone":        [f"138{np.random.randint(10000000,99999999)}" for _ in range(n)],
    "order_date":   pd.date_range("2024-01-01", periods=n, freq="D").strftime(
                        lambda d: np.random.choice(["%Y-%m-%d", "%Y/%m/%d", "%Y年%m月%d日"])
                    ).tolist() if False else  # 简化写法
                    [f"2024-{np.random.randint(1,13):02d}-{np.random.randint(1,28):02d}"
                     for _ in range(n)],
    "amount":       np.where(np.random.random(n) < 0.05, -99999,
                        np.random.normal(200, 80, n).round(2)),  # 5%是占位符错误值
    "city":         [np.random.choice(["北京", "上海", "广州", "深圳", None, ""])
                     for _ in range(n)],
    "category":     [np.random.choice(["服饰", "家居", "数码", None]) for _ in range(n)],
})

# 制造重复行(10行)
df_raw = pd.concat([df_raw, df_raw.sample(10, random_state=1)], ignore_index=True)

df_raw.to_csv("/tmp/dirty_data.csv", index=False)
print(f"脏数据已保存,共 {len(df_raw)} 行")
```

### 第二步:数据质检(全局扫描)

```python
import pandas as pd

df = pd.read_csv("/tmp/dirty_data.csv")

print("=" * 50)
print("📋 数据质检报告 · 第一步:全局概览")
print("=" * 50)
print(f"总行数: {len(df)}")
print(f"总列数: {len(df.columns)}")
print(f"列名列表: {df.columns.tolist()}")

print("\n各列数据类型:")
print(df.dtypes)

print("\n各列缺失值统计:")
missing = df.isnull().sum()
missing_pct = (missing / len(df) * 100).round(1)
missing_report = pd.DataFrame({"缺失数量": missing, "缺失占比(%)": missing_pct})
print(missing_report[missing_report["缺失数量"] > 0])

print("\n重复行数量:", df.duplicated().sum())

print("\namount 列描述统计:")
print(df["amount"].describe())
print("amount 异常值(< 0)数量:", (df["amount"] < 0).sum())
```

### 第三步:分步清洗

```python
import pandas as pd

df = pd.read_csv("/tmp/dirty_data.csv")
df_clean = df.copy()  # 在副本上操作,原始不动

# ── 1. 去掉完全重复的行 ──
before = len(df_clean)
df_clean = df_clean.drop_duplicates()
print(f"去重:删除 {before - len(df_clean)} 条重复行")

# ── 2. 处理 amount 的异常占位值(-99999 视为缺失) ──
bad_amount = (df_clean["amount"] < 0).sum()
df_clean.loc[df_clean["amount"] < 0, "amount"] = None
print(f"异常金额:将 {bad_amount} 条负值标记为缺失(待主人确认处理方式)")

# ── 3. 统一日期格式 ──
# 如有多种格式,先尝试自动推断
df_clean["order_date"] = pd.to_datetime(df_clean["order_date"], errors="coerce")
date_fail = df_clean["order_date"].isnull().sum()
if date_fail > 0:
    print(f"日期解析:有 {date_fail} 行无法识别日期格式,已标记为 NaT,需主人核实")
else:
    print("日期格式:全部解析成功")

# ── 4. 空字符串统一为 NaN ──
df_clean["city"] = df_clean["city"].replace("", None)

# ── 5. 缺失值处理(保守策略:暂不填充,只标记) ──
remaining_missing = df_clean.isnull().sum()
print("\n清洗后各列剩余缺失值:")
print(remaining_missing[remaining_missing > 0])

# ── 6. 保存清洁数据 ──
df_clean.to_csv("/tmp/clean_data.csv", index=False)
print(f"\n清洗完成,共 {len(df_clean)} 行保存至 /tmp/clean_data.csv")
```

### 第四步:质检报告格式(交给主人的)

```
【数据质检报告】
数据文件:orders.csv
检测时间:XXXX年X月X日
原始行数:XXX 行 / 列数:X 列

【质检发现 & 处理记录】
✅ 已处理:
  - 重复行:发现 X 条,已删除
  - 异常金额:发现 X 条负值(-99999),已标记为缺失
  - 日期格式:统一为 YYYY-MM-DD 格式
  - 空字符串:city 列空字符串统一为缺失值

⚠️ 待主人确认:
  - city 字段缺失 X 行(占 X%),请问是否用"未知"填充还是直接删行?
  - category 字段缺失 X 行,如需按品类分析请补充

【清洗后数据质量评估】
总体评级:中等 / 较好 / 较差(写实际情况)
可支撑的分析:订单趋势分析、金额汇总、城市分布(city 缺失率 <5% 则可用)
不建议用于:客户个体行为分析(缺失字段较多)

【重要提示】
(如有手机号/姓名等个人信息,写明"已提醒主人核实脱敏状态")
```

---

## 🧰 配套开源项目(可选集成)

> 这门课的活,也有现成开源项目能帮你省力。**连真实数据库/客户数据/账号前先问主人**,优先只读、先脱敏、用完即删;星数为调研约数,装前再核。

- **OpenRefine** ([github.com/OpenRefine/OpenRefine](https://github.com/OpenRefine/OpenRefine), ~11k★) —— 可视化数据清洗神器,擅长处理脏数据:格式不一、拼写错误、重复行一眼找出来。**用法**:把主人提供的原始数据表导入 OpenRefine,用聚类功能合并相似值(比如"北京"/"北京市"/"BJ"),再导出干净 CSV 交给 Python 做后续分析。本地运行,数据不上云。

- **Great Expectations** ([github.com/great-expectations/great_expectations](https://github.com/great-expectations/great_expectations), ~10k★) —— 数据质量校验框架,像给数据写"体检标准":哪列不能为空、哪列取值范围是多少,一键扫描出问题。**用法**:给本课的质检脚本加一层 GE 断言,让数据质检报告更结构化、可复用。适合有一定 Python 基础的场景。

---

## 📝 毕业测验(必须真做,交证据)

**任务:运行上方脚本,完整走一遍数据质检 + 清洗流程,产出可直接给主人看的质检报告。**

**你需要做到:**

1. **生成脏数据并运行质检脚本**:把脚本的真实输出结果粘贴进报告里(行数、缺失统计、重复行数量都要有)。

2. **运行清洗脚本**:记录每步处理的实际数量(去掉了多少重复行、多少异常值等)。

3. **写完整质检报告**:按上方格式写,每个"已处理"和"待主人确认"都要写实际数字,不能只说"有问题"没说"多少"。

4. **给出一句数据质量结论**:这份数据总体质量如何?清洗后适合做什么类型的分析?有什么局限?

5. **隐私合规声明**:写明数据来源和是否含个人信息。(模拟数据写"使用模拟数据,字段为匿名 ID,无真实用户隐私")

6. **沉淀技能卡**:把数据清洗流程沉淀成 `skills/data-cleaning.md`。

> ⚠️ 铁律:如果主人给你的是真实数据,且包含手机号/姓名/身份证等个人信息,必须先停下来提醒主人脱敏处理,拿到脱敏后的数据再操作。

---

## 🎓 过关标准

- [ ] 质检脚本的**真实输出**写入报告(行数、缺失统计、重复行、异常值都有数字)
- [ ] 清洗脚本**真实运行**,每步处理数量有记录(不是"脚本跑完了"一句话)
- [ ] 质检报告区分了"已处理"和"待主人确认"两类问题
- [ ] 给出了**数据质量结论**:适合做什么、不适合做什么
- [ ] 全程**在数据副本上操作**,原始文件未被修改(可核验)
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,然后填 [结业报告](../../templates/graduation-report-template.md),把质检报告和清洁数据文件一起交给主人。
