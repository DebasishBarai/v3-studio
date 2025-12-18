import { v } from "convex/values";
import { internalAction } from "../_generated/server";

export const trackSale = internalAction({
  args: {
    email: v.optional(v.string()),
    amountCents: v.number(),
    eventId: v.string(),
    plan: v.optional(v.string()),
  },
  handler: async (_, args) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(
        "https://v2.firstpromoter.com/api/v2/track/sale",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.FIRSTPROMOTER_API_KEY}`,
            "Account-ID": process.env.FIRSTPROMOTER_ACCOUNT_ID!,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: args.email,
            amount: args.amountCents,
            event_id: args.eventId,
            plan: args.plan,
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(
          `FirstPromoter API error: ${response.status} ${response.statusText}`
        );
      }
    } catch (err) {
      // swallow errors — NEVER break billing
      if (err instanceof Error && err.name === "AbortError") {
        console.error("FirstPromoter request timed out");
      } else {
        console.error("FirstPromoter failed", err);
      }
    }
  },
});
