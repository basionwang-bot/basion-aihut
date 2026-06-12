# 第 T08 课 · BeautifulSoup 解析静态网页提取要点

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课 + T07(requests/httpx) ｜ 难度:★★☆ ｜ 源头:BeautifulSoup 官方文档 · [crummy.com/software/BeautifulSoup/bs4/doc](https://www.crummy.com/software/BeautifulSoup/bs4/doc/) · PyPI: [beautifulsoup4](https://pypi.org/project/beautifulsoup4/)

---

## 📖 你要学会什么

学完这一课,你能拿到一段 HTML,像外科医生一样精准地"切"出里面你要的文字——标题、价格、链接、列表——而不是把整页 HTML 喂给 AI 或者靠肉眼找。

想象 HTML 是一棵树——树干是 `<html>`,树枝是 `<body>`、`<div>`,树叶是里面的文字和链接。你想摘某几片叶子,但这棵树有几千片叶子长得差不多。BeautifulSoup 给了你一把"精确剪刀":你告诉它"我要 class 叫 `price` 的那片叶子",它就帮你在几千片里找到那几片,剪下来递给你。

BeautifulSoup 当前版本 4.15.0(2026 年 6 月最新),支持 Python 3.7+。它是静态 HTML/XML 解析的首选——**页面内容能直接在源代码里看到**时用它,速度快、代码简洁。如果页面内容是 JavaScript 动态生成的(源代码里看不到数据),就要用 T05 的 Playwright 或 T06 的 Scrapling。

**官方资料:**
- 官方文档: [crummy.com/software/BeautifulSoup/bs4/doc](https://www.crummy.com/software/BeautifulSoup/bs4/doc/)
- PyPI: [pypi.org/project/beautifulsoup4](https://pypi.org/project/beautifulsoup4/)
- ReadTheDocs: [beautiful-soup-4.readthedocs.io](https://beautiful-soup-4.readthedocs.io/en/latest/)

---

## 🧠 核心原则(内化成习惯)

1. **先判断:静态页还是动态页?** 在浏览器里按 `Ctrl+U`(或右键"查看网页源代码"),如果你要的数据**能直接在源码里搜到**,就是静态页,BeautifulSoup 够用。如果源码里只有一个 `<div id="app"></div>` 空壳,数据是 JS 渲染出来的——那 BeautifulSoup 根本看不到那些数据,要用 Playwright/Scrapling。

2. **选 parser,选 `lxml`。** BeautifulSoup 支持多种解析引擎:`html.parser`(Python 内置,不用装额外包)、`lxml`(速度最快,推荐)、`html5lib`(最接近浏览器行为,最慢)。日常用 `lxml`;如果对方 HTML 极度不规范,才用 `html5lib`。

3. **定位元素三板斧。** `find()` 找第一个匹配的元素,`find_all()` 找所有匹配的,`select()` 用 CSS 选择器找(和前端写 CSS 一样)。三个都要会用,`select()` 最灵活、最强大。

4. **`.text` vs `.get_text()`。** `.text` 直接取内部所有文字(含嵌套标签的文字);`.get_text(separator="\n", strip=True)` 可以指定分隔符、自动去空白——处理多层嵌套时用后者更干净。

5. **`.get("属性名")` 取属性,不用 `['属性名']`。** 拿链接用 `tag.get("href")`,拿图片地址用 `tag.get("src")`——如果属性不存在,`.get()` 返回 `None` 不报错,`['属性名']` 会抛 `KeyError`。

---

## 🛠 操作要点

### 安装

```bash
# BeautifulSoup 主库
pip install beautifulsoup4

# 推荐同时安装最快的解析器 lxml
pip install lxml

# 如果需要处理极度不规范的 HTML
pip install html5lib
```

> 🇨🇳 **中国用户提示:** 以上均可直接 pip 安装,无需科学上网。加速可用清华镜像:
> `pip install beautifulsoup4 lxml -i https://mirrors.tuna.tsinghua.edu.cn/pypi/web/simple/`

### 最小可运行示例(解析内嵌 HTML,完全离线)

```python
from bs4 import BeautifulSoup

# 模拟一段"网页 HTML"(测试时不用真的联网)
html = """
<html>
<head><title>2024 年度编程语言排行</title></head>
<body>
  <h1 class="page-title">Top 5 编程语言</h1>
  <ul id="rank-list">
    <li class="lang-item">
      <span class="rank">1</span>
      <span class="name">Python</span>
      <span class="score">100.0</span>
    </li>
    <li class="lang-item">
      <span class="rank">2</span>
      <span class="name">JavaScript</span>
      <span class="score">62.3</span>
    </li>
    <li class="lang-item">
      <span class="rank">3</span>
      <span class="name">Java</span>
      <span class="score">59.1</span>
    </li>
  </ul>
  <a href="https://example.com/full-list" class="more-link">查看完整榜单</a>
</body>
</html>
"""

# 解析 HTML
soup = BeautifulSoup(html, "lxml")

# --- 方法一:find / find_all ---

# 取页面标题
title = soup.find("h1", class_="page-title")
print(f"标题: {title.text}")
# 输出: 标题: Top 5 编程语言

# 取所有榜单项
items = soup.find_all("li", class_="lang-item")
print(f"\n共 {len(items)} 条榜单:")
for item in items:
    rank  = item.find("span", class_="rank").text
    name  = item.find("span", class_="name").text
    score = item.find("span", class_="score").text
    print(f"  第 {rank} 名: {name} (分数: {score})")

# --- 方法二:CSS 选择器(更灵活) ---

# 取所有语言名称
names = soup.select("#rank-list .name")
print(f"\n语言列表: {[n.text for n in names]}")

# 取外部链接
link = soup.select_one("a.more-link")
print(f"更多链接: {link.get('href')}")
# 输出: 更多链接: https://example.com/full-list
```

### 配合 requests 抓取真实网页

```python
import requests
from bs4 import BeautifulSoup

# 取 example.com(IANA 维护的公开示例页,无 robots 限制)
response = requests.get("https://example.com", timeout=10)
response.raise_for_status()
response.encoding = "utf-8"  # 手动指定编码,防乱码

soup = BeautifulSoup(response.text, "lxml")

# 提取标题
h1 = soup.find("h1")
print(f"H1 标题: {h1.text if h1 else '未找到'}")

# 提取所有段落文字
paragraphs = soup.find_all("p")
for i, p in enumerate(paragraphs, 1):
    print(f"段落 {i}: {p.get_text(strip=True)}")

# 提取所有超链接
links = soup.find_all("a", href=True)
for a in links:
    print(f"链接文字: {a.text.strip()!r}  =>  {a.get('href')}")
```

### 常用选择器速查

| 想找什么 | `find_all` 写法 | CSS 选择器写法 |
|---------|----------------|---------------|
| 所有 `<h2>` | `find_all("h2")` | `select("h2")` |
| class="title" | `find_all(class_="title")` | `select(".title")` |
| id="main" | `find("id="main")` | `select_one("#main")` |
| `<a>` 里有 href | `find_all("a", href=True)` | `select("a[href]")` |
| 嵌套:div 里的 p | — | `select("div p")` |
| 直接子元素 | — | `select("ul > li")` |
| 含某文字的元素 | `find(string="精确文字")` | — |

### 结果保存

```python
import json
from bs4 import BeautifulSoup

html = "..."  # 你的 HTML 内容
soup = BeautifulSoup(html, "lxml")

results = []
for item in soup.select(".lang-item"):
    results.append({
        "rank":  item.select_one(".rank").text.strip(),
        "name":  item.select_one(".name").text.strip(),
        "score": item.select_one(".score").text.strip(),
    })

with open("/tmp/parsed_result.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print(f"提取 {len(results)} 条,已保存到 /tmp/parsed_result.json")
```

---

## 📝 毕业测验(必须真做,交证据)

**任务:解析一段内嵌 HTML,提取结构化数据并保存。测验数据内嵌——完全离线可跑,无需联网。**

```bash
# 把测验数据写入本地文件
cat > /tmp/bs4_test.html << 'EOF'
<!DOCTYPE html>
<html>
<head><title>技术书单</title></head>
<body>
  <h1 class="page-title">2025 年必读技术书</h1>
  <div class="book-list">
    <div class="book-item">
      <h2 class="book-title">流畅的 Python</h2>
      <span class="author">Luciano Ramalho</span>
      <span class="price">¥89.00</span>
      <a href="/book/fluent-python" class="detail-link">查看详情</a>
    </div>
    <div class="book-item">
      <h2 class="book-title">Clean Code</h2>
      <span class="author">Robert C. Martin</span>
      <span class="price">¥79.00</span>
      <a href="/book/clean-code" class="detail-link">查看详情</a>
    </div>
    <div class="book-item">
      <h2 class="book-title">数据密集型应用系统设计</h2>
      <span class="author">Martin Kleppmann</span>
      <span class="price">¥128.00</span>
      <a href="/book/ddia" class="detail-link">查看详情</a>
    </div>
  </div>
</body>
</html>
EOF
```

**完成以下脚本并运行**(`/tmp/bs4_task.py`):

```python
from bs4 import BeautifulSoup
import json

with open("/tmp/bs4_test.html", "r", encoding="utf-8") as f:
    html = f.read()

soup = BeautifulSoup(html, "lxml")

# 1. 提取页面 H1 标题
page_title = soup.select_one("h1.page-title").text.strip()
print(f"页面标题: {page_title}")

# 2. 提取所有书目信息
books = []
for item in soup.select(".book-item"):
    title  = item.select_one(".book-title").text.strip()
    author = item.select_one(".author").text.strip()
    price  = item.select_one(".price").text.strip()
    link   = item.select_one("a.detail-link").get("href")
    books.append({"title": title, "author": author, "price": price, "link": link})
    print(f"  书名: {title}  作者: {author}  定价: {price}  链接: {link}")

# 3. 保存结果
output_path = "/tmp/books.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(books, f, ensure_ascii=False, indent=2)

# 4. 验收断言
assert len(books) == 3, f"应有 3 本书,实际 {len(books)}"
assert all("title" in b and "price" in b for b in books), "每本书都应有 title 和 price"
assert books[0]["price"].startswith("¥"), "价格应以 ¥ 开头"
print(f"\n共提取 {len(books)} 条记录,已保存到 {output_path}")
print("验收通过 ✓")
```

**要交的证据:**
- 脚本的真实输出(含 3 本书的信息和"验收通过 ✓")
- `/tmp/books.json` 的内容截图或文本

**若要测试真实网页(可选):**
- 只用 `https://example.com`——IANA 维护的公开页面,无 robots 限制
- 其他真实网站:先查 `robots.txt`、服务条款;**真正请求前必须得到主人确认**

**沉淀技能卡**:把三板斧(find/find_all/select)、属性获取、编码处理沉淀成 `skills/beautifulsoup.md`。

> ⚠️ **安全边界:** `pip install beautifulsoup4 lxml` 需先经主人确认。解析本地 HTML 完全安全;抓取真实网站前必须检查 robots.txt 和服务条款,**并征得主人同意**。

---

## 🎓 过关标准

- [ ] 你跑通了测验脚本,附上了真实输出(含"验收通过 ✓")
- [ ] 你用过 `select()` CSS 选择器方式定位元素
- [ ] 你用过 `.get("href")` 提取链接属性(而不是 `["href"]`)
- [ ] 你能说清楚 BeautifulSoup 只能处理静态 HTML——动态 JS 渲染的内容它看不到
- [ ] 你知道 `lxml` 比 `html.parser` 快,日常优先用 `lxml`
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,进 T09 课。
