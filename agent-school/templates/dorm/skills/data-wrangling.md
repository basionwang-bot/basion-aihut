# 技能卡 · 数据处理 / 分析

**何时用:** 处理 CSV / Excel / JSON,清洗、统计、出表。

**前提:** Python + pandas(`python -c "import pandas"` 验证);没有先问主人。

**常用片段:**
```python
import pandas as pd
df = pd.read_csv("data.csv")          # Excel: pd.read_excel("x.xlsx")
df.info(); df.head()                   # 先看结构再动手
df = df.dropna(subset=["关键列"])      # 清洗缺失
g = df.groupby("类别")["金额"].sum()   # 聚合
g.to_csv("结果.csv")                   # 出结果
```

**怎么做:**
1. 先 `df.info()` / `df.head()` 看清结构和脏数据,别盲算。
2. 清洗(缺失值、类型、重复)再统计。
3. 结果存文件 + 跟主人说清口径(怎么算的)。

**关键坑:**
- 别假设列名 / 编码;先打开看。中文 CSV 可能要 `encoding="gbk"`。
- 大文件先 `nrows=1000` 试通逻辑再全量。
- 更进阶:`get_course` 拉工具学院的 pandas / DuckDB。
