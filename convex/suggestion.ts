import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const addSuggestion = mutation({
  args: {
    fullName: v.string(),
    email: v.string(),
    subject: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

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

    const suggestionId = await ctx.db.insert('suggestions', {
      userId: user._id,
      fullName: args.fullName,
      email: args.email,
      subject: args.subject,
      content: args.content,
      createdAt: Date.now(),
    });
    return suggestionId;
  }
})
