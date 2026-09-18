import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const allItems = [{ label: "Home", href: "/" }, ...items];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": allItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": item.href ? `https://www.opsiys.in${item.href}` : "https://www.opsiys.in"
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <nav aria-label="Breadcrumb" className="py-4 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto">
        <ol className="flex items-center flex-wrap gap-2 text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1;
            return (
              <li key={index} className="flex items-center gap-2">
                {index === 0 ? (
                  <Link to="/" className="flex items-center gap-1 hover:text-black transition-colors">
                    <Home className="w-3.5 h-3.5" />
                    <span>Home</span>
                  </Link>
                ) : isLast || !item.href ? (
                  <span className="text-black font-extrabold truncate max-w-[200px] sm:max-w-none">
                    {item.label}
                  </span>
                ) : (
                  <Link to={item.href} className="hover:text-black transition-colors">
                    {item.label}
                  </Link>
                )}

                {!isLast && <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};
