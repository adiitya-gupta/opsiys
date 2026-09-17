import React from "react";
import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import { ArrowRight, Clock, User, Sparkles } from "lucide-react";

export const BLOG_POSTS = [
  {
    slug: "how-to-improve-online-presence",
    title: "How Small & Growing Businesses Can Build Strong Online Presence in 2026",
    seoTitle: "How to Improve Business Online Presence & Visibility | Opsiys Guide",
    seoDesc: "A practical, step-by-step guide for small businesses to build online presence, improve local search visibility, and capture leads without complex budgets.",
    category: "Business Growth & SEO",
    publishDate: "2026-09-15",
    readTime: "6 min read",
    author: "Aditya Gupta",
    authorRole: "Founder & CEO, Opsiys",
    image: "/images/blog_online_presence.png",
    excerpt: "Building an effective online presence doesn't require a million-dollar budget. Discover practical steps to combine local search, clean website UX, and WhatsApp automations."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeOut" } 
  }
};

export const BlogPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Blog & Business Growth Insights | Opsiys"
        description="Practical, actionable guides on business growth, local SEO, website performance, and messaging automations from Opsiys."
        canonical="https://www.opsiys.in/blog"
      />

      <div className="bg-[#FAFAFA] min-h-screen pt-28 pb-20">
        <Breadcrumbs items={[{ label: "Blog" }]} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 space-y-12">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left space-y-4 max-w-3xl"
          >
            <Badge variant="outline" className="rounded-full px-3 py-1 text-xs border-accent/20 text-accent bg-accent/5 font-mono uppercase tracking-widest flex items-center gap-1.5 w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Practical Insights</span>
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-black leading-tight">
              Business Growth Guides
            </h1>
            <p className="text-zinc-600 text-base sm:text-lg leading-relaxed font-medium">
              Actionable frameworks written by our founders to help small and growing businesses build search authority, capture leads, and automate client follow-ups.
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {BLOG_POSTS.map((post) => (
              <motion.article 
                key={post.slug}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm hover:border-black transition-all hover:shadow-xl group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Article Banner Image */}
                  <div className="h-48 sm:h-56 bg-zinc-900 overflow-hidden relative">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                    />
                    <Badge variant="outline" className="absolute top-4 left-4 bg-black/80 text-white border-white/20 uppercase tracking-wider text-[10px] backdrop-blur-sm">
                      {post.category}
                    </Badge>
                  </div>

                  <div className="p-6 sm:p-8 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{post.readTime}</span>
                      <span>•</span>
                      <span>Published Sept 15, 2026</span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-black group-hover:text-accent transition-colors leading-snug">
                      <Link to={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>

                    <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-0 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                    <User className="w-3.5 h-3.5 text-black" />
                    <span>{post.author}</span>
                  </div>

                  <Link to={`/blog/${post.slug}`}>
                    <Button variant="ghost" className="font-bold text-xs uppercase tracking-widest p-0 hover:bg-transparent flex items-center gap-1.5 text-black">
                      <span>Read Full Guide</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
};
export default BlogPage;
