import { Metadata } from 'next';
import Link from 'next/link';
import {
  Sparkles,
  CheckCircle2,
  Zap,
  Target,
  Lightbulb,
  Clock,
  Rocket,
  Users,
  ArrowRight,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import { LogoSection } from '@/components/landing-components/logo-section';
import Footer from '@/components/footer';
import { FeaturedHeroImage } from '@/components/blogs/featured-hero-image';
import { FadeUp } from '@/components/motion/motion';

export const metadata: Metadata = {
  title: 'Users Don’t Want More AI — They Want Fewer Decisions | V3 Studio',
  description:
    'What early users taught me while building V3 Studio: why fewer choices, opinionated templates, and speed beat smarter AI features.',
  keywords: [
    'AI product design',
    'early user feedback',
    'SaaS roadmap',
    'AI video tools',
    'product thinking',
    'V3 Studio',
  ],
  openGraph: {
    title: 'Users Don’t Want More AI — They Want Fewer Decisions',
    description:
      'Lessons from early users building an AI creative tool.',
    type: 'article',
    images: [
      {
        url: 'https://ik.imagekit.io/vchtech/v3-blogs/blog-2.png',
        width: 1200,
        height: 630,
        alt: 'Users don’t want more AI',
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
      <div className="bg-black text-white min-h-screen flex flex-col items-center">
        <LogoSection />

        {/* Hero */}
        <section className="max-w-4xl mx-auto px-4 pt-12 pb-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 border border-purple-500/30 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Founder Insights
            </div>

            <FadeUp>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Users Don’t Want More AI — They Want Fewer Decisions
              </h1>
            </FadeUp>

            <FadeUp delay={0.1}>
              <p className="text-xl text-slate-300 mb-8">
                What early users taught me while building V3 Studio, an AI video tool.
              </p>
            </FadeUp>

            <div className="flex items-center justify-center gap-6 text-sm text-slate-400">
              <span>📅 December 2025</span>
              <span>⏱️ 6 min read</span>
              <span>👤 Debb, V3 Studio</span>
            </div>
          </div>

          <FeaturedHeroImage imageUrl="https://ik.imagekit.io/vchtech/v3-blogs/blog-2.png" />
        </section>

        {/* Content */}
        <article className="max-w-4xl mx-auto px-4 pb-20">

          {/* Intro */}
          <section className="mb-12">
            <p className="text-lg text-slate-300 leading-relaxed">
              When I started building V3 Studio, I assumed users would want more control,
              more configuration, and increasingly smarter AI.
              After watching how real users actually used the product,
              I realized those assumptions were wrong.
            </p>
          </section>

          {/* Wrong Assumptions */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-red-400" />
              The Assumptions That Didn’t Hold Up
            </h2>

            <div className="space-y-6">
              {[
                {
                  title: '“Users want more AI”',
                  desc: 'In reality, users cared far more about outcomes than how advanced the AI was.'
                },
                {
                  title: '“Customization is a must-have”',
                  desc: 'Most early users preferred templates that just worked.'
                },
                {
                  title: '“Quality beats speed”',
                  desc: 'For short-form content, speed almost always won.'
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-slate-800/50 border border-slate-700 rounded-xl p-6"
                >
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Insight */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Lightbulb className="w-8 h-8 text-yellow-400" />
              The Core Insight
            </h2>

            <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-8">
              <p className="text-lg text-slate-300 leading-relaxed">
                People don’t want to think about prompts, models, styles, or settings.
                They want to click a button and get something usable.
              </p>
            </div>
          </section>

          {/* Roadmap Shift */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-purple-400" />
              How This Changed the Roadmap
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                'Opinionated defaults over blank canvases',
                'Autopilot, end-to-end workflows',
                'Templates covering 80–90% of use cases',
                'Customization hidden behind “advanced” paths',
                'Focus on speed, not perfection',
              ].map((point, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-slate-800/50 border border-slate-700 rounded-xl p-5"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-1" />
                  <span className="text-slate-300">{point}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Customization */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-400" />
              When Does Customization Actually Matter?
            </h2>

            <p className="text-lg text-slate-300 mb-6">
              From what I’ve observed, customization starts to matter only after:
            </p>

            <ul className="space-y-4">
              {[
                'Users trust the default output',
                'They’ve shipped content successfully',
                'They understand what “good” looks like',
                'They want to optimize, not explore',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-purple-400 mt-1" />
                  <span className="text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Advice */}
          <section className="mb-16 bg-slate-800/50 border border-slate-700 rounded-xl p-8">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-green-400" />
              Advice for Builders
            </h2>

            <p className="text-slate-300 mb-6">
              If you’re building an AI or creative tool:
            </p>

            <ul className="space-y-3">
              {[
                'Watch what users do, not what they say',
                'Default paths matter more than edge cases',
                'Reduce choices aggressively early on',
                'Earn the right to add complexity later',
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-1" />
                  <span className="text-slate-300">{tip}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* CTA */}
          <section className="bg-slate-800/60 border border-slate-700 rounded-2xl p-10 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Building V3 Studio With These Principles
            </h2>

            <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
              V3 Studio is being built around speed, opinionated defaults,
              and end-to-end automation — not feature overload.
            </p>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg"
            >
              Try V3 Studio
              <ArrowRight className="w-5 h-5" />
            </Link>
          </section>

        </article>
      </div>

      <Footer />
    </>
  );
}
