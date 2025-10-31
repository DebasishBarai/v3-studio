'use node'

import { GoogleGenAI } from "@google/genai";
import { videoGenerationPrompt } from "../helper";
import { v } from "convex/values";
import { action } from "../_generated/server";
import { styleValidator, musicValidator, aspectRatioValidator, voiceValidator } from "../schema";
import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";

const genai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export const createVideoBlueprint = action({
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

    if (user.credits < 5) {
      throw new Error("Insufficient credits");
    }

    console.log('create video');
    const prompt = videoGenerationPrompt(args.prompt, args.style, args.durationInSecs, args.aspectRatio);

    const response = await genai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    if (!response.text) {
      throw new Error("No response from AI");
    }

    const cleanJsonString = response.text
      .replace(/^'```json\n'\s*\+\s*/g, '')  // Remove leading '```json\n' +
      .replace(/\n\s*'```'$/g, '')            // Remove trailing '```'
      .replace(/'\s*\+\s*'/g, '')             // Remove all ' + ' concatenations
      .replace(/^'|'$/g, '')                  // Remove leading/trailing quotes
      .replace(/\\n/g, '\n')                  // Convert escaped newlines
      .replace(/\\`/g, '`')                   // Convert escaped backticks
      .replace(/```json\s*/g, '')             // Remove ```json markers
      .replace(/```\s*$/g, '')                // Remove closing ```
      .trim();

    const blueprint = JSON.parse(cleanJsonString);

    const video = await ctx.runMutation(internal.video.video.createInternalVideo, {
      userId: user._id,
      prompt: args.prompt,
      style: args.style,
      music: args.music,
      voice: args.voice,
      aspectRatio: args.aspectRatio,
      durationInSecs: args.durationInSecs,
      numberOfImagesPerPrompt: args.numberOfImagesPerPrompt,
      generateMultipleAngles: args.generateMultipleAngles,
      title: blueprint.title,
      characters: blueprint.characters,
      scenes: blueprint.scenes,
    })

    // update credits
    await ctx.runMutation(internal.user.decreaseInternalCredits, {
      subject: identity.subject,
      amount: 5,
    });

    return video

  }
})

