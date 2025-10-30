'use node'

import { GoogleGenAI, Modality } from "@google/genai"
import { action } from './_generated/server'
import { internal } from './_generated/api'
import { v } from "convex/values";
import { aspectRatioValidator } from "./schema";
import { Id } from "./_generated/dataModel";

const genai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export const generateCharacterImage = action({
  args: {
    prompt: v.string(),
    aspectRatio: v.optional(aspectRatioValidator),
    baseImageId: v.optional(v.id('_storage')),
  },
  handler: async (ctx, args): Promise<{ imageStorageId: Id<'_storage'>, imageUrl: string }> => {

    console.log('generate character image');

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

    let baseImage = '';

    if (args.baseImageId) {
      const baseImageBlob = await ctx.storage.get(args.baseImageId);

      if (!baseImageBlob) {
        throw new Error("Base image not found");
      }

      baseImage = Buffer.from(await baseImageBlob.arrayBuffer()).toString("base64");
    }


    try {
      const finalPrompt = args.prompt;

      const prompt = args.baseImageId ? [
        { text: `${finalPrompt}` }, {
          inlineData: {
            mimeType: "image/png",
            data: baseImage,
          },
        },
      ] : [
        { text: `${finalPrompt}` },
      ]

      const response = await genai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: prompt,
        config: {
          responseModalities: [Modality.IMAGE],
          ...(args.aspectRatio && {
            imageConfig: {
              aspectRatio: args.aspectRatio,
            },
          }),
        },
      });

      // Check if response has candidates
      if (!response.candidates || response.candidates.length === 0) {
        throw new Error("No candidates returned in response");
      }

      // Find and return the first (and only) generated image
      for (const part of response.candidates[0].content?.parts || []) {
        if (part.inlineData) {
          const characterImage = {
            data: part.inlineData.data,
            mimeType: part.inlineData.mimeType,
          };
          if (!characterImage || !characterImage.data) {
            throw new Error('No image generated');
          }

          // convert base64 to blob
          const cleaned = characterImage.data.includes(',') ? characterImage.data.split(',')[1] : characterImage.data;
          const byteCharacters = atob(cleaned); // decode base64
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: characterImage.mimeType });

          const characterImageStorageId = await ctx.storage.store(blob);

          const characterImageUrl = await ctx.storage.getUrl(characterImageStorageId);
          if (!characterImageUrl) {
            throw new Error("Failed to generate URL for stored file");
          }
          // update credits
          await ctx.runMutation(internal.user.decreaseInternalCredits, {
            subject: identity.subject,
            amount: 5,
          });

          return { imageStorageId: characterImageStorageId, imageUrl: characterImageUrl }

        }
      }

      throw new Error("No image generated in response");

    } catch (error) {
      console.error('generateAdsImageWithNanoBanana error:', error);
      throw error;
    }
  }
})

export const generateSceneImage = action({
  args: {
    prompt: v.string(),
    aspectRatio: v.optional(aspectRatioValidator),
    baseImageId: v.optional(v.id('_storage')),
    characterImageIds: v.optional(v.array(v.id('_storage'))),
  },
  handler: async (ctx, args): Promise<{ imageStorageId: Id<'_storage'>, imageUrl: string }> => {

    console.log('generate scene image');

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

    let baseImage = '';

    if (args.baseImageId) {
      const baseImageBlob = await ctx.storage.get(args.baseImageId);

      if (!baseImageBlob) {
        throw new Error("Base image not found");
      }

      baseImage = Buffer.from(await baseImageBlob.arrayBuffer()).toString("base64");
    }

    const characterImages = []
    if (args.characterImageIds && args.characterImageIds.length > 0) {
      for (const imageId of args.characterImageIds) {
        const imageBlob = await ctx.storage.get(imageId);
        if (!imageBlob) {
          throw new Error(`Character image not found: ${imageId}`);
        }
        const base64Image = Buffer.from(await imageBlob.arrayBuffer()).toString("base64");
        characterImages.push(base64Image);
      }
    }


    try {
      const finalPrompt = args.prompt;

      const prompt = args.baseImageId ? [
        { text: `${finalPrompt}` }, {
          inlineData: {
            mimeType: "image/png",
            data: baseImage,
          },
        },
      ] : ((!args.characterImageIds || args.characterImageIds.length === 0) ? [
        { text: `${finalPrompt}` },
      ] : [
        { text: `${finalPrompt}` },
        ...characterImages.map(image => ({
          inlineData: {
            mimeType: "image/png",
            data: image,
          },
        }))
      ])

      const response = await genai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: prompt,
        config: {
          responseModalities: [Modality.IMAGE],
          ...(args.aspectRatio && {
            imageConfig: {
              aspectRatio: args.aspectRatio,
            },
          }),
        },
      });

      // Check if response has candidates
      if (!response.candidates || response.candidates.length === 0) {
        throw new Error("No candidates returned in response");
      }

      // Find and return the first (and only) generated image
      for (const part of response.candidates[0].content?.parts || []) {
        if (part.inlineData) {
          const characterImage = {
            data: part.inlineData.data,
            mimeType: part.inlineData.mimeType,
          };
          if (!characterImage || !characterImage.data) {
            throw new Error('No image generated');
          }

          // convert base64 to blob
          const cleaned = characterImage.data.includes(',') ? characterImage.data.split(',')[1] : characterImage.data;
          const byteCharacters = atob(cleaned); // decode base64
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: characterImage.mimeType });

          const characterImageStorageId = await ctx.storage.store(blob);

          const characterImageUrl = await ctx.storage.getUrl(characterImageStorageId);
          if (!characterImageUrl) {
            throw new Error("Failed to generate URL for stored file");
          }
          // update credits
          await ctx.runMutation(internal.user.decreaseInternalCredits, {
            subject: identity.subject,
            amount: 5,
          });

          return { imageStorageId: characterImageStorageId, imageUrl: characterImageUrl }

        }
      }

      throw new Error("No image generated in response");

    } catch (error) {
      console.error('generateAdsImageWithNanoBanana error:', error);
      throw error;
    }
  }
})
