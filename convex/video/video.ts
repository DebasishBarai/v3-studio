import { v } from "convex/values";
import schema, { styleValidator, musicValidator, aspectRatioValidator, voiceValidator, sceneSchema, characterSchema } from "../schema";
import { Id } from "../_generated/dataModel";
import { internalMutation, mutation, query } from "../_generated/server";
import { partial } from "convex-helpers/validators";

const videoFields = schema.tables.videos.validator;

export const getVideos = query({
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

    const videos = await ctx.db
      .query('videos')
      .withIndex('by_userId', (q) => q.eq('userId', user?._id))
      .order('desc')
      .collect();

    return videos;
  },
})

export const getVideo = query({
  args: { id: v.id('videos') },
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

    const video = await ctx.db.get(args.id)

    if (!video) {
      throw new Error("Video not found");
    }

    if (video.userId !== user._id) {
      throw new Error("Not authenticated for this video");
    }

    return video

  }
})

export const updateVideo = mutation({
  args: {
    id: v.id("videos"),
    update: partial(videoFields),
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

    const video = await ctx.db.get(args.id)

    if (!video) {
      throw new Error("Video not found");
    }

    if (video.userId !== user._id) {
      throw new Error("Not authenticated for this video");
    }

    await ctx.db.patch(args.id, args.update)
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
    title: v.optional(v.string()),
    characters: v.array(characterSchema),
    scenes: v.array(sceneSchema),
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
        title: args.title,
        characters: args.characters,
        scenes: args.scenes,
      })

    return video
  }
})
