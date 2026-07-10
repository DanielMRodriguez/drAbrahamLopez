import type { CollectionEntry } from "astro:content";

const DIACRITICS_RE = new RegExp(String.fromCharCode(0x5b, 0x5c, 0x75, 0x30, 0x33, 0x30, 0x30, 0x2d, 0x5c, 0x75, 0x30, 0x33, 0x36, 0x66, 0x5d), "g");

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(DIACRITICS_RE, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatPostDate(date: Date): string {
  return date.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function estimateReadMinutes(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

const DEFAULT_AUTHOR = "Dr. Abraham López Venegas";

export function postMetaLine(
  post: CollectionEntry<"blog">,
  author = DEFAULT_AUTHOR,
): string {
  const minutes = estimateReadMinutes(post.body ?? "");
  return `${formatPostDate(post.data.pubDate)} · ${minutes} min · ${author}`;
}

export function primaryCategory(post: CollectionEntry<"blog">): string {
  return post.data.categories[0];
}

export function postHref(post: CollectionEntry<"blog">): string {
  return `/blog/${slugify(primaryCategory(post))}/${post.id}/`;
}

export function categoryHref(category: string): string {
  return `/blog/${slugify(category)}/`;
}

export function sortByDateDesc(
  posts: CollectionEntry<"blog">[],
): CollectionEntry<"blog">[] {
  return [...posts].sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
}

export async function getPublishedPosts(): Promise<CollectionEntry<"blog">[]> {
  const { getCollection } = await import("astro:content");
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return sortByDateDesc(posts);
}

export function allCategories(posts: CollectionEntry<"blog">[]): string[] {
  const seen = new Map<string, string>();
  for (const post of posts) {
    for (const category of post.data.categories) {
      const key = slugify(category);
      if (!seen.has(key)) seen.set(key, category);
    }
  }
  return Array.from(seen.values());
}
