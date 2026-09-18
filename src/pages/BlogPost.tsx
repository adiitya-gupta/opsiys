import React, { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { SEO } from "../components/SEO";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { BLOG_POSTS } from "./Blog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import { Calendar, User, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { subscribeToBlogPosts, BlogPostItem } from "../lib/firebase";

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unSub = subscribeToBlogPosts((customBlogs) => {
      // Find in custom blogs first, then in static blogs
      const matchedCustom = customBlogs.find(b => b.slug === slug);
      if (matchedCustom) {
        setPost(matchedCustom);
      } else {
        const matchedStatic = BLOG_POSTS.find(p => p.slug === slug);
        setPost(matchedStatic || null);
      }
      setLoading(false);
    });
    return () => unSub();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center pt-28">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.seoDesc || post.excerpt,
    "datePublished": post.publishDate,
    "dateModified": post.publishDate,
    "author": {
      "@type": "Person",
      "name": post.author || "Aditya Gupta",
      "jobTitle": post.authorRole || "Founder & CEO, Opsiys"
    },
    "publisher": {
      "@type": "Organization",
      "name": "OPSIYS Systems Inc.",
      "url": "https://www.opsiys.in/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.opsiys.in/logos/opsiyslogo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.opsiys.in/blog/${post.slug}`
    }
  };

  // Helper to render rich structured blog text (Markdown / Plain Text paragraphs)
  const renderFormattedContent = (contentString: string) => {
    if (!contentString) return null;

    const blocks = contentString.split(/\n\s*\n/);
    return blocks.map((block, idx) => {
      const trimmed = block.trim();

      if (trimmed.startsWith("## ")) {
        return (
          <h2 key={idx} className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-black pt-6">
            {trimmed.replace(/^##\s+/, "")}
          </h2>
        );
      }

      if (trimmed.startsWith("### ")) {
        return (
          <h3 key={idx} className="text-xl font-bold uppercase tracking-tight text-black pt-4">
            {trimmed.replace(/^###\s+/, "")}
          </h3>
        );
      }

      if (trimmed.startsWith("> ")) {
        return (
          <div key={idx} className="bg-zinc-100 p-6 rounded-xl border border-zinc-200 text-zinc-700 font-medium leading-relaxed my-4">
            {trimmed.replace(/^>\s+/, "")}
          </div>
        );
      }

      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const items = trimmed.split("\n").map(line => line.replace(/^[-*]\s+/, ""));
        return (
          <ul key={idx} className="space-y-2 my-4">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-zinc-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        );
      }

      return (
        <p key={idx} className="text-zinc-800 text-sm sm:text-base leading-relaxed font-sans">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <>
      <SEO
        title={post.seoTitle || post.title}
        description={post.seoDesc || post.excerpt}
        canonical={`https://www.opsiys.in/blog/${post.slug}`}
        schema={blogSchema}
      />

      <div className="bg-[#FAFAFA] min-h-screen pt-28 pb-20">
        <Breadcrumbs
          items={[
            { label: "Blog", href: "/blog" },
            { label: post.title }
          ]}
        />

        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 md:px-10 space-y-10"
        >
          {/* Header */}
          <div className="space-y-4 text-left border-b border-zinc-200 pb-8">
            <Badge variant="outline" className="rounded-full px-3 py-1 text-xs border-accent/20 text-accent bg-accent/5 font-mono uppercase tracking-widest">
              {post.category || "Business Growth"}
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-black leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-500 pt-2">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-black" />
                <span className="font-bold text-black">{post.author || "Aditya Gupta"}</span> ({post.authorRole || "Founder & CEO, Opsiys"})
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Published {post.publishDate || "Recently"}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{post.readTime || "5 min read"}</span>
              </span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="rounded-2xl overflow-hidden shadow-xl border border-zinc-200 bg-zinc-900 max-h-[420px]">
            <img 
              src={post.image || "/images/blog_online_presence.png"} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Body Content */}
          <div className="prose prose-zinc max-w-none space-y-8 text-zinc-800 text-sm sm:text-base leading-relaxed font-sans">
            {post.content ? (
              renderFormattedContent(post.content)
            ) : (
              <>
                <p className="text-base sm:text-lg font-medium text-zinc-700 leading-relaxed bg-zinc-100 p-6 rounded-xl border border-zinc-200">
                  {post.excerpt}
                </p>

                <h2 className="text-2xl font-bold uppercase tracking-tight text-black pt-4">
                  1. Dominate Local Search & Google Maps
                </h2>
                <p>
                  Most local clients search Google before contacting a clinic, real estate broker, or local service provider. Claiming and optimizing your Google Business Profile with verified details, local keywords, and customer reviews builds instant local search visibility.
                </p>
                <div className="bg-white p-5 rounded-xl border border-zinc-200 space-y-2">
                  <span className="font-bold text-xs font-mono text-accent uppercase tracking-wider block">Recommended Solution:</span>
                  <p className="text-xs text-zinc-600">
                    Explore our <Link to="/services/seo" className="text-black font-bold underline">Local SEO Services</Link> engineered to put your business in top Google Map Pack results.
                  </p>
                </div>

                <h2 className="text-2xl font-bold uppercase tracking-tight text-black pt-4">
                  2. Build a Fast, Mobile-First Website
                </h2>
                <p>
                  Over 70% of local search traffic originates from smartphones. If your site is slow or difficult to navigate on mobile, potential clients immediately hit the back button. Ensure your pages load in under 2 seconds with clear call-to-action buttons.
                </p>
                <div className="bg-white p-5 rounded-xl border border-zinc-200 space-y-2">
                  <span className="font-bold text-xs font-mono text-accent uppercase tracking-wider block">Web Platform:</span>
                  <p className="text-xs text-zinc-600">
                    Discover our <Link to="/services/website-development" className="text-black font-bold underline">Modern Website Development</Link> built for speed and lead conversion.
                  </p>
                </div>

                <h2 className="text-2xl font-bold uppercase tracking-tight text-black pt-4">
                  3. Implement Instant WhatsApp Follow-Ups
                </h2>
                <p>
                  When a prospect submits an inquiry form on your site, response time determines whether they convert or contact a competitor. Automated WhatsApp messaging ensures every lead receives an instant automated response and brochure within seconds.
                </p>
              </>
            )}
          </div>

          {/* Related Links */}
          <div className="pt-8 border-t border-zinc-200 space-y-4">
            <h3 className="text-base font-bold uppercase tracking-wider text-black">
              Explore Related Growth Solutions
            </h3>
            <div className="flex flex-wrap gap-2">
              <Link to="/services/seo">
                <Badge variant="outline" className="px-3 py-1.5 text-xs font-bold border-zinc-300 hover:border-black">SEO Services</Badge>
              </Link>
              <Link to="/services/whatsapp-automation">
                <Badge variant="outline" className="px-3 py-1.5 text-xs font-bold border-zinc-300 hover:border-black">WhatsApp Automation</Badge>
              </Link>
              <Link to="/locations/noida">
                <Badge variant="outline" className="px-3 py-1.5 text-xs font-bold border-zinc-300 hover:border-black">Noida Market</Badge>
              </Link>
              <Link to="/locations/delhi-ncr">
                <Badge variant="outline" className="px-3 py-1.5 text-xs font-bold border-zinc-300 hover:border-black">Delhi NCR Market</Badge>
              </Link>
            </div>
          </div>

          {/* CTA Box */}
          <div className="bg-black text-white rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight">
              Ready to Scale Your Online Presence?
            </h2>
            <p className="text-zinc-400 text-sm max-w-lg mx-auto leading-relaxed">
              Build Your Online Presence. Increase Your Visibility. Generate Opportunities. Automate Growth.
            </p>
            <a href="/#contact">
              <Button size="lg" className="bg-white text-black hover:bg-zinc-200 font-bold uppercase tracking-widest text-xs px-8 py-6 rounded-none">
                Request a Growth Consultation
              </Button>
            </a>
          </div>
        </motion.article>
      </div>
    </>
  );
};
export default BlogPostPage;
