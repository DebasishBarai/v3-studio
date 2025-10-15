import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

export const getCustomerPortalUrl = action({
  args: {},
  handler: async (ctx): Promise<string> => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.runQuery(internal.user.getInternalUser, {
      subject: identity.subject,
    });

    if (!user) {
      throw new Error("User not found");
    }
    // get polar customer portal url
    const polarResponse = await fetch('${process.env.POLAR_BASE_URL}/v1/customer-sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.POLAR_ORGANIZATION_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer_id: user.polarCustomerId,
      }),
    }
    )

    if (!polarResponse.ok) {
      throw new Error(`Failed to create Polar customer portal: ${polarResponse.statusText}`);
    }

    const polarCustomerSession = await polarResponse.json();

    return polarCustomerSession.customer_portal_url as string;

  }
})

export const getCustomerCheckoutUrl = action({
  args: {
    products: v.array(v.string()),  // array of product ids
  },
  handler: async (ctx, args): Promise<string> => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.runQuery(internal.user.getInternalUser, {
      subject: identity.subject,
    });

    if (!user) {
      throw new Error("User not found");
    }

    // get polar customer checkout url
    const polarResponse = await fetch('${process.env.POLAR_BASE_URL}/v1/checkouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.POLAR_ORGANIZATION_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer_id: user.polarCustomerId,
        products: args.products,
      }),
    }
    )

    if (!polarResponse.ok) {
      throw new Error(`Failed to create Polar customer checkout: ${polarResponse.statusText}`);
    }

    const polarCustomerCheckout = await polarResponse.json();

    return polarCustomerCheckout.url as string;
  }
})
