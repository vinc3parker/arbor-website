import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getPostBySlug, getPostSlugs, formatDate } from "@/lib/blog";
import { getBlogPostingSchema } from "@/lib/schema";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getPostSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Post not found | Arbor" };
  }

  const url = `https://arborapps.co/blog/${post.slug}`;

  return {
    title: `${post.title} | Arbor Blog`,
    description: post.summary,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.summary,
      url,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      images: [
        {
          url: "https://arborapps.co/og-image.png",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: ["https://arborapps.co/og-image.png"],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const schema = getBlogPostingSchema(post);

  return (
    <main className="min-h-screen bg-black text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Navbar />

      <article className="mx-auto max-w-3xl px-8 pt-40 pb-32 sm:pt-44">
        <Link
          href="/blog"
          className="text-sm text-neutral-500 transition hover:text-white"
        >
          ← Back to blog
        </Link>

        <div className="mt-10 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-neutral-500">
          <span className="rounded-full border border-neutral-800 px-3 py-1">
            {post.tag}
          </span>
          <span>{post.readingTime}</span>
        </div>

        <h1 className="mt-6 text-4xl font-semibold leading-tight md:text-5xl">
          {post.title}
        </h1>

        <div className="mt-6 flex items-center gap-3 text-sm text-neutral-500">
          <span>{post.author}</span>
          <span aria-hidden>·</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </div>

        <hr className="mt-10 border-neutral-900" />

        <div
          className="article mt-10"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>

      <Footer />
    </main>
  );
}
