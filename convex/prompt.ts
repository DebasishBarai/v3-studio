import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const seedPrompt = mutation({
  args: {
    prompt: v.string(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('promptVariations', {
      category: args.category,
      prompt: args.prompt,
    });
  }
})
