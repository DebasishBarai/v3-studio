import { v } from "convex/values";
import { internalAction } from "../_generated/server";

/**
 * Track signup/referral when user registers
 */
export const trackSignup = internalAction({
  args: {
    email: v.optional(v.string()),
    uid: v.optional(v.string()),
    tid: v.optional(v.string()),
    refId: v.optional(v.string()),
  },
  handler: async (_, args) => {
    try {
      // Need either email or uid
      if (!args.email && !args.uid) {
        console.error("FirstPromoter trackSignup: email or uid required");
        return;
      }

      // Need either tid or refId
      if (!args.tid && !args.refId) {
        console.error("FirstPromoter trackSignup: tid or ref_id required");
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const body: Record<string, string> = {};
      if (args.email) body.email = args.email;
      if (args.uid) body.uid = args.uid;
      if (args.tid) body.tid = args.tid;
      if (args.refId) body.ref_id = args.refId;

      const response = await fetch(
        "https://v2.firstpromoter.com/api/v2/track/signup",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.FIRSTPROMOTER_API_KEY}`,
            "Account-ID": process.env.FIRSTPROMOTER_ACCOUNT_ID!,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(
          `FirstPromoter signup tracking failed: ${response.status} ${response.statusText}`
        );
      } else {
        console.log("FirstPromoter signup tracked successfully");
      }
    } catch (err) {
      // swallow errors — NEVER break signup flow
      if (err instanceof Error && err.name === "AbortError") {
        console.error("FirstPromoter signup request timed out");
      } else {
        console.error("FirstPromoter signup tracking failed", err);
      }
    }
  },
});

/**
 * Track sale/payment when user makes a purchase
 */
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
          `FirstPromoter sale tracking failed: ${response.status} ${response.statusText}`
        );
      } else {
        console.log("FirstPromoter sale tracked successfully");
      }
    } catch (err) {
      // swallow errors — NEVER break billing
      if (err instanceof Error && err.name === "AbortError") {
        console.error("FirstPromoter sale request timed out");
      } else {
        console.error("FirstPromoter sale tracking failed", err);
      }
    }
  },
});
