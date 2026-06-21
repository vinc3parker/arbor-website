# Arbor SEO Audit & Improvement Plan

## Executive Summary

Your site has **critical SEO issues** preventing it from ranking for "arbor apps" and related terms. The primary problems are duplicate metadata across all pages, missing page-specific optimization, lack of keyword targeting, and minimal indexable content. These changes can significantly improve your search visibility.

---

## 🔴 Critical Issues (Fix First)

### 1. **Identical Metadata on All Pages**
**Problem:** Every page (homepage, /aegle, /salus, etc.) uses the same title and meta description from `layout.tsx`:
- Title: "Arbor — Technology for intentional living"
- Description: "Arbor is building an ecosystem of apps..."

This tells Google all your pages are identical, so it only indexes one, and you rank for none of your specific app keywords.

**Solution:** Add unique metadata to each page:

```typescript
// src/app/aegle/page.tsx - Example
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aegle — Training Software for Hybrid Athletes | Arbor",
  description: "Plan and track gym, running, conditioning, and sport in one connected system. Training software designed for athletes balancing multiple disciplines.",
  openGraph: {
    title: "Aegle — Training Software for Hybrid Athletes | Arbor",
    description: "Unified training platform for hybrid athletes. Plan, track, and optimize gym, running, conditioning, and sport.",
    url: "https://arborapps.co/aegle",
    type: "website",
  },
};
```

**Apply to all 8 app pages** (aegle, salus, thrive, nura, wend, kith, telos, sage) with unique, keyword-focused copy.

---

### 2. **Missing "Arbor Apps" in Your Titles**
**Problem:** You're fighting for search visibility but your title doesn't include the exact phrase users search for. "Arbor — Technology for intentional living" doesn't match search intent.

**Solution - Homepage metadata update:**

```typescript
// src/app/layout.tsx
export const metadata = {
  title: "Arbor Apps — Build Apps for Intentional Living",
  description: "Discover Arbor apps for performance training, mental wellbeing, organization, finance, travel, social connection, careers, and learning. Join the ecosystem for intentional living.",
  openGraph: {
    title: "Arbor Apps — Ecosystem for Intentional Living",
    description: "Performance, wellbeing, organization, finance, travel, social connection, careers, and learning apps designed for people who want more from life.",
    url: "https://arborapps.co",
    type: "website",
  },
};
```

---

### 3. **No Structured Data (Schema Markup)**
**Problem:** Google doesn't understand your site structure, apps, or organization. You have no JSON-LD schema.

**Solution:** Create `src/lib/schema.ts`:

```typescript
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Arbor",
    "url": "https://arborapps.co",
    "logo": "https://arborapps.co/logo.png",
    "description": "An ecosystem of apps for training, reflection, organization, exploration, and intentional living.",
    "sameAs": [
      "https://twitter.com/yourhandle", // Add your socials
    ]
  };
}

export function getProductSchema(appName: string, description: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": appName,
    "description": description,
    "url": url,
    "applicationCategory": "ProductivityApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };
}
```

Then add to your layout/pages:

```typescript
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(getOrganizationSchema()),
  }}
/>
```

---

### 4. **Missing robots.txt and sitemap.xml**
**Problem:** Search engines don't have guidance on how to crawl your site.

**Solution:** Create these files:

**`public/robots.txt`:**
```
User-agent: *
Allow: /
Disallow: /admin

Sitemap: https://arborapps.co/sitemap.xml
```

**`public/sitemap.xml`:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://arborapps.co</loc>
    <priority>1.0</priority>
    <changefreq>weekly</changefreq>
  </url>
  <url>
    <loc>https://arborapps.co/aegle</loc>
    <priority>0.8</priority>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>https://arborapps.co/salus</loc>
    <priority>0.8</priority>
    <changefreq>monthly</changefreq>
  </url>
  <!-- Repeat for all 8 apps -->
</urlset>
```

---

## 🟠 High Priority Issues (Do Next)

### 5. **No H1 Tag on Pages**
**Problem:** Your pages have multiple styling headers but no semantic `<h1>` tag. Google uses H1 to understand page topic.

**Solution:** Update your components to use proper H1 tags:

```typescript
// In your Hero component
export function Hero({ title, subtitle }) {
  return (
    <section>
      <h1>{title}</h1> {/* Add this */}
      <p>{subtitle}</p>
    </section>
  );
}
```

---

### 6. **Thin Content - Not Enough Text for Google to Index**
**Problem:** Most pages are 80% images, 20% text. Google needs substantial text content to understand and rank your pages.

**Solution:** Add content sections to each app page:

```typescript
// Add to each app page
<section className="py-12 max-w-3xl mx-auto px-4">
  <h2>What is {appName}?</h2>
  <p>{detailed description - 150-200 words}</p>
  
  <h2>Who is {appName} for?</h2>
  <p>{target audience - 100-150 words}</p>
  
  <h2>Key Features</h2>
  <ul>
    {/* Feature list with descriptions */}
  </ul>
