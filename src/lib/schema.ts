export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Arbor",
    url: "https://arborapps.co",
    logo: "https://arborapps.co/icon.png",
    description: "An ecosystem of apps for training, reflection, organization, exploration, and intentional living.",
  };
}

export function getProductSchema(appName: string, description: string, url: string, category: string) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: appName,
    description: description,
    url: url,
    applicationCategory: category,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

export function getWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Arbor Apps",
    url: "https://arborapps.co",
  };
}

export function getBlogPostingSchema(post: {
  title: string;
  summary: string;
  date: string;
  author: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: post.author,
      url: "https://arborapps.co",
    },
    publisher: {
      "@type": "Organization",
      name: "Arbor",
      logo: {
        "@type": "ImageObject",
        url: "https://arborapps.co/icon.png",
      },
    },
    url: `https://arborapps.co/blog/${post.slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://arborapps.co/blog/${post.slug}`,
    },
  };
}
