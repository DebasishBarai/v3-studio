import { query } from "./_generated/server";

export const getCredits = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    console.log({ identity });
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    return await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('author'), identity.email))
      .first()
      .then((user) => user?.credits || 5);
  },
});
