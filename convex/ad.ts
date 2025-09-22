import { query } from "./_generated/server";

export const getAds = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    console.log({ identity });
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_subject', (q) => q.eq('subject', identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const ads = await ctx.db
      .query('ads')
      .withIndex('by_userId', (q) => q.eq('userId', user?._id))
      .collect();

    return ads;
  },
})
