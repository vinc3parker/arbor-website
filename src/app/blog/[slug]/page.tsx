import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getPostBySlug, getPostSlugs, formatDate } from "@/lib/blog";
import { getBlogPostingSchema } from "@/lib/schema";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return (await getPostSlugs()).map((slug) => ({ slug }));
}

// Allow posts created after build to render on demand, and re-read at most
// once a minute so edits appear without a redeploy.
export const dynamicParams = true;
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Post not found | Arbor" };
  }

  const url = `https://arborapps.co/blog/${post.slug}`;
  const image = `https://arborapps.co${post.image}`;

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
          url: image,
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
      images: [image],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const schema = getBlogPostingSchema(post);

  return (
    <main className="min-h-screen bg-bg text-fg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Navbar />

      <article className="site-container max-w-3xl pt-40 pb-32 sm:pt-44">
        <Link
          href="/blog"
          className="text-sm text-fg-3 transition hover:text-fg"
        >
          ← Back to blog
        </Link>

        <div className="mt-10 flex items-center gap-3 type-caption text-fg-2">
          <span className="rounded-full border border-line px-3 py-1">
            {post.tag}
          </span>
          <span>{post.readingTime}</span>
        </div>

        <h1 className="type-h1 mt-6">
          {post.title}
        </h1>

        <div className="mt-6 flex items-center gap-3 type-caption text-fg-2">
          <span>{post.author}</span>
          <span aria-hidden>·</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </div>

        <hr className="mt-10 border-line" />

        <div
          className="article mt-10"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>

      <Footer />
    </main>
  );
}
