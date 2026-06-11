import Link from "next/link";
import { ArrowLeft, ArrowUpRight, BookOpen, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import {
  COURSE_SUBTITLE,
  COURSE_TITLE,
  coursePaths,
  courseEntries,
} from "@/lib/course";

export const metadata: Metadata = {
  title: `${COURSE_TITLE} · Basion 的 Ai 小屋`,
  description: COURSE_SUBTITLE,
};

export default async function CoursePage() {
  const posts = await getAllPosts();
  const metaBySlug = new Map(posts.map((p) => [p.slug, p]));
  const lessons = courseEntries.map((e) => ({ ...e, meta: metaBySlug.get(e.slug) }));
  const totalMinutes = lessons.reduce(
    (sum, l) => sum + (l.meta?.readingTime ?? 0),
    0
  );

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--accent)]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        返回首页
      </Link>

      {/* 课程头部 */}
      <header className="mt-8 border-b border-[var(--border)] pb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-3.5 py-1 text-xs text-[var(--muted-foreground)] shadow-sm">
          <Sparkles className="h-3 w-3 text-[var(--accent)]" />
          <span>系列教程 · {lessons.length} 篇 · 约 {totalMinutes} 分钟读完</span>
        </div>
        <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
          {COURSE_TITLE}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--muted-foreground)]">
          {COURSE_SUBTITLE}
        </p>
        <Link
          href={`/posts/${courseEntries[0].slug}`}
          className="group mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-medium text-[var(--accent-foreground)] shadow-sm transition-all hover:opacity-90 hover:shadow-md"
        >
          <BookOpen className="h-4 w-4" />
          从开篇开始读
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </header>

      {/* 三条学习路线 */}
      <section className="mt-12">
        <h2 className="font-serif text-2xl font-semibold tracking-tight">
          按你是谁，选一条路线
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {coursePaths.map((path) => (
            <div
              key={path.name}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"
            >
              <p className="text-sm font-semibold text-[var(--accent)]">
                {path.name}
              </p>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                {path.who}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {path.labels.map((label) => (
                  <span
                    key={label}
                    className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-xs text-[var(--muted-foreground)]"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 课程目录 */}
      <section className="mt-12">
        <h2 className="font-serif text-2xl font-semibold tracking-tight">
          课程目录
        </h2>
        <ol className="mt-6 space-y-3">
          {lessons.map((lesson, i) => (
            <li key={lesson.slug}>
              <Link
                href={`/posts/${lesson.slug}`}
                className="group flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-lg"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--border)] font-serif text-sm font-semibold text-[var(--muted-foreground)] transition-colors group-hover:border-[var(--accent)] group-hover:text-[var(--accent)]">
                  {String(i).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium uppercase tracking-wider text-[var(--accent)]">
                      {lesson.label}
                    </span>
                    {lesson.meta?.readingTime && (
                      <span className="text-xs text-[var(--muted-foreground)]">
                        · {lesson.meta.readingTime} 分钟
                      </span>
                    )}
                  </div>
                  <h3 className="mt-0.5 truncate font-serif text-lg font-semibold text-[var(--card-foreground)] transition-colors group-hover:text-[var(--accent)]">
                    {lesson.meta?.title ?? lesson.slug}
                  </h3>
                  <p className="mt-0.5 truncate text-sm text-[var(--muted-foreground)]">
                    {lesson.blurb}
                  </p>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--muted-foreground)] transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent)]" />
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <footer className="mt-16 border-t border-[var(--border)] pt-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-5 py-2 text-sm transition-all hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          回到所有笔记
        </Link>
      </footer>
    </div>
  );
}
