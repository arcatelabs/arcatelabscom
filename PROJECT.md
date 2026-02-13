# PROJECT.md - Arcate Labs Website

> **Project-specific overrides for AGENTS.md defaults.**
> This file has highest priority per AGENTS.md hierarchy.

---

## Project Context

**Arcate Labs** is an automation-first development studio. We build automation systems across industries, with SEO as our sharpest vertical.

- **Live site:** https://arcatelabs.com
- **CMS:** Directus v11 on Railway (`https://directus-production-5c31.up.railway.app`)
- **Hosting:** Vercel (static SSG, auto-deploys from GitHub main)
- **Repo:** github.com/arcatelabs/arcatelabscom

---

## Brand Voice

**Direct. Competent. Warm but not soft.**

### Do
- Say what we do, not what we believe about technology
- Name specific tools and outcomes
- Sound like builders, not consultants
- Use concrete benefits ("That six-hour weekly task? It runs itself now.")

### Don't
- Use philosophy instead of capabilities ("We approach our work with the understanding that...")
- Use agency jargon ("leverage," "drive growth," "solutions partner")
- Be vague about what the prospect is buying
- Overpromise ("page-one rankings in 30 days")

### Voice Examples
- **Good:** "We build systems that generate leads on autopilot — from the site itself to every workflow behind it."
- **Bad:** "We focus on building things that last, designing with scale in mind from the beginning."

---

## CMS Integration (Directus)

All pages fetch data from Directus singletons/collections using `@directus/sdk`. Pattern:

```astro
import directus from "@/lib/directus";
import { readSingleton } from "@directus/sdk";

let data: any = null;
try {
  data = await directus.request(readSingleton("collection_name"));
} catch {
  // Use defaults
}
```

### Collections
| Collection | Type | Purpose |
|---|---|---|
| `homepage` | singleton | Hero, CTA, features config |
| `about_page` | singleton | About page content |
| `contact_page` | singleton | Contact page content |
| `solutions` | items | Service offerings |
| `team_members` | items | Team grid |
| `posts` | items | Blog posts |
| `projects` | items | Portfolio |
| `pages` | items | Generic CMS pages (catch-all route) |

### CMS Content Pattern
Use `??` fallback pattern so the site works even when CMS fields are empty:
```astro
{data?.field ?? "Hardcoded default"}
```

For rich text (WYSIWYG/HTML) content, use conditional rendering:
```astro
{data?.content ? (
  <div set:html={data.content} />
) : (
  <div><!-- hardcoded fallback --></div>
)}
```

---

## Site Architecture

```
/                              -> Homepage
/solutions                     -> Solutions overview (both pillars)
/solutions/automation          -> Automation Engineering (static page)
/solutions/seo                 -> SEO Development (static page)
/solutions/[slug]              -> CMS-driven solution pages (filters out automation, seo)
/projects                      -> Portfolio
/projects/[slug]               -> Project detail
/blog                          -> Blog listing
/blog/[slug]                   -> Blog post
/about                         -> About
/contact                       -> Contact
/[slug]                        -> CMS pages collection (catch-all)
```

### Two Pillars
1. **Automation Engineering** ("The Engine") — workflows, integrations, AI agents
2. **SEO Development** ("The Application") — programmatic sites, content systems, technical SEO

SEO Development is a *product of* Automation Engineering. Frame it that way.

---

## Design Tokens

No custom overrides — using AstroDeck defaults. Colors defined in `src/styles/globals.css`.

---

## Deployment

- Static SSG via Vercel
- Auto-deploys on push to `main`
- CMS content requires rebuild to appear (webhook setup pending)
- **Never force-push to main**

---

## Key Conventions (Beyond AGENTS.md)

1. **Use `BaseLayout` for all pages** unless there's a specific reason for another layout
2. **Keep solution detail pages as static `.astro` files** (not CMS-driven) for the two main pillars — they have structured content (tier cards, service grids) that doesn't belong in a WYSIWYG editor
3. **Blog posts are fully CMS-driven** — no hardcoded blog content
4. **Always include CTA section** at the bottom of service/solution pages
5. **Container width:** `max-w-5xl` for full pages, `max-w-3xl` for text-heavy sections
