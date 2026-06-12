// AgentForge 远程 MCP Server
// 作用:让任何支持 MCP 的 agent(Claude Code / Cursor / Cline…)一行配置就能
//       拉取「Agent 养成所」的行为规则与课程内容。
// 特点:服务器本身不存数据,所有内容实时从 GitHub raw 拉取(推送即更新),
//       因此走 raw.githubusercontent.com(无 API 速率限制),只读、无副作用。
//
// 启动:PORT=8479 node server.js
// 健康检查:GET /health  ·  MCP 端点:POST /mcp

import express from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z } from 'zod';

// ---- 配置 ----
const REPO = process.env.AGENTFORGE_REPO || 'basionwang-bot/AgentForge';
const BRANCH = process.env.AGENTFORGE_BRANCH || 'main';
const RAW_BASE = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/`;
const PORT = parseInt(process.env.PORT || '8479', 10);
const CACHE_TTL_MS = parseInt(process.env.CACHE_TTL_MS || '300000', 10); // 5 分钟

// ---- 轻量内存缓存(避免频繁打 GitHub)----
const cache = new Map(); // path -> { at, text }
async function fetchRaw(relPath) {
  const now = Date.now();
  const hit = cache.get(relPath);
  if (hit && now - hit.at < CACHE_TTL_MS) return hit.text;
  const url = RAW_BASE + relPath;
  const resp = await fetch(url, { headers: { 'User-Agent': 'agentforge-mcp' } });
  if (!resp.ok) {
    throw new Error(`无法从 GitHub 拉取 ${relPath}(HTTP ${resp.status})`);
  }
  const text = await resp.text();
  cache.set(relPath, { at: now, text });
  return text;
}

// 路径安全校验:只允许 agent-school/ 下的 .md / .json,禁止 .. 穿越
function safeRepoPath(p) {
  if (typeof p !== 'string') return null;
  const clean = p.replace(/^\/+/, '').trim();
  if (clean.includes('..')) return null;
  if (!clean.startsWith('agent-school/')) return null;
  if (!/\.(md|json)$/i.test(clean)) return null;
  return clean;
}

// 友好文档名 -> 仓库路径
const DOC_MAP = {
  'rules': 'agent-school/templates/dorm/AGENTS.md',     // 七条核心行为规则
  '校规': 'agent-school/校规.md',
  'charter': 'agent-school/校规.md',
  'enroll': 'agent-school/enroll.md',
  '入学': 'agent-school/enroll.md',
  '课程地图': 'agent-school/课程地图.md',
  'course-map': 'agent-school/课程地图.md',
  '出课标准': 'agent-school/出课标准.md',
  '毕业印迹': 'agent-school/毕业印迹.md',
  'readme': 'agent-school/README.md',
  'dorm-readme': 'agent-school/templates/dorm/README.md',
};

// ---- 构建一个 MCP server 实例(每个请求新建,无状态)----
function buildServer() {
  const server = new McpServer({ name: 'agentforge', version: '1.0.0' });

  // 1) 七条核心行为规则——最常用,零参数
  server.registerTool(
    'get_rules',
    {
      description:
        '获取 Agent 养成所的七条核心行为规则(先探索、证据说话、安全边界…)。' +
        'Any agent should read these to behave like an AgentForge graduate.',
      inputSchema: {},
    },
    async () => {
      const text = await fetchRaw(DOC_MAP['rules']);
      return { content: [{ type: 'text', text }] };
    }
  );

  // 2) 列出课程(可按学院 / 语言筛选)
  server.registerTool(
    'list_courses',
    {
      description:
        '列出 AgentForge 全部课程(132 中文 + 100 英文)。可按 faculty(foundations/' +
        'tools/professions/design/media/automation/build)和 lang(zh/en)筛选。返回每门课的 code/title/path。',
      inputSchema: {
        faculty: z.string().optional().describe('学院:foundations/tools/professions/design/media/automation/build'),
        lang: z.enum(['zh', 'en']).optional().describe('语言,默认 zh'),
      },
    },
    async ({ faculty, lang }) => {
      const manifest = JSON.parse(await fetchRaw('agent-school/courses/manifest.json'));
      let list = manifest.courses;
      const wantLang = lang || 'zh';
      list = list.filter((c) => c.lang === wantLang);
      if (faculty) list = list.filter((c) => c.faculty === faculty);
      const lines = list.map((c) => `- [${c.code}] ${c.title}  ·  ${c.path}`);
      const header = `共 ${list.length} 门(lang=${wantLang}${faculty ? `, faculty=${faculty}` : ''})。用 get_course 传入 path 获取正文。\n`;
      return { content: [{ type: 'text', text: header + lines.join('\n') }] };
    }
  );

  // 3) 获取某门课正文
  server.registerTool(
    'get_course',
    {
      description:
        '获取某门课的完整正文。path 来自 list_courses,例如 agent-school/courses/foundations/03-verify.md。',
      inputSchema: {
        path: z.string().describe('课程文件的仓库相对路径(以 agent-school/courses/ 开头)'),
      },
    },
    async ({ path }) => {
      const safe = safeRepoPath(path);
      if (!safe || !safe.startsWith('agent-school/courses/')) {
        throw new Error('path 非法:必须是 agent-school/courses/ 下的 .md 文件');
      }
      const text = await fetchRaw(safe);
      return { content: [{ type: 'text', text }] };
    }
  );

  // 4) 获取学校核心文档(校规 / 入学 / 课程地图…)
  server.registerTool(
    'get_doc',
    {
      description:
        '获取学校核心文档。name 可选:rules(行为规则)、校规、enroll(入学)、课程地图、出课标准、毕业印迹、readme、dorm-readme。',
      inputSchema: {
        name: z.string().describe('文档名,见 description 列表'),
      },
    },
    async ({ name }) => {
      const key = (name || '').trim().toLowerCase();
      const path = DOC_MAP[name] || DOC_MAP[key];
      if (!path) {
        throw new Error(`未知文档名「${name}」。可选:${Object.keys(DOC_MAP).join(', ')}`);
      }
      const text = await fetchRaw(path);
      return { content: [{ type: 'text', text }] };
    }
  );

  return server;
}

// ---- Express + 无状态 Streamable HTTP ----
const app = express();
app.use(express.json({ limit: '4mb' }));

app.get('/health', (_req, res) => {
  res.json({ ok: true, school: 'AgentForge', repo: REPO, branch: BRANCH });
});

// 无状态模式:每个 POST 新建 server + transport,处理完即销毁
app.post('/mcp', async (req, res) => {
  try {
    const server = buildServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined, // undefined = 无状态(stateless)
    });
    res.on('close', () => {
      transport.close();
      server.close();
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (err) {
    console.error('MCP 请求出错:', err);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: '2.0',
        error: { code: -32603, message: '服务器内部错误' },
        id: null,
      });
    }
  }
});

// 无状态模式不支持 GET(SSE 推流)与 DELETE(会话销毁)
const methodNotAllowed = (_req, res) => {
  res.status(405).json({
    jsonrpc: '2.0',
    error: { code: -32000, message: 'Method not allowed(无状态服务,只支持 POST /mcp)' },
    id: null,
  });
};
app.get('/mcp', methodNotAllowed);
app.delete('/mcp', methodNotAllowed);

app.listen(PORT, () => {
  console.log(`AgentForge MCP server 已启动:http://0.0.0.0:${PORT}/mcp`);
  console.log(`数据源:${RAW_BASE}`);
});
