# 第 Z33 课 · CRM 数据清洗与打标

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课、T09-pandas 课、J14-data-minimization 课 ｜ 难度:★★☆ ｜ 源头:pandas 官方文档 [pandas.pydata.org](https://pandas.pydata.org/docs/) · Salesforce 数据质量指南 [help.salesforce.com/s/articleView?id=sf.data_quality.htm](https://help.salesforce.com/s/articleView?id=sf.data_quality.htm) · 《数据密集型应用系统设计》第三章

---

## 📖 你要学会什么

学完这一课,你会帮主人把一份"用久了已经乱成一锅粥"的 CRM 客户数据,清洗成**字段规范、去重完毕、打好标签**的干净数据集,并交付一份可以直接导回 CRM 的 Excel 文件 + 数据质量改善报告。

先说说为什么 CRM 数据会脏。

CRM 是多个人在不同时间、用不同手机/电脑填的。张三填"北京市海淀区",李四填"北京海淀",王五填"Haidian Beijing"——说的是同一个地方,数据库里是三条不同的值。更麻烦的是:同一个客户被不同销售各录了一遍,名字微微不同,结果系统里是两条记录,两个销售都在跟进,客户被骚扰了两次,还互相不知道。

这个问题在国内中小企业的 CRM 里极其普遍,因为大家录数据的时候根本没有统一规范,而且没有人负责"定期清一遍"这件事。

你的任务就是:"定期清一遍"这件事的执行者。

想象你是图书馆管理员。图书馆有几千本书,但因为没人管,书名写法乱了(《西游记》《西游记(精装版)》《Journey to the West》……),同一本书进了三个书架。你的任务是把书名统一、把重复的挑出来、给每本书按类型贴好分类标签——这样读者和馆员找书才方便。

**关于 CRM 系统账号(铁律:不登录、不直接操作):**

- 主人可能使用的 CRM:纷享销客、销售易、Zoho CRM、Salesforce、飞书 CRM、钉钉 CRM 等。
- 你的工作方式:**主人把数据导出成 Excel/CSV 交给你,你处理完再交还给主人,由主人导回系统**。
- 你**绝不登录任何 CRM 账号**,也**不直接操作数据库**。

> ⚠️ **CRM 里的客户数据是高度敏感的商业信息和个人隐私的混合体**。处理前必须向主人确认:①数据已合法取得;②处理目的是改善数据质量;③脚本运行环境安全(不上传到第三方云端)。遵循数据最小化原则:只处理业务必需的字段,不分析、不保留无关隐私字段。

---

## 🧠 核心原则(内化成习惯)

**1. 先摸清字段含义,再动手清洗**

每家公司的 CRM 字段定义不一样。比如"客户状态"这个字段,有的公司填的是"意向/成交/流失",有的填的是"A/B/C/D",有的填的是"跟进中/已签约/无效"——清洗之前先问主人:"这些值分别是什么意思?你们内部的标准是什么?"

**2. 清洗原则:只清洗,不删除(先备份)**

清洗过程中遇到疑问记录,**不直接删掉任何一行**。删错了数据很难找回来。正确做法是:
- 新增"清洗备注"列,写明这行数据的问题
- 可疑重复的标注出来让主人确认
- 最终版本和原始版本都保留

**3. 标签要有业务含义,不是为了贴而贴**

给客户打"大客户/中客户/小客户"的标签是没用的,因为这个维度任何人都知道。有用的标签是和业务动作挂钩的,比如:"已流失-可召回"(对应召回运营)、"高频询价-未成交"(对应价格疑虑跟进)、"成交-半年内未复购"(对应复购激活)。

**4. 隐私字段的处理红线**

清洗任务中经常会遇到:手机号、身份证号、家庭住址、私人邮箱。

- 手机号和工作邮箱:可以做格式校验和去重,不要展示在报告里
- 身份证号/家庭住址:除非主人有明确业务需求,应提醒主人是否有必要保留在 CRM 里
- 所有处理必须在主人的本地环境或主人授权的安全环境中进行

**5. 报告要让主人知道"做了什么、改善了多少"**

清洗后给一个对比:"清洗前有 3200 条,清洗后去重剩 2870 条,标准化后字段缺失率从 34% 降到 9%"——这比说"数据已清洗"有用一百倍。

---

## 🛠 操作要点

### 第一步:数据质检

```python
import pandas as pd

df = pd.read_excel("crm_export.xlsx")

print("=== CRM 数据质检报告 ===")
print(f"总记录数: {len(df)}")
print(f"字段列表: {df.columns.tolist()}")
print("\n各字段缺失率:")
missing = df.isnull().mean().round(3).sort_values(ascending=False)
print(missing[missing > 0])

# 检查常见问题字段
if "手机" in df.columns:
    print(f"\n手机号非空行数: {df['手机'].notna().sum()}")
if "客户名称" in df.columns:
    print(f"\n客户名称重复数(精确匹配): {df['客户名称'].duplicated().sum()}")
```

### 第二步:字段标准化

```python
import re

def std_phone(val):
    """手机号格式标准化:提取11位数字,加 +86 前缀"""
    if pd.isna(val):
        return None
    digits = re.sub(r'\D', '', str(val))
    if len(digits) == 11 and digits.startswith('1'):
        return digits
    if len(digits) == 13 and digits.startswith('86'):
        return digits[2:]
    return None  # 格式异常,标注待核查

def std_region(val):
    """省份标准化:统一为两字简称"""
    REGION_MAP = {
        "北京市": "北京", "上海市": "上海", "广东省": "广东",
        "浙江省": "浙江", "江苏省": "江苏", "四川省": "四川",
        "Beijing": "北京", "Shanghai": "上海", "Guangdong": "广东",
        # ... 可继续扩展
    }
    if pd.isna(val):
        return None
    val_str = str(val).strip()
    for k, v in REGION_MAP.items():
        if k in val_str or val_str == k:
            return v
    return val_str  # 无法识别的保留原值,标注待核查

def std_industry(val):
    """行业标准化:合并同义词"""
    INDUSTRY_MAP = {
        "互联网": ["互联网", "IT", "软件", "科技", "tech", "internet"],
        "制造业": ["制造", "工厂", "生产", "manufacturing"],
        "金融": ["金融", "银行", "保险", "投资", "finance"],
        "医疗": ["医疗", "医院", "健康", "health", "pharma", "医药"],
    }
    if pd.isna(val):
        return None
    val_lower = str(val).lower()
    for standard, keywords in INDUSTRY_MAP.items():
        if any(k in val_lower for k in keywords):
            return standard
    return str(val)  # 无法识别,保留原值

df["手机_标准"] = df["手机"].apply(std_phone)
df["省份_标准"] = df.get("省份", df.get("地区", pd.Series())).apply(std_region)
df["行业_标准"] = df.get("行业", pd.Series()).apply(std_industry)
```

### 第三步:去重

```python
from rapidfuzz import fuzz, process

# 精确去重:完全相同的客户名
exact_dups = df[df.duplicated(subset=["客户名称"], keep=False)]
print(f"精确重复客户名: {len(exact_dups)} 行")

# 模糊去重:名字相似的候选对
def find_fuzzy_dups(names, threshold=85):
    results = []
    name_list = list(names.dropna().unique())
    for i, name in enumerate(name_list):
        matches = process.extract(name, name_list[i+1:],
                                   scorer=fuzz.token_sort_ratio, limit=2)
        for match_name, score, _ in matches:
            if score >= threshold:
                results.append({"名称A": name, "名称B": match_name, "相似度": score})
    return pd.DataFrame(results)

fuzzy_dup_df = find_fuzzy_dups(df["客户名称"])
print(f"\n疑似模糊重复: {len(fuzzy_dup_df)} 对")
fuzzy_dup_df.to_excel("待确认重复.xlsx", index=False)
print("→ 请主人核查 '待确认重复.xlsx' 后告知哪些需要合并")
```

### 第四步:打标签

```python
def assign_tag(row):
    """
    根据客户数据打业务标签
    标签是例子,实际标签定义须由主人提供
    """
    tags = []

    # 成交状态
    status = str(row.get("客户状态", "")).strip()
    if "成交" in status or "签约" in status:
        tags.append("已成交")
    elif "流失" in status or "无效" in status:
        tags.append("已流失")
    elif "跟进" in status or "意向" in status:
        tags.append("跟进中")

    # 最近活跃度(如果有最后联系日期字段)
    last_contact = row.get("最后联系日期")
    if pd.notna(last_contact):
        import datetime
        days_ago = (pd.Timestamp.now() - pd.Timestamp(last_contact)).days
        if days_ago > 180:
            tags.append("沉睡客户")
        elif days_ago <= 30:
            tags.append("近期活跃")

    # 规模标签(示例)
    scale = row.get("公司规模人数", 0)
    if isinstance(scale, (int, float)):
        if scale >= 500:
            tags.append("大客户")
        elif scale >= 50:
            tags.append("中客户")
        else:
            tags.append("小客户")

    return "、".join(tags) if tags else "待补充"

df["业务标签"] = df.apply(assign_tag, axis=1)
```

### 第五步:产出清洗报告和干净数据集

```
【CRM 数据清洗报告】
处理日期:XXXX年X月X日
处理人:AI agent(由主人发起)

【数据概况对比】
                  清洗前     清洗后
总记录数:        XXXX       XXXX
精确重复行数:      XX         0(已标注,待主人确认合并)
手机号有效率:      XX%        XX%
行业字段填写率:    XX%        XX%
省份字段标准化:    多种写法    统一简称

【发现的主要问题】
1. 客户名称精确重复 XX 对,已标注到"清洗备注"列
2. 疑似模糊重复 XX 对,已导出"待确认重复.xlsx"请主人核查
3. 手机号格式异常 XX 条(含空格/短横线/非11位等),已标注
4. 行业字段有 XX 种写法,已统一为 XX 个标准分类
5. 发现以下记录包含不必要的敏感字段[如身份证号]:建议主人评估是否保留

【标签分布】
已成交:XX 条 | 跟进中:XX 条 | 已流失:XX 条 | 待补充:XX 条
大客户:XX 条 | 中客户:XX 条 | 小客户:XX 条
沉睡客户(180天未联系):XX 条

【交付文件清单】
- crm_cleaned.xlsx:清洗后的干净数据,可导入 CRM
- 待确认重复.xlsx:需要主人判断是否合并的模糊重复对
- crm_original_backup.xlsx:原始数据备份(请妥善保管)

【合规声明】
- 数据来源:主人提供的 CRM 导出文件
- 处理范围:格式标准化、去重标注、标签添加
- 未上传至任何第三方平台
- 敏感字段处理:[说明]
```

---

## 🧰 配套开源项目(可选集成)

> 这门课的活,也有现成开源项目能帮你省力。**连真实数据库/客户数据/账号前先问主人**,优先只读、先脱敏、用完即删;星数为调研约数,装前再核。

- **Twenty** ([github.com/twentyhq/twenty](https://github.com/twentyhq/twenty), ~45k★) —— AI 时代的开源 CRM,界面现代,支持自托管。**用法**:把清洗打标后的客户数据直接导入 Twenty,作为清洗成果的落地平台,让销售团队在干净数据上开始工作。国内可自部署,数据不外传。

- **EspoCRM** ([github.com/espocrm/espocrm](https://github.com/espocrm/espocrm), ~2k★) —— 上手门槛低的开源 CRM,功能轻量、配置简单,适合中小团队快速落地。**用法**:如果团队不熟悉 Twenty,EspoCRM 是门槛更低的替代选择,导入干净 CSV 即可开始使用。诚实提示:星数较少,社区规模小于 Twenty,但稳定性口碑不错。

---

## 📝 毕业测验(必须真做,交证据)

**任务:用以下模拟 CRM 数据完整走一遍清洗+打标流程,产出可交付的干净数据集和质检报告。**

**模拟数据(自己生成):**

```python
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

np.random.seed(42)
n = 80

companies = [
    "上海锐达科技有限公司", "上海锐达科技", "北京智云软件",  # 模拟精确重复和模糊重复
    "北京智云软件有限公司", "广州明远制造", "广州明远制造厂",
    "成都天创医疗", "深圳优联网络科技", "杭州西子电商", "武汉鑫诚科技",
]
companies = companies + [f"客户公司{i}" for i in range(n - len(companies))]

df = pd.DataFrame({
    "客户名称": np.random.choice(companies[:10], n),  # 人为制造重复
    "联系人": [f"联系人{i}" for i in range(n)],
    "手机": (
        [f"138{np.random.randint(10000000, 99999999)}" for _ in range(60)] +
        ["13800-138-000", "abc123", "+86 13911112222", None, None,
         "021-12345678", "400-888-9999", "15000000000 ", "17712345678",
         "139 0000 1111", "13x00001111", "13000001111", "14012345678",
         "16000001111", "18000001111", "19912345678", "12345678901",
         "13812345", "138123456789", "1381234567"]
    )[:n],
    "邮箱": [f"user{i}@company{np.random.randint(1,20)}.com" if i % 5 != 0 else None for i in range(n)],
    "行业": np.random.choice(
        ["互联网", "IT", "软件", "制造", "生产", "制造业", "医疗", "health", "金融", "finance"],
        n
    ),
    "省份": np.random.choice(
        ["北京市", "上海市", "广东省", "Beijing", "Shanghai", "Guangdong", "浙江", "江苏省"],
        n
    ),
    "公司规模人数": np.random.choice([10, 50, 100, 200, 500, 1000, None], n),
    "客户状态": np.random.choice(["成交", "跟进中", "流失", "意向", "无效", "签约", None], n),
    "最后联系日期": [
        (datetime.now() - timedelta(days=np.random.randint(0, 400))).strftime("%Y-%m-%d")
        if i % 7 != 0 else None for i in range(n)
    ],
})

df.to_excel("/tmp/crm_export.xlsx", index=False)
print(f"模拟 CRM 数据已生成:{len(df)} 条记录")
```

**你需要做到:**

1. **运行质检脚本**,写出真实的字段缺失率和重复情况。

2. **完成字段标准化**:手机号、省份、行业三个字段全部清洗,写出清洗前后的对比数量。

3. **找出精确重复和模糊重复**,标注清楚,导出"待确认重复.xlsx"。

4. **给每条记录打业务标签**,并统计各标签的数量分布。

5. **按交付物格式产出完整清洗报告**,包含合规声明(写"使用模拟数据,无真实用户隐私")。

6. **沉淀技能卡**:把 CRM 清洗流程沉淀成 `skills/crm-cleanup.md`。

> ⚠️ **铁律再重申:只处理主人提供的数据,不登录任何 CRM 系统账号,不把数据上传至第三方平台。发现不必要的敏感字段(如身份证号),第一时间提醒主人而不是直接处理。**

---

## 🎓 过关标准

- [ ] 质检报告**有真实输出**:各字段缺失率、重复行数都有数字
- [ ] 字段标准化**有前后对比**:手机/省份/行业各清洗了多少条、发现了多少异常格式
- [ ] 重复记录**已找出并标注**,没有自动删除(交给主人确认)
- [ ] 业务标签**有具体数量分布**,每个标签是什么意思都解释清楚了
- [ ] 清洗报告里有**合规声明**
- [ ] 全程**没有登录任何 CRM 系统、没有把数据上传至第三方**(可核验)
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,然后填 [结业报告](../../templates/graduation-report-template.md),把清洗后的数据集和报告当面交到主人手上。
