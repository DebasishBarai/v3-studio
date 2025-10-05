import { v } from "convex/values";
import { internalMutation, internalQuery, mutation, query } from "./_generated/server";

export const getUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('subject'), identity.subject))
      .unique();

    return user;
  },
});

export const addUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

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

export const getInternalUser = internalQuery({
  args: { subject: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_subject', (q) => q.eq('subject', args.subject))
      .first();

    return user;
  }
})

export const addInternalCredits = internalMutation({
  args: {
    subject: v.string(),
    credits: v.number(),
  },
  handler: async (ctx, args) => {

    const user = await ctx.db
      .query('users')
      .withIndex('by_subject', (q) => q.eq('subject', args.subject))
      .first();

    if (!user) {
      throw new Error(`User with subject ${args.subject} not found`);
    }

    // Build the patch object, only including fields that are not null or undefined
    const patch: Record<string, number> = {};
    if (args.credits != null) patch.credits = args.credits;

    // Only patch if there are fields to update
    if (Object.keys(patch).length > 0) {
      await ctx.db.patch(user._id, patch);
    }
  }
});
