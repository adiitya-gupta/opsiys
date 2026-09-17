import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { SEO } from "../components/SEO";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { BLOG_POSTS } from "./Blog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

        <article className="max-w-4xl mx-auto px-4 sm:px-6 md:px-10 space-y-12">
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
                <span>Published September 15, 2026</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{post.readTime}</span>
              </span>
            </div>
          </div>

          {/* Body Content */}
          <div className="prose prose-zinc max-w-none space-y-8 text-zinc-800 text-sm sm:text-base leading-relaxed font-sans">
            <p className="text-base sm:text-lg font-medium text-zinc-700 leading-relaxed bg-zinc-100 p-6 rounded-xl border border-zinc-200">
              In today's digital landscape, building a strong online presence is far more than having a static website. It requires a connected strategy combining search engine optimization (SEO), performance marketing, high-converting digital platforms, and automated lead management.
            </p>

            <h2 className="text-2xl font-bold uppercase tracking-tight text-black pt-4">
              1. Optimize Your Website for Speed & Search Intent
            </h2>
            <p>
              Your website is the foundation of your digital presence. Search engines like Google prioritize fast-loading, mobile-optimized sites that deliver immediate value to visitors. Ensure your site uses modern semantic HTML tags, responsive layouts, and clean structured schema data.
            </p>
            <div className="bg-white p-4 rounded-lg border border-zinc-200 space-y-2">
              <span className="font-bold text-xs font-mono text-accent uppercase tracking-wider block">Recommended Solution:</span>
              <p className="text-xs text-zinc-600">
                Explore our <Link to="/services/website-development" className="text-black font-bold underline">Modern Website Development</Link> and <Link to="/services/seo" className="text-black font-bold underline">SEO Services</Link> engineered to maximize crawlability and visitor conversion.
              </p>
            </div>

            <h2 className="text-2xl font-bold uppercase tracking-tight text-black pt-4">
              2. Build Local Search Authority & Google Maps Placement
            </h2>
            <p>
              For local service providers, clinics, real estate brokers, and restaurants, capturing top positions in the Google Map Pack is critical. Claiming and optimizing your Google Business Profile, accumulating verified reviews, and maintaining consistent regional contact information allows nearby customers to find you instantly.
            </p>
            <div className="bg-white p-4 rounded-lg border border-zinc-200 space-y-2">
              <span className="font-bold text-xs font-mono text-accent uppercase tracking-wider block">Industry Application:</span>
              <p className="text-xs text-zinc-600">
                See how we help <Link to="/industries/clinics" className="text-black font-bold underline">Clinics</Link> and <Link to="/industries/real-estate" className="text-black font-bold underline">Real Estate Firms</Link> dominate local search catchments.
              </p>
            </div>

            <h2 className="text-2xl font-bold uppercase tracking-tight text-black pt-4">
              3. Deploy Targeted Paid Acquisition (Meta & Search Ads)
            </h2>
            <p>
              While organic search builds exponential long-term authority, paid social advertising on Facebook and Instagram provides immediate customer acquisition. Focus on high-impact visual creative, compelling ad hooks, and direct lead capture forms that sync straight into your CRM.
            </p>

            <h2 className="text-2xl font-bold uppercase tracking-tight text-black pt-4">
              4. Automate Follow-Ups via WhatsApp & Email
            </h2>
            <p>
              Lead speed is the single biggest factor in closing online inquiries. Implementing automated WhatsApp Business messaging and instant email sequences guarantees that every prospect receives immediate personal engagement, drastically reducing drop-offs.
            </p>
            <div className="bg-white p-4 rounded-lg border border-zinc-200 space-y-2">
              <span className="font-bold text-xs font-mono text-accent uppercase tracking-wider block">Messaging Automation:</span>
              <p className="text-xs text-zinc-600">
                Learn how our <Link to="/services/whatsapp-automation" className="text-black font-bold underline">WhatsApp Business Automation</Link> setup delivers 24/7 instant client responses.
              </p>
            </div>
          </div>

          {/* Related Links */}
          <div className="pt-8 border-t border-zinc-200 space-y-4">
            <h3 className="text-base font-bold uppercase tracking-wider text-black">
              Explore Related Solutions & Markets
            </h3>
            <div className="flex flex-wrap gap-2">
              <Link to="/services/business-growth">
                <Badge variant="outline" className="px-3 py-1.5 text-xs font-bold border-zinc-300 hover:border-black">Business Growth Solutions</Badge>
              </Link>
              <Link to="/services/meta-ads">
                <Badge variant="outline" className="px-3 py-1.5 text-xs font-bold border-zinc-300 hover:border-black">Meta Ads Management</Badge>
              </Link>
              <Link to="/locations/noida">
                <Badge variant="outline" className="px-3 py-1.5 text-xs font-bold border-zinc-300 hover:border-black">Noida Market Growth</Badge>
              </Link>
              <Link to="/locations/delhi-ncr">
                <Badge variant="outline" className="px-3 py-1.5 text-xs font-bold border-zinc-300 hover:border-black">Delhi NCR Growth</Badge>
              </Link>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-black text-white rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight">
              Ready to Build Your Online Presence?
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
        </article>
      </div>
    </>
  );
};
export default BlogPostPage;
