export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Arbor",
    url: "https://arborapps.co",
    logo: "https://arborapps.co/icon.png",
    description: "An ecosystem of apps for training, reflection, organization, exploration, and intentional living.",
    sameAs: [
      "https://twitter.com/arbor", // Update with actual social links
    ],
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
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.5",
      ratingCount: "100",
    },
  };
}

export function getWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Arbor Apps",
    url: "https://arborapps.co",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://arborapps.co/search?q={search_term_string}",
      },
      query_input: "required name=search_term_string",
    },
  };
}
