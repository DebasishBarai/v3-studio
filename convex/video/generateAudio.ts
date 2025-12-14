'use node'

import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js'
import { v } from "convex/values";
import { action, internalAction } from "../_generated/server";
import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";

import { AssemblyAI, SpeechModel } from "assemblyai";

const elevenLabsClient = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

const assemblyAiClient = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY as string,
});

export const generateAudio = action({
  args: {
    text: v.string(),
    voiceId: v.string(),
    videoId: v.id('videos'),
    sceneIndex: v.number(),
  },
  handler: async (ctx, args): Promise<{ audioStorageId: Id<'_storage'>, audioUrl: string }> => {
    return await ctx.runAction(internal.video.generateAudio.internalGenerateAudio, args)
  }
})

export const internalGenerateAudio = internalAction({
  args: {
    text: v.string(),
    voiceId: v.string(),
    videoId: v.id('videos'),
    sceneIndex: v.number(),
    userId: v.optional(v.id('users'))
  },
  handler: async (ctx, args): Promise<{ audioStorageId: Id<'_storage'>, audioUrl: string }> => {
    console.log('generate audio');

    let user = null

    if (!args.userId) {
      const identity = await ctx.auth.getUserIdentity();

      if (identity === null) {
        throw new Error("Not authenticated");
      }

      user = await ctx.runQuery(internal.user.getInternalUser, {
        subject: identity.subject,
      });
    } else {
      user = await ctx.runQuery(internal.user.getInternalUserByUserId, {
        userId: args.userId,
      });

    }

    if (!user) {
      throw new Error("User not found");
    }

    if (user.credits < 5) {
      throw new Error("Insufficient credits");
    }

    // Get video
    let video = await ctx.runQuery(internal.video.video.getInternalVideo, {
      id: args.videoId,
      userId: user._id,
    });

    if (!video) {
      throw new Error("Video not found");
    }

    try {
      // update scene audioInProcess
      const updatedScenesWithInProcess = video.scenes.map((scene, index) =>
        index === args.sceneIndex
          ? { ...scene, audioInProcess: true }
          : scene
      );

      // Update video
      await ctx.runMutation(internal.video.video.updateInternalVideo, {
        id: args.videoId,
        userId: user._id,
        update: {
          scenes: updatedScenesWithInProcess,
        },
      });

      const audio = await elevenLabsClient.textToSpeech.convert(
        `${args.voiceId}`,
        {
          text: `${args.text}`,
          modelId: 'eleven_multilingual_v2',
          outputFormat: 'mp3_44100_128',
        }
      );

      // Collect all chunks into an array
      const chunks: Uint8Array[] = [];
      const reader = audio.getReader();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
        }
      } finally {
        reader.releaseLock();
      }

      // Convert chunks to a single Blob
      const audioBlob = new Blob(chunks as BlobPart[], { type: 'audio/mp3' });

      // Store audio in storage
      const audioStorageId = await ctx.storage.store(audioBlob);

      // Get audio url
      const audioUrl = await ctx.storage.getUrl(audioStorageId);

      if (!audioUrl) {
        throw new Error("Failed to generate URL for stored file");
      }

      // Generate captions with AssemblyAI

      const speechModel: SpeechModel = "universal"
      const params = {
        audio: audioUrl as string,
        speech_model: speechModel,
      }

      const captionResponse = await assemblyAiClient.transcripts.transcribe(params);

      if (!captionResponse.words) {
        throw new Error("Failed to generate captions");
      }

      // Store captions in video
      const words = captionResponse.words.map((word) => ({
        text: word.text,
        startMs: word.start,
        endMs: word.end,
      }));

      // Get video
      video = await ctx.runQuery(internal.video.video.getInternalVideo, {
        id: args.videoId,
        userId: user._id,
      });

      // Update only the scenes array
      const updatedScenes = video.scenes.map((scene, index) =>
        index === args.sceneIndex
          ? { ...scene, audioId: audioStorageId, audioUrl: audioUrl, words: words }
          : scene
      );

      // Update video
      await ctx.runMutation(internal.video.video.updateInternalVideo, {
        id: args.videoId,
        userId: user._id,
        update: {
          scenes: updatedScenes,
        },
      });

      // update credits
      await ctx.runMutation(internal.user.decreaseInternalCredits, {
        subject: user.subject,
        amount: 5,
      });

      return { audioStorageId, audioUrl }
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      // Get video
      video = await ctx.runQuery(internal.video.video.getInternalVideo, {
        id: args.videoId,
        userId: user._id,
      });
      // update scene audioInProcess
      const updatedScenesWithInProcess = video.scenes.map((scene, index) =>
        index === args.sceneIndex
          ? { ...scene, audioInProcess: false }
          : scene
      );

      // Update video
      await ctx.runMutation(internal.video.video.updateInternalVideo, {
        id: args.videoId,
        userId: user._id,
        update: {
          scenes: updatedScenesWithInProcess,
        },
      });
    }

  }
})
