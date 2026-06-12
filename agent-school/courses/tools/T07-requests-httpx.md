# 第 T07 课 · requests/httpx 调公开 API 取数据

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课 ｜ 难度:★★☆ ｜ 源头:requests 官方文档 · [docs.python-requests.org](https://docs.python-requests.org/) · httpx 官方文档 · [python-httpx.org](https://www.python-httpx.org/) · PyPI: [requests](https://pypi.org/project/requests/) / [httpx](https://pypi.org/project/httpx/)

---

## 📖 你要学会什么

学完这一课,你能用 Python 代码"敲门"到一个公开 API——拿回数据、解析成你要的字段——就像在网上查天气、查汇率、查 GitHub 仓库信息一样,只不过是你亲手写代码来取。

想象 API 是一家外卖平台。你(客户端)打开 App,点了"来一份宫保鸡丁"(发一条 HTTP 请求),外卖平台(服务器)把宫保鸡丁打包好(JSON 数据)送回来。你不需要进厨房,也不需要知道厨师怎么炒——**你只管下单、收货、开饭**。`requests` 和 `httpx` 就是你手里那个外卖 App。

两个库的关系:**`requests` 是老大哥**——稳定、简洁、用了十几年,每周下载量超 3 亿次,是最多 Python 程序依赖的库之一。**`httpx` 是下一代**——API 设计和 requests 高度兼容,但额外支持 HTTP/2 和异步(`async`/`await`),适合需要同时发很多请求的场景。新手先用 `requests` 打好基础,遇到"同时发 100 个请求"才升级到 `httpx`。

**官方资料:**
- requests 文档: [docs.python-requests.org](https://docs.python-requests.org/en/latest/)
- requests PyPI: [pypi.org/project/requests](https://pypi.org/project/requests/)
- httpx 文档: [python-httpx.org](https://www.python-httpx.org/)
- httpx PyPI: [pypi.org/project/httpx](https://pypi.org/project/httpx/)
- httpx GitHub: [github.com/encode/httpx](https://github.com/encode/httpx)

---

## 🧠 核心原则(内化成习惯)

1. **先看状态码,再看数据。** 服务器返回的状态码就像外卖的"配送状态"——200 是"已送达",404 是"地址不存在",429 是"你点太快被限流了",500 是"厨房出问题了"。永远先检查 `response.status_code`,再去读内容。`response.raise_for_status()` 是你的自动报警器——状态码不对它就抛异常。

2. **JSON 是最常见的"包装箱"。** 绝大多数公开 API 返回的是 JSON 格式。`response.json()` 一键拆包,得到 Python 字典/列表——就像拆快递一样直接。

3. **加超时,不让请求永远等下去。** `requests.get(url, timeout=10)` 里的 `timeout=10` 意思是"等 10 秒没回应就放弃"。没有超时的网络请求像一个永不放弃的外卖电话——对方不接你就一直打,直到程序卡死。

4. **私钥不能明文写在代码里。** API Key、Token 这类凭证,要从环境变量里读(`os.environ.get("API_KEY")`),绝对不能硬编码写在脚本里再提交到 Git。这是最基本的安全常识。

5. **尊重限速(Rate Limit)。** 大多数公开 API 都有请求频率限制——比如"每分钟最多 60 次"。看 API 文档里的限速说明,不要暴力轮询。遇到 429 就等一等再重试。

---

## 🛠 操作要点

### 安装

```bash
# requests(老大哥,稳定可靠)
pip install requests

# httpx(下一代,支持 async)
pip install httpx
```

> 🇨🇳 **中国用户提示:** 两个库在国内 pip 都能直接安装,无需科学上网。如果下载慢可加镜像:
> `pip install requests -i https://mirrors.tuna.tsinghua.edu.cn/pypi/web/simple/`

### 最小可运行示例:调 GitHub 公开 API

```python
import requests
import json

# 调 GitHub API 查仓库信息(无需登录、完全公开)
url = "https://api.github.com/repos/python/cpython"

response = requests.get(url, timeout=10)

# 第一步:先看状态码
print(f"状态码: {response.status_code}")
response.raise_for_status()  # 非 200 直接抛错

# 第二步:拆包 JSON
data = response.json()

# 第三步:取你要的字段
print(f"仓库名称: {data['full_name']}")
print(f"Star 数量: {data['stargazers_count']}")
print(f"描述: {data['description']}")
print(f"主语言: {data['language']}")
print(f"最后更新: {data['updated_at']}")
```

> 这个示例不需要 API Key、不需要登录,直接运行即可。

### 带参数的请求(查询多个结果)

```python
import requests

# GitHub 搜索 API:搜 Python 相关仓库
url = "https://api.github.com/search/repositories"
params = {
    "q": "language:python stars:>10000",
    "sort": "stars",
    "order": "desc",
    "per_page": 5
}

response = requests.get(url, params=params, timeout=10)
response.raise_for_status()

data = response.json()
print(f"共找到 {data['total_count']} 个仓库,展示前 5 个:\n")

for repo in data['items']:
    print(f"  ⭐ {repo['stargazers_count']:>8,}  {repo['full_name']}")
    print(f"     {repo['description']}\n")
```

### httpx 版本对比(API 几乎一样)

```python
import httpx

# 同步用法——和 requests 几乎完全相同
response = httpx.get("https://api.github.com/repos/encode/httpx", timeout=10)
response.raise_for_status()
data = response.json()
print(f"httpx Star 数: {data['stargazers_count']}")

# 异步用法——这是 httpx 比 requests 强的地方
import asyncio

async def fetch_many():
    async with httpx.AsyncClient() as client:
        urls = [
            "https://api.github.com/repos/python/cpython",
            "https://api.github.com/repos/django/django",
            "https://api.github.com/repos/pallets/flask",
        ]
        # 并发发 3 个请求,比依次发快很多
        tasks = [client.get(url, timeout=10) for url in urls]
        responses = await asyncio.gather(*tasks)
        for r in responses:
            d = r.json()
            print(f"{d['full_name']}: ⭐ {d['stargazers_count']}")

asyncio.run(fetch_many())
```

### 结果保存到本地

```python
import requests
import json

response = requests.get("https://api.github.com/repos/python/cpython", timeout=10)
response.raise_for_status()
data = response.json()

# 只保留有用字段
result = {
    "name": data["full_name"],
    "stars": data["stargazers_count"],
    "description": data["description"],
    "language": data["language"],
    "updated_at": data["updated_at"],
}

with open("/tmp/repo_info.json", "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print("已保存到 /tmp/repo_info.json")
```

### 常用操作速查

| 想干嘛 | requests 写法 |
|--------|--------------|
| GET 请求 | `requests.get(url, timeout=10)` |
| 带 URL 参数 | `requests.get(url, params={"key": "val"})` |
| 带请求头 | `requests.get(url, headers={"Authorization": "Bearer xxx"})` |
| POST JSON | `requests.post(url, json={"key": "val"})` |
| 检查状态码 | `response.raise_for_status()` |
| 解析 JSON | `response.json()` |
| 读取文本 | `response.text` |
| 读取二进制 | `response.content` |

---

## 📝 毕业测验(必须真做,交证据)

**任务:用 `requests` 调 GitHub 公开 API,取到数据并解析保存。**

这个测验**不需要 API Key、不需要账号、不需要科学上网**——GitHub 公开 API 直接可用。

**步骤:**

1. **写出以下完整脚本**(`/tmp/api_task.py`):

```python
import requests
import json
import sys

def fetch_repo(owner: str, repo: str) -> dict:
    """调 GitHub API 取仓库信息,返回关键字段"""
    url = f"https://api.github.com/repos/{owner}/{repo}"
    response = requests.get(url, timeout=10)
    response.raise_for_status()
    data = response.json()
    return {
        "full_name": data["full_name"],
        "stars": data["stargazers_count"],
        "forks": data["forks_count"],
        "description": data["description"],
        "language": data["language"],
        "open_issues": data["open_issues_count"],
        "updated_at": data["updated_at"],
    }

if __name__ == "__main__":
    repos = [
        ("python", "cpython"),
        ("pandas-dev", "pandas"),
        ("encode", "httpx"),
    ]

    results = []
    for owner, repo in repos:
        print(f"正在取: {owner}/{repo} ...")
        info = fetch_repo(owner, repo)
        results.append(info)
        print(f"  ✓ {info['full_name']} — ⭐{info['stars']:,}")

    # 保存结果
    output_path = "/tmp/github_repos.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"\n共取回 {len(results)} 条数据,已保存到 {output_path}")

    # 验收:文件存在且非空
    with open(output_path, "r", encoding="utf-8") as f:
        saved = json.load(f)
    assert len(saved) == 3, "应有 3 条记录"
    assert all("stars" in item for item in saved), "每条记录都应有 stars 字段"
    print("验收通过 ✓")
```

2. **运行脚本,贴出真实输出**(含"验收通过 ✓"一行)。

3. **写出验证标准**:
   - 脚本退出码为 0(无异常)
   - `/tmp/github_repos.json` 存在、内容是合法 JSON、有 3 条记录
   - 每条记录含 `full_name`、`stars` 字段且值非空

4. **写出安全说明**:
   - 本测验用的是 GitHub 公开只读 API,无需 Key,可直接跑
   - 如需带 Token 访问私有内容,Token 必须从环境变量读取,**绝不硬编码**
   - 其他第三方 API(需要 Key 或账号)——**必须先经主人确认再安装/调用**

5. **沉淀技能卡**:把核心用法、状态码说明、安全原则沉淀成 `skills/requests-httpx.md`。

> ⚠️ **安全边界:** `pip install requests/httpx` 需先征得主人确认。调用任何需要 API Key 或账号的接口,**必须先问主人**。本测验的 GitHub 公开 API 例外——无 Key 直接可用。

---

## 🎓 过关标准

- [ ] 你跑出了完整脚本并附上了真实的命令输出(含 3 条仓库数据和"验收通过 ✓")
- [ ] 你理解了 `raise_for_status()` 的作用(状态码异常时自动抛错)
- [ ] 你理解了 `timeout` 的必要性(防止请求永远等待)
- [ ] 你能说清楚 `requests` 和 `httpx` 的区别(同步 vs 支持 async,requests 老牌 vs httpx 新一代)
- [ ] 你知道 API Key 不能硬编码,要从环境变量读
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,进 T08 课。
