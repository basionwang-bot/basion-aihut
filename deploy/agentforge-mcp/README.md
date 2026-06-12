# AgentForge 远程 MCP Server · 部署手册

一个**只读、无状态**的远程 MCP 服务,让任何支持 MCP 的 agent(Claude Code / Cursor / Cline…)
一行配置就能拉取「Agent 养成所」的**行为规则**和**课程内容**。

- **数据源**:实时从 GitHub raw 拉取(`raw.githubusercontent.com`,无 API 速率限制)——**仓库一推送,服务即更新**,服务器本身不存任何数据。
- **安全**:只读;路径白名单(只允许 `agent-school/` 下的 `.md`/`.json`,禁止 `..` 穿越);无副作用。
- **提供的工具**:`get_rules`(七条行为规则)、`list_courses`、`get_course`、`get_doc`。

---

## 0. 先确认服务器环境(在你的腾讯云上跑)

```bash
node -v        # 需要 ≥ 18(自带 fetch)。没有就装,见下。
```

**没装 Node 的话**(以 Ubuntu/Debian 为例):

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v        # 验证
```

CentOS/腾讯云 TencentOS:

```bash
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs
```

---

## 1. 拉代码 + 装依赖

```bash
# 在服务器上
git clone https://github.com/basionwang-bot/AgentForge.git
cd AgentForge/deploy/agentforge-mcp
npm install
```

> 服务器在国内、npm 慢的话:`npm config set registry https://registry.npmmirror.com` 再 `npm install`。

---

## 2. 先跑起来试一下

```bash
PORT=8479 node server.js
# 看到「AgentForge MCP server 已启动」就对了
```

另开一个终端测健康检查:

```bash
curl http://127.0.0.1:8479/health
# {"ok":true,"school":"AgentForge",...}
```

`Ctrl+C` 停掉,进入下一步让它常驻。

---

## 3. 常驻运行(PM2,开机自启 + 崩溃自动重启)

```bash
sudo npm install -g pm2
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup        # 按它打印的命令再执行一次,实现开机自启
pm2 logs agentforge-mcp   # 看日志
```

---

## 4. 放行端口(关键!很多人卡在这)

**两道防火墙都要放行 8479:**

1. **腾讯云控制台 → 安全组**:添加入站规则,放行 TCP `8479`(来源 `0.0.0.0/0` 表示公开)。
2. **服务器本机防火墙**(如果开了):
   ```bash
   sudo ufw allow 8479/tcp           # Ubuntu
   # 或 firewall-cmd --add-port=8479/tcp --permanent && firewall-cmd --reload   # CentOS
   ```

放行后,从你自己电脑测:

```bash
curl http://124.222.188.195:8479/health
```

能返回 JSON 就通了。

---

## 5.(推荐)套个域名 + HTTPS

公开服务直接暴露 IP+端口能用,但**很多 MCP 客户端要求 HTTPS**。建议用 Nginx 反代 + Let's Encrypt:

```nginx
# /etc/nginx/conf.d/agentforge.conf
server {
    server_name mcp.你的域名.com;
    location /mcp  { proxy_pass http://127.0.0.1:8479/mcp;  proxy_buffering off; }
    location /health { proxy_pass http://127.0.0.1:8479/health; }
}
```

```bash
sudo certbot --nginx -d mcp.你的域名.com    # 自动配 HTTPS
```

最终端点就是:`https://mcp.你的域名.com/mcp`

---

## 6. 在 Agent 里注册(给最终用户用的)

### Claude Code

```bash
claude mcp add --transport http agentforge https://mcp.你的域名.com/mcp
# 没域名、只有 IP+HTTP 也能试:
claude mcp add --transport http agentforge http://124.222.188.195:8479/mcp
```

之后在对话里就能让 agent:「用 agentforge 查一下行为规则」「列出工具学院的课程」。

### Cursor / Cline 等

在它们的 MCP 配置里加:

```json
{
  "mcpServers": {
    "agentforge": {
      "url": "https://mcp.你的域名.com/mcp"
    }
  }
}
```

---

## 工具一览

| 工具 | 参数 | 作用 |
|------|------|------|
| `get_rules` | 无 | 七条核心行为规则(最常用) |
| `list_courses` | `faculty?` `lang?` | 列课程,可按学院/语言筛选 |
| `get_course` | `path` | 取某门课正文(path 来自 list_courses) |
| `get_doc` | `name` | 取核心文档:rules/校规/enroll/课程地图/出课标准/毕业印迹/readme |

---

## 配置项(环境变量)

| 变量 | 默认 | 说明 |
|------|------|------|
| `PORT` | `8479` | 监听端口 |
| `AGENTFORGE_REPO` | `basionwang-bot/AgentForge` | 数据源仓库 |
| `AGENTFORGE_BRANCH` | `main` | 分支 |
| `CACHE_TTL_MS` | `300000` | 内存缓存 5 分钟(降低对 GitHub 的请求频率) |

> ⚠️ 当前为**公开服务、无鉴权**。若想只给自己用,可在 Nginx 层加一个 `proxy_set_header` token 校验,
> 或后续给 server 加 Bearer token 中间件——按需扩展。
