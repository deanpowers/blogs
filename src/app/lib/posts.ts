

export type Post = {
    id: number;
    slug: string;
    title: string;
    description: string;
    content: string;
    date: string;
    acf: {
        abstract_: string,
        thumbnail: number
    };
};

// Static fallback data (kept for local development / fallback)
const POSTS: Post[] = [
    {
        id: 0,
        slug: "hello-world",
        title: "Hello World",
        description: "Welcome to the sample blog. This is a starter post.",
        content: `# Hello World

This is a sample post to demonstrate the blog scaffold. You can edit this content in src/app/lib/posts.ts.

- Built with Next.js App Router
- TypeScript + Tailwind CSS
`,
        date: "2025-10-15",
        acf: {
            abstract_: "",
            thumbnail: 0
        }
    },
    {
        id: 0,
        slug: "second-post",
        title: "Second Post",
        description: "Another example post to show listing and routing.",
        content: `## Second Post

More content here. Replace with Markdown or fetch from an API.
`,
        date: "2025-10-14",
        acf: {
            abstract_: "",
            thumbnail: 0
        }
    },
];

const BACKEND_URL = "https://zojaxblogs.wpengine.com";

function stripHtml(input = "") {
    return input.replace(/<[^>]*>/g, "").trim();
}

async function safeFetchJson(url: string) {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
    return (await res.json()) as any;
}

export async function getAllPosts(): Promise<Post[]> {
    try {
        let data: any;
        // try WordPress-style
        data = await safeFetchJson(`${BACKEND_URL}/wp-json/wp/v2/posts`);
        if (!Array.isArray(data)) return POSTS;

        const result = data.map((p: any) => {
            if (p.title && typeof p.title === "object" && "rendered" in p.title) {
                // WordPress post object
                return {
                    id: p.id,
                    slug: p.slug,
                    title: p.title?.rendered ?? "",
                    description: stripHtml(p.excerpt?.rendered ?? ""),
                    content: p.content?.rendered ?? "",
                    date: p.date ?? "",
                    acf: p?.acf ?? { abstract_: "", thumbnail: 0 }
                } as Post;
            }

            // Generic JSON API shape
            return {
                id: p.id,
                slug: p.slug ?? p.id?.toString() ?? "",
                title: p.title ?? "",
                description: p.description ?? p.excerpt ?? "",
                content: p.content ?? p.body ?? "",
                date: p.date ?? p.published_at ?? "",
                acf: p?.acf ?? { abstract_: "", thumbnail: 0 }
            } as Post;
        })
        // Normalize known shapes
        return result;
    } catch (err) {
        // On any error, fall back to static POSTS
        // eslint-disable-next-line no-console
        console.error("Failed to load posts from backend, falling back to static posts:", err);
        return POSTS.slice().sort((a, b) => (a.date < b.date ? 1 : -1));
    }
}

export async function getPostBySlug(id: number): Promise<Post | null> {

    try {
        const base = BACKEND_URL.replace(/\/$/, "");
        // Try /posts/{slug} or query by slug (WordPress)
        try {
            const p = await safeFetchJson(`${BACKEND_URL}/wp-json/wp/v2/posts/${id}`);
            if (p) {
                if (p.title && typeof p.title === "object" && "rendered" in p.title) {
                    return {
                        slug: p.slug,
                        title: p.title?.rendered ?? "",
                        description: stripHtml(p.excerpt?.rendered ?? ""),
                        content: p.content?.rendered ?? "",
                        date: p.date ?? "",
                    } as Post;
                }

                return {
                    slug: p.slug,
                    title: p.title ?? "",
                    description: p.description ?? "",
                    content: p.content ?? p.body ?? "",
                    date: p.date ?? "",
                } as Post;
            }
        } catch (e) {
            // try WordPress query by slug
            const list = await safeFetchJson(`${base}/wp-json/wp/v2/posts?slug=${id}`);
            if (Array.isArray(list) && list.length) {
                const p = list[0];
                return {
                    slug: p.slug,
                    title: p.title?.rendered ?? "",
                    description: stripHtml(p.excerpt?.rendered ?? ""),
                    content: p.content?.rendered ?? "",
                    date: p.date ?? "",
                } as Post;
            }
        }

        return null;
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Failed to load post from backend, falling back to static posts:", err);
        return null;
    }
}
