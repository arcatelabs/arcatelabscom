import type { APIRoute, GetStaticPaths } from "astro";
import { generateOgImage } from "@/lib/og-image";

type PageType = "default" | "blog" | "solutions" | "about" | "projects";

const pages: { slug: string; title: string; subtitle?: string; pageType: PageType }[] = [
  {
    slug: "index",
    title: "Automation Systems That Do the Work for You",
    subtitle: "Custom workflows, SEO infrastructure, and AI-powered systems.",
    pageType: "default",
  },
  {
    slug: "about",
    title: "About Arcate Labs",
    subtitle: "An automation-first development studio based in Wisconsin.",
    pageType: "about",
  },
  {
    slug: "blog",
    title: "Blog",
    subtitle: "How we think about automation, measurement, and building systems that work.",
    pageType: "blog",
  },
  {
    slug: "solutions",
    title: "Our Solutions",
    subtitle: "Automation engineering and SEO development — two practices, one engine.",
    pageType: "solutions",
  },
  {
    slug: "solutions/automation",
    title: "Automation Engineering",
    subtitle: "Custom workflows, system integrations, and AI-powered automation.",
    pageType: "solutions",
  },
  {
    slug: "solutions/seo",
    title: "SEO Development",
    subtitle: "Programmatic sites, content pipelines, and technical SEO infrastructure.",
    pageType: "solutions",
  },
  {
    slug: "projects",
    title: "Projects",
    subtitle: "Automation systems, programmatic sites, and AI-powered workflows we've built.",
    pageType: "projects",
  },
  {
    slug: "contact",
    title: "Start a Conversation",
    subtitle: "Tell us what's broken. We'll tell you if we can automate it.",
    pageType: "default",
  },
];

export const getStaticPaths: GetStaticPaths = () => {
  return pages.map((page) => ({
    params: { slug: page.slug },
    props: page,
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { title, subtitle, pageType } = props as (typeof pages)[number];
  const png = await generateOgImage(title, { subtitle, pageType });

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
