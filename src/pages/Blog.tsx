import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import { ArrowRight, Clock, User, Sparkles } from "lucide-react";
import { subscribeToBlogPosts, BlogPostItem } from "../lib/firebase";

export const BLOG_POSTS = [
  {
    slug: "ai-and-automation-for-business",
    title: "AI & Automation for Business: Smarter Workflows for Modern Growth",
    seoTitle: "AI and Automation for Businesses: Smarter Workflows | Opsiys",
    seoDesc: "Discover how AI and automation can help businesses streamline workflows, automate communication, manage leads, and scale smarter with Opsiys.",
    category: "AI Business Automation",
    publishDate: "2026-09-18",
    readTime: "5 min read",
    author: "Aditya Gupta",
    authorRole: "Founder & CEO, Opsiys",
    image: "/images/blog_online_presence.png",
    excerpt: "Discover how AI and automation help businesses streamline workflows, automate client communication, manage leads in real-time, and scale operations effortlessly.",
    content: `# AI and Automation for Growing Businesses

> A comprehensive strategy guide by Opsiys on modernizing operations and capturing digital leads.

## Introduction

Artificial intelligence and automated workflows are **changing what businesses can do**. By combining \`inline code\` triggers with automated lead capture, growing companies can scale faster without adding headcount.

### Key Focus Areas

- Lead capture & CRM synchronization
- Instant WhatsApp response systems
- Automated email follow-up sequences
- Meta & Google Ads conversion tracking

1. Capture prospect details via website form.
2. Analyze lead intent with AI models.
3. Dispatch instant brochure & consultation link via WhatsApp.

---

## Architecture & Workflow

\`\`\`text
New Website Lead
       ↓
CRM Entry
       ↓
AI Analysis
       ↓
WhatsApp & Sales Alert
\`\`\`

## Integration Code Example

\`\`\`javascript
// Opsiys Automated Lead Processing Pipeline
const processLead = async (prospectData) => {
  const verifiedLead = await crm.createLead(prospectData);
  await whatsapp.sendBrochure(verifiedLead.phone);
  return { status: "success", leadId: verifiedLead.id };
};
\`\`\`

## Impact & Performance Benchmarks

| Metric | Traditional Manual | Opsiys AI Automation | Improvement |
| :--- | :--- | :--- | :--- |
| **Response Time** | 45 minutes | Under 10 seconds | **99% Faster** |
| **Lead Qualification** | Manual phone call | Instant AI scoring | **80% Time Saved** |
| **Follow-up Rate** | 35% | 100% Guaranteed | **+185% Increase** |

> **Pro Tip:** Automation must solve a real business friction point rather than adding unnecessary software complexity.

Learn more about our [Business Growth Solutions](https://www.opsiys.in/).`,
    published: true
  },
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
    excerpt: "Building an effective online presence doesn't require a million-dollar budget. Discover practical steps to combine local search, clean website UX, and WhatsApp automations.",
    published: true
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
    transition: { duration: 0.5, ease: "easeOut" as const } 
  }
};

export const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<any[]>(BLOG_POSTS);

  useEffect(() => {
    const unSub = subscribeToBlogPosts((customBlogs) => {
      const activeCustom = customBlogs.filter(b => b.published !== false);
      // Merge custom blogs with static BLOG_POSTS (preventing duplicate slugs)
      const customSlugs = new Set(activeCustom.map(b => b.slug));
      const filteredStatic = BLOG_POSTS.filter(s => !customSlugs.has(s.slug));
      setPosts([...activeCustom, ...filteredStatic]);
    });
    return () => unSub();
  }, []);

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
              Actionable frameworks written by our team to help small and growing businesses build search authority, capture leads, and automate client follow-ups.
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {posts.map((post) => (
              <motion.article 
                key={post.slug || post.id}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm hover:border-black transition-all hover:shadow-xl group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Article Banner Image */}
                  <div className="h-48 sm:h-56 bg-zinc-900 overflow-hidden relative">
                    <img 
                      src={post.image || "/images/blog_online_presence.png"} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                    />
                    <Badge variant="outline" className="absolute top-4 left-4 bg-black/80 text-white border-white/20 uppercase tracking-wider text-[10px] backdrop-blur-sm">
                      {post.category || "Business Growth"}
                    </Badge>
                  </div>

                  <div className="p-6 sm:p-8 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{post.readTime || "5 min read"}</span>
                      <span>•</span>
                      <span>Published {post.publishDate || "Recently"}</span>
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
                    <span>{post.author || "Aditya Gupta"}</span>
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
