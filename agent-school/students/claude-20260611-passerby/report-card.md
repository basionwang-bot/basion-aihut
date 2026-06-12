# 📋 报告卡 · Agent 养成所

> **使用说明(给正在上学的 agent):**
> 这是你的**内部成绩单 + 证据档案**。每过一门课填一格。
> 证据必须是你**真实执行**的命令和输出(见 [校规](校规.md)),不许编造。
> 每门课**必须经独立考官判"过"**才算过(校规第四条)。
> 全部过完,再去填面向用户的 [结业报告](结业报告模板.md)。

- **学员(agent)**:Claude(claude-opus-4-8),一个逛进本仓库的过路 agent
- **入学日期**:2026-06-11
- **掌握等级口径**:生疏 → 学习中 → 熟练 → 精通
- **独立考官**:全新上下文 general-purpose 子代理(agentId ab05f9f879ab07be8),自己重跑了 `npx next build`、自己读了源码核验,未听信我的文字声称。四门课均判「过」。

---

## 第一课 · 先探索,再动手 ★☆☆

- **状态**:☑ 已过
- **探索结论**(真实读了哪些文件、得出什么):
  > 读了 `package.json`、`src/lib/posts.ts`、`src/lib/course.ts`、`content/posts/` 目录、两篇文章的 frontmatter。结论:这是一个 Next.js 16 + Tailwind 的内容站(Basion 的 Ai 小屋)。文章是 `content/posts/*.md`,加载器 `src/lib/posts.ts` 用 gray-matter 解析 frontmatter + remark/GFM 渲染(`sanitize:false`)。slug = 文件名去掉 `.md`。frontmatter 字段:`title`(缺省回退成 slug)、`description`(可选)、`date`(YYYY-MM-DD,列表按它倒序)、`tag`(可选);`readingTime` 自动算。
- **新增文章的计划**(文件放哪、格式、字段、命名):
  > 新建 `content/posts/<slug>.md`,文件名即 URL slug;顶部写 YAML frontmatter(title/description/date/tag);正文 markdown。**关键补强(来自第三课的干净复查)**:若是 `claude-code-*` 课程系列文章,还必须去 `src/lib/course.ts` 的 `courseEntries` 数组手动加一行,否则文章页能访问、但在目录页和文末上一篇/下一篇导航里"凭空消失"。独立文章则不需要这步。
- **沉淀的技能卡**:`skills/explore-before-acting.md`
- **独立考官结论**:☑ 过(理由:探索结论与 posts.ts/course.ts 源码逐条对得上;计划精确到文件/格式/位置;技能卡引用真实路径,含 courseEntries 这个坑)
- **掌握等级**:☑ 熟练
- **完成时间**:2026-06-11

---

## 第二课 · 管好你的工作记忆 ★★☆

- **状态**:☑ 已过
- **子代理调研**(为什么用 + 带回的结论):
  > **为什么用子代理**:"调研仓库文章怎么组织"是个要扫多文件、但我最终只要一个结论的活。让 Explore 子代理在它自己的桌面上读 posts.ts + 样本文件,只把结论端回来,我的主上下文不被一堆文件正文撑满。**它带回的结论**:文章在 `content/posts/`;必需 title+date,可选 description/tag;slug=文件名;按 date 倒序;新文章只要有合法 frontmatter 就能 build 通过。
- **范围控制的正反例**:
  > **反面(撑爆桌子)**:"研究一下这个仓库" —— 没边界,会逼我把几百个文件读进主上下文,越读越抓不住重点。
  > **正面(收窄)**:"只回答:文章放哪个目录、frontmatter 有哪些字段、slug 怎么来、列表怎么排序" —— 答案有限,读的东西也有限,结论还能直接用。
- **沉淀的技能卡**:`skills/protect-working-memory.md`
- **独立考官结论**:☑ 过(理由:真派了 Explore 子代理且要求只回结论;正反例具体可感)
- **掌握等级**:☑ 熟练
- **完成时间**:2026-06-11

---

## 第三课 · 先自检,再交作业 ★★★

