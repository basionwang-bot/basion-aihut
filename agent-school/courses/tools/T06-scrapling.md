# 第 T06 课 · Scrapling 扒公开网页数据

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课 + T05(Playwright) ｜ 难度:★★★ ｜ 源头:Scrapling 官方仓库 · [github.com/D4Vinci/Scrapling](https://github.com/D4Vinci/Scrapling) · [PyPI](https://pypi.org/project/scrapling/)

---

## 📖 你要学会什么

学完这一课,你能用 Scrapling 从一个公开网页(比如榜单、商品列表、公告页)里**自动提取结构化数据**——即使这个网页改版了、加了反爬、或者内容是 JavaScript 动态渲染的。

想象你想每天记录某个网站的热门榜单。普通爬虫就像一个固执的快递员:**第一次送货时记住了"3楼右边第二个门牌",下次直接奔那个门牌去**——但如果那家人搬了位置,快递员就傻眼了,找不着了。Scrapling 的杀手锏叫**"自适应解析"**:它记住的不是"第几层第几个门牌",而是"那家门上贴了红色喜字、门口有棵盆栽"——**凭特征识人,改版了一样能认出来**。

更牛的是,Scrapling 还自带绕过 Cloudflare 这类反爬系统的能力,解析速度比 BeautifulSoup 快数百倍,**还有内置 MCP 服务器**,可以直接插进 Claude / Cursor 使用——提取结果先压缩再喂给 AI,省 token。

本仓库对 Scrapling 的详细介绍也可参考:[content/posts/claude-code-90-arsenal.md](../../../content/posts/claude-code-90-arsenal.md)

**官方资料:**
- GitHub 仓库: [github.com/D4Vinci/Scrapling](https://github.com/D4Vinci/Scrapling)
- PyPI 页面: [pypi.org/project/scrapling/](https://pypi.org/project/scrapling/)
- 中文 README: [github.com/D4Vinci/Scrapling/blob/main/docs/README_CN.md](https://github.com/D4Vinci/Scrapling/blob/main/docs/README_CN.md)

---

## 🧠 核心原则

1. **先判断目标网页是静态还是动态。** 如果你能在"查看网页源码"里直接看到数据,用轻量的 `Fetcher`(HTTP 请求)就够;如果源码里只有空壳、数据是 JavaScript 渲染的,才用 `PlayWrightFetcher` 或 `StealthyFetcher`(带浏览器的重型武器)。**不要大炮打蚊子。**

2. **自适应模式是关键开关。** `adaptive=True` 时,Scrapling 会记住你提取过的元素的"特征指纹"——下次网站改版,它能自动重新定位同一个元素。适合长期运行的定期抓取任务;一次性任务可以不开。

3. **先确认 robots.txt 和使用条款。** 抓取前必须检查目标网站的 `robots.txt`(网址后面加 `/robots.txt`),看有没有禁止爬取的规则。同时检查网站服务条款——有些网站明确禁止自动化访问。**违反 robots.txt 和服务条款是不道德的,某些情况下还是违法的。**

4. **限速是礼貌,也是保命。** 爬取速度太快会给目标服务器造成压力,也会更容易被封。Scrapling 的 Spider 框架有并发控制参数,正常礼貌的爬取速度:每次请求间隔不少于 1 秒。

5. **MCP 服务器是 AI 集成的桥梁。** Scrapling 的 MCP 服务器能把提取的内容在传给 AI 之前自动压缩去噪——同样的数据,token 消耗大幅减少。如果你在 Claude Code 里干爬取任务,优先考虑接 MCP。

---

## 🛠 操作要点

### 安装

```bash
# 基础版(只有解析,无网络抓取)
pip install scrapling

# 带网络抓取的完整版(推荐)
pip install "scrapling[fetchers]"

# 安装浏览器驱动(和 Playwright 共用)
scrapling install

# 带 MCP 服务器的版本
pip install "scrapling[ai]"

# 一次全装
pip install "scrapling[all]"
```

> 🇨🇳 **中国用户提示:**
> - `pip install scrapling` 建议配合国内镜像(`-i https://mirrors.tuna.tsinghua.edu.cn/pypi/web/simple/`)提速。
> - `scrapling install` 会下载浏览器驱动(Chromium 等),国内下载可能较慢,可以考虑先确认网络环境再执行。
> - Scrapling 本身不需要科学上网,但如果目标网站在国内访问困难,才需要考虑代理。

### 快速上手:静态网页提取

```python
from scrapling.fetchers import Fetcher

# 最简单的用法:HTTP 请求获取页面,CSS 选择器提取
page = Fetcher.get('https://example.com')

# 提取标题
title = page.css('h1', first=True)
print(title.text)

# 提取所有链接
links = page.css('a')
for link in links:
    print(link.attrib.get('href'), link.text)

# 提取列表项
items = page.css('.item-class')
data = [item.text for item in items]
print(data)
```

### 带反爬绕过:动态页面

```python
from scrapling.fetchers import StealthyFetcher

# 无头模式(不弹窗)绕过反爬
page = StealthyFetcher.fetch('https://目标网站.com', headless=True)

# 开启自适应模式(网站改版后依然能定位)
StealthyFetcher.adaptive = True
products = page.css('.product-card', adaptive=True)

for p in products:
    name = p.css('.product-name', first=True)
    price = p.css('.price', first=True)
    print(f"{name.text} — {price.text}")
```

### 把结果保存成 JSON

```python
import json
from scrapling.fetchers import Fetcher

page = Fetcher.get('https://example.com')
items = page.css('.item')

result = []
for item in items:
    result.append({
        'title': item.css('h2', first=True).text if item.css('h2') else '',
        'link': item.css('a', first=True).attrib.get('href', '') if item.css('a') else '',
    })

# 保存到文件
with open('output/data.json', 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print(f"共提取 {len(result)} 条数据,已保存到 output/data.json")
```

### 接入 MCP 服务器(与 Claude Code 集成)

```bash
# 安装 MCP 版本
pip install "scrapling[ai]"

# 在 Claude Code 的 settings.json 里添加 MCP 服务器配置
# (具体路径和格式见 claude code 文档)
```

### 常用选择器参考

| 想定位什么 | CSS 选择器写法 |
|------------|----------------|
| id="title" 的元素 | `#title` |
| class="item" 的元素 | `.item` |
| 所有 `<h2>` 标签 | `h2` |
| `<a>` 里 href 含某关键词 | `a[href*="keyword"]` |
| 第一个 `<li>` | `li:first-child` |
| 嵌套选择 | `div.container h2.title` |

---

## 📝 毕业测验(必须真做,交证据)

**任务:设计一个用 Scrapling 抓取公开榜单数据的完整方案,包含可运行脚本 + 数据输出 + 验收标准。**

选定目标:抓取 `https://example.com` 页面上的标题和正文信息(这是 IANA 维护的公开示例页面,没有 robots.txt 限制)。

你需要完成:

1. **检查 robots.txt**:
   ```bash
   curl https://example.com/robots.txt
   # 如果返回 404 或内容没有禁止 /, 则可以爬取
   ```

2. **写出完整可运行的 Python 脚本**,包含:
   - 用 `Fetcher.get()` 获取页面
   - 用 CSS 选择器提取 `<h1>` 标题和 `<p>` 段落
   - 把结果写入 `output/result.json`
   - 打印提取到的内容条数

3. **写出验收标准**:
   - `output/result.json` 存在且内容非空
   - JSON 里包含至少 1 条 `title` 和 `body` 字段
   - 脚本退出码为 0

4. **写出安全提示**:
   - 目标改为真实网站前:先检查 robots.txt、查看服务条款
   - 不得爬取需要登录的页面(除非主人本人账号且明确授权)
   - **安装(`pip install scrapling`)和真正执行脚本前,必须先征得主人确认**

5. **沉淀技能卡**:把自适应解析原理、选择器速查表、安全边界沉淀成 `skills/scrapling.md`。

> ⚠️ **安全边界(守住这条线):** 这一课的毕业测验是**产出方案 + 写好脚本**,不是擅自真跑。`pip install scrapling` 和真正执行爬取脚本——**必须先得到主人明确确认再执行**。爬取有版权保护内容、需要登录的内容、或被 robots.txt 明确禁止的路径——这三件事**无论如何不做**。

---

## 🎓 过关标准

- [ ] 你检查了目标网址的 `robots.txt`,并说明了允许/禁止的结论
- [ ] 你写出了完整的 Scrapling 脚本(含 CSS 选择器、JSON 输出、异常处理)
- [ ] 你写清楚了验收标准(具体可核查的条件,而不是"感觉可以")
- [ ] 你能说清楚"自适应解析"是什么意思(凭特征识元素,不依赖位置)
- [ ] 你理解了 Scrapling 比 BeautifulSoup 快的原因 + MCP 集成的意义
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,进下一门课。
