import { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  BookOpen,
  TrendingUp,
  Users,
} from 'lucide-react';

import { LogoSection } from '@/components/landing-components/logo-section';
import Footer from '@/components/footer';
import { FeaturedHeroImage } from '@/components/blogs/featured-hero-image';

export const metadata: Metadata = {
  title: 'V3 Studio Blog – AI Video Creation, Faceless Content & Growth',
  description:
    'Learn how to grow with AI-powered video creation. Guides, tutorials, and insights on faceless videos, Shorts, monetization, and content strategy.',
  openGraph: {
    title: 'V3 Studio Blog',
    description:
      'Guides and resources for creators building faceless and AI-powered video content.',
    type: 'website',
  },
};

const BLOG_POSTS = [
  {
    title: 'How to Create Viral Faceless Videos with AI',
    description:
      'A complete 2025 guide to building viral faceless content using AI tools.',
    href: '/blogs/blog-1',
    image:
      'https://ik.imagekit.io/vchtech/v3-blogs/blog-1.png',
    tag: 'Complete Guide',
    readTime: '15 min read',
  },
  {
    title: 'How to Grow on YouTube Shorts Using AI',
    description:
      'A complete beginner-to-pro guide for growing YouTube Shorts using AI-powered tools.',
    href: '/blogs/blog-2',
    image:
      'https://ik.imagekit.io/vchtech/v3-blogs/blog-2.png',
    tag: 'Beginner Guide',
    readTime: '18 min read',
  },
  {
    title: 'Users Don’t Want More AI — They Want Fewer Decisions',
    description:
      'What early users taught me while building V3 Studio, and how it reshaped the product roadmap.',
    href: '/blogs/blog-3',
    image: 'https://ik.imagekit.io/vchtech/v3-blogs/blog-3.png',
    tag: 'Founder Insights',
    readTime: '6 min read',
  },
  {
    title: 'Best AI Faceless Video Generator (2025)',
    description:
      'Compare the best AI faceless video generators and learn how to create viral videos without showing your face.',
    href: '/blogs/blog-4',
    image: 'https://ik.imagekit.io/vchtech/v3-blogs/blog-1.png',
    tag: 'SEO Guide',
    readTime: '10 min read',
  }
];

export default function BlogLandingPage() {
  return (
    <>
      <div className="bg-black text-white min-h-screen min-w-full flex flex-col justify-start items-center">
        <LogoSection />

        {/* ================= HERO ================= */}
        <section className="max-w-6xl mx-auto px-4 pt-16 pb-20 text-center">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 border border-purple-500/30 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            V3 Studio Blog
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Learn to Build Viral Videos with AI
          </h1>

          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            In-depth guides, strategies, and insights to help creators grow using
            faceless and AI-powered video content.
          </p>

          {/* Trust Signals */}
          <div className="flex justify-center gap-8 mt-10 text-slate-400 text-sm">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              Growth-focused
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Creator-first
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              Trusted by 50k+ creators
            </div>
          </div>
        </section>

        {/* ================= FEATURED POST ================= */}
        <section className="max-w-6xl mx-auto px-4 pb-16">
          <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-2xl p-8 md:p-10 shadow-xl">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <FeaturedHeroImage imageUrl={BLOG_POSTS[0].image} />

              <div>
                <span className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full text-sm font-medium mb-4">
                  🌟 Featured
                </span>

                <h2 className="text-3xl font-bold mb-4">
                  {BLOG_POSTS[0].title}
                </h2>

                <p className="text-slate-300 mb-6">
                  {BLOG_POSTS[0].description}
                </p>

                <div className="flex items-center gap-4 text-sm text-slate-400 mb-6">
                  <span>{BLOG_POSTS[0].readTime}</span>
                  <span>•</span>
                  <span>{BLOG_POSTS[0].tag}</span>
                </div>

                <Link
                  href={BLOG_POSTS[0].href}
                  className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  Read Article
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ================= ALL POSTS ================= */}
        <section className="max-w-6xl mx-auto px-4 pb-20">
          <h3 className="text-2xl font-bold mb-8">
            Latest Articles
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {BLOG_POSTS.map((post, i) => (
              <Link
                key={i}
                href={post.href}
                className="group bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/20 transition-all"
              >
                <h4 className="text-xl font-semibold mb-2 group-hover:text-purple-400 transition-colors">
                  {post.title}
                </h4>

                <p className="text-slate-400 text-sm mb-4">
                  {post.description}
                </p>

                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>{post.readTime}</span>
                  <span className="flex items-center gap-1">
                    Read more <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ================= CTA ================= */}
        <section className="max-w-5xl mx-auto px-4 pb-24 text-center">
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-10">
            <h2 className="text-3xl font-bold mb-4">
              Start Creating Faceless Videos Today
            </h2>
            <p className="text-lg text-slate-400 mb-8">
              Turn what you learn into viral videos using V3 Studio’s AI-powered
              creation tools.
            </p>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
