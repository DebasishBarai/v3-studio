'use node'

import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js'
import { v } from "convex/values";
import { action } from "../_generated/server";
import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";

const elevenLabsClient = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

export const generateAudio = action({
  args: {
    text: v.string(),
    voiceId: v.string(),
  },
  handler: async (ctx, args): Promise<{ audioStorageId: Id<'_storage'>, audioUrl: string }> => {
    console.log('generate audio');

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

    // update credits
    await ctx.runMutation(internal.user.decreaseInternalCredits, {
      subject: identity.subject,
      amount: 5,
    });

    return { audioStorageId, audioUrl }

  }
})
