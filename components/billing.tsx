'use client';

import { useEffect, useState } from 'react';
import { Check, Gift, Coins } from 'lucide-react';
import { PolarEmbedCheckout } from "@polar-sh/checkout/embed";
import { useAction, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';

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
  const [activeTab, setActiveTab] = useState<'subscription' | 'credits'>('subscription');
  const [billedAnnually, setBilledAnnually] = useState(true);

  let user = null
  try {
    const convexUser = useQuery(api.user.getUser)
    user = convexUser
  } catch (error) {
    console.error(error)
  }

  const getCustomerCheckoutUrl = useAction(api.polar.getCustomerCheckoutUrl)

  const getCustomerPortalUrl = useAction(api.polar.getCustomerPortalUrl)

  const updateUserSubscription = useAction(api.user.updateUserSubscription)

  useEffect(() => {
    updateUserSubscription()
  }, [updateUserSubscription])

  // Open checkout programmatically when needed
  const openCheckout = async ({ products }: { products: string[] }) => {
    const theme = "dark"; // or 'light'

    try {
      // Get the customer checkout URL
      const checkoutLink = await getCustomerCheckoutUrl({ products });

      // This creates the checkout iframe and returns a Promise
      // that resolves when the checkout is fully loaded
      const checkout = await PolarEmbedCheckout.create(checkoutLink, theme);

      // Now you can interact with the checkout instance
      return checkout;
    } catch (error) {
      console.error("Failed to open checkout", error);
    }
  };

  const openCustomerPortal = async () => {
    const customerPortalUrl = await getCustomerPortalUrl();
    window.open(customerPortalUrl, '_blank');
  };

  return (
    <div className="w-full min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="flex items-center justify-center mb-12">
          <div className="inline-flex items-center bg-muted rounded-lg p-1">
            <button
              onClick={() => setActiveTab('subscription')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${activeTab === 'subscription'
                ? 'bg-background text-foreground shadow'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              Subscription
            </button>
            <button
              onClick={() => setActiveTab('credits')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${activeTab === 'credits'
                ? 'bg-background text-foreground shadow'
                : 'text-muted-foreground hover:text-foreground'
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
              <h1 className="text-4xl font-bold text-white mb-4">Plans & Pricing</h1>
              <p className="text-xl text-muted-foreground">Choose the perfect plan for your creative needs</p>
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
                  className="relative bg-background border border-zinc-800 rounded-lg shadow hover:shadow-lg transition"
                >
                  {/* Header */}
                  <div className="px-6 pt-6 pb-4">
                    <div className="flex items-start justify-between mb-2">
                      <h2 className="text-2xl font-bold">{tier.name}</h2>
                      {tier.badge && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400">
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
                        <span className="text-4xl font-bold">${tier.price}</span>
                        <span className="text-muted-foreground text-sm">/{tier.period}</span>
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

                  {/* CTA Button */}
                  {user &&
                    <div className="px-6 py-4 border-t border-zinc-800">
                      <button
                        className={`w-full py-2.5 px-4 rounded-md font-medium cursor-pointer transition-colors ${tier.name === 'Free'
                          ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                          }`}
                        onClick={async () => await openCheckout({ products: [tier.productId] })}
                      >
                        {user?.subscriptionProductId === tier.productId ? 'Subscribed' : 'Subscribe'}
                      </button>
                    </div>
                  }
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Credits Tab */}
        {activeTab === 'credits' && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">Credit Packages</h1>
              <p className="text-xl text-muted-foreground">Buy credits and unlock creative potential</p>
            </div>

            {/* Credit Packs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {creditPacks.map((pack, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 flex flex-col justify-between shadow hover:shadow-lg transition"
                >
                  {/* Credits and Badge */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <Coins className="h-4 w-4 text-yellow-400" />
                      <span className="text-xl font-bold">{pack.credits.toLocaleString()}</span>
                      {pack.badge && (
                        <span className="text-xs bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded-md font-medium">
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
                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-xl font-semibold">${pack.price}</div>
                    <button
                      className="inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap rounded-md font-medium transition-colors bg-secondary text-secondary-foreground hover:bg-secondary/80 py-2 h-8 px-4 text-sm"
                      onClick={async () => await openCheckout({ products: [pack.productId] })}
                    >
                      Purchase Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {user &&
        <div className="w-full flex flex-col justify-center items-center" >
          <Button variant="default"
            className="mt-8 p-4"
            onClick={async () => await openCustomerPortal()}
          >
            Manage your subscriptions
          </Button>
        </div>
      }
    </div>
  );
}
