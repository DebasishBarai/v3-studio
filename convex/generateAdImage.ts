'use node'

import { GoogleGenAI, Modality } from "@google/genai"
import { action } from './_generated/server'
import { internal } from './_generated/api'
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

const genai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export const createAd = action({
  args: {
    productId: v.id('_storage'),
    description: v.optional(v.string()),
    resolution: v.string(),
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



    // Direct prompts for image generation
    const PROMPT = `Create a vibrant product showcase image featuring the uploaded product
  in the center, surrounded by dynamic splashes of liquid or relevant material that complement the product.
  Use a clean, colorful background to make the product stand out. Include subtle elements related to the product's flavor,
  ingredients, or theme floating around to add context and visual interest. 
  Ensure the product is sharp and in focus, with motion and energy conveyed through the splash effects.`;

    const AVATAR_PROMPT = `Create a professional product showcase image 
  featuring a person naturally holding the product in their hands. Make 
  the product the clear focal point of the scene. 
  Use a clean, colorful background that highlights the product.
  Include subtle floating elements related to the product's flavor, 
  ingredients, or theme for added context, if relevant. Ensure both the person and product are sharp, well-lit, and in focus, 
  conveying a polished and professional look.`;

    try {

      // Create the final prompt with description if provided
      let finalPrompt = args.avatarId ? AVATAR_PROMPT : PROMPT;

      if (args.description) {
        finalPrompt += ` Additional context: ${args.description}`;
      }

      if (args.resolution) {
        finalPrompt += ` Resolution: ${args.resolution}`;
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
        model: "gemini-2.5-flash-image-preview",
        contents: prompt,
        config: {
          responseModalities: [Modality.TEXT, Modality.IMAGE],
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
            resolution: args.resolution,
            avatar: args.avatarId,
            adImageStorageId,
            adImageUrl: adImageUrl ?? undefined,
          })

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
