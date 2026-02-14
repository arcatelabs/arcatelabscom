import type { APIRoute, GetStaticPaths } from "astro";
import { generateOgImage } from "@/lib/og-image";
import directus from "@/lib/directus";
import { readItems } from "@directus/sdk";

export const getStaticPaths: GetStaticPaths = async () => {
  let posts: any[] = [];
  try {
    posts = await directus.request(
      readItems("posts", {
        filter: { status: { _eq: "published" } },
        fields: ["slug", "title", "excerpt"],
      })
    );
  } catch {
    return [];
  }

  return posts.map((post: any) => ({
    params: { slug: post.slug },
    props: { title: post.title, subtitle: post.excerpt },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { title, subtitle } = props as { title: string; subtitle?: string };

  // Truncate subtitle for OG image
  const shortSubtitle = subtitle && subtitle.length > 120
    ? subtitle.slice(0, 117) + "..."
    : subtitle;

  const png = await generateOgImage(title, {
    subtitle: shortSubtitle,
    pageType: "blog",
  });

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
