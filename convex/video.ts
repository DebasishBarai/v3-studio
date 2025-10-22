import { v } from "convex/values";
import { action, internalMutation } from "./_generated/server";
import { styleValidator, musicValidator, aspectRatioValidator, voiceValidator } from "./schema";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

export const createVideo = action({
  args: {
    prompt: v.string(),
    style: styleValidator,
    music: musicValidator,
    voice: voiceValidator,
    durationInSecs: v.number(),
    aspectRatio: aspectRatioValidator,
    numberOfImagesPerPrompt: v.number(),
    generateMultipleAngles: v.boolean(),
  },
  handler: async (ctx, args): Promise<Id<'videos'>> => {
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

    const video = await ctx.runMutation(internal.video.createInternalVideo, {
      userId: user._id,
      prompt: args.prompt,
      style: args.style,
      music: args.music,
      voice: args.voice,
      aspectRatio: args.aspectRatio,
      durationInSecs: args.durationInSecs,
      numberOfImagesPerPrompt: args.numberOfImagesPerPrompt,
      generateMultipleAngles: args.generateMultipleAngles,
    })

    return video

  }
})

export const createInternalVideo = internalMutation({
  args: {
    userId: v.id('users'),
    prompt: v.string(),
    style: styleValidator,
    music: musicValidator,
    voice: voiceValidator,
    aspectRatio: aspectRatioValidator,
    durationInSecs: v.number(),
    numberOfImagesPerPrompt: v.number(),
    generateMultipleAngles: v.boolean(),
  },
  handler: async (ctx, args): Promise<Id<'videos'>> => {
    const video = await ctx.db
      .insert('videos', {
        userId: args.userId,
        prompt: args.prompt,
        style: args.style,
        music: args.music,
        voice: args.voice,
        aspectRatio: args.aspectRatio,
        durationInSecs: args.durationInSecs,
        numberOfImagesPerPrompt: args.numberOfImagesPerPrompt,
        generateMultipleAngles: args.generateMultipleAngles,
        characters: [],
        scenes: [],
      })

    return video
  }
})
