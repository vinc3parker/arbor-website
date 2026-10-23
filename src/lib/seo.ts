import type { Metadata } from "next";

const SITE_URL = "https://arborapps.co";
const SHARE_IMAGE = `${SITE_URL}/og-image.png`;

/** Page-specific social previews. Search snippets still come from page content. */
export function getPageSocialMetadata(
  title: string,
  description: string,
  path: string,
): Pick<Metadata, "openGraph" | "twitter"> {
  const url = `${SITE_URL}${path}`;

  return {
    openGraph: {
      title,
      description,
      url,
      siteName: "Arbor",
      type: "website",
      images: [{ url: SHARE_IMAGE, width: 1200, height: 630, alt: "Arbor — personal guide apps for one connected life" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SHARE_IMAGE],
    },
  };
}
