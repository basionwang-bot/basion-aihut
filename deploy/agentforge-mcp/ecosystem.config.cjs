// PM2 配置:让 MCP server 常驻、开机自启、崩溃自动重启
// 用法:pm2 start ecosystem.config.cjs && pm2 save && pm2 startup
module.exports = {
  apps: [
    {
      name: 'agentforge-mcp',
      script: 'server.js',
      env: {
        PORT: '8479',
        AGENTFORGE_REPO: 'basionwang-bot/AgentForge',
        AGENTFORGE_BRANCH: 'main',
        CACHE_TTL_MS: '300000',
      },
      autorestart: true,
      max_restarts: 10,
    },
  ],
};
