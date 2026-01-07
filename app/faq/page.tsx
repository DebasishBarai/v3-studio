'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles, Zap, Shield, Clock } from 'lucide-react';

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
    icon: Zap,
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
    icon: Shield,
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
    icon: Zap,
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
    icon: Sparkles,
  },
  {
    question: 'Is V3 Studio still in beta?',
    answer:
      'Yes. V3 Studio is currently in beta, and we're actively improving performance, features, and customization options based on user feedback.',
    icon: Clock,
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-4xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block"
          >
            <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-400">Support Center</span>
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent"
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-neutral-400 text-lg max-w-2xl mx-auto"
          >
            Everything you need to know about V3 Studio. Can't find what you're looking for? Feel free to reach out via our Contact page.
          </motion.p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const Icon = faq.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
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
          transition={{ duration: 0.6, delay: 1.4 }}
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
      </div>
    </div>
  );
}
