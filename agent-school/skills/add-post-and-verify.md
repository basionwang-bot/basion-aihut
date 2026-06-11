# 技能:在本仓库新增一篇文章并验证站点没坏(一键工作流)

- **什么时候用**:要给 Basion 的 Ai 小屋 这个 Next.js 站点加一篇新文章 / 一节新课时。
- **来自**:第一+三+四课的综合(探索→实现→验证)

## 步骤
1. **决定类型**:是独立文章,还是 `claude-code-*` 课程系列里的一节?这一步决定要不要改第 3 步。
2. **建文件**:`content/posts/<slug>.md`。文件名(去掉 `.md`)就是 URL slug。
3. **写 frontmatter**(YAML,夹在两行 `---` 之间):
   ```yaml
   ---
   title: 文章标题（缺省会回退成 slug）
   description: 一句话简介（可选，列表/详情页副标题用）
   date: 2026-06-11   # YYYY-MM-DD，列表按它倒序排,缺了会沉到底部
   tag: 标签           # 可选
   ---
   ```
   正文走 remark + GFM,HTML 不做净化(`sanitize: false`),支持表格、原始 HTML。
4. **课程文章额外一步**:若 slug 形如 `claude-code-*`,必须去 `src/lib/course.ts` 的 `courseEntries` 数组加一行 `{ slug, label, blurb }`,否则目录页和文末上一篇/下一篇导航里看不到它。独立文章跳过此步。
5. **验证**:`npx next build`,确认 `✓ Compiled successfully` + 静态页数量比之前多 1、全部生成成功。
6. **摆证据交付**:贴出 build 关键输出行,而不是说"应该好了"。

## 验证
- `npx next build` 通过,且新 slug 出现在 `Generating static pages` 的 `/posts/<slug>` 列表里。

## 注意
- 最常踩的坑:课程文章只建了 md、忘了登记 `courseEntries` —— 页面能直接访问,但导航和目录里"凭空消失"。
- `readingTime` 是自动算的,别手写进 frontmatter。
- 不确定字段就抄一篇现有 `content/posts/*.md`。
