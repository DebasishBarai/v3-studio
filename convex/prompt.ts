import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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


export const getRandomPromptVariation = query({
  args: {
    nounce: v.optional(v.number()),
  },
  handler: async (ctx) => {
    const all = await ctx.db.query("promptVariations").collect();
    if (all.length === 0) return null;
    const randomDoc = all[Math.floor(Math.random() * all.length)];
    return randomDoc;
  },
});


export const removePromptVariationDuplicates = mutation(async (ctx) => {
  // Collect all promptVariations
  const all = await ctx.db.query("promptVariations").collect();

  // Group by category + prompt
  const seen = new Map();
  for (const doc of all) {
    const key = `${doc.category}::${doc.prompt}`;
    if (!seen.has(key)) {
      seen.set(key, [doc]);
    } else {
      seen.get(key).push(doc);
    }
  }

  // For each group with duplicates, delete all but one
  for (const docs of seen.values()) {
    if (docs.length > 1) {
      // Keep the first, delete the rest
      for (const dup of docs.slice(1)) {
        await ctx.db.delete(dup._id);
      }
    }
  }
});
