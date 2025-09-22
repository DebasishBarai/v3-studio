import { mutation, query } from "./_generated/server";

export const getUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    console.log({ identity });
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('subject'), identity.subject))
      .unique();

    console.log({ user })

    return user;
  },
});

export const addUser = mutation({
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

    if (user) {
      return user
    }

    await ctx.db.insert('users', {
      subject: identity.subject,
      name: identity.name || 'Anonymous',
      credits: 5,
    });
  }
})

export const getCredits = query({
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

    return user?.credits ?? 0;
  },
});
