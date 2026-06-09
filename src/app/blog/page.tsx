import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getAllPosts, formatDate } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Notes from Arbor | Building Arbor",
  description:
    "Updates, ideas, and behind-the-scenes notes from Vince — building Arbor, an ecosystem of apps for intentional living.",
  keywords:
    "arbor blog, arbor news, arbor updates, intentional living, product updates",
  alternates: {
    canonical: "https://arborapps.co/blog",
  },
  openGraph: {
    title: "Blog — Notes from Arbor",
    description:
      "Updates, ideas, and behind-the-scenes notes from Vince, building Arbor.",
    url: "https://arborapps.co/blog",
    type: "website",
    images: [
      {
        url: "https://arborapps.co/og-image.png",
        width: 1200,
        height: 630,
        alt: "Arbor blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — Notes from Arbor",
    description:
      "Updates, ideas, and behind-the-scenes notes from Vince, building Arbor.",
    images: ["https://arborapps.co/og-image.png"],
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="mx-auto max-w-6xl px-8 pt-40 pb-16 sm:pt-44">
        <p className="mb-6 text-sm uppercase tracking-[0.4em] text-neutral-500">
          THE ARBOR BLOG
        </p>
        <h1 className="max-w-4xl text-5xl font-semibold leading-tight md:text-7xl">
          Notes from building Arbor.
        </h1>
        <p className="mt-8 max-w-2xl text-xl leading-8 text-neutral-400">
          Product updates, ideas, and behind-the-scenes thinking as I build an
          ecosystem of apps for intentional living.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-8 pb-32">
        {posts.length === 0 ? (
          <p className="text-neutral-500">No posts yet. Check back soon.</p>
        ) : (
          <ul className="divide-y divide-neutral-900 border-t border-neutral-900">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block py-10 transition"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between md:gap-8">
                    <div className="max-w-3xl">
                      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-neutral-500">
                        <span className="rounded-full border border-neutral-800 px-3 py-1">
                          {post.tag}
                        </span>
                        <span>{post.readingTime}</span>
                      </div>
                      <h2 className="mt-4 text-2xl font-semibold leading-snug transition group-hover:text-neutral-300 md:text-3xl">
                        {post.title}
                      </h2>
                      <p className="mt-3 text-base leading-7 text-neutral-400">
                        {post.summary}
                      </p>
                    </div>
                    <time
                      dateTime={post.date}
                      className="shrink-0 text-sm text-neutral-500"
                    >
                      {formatDate(post.date)}
                    </time>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Footer />
    </main>
  );
}
