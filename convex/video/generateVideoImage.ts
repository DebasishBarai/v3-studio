'use node'

import { GoogleGenAI, Modality } from "@google/genai"
import { action, internalAction } from '../_generated/server'
import { internal } from '../_generated/api'
import { v } from "convex/values";
import { aspectRatioValidator } from "../schema";
import { Id } from "../_generated/dataModel";

const genai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export const generateCharacterImage = action({
  args: {
    prompt: v.string(),
    aspectRatio: v.optional(aspectRatioValidator),
    baseImageId: v.optional(v.id('_storage')),
    videoId: v.id('videos'),
    characterIndex: v.number(),
  },
  handler: async (ctx, args): Promise<{ imageStorageId: Id<'_storage'>, imageUrl: string }> => {
    return await ctx.runAction(internal.video.generateVideoImage.internalGenerateCharacterImage, args)
  }
})


export const internalGenerateCharacterImage = internalAction({
  args: {
    prompt: v.string(),
    aspectRatio: v.optional(aspectRatioValidator),
    baseImageId: v.optional(v.id('_storage')),
    videoId: v.id('videos'),
    characterIndex: v.number(),
    userId: v.optional(v.id('users')),
  },
  handler: async (ctx, args): Promise<{ imageStorageId: Id<'_storage'>, imageUrl: string }> => {

    console.log('generate character image');

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

    // check whether the character is already generated
    if (video.characters[args.characterIndex].imageUrl) {
      throw new Error("Character image already generated");
    }

    try {
      // update character InProcess
      const updatedCharacters = video.characters.map((character, index) =>
        index === args.characterIndex
          ? { ...character, inProcess: true }
          : character
      );

      // Update video
      await ctx.runMutation(internal.video.video.updateInternalVideo, {
        id: args.videoId,
        userId: user._id,
        update: {
          characters: updatedCharacters,
        },
      });

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

            // Get video
            video = await ctx.runQuery(internal.video.video.getInternalVideo, {
              id: args.videoId,
              userId: user._id,
            });

            // Update only the characters array
            const updatedCharacters = video.characters.map((character, index) =>
              index === args.characterIndex
                ? { ...character, imageStorageId: characterImageStorageId, imageUrl: characterImageUrl }
                : character
            );

            // Update video
            await ctx.runMutation(internal.video.video.updateInternalVideo, {
              id: args.videoId,
              userId: user._id,
              update: {
                characters: updatedCharacters,
              },
            });

            // update credits
            await ctx.runMutation(internal.user.decreaseInternalCredits, {
              subject: user.subject,
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
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      // Get video
      video = await ctx.runQuery(internal.video.video.getInternalVideo, {
        id: args.videoId,
        userId: user._id,
      });
      // update character InProcess
      const updatedCharacters = video.characters.map((character, index) =>
        index === args.characterIndex
          ? { ...character, inProcess: false }
          : character
      );

      // Update video
      await ctx.runMutation(internal.video.video.updateInternalVideo, {
        id: args.videoId,
        userId: user._id,
        update: {
          characters: updatedCharacters,
        },
      });
    }
  }
})

export const generateSceneImage = action({
  args: {
    prompt: v.string(),
    aspectRatio: v.optional(aspectRatioValidator),
    baseImageId: v.optional(v.id('_storage')),
    characterImageIds: v.optional(v.array(v.id('_storage'))),
    videoId: v.id('videos'),
    sceneIndex: v.number(),

  },
  handler: async (ctx, args): Promise<any> => {
    return await ctx.runAction(internal.video.generateVideoImage.internalGenerateSceneImage, args)
  }
})


export const internalGenerateSceneImage = internalAction({
  args: {
    prompt: v.string(),
    aspectRatio: v.optional(aspectRatioValidator),
    baseImageId: v.optional(v.id('_storage')),
    characterImageIds: v.optional(v.array(v.id('_storage'))),
    videoId: v.id('videos'),
    sceneIndex: v.number(),
    userId: v.optional(v.id('users')),

  },
  handler: async (ctx, args) => {

    console.log('generate scene image');

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
      // update scene videoInProcess
      const updatedScenesWithInProcess = video.scenes.map((scene, index) =>
        index === args.sceneIndex
          ? { ...scene, imageInProcess: true }
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

            // Get video
            video = await ctx.runQuery(internal.video.video.getInternalVideo, {
              id: args.videoId,
              userId: user._id,
            });

            // Update only the scenes array
            const updatedScenes = video.scenes.map((scene, index) =>
              index === args.sceneIndex
                ? { ...scene, imageId: characterImageStorageId, imageUrl: characterImageUrl }
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

            return { imageStorageId: characterImageStorageId, imageUrl: characterImageUrl }
          }
        }

        throw new Error("No image generated in response");

      } catch (error) {
        console.error('generateAdsImageWithNanoBanana error:', error);
        throw error;
      }
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      // Get video
      video = await ctx.runQuery(internal.video.video.getInternalVideo, {
        id: args.videoId,
        userId: user._id,
      });

      // update scene videoInProcess
      const updatedScenesWithInProcess = video.scenes.map((scene, index) =>
        index === args.sceneIndex
          ? { ...scene, imageInProcess: false }
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
