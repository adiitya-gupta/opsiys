import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { SEO } from "../components/SEO";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { BLOG_POSTS } from "./Blog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import { Calendar, User, Clock, CheckCircle2, ArrowRight } from "lucide-react";

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOG_POSTS.find(p => p.slug === slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.seoDesc,
    "datePublished": post.publishDate,
    "dateModified": post.publishDate,
    "author": {
      "@type": "Person",
      "name": post.author,
      "jobTitle": post.authorRole
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

  return (
    <>
      <SEO
        title={post.seoTitle}
        description={post.seoDesc}
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
              {post.category}
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-black leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-500 pt-2">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-black" />
                <span className="font-bold text-black">{post.author}</span> ({post.authorRole})
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Published Sept 15, 2026</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{post.readTime}</span>
              </span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="rounded-2xl overflow-hidden shadow-xl border border-zinc-200 bg-zinc-900 max-h-[420px]">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Body Content */}
          <div className="prose prose-zinc max-w-none space-y-8 text-zinc-800 text-sm sm:text-base leading-relaxed font-sans">
            <p className="text-base sm:text-lg font-medium text-zinc-700 leading-relaxed bg-zinc-100 p-6 rounded-xl border border-zinc-200">
              For small and growing businesses, establishing a strong online presence doesn't require complex corporate budgets. It requires connecting three core elements: local Google search authority, a clean mobile website, and instant automated lead follow-ups.
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
