import satori from "satori";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const fontsDir = path.resolve("public/fonts");

const eurostile = fs.readFileSync(path.join(fontsDir, "Eurostile.ttf"));
const geistRegular = fs.readFileSync(path.join(fontsDir, "Geist-Regular.ttf"));
const geistBold = fs.readFileSync(path.join(fontsDir, "Geist-Bold.ttf"));

type PageType = "default" | "blog" | "solutions" | "about" | "projects";

// Abstract geometric pattern elements per page type
const patterns: Record<PageType, any> = {
  default: {
    // Diagonal grid lines
    elements: [
      { type: "line", x1: 900, y1: 0, x2: 1200, y2: 300, color: "rgba(245,156,41,0.12)" },
      { type: "line", x1: 950, y1: 0, x2: 1200, y2: 250, color: "rgba(245,156,41,0.08)" },
      { type: "line", x1: 1000, y1: 0, x2: 1200, y2: 200, color: "rgba(245,156,41,0.06)" },
      { type: "circle", cx: 1100, cy: 150, r: 80, color: "rgba(245,156,41,0.06)" },
      { type: "circle", cx: 1050, cy: 250, r: 40, color: "rgba(245,156,41,0.04)" },
    ],
    accentBar: "rgba(245,156,41,1)",
  },
  blog: {
    elements: [
      { type: "circle", cx: 1080, cy: 120, r: 120, color: "rgba(245,156,41,0.08)" },
      { type: "circle", cx: 1080, cy: 120, r: 80, color: "rgba(245,156,41,0.06)" },
      { type: "circle", cx: 1080, cy: 120, r: 40, color: "rgba(245,156,41,0.10)" },
      { type: "rect", x: 950, y: 380, w: 200, h: 200, color: "rgba(245,156,41,0.04)", rotate: 45 },
    ],
    accentBar: "rgba(245,156,41,1)",
  },
  solutions: {
    elements: [
      { type: "rect", x: 1000, y: 50, w: 150, h: 150, color: "rgba(245,156,41,0.08)", rotate: 15 },
      { type: "rect", x: 1050, y: 150, w: 100, h: 100, color: "rgba(245,156,41,0.06)", rotate: 30 },
      { type: "rect", x: 980, y: 250, w: 80, h: 80, color: "rgba(245,156,41,0.04)", rotate: 45 },
      { type: "circle", cx: 1100, cy: 450, r: 60, color: "rgba(245,156,41,0.05)" },
    ],
    accentBar: "rgba(245,156,41,1)",
  },
  about: {
    elements: [
      { type: "circle", cx: 1050, cy: 315, r: 200, color: "rgba(245,156,41,0.04)" },
      { type: "circle", cx: 1050, cy: 315, r: 140, color: "rgba(245,156,41,0.04)" },
      { type: "circle", cx: 1050, cy: 315, r: 80, color: "rgba(245,156,41,0.04)" },
    ],
    accentBar: "rgba(245,156,41,1)",
  },
  projects: {
    elements: [
      { type: "line", x1: 850, y1: 630, x2: 1200, y2: 280, color: "rgba(245,156,41,0.10)" },
      { type: "line", x1: 900, y1: 630, x2: 1200, y2: 330, color: "rgba(245,156,41,0.07)" },
      { type: "line", x1: 950, y1: 630, x2: 1200, y2: 380, color: "rgba(245,156,41,0.05)" },
      { type: "circle", cx: 1100, cy: 500, r: 50, color: "rgba(245,156,41,0.06)" },
    ],
    accentBar: "rgba(245,156,41,1)",
  },
};

function buildSvgPattern(pageType: PageType): string {
  const p = patterns[pageType];
  let svg = "";
  for (const el of p.elements) {
    if (el.type === "circle") {
      svg += `<circle cx="${el.cx}" cy="${el.cy}" r="${el.r}" fill="${el.color}" />`;
    } else if (el.type === "rect") {
      const rotate = el.rotate ? ` transform="rotate(${el.rotate} ${el.x + el.w / 2} ${el.y + el.h / 2})"` : "";
      svg += `<rect x="${el.x}" y="${el.y}" width="${el.w}" height="${el.h}" fill="${el.color}"${rotate} rx="4" />`;
    } else if (el.type === "line") {
      svg += `<line x1="${el.x1}" y1="${el.y1}" x2="${el.x2}" y2="${el.y2}" stroke="${el.color}" stroke-width="2" />`;
    }
  }
  return svg;
}

