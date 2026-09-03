import { createClient } from "@supabase/supabase-js";
import { marked } from "marked";

// Posts live in the shared Supabase `blog_posts` table so they can be created
// and edited from the admin site without redeploying this site. We read only
// PUBLISHED posts, using the public anon key (RLS restricts the rest).
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

export type PostMeta = {
  slug: string;
  title: string;
  date: string; // ISO yyyy-mm-dd
  summary: string;
  tag: string;
  author: string;
  readingTime: string;
  image: string; // social share image, absolute path under /public
};

export type Post = PostMeta & {
  html: string;
};

type Row = {
  slug: string;
  title: string | null;
  summary: string | null;
  tag: string | null;
  author: string | null;
  image: string | null;
  content: string | null;
  published_at: string | null;
};

function formatReadingTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

function toMeta(row: Row): PostMeta {
  return {
    slug: row.slug,
    title: row.title ?? row.slug,
    date: row.published_at
      ? new Date(row.published_at).toISOString().slice(0, 10)
      : "1970-01-01",
    summary: row.summary ?? "",
    tag: row.tag ?? "Update",
    author: row.author ?? "Arbor",
    readingTime: formatReadingTime(row.content ?? ""),
    image: row.image ?? "/og-image.png",
  };
}

const SELECT = "slug, title, summary, tag, author, image, content, published_at";

export async function getAllPosts(): Promise<PostMeta[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select(SELECT)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error || !data) {
    if (error) console.error("[blog] getAllPosts failed:", error.message);
    return [];
  }
  return (data as Row[]).map(toMeta);
}

export async function getPostSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("status", "published");

  if (error || !data) {
    if (error) console.error("[blog] getPostSlugs failed:", error.message);
    return [];
  }
  return (data as { slug: string }[]).map((r) => r.slug);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select(SELECT)
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("[blog] getPostBySlug failed:", error.message);
    return null;
  }
  if (!data) return null;

  const row = data as Row;
  return {
    ...toMeta(row),
    html: marked.parse(row.content ?? "", { async: false }) as string,
  };
}

export function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
