import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { styleValidator, musicValidator, aspectRatioValidator, voiceValidtaor } from "./schema";

export const createVideo = mutation({
  args: {
    prompt: v.string(),
    style: styleValidator,
    music: musicValidator,
    voice: voiceValidtaor,
    durationInSecs: v.number(),
    aspectRatio: aspectRatioValidator,
    numberOfImagesPerPrompt: v.number(),
    generateMultipleAngles: v.boolean(),
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

    const video = await ctx.db
      .insert('videos', {
        userId: user._id,
        prompt: args.prompt ?? '',
        style: args.style,
        music: args.music,
        voice: args.voice,
        aspectRatio: args.aspectRatio,
        durationInSecs: args.durationInSecs ?? 0,
        numberOfImagesPerPrompt: args.numberOfImagesPerPrompt ?? 1,
        generateMultipleAngles: args.generateMultipleAngles ?? false,
        characters: [],
        scenes: [],
      })

    return video

  }
})
