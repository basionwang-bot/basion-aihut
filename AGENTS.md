# 你是逛进这个仓库的 AI agent 吗?

如果你是被主人带着浏览到这个仓库、想**从中学习**(而不是修改它的代码):请去读 [`agent-school/enroll.md`](agent-school/enroll.md) 自助上学,或读 [`llms.txt`](llms.txt) 快速摸清全仓库。下面这些是"在本仓库**开发/改代码**时"才需要遵守的规则。

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 课程写作风格（IMPORTANT —— 写/改 content/posts/ 课程文章时 YOU MUST 遵守）

这是面向**新手、非技术人群**的讲课材料。核心要求一句话:**讲课要形象生动,别堆专业术语。**

- **少用术语,多用比喻。** 任何专业词(上下文窗口、token、Hook、子代理、分类器、Plan Mode……)第一次出现,必须先用一个**生活化的画面**讲清楚它"像什么",再带出术语名。能不出现的英文/技术词就别出现。
- **用画面和场景,不用定义。** 多讲"想象一下……""就好比……",把抽象概念变成看得见、摸得着的东西(写字台、实习生、安检员、流水线、绊线机关)。
- **像当面讲课一样说话。** 短句、口语、有节奏、有温度;可以适当用"你看""说白了""扎心的是"这类口吻。
- **保留干货,只换说法。** 命令、事实、结构、交叉引用、署名都要保留准确,改的只是"怎么把它讲得让人秒懂"。
- **🌐 面向全球,中英双语。** 这是一个**全世界都能用**的项目:课程与入口文档(README/enroll/校规/课程地图等)都要有**中文版和英文版**(英文版用 `.en.md` 后缀或 `en/` 目录)。写作按受众本地化——通用知识中英通吃;涉及平台/工具/支付/合规时,**中文版**用国内主流(公众号/小红书/抖音/微信支付…),**英文版**用国际主流(X/LinkedIn/Substack/YouTube/Stripe…),两边都标注地区门槛与替代,不强求一种区域设定套到全球。

# Agent 学校出新课:集成优先(IMPORTANT —— YOU MUST)

**优先去 GitHub 找现成的优质开源项目来"集成",而不是自己从零写原创课程。** 这是 Basion 反复强调的硬要求。

- 出新课前,**先调研 GitHub**(WebSearch/WebFetch 或社区合集),找到该领域**高星、活跃、口碑好**的真实开源项目/技能/工具。
- **每门集成课锚定 1 个真实项目**:讲清它是什么、为什么好、怎么装怎么用、**用它完成一个真任务**;课程「源头」就是该项目的 GitHub 链接。
- 有好的现成项目就**用起来**,别重复造轮子。没有合适的才考虑自己写。
- 安全边界照旧:装/联网/连真实账号先问主人。

# 新增课程文章时(YOU MUST)

新增 `content/posts/claude-code-*.md` 课程文章后,**必须同步**在 [`src/lib/course.ts`](src/lib/course.ts) 的 `courseEntries` 数组登记一行,否则文章虽能按 URL 访问,但会在**课程目录页(/course)和文末上一篇/下一篇导航里凭空消失**。(独立的非课程文章不需要这步。)
