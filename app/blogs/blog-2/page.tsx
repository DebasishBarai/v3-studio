import { Metadata } from 'next';
import Link from 'next/link';
import {
  TrendingUp,
  PlayCircle,
  Zap,
  BarChart3,
  CheckCircle2,
  Rocket,
  Target,
  Clock,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';

import { LogoSection } from '@/components/landing-components/logo-section';
import Footer from '@/components/footer';
import { FeaturedHeroImage } from '@/components/blogs/featured-hero-image';

export const metadata: Metadata = {
  title: 'How to Grow on YouTube Shorts Using AI (2025 Guide) | V3 Studio',
  description:
    'Learn how to grow faster on YouTube Shorts using AI. Discover proven strategies, posting frequency, hooks, monetization, and AI tools like V3 Studio.',
  keywords: [
    'YouTube Shorts growth',
    'AI YouTube Shorts',
    'grow YouTube Shorts fast',
    'shorts automation',
    'AI video generator',
    'V3 Studio',
  ],
  openGraph: {
    title: 'How to Grow on YouTube Shorts Using AI (2025)',
    description:
      'A complete beginner-to-pro guide for growing YouTube Shorts using AI-powered tools.',
    type: 'article',
    images: [
      {
        url: 'https://ik.imagekit.io/vchtech/v3-blogs/blog-1.png',
        width: 1200,
        height: 630,
        alt: 'YouTube Shorts Growth with AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function BlogPost() {
  return (
    <>
      <div className="bg-black text-white min-h-screen min-w-full flex flex-col items-center">
        <LogoSection />

        {/* Hero */}
        <section className="max-w-4xl mx-auto px-4 pt-12 pb-8 text-center">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-full text-sm mb-6">
              <PlayCircle className="w-4 h-4" />
              YouTube Shorts 2025
            </span>
  
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              How to Grow on YouTube Shorts Using AI
            </h1>
  
            <p className="text-xl text-slate-300 mb-6">
              Learn how creators are getting millions of views on YouTube Shorts
              using AI-powered workflows — without editing or filming.
            </p>
  
            <div className="text-sm text-slate-400 flex justify-center gap-6">
              <span>📅 Updated December 2025</span>
              <span>⏱️ 12 min read</span>
              <span>👤 V3 Studio Team</span>
            </div>
          </div>
          
          <FeaturedHeroImage imageUrl="https://ik.imagekit.io/vchtech/v3-blogs/blog-1.png" />
        </section>

        {/* Content */}
        <article className="max-w-4xl mx-auto px-4 pb-20">
          {/* Intro */}
          <p className="text-lg text-slate-300 mb-12">
            YouTube Shorts is now one of the fastest ways to grow a channel.
            Unlike long-form videos, Shorts can explode overnight — especially
            when combined with AI tools like V3 Studio that automate creation,
            editing, and publishing.
          </p>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              { icon: TrendingUp, value: '10B+', label: 'Daily Shorts Views' },
              { icon: BarChart3, value: '75%', label: 'Discovery-Based Traffic' },
              { icon: Rocket, value: '0 Subs', label: 'You Can Go Viral From' },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center"
              >
                <item.icon className="w-8 h-8 mx-auto mb-3 text-red-400" />
                <div className="text-2xl font-bold">{item.value}</div>
                <div className="text-sm text-slate-400">{item.label}</div>
              </div>
            ))}
          </div>

          {/* Why Shorts Work */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">
              Why YouTube Shorts Grow Faster Than Long Videos
            </h2>

            <ul className="space-y-4 text-slate-300">
              {[
                'Algorithm pushes Shorts to non-subscribers',
                'No thumbnail dependency',
                'Looping increases watch time',
                'Mobile-first global reach',
                'Low competition compared to long-form',
              ].map((point, i) => (
                <li key={i} className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-1" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* AI Workflow */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Zap className="w-8 h-8 text-purple-400" />
              AI-Powered YouTube Shorts Workflow
            </h2>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
              {[
                'Generate viral hook-based scripts',
                'AI picks engaging visuals',
                'Automatic captions & emojis',
                'Optimized 9:16 aspect ratio',
                'Royalty-free background music',
                'Export ready for Shorts',
              ].map((step, i) => (
                <div
                  key={i}
                  className="flex gap-4 border-b border-slate-700 pb-4 mb-4 last:border-b-0"
                >
                  <div className="bg-purple-500/20 text-purple-300 border border-purple-500/30 w-8 h-8 rounded-lg flex items-center justify-center font-bold">
                    {i + 1}
                  </div>
                  <span className="text-slate-300">{step}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Posting Strategy */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Clock className="w-8 h-8 text-blue-400" />
              Posting Strategy That Works
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Posting Frequency',
                  desc: '1–3 Shorts per day delivers fastest data and growth.',
                },
                {
                  title: 'Video Length',
                  desc: '7–30 seconds performs best for loops and retention.',
                },
                {
                  title: 'Hooks',
                  desc: 'First 2 seconds decide if your Short survives.',
                },
                {
                  title: 'Consistency',
                  desc: '30–60 days of daily posting beats everything.',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-slate-800/50 border border-slate-700 rounded-xl p-6"
                >
                  <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Monetization */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">
              Monetizing YouTube Shorts
            </h2>

            <ul className="space-y-4 text-slate-300">
              {[
                'YouTube Shorts ad revenue',
                'Affiliate links in description',
                'Driving traffic to long videos',
                'Selling digital products',
                'Brand sponsorships',
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* CTA */}
          <section className="bg-slate-800/60 border border-slate-700 rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Grow on YouTube Shorts With AI
            </h2>

            <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
              V3 Studio helps creators generate scroll-stopping YouTube Shorts
              with AI — faster, cheaper, and consistently.
            </p>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-xl font-semibold text-lg"
            >
              Start with V3 Studio
              <ArrowRight className="w-5 h-5" />
            </Link>
          </section>
        </article>
      </div>

      <Footer />
    </>
  );
}
