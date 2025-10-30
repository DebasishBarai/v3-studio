'use node'

import { GoogleGenAI, Modality } from "@google/genai"
import { PROMPT, AVATAR_PROMPT } from "./helper";
import { action } from './_generated/server'
import { internal } from './_generated/api'
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { aspectRatioValidator } from "./schema";

const genai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export const createAd = action({
  args: {
    productId: v.id('_storage'),
    description: v.optional(v.string()),
    aspectRatio: aspectRatioValidator,
    avatarId: v.optional(v.id('_storage')),
  },
  handler: async (ctx, args): Promise<Id<'ads'>> => {

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

    const productUrl = await ctx.storage.getUrl(args.productId);

    if (!productUrl) {
      throw new Error("Product image not found");
    }

    // get product image from product id
    const productBlob = await ctx.storage.get(args.productId);

    if (!productBlob) {
      throw new Error("Product image not found");
    }

    const base64Image = Buffer.from(await productBlob.arrayBuffer()).toString("base64");

    // Check if avatarId is provided
    let avatar = '';

    if (args.avatarId) {
      const avatarBlob = await ctx.storage.get(args.avatarId);

      if (!avatarBlob) {
        throw new Error("Avatar not found");
      }

      avatar = Buffer.from(await avatarBlob.arrayBuffer()).toString("base64");
    }

    try {

      // Create the final prompt with description if provided
      let finalPrompt = args.avatarId ? AVATAR_PROMPT : PROMPT;

      if (args.description) {
        finalPrompt += ` Additional context: ${args.description}`;
      }

      const prompt = args.avatarId ? [
        { text: `${finalPrompt}` },
        {
          inlineData: {
            mimeType: "image/png",
            data: base64Image,
          },
        },
        {
          inlineData: {
            mimeType: "image/png",
            data: avatar,
          },
        },

      ] : [
        { text: `${finalPrompt}` },
        {
          inlineData: {
            mimeType: "image/png",
            data: base64Image,
          },
        },
      ];

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
          const adImage = {
            data: part.inlineData.data,
            mimeType: part.inlineData.mimeType,
          };
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

          const adImageStorageId = await ctx.storage.store(blob);

          const adImageUrl = await ctx.storage.getUrl(adImageStorageId);

          const adId = await ctx.runMutation(internal.ad.createInternalAd, {
            userId: user._id,
            productId: args.productId,
            productUrl: productUrl,
            description: args.description,
            aspectRatio: args.aspectRatio,
            avatar: args.avatarId,
            adImageStorageId,
            adImageUrl: adImageUrl ?? undefined,
          })

          // update credits
          await ctx.runMutation(internal.user.decreaseInternalCredits, {
            subject: identity.subject,
            amount: 5,
          });

          return adId

        }
      }

      throw new Error("No image generated in response");

    } catch (error) {
      console.error('generateAdsImageWithNanoBanana error:', error);
      throw error;
    }
  }
})
