import { createDirectus, rest, staticToken } from "@directus/sdk";

const directus = createDirectus(import.meta.env.DIRECTUS_URL)
  .with(staticToken(import.meta.env.DIRECTUS_TOKEN))
  .with(rest());

export default directus;

export function getAssetUrl(id: string | null | undefined): string | undefined {
  if (!id) return undefined;
  return `${import.meta.env.DIRECTUS_URL}/assets/${id}?access_token=${import.meta.env.DIRECTUS_TOKEN}`;
}
