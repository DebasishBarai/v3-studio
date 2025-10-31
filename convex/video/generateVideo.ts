'use node'

import { v } from "convex/values";
import { internal } from "../_generated/api";
import { action } from "../_generated/server"
import Replicate from "replicate";
import { aspectRatioValidator } from "../schema";
import { Id } from "../_generated/dataModel";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export const generateSceneVideo = action({
  args: {
    prompt: v.string(),
    baseImageUrl: v.string(),
  },
  handler: async (ctx, args): Promise<{ videoStorageId: Id<'_storage'>, videoUrl: string }> => {

    console.log('generate scene video');

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

    if (user.credits < 5) {
      throw new Error("Insufficient credits");
    }

    const input = {
      image: args.baseImageUrl,
      prompt: args.prompt,
      resolution: "720p",
    };

    const output = await replicate.run("wan-video/wan-2.2-i2v-fast", { input });

    // @ts-expect-error replicate.run() has the url() method
    const resp = await fetch(output.url());

    const videoBlob = await resp.blob();

    // Store video in storage
    const videoStorageId = await ctx.storage.store(videoBlob);

    // Get video url
    const videoUrl = await ctx.storage.getUrl(videoStorageId);

    if (!videoUrl) {
      throw new Error("Failed to generate URL for stored file");
    }

    // update credits
    await ctx.runMutation(internal.user.decreaseInternalCredits, {
      subject: identity.subject,
      amount: 5,
    });
    return { videoStorageId, videoUrl }

  }
})