export async function generateOgImage(
  title: string,
  options?: {
    subtitle?: string;
    pageType?: PageType;
  }
): Promise<Buffer> {
  const pageType = options?.pageType ?? "default";
  const subtitle = options?.subtitle;
  const pattern = patterns[pageType];

  // Build the SVG pattern as a data URI for the background
  const patternSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">${buildSvgPattern(pageType)}</svg>`;
  const patternDataUri = `data:image/svg+xml,${encodeURIComponent(patternSvg)}`;

  // Truncate long titles
  const displayTitle = title.length > 80 ? title.slice(0, 77) + "..." : title;

  const markup = {
    type: "div" as const,
    props: {
      style: {
        width: "1200px",
        height: "630px",
        display: "flex",
        flexDirection: "column" as const,
        backgroundColor: "#14181A",
        position: "relative" as const,
        overflow: "hidden",
      },
      children: [
        // Background pattern overlay
        {
          type: "img" as const,
          props: {
            src: patternDataUri,
            width: 1200,
            height: 630,
            style: {
              position: "absolute" as const,
              top: 0,
              left: 0,
              width: "1200px",
              height: "630px",
            },
          },
        },
        // Top accent bar
        {
          type: "div" as const,
          props: {
            style: {
              width: "1200px",
              height: "4px",
              backgroundColor: pattern.accentBar,
            },
          },
        },
        // Content area
        {
          type: "div" as const,
          props: {
            style: {
              flex: 1,
              display: "flex",
              flexDirection: "column" as const,
              justifyContent: "space-between" as const,
              padding: "60px 72px",
              position: "relative" as const,
            },
            children: [
              // Title block
              {
                type: "div" as const,
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "column" as const,
                    gap: "16px",
                    maxWidth: "850px",
                  },
                  children: [
                    {
                      type: "div" as const,
                      props: {
                        style: {
                          fontSize: displayTitle.length > 50 ? "42px" : "52px",
                          fontFamily: "Eurostile",
                          fontWeight: 400,
                          color: "#FAFAFA",
                          lineHeight: 1.15,
                          letterSpacing: "0.02em",
                        },
                        children: displayTitle,
                      },
                    },
                    ...(subtitle
                      ? [
                          {
                            type: "div" as const,
                            props: {
                              style: {
                                fontSize: "22px",
                                fontFamily: "Geist",
                                fontWeight: 400,
                                color: "rgba(255,255,255,0.55)",
                                lineHeight: 1.4,
                                maxWidth: "700px",
                              },
                              children: subtitle,
                            },
                          },
                        ]
                      : []),
                  ],
                },
              },
              // Footer: logo + domain
              {
                type: "div" as const,
                props: {
                  style: {
                    display: "flex",
                    alignItems: "center" as const,
                    justifyContent: "space-between" as const,
                  },
                  children: [
                    {
                      type: "div" as const,
                      props: {
                        style: {
                          display: "flex",
                          alignItems: "center" as const,
                          gap: "12px",
                        },
                        children: [
                          // Orange dot as logo stand-in
                          {
                            type: "div" as const,
                            props: {
                              style: {
                                width: "32px",
                                height: "32px",
                                borderRadius: "6px",
                                backgroundColor: "#F59C29",
                              },
                            },
                          },
                          {
                            type: "div" as const,
                            props: {
                              style: {
                                fontSize: "22px",
                                fontFamily: "Eurostile",
                                fontWeight: 400,
                                color: "rgba(255,255,255,0.7)",
                                letterSpacing: "0.04em",
                              },
                              children: "ARCATE LABS",
                            },
                          },
                        ],
                      },
                    },
                    {
                      type: "div" as const,
                      props: {
                        style: {
                          fontSize: "18px",
                          fontFamily: "Geist",
                          fontWeight: 400,
                          color: "rgba(255,255,255,0.35)",
                        },
                        children: "arcatelabs.com",
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };

  const svg = await satori(markup, {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Eurostile", data: eurostile, weight: 400, style: "normal" as const },
      { name: "Geist", data: geistRegular, weight: 400, style: "normal" as const },
      { name: "Geist", data: geistBold, weight: 700, style: "normal" as const },
    ],
  });

  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return png;
}
