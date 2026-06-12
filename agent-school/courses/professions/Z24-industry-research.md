# 第 Z24 课 · 行业研究:怎么找可靠数据

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课、T04-jq 课 ｜ 难度:★★★ ｜ 源头:GitHub Awesome 系列 [github.com/topics/awesome](https://github.com/topics/awesome) · CNKI 中国知网公开报告 [cnki.net](https://www.cnki.net/) · 艾瑞咨询公开报告 [iresearch.cn](https://www.iresearch.cn/) · 中国互联网络信息中心(CNNIC)年度报告 [cnnic.cn](https://www.cnnic.cn/) · OSS Insight 开源数据平台 [ossinsight.io](https://ossinsight.io/) · 国家统计局数据库 [data.stats.gov.cn](https://data.stats.gov.cn/)

---

## 📖 你要学会什么

学完这一课,你会帮主人产出一份**有数据支撑的行业研究报告**——说清楚一个行业现在什么状况、有哪些可信的数据可以用、这些数据的来源和可信度是多少。更重要的是:你会知道**怎么找数据、怎么判断数据是否可靠**。

先说一个扎心的现实:AI agent 非常容易"编数据"。

你让 AI 帮你分析"中国 SaaS 市场规模",它可能会非常流畅地告诉你"2024 年中国 SaaS 市场规模为 XX 亿元,同比增长 XX%"——但这个数字是从哪来的?有没有原始报告?报告是哪家机构发的?

如果你没问这些,你可能在向主人引用一个根本不存在的数字。

这一课要培养你的"数据洁癖"——每一个出现在报告里的数字,都必须有**可追溯的原始来源**。

想象你是一名记者。记者有一条铁律:没有来源的消息不上稿。数字更是如此——听说"市场规模很大"没用,必须找到原始数据,标注是谁测量的、什么时候测量的、用什么方法测量的。

你的任务是:教会自己这套"找数据→验数据→用数据→标注数据"的完整流程。

---

## 🧠 核心原则(内化成习惯)

**1. Measured vs. Estimated:两个词必须区分**

- **Measured(实测数据)**:有明确统计方法和原始数据来源,如政府统计、IPO招股书披露、上市公司财报。
- **Estimated(估算数据)**:分析机构基于模型和样本推算出来的,有误差范围。如艾瑞咨询的市场规模报告、QuestMobile 的月活估算。

报告里的每个数字,都必须标明是 Measured 还是 Estimated。Estimated 的数据要注明估算机构和估算时间。

**2. 不引用二手数据,要找一手来源**

二手数据:某篇文章说"根据艾瑞咨询,中国 XX 市场规模为 XX 亿"
一手来源:艾瑞咨询的原始报告 PDF,第 X 页,图 X。

同样的数字,一手来源才能核实真伪。二手数据经常在转引中出错(数字被误读、被断章取义)。

**3. 警惕"数据老化"**

科技行业变化快,两年前的数据可能已经完全失效。引用数据时必须标注年份。原则:优先找最近 12 个月的数据;超过 2 年的数据,除非是历史趋势分析,否则谨慎引用。

**4. GitHub 是行业研究的宝藏,但要会读**

对于科技/AI/开发者工具类行业,GitHub 数据是少数可以做到"真实计数"的公开数据来源:
- Star 数 = 关注度信号(有偏差:可以买 Star,但趋势是真实的)
- Fork 数 = 实际使用意愿
- Issue/PR 活跃度 = 社区健康度
- Contributor 数 = 生态繁荣度

OSS Insight([ossinsight.io](https://ossinsight.io/))把 GitHub 公开数据做成了可查询的分析平台,可以直接查项目趋势对比。

**5. 报告里必须有"局限性声明"**

没有任何研究是完美的。每份报告结尾都要诚实写明:
- 数据覆盖的范围/时间
- 没能获取的数据(及原因)
- 结论适用的边界

这不是在贬低你的报告,这是在保护主人不被误导。

---

## 🛠 操作要点

### 可靠数据源优先级清单(国内场景)

```
【第一梯队:Measured,可直接引用】

① 国家统计局 data.stats.gov.cn
   — GDP/人口/行业产值等宏观数据
   — 完全免费,数据权威

② 上市公司财报/招股书
   — 企业自身披露,经过审计
   — 在巨潮资讯 cninfo.com.cn 可查 A 股公司
   — 港股在 hkexnews.hk 可查

③ 政府工信部/商务部公开数据
   — 产业发展数据、出口数据等
   — miit.gov.cn / mofcom.gov.cn

④ GitHub 原始数据
   — Star/Fork/Contributor/Issue 数量(实时抓取)
   — OSS Insight ossinsight.io 可视化查询

【第二梯队:Estimated,注明来源+日期】

⑤ 艾瑞咨询 iresearch.cn
   — 中国互联网/科技行业市场规模最常引用的来源之一
   — 部分报告免费,完整版付费
   — 标注:"数据来源:艾瑞咨询《XX报告》,XXXX年XX月,估算数据"

⑥ CNNIC(中国互联网络信息中心)cnnic.cn
   — 《中国互联网络发展状况统计报告》每年两期,免费下载
   — 网民规模/App使用习惯等数据权威

⑦ QuestMobile questmobile.com.cn
   — App 月活/日活/用户画像数据
   — 部分公开报告免费

⑧ 易观分析 analysys.cn
   — 各行业市场研究报告
   — 部分公开版免费

⑨ IDC/Gartner 中国报告
   — 科技行业规模数据
   — 通常通过新闻稿/媒体报道引用,原报告付费

【第三梯队:参考,谨慎引用,必须注明"参考数据"】

⑩ 知乎/微博/小红书 讨论量
   — 反映用户关注度,不是市场规模
   — 只用于定性判断,不做定量引用

⑪ 百度指数/微信指数
   — 搜索热度趋势,非实际市场数据

⑫ 媒体报道中的数字(36氪/虎嗅/钛媒体)
   — 必须追溯到原始来源才能引用
   — 不能只引用"据36氪报道",要找原始数据出处
```

### GitHub 行业调研操作指南

```bash
# GitHub API 查询项目数据(不需要认证即可访问基础数据)
# 以查询 AI 编程工具类项目为例

# 方法1:直接用 GitHub 搜索界面
# 在 github.com 搜索时可用过滤条件:
# topic:llm stars:>1000 language:python
# 这能找到 star 数超过1000的 Python LLM 相关项目

# 方法2:用 curl 调 GitHub API(免费,每小时60次限额)
curl "https://api.github.com/search/repositories?q=topic:llm+language:python&sort=stars&order=desc&per_page=10"

# 返回 JSON,关键字段:
# items[].full_name — 项目名
# items[].stargazers_count — Star 数
# items[].forks_count — Fork 数
# items[].open_issues_count — 当前 Issue 数
# items[].pushed_at — 最后更新时间

# 方法3:用 jq 解析 API 返回结果
curl -s "https://api.github.com/search/repositories?q=topic:llm+stars:>5000&sort=stars&per_page=5" | \
jq '.items[] | {name: .full_name, stars: .stargazers_count, forks: .forks_count, updated: .pushed_at}'
```

```python
# Python 版 GitHub 数据收集脚本
# 只读公开数据,不需要登录账号
import requests
import json
from datetime import datetime

def search_github_repos(query, max_results=20):
    """
    查询 GitHub 公开仓库数据
    query 示例: "topic:llm language:python stars:>1000"
    """
    url = "https://api.github.com/search/repositories"
    params = {
        "q": query,
        "sort": "stars",
        "order": "desc",
        "per_page": min(max_results, 30)
    }
    headers = {"Accept": "application/vnd.github.v3+json"}

    response = requests.get(url, params=params, headers=headers)

    if response.status_code == 200:
        data = response.json()
        results = []
        for item in data.get("items", []):
            results.append({
                "name": item["full_name"],
                "description": item.get("description", ""),
                "stars": item["stargazers_count"],
                "forks": item["forks_count"],
                "open_issues": item["open_issues_count"],
                "language": item.get("language", ""),
                "last_updated": item["pushed_at"][:10],
                "url": item["html_url"]
            })
        print(f"查询完成,返回 {len(results)} 个结果")
        print(f"数据时间: {datetime.now().strftime('%Y-%m-%d %H:%M')} (Measured)")
        return results
    elif response.status_code == 403:
        print("触发速率限制,未登录状态每小时限60次请求")
        return []
    else:
        print(f"请求失败: {response.status_code}")
        return []

# 示例:查询国内活跃的 AI 开发工具项目
repos = search_github_repos("topic:ai-agent stars:>500", max_results=10)
for r in repos:
    print(f"{r['stars']:>6} ★  {r['name']}  ({r['last_updated']})")
```

### 行业研究报告结构

```
【[行业名]行业研究报告】
研究时间:XXXX年XX月XX日
数据截止日期:XXXX年XX月
作者:AI agent草稿(需主人审核后对外使用)

━━━━━━━━━━━━━━━━━━━━━━━━
一、研究背景与目标
━━━━━━━━━━━━━━━━━━━━━━━━
本次研究旨在回答:[具体问题,不能是"了解行业"]

━━━━━━━━━━━━━━━━━━━━━━━━
二、市场规模与增速
━━━━━━━━━━━━━━━━━━━━━━━━
[核心数据表格]

| 指标 | 数值 | 数据类型 | 来源 | 时间 |
|------|------|---------|------|------|
| 中国XX市场规模 | XX亿元 | Estimated | 艾瑞咨询《XX报告》 | 2024年Q3 |
| 增速 | XX% | Estimated | 同上 | 同上 |
| 全球对比 | XX | Estimated | IDC(转引自XX媒体) | 2024年 |

[图表建议:市场规模趋势折线图]

━━━━━━━━━━━━━━━━━━━━━━━━
三、开源生态(GitHub 数据,如适用)
━━━━━━━━━━━━━━━━━━━━━━━━
数据来源:GitHub API + OSS Insight,数据类型:Measured
数据获取时间:[脚本运行时间]

[主要项目对比表:项目名/Star数/近90天新增Star/社区活跃度]

主要发现:
- [发现1:有数据支撑]
- [发现2:有数据支撑]

━━━━━━━━━━━━━━━━━━━━━━━━
四、用户规模与行为(如有数据)
━━━━━━━━━━━━━━━━━━━━━━━━
[来源:CNNIC/QuestMobile公开报告]

━━━━━━━━━━━━━━━━━━━━━━━━
五、竞争格局
━━━━━━━━━━━━━━━━━━━━━━━━
[结合Z23竞品分析课的框架]

━━━━━━━━━━━━━━━━━━━━━━━━
六、核心判断与结论
━━━━━━━━━━━━━━━━━━━━━━━━
[有观点,指向具体决策,有数据支撑]

━━━━━━━━━━━━━━━━━━━━━━━━
七、数据来源清单与局限性声明
━━━━━━━━━━━━━━━━━━━━━━━━

【数据来源】
[逐条列出,标注Measured/Estimated,日期,URL或出版物名]

【局限性】
- 本报告中XX数据为估算,误差范围约±XX%
- 以下数据因无公开来源未能收录:___
- 报告结论基于截止[日期]的公开信息,行业变化较快,建议[更新周期]复查
- 本报告不构成投资建议
```

---

## 🧰 配套开源项目(可选集成)

> 这门课的活,也有现成开源项目能帮你省力。**连真实数据库/客户数据/账号前先问主人**,优先只读、先脱敏、用完即删;星数为调研约数,装前再核。

- **Crawl4AI** ([github.com/unclecode/crawl4ai](https://github.com/unclecode/crawl4ai), ~68k★) —— 本地爬虫,把网页内容直接输出成 Markdown 喂给 AI 分析。**用法**:批量抓取行业报告摘要页、协会公告、上市公司投资者关系页,把内容交给 AI 提炼行业数据。尊重 robots.txt,频率要低;国内直接可用。

- **OpenRefine** ([github.com/OpenRefine/OpenRefine](https://github.com/OpenRefine/OpenRefine), ~11k★) —— 可视化数据清洗工具,擅长处理从多来源拼凑来的脏数据(格式不一、重复、乱码)。**用法**:把从多个渠道收集的行业数据表(市场规模、竞争者列表等)导入 OpenRefine 统一清洗、去重、标准化后再分析。本地运行,无数据上云风险。

---

## 📝 毕业测验(必须真做,交证据)

**任务:对"国内 AI Coding 工具"赛道做一份有数据支撑的行业研究报告。**

**你需要做到:**

1. **GitHub 数据采集**:运行 GitHub API 查询脚本,查询 AI Coding 相关项目(如 query: `"ai coding assistant stars:>1000"`),输出至少 10 个项目的真实数据(Star数、Fork数、更新时间),贴出真实脚本输出。

2. **公开数据引用**:从以下至少 2 个来源找到与 AI 开发工具相关的数据:CNNIC报告、CNKI、艾瑞公开报告摘要、或国家统计局数据。每条数据标明来源URL、报告名称、发布时间,并标注 Measured/Estimated。

3. **完整行业研究报告**:按上方框架写出完整报告,包含:市场规模(有来源)、开源生态(GitHub实测数据)、竞争格局(至少3家公司)、核心判断。报告里的每个数字都有来源标注。

4. **数据可信度评估**:对报告中使用的所有数据,写出一个"数据可信度表":每条数据是 Measured 还是 Estimated、来源等级(第一梯队/第二梯队/第三梯队)、置信度备注。

5. **局限性声明**:诚实写出本次研究没能获取到的数据、使用了哪些估算来源、结论的适用边界。

6. **沉淀技能卡**:把行业研究数据查找流程沉淀成 `skills/industry-research.md`。

> ⚠️ **数据洁癖铁律:报告里出现的每一个数字,要么来自脚本的真实运行结果,要么来自可追溯的公开报告原文。不允许编造数字。** 找不到数据,就如实写"该数据暂未找到可靠公开来源"。

---

## 🎓 过关标准

- [ ] GitHub API 脚本**真实运行过**,有真实输出数据(不是手动填写的数字)
- [ ] 每条引用数据**都标注了来源**:报告名/机构/时间/URL
- [ ] 每条数据**都标明 Measured 或 Estimated**
- [ ] 报告里**没有来源不明的数字**(如果发现了来源不明的数字,即不过关)
- [ ] 有**完整的局限性声明**,诚实写出研究边界
- [ ] 有**数据可信度评估表**
- [ ] 全程**只使用公开数据接口和公开报告**,没有爬取违反条款的数据(可核验)
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,然后填 [结业报告](../../templates/graduation-report-template.md),把行业研究报告当面交到主人手上。
