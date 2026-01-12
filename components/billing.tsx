'use client';

import { useState } from 'react';
import { Check, Gift, Coins } from 'lucide-react';
import { useScrollDownAnimationHook } from "@/hooks/use-scroll-down-animation-hook";
import { motion } from "framer-motion";

interface PricingTier {
  name: string;
  description?: string;
  price: number;
  period: string;
  badge?: string;
  features: string[];
  productId: string;
}

interface CreditPack {
  credits: number;
  price: number;
  badge: string;
  bonus?: number;
  productId: string;
}

const subscriptionTiers: PricingTier[] = [
  /*
    {
      name: 'Free',
      price: 0,
      period: 'Always free',
      badge: 'Active',
      features: [
        '🚫 No commercial rights',
        '🖼️ Basic 3D cartoon image generation',
        '🧠 Limited access to story templates',
        '🗣️ Basic AI voiceover support',
        '🎬 Generate short AI videos (up to 30 sec)',
      ],
    },
  */
  {
    name: 'Starter Plan',
    description: 'Perfect for beginners exploring AI video creation and short-form storytelling.',
    price: 39.99,
    period: 'month',
    features: [
      '400 Credits',
      'Edit story modes & episodic generation',
      'Enable Different Video Style Video Generator',
      'No Watermark',
      'Project autosave & exports',
    ],
    productId: process.env.NEXT_PUBLIC_STARTER_PLAN_PRODUCT_ID as string,
  },
  {
    name: 'Creator Plan',
    description: 'Built for growing creators who want more control, output, and creative freedom.',
    price: 69.99,
    period: 'month',
    features: [
      '1200 Credits',
      'Edit story modes & episodic generation',
      'Enable Different Video Style Video Generator',
      'No Watermark',
      'Project autosave & exports',
    ],
    productId: process.env.NEXT_PUBLIC_CREATOR_PLAN_PRODUCT_ID as string,
  },
  {
    name: 'Pro Plan',
    description: 'Powerful tools for professional creators, studios, and indie animators.',
    price: 129.99,
    period: 'month',
    features: [
      '2400 Credits',
      'Enable Different Video Style Video Generator',
      'Project autosave & exports',
      'Edit story modes & episodic generation',
      'No Watermark',
    ],
    productId: process.env.NEXT_PUBLIC_PRO_PLAN_PRODUCT_ID as string,
  },
];

const creditPacks: CreditPack[] = [
  { credits: 50, price: 9.99, badge: '', productId: process.env.NEXT_PUBLIC_CREDITS_50_PRODUCT_ID as string },
  { credits: 100, price: 19.99, badge: 'Flash Sale', bonus: 20, productId: process.env.NEXT_PUBLIC_CREDITS_100_PRODUCT_ID as string },
  { credits: 150, price: 29.99, badge: 'Best Deal', bonus: 50, productId: process.env.NEXT_PUBLIC_CREDITS_150_PRODUCT_ID as string },
  { credits: 250, price: 49.99, badge: 'Top Value', bonus: 100, productId: process.env.NEXT_PUBLIC_CREDITS_250_PRODUCT_ID as string },
];

export const PricingPage = () => {
  const { ref, controls } = useScrollDownAnimationHook()
  const [activeTab, setActiveTab] = useState<'subscription' | 'credits'>('subscription');
  const [billedAnnually, setBilledAnnually] = useState(true);

  return (
    <motion.div
      id="pricing"
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: {
          opacity: 0,
          y: 100
        },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 2,
            delay: 0.2, // Delay the animation to avoid flickering
            ease: [0.22, 1, 0.36, 1]
          }
        },
      }}
      className="w-full min-h-screen bg-transparent text-foreground py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="flex items-center justify-center mb-12">
          <div className="inline-flex items-center bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('subscription')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${activeTab === 'subscription'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                : 'text-slate-400 hover:text-white'
                }`}
            >
              Subscription
            </button>
            <button
              onClick={() => setActiveTab('credits')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${activeTab === 'credits'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                : 'text-slate-400 hover:text-white'
                }`}
            >
              Credits
            </button>
          </div>
        </div>

        {/* Subscription Tab */}
        {activeTab === 'subscription' && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Plans &
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"> Pricing</span></h1>
              <p className="text-xl text-slate-300">Choose the perfect plan for your creative needs</p>
            </div>

            {/* Billing Toggle */}
            {/* <div className="flex items-center justify-center"> */}
            {/*   <div className="inline-flex items-center bg-muted rounded-lg p-1"> */}
            {/*     <button */}
            {/*       onClick={() => setBilledAnnually(false)} */}
            {/*       className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${!billedAnnually */}
            {/*         ? 'bg-background text-foreground shadow' */}
            {/*         : 'text-muted-foreground hover:text-foreground' */}
            {/*         }`} */}
            {/*     > */}
            {/*       Monthly */}
            {/*     </button> */}
            {/*     <button */}
            {/*       onClick={() => setBilledAnnually(true)} */}
            {/*       className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${billedAnnually */}
            {/*         ? 'bg-background text-foreground shadow' */}
            {/*         : 'text-muted-foreground hover:text-foreground' */}
            {/*         }`} */}
            {/*     > */}
            {/*       Annually */}
            {/*     </button> */}
            {/*   </div> */}
            {/* </div> */}

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {subscriptionTiers.map((tier, idx) => (
                <div
                  key={idx}
                  className="relative bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/50 transition-all duration-300"
                >
                  {/* Header */}
                  <div className="px-6 pt-6 pb-4">
                    <div className="flex items-start justify-between mb-2">
                      <h2 className="text-2xl font-bold">{tier.name}</h2>
                      {tier.badge && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {tier.badge}
                        </span>
                      )}
                    </div>
                    {tier.description && (
                      <p className="text-sm text-muted-foreground mb-4">{tier.description}</p>
                    )}

                    {/* Pricing */}
                    <div className="mb-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">${tier.price}</span>
                        <span className="text-slate-400 text-sm mb-4">/{tier.period}</span>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="px-6 py-4 border-t border-zinc-800">
                    <ul className="space-y-3">
                      {tier.features.map((feature, featureIdx) => (
                        <li key={featureIdx} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* Credits Tab */}
        {activeTab === 'credits' && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">Credit <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Packages</span></h1>
              <p className="text-xl text-muted-foreground">Buy credits and unlock creative potential</p>
            </div>

            {/* Credit Packs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {creditPacks.map((pack, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-xl p-6 flex flex-col justify-between shadow-lg hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/50 transition-all duration-300"
                >
                  {/* Credits and Badge */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <Coins className="h-4 w-4 text-yellow-400" />
                      <span className="text-xl font-bold">{pack.credits.toLocaleString()}</span>
                      {pack.badge && (
                        <span className="text-xs bg-amber-500/10 text-amber-400 px-2 py-1 rounded-md font-medium border border-amber-500/20">
                          {pack.badge}
                        </span>
                      )}
                    </div>

                    {/* Bonus Info */}
                    {pack.bonus && (
                      <div className="text-sm text-green-400 flex items-center gap-1">
                        <Gift className="w-4 h-4" />
                        <span>Total: {pack.credits.toLocaleString()} + <span className="font-semibold">{pack.bonus.toLocaleString()} Bonus</span></span>
                      </div>
                    )}
                  </div>

                  {/* Price and Button */}
                  <div className="mt-6 flex items-center justify-start">
                    <div className="text-2xl font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">${pack.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </motion.div >
  );
}
