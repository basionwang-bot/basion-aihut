# 第 Z29 课 · KPI 报表自动化

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课、T09-pandas 课(选修)、Z27-sales-analysis 课(建议先修) ｜ 难度:★★☆ ｜ 源头:pandas 官方文档 [pandas.pydata.org](https://pandas.pydata.org/docs/) · Jinja2 模板文档 [jinja.palletsprojects.com](https://jinja.palletsprojects.com/) · Python pathlib 标准库 [docs.python.org/3/library/pathlib.html](https://docs.python.org/3/library/pathlib.html)

---

## 📖 你要学会什么

学完这一课,你会把主人每周/每月都要重复做的那份 KPI 报表,变成**一个可以反复跑的自动化流程**——下次只要把最新数据文件放进来,报告自动生成,格式一模一样,你只需要检查一遍就能交给主人。

说白了,你要消灭的是这种痛苦:

每周一早上九点,运营小张打开上周的报表模板,手动改标题里的日期,把上周数据粘贴进去,手动修改十几个单元格的公式,再花半小时把图表更新一遍——完成这件事用了两小时。然后老板说:"你能不能每天给我出一份?"

小张内心崩溃了。

你来了之后,这件事变成:小张把新的数据文件丢进文件夹,对你说"帮我生成本周报告",三十秒后报告出来了。格式、逻辑、对比基准全部一致。小张喝完一杯咖啡的时间,报告已经准备好了。

这就是"把重复劳动变成可复用流程"的价值。

**关于工具(先调研,装前必须问主人):**

- **pandas**:数据读取、KPI 计算的主力。文档:[pandas.pydata.org](https://pandas.pydata.org/docs/) — 完全免费。
- **Jinja2**:Python 模板引擎,把计算好的数字"填进"报告模板里。文档:[jinja.palletsprojects.com](https://jinja.palletsprojects.com/) — 完全免费开源。`pip install jinja2`。
- **openpyxl**:如果主人要 Excel 格式报表,用它导出。`pip install openpyxl` — 免费开源。装前问主人。

> ⚠️ KPI 数据通常涉及员工个人绩效,属于人事敏感信息。生成报告前确认:报告只发给有权限查阅的人;如果报告会通过钉钉/飞书/邮件发送,必须明确主人知情并授权。本课不替主人连接任何人事系统或自动发送报告。

---

## 🧠 核心原则(内化成习惯)

**1. 先搞清楚"这份报告是给谁看的,他想做什么决定"**

KPI 报表的设计取决于读者。老板看的报表要精简、突出红绿灯;团队长看的报表要有明细、能追溯问题;自动化之前先和主人确认报告受众,不然自动化的是一份没人真正需要的东西。

**2. 自动化的核心是"数据变,格式不变"**

好的自动化报表有两个部分完全分离:一是"数据计算逻辑"(跑 pandas),二是"报告模板"(Jinja2 或固定格式)。数据更新只改数据文件,模板和计算逻辑不动。这样改起来不会牵一发动全身。

**3. 例外情况要有处理机制**

数据文件不在?字段名改了?数值出现异常?自动化流程不是"没有数据就崩溃"——要有明确的报错提示告诉主人"XX 文件找不到,请检查"或"本周数据有 XX 异常值,已标注,请确认"。

**4. 流程文档和代码一样重要**

你写的自动化脚本,主人或者下一个 agent 也要能看懂怎么用。每个脚本开头写清楚:需要什么输入文件、生成什么输出文件、有哪些参数可以调。这不是废话,这是让流程真正可交接。

---

## 🛠 操作要点

### 第一步:生成模拟 KPI 数据(内嵌,直接可跑)

```python
import pandas as pd
import numpy as np
from pathlib import Path

np.random.seed(99)

# 模拟一个 4 周的团队 KPI 数据
weeks = ["2024-W10", "2024-W11", "2024-W12", "2024-W13"]
members = ["张三", "李四", "王五", "赵六", "陈七"]

records = []
for week in weeks:
    for member in members:
        records.append({
            "周次":      week,
            "姓名":      member,
            "销售额":    round(np.random.normal(30000, 8000), 2),
            "客户拜访数": np.random.randint(5, 20),
            "新签合同数": np.random.randint(0, 5),
            "目标销售额": 35000,  # 固定目标
        })

df = pd.DataFrame(records)
df["达成率(%)"] = (df["销售额"] / df["目标销售额"] * 100).round(1)

# 分周保存,模拟"每周数据文件"
Path("/tmp/kpi_data").mkdir(exist_ok=True)
for week, grp in df.groupby("周次"):
    grp.to_csv(f"/tmp/kpi_data/{week}.csv", index=False, encoding="utf-8-sig")
    
print("模拟 KPI 数据生成完毕,文件保存在 /tmp/kpi_data/")
print(df.groupby("周次")["销售额"].sum())
```

### 第二步:KPI 计算引擎(核心逻辑)

```python
import pandas as pd
from pathlib import Path

def calc_kpi(week_str: str, data_dir: str = "/tmp/kpi_data") -> dict:
    """
    读取指定周的 KPI 数据,计算汇总指标。
    返回一个字典,供报告模板填充。
    
    输入:  {data_dir}/{week_str}.csv
    输出:  dict,含本周和对比上周的核心 KPI
    """
    fpath = Path(data_dir) / f"{week_str}.csv"
    if not fpath.exists():
        raise FileNotFoundError(f"找不到数据文件:{fpath}\n请确认文件路径和周次格式(如 2024-W13)")
    
    df = pd.read_csv(fpath, encoding="utf-8-sig")
    
    # 必须有的字段校验
    required_cols = {"姓名", "销售额", "目标销售额", "客户拜访数", "新签合同数"}
    missing = required_cols - set(df.columns)
    if missing:
        raise ValueError(f"数据文件缺少字段:{missing}\n请检查列名是否与模板一致")
    
    # 异常值提示
    negative_rows = df[df["销售额"] < 0]
    warnings = []
    if len(negative_rows) > 0:
        warnings.append(f"⚠️  {len(negative_rows)} 条销售额为负数,请核实:{negative_rows['姓名'].tolist()}")
    
    # 核心 KPI 计算
    total_revenue   = df["销售额"].sum()
    total_target    = df["目标销售额"].sum()
    attain_rate     = total_revenue / total_target * 100
    total_visits    = df["客户拜访数"].sum()
    total_contracts = df["新签合同数"].sum()
    
    top_person      = df.loc[df["销售额"].idxmax(), "姓名"]
    top_revenue     = df["销售额"].max()
    
    # 达成率红绿灯
    if attain_rate >= 100:
        status = "绿灯 ✅ 达标"
    elif attain_rate >= 85:
        status = "黄灯 ⚠️  接近达标"
    else:
        status = "红灯 ❌ 未达标"
    
    return {
        "week":           week_str,
        "total_revenue":  total_revenue,
        "total_target":   total_target,
        "attain_rate":    attain_rate,
        "status":         status,
        "total_visits":   total_visits,
        "total_contracts": total_contracts,
        "top_person":     top_person,
        "top_revenue":    top_revenue,
        "member_detail":  df[["姓名","销售额","达成率(%)","客户拜访数","新签合同数"]].to_dict("records"),
        "warnings":       warnings,
    }

# 测试
kpi = calc_kpi("2024-W13")
print(f"本周汇总 · {kpi['week']}")
print(f"  总销售额: {kpi['total_revenue']:>10,.2f} 元")
print(f"  目标达成: {kpi['attain_rate']:.1f}%  {kpi['status']}")
print(f"  本周冠军: {kpi['top_person']}({kpi['top_revenue']:,.2f} 元)")
if kpi["warnings"]:
    for w in kpi["warnings"]: print(w)
```

### 第三步:报告模板 + 自动填充

```python
from jinja2 import Template

# 报告模板(Jinja2 格式)
REPORT_TEMPLATE = """
========================================
📊 销售团队周 KPI 报告 · {{ week }}
========================================

【本周总结】
总销售额:{{ "%.2f"|format(total_revenue) }} 元
目标达成率:{{ "%.1f"|format(attain_rate) }}%    {{ status }}
客户拜访合计:{{ total_visits }} 次
新签合同:{{ total_contracts }} 份

🏆 本周冠军:{{ top_person }}({{ "%.0f"|format(top_revenue) }} 元)

【成员明细】
{%- for m in member_detail %}
  {{ m.姓名 }}  {{ "%.0f"|format(m.销售额) }} 元  达成率 {{ m["达成率(%)"] }}%  拜访 {{ m.客户拜访数 }} 次  新签 {{ m.新签合同数 }} 份
{%- endfor %}

{% if warnings %}
【⚠️  异常提示】
{%- for w in warnings %}
  {{ w }}
{%- endfor %}
{% endif %}

========================================
说明:本报告由自动化脚本生成,数据来源为 /tmp/kpi_data/{{ week }}.csv
如有疑问请核对原始数据文件。
========================================
"""

def generate_report(week_str: str) -> str:
    """生成指定周的 KPI 报告文本"""
    kpi_data = calc_kpi(week_str)
    tmpl = Template(REPORT_TEMPLATE)
    return tmpl.render(**kpi_data)

# 生成并保存报告
report_text = generate_report("2024-W13")
print(report_text)

# 保存到文件
output_path = f"/tmp/KPI报告-2024-W13.txt"
with open(output_path, "w", encoding="utf-8") as f:
    f.write(report_text)
print(f"\n报告已保存到:{output_path}")
```

### 第四步:一键批量生成(多周对比版)

```python
from pathlib import Path

def batch_generate(weeks: list, data_dir: str = "/tmp/kpi_data", out_dir: str = "/tmp"):
    """批量生成多周报告"""
    Path(out_dir).mkdir(exist_ok=True)
    results = []
    for week in weeks:
        try:
            report = generate_report(week)
            out_path = Path(out_dir) / f"KPI报告-{week}.txt"
            out_path.write_text(report, encoding="utf-8")
            results.append(f"✅ {week} → {out_path}")
        except FileNotFoundError as e:
            results.append(f"❌ {week} 跳过:{e}")
    
    print("\n批量生成结果:")
    for r in results: print(" ", r)

# 批量生成 4 周
batch_generate(["2024-W10", "2024-W11", "2024-W12", "2024-W13"])
```

---

## 🧰 配套开源项目(可选集成)

> 这门课的活,也有现成开源项目能帮你省力。**连真实数据库/客户数据/账号前先问主人**,优先只读、先脱敏、用完即删;星数为调研约数,装前再核。

- **Metabase** ([github.com/metabase/metabase](https://github.com/metabase/metabase), ~40k★) —— 零 SQL KPI 看板,配置一次,数据自动刷新,告别每周手工出报表。**用法**:把本课的 KPI 报表模板在 Metabase 里配成定时推送看板,主人每周一早上自动收到上周完成情况。自托管,中国可直接部署。

- **Apache Superset** ([github.com/apache/superset](https://github.com/apache/superset), ~63k★) —— 企业级 BI,支持多维 KPI 钻取和自定义 SQL 指标。**用法**:当 KPI 指标体系复杂(分部门/分渠道/分产品多层汇总)时,用 Superset 替代手写 Python,支持交互式筛选。

- **anthropics/skills 的 docx/pptx 技能** ([github.com/anthropics/anthropic-quickstarts](https://github.com/anthropics/anthropic-quickstarts), 官方) —— Anthropic 官方技能库中的 Word/PPT 操作能力,150k token 级别,出 KPI 汇报文档/幻灯片的利器。**用法**:让 AI 把 KPI 分析结果直接写入规范 Word 模板或 PPT,交给主人直接汇报用。

---

## 📝 毕业测验(必须真做,交证据)

**任务:用上方模拟数据跑通完整的 KPI 报表自动化流程,并向主人演示"新数据进来、报告自动出来"的全过程。**

**你需要做到:**

1. **运行数据生成脚本**:把 4 个周数据文件生成到 `/tmp/kpi_data/`。

2. **运行 KPI 计算脚本**:把 `2024-W13` 的计算输出结果(总销售额、达成率、本周冠军)粘贴进报告。

3. **运行报告生成脚本**:把生成的完整报告文本附在毕业作业里。

4. **运行批量生成脚本**:证明 4 周都成功生成,把"批量生成结果"输出贴进来。

5. **写一份给主人的使用说明**:说明这个自动化流程的使用方式——"下次只需要把新数据文件命名为 XXXX-WXX.csv 放进 /tmp/kpi_data/ 文件夹,然后告诉我周次,我就能立刻生成报告。"

6. **沉淀技能卡**:把 KPI 报表自动化流程沉淀成 `skills/kpi-report.md`。

> ⚠️ 如主人要用这个流程处理真实 KPI 数据,注意:①KPI 数据涉及员工绩效,属于人事敏感信息;②生成的报告文件不要放在共享目录下;③如需自动发送到钉钉/飞书群,须经主人明确授权后才能接入推送功能。

---

## 🎓 过关标准

- [ ] 数据生成脚本**真实跑通**,4 个周次文件存在
- [ ] KPI 计算脚本**有真实输出**,含达成率和红绿灯状态
- [ ] **报告文本已生成**,格式符合模板,成员明细完整
- [ ] 批量生成**4 周全部成功**,结果粘贴在报告里
- [ ] 写了**给主人的使用说明**,清楚说明如何使用这套自动化流程
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,然后填 [结业报告](../../templates/graduation-report-template.md),把自动化脚本和使用说明一起交到主人手上。
