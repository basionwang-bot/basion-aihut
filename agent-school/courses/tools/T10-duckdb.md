# 第 T10 课 · DuckDB 用 SQL 秒查一个大 CSV

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课 ｜ 难度:★★☆ ｜ 源头:DuckDB 官方文档 · [duckdb.org/docs](https://duckdb.org/docs/current/) · GitHub: [duckdb/duckdb](https://github.com/duckdb/duckdb)

---

## 📖 你要学会什么

学完这一课,你能对着一个几十万行的 CSV 文件,用 SQL 一行命令秒出结果——分组、聚合、过滤、排序——而不是先把整张表读进内存再慢慢处理。

想象你是一个仓库管理员,面前摆了 50 万张出库单。你要找出"去年哪个产品类别出库最多"。传统方法是:把 50 万张单子全搬进办公室,一张一张数。pandas 是:把 50 万行全装进 RAM,再计算。**DuckDB 不一样**——它像一台装在你口袋里的 SQL 超级服务器:你对着仓库喊"按类别汇总出库量",它直接在仓库里统计好了告诉你答案,**一行都不用搬进来**。

DuckDB 是一个**嵌入式 OLAP 数据库**——不需要安装服务器、不需要配置、直接在 Python 进程里跑。1.3.x 版本(2025 年最新)用向量化执行引擎,查百万行 CSV 通常比 pandas 快 5–50 倍,内存占用也低很多。

**官方资料:**
- 官方文档: [duckdb.org/docs](https://duckdb.org/docs/current/)
- Python API 文档: [duckdb.org/docs/current/clients/python/overview](https://duckdb.org/docs/current/clients/python/overview.html)
- GitHub: [github.com/duckdb/duckdb](https://github.com/duckdb/duckdb)
- PyPI: [pypi.org/project/duckdb](https://pypi.org/project/duckdb)

---

## 🧠 核心原则(内化成习惯)

1. **不用把数据"装进"DuckDB,直接查文件。** DuckDB 最惊艳的能力是:`SELECT * FROM 'data.csv' WHERE ...`——直接对文件写 SQL,完全不需要先导入。对 Parquet、JSON、甚至 S3 上的文件同样可以。文件不动、数据不搬。

2. **标准 SQL,没有新语言要学。** DuckDB 说的是标准 SQL。你会 MySQL / PostgreSQL 的语法,DuckDB 基本无障碍。唯一需要学的是几个它独有的语法糖(比如 `SUMMARIZE`、`PIVOT`),用到了再查文档。

3. **连接(Connection)是大门,关了大门才算完。** 用 Python API 时养成习惯:用 `with duckdb.connect() as con:` 上下文管理器,自动关连接,不留资源泄漏。

4. **结果可以直接转 pandas DataFrame。** `con.execute("SELECT ...").df()` 一步出 DataFrame,和 pandas 完美衔接。查询用 DuckDB 快,后续展示/复杂变换再转 pandas。

5. **内存数据库 vs 持久数据库。** `duckdb.connect()` 是内存数据库,关了什么都没了;`duckdb.connect("mydb.db")` 会把数据持久化到文件。脚本里临时分析用内存版就够,想保留中间结果才建文件版。

---

## 🛠 操作要点

### 安装

```bash
pip install duckdb
```

> 🇨🇳 **中国用户提示:** pip 直接安装,无需科学上网。加速可用清华镜像:
> `pip install duckdb -i https://mirrors.tuna.tsinghua.edu.cn/pypi/web/simple/`

### 最小可运行示例(离线,先生成测试 CSV)

```python
import duckdb
import csv

# ---- 第一步:生成测试 CSV(10 万行模拟销售数据) ----
import random
import datetime

random.seed(42)
categories = ["电子", "服装", "食品", "家居", "图书"]
cities = ["北京", "上海", "广州", "深圳", "成都"]

with open("/tmp/sales.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["order_id", "date", "category", "city", "amount", "qty"])
    for i in range(100_000):
        date = datetime.date(2024, random.randint(1, 12), random.randint(1, 28))
        writer.writerow([
            f"ORD{i:07d}",
            date.isoformat(),
            random.choice(categories),
            random.choice(cities),
            round(random.uniform(50, 5000), 2),
            random.randint(1, 10),
        ])

print("测试 CSV 已生成: /tmp/sales.csv (10 万行)")
```

```python
import duckdb

# ---- 第二步:直接对文件跑 SQL,不用导入 ----
with duckdb.connect() as con:

    # 查总行数
    total = con.execute("SELECT COUNT(*) FROM '/tmp/sales.csv'").fetchone()[0]
    print(f"总行数: {total:,}")

    # 按类别汇总销售额,取 Top 3
    print("\n各类别销售额 Top 3:")
    result = con.execute("""
        SELECT
            category AS 类别,
            COUNT(*)  AS 订单数,
            ROUND(SUM(amount), 2) AS 总销售额,
            ROUND(AVG(amount), 2) AS 平均客单价
        FROM '/tmp/sales.csv'
        GROUP BY category
        ORDER BY 总销售额 DESC
        LIMIT 3
    """).fetchall()
    for row in result:
        print(f"  {row[0]:4s}  订单:{row[1]:6,}  总额:{row[2]:>12,.2f}  均价:{row[3]:,.2f}")

    # 按城市+月份分组(时间函数)
    print("\n各城市 2024 年 Q1 销售额:")
    df = con.execute("""
        SELECT
            city AS 城市,
            MONTH(CAST(date AS DATE)) AS 月份,
            ROUND(SUM(amount), 2) AS 销售额
        FROM '/tmp/sales.csv'
        WHERE MONTH(CAST(date AS DATE)) <= 3
        GROUP BY city, 月份
        ORDER BY 城市, 月份
    """).df()  # 直接转成 pandas DataFrame
    print(df.to_string(index=False))
```

### 常用操作速查

```python
import duckdb

with duckdb.connect() as con:
    # 直接查 CSV(最简洁)
    con.execute("SELECT * FROM 'data.csv' LIMIT 5").fetchall()

    # 注册 DataFrame 当表用(和 pandas 混用)
    import pandas as pd
    df = pd.read_csv("data.csv")
    con.register("my_table", df)
    con.execute("SELECT COUNT(*) FROM my_table").fetchone()

    # 快速摘要(DuckDB 特有)
    con.execute("SUMMARIZE SELECT * FROM 'data.csv'").df()

    # 把查询结果存成新 CSV
    con.execute("""
        COPY (
            SELECT category, SUM(amount) AS total
            FROM 'data.csv'
            GROUP BY category
        ) TO '/tmp/summary.csv' (HEADER, DELIMITER ',')
    """)

    # 结果转 DataFrame
    df_result = con.execute("SELECT * FROM 'data.csv' WHERE amount > 1000").df()

    # 结果转 list of tuples
    rows = con.execute("SELECT * FROM 'data.csv' LIMIT 10").fetchall()

    # 结果转 dict list
    records = con.execute("SELECT * FROM 'data.csv' LIMIT 10").fetchdf().to_dict("records")
```

### 常用 SQL 速查(DuckDB 方言)

| 想干嘛 | SQL 片段 |
|--------|---------|
| 查总行数 | `SELECT COUNT(*) FROM 'f.csv'` |
| 快速摘要 | `SUMMARIZE SELECT * FROM 'f.csv'` |
| 按列分组统计 | `GROUP BY col` |
| 时间提取月份 | `MONTH(CAST(col AS DATE))` |
| 字符串包含 | `WHERE col LIKE '%关键词%'` |
| 列改名 | `col AS 别名` |
| 结果写 CSV | `COPY (...) TO 'out.csv' (HEADER)` |
| 读 Parquet | `FROM 'data.parquet'` |
| 列转行 | `UNPIVOT ...` |

---

## 📝 毕业测验(必须真做,交证据)

**任务:生成一份 10 万行订单 CSV,用 DuckDB SQL 完成 3 次分析查询,输出结果文件。完全离线可跑。**

**完整脚本**(`/tmp/duckdb_task.py`):

```python
import duckdb
import csv
import random
import datetime

# ---- 1. 生成测试数据 ----
random.seed(99)
categories = ["电子", "服装", "食品", "家居", "图书"]
cities = ["北京", "上海", "广州", "深圳", "成都"]
data_path = "/tmp/orders_100k.csv"

with open(data_path, "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["order_id", "date", "category", "city", "amount", "qty"])
    for i in range(100_000):
        date = datetime.date(2024, random.randint(1,12), random.randint(1,28))
        w.writerow([f"ORD{i:07d}", date, random.choice(categories),
                    random.choice(cities), round(random.uniform(50, 8000), 2),
                    random.randint(1, 10)])

print(f"数据已生成: {data_path}")

# ---- 2. 三次查询 ----
with duckdb.connect() as con:

    # 查询一:各类别总销售额排行
    print("\n【查询一】各类别总销售额排行:")
    q1 = con.execute(f"""
        SELECT category, COUNT(*) AS 订单数, ROUND(SUM(amount),2) AS 总销售额
        FROM '{data_path}'
        GROUP BY category
        ORDER BY 总销售额 DESC
    """).df()
    print(q1.to_string(index=False))

    # 查询二:找出单笔金额超 7000 的高价订单数量(按城市)
    print("\n【查询二】单笔 > 7000 的大额订单(按城市):")
    q2 = con.execute(f"""
        SELECT city AS 城市, COUNT(*) AS 大额订单数
        FROM '{data_path}'
        WHERE amount > 7000
        GROUP BY city
        ORDER BY 大额订单数 DESC
    """).df()
    print(q2.to_string(index=False))

    # 查询三:每月销售额趋势
    print("\n【查询三】2024 年各月总销售额:")
    q3 = con.execute(f"""
        SELECT
            MONTH(CAST(date AS DATE)) AS 月份,
            ROUND(SUM(amount), 2) AS 月销售额,
            COUNT(*) AS 订单数
        FROM '{data_path}'
        GROUP BY 月份
        ORDER BY 月份
    """).df()
    print(q3.to_string(index=False))

    # ---- 3. 保存汇总结果 ----
    con.execute(f"""
        COPY (
            SELECT category, ROUND(SUM(amount),2) AS total_sales
            FROM '{data_path}'
            GROUP BY category
            ORDER BY total_sales DESC
        ) TO '/tmp/category_summary.csv' (HEADER, DELIMITER ',')
    """)
    print("\n类别汇总已保存到 /tmp/category_summary.csv")

    # ---- 4. 验收 ----
    row_count = con.execute(f"SELECT COUNT(*) FROM '{data_path}'").fetchone()[0]
    assert row_count == 100_000, f"应有 10 万行,实际 {row_count}"
    assert len(q1) == 5, "应有 5 个类别"
    assert len(q3) == 12, "应有 12 个月份"
    print("\n验收通过 ✓")
```

**要交的证据:**
- 三次查询的真实输出(含表格和"验收通过 ✓")
- 说明查询耗时感受(10 万行通常在 1 秒内完成)

**沉淀技能卡**:把"直接查文件的 SQL 写法 + 结果转 DataFrame + 保存 CSV"沉淀成 `skills/duckdb.md`。

> ⚠️ **安全边界:** `pip install duckdb` 需先经主人确认。DuckDB 是本地纯计算库,不联网,默认不持久化(内存模式)。读主人的真实数据文件前需确认范围。

---

## 🎓 过关标准

- [ ] 你跑通了完整脚本,附上了三次查询的真实输出(含"验收通过 ✓")
- [ ] 你用过 `FROM 'file.csv'` 直接对文件跑 SQL(不需要先导入)
- [ ] 你用过 `GROUP BY + SUM/COUNT` 做聚合分析
- [ ] 你用过 `.df()` 把查询结果转成 pandas DataFrame
- [ ] 你用过 `COPY (...) TO 'output.csv'` 保存查询结果
- [ ] 你能说清楚 DuckDB 比 pandas 快的核心原因(向量化执行,不全量加载内存)
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,进 T11 课。
