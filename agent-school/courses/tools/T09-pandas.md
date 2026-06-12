# 第 T09 课 · pandas 把乱表格清洗成干净数据

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课 ｜ 难度:★★★ ｜ 源头:pandas 官方文档 · [pandas.pydata.org/docs](https://pandas.pydata.org/docs/) · PyPI: [pandas](https://pypi.org/project/pandas/) · GitHub: [pandas-dev/pandas](https://github.com/pandas-dev/pandas)

---

## 📖 你要学会什么

学完这一课,你能接过一张"脏表格"——有重复行、有空缺格、有格式乱七八糟的日期和数字——用 pandas 把它刷干净,输出一张**字段类型正确、没重复、没缺失**的干净表。

想象你接到一张手工填写的出勤表,500 行数据里藏着这些"地雷":有人名字填了两遍、有人请假那天忘填了、日期有人写 "2024/1/5" 有人写 "2024-01-05"、数字栏里混进了 "—"、"无" 这种文字。你要交出去的是一张能直接导入系统的干净表。pandas 就是你手里那把"橡皮+修改液套装"——**批量找、批量改、批量核验**,500 行一眨眼搞定。

pandas 当前版本 3.0.3,是 Python 数据分析的事实标准,底层用 NumPy 做计算,核心数据结构是 **DataFrame**——就是一张带行列标签的表格,每列是一个 **Series**。

**官方资料:**
- 官方文档: [pandas.pydata.org/docs](https://pandas.pydata.org/docs/)
- 入门教程: [pandas.pydata.org/docs/getting_started](https://pandas.pydata.org/docs/getting_started/index.html)
- PyPI: [pypi.org/project/pandas](https://pypi.org/project/pandas/)
- GitHub: [github.com/pandas-dev/pandas](https://github.com/pandas-dev/pandas)

---

## 🧠 核心原则(内化成习惯)

1. **DataFrame 就是一张表,Series 是一列。** 用 `df["列名"]` 取某一列(得到 Series),用 `df[["列A","列B"]]` 取多列(得到 DataFrame)。先在脑子里建立"表"的模型,所有操作都是在切表、改列、过滤行。

2. **先 `df.info()` 和 `df.head()`,再动手。** 接过一张陌生的表,第一件事是"摸底"——`df.info()` 看有几列、每列类型、有多少非空值;`df.head()` 看前几行长什么样;`df.describe()` 看数值分布。摸清楚再动手,不要盲目清洗。

3. **链式操作像流水线,每步改一件事。** pandas 的操作可以链式串起来——`df.dropna().drop_duplicates().reset_index(drop=True)` 就像流水线上的三道工序,依次执行。用 `.pipe()` 可以串更复杂的自定义步骤。

4. **类型转换是清洗的核心动作。** 很多"坏数据"本质是**类型错了**——数字存成了字符串、日期存成了普通文本。用 `pd.to_numeric()`、`pd.to_datetime()`、`.astype()` 把类型修正好,后续的计算和过滤才会对。

5. **改完就验收。** 每次清洗后跑 `df.info()` 确认没有意外 NaN;跑 `df.duplicated().sum()` 确认重复已清零;跑 `df.dtypes` 确认类型对了。清洗是手术,手术完要检查刀口。

---

## 🛠 操作要点

### 安装

```bash
pip install pandas
# 如果还要读写 Excel 文件,需配合 openpyxl
pip install pandas openpyxl
```

> 🇨🇳 **中国用户提示:** pip 直接安装,国内可用清华镜像加速:
> `pip install pandas -i https://mirrors.tuna.tsinghua.edu.cn/pypi/web/simple/`

### 最小可运行示例:三步清洗脏数据(完全离线)

```python
import pandas as pd
import io

# ---- 准备脏数据(内嵌,无需联网) ----
raw_csv = """
姓名,部门,入职日期,月薪,绩效
小明,技术,2023/3/1,15000,A
小红,市场,2023-04-15,12000,B
小明,技术,2023/3/1,15000,A
小刚,技术,,18000,S
小丽,市场,2023-06-01,—,B
小强,运营,2023-07-20,9000,
"""

df = pd.read_csv(io.StringIO(raw_csv.strip()))
print("=== 原始数据 ===")
print(df)
print(f"\n形状: {df.shape}  (行 × 列)")
df.info()
```

### 第一步:去重

```python
# 查看重复行
print(f"\n重复行数: {df.duplicated().sum()}")
print(df[df.duplicated(keep=False)])  # 展示所有重复行

# 删除完全相同的重复行
df = df.drop_duplicates()
print(f"去重后行数: {len(df)}")
```

### 第二步:处理缺失值

```python
# 查看每列的缺失情况
print("\n每列空值数量:")
print(df.isnull().sum())

# 策略一:删掉"月薪"为空的行(关键字段缺失)
df = df.dropna(subset=["月薪"])

# 策略二:把"绩效"缺失填为默认值 "C"
df["绩效"] = df["绩效"].fillna("C")

# 策略三:把"入职日期"缺失填为一个默认日期
df["入职日期"] = df["入职日期"].fillna("2023-01-01")

print(f"\n处理缺失后行数: {len(df)}")
```

### 第三步:类型修正

```python
# "月薪"列含 "—" 这种脏字符,先转成数值(非数字变 NaN),再 dropna
df["月薪"] = pd.to_numeric(df["月薪"], errors="coerce")
df = df.dropna(subset=["月薪"])
df["月薪"] = df["月薪"].astype(int)

# 日期列:统一解析成 datetime(混合格式 2023/3/1 和 2023-04-15 都能处理)
df["入职日期"] = pd.to_datetime(df["入职日期"], format="mixed", dayfirst=False)

print("\n=== 清洗后的数据 ===")
print(df)
print("\n字段类型:")
print(df.dtypes)
```

### 常用清洗操作速查

```python
# 读取 CSV / Excel
df = pd.read_csv("data.csv", encoding="utf-8")
df = pd.read_excel("data.xlsx", sheet_name="Sheet1")

# 摸底三件套
df.info()          # 列名、类型、非空数
df.head(5)         # 前 5 行
df.describe()      # 数值列统计摘要

# 去重
df.duplicated().sum()           # 重复行数
df.drop_duplicates()            # 删全部重复
df.drop_duplicates(subset=["姓名"])  # 按某列去重

# 缺失值
df.isnull().sum()               # 每列空值数
df.dropna()                     # 删任意有空的行
df.dropna(subset=["关键列"])    # 只删关键列为空的行
df.fillna({"列A": 0, "列B": "未知"})  # 按列填充默认值

# 类型转换
pd.to_numeric(df["列"], errors="coerce")     # 字符串→数值(非法→NaN)
pd.to_datetime(df["列"], format="mixed")     # 字符串→日期
df["列"].astype(str)                         # 强制转字符串

# 筛选行
df[df["月薪"] > 10000]            # 条件过滤
df[df["部门"].isin(["技术","市场"])]  # 多值匹配

# 新增/修改列
df["年薪"] = df["月薪"] * 12
df["姓名"] = df["姓名"].str.strip()   # 去首尾空格
df["部门"] = df["部门"].str.replace("　", " ")  # 替换全角空格

# 保存
df.to_csv("/tmp/clean.csv", index=False, encoding="utf-8-sig")  # utf-8-sig 防 Excel 乱码
df.to_excel("/tmp/clean.xlsx", index=False)
```

---

## 📝 毕业测验(必须真做,交证据)

**任务:清洗一份"脏员工表",完成去重、缺失处理、类型修正三步,输出干净数据。测验数据内嵌——完全离线可跑。**

```bash
# 把脏数据写入本地文件
cat > /tmp/dirty_employees.csv << 'EOF'
姓名,部门,入职日期,月薪,级别
王芳,技术,2022/5/10,22000,P6
李明,市场,2022-06-15,15000,M4
王芳,技术,2022/5/10,22000,P6
张强,技术,,28000,P7
刘娟,市场,2022-09-01,—,M3
陈浩,运营,2023-01-20,13000,
赵磊,技术,2023/3/15,25000,P6
刘娟,市场,2022-09-01,,M3
EOF
```

**完整清洗脚本**(`/tmp/pandas_task.py`):

```python
import pandas as pd

# 1. 读取数据
df = pd.read_csv("/tmp/dirty_employees.csv")
print(f"原始数据: {df.shape[0]} 行")
print(df)

# 2. 去重(完全相同的行)
before = len(df)
df = df.drop_duplicates()
print(f"\n去重: {before} → {len(df)} 行(删掉 {before - len(df)} 行)")

# 3. 月薪列:清除非数值、转 int
df["月薪"] = pd.to_numeric(df["月薪"], errors="coerce")
dropped_salary = df["月薪"].isna().sum()
df = df.dropna(subset=["月薪"])
df["月薪"] = df["月薪"].astype(int)
print(f"\n月薪清洗: 删掉 {dropped_salary} 行非数值记录")

# 4. 日期列:统一格式,缺失填默认
df["入职日期"] = pd.to_datetime(df["入职日期"], format="mixed", errors="coerce")
missing_date = df["入职日期"].isna().sum()
df["入职日期"] = df["入职日期"].fillna(pd.Timestamp("2023-01-01"))
print(f"日期清洗: {missing_date} 个缺失日期已填为 2023-01-01")

# 5. 级别列:缺失填 "未知"
df["级别"] = df["级别"].fillna("未知")

# 6. 重置索引
df = df.reset_index(drop=True)

print(f"\n=== 清洗后数据 ({len(df)} 行) ===")
print(df)
print("\n字段类型:")
print(df.dtypes)

# 7. 保存
output_path = "/tmp/clean_employees.csv"
df.to_csv(output_path, index=False, encoding="utf-8-sig")
print(f"\n已保存到 {output_path}")

# 8. 验收断言
assert df.duplicated().sum() == 0, "不应有重复行"
assert df.isnull().sum().sum() == 0, "不应有任何空值"
assert df["月薪"].dtype in ["int32", "int64"], "月薪应为整数类型"
assert str(df["入职日期"].dtype).startswith("datetime"), "入职日期应为 datetime 类型"
print("验收通过 ✓")
```

**要交的证据:**
- 脚本完整输出(含"验收通过 ✓")
- 最终 `df.dtypes` 展示

**沉淀技能卡**:把"摸底→去重→缺失→类型"四步清洗流程、常用函数速查表沉淀成 `skills/pandas-cleaning.md`。

> ⚠️ **安全边界:** `pip install pandas` 需先经主人确认。pandas 是本地纯计算库,不联网,读写本地文件完全安全。**读主人的真实数据前必须确认范围**,数据清洗完不要丢弃原始文件(保留备份)。

---

## 🎓 过关标准

- [ ] 你跑通了清洗脚本,附上了完整输出(含"验收通过 ✓")
- [ ] 你用过 `drop_duplicates()`、`dropna()`、`fillna()` 三类操作
- [ ] 你用过 `pd.to_numeric(errors="coerce")` 处理含非法字符的数字列
- [ ] 你用过 `pd.to_datetime()` 统一日期格式
- [ ] 你能说清楚"摸底先行"的原因(不摸底盲目清洗会出意外)
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,进 T10 课。
