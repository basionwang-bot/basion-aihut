// Claude Code 实战课 —— 系列结构定义（阅读顺序，与文章 frontmatter 的 date 排序无关）。
// 在这里维护课程目录，页面据此渲染目录页和文末上一篇/下一篇导航。

export type CourseEntry = {
  slug: string;
  /** 章节标签，如「开篇」「模块一」「附录」 */
  label: string;
  /** 一句话点题，目录页副标题用 */
  blurb: string;
};

export const COURSE_TITLE = "Claude Code 实战课";
export const COURSE_SUBTITLE =
  "一个人，也是一支队伍——把官方课程大纲扩写成面向新手的系列教程。";

export const courseEntries: CourseEntry[] = [
  { slug: "claude-code-00-intro", label: "开篇", blurb: "底层逻辑 + 学习路线图，先读这篇" },
  { slug: "claude-code-01-mindset", label: "模块一", blurb: "换脑子：从下指令到管理一个干活的人" },
  { slug: "claude-code-02-prompting", label: "模块二", blurb: "提问的精度，决定返工的次数" },
  { slug: "claude-code-03-workflow", label: "模块三", blurb: "黄金工作流：探索 → 计划 → 实现 → 提交" },
  { slug: "claude-code-04-verification", label: "模块四", blurb: "验证闭环：让 Claude 自己检查自己" },
  { slug: "claude-code-05-context", label: "模块五", blurb: "上下文管理：高手和普通用户的分水岭" },
  { slug: "claude-code-06-config", label: "模块六", blurb: "环境配置：一次配置，长期省力" },
  { slug: "claude-code-07-automation", label: "模块七", blurb: "自动化：让 Claude 在你不在场时干活 ⭐" },
  { slug: "claude-code-08-pitfalls", label: "模块八", blurb: "五大典型翻车现场：症状 + 解药" },
  { slug: "claude-code-99-cheatsheet", label: "附录", blurb: "命令速查表 + 官方资料" },
];

export type CoursePath = {
  name: string;
  who: string;
  labels: string[];
};

// 三条分层学习路线（对应开篇里的路线图）
export const coursePaths: CoursePath[] = [
  { name: "新手路线", who: "非技术 / 独立创业者 / 老师", labels: ["开篇", "模块一", "模块二", "模块三", "模块八"] },
  { name: "进阶路线", who: "想认真提效的个人", labels: ["模块四", "模块五", "模块六"] },
  { name: "实战路线", who: "想一个人开一支队伍的人", labels: ["模块七"] },
];

const courseSlugSet = new Set(courseEntries.map((e) => e.slug));

export function isCourseSlug(slug: string): boolean {
  return courseSlugSet.has(slug);
}

export function getCourseLabel(slug: string): string | undefined {
  return courseEntries.find((e) => e.slug === slug)?.label;
}

export function getCourseNeighbors(slug: string): {
  prev?: CourseEntry;
  next?: CourseEntry;
} {
  const i = courseEntries.findIndex((e) => e.slug === slug);
  if (i === -1) return {};
  return {
    prev: i > 0 ? courseEntries[i - 1] : undefined,
    next: i < courseEntries.length - 1 ? courseEntries[i + 1] : undefined,
  };
}
