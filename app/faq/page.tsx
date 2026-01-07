'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'What is V3 Studio?',
    answer:
      'V3 Studio is an AI-powered platform that helps creators generate high-quality faceless videos from simple text prompts. No camera, no editing skills required.',
  },
  {
    question: 'Who is V3 Studio for?',
    answer:
      'V3 Studio is designed for faceless YouTube creators, short-form content creators, marketers, founders, and anyone who wants to create videos quickly and at scale.',
  },
  {
    question: 'Do I need video editing experience?',
    answer:
      'Not at all. V3 Studio handles scripting, visuals, and video assembly automatically.',
  },
  {
    question: 'Are the videos completely faceless?',
    answer:
      'Yes. All videos generated on V3 Studio are 100% faceless and optimized for creators who don’t want to appear on camera.',
  },
  {
    question: 'How long does it take to generate a video?',
    answer:
      'Most videos are generated within a few minutes. Generation time may vary based on length and complexity.',
  },
  {
    question: 'Can I upload videos to YouTube or social platforms?',
    answer:
      'Yes. You can upload videos to YouTube, Shorts, Instagram Reels, TikTok, and other platforms.',
  },
  {
    question: 'Do I own the videos I create?',
    answer:
      'Yes. You retain full rights to all videos generated using V3 Studio.',
  },
  {
    question: 'Is V3 Studio free to use?',
    answer:
      'V3 Studio offers a free tier with limited usage. Paid plans unlock higher limits and advanced features.',
  },
  {
    question: 'Is V3 Studio still in beta?',
    answer:
      'Yes. V3 Studio is currently in beta, and we’re actively improving performance, features, and customization options.',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-5xl bg-neutral-900/70 backdrop-blur-md shadow-2xl border border-neutral-800 rounded-2xl overflow-hidden">
        <div className="p-10 space-y-8">
          {/* Header */}
          <div className="space-y-3">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h1>
            <p className="text-neutral-400 max-w-2xl">
              Everything you need to know about V3 Studio.  
              If you still have questions, feel free to reach out via our Contact page.
            </p>
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={index}
                  className="border border-neutral-800 rounded-xl bg-neutral-900/50 transition-all"
                >
                  <button
                    onClick={() =>
                      setOpenIndex(isOpen ? null : index)
                    }
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                  >
                    <span className="font-medium text-white">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 text-neutral-400 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-4 text-neutral-400 text-sm leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
