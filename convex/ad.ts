import { v } from "convex/values";
import { action, internalMutation, internalQuery, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { generateAdsImageWithNanoBanana } from './ai';
import { Doc, Id } from "./_generated/dataModel";

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

export const createAd = action({
  args: {
    base64Image: v.string(),
    description: v.string(),
    resolution: v.string(),
    avatarId: v.optional(v.id('_storage')),
  },
  handler: async (ctx, args): Promise<Id<'ads'>> => {
    const identity = await ctx.auth.getUserIdentity();
    console.log({ identity });
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.runQuery(internal.ad.getInternalUser, {
      subject: identity.subject,
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Check if avatarId is provided
    let avatar = '';

    if (args.avatarId) {
      const avatarBlob = await ctx.storage.get(args.avatarId);

      if (!avatarBlob) {
        throw new Error("Avatar not found");
      }

      avatar = Buffer.from(await avatarBlob.arrayBuffer()).toString("base64");
    }


    // Generate the image here
    const adImage = await generateAdsImageWithNanoBanana({
      base64Image: args.base64Image,
      description: args.description,
      size: args.resolution,
      base64Avatar: avatar,
    });


    if (!adImage || !adImage.data) {
      throw new Error('No image generated');
    }

    // convert base64 to blob
    const cleaned = adImage.data.includes(',') ? adImage.data.split(',')[1] : adImage.data;
    const byteCharacters = atob(cleaned); // decode base64
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: adImage.mimeType });

    const adImageStorageId: Id<'_storage'> = await ctx.storage.store(blob);

    const adId = await ctx.runMutation(internal.ad.createInternalAd, {
      userId: user._id,
      productImage: args.base64Image,
      description: args.description,
      resolution: args.resolution,
      avatar: args.avatarId,
      adImageStorageId,
    })
    return adId
  }
})

export const createInternalAd = internalMutation({
  args: {
    userId: v.id('users'),
    productImage: v.string(),
    description: v.string(),
    resolution: v.string(),
    avatar: v.optional(v.id('_storage')),
    adImageStorageId: v.id('_storage'),
  },
  handler: async (ctx, args) => {

    const ad = await ctx.db
      .insert('ads', {
        userId: args.userId,
        productImage: args.productImage,
        description: args.description,
        resolution: args.resolution,
        avatar: args.avatar,
        adImageStorageId: args.adImageStorageId,
      })
    return ad
  }
})

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
