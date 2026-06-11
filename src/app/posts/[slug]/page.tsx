import { getAllPosts, getPost } from "@/lib/posts";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import type { Metadata } from "next";
import { getCourseNeighbors, isCourseSlug } from "@/lib/course";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} · Basion 的 Ai 小屋`,
    description: post.description,
  };
}

async function CourseNav({ slug }: { slug: string }) {
  const { prev, next } = getCourseNeighbors(slug);
  const posts = await getAllPosts();
  const titleOf = (s: string) => posts.find((p) => p.slug === s)?.title ?? s;

  return (
    <nav className="mt-14 border-t border-[var(--border)] pt-8">
      <Link
        href="/course"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--accent)] transition-opacity hover:opacity-80"
      >
        <BookOpen className="h-3.5 w-3.5" />
        Claude Code 实战课 · 目录
      </Link>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/posts/${prev.slug}`}
            className="group flex flex-col gap-1 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 transition-all hover:border-[var(--accent)]"
          >
            <span className="inline-flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
              <ArrowLeft className="h-3 w-3" /> 上一篇 · {prev.label}
            </span>
            <span className="text-sm font-medium transition-colors group-hover:text-[var(--accent)]">
              {titleOf(prev.slug)}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/posts/${next.slug}`}
            className="group flex flex-col gap-1 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-right transition-all hover:border-[var(--accent)]"
          >
            <span className="inline-flex items-center justify-end gap-1 text-xs text-[var(--muted-foreground)]">
              下一篇 · {next.label} <ArrowRight className="h-3 w-3" />
            </span>
            <span className="text-sm font-medium transition-colors group-hover:text-[var(--accent)]">
              {titleOf(next.slug)}
            </span>
          </Link>
        ) : (
          <span />
        )}
      </div>
    </nav>
  );
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--accent)]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        返回首页
      </Link>

      <header className="mt-8 mb-12 border-b border-[var(--border)] pb-10">
        {post.tag && (
          <span className="text-xs font-medium uppercase tracking-wider text-[var(--accent)]">
            {post.tag}
          </span>
        )}
        <h1 className="mt-3 font-serif text-4xl font-semibold leading-[1.15] tracking-tight md:text-5xl">
          {post.title}
        </h1>
        {post.description && (
          <p className="mt-5 text-lg leading-relaxed text-[var(--muted-foreground)]">
            {post.description}
          </p>
        )}
        <div className="mt-6 flex items-center gap-4 text-sm text-[var(--muted-foreground)]">
          {post.date && <span>{post.date}</span>}
          {post.readingTime && <span>· {post.readingTime} 分钟阅读</span>}
        </div>
      </header>

      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />

      {isCourseSlug(slug) && <CourseNav slug={slug} />}

      <footer className="mt-16 border-t border-[var(--border)] pt-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-5 py-2 text-sm transition-all hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          回到所有笔记
        </Link>
      </footer>
    </article>
  );
}