</section>
```

For example, Aegle could include:
- "Aegle is a training software designed specifically for athletes who train across multiple disciplines..." (detailed paragraph)
- Information about the target user (runners who lift, triathletes, etc.)
- Expanded feature descriptions

---

### 7. **No Image Alt Text**
**Problem:** All images lack alt text. This hurts accessibility AND image search SEO.

**Solution:** Update image components:

```typescript
<Image
  src={screenshot}
  alt="Aegle training calendar showing gym, running, and conditioning sessions planned for the week"
  width={1200}
  height={800}
/>
```

---

### 8. **Missing Canonical Tags**
**Problem:** No canonical tags to prevent duplicate content issues.

**Solution:** Add to each page's metadata:

```typescript
export const metadata: Metadata = {
  title: "...",
  description: "...",
  canonical: "https://arborapps.co/aegle", // Add for each page
};
```

---

## 🟡 Medium Priority Issues

### 9. **No Blog or Resource Content**
**Problem:** Your site is purely product-focused with no content marketing. No blog posts = missed keyword opportunities and no reason for external sites to link to you.

**Solution:** Create a blog section (`/blog`) with content like:
- "Best Training Apps for Hybrid Athletes" (links to Aegle)
- "How to Build Better Routines" (links to Thrive)
- "Intentional Living: A Guide to Digital Wellness" (links to all apps)
- "Why Athletes Need Unified Training Software"

This drives organic traffic and earns backlinks.

---

### 10. **No Meta Optimization Beyond Title/Description**
**Problem:** You're not targeting long-tail keywords or related searches.

**Solution:** Consider adding these targeted pages/sections:

```
/training-app-for-athletes
/mental-wellness-journaling
/productivity-organization-app
/personal-finance-app
/travel-planning-app
```

These could be thin content pages or blog posts targeting specific keywords.

---

### 11. **Open Graph Tags Incomplete**
**Problem:** When your site is shared on social media, it looks generic.

**Solution:** Add complete OG tags to all pages:

```typescript
export const metadata: Metadata = {
  openGraph: {
    title: "Aegle — Training Software for Hybrid Athletes | Arbor",
    description: "...",
    url: "https://arborapps.co/aegle",
    type: "website",
    images: [
      {
        url: "https://arborapps.co/og-aegle.png", // Create 1200x630 images
        width: 1200,
        height: 630,
        alt: "Aegle training software dashboard",
      }
    ],
  },
};
```

---

## 📋 Implementation Roadmap

### Week 1 - Critical Fixes
- [ ] Update all page metadata (titles/descriptions for each app)
- [ ] Add structured data schema
- [ ] Create robots.txt and sitemap.xml
- [ ] Add H1 tags to components

### Week 2 - Content & Technical
- [ ] Add expanded text content to each app page
- [ ] Add alt text to all images
- [ ] Add canonical tags
- [ ] Complete Open Graph tags

### Week 3 - Growth Content
- [ ] Create /blog section
- [ ] Write 3-5 initial blog posts
- [ ] Create target landing pages for high-value keywords
- [ ] Set up Google Search Console

### Ongoing
- [ ] Monitor Google Search Console
- [ ] Build backlinks (PR mentions, reviews, partnerships)
- [ ] Add FAQ sections to app pages
- [ ] Update content quarterly

---

## 🔍 SEO Keywords to Target

**Primary:** "Arbor apps", "Arbor app"

**App-specific:**
- Aegle: "training software for hybrid athletes", "cross-sport training app", "multisport workout planner"
- Salus: "journaling app", "mental wellbeing app", "reflection app"
- Thrive: "organization app", "productivity app", "routine planner"
- Nura: "personal finance app", "budgeting app"
- Wend: "travel planning app", "travel app"
- Kith: "social app", "connection app"
- Telos: "career planning app", "job search app"
- Sage: "learning app", "knowledge management app"

---

## 📊 Expected Results

After implementing these changes:
- **Month 1-2:** Appear in search results for exact-match keywords ("Arbor apps")
- **Month 2-3:** Start ranking for 20-30 medium-volume keywords
- **Month 4+:** Establish authority, earn backlinks, rank for competitive terms

Without these changes, your domain will continue to rank poorly regardless of quality.

---

## 🛠️ Technical Notes

Your site uses **Next.js 13+ App Router**, which is ideal for SEO because:
- Static generation (SSG) is possible
- Server components can fetch metadata dynamically
- Built-in Image optimization
- Vercel hosting is fast

Just need to utilize these capabilities properly with metadata exports and structured data.

