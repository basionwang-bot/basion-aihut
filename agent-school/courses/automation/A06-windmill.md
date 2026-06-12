# 第 A06 课 · Windmill:把一段 Python/TypeScript 脚本变成可定时/Webhook 触发的服务

> **学员:正在上学的你(AI agent)** ｜ 先修:J01~J07 + A01~A05 ｜ 难度:★★★★★ ｜ 源头:[github.com/windmill-labs/windmill](https://github.com/windmill-labs/windmill)（约 16.7k ⭐,AGPLv3 + 商业许可证可选）

---

⚠️ **全院统一安全红线(每门课开头重申)**

这类工具会**连接真实账号、真的发邮件改数据**。铁律三连:
1. **先用测试账号/沙箱**,不要上来就接生产账号;
2. **关键动作(发送/删除)先加人工确认节点**,让主人看一眼再放行;
3. **接生产账号前先问主人**,征得明确同意。

给 AI 接能力要设最小权限。

---

## 📖 你要学会什么

前五门课都是"拖拽连线式"自动化——适合不写代码或少写代码的场景。到了 A06,我们跨过一道门槛:**用代码来做自动化**。

Windmill 的定位是这样的:你有一段现成的 Python 或 TypeScript 脚本,能跑出你想要的结果——但它只能在你电脑上手动运行。**Windmill 把这段脚本变成一个有 Web 界面、能定时运行、能接 Webhook 触发、能给非技术主人点按钮运行的服务**——不需要你自己写服务器、不需要你配 cron、不需要你搭 API。

打个比方:你写了一段"自动整理文件夹"的脚本。以前要跑一次,你得自己打开终端输命令。Windmill 给这段脚本包了一个"外壳"——主人在网页上点一个按钮,脚本就跑了;或者设个定时器,每天半夜自动跑;或者有人向某个网址发请求,脚本就被触发了。

Windmill 支持的语言:Python、TypeScript、Go、Bash、SQL、GraphQL、PowerShell、Rust。

学完这一课,你能:
- 用 Docker Compose 部署 Windmill
- 把一段脚本发布为 Script,赋予它 Webhook 触发能力
- 设置定时任务(Schedule)自动运行脚本
- 把多个脚本串成 Flow 工作流

**官方资料:**
- 仓库: [github.com/windmill-labs/windmill](https://github.com/windmill-labs/windmill)
- 官网: [windmill.dev](https://windmill.dev)
- 文档: [windmill.dev/docs](https://windmill.dev/docs)

---

## 🧠 核心原则

1. **Script 是 Windmill 的最小单元。** 每一段脚本都是一个 Script:有名字、有输入参数、有输出。Windmill 自动根据脚本参数生成 Web 表单——主人不用懂代码,在网页填个表单点运行就好。

2. **三种触发方式,对应三种场景。** 写好 Script 之后,你可以:
   - **手动运行**:在 Web UI 点按钮,适合"按需操作"
   - **Schedule(定时)**:类似 cron,适合"定期批量任务"
   - **Webhook**:有人向某个 URL 发 POST 请求就触发,适合"被其他系统调用"

3. **Flow = 把多个 Script 串起来。** 单个 Script 搞不定的复杂流程,用 Flow 把多个 Script 串联——类似 A01 Node-RED 的流水线,但每个节点是一段真正的代码逻辑。

4. **AGPLv3 许可证,要了解"传染性"。** Windmill 的核心是 AGPLv3——这和 A02 Automatisch 一样,有传染性。**个人自用、内部使用没有任何问题**。但如果你对外提供基于 Windmill 的服务,你的修改也必须开源;商业场景需要买商业许可证。Windmill 社区版(Community Edition)可以内部免费使用,不受限制。

5. **先征得主人确认,再安装、再运行脚本、再接 Webhook 到外部系统。** Windmill 上的脚本有权限访问主人配置的 Resource(账号凭据),权限很大,每一步都要知会主人。

---

## 🛠 操作要点

### 用 Docker Compose 部署 Windmill

```bash
# 下载三个配置文件
curl https://raw.githubusercontent.com/windmill-labs/windmill/main/docker-compose.yml -o docker-compose.yml
curl https://raw.githubusercontent.com/windmill-labs/windmill/main/Caddyfile -o Caddyfile
curl https://raw.githubusercontent.com/windmill-labs/windmill/main/.env -o .env

# 启动服务
docker compose up -d
```

> ⚠️ **启动前先征得主人确认。** Windmill 会启动 Windmill Server、Worker(执行脚本的工作进程)和 PostgreSQL 数据库。

服务就绪后,浏览器打开:

```
http://localhost
```

**默认登录账号:**
- 邮箱: `admin@windmill.dev`
- 密码: `changeme`

> ⚠️ **登录后立即修改密码!** `changeme` 是众所周知的默认密码,不改就是开门迎客。

> 🇨🇳 **国内友好提示:** Windmill 完全本地运行,不需要科学上网。从 GitHub raw 下载配置文件如果慢,可以手动从仓库复制文件内容粘贴保存。

### 理解 Windmill 界面结构

```
左侧导航:
├── Scripts (脚本列表)
├── Flows (工作流)
├── Apps (自动生成的 Web UI)
├── Schedules (定时任务)
├── Resources (外部账号凭据)
└── Variables (环境变量/密钥)

核心概念:
- Workspace: 工作空间,类似"项目"
- Script: 一段可运行的代码
- Flow: 多个 Script 串联的工作流
- Resource: 存储凭据(如数据库连接、API Key)
```

### 写你的第一个 Script

这是 Windmill 最核心的操作。我们写一个 Python 脚本:从某个 API 获取数据,过滤后返回结果。

**在 Windmill 里新建 Script:**

1. 左侧导航 → **Scripts** → **New Script**
2. 给脚本命名,如 `fetch_and_filter`
3. 选择语言 **Python 3**
4. 在编辑器里写代码:

```python
# Windmill Python 脚本的固定格式
# 函数名必须是 main,参数会自动生成表单

import requests

def main(
    api_url: str,           # 参数 1:API 地址
    keyword: str = "",      # 参数 2:过滤关键词(有默认值)
    limit: int = 10         # 参数 3:返回条数上限
):
    """
    从指定 API 获取数据,按关键词过滤后返回
    """
    response = requests.get(api_url)
    response.raise_for_status()
    
    data = response.json()
    
    # 如果有关键词,过滤包含该关键词的条目
    if keyword:
        if isinstance(data, list):
            data = [item for item in data
                    if keyword.lower() in str(item).lower()]
    
    # 限制返回数量
    result = data[:limit] if isinstance(data, list) else data
    
    return {"count": len(result) if isinstance(result, list) else 1,
            "data": result}
```

5. 点 **Save**

Windmill 会**自动根据 `main` 函数的参数生成一个 Web 表单**——`api_url` 变成文本输入框,`limit` 变成数字输入框。主人不用看代码,填表单就能运行。

> 📌 **关键规则:** Windmill Python 脚本的入口函数必须叫 `main`,其他语言类似。Windmill 通过分析函数签名来生成 UI 和处理参数。

### 给 Script 添加 Webhook 触发

Script 保存后,Windmill 会自动为每个 Script 生成一个 Webhook 地址:

1. 进入 Script 详情页
2. 找到 **Webhooks** 标签
3. 可以看到 POST 地址格式:
   ```
   http://localhost/api/w/{workspace}/jobs/run/p/{script_path}
   ```
4. 需要带上认证 Token:请求头加 `Authorization: Bearer {你的TOKEN}`

**Token 生成方式:**
1. 右上角头像 → **Account Settings**
2. 找到 **Tokens** → 生成新 Token

> ⚠️ **Token 由主人生成**,这个 Token 有运行脚本的权限。不要把 Token 暴露在公开位置。

**测试 Webhook:**

```bash
curl -X POST \
  "http://localhost/api/w/default/jobs/run/p/u/admin/fetch_and_filter" \
  -H "Authorization: Bearer 你的TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"api_url": "https://jsonplaceholder.typicode.com/posts", "limit": 3}'
```

> ⚠️ **测试时用公开可访问的 API(如 jsonplaceholder.typicode.com)**,不要用需要权限的真实服务。

### 设置定时任务(Schedule)

让脚本每天自动运行一次:

1. 左侧导航 → **Schedules** → **New Schedule**
2. 选择要定时运行的 Script
3. 填写 Cron 表达式:
   ```
   0 9 * * *    # 每天早上 9 点
   0 */6 * * *  # 每 6 小时
   30 8 * * 1   # 每周一早上 8:30
   ```
4. 填写脚本运行时的参数值
5. 开启 Schedule

> 🇨🇳 **时区提示:** Windmill 默认 UTC 时间。中国是 UTC+8,早上 9 点对应 Cron 的 `0 1 * * *`。进入 Workspace 设置可以改时区。

### 把多个 Script 串成 Flow

Flow 是 Windmill 的"流水线"功能:

1. 左侧导航 → **Flows** → **New Flow**
2. 添加步骤:每个步骤可以是一个现有 Script 或新写代码
3. 步骤之间可以传数据:上一步的输出 `results.step1.data` 可以作为下一步的输入
4. 支持分支(If/Else)、循环(For Each)、并行执行

例如一个三步 Flow:
```
[步骤1: 抓取数据] → [步骤2: AI 处理(调用大模型 API)] → [步骤3: 写入数据库]
```

### 安全确认清单

```
□ docker compose up -d 已征得主人确认
□ 默认密码 changeme 已修改
□ Webhook Token 由主人生成,不暴露在公开位置
□ 脚本里涉及外部账号凭据,使用 Windmill Resources 存储(不硬编码进代码)
□ 定时任务设置前告知主人:会定期做什么,频率是多少
□ 脚本第一次运行用测试数据或测试账号
□ 了解 AGPLv3 含义,商业对外服务前查清楚条款
□ 生产环境部署前再次征得主人明确确认
```

### 最佳实践:用 Resources 存凭据,不硬编码

**错误做法** — 凭据写死在代码里:
```python
def main():
    api_key = "sk-xxxxxxxx"  # ❌ 绝对不要这样写
```

**正确做法** — 使用 Windmill Variables/Resources:
```python
import wmill  # Windmill 内置库

def main():
    # 从 Windmill 变量安全读取
    api_key = wmill.get_variable("u/admin/MY_API_KEY")
    # 或者使用 Resource 类型
```

在 Windmill 后台 → **Variables** 里存储敏感信息,脚本通过 `wmill.get_variable()` 读取——凭据加密存储,不会出现在代码历史记录里。

---

## 📝 毕业测验(必须真做,交证据)

**任务:把一段脚本发布成 Windmill Script,让它可以通过 Webhook 触发,并设置一个定时运行。**

**第一阶段:理解(可先做)**

1. **解释 Windmill 的三种触发方式**:手动/Schedule/Webhook 各自适合什么场景?用三个具体的生活场景举例,一一对应。

2. **解释 AGPLv3 的"传染性"**:个人内部使用和"对外提供服务"的区别是什么?举一个"需要买商业许可证"的具体场景。

3. **为什么凭据不能硬编码进脚本**:如果把 API Key 写进代码里会有什么风险?Windmill Variables 如何解决这个问题?

**第二阶段:真做(需要主人确认安装)**

> ⚠️ **先征得主人确认安装 Docker 后再做此阶段。**

4. **启动 Windmill**:运行三条 `curl` 命令下载配置文件,再 `docker compose up -d`,截图 `http://localhost` 登录后的主界面。

5. **修改默认密码**:截图密码修改成功的提示。

6. **写一个 Python Script 并发布**:写一个 `main` 函数接受至少 2 个参数、完成有意义的操作(如抓公开 API 数据、字符串处理等),截图 Windmill 自动生成的 Web 表单界面。

7. **手动运行一次**:在 Web 表单填参数点运行,截图运行结果(Job 详情页,含输入参数和输出结果)。

8. **获取 Webhook 地址并用 curl 测试**:生成 Token(主人操作),用 curl 发一次 POST 请求触发脚本,截图 curl 命令和返回的 Job ID。

9. **设置一个 Schedule**:配置这个脚本每天某个时间自动运行,截图 Schedule 配置页。

10. **沉淀技能卡**:把"Windmill 启动命令 + Script 格式规范 + Webhook 调用方式 + Schedule Cron 写法 + AGPLv3 说明 + 安全清单"沉淀成 `skills/windmill-script.md`。

> ⚠️ **安全边界再强调:**
> - `docker compose up -d` ——**运行前先征得主人确认**
> - 默认密码 `changeme` ——**登录后立即修改**
> - Webhook Token ——**主人亲自生成,不进 git**
> - 凭据存储 ——**用 Windmill Variables,不硬编码**
> - 定时任务 ——**设置前告知主人频率和操作内容**

---

## 🎓 过关标准

- [ ] 你能解释 Windmill 的三种触发方式(手动/Schedule/Webhook)及各自适用场景
- [ ] 你能解释 AGPLv3 的传染性,并说清楚个人内用和商业服务的边界
- [ ] 你理解了为什么要用 Variables 存凭据,而不是硬编码
- [ ] 你成功在本地启动 Windmill,修改了默认密码(有截图)
- [ ] 你写了一个符合格式规范的 Python Script,能在 Windmill 里运行(有截图)
- [ ] 你通过 Webhook(curl)成功触发了脚本执行(有截图)
- [ ] 你设置了一个 Schedule 定时任务(有截图)
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,继续后续课程。
