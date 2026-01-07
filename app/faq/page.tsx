'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles, Zap, Shield, Clock, Video, DollarSign, Users, TrendingUp } from 'lucide-react';

const faqs = [
  {
    question: 'What is V3 Studio?',
    answer:
      'V3 Studio is an AI-powered platform that helps creators generate high-quality faceless videos from simple text prompts. No camera, no editing skills required.',
    icon: Sparkles,
  },
  {
    question: 'Who is V3 Studio for?',
    answer:
      'V3 Studio is designed for faceless YouTube creators, short-form content creators, marketers, founders, and anyone who wants to create videos quickly and at scale.',
    icon: Users,
  },
  {
    question: 'Do I need video editing experience?',
    answer:
      'Not at all. V3 Studio handles scripting, visuals, and video assembly automatically. Our AI takes care of the technical details so you can focus on your creative vision.',
    icon: Shield,
  },
  {
    question: 'Are the videos completely faceless?',
    answer:
      'Yes. All videos generated on V3 Studio are 100% faceless and optimized for creators who don't want to appear on camera.',
    icon: Video,
  },
  {
    question: 'How long does it take to generate a video?',
    answer:
      'Most videos are generated within a few minutes. Generation time may vary based on length and complexity, but our advanced AI ensures quick turnaround times.',
    icon: Clock,
  },
  {
    question: 'Can I upload videos to YouTube or social platforms?',
    answer:
      'Absolutely! You can upload videos to YouTube, YouTube Shorts, Instagram Reels, TikTok, and other platforms. All content is platform-optimized and ready to publish.',
    icon: TrendingUp,
  },
  {
    question: 'Do I own the videos I create?',
    answer:
      'Yes. You retain full rights to all videos generated using V3 Studio. Create, monetize, and distribute your content however you wish.',
    icon: Shield,
  },
  {
    question: 'Is V3 Studio free to use?',
    answer:
      'V3 Studio offers a free tier with limited usage. Paid plans unlock higher limits, advanced features, and priority generation speeds.',
    icon: DollarSign,
  },
  {
    question: 'Is V3 Studio still in beta?',
    answer:
      'Yes. V3 Studio is currently in beta, and we're actively improving performance, features, and customization options based on user feedback.',
    icon: Zap,
  },
];

const FeaturedHeroImage = ({ imageUrl }: { imageUrl: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/20 border border-purple-500/20"
    >
      <img
        src={imageUrl}
        alt="V3 Studio FAQ Hero"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
    </motion.div>
  );
};

const QuickStats = ({ stats }: { stats: Array<{ icon: string; label: string; value: string }> }) => {
  const iconMap: Record<string, any> = {
    trending: TrendingUp,
    video: Video,
    dollar: DollarSign,
    users: Users,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
    >
      {stats.map((stat, i) => {
        const Icon = iconMap[stat.icon];
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
            className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6 text-center hover:shadow-lg hover:shadow-purple-500/20 transition-all"
          >
            <Icon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-slate-400">{stat.label}</div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-block"
          >
            <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-400">Support Center</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
          >
            Frequently Asked Questions
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-xl text-slate-300 mb-8"
          >
            Everything you need to know about V3 Studio. Can't find what you're looking for?
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-center gap-6 text-sm text-slate-400 mb-12"
          >
            <span>📚 Complete Guide</span>
            <span>⚡ Quick Answers</span>
            <span>💡 Expert Tips</span>
          </motion.div>
        </div>

        {/* Hero Image */}
        <FeaturedHeroImage imageUrl="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&auto=format&fit=crop" />
      </section>

      {/* Quick Stats */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <QuickStats
          stats={[
            { icon: 'trending', label: 'Customer Satisfaction', value: '98%' },
            { icon: 'video', label: 'Videos Created', value: '1M+' },
            { icon: 'users', label: 'Active Users', value: '50K+' },
            { icon: 'dollar', label: 'Time Saved', value: '80%' },
          ]}
        />
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-4">Common Questions</h2>
          <p className="text-slate-400 text-center max-w-2xl mx-auto">
            Find quick answers to the most commonly asked questions about V3 Studio
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const Icon = faq.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.9 + index * 0.08 }}
                className={`group border rounded-2xl transition-all duration-300 ${
                  isOpen
                    ? 'border-purple-500/50 bg-gradient-to-br from-purple-500/10 to-pink-500/10 shadow-lg shadow-purple-500/10'
                    : 'border-neutral-800 bg-neutral-900/50 hover:border-neutral-700'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <motion.div
                      animate={{
                        scale: isOpen ? 1.1 : 1,
                        rotate: isOpen ? 360 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        isOpen
                          ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                          : 'bg-neutral-800 group-hover:bg-neutral-700'
                      }`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </motion.div>
                    <span className={`font-semibold text-lg ${isOpen ? 'text-white' : 'text-neutral-200'}`}>
                      {faq.question}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`p-2 rounded-full transition-all duration-300 ${
                      isOpen ? 'bg-purple-500/20' : 'bg-neutral-800 group-hover:bg-neutral-700'
                    }`}
                  >
                    <ChevronDown className="w-5 h-5 text-neutral-400" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <motion.div
                        initial={{ y: -10 }}
                        animate={{ y: 0 }}
                        exit={{ y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 pb-6 pl-20"
                      >
                        <p className="text-neutral-300 leading-relaxed">{faq.answer}</p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.8 }}
          className="mt-16 text-center p-8 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20"
        >
          <h3 className="text-2xl font-bold text-white mb-2">Still have questions?</h3>
          <p className="text-neutral-400 mb-6">
            Our support team is here to help you get the most out of V3 Studio.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
          >
            Contact Support
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
}
