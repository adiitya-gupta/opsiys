import React from "react";

interface SchemaData {
  [key: string]: any;
}

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  robots?: string;
  ogType?: string;
  ogImage?: string;
  schema?: SchemaData | SchemaData[];
}

const DEFAULT_TITLE = "Opsiys | Business Growth Partner for Online Presence & Growth";
const DEFAULT_DESCRIPTION = "Opsiys is a business growth partner helping businesses build their online presence, increase visibility, generate leads and automate growth through marketing, SEO, Meta Ads, websites and automation.";
const DEFAULT_IMAGE = "https://opsiys.in/logos/opsiyslogo.png";
const SITE_URL = "https://opsiys.in";

export const SEO: React.FC<SEOProps> = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  canonical,
  robots = "index, follow",
  ogType = "website",
  ogImage = DEFAULT_IMAGE,
  schema
}) => {
  const currentUrl = canonical || (typeof window !== "undefined" ? `${SITE_URL}${window.location.pathname}` : SITE_URL);

  React.useEffect(() => {
    // Document Title
    document.title = title;

    // Helper to update meta tag
    const updateMeta = (name: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let element = document.head.querySelector(selector) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement("meta");
        if (isProperty) {
          element.setAttribute("property", name);
        } else {
          element.setAttribute("name", name);
        }
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Standard Meta
    updateMeta("description", description);
    updateMeta("robots", robots);

    // OpenGraph Meta
    updateMeta("og:title", title, true);
    updateMeta("og:description", description, true);
    updateMeta("og:url", currentUrl, true);
    updateMeta("og:type", ogType, true);
    updateMeta("og:image", ogImage, true);
    updateMeta("og:site_name", "OPSIYS", true);

    // Twitter Meta
    updateMeta("twitter:card", "summary_large_image");
    updateMeta("twitter:title", title);
    updateMeta("twitter:description", description);
    updateMeta("twitter:image", ogImage);
    updateMeta("twitter:site", "@Opsiys");

    // Canonical Tag
    let canonicalLink = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", currentUrl);

    // Dynamic Schema injection
    const existingDynamicSchemas = document.head.querySelectorAll("script[data-dynamic-seo]");
    existingDynamicSchemas.forEach(el => el.remove());

    if (schema) {
      const schemaArray = Array.isArray(schema) ? schema : [schema];
      schemaArray.forEach(schemaObj => {
        const script = document.createElement("script");
        script.setAttribute("type", "application/ld+json");
        script.setAttribute("data-dynamic-seo", "true");
        script.textContent = JSON.stringify(schemaObj);
        document.head.appendChild(script);
      });
    }

  }, [title, description, currentUrl, robots, ogType, ogImage, schema]);

  return null;
};