- **状态**:☑ 已过
- **我跑的验证命令 + 真实输出**:
  ```
  $ npx next build
  ▲ Next.js 16.2.4 (Turbopack)
    Creating an optimized production build ...
  ✓ Compiled successfully in 8.8s
    Running TypeScript ...
    Finished TypeScript in 3.8s ...
  ✓ Generating static pages using 3 workers (17/17) in 704ms
  Route (app): / , /_not-found , /course , /posts/[slug] (claude-code-00-intro ... [+9 more paths])
  ```
  尺子的来源:`package.json` 的 scripts 只有 dev/build/start,没有 test/lint,所以验证站点没坏的唯一尺子就是 `npx next build`。独立考官**自己又重跑了一遍**,同样得到 `✓ Compiled successfully` + 17/17 静态页。
- **"差的交付"vs"好的交付"**:
  > 差:"我改好了,应该没问题。"
  > 好:"我改好了,跑了 `npx next build`,输出 `✓ Compiled successfully` + 17/17 静态页全部生成,验证通过。"
- **干净助手的复查意见 + 我的处理**:
  > 派了一个干净上下文子代理复查我"如何新增文章"的结论。它报了一个**真问题**(非风格偏好):`claude-code-*` 课程文章除了建 md,还必须在 `src/lib/course.ts` 的 `courseEntries` 里登记,否则导航里看不到。**我的处理**:亲自打开 `src/lib/course.ts:15-28` 核实属实,把这条补进了第一课的计划和 `add-post-and-verify.md` 技能卡的"注意"里。
- **沉淀的技能卡**:`skills/verify-with-evidence.md`
- **独立考官结论**:☑ 过(理由:考官亲自重跑 build,真实输出可复现;package.json 确实只有 dev/build/start;复查发现的 courseEntries 缺口属实且已被采纳)
- **掌握等级**:☑ 熟练
- **完成时间**:2026-06-11

---

## 第四课 · 给自己装备技能 ★★☆

- **状态**:☑ 已过
- **我的装备盘点**(真实查到的工具/技能/钩子,引用文件):
  > **当前实有能力**:读文件(Read/Glob/Grep)、跑命令(Bash)、派子代理(Agent,本次真用了 Explore + general-purpose 两类)。**仓库里已配置的装备**:`AGENTS.md`(=`CLAUDE.md` 经 `@AGENTS.md` 引入)定义了开发规则(写 Next.js 前先读 `node_modules/next/dist/docs/`、课程写作风格);**没有 `.claude/` 目录**(考官确认 "No such file or directory"),即本仓库未配置自定义 Skills/Hooks/MCP——这些靠 harness 侧提供。**四种装备**:技能=工具抽屉、子代理=能调来的专家、钩子=某动作必触发的自动机关、插件=打包好的礼盒。
- **可复用工作流清单**:
  > 见 `skills/add-post-and-verify.md`:决定类型 → 建 `content/posts/<slug>.md` → 写 frontmatter → (课程文章)登记 courseEntries → `npx next build` 验证 → 摆 build 输出交付。
- **缺口分析**:
  > 若要把"新增文章"做成一键技能:还缺一个带参数的脚手架(给定 slug/title/tag 自动生成 md + 在课程文章时自动插 courseEntries)+ 一个 post-edit 钩子自动跑 `next build` 把关。可去官方技能仓库(github.com/anthropics/skills)、`/plugin` 市场、awesome-claude-skills 找现成的;本仓库 `content/posts/claude-code-90-arsenal.md` 里也列了真家伙(如 Scrapling 爬虫框架,自带 MCP)。
- **沉淀的技能卡**:`skills/add-post-and-verify.md`
- **独立考官结论**:☑ 过(理由:盘点准确——确无 .claude/,AGENTS.md/CLAUDE.md 描述无误;产出了真正端到端可复用的工作流卡)
- **掌握等级**:☑ 熟练
- **完成时间**:2026-06-11

---

## 🔁 回归复诊(防退化,校规第六条)

| 复诊日期 | 抽查了哪门课 | 还达标吗 | 备注 |
|----------|--------------|----------|------|
| 2026-06-11 | 第三课(交付即跑 build) | 是 | 毕业当天即用上:所有"改完了"的声称都附了真实 build 输出 |

---

## 🎓 下一步

四门课都拿到考官的"过"、技能库有 4 张技能卡(已满足)。已填 [结业报告](结业报告模板.md) 并当面向用户汇报。
