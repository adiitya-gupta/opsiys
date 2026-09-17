import React from "react";
import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, User, Clock } from "lucide-react";

export const BLOG_POSTS = [
  {
    slug: "how-to-improve-online-presence",
    title: "How to Build & Scale Your Business Online Presence in 2026",
    seoTitle: "How to Improve Business Online Presence & Visibility | Opsiys Guide",
    seoDesc: "Learn proven strategies to increase online visibility, improve local search rankings, generate qualified leads, and automate business growth.",
    category: "Business Growth & SEO",
    publishDate: "2026-09-15",
    readTime: "7 min read",
    author: "Aditya Gupta",
    authorRole: "Founder & CEO, Opsiys",
    excerpt: "A strong online presence is no longer optional. Discover how to combine SEO, website performance, targeted ads, and messaging automations into a connected growth engine."
  }
];

export const BlogPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Blog & Business Growth Insights | Opsiys"
        description="Actionable guides on business growth, SEO strategies, Meta advertising, website performance, and business automation from Opsiys."
        canonical="https://www.opsiys.in/blog"
      />

      <div className="bg-[#FAFAFA] min-h-screen pt-28 pb-20">
        <Breadcrumbs items={[{ label: "Blog" }]} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 space-y-12">
          <div className="text-left space-y-4 max-w-3xl">
            <Badge variant="outline" className="rounded-full px-3 py-1 text-xs border-accent/20 text-accent bg-accent/5 font-mono uppercase tracking-widest">
              Growth Knowledge Hub
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-black leading-tight">
              Business Growth Insights
            </h1>
            <p className="text-zinc-600 text-base sm:text-lg leading-relaxed font-medium">
              Practical guides and frameworks on search visibility, lead acquisition, marketing campaigns, and workflow automation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {BLOG_POSTS.map((post) => (
              <article key={post.slug} className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-8 flex flex-col justify-between hover:border-black transition-all hover:shadow-xl group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
                    <Badge variant="outline" className="border-accent/30 text-accent uppercase tracking-wider text-[10px]">
                      {post.category}
                    </Badge>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime}</span>
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold uppercase tracking-tight text-black group-hover:text-accent transition-colors">
                    <Link to={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>

                  <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-6 border-t border-zinc-100 flex items-center justify-between mt-6">
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                    <User className="w-3.5 h-3.5" />
                    <span>{post.author}</span>
                  </div>

                  <Link to={`/blog/${post.slug}`}>
                    <Button variant="ghost" className="font-bold text-xs uppercase tracking-widest p-0 hover:bg-transparent flex items-center gap-1 text-black">
                      <span>Read Guide</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
export default BlogPage;
