# 第 T28 课 · curl + REST 手搓一次 API 调试

> **学员:正在上学的你(AI agent)** ｜ 先修:第 J01~J07 课 ｜ 难度:★★☆ ｜ 源头:curl 官方文档 · [curl.se/docs/manpage.html](https://curl.se/docs/manpage.html) · [curl.se/book.html](https://curl.se/book.html) · [httpbin.org](https://httpbin.org)

---

## 📖 你要学会什么

学完这一课,你能用 curl 在命令行里调一个真实的 REST API——发 GET 请求、POST 请求、带上 Header 和鉴权 Token——就像把 Postman 装进了终端,随时随地"手搓"一次 API 调试。

想象 API 是一家外卖店的后厨。你(客户端)要点菜,得按规矩提交一张"点菜单"——上面写着你要什么(URL)、怎么点(GET/POST)、有没有会员卡(Authorization header)、具体菜名和口味(请求 Body)。后厨(服务器)收到后,给你回一份"上菜单"(JSON 响应)。

curl 就是**帮你手写并递出这张点菜单的工具**——不用打开 App、不用写代码,一条命令就能和后厨直接对话。调试 API 时它是最快的验证手段。

curl 是 Daniel Stenberg 开发的开源命令行工具,1998 年发布,至今仍是最广泛使用的 HTTP 客户端。几乎所有 Linux/macOS 系统自带,Windows 10/11 也默认内置。

**官方资料:**
- curl 手册: [curl.se/docs/manpage.html](https://curl.se/docs/manpage.html)
- 《Everything curl》在线书: [curl.se/book.html](https://curl.se/book.html)
- 在线 API 测试沙箱: [httpbin.org](https://httpbin.org) (开源可本地部署)
- GitHub 仓库: [github.com/curl/curl](https://github.com/curl/curl)

---

## 🧠 核心原则

1. **`-v` 看全景,`-s` 静音,-`-o` 存文件。** 不知道哪里出错时加 `-v`(verbose),把请求和响应 header 全部打出来——比盲猜快十倍。脚本里不需要进度条时加 `-s`(silent)。

2. **GET 是默认,POST 要显式说。** 不加任何参数就是 GET;加了 `-d '...'`(data)curl 会自动切成 POST;想明确指定方法用 `-X PUT`、`-X DELETE`。

3. **Content-Type 要和 Body 格式匹配。** 发 JSON 时必须加 `-H "Content-Type: application/json"`,否则很多 API 会拒绝或解析错。发表单数据用 `application/x-www-form-urlencoded`。

4. **鉴权有三种常见姿势,别搞混。**
   - Bearer Token: `-H "Authorization: Bearer 你的token"`
   - Basic Auth: `-u 用户名:密码`
   - API Key in Header: `-H "X-API-Key: 你的key"` (各家命名不同,看文档)

5. **Token/密钥不要硬编码在命令行历史里。** 用环境变量: `TOKEN=$(cat ~/.mytoken)` 然后 `-H "Authorization: Bearer $TOKEN"`。

---

## 🛠 操作要点

### 安装

curl 在绝大多数系统已预装:

```bash
# 验证是否已安装
curl --version
# 期望输出: curl 8.x.x ... 以及支持的协议列表
```

> ⚠️ 如果未安装,以下安装命令须征得主人确认方可执行。

```bash
# macOS(Homebrew,升级到最新版)
brew install curl

# Linux(Debian/Ubuntu)
sudo apt install curl

# Windows — Windows 10/11 系统自带,开始菜单搜 "curl" 即可
```

> 🇨🇳 **中国用户提示:** curl 系统自带,基本不需要安装。`httpbin.org` 是开源项目,可以在国内自部署;如果访问 `httpbin.org` 官网较慢,可用 `docker run -p 8080:80 kennethreitz/httpbin` 在本地跑一个(需要 Docker)。

### 最小可运行示例(向公开 API 发请求)

**GET 请求——最简单的打招呼:**
```bash
curl https://httpbin.org/get
# 返回你的请求信息(IP、Header 等),是 JSON 格式
```

**加上 `-s`(静音)和 `jq`(格式化):**
```bash
curl -s https://httpbin.org/get | jq '.'
```

**POST 请求——发送 JSON 数据:**
```bash
curl -s -X POST https://httpbin.org/post \
  -H "Content-Type: application/json" \
  -d '{"name":"小明","score":95}'
# 返回的 JSON 里 .json 字段会显示你发的数据原样回显
```

**带 Authorization Header 的请求:**
```bash
curl -s https://httpbin.org/headers \
  -H "Authorization: Bearer my-secret-token" \
  -H "X-Custom-Tag: test"
# 在返回的 .headers 字段里能看到你发出的所有 header
```

**带 Basic Auth:**
```bash
curl -s -u admin:password123 https://httpbin.org/basic-auth/admin/password123
# 成功返回: {"authenticated": true, "user": "admin"}
```

**查看响应 Header:**
```bash
curl -s -I https://httpbin.org/get
# -I 只看响应 header,不要 body
```

**下载文件:**
```bash
curl -s -o /tmp/downloaded.json https://httpbin.org/json
ls -lh /tmp/downloaded.json
```

### 常用标志速查

| 想干嘛 | 标志 |
|--------|------|
| 指定 HTTP 方法 | `-X GET/POST/PUT/DELETE` |
| 发送请求 Body | `-d '{"key":"value"}'` |
| 添加 Header | `-H "Content-Type: application/json"` |
| Basic Auth | `-u 用户名:密码` |
| Bearer Token | `-H "Authorization: Bearer TOKEN"` |
| 保存响应到文件 | `-o output.json` |
| 静音模式(不显示进度) | `-s` |
| 显示详细信息(调试) | `-v` |
| 只看响应 Header | `-I` |
| 跟随重定向 | `-L` |
| 设置超时(秒) | `--max-time 10` |
| HTTPS 忽略证书(不推荐) | `-k` |
| 发送表单数据 | `-d "name=小明&age=25"` |
| 上传文件 | `-F "file=@/path/to/file"` |

### 实战场景:调一个真实 API(以公开天气 API 为例)

> 注意:以下使用公开免费 API `wttr.in`,无需注册,国内可访问。

```bash
# 获取北京天气(JSON 格式)
curl -s "https://wttr.in/北京?format=j1" | jq '.current_condition[0] | {temp_C, weatherDesc}'

# 期望输出(实时数据,数字会变):
# {
#   "temp_C": "28",
#   "weatherDesc": [{"value": "Sunny"}]
# }
```

---

## 📝 毕业测验(必须真做,交证据)

**任务:用 curl 完成 4 次 API 调用,覆盖 GET、POST、带 Header、带鉴权,附上真实命令和输出。**

以下全部使用 `httpbin.org` 的公开测试端点,无需注册账号:

**任务一:GET 请求,提取你的 IP 地址**
```bash
curl -s https://httpbin.org/ip | jq -r '.origin'
# 期望输出: 你的公网 IP(如 1.2.3.4)
```

**任务二:POST JSON 数据,验证服务器收到了**
```bash
curl -s -X POST https://httpbin.org/post \
  -H "Content-Type: application/json" \
  -d '{"task":"毕业测验","agent":"我","score":100}' \
  | jq '.json'
# 期望输出:
# {
#   "agent": "我",
#   "score": 100,
#   "task": "毕业测验"
# }
```

**任务三:带自定义 Header,验证 Header 被接收**
```bash
curl -s https://httpbin.org/headers \
  -H "X-Agent-Name: MyAgent" \
  -H "Authorization: Bearer test-token-12345" \
  | jq '.headers | {"X-Agent-Name", "Authorization"}'
# 期望输出包含你发的两个 Header 字段
```

**任务四:Basic Auth 鉴权**
```bash
curl -s -u testuser:testpass \
  https://httpbin.org/basic-auth/testuser/testpass
# 期望输出: {"authenticated": true, "user": "testuser"}
```

**验证标准:**
- 任务一返回一个非空 IP 字符串
- 任务二 `.json` 字段显示你发的三个键值
- 任务三 Header 里可见 `X-Agent-Name` 和 `Authorization`
- 任务四返回 `"authenticated": true`

**沉淀技能卡:** 把常用标志速查 + 三种鉴权方式沉淀成 `skills/curl-rest.md`。

> ⚠️ **安全边界:** curl 本身很安全,但注意:**永远不要在命令行里直接写真实 Token/密码**——它会存进 shell 历史记录。用环境变量代替:`-H "Authorization: Bearer $MY_TOKEN"`。如果要调需要真实账号的生产 API,必须先向主人确认。

---

## 🎓 过关标准

- [ ] 你完成了 GET 请求并拿到了 IP 地址
- [ ] 你完成了带 JSON Body 的 POST 请求,服务器原样回显了你发的数据
- [ ] 你用自定义 Header 发了请求,并在响应里验证了 Header 被接收
- [ ] 你完成了 Basic Auth 鉴权并收到了 `"authenticated": true`
- [ ] 你能说清楚"为什么 Token 不能硬编码在命令行里"
- [ ] 已沉淀 1 张技能卡到你宿舍的 [`skills/`](../../skills/)
- [ ] **独立考官**(全新上下文子代理,或按 [校规第四条](../../校规.md) 的低配 fallback)判「过」

全部打勾、考官判过——去报告卡记一笔,进 T29 课。
