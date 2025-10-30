import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { aspectRatioValidator } from "./schema";

export const getAds = query({
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

    if (!user) {
      throw new Error("User not found");
    }

    const ads = await ctx.db
      .query('ads')
      .withIndex('by_userId', (q) => q.eq('userId', user?._id))
      .order('desc')
      .collect();

    return ads;
  },
})

export const generateProductImageUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl()
  }
})

export const createInternalAd = internalMutation({
  args: {
    userId: v.id('users'),
    productId: v.id('_storage'),
    productUrl: v.string(),
    description: v.optional(v.string()),
    aspectRatio: aspectRatioValidator,
    avatar: v.optional(v.id('_storage')),
    adImageStorageId: v.id('_storage'),
    adImageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {

    const ad = await ctx.db
      .insert('ads', {
        userId: args.userId,
        productId: args.productId,
        productUrl: args.productUrl,
        description: args.description,
        aspectRatio: args.aspectRatio,
        avatar: args.avatar,
        adImageStorageId: args.adImageStorageId,
        adImageUrl: args.adImageUrl,
      })
    return ad
  }
})

export const getInternalAd = internalQuery({
  args: {
    _id: v.id('ads'),
  },
  handler: async (ctx, args) => {

    const ad = await ctx.db
      .query('ads')
      .withIndex('by_id', (q) => q.eq('_id', args._id))
      .first();

    return ad
  }
})

export const updateInternalAd = internalMutation({
  args: {
    id: v.id('ads'),
    adImageStorageId: v.optional(v.id('_storage')),
    adImageUrl: v.optional(v.string()),
    adVideoStorageId: v.optional(v.id('_storage')),
    adVideoUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {

    // Build the patch object, only including fields that are not null or undefined
    const patch: Record<string, Id<'_storage'> | string> = {};
    if (args.adImageStorageId != null) patch.adImageStorageId = args.adImageStorageId;
    if (args.adImageUrl != null) patch.adImageUrl = args.adImageUrl;
    if (args.adVideoStorageId != null) patch.adVideoStorageId = args.adVideoStorageId;
    if (args.adVideoUrl != null) patch.adVideoUrl = args.adVideoUrl;

    // Only patch if there are fields to update
    if (Object.keys(patch).length > 0) {
      await ctx.db.patch(args.id, patch);
    }
  }
})
