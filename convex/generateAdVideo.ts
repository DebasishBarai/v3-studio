'use node'

import { v } from "convex/values";
import { internal } from "./_generated/api";
import { action } from "./_generated/server"
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export const generateAdVideo = action({
  args: {
    adId: v.id('ads'),
  },
  handler: async (ctx, args) => {
    console.log('process 1')
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.runQuery(internal.user.getInternalUser, {
      subject: identity.subject,
    });

    if (!user) {
      throw new Error("User not found");
    }

    const ad = await ctx.runQuery(internal.ad.getInternalAd, {
      _id: args.adId,
    });

    if (!ad) {
      throw new Error("Ad not found");
    }

    if (!ad.adImageStorageId) {
      throw new Error("Ad image not found");
    }

    // Direct prompts for video generation
    const PROMPT = `Transform the uploaded image into a short dynamic advertisement video.
Add gentle camera movement such as slow zoom-in, panning or slight rotation
to create depth and energy. Introduce subtle animated particles or light
streaks around the product to emphasize motion and vibrance.
Keep the overall look clean, colorful and professional, highlighting the
product as the main focus throughout the clip.`;

    const AVATAR_PROMPT = `Transform the uploaded image into a short dynamic advertisement video.
Focus on subtle environmental animation while keeping the person and product completely stable and sharp.
Add gentle animated particles, light streaks, or floating elements in the background around the scene
to create energy and movement. Use very minimal camera movement - perhaps a slow, gentle zoom-in
or slight drift - but ensure the person holding the product remains the clear, steady focal point.
Keep the person's pose and the product position fixed to maintain a natural, professional look
while the background elements provide the dynamic motion and vibrance.`;

    const finalPrompt = ad.avatar && ad.avatar !== '' ? AVATAR_PROMPT : PROMPT;

    // Generate ads video
    const input = {
      image: ad.adImageUrl,
      prompt: finalPrompt,
    };

    const output = await replicate.run("wan-video/wan-2.2-i2v-fast", { input });

    // @ts-expect-error replicate.run() has the url() method
    const resp = await fetch(output.url());

    const videoBlob = await resp.blob();

    // Store video in storage
    const videoStorageId = await ctx.storage.store(videoBlob);

    // Get video url
    const videoUrl = await ctx.storage.getUrl(videoStorageId);

    // Update ad with video url
    await ctx.runMutation(internal.ad.updateInternalAd, {
      id: ad._id,
      adVideoStorageId: videoStorageId,
      adVideoUrl: videoUrl ?? undefined,
    });
    return

  }
})
