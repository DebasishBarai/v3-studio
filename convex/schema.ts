import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const voiceValidator = v.union(
  v.object({ name: v.literal('Clyde'), gender: v.literal('Male'), voiceId: v.literal('2EiwWnXFnvU5JabPnv8n'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/premade/voices/2EiwWnXFnvU5JabPnv8n/65d80f52-703f-4cae-a91d-75d4e200ed02.mp3'), }),
  v.object({ name: v.literal('Roger'), gender: v.literal('Male'), voiceId: v.literal('CwhRBWXzGAHq8TQ4Fs17'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/premade/voices/CwhRBWXzGAHq8TQ4Fs17/58ee3ff5-f6f2-4628-93b8-e38eb31806b0.mp3'), }),
  v.object({ name: v.literal('Sarah'), gender: v.literal('Female'), voiceId: v.literal('EXAVITQu4vr4xnSDxMaL'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/premade/voices/EXAVITQu4vr4xnSDxMaL/01a3e33c-6e99-4ee7-8543-ff2216a32186.mp3'), }),
  v.object({ name: v.literal('Laura'), gender: v.literal('Female'), voiceId: v.literal('FGY2WhTYpPnrIDTdsKH5'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/premade/voices/FGY2WhTYpPnrIDTdsKH5/67341759-ad08-41a5-be6e-de12fe448618.mp3'), }),
  v.object({ name: v.literal('Charlie'), gender: v.literal('Male'), voiceId: v.literal('IKne3meq5aSn9XLyUdCD'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/premade/voices/IKne3meq5aSn9XLyUdCD/102de6f2-22ed-43e0-a1f1-111fa75c5481.mp3'), }),
  v.object({ name: v.literal('George'), gender: v.literal('Male'), voiceId: v.literal('JBFqnCBsd6RMkjVDRZzb'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/premade/voices/JBFqnCBsd6RMkjVDRZzb/e6206d1a-0721-4787-aafb-06a6e705cac5.mp3'), }),
  v.object({ name: v.literal('Callum'), gender: v.literal('Male'), voiceId: v.literal('N2lVS1w4EtoT3dr4eOWO'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/premade/voices/N2lVS1w4EtoT3dr4eOWO/ac833bd8-ffda-4938-9ebc-b0f99ca25481.mp3'), }),
  v.object({ name: v.literal('Bill'), gender: v.literal('Male'), voiceId: v.literal('pqHfZKP75CvOlQylNhV4'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/premade/voices/pqHfZKP75CvOlQylNhV4/d782b3ff-84ba-4029-848c-acf01285524d.mp3'), }),
  v.object({ name: v.literal('Lily'), gender: v.literal('Female'), voiceId: v.literal('pFZP5JQG7iQjIQuC4Bku'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/premade/voices/pFZP5JQG7iQjIQuC4Bku/89b68b35-b3dd-4348-a84a-a3c13a3c2b30.mp3'), }),
  v.object({ name: v.literal('River'), gender: v.literal('Female'), voiceId: v.literal('SAz9YHcvj6GT2YYXdXww'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/premade/voices/SAz9YHcvj6GT2YYXdXww/e6c95f0b-2227-491a-b3d7-2249240decb7.mp3'), }),
  v.object({ name: v.literal('Harry'), gender: v.literal('Male'), voiceId: v.literal('SOYHLrjzK2X1ezoPC6cr'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/premade/voices/SOYHLrjzK2X1ezoPC6cr/86d178f6-f4b6-4e0e-85be-3de19f490794.mp3'), }),
  v.object({ name: v.literal('Liam'), gender: v.literal('Male'), voiceId: v.literal('TX3LPaxmHKxFdv7VOQHJ'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/premade/voices/TX3LPaxmHKxFdv7VOQHJ/63148076-6363-42db-aea8-31424308b92c.mp3'), }),
  v.object({ name: v.literal('Chris'), gender: v.literal('Male'), voiceId: v.literal('Xb7hH8MSUJpSbSDYk0k2'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/premade/voices/Xb7hH8MSUJpSbSDYk0k2/d10f7534-11f6-41fe-a012-2de1e482d336.mp3'), }),
  v.object({ name: v.literal('Will'), gender: v.literal('Male'), voiceId: v.literal('onwK4e9ZLuTAKqWW03F9'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/premade/voices/onwK4e9ZLuTAKqWW03F9/7eee0236-1a72-4b86-b303-5dcadc007ba9.mp3'), }),
  v.object({ name: v.literal('Jessica'), gender: v.literal('Female'), voiceId: v.literal('cgSgspJ2msm6clMCkdW9'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/premade/voices/cgSgspJ2msm6clMCkdW9/56a97bf8-b69b-448f-846c-c3a11683d45a.mp3'), }),
  v.object({ name: v.literal('Brian'), gender: v.literal('Male'), voiceId: v.literal('nPczCjzI2devNBz1zQrb'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/premade/voices/nPczCjzI2devNBz1zQrb/2dd3e72c-4fd3-42f1-93ea-abc5d4e5aa1d.mp3'), }),
  v.object({ name: v.literal('Daniel'), gender: v.literal('Male'), voiceId: v.literal('onwK4e9ZLuTAKqWW03F9'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/premade/voices/onwK4e9ZLuTAKqWW03F9/7eee0236-1a72-4b86-b303-5dcadc007ba9.mp3'), }),
  v.object({ name: v.literal('Liam'), gender: v.literal('Male'), voiceId: v.literal('pFZP5JQG7iQjIQuC4Bku'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/premade/voices/pFZP5JQG7iQjIQuC4Bku/89b68b35-b3dd-4348-a84a-a3c13a3c2b30.mp3'), }),
  v.object({ name: v.literal('Alice'), gender: v.literal('Female'), voiceId: v.literal('SAz9YHcvj6GT2YYXdXww'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/premade/voices/SAz9YHcvj6GT2YYXdXww/e6c95f0b-2227-491a-b3d7-2249240decb7.mp3'), }),
  v.object({ name: v.literal('Matilda'), gender: v.literal('Female'), voiceId: v.literal('SOYHLrjzK2X1ezoPC6cr'), previewUrl: v.literal('https://storage.googleapis.com/eleven-public-prod/premade/voices/SOYHLrjzK2X1ezoPC6cr/86d178f6-f4b6-4e0e-85be-3de19f490794.mp3'), }),
)

export const styleValidator = v.union(
  v.literal('Pixar 3D'),
  v.literal('Cinematic'),
  v.literal('Ghibli'),
  v.literal('Anime'),
  v.literal('Cyberpunk'),
  v.literal('Watercolor'),
)

export const musicValidator = v.union(
  v.object({ title: v.literal('Beats'), previewUrl: v.literal('https://cdn.pixabay.com/audio/2025/11/11/audio_f2cf114879.mp3'), }),
  v.object({ title: v.literal('Future Bass'), previewUrl: v.literal('https://cdn.pixabay.com/audio/2024/11/08/audio_05b10daae7.mp3'), }),
  v.object({ title: v.literal('Upbeat'), previewUrl: v.literal('https://cdn.pixabay.com/audio/2025/11/07/audio_a9bc5df6b9.mp3'), }),
  v.object({ title: v.literal('Chill'), previewUrl: v.literal('https://cdn.pixabay.com/audio/2025/10/23/audio_fc19d0fae0.mp3'), }),
  v.object({ title: v.literal('Electronic'), previewUrl: v.literal('https://cdn.pixabay.com/audio/2025/07/28/audio_944c8a9cde.mp3'), }),
  v.object({ title: v.literal('Chill Hip Hop'), previewUrl: v.literal('https://cdn.pixabay.com/audio/2025/07/01/audio_546ec56e2a.mp3'), }),
  v.object({ title: v.literal('Pop'), previewUrl: v.literal('https://cdn.pixabay.com/audio/2024/02/13/audio_851cb5db32.mp3'), }),
  v.object({ title: v.literal('Chill Electronic'), previewUrl: v.literal('https://cdn.pixabay.com/audio/2024/02/13/audio_38278d96ea.mp3'), }),
  v.object({ title: v.literal('Chill Pop'), previewUrl: v.literal('https://cdn.pixabay.com/audio/2024/02/02/audio_9c1cf8951d.mp3'), }),
  v.object({ title: v.literal('Future Beats'), previewUrl: v.literal('https://cdn.pixabay.com/audio/2024/01/25/audio_8698bda9da.mp3'), }),
  v.object({ title: v.literal('Chill Beats'), previewUrl: v.literal('https://cdn.pixabay.com/audio/2024/01/02/audio_c88a26ff39.mp3'), }),
)

// Video aspect ratios
export const aspectRatioValidator = v.union(
  v.literal('16:9'),
  v.literal('9:16'),
  v.literal('1:1'),
)

export const characterSchema = v.object({
  name: v.string(),
  imagePrompt: v.string(),
  imageStorageId: v.optional(v.id('_storage')),
  imageUrl: v.optional(v.string()),
})

export const wordSchema = v.object({
  text: v.string(),
  startMs: v.number(),
  endMs: v.number(),
})

export const angleSchema = v.object({
  index: v.number(),
  angleVideoPrompt: v.string(),
  angleVideoUrl: v.optional(v.string()),
})

export const sceneSchema = v.object({
  index: v.number(),
  imagePrompt: v.string(),
  videoPrompt: v.string(),
  charactersInTheScene: v.optional(v.array(v.string())),
  imageId: v.optional(v.id('_storage')),
  imageUrl: v.optional(v.string()),
  videoId: v.optional(v.id('_storage')),
  videoUrl: v.optional(v.string()),
  videoDurationInSeconds: v.optional(v.number()),

  angles: v.optional(v.array(angleSchema)),

  narration: v.optional(v.string()),

  words: v.optional(v.array(wordSchema)),

  audioId: v.optional(v.id('_storage')),
  audioUrl: v.optional(v.string()),
})

export const captionStyleSchema = v.object({
  text: v.string(),
  startTime: v.number(),
  endTime: v.number(),
})

export default defineSchema({
  users: defineTable({
    name: v.string(),
    credits: v.number(),
    subject: v.string(),
    polarCustomerId: v.string(),
    subscriptionProductId: v.optional(v.string()),
  }).index('by_subject', ['subject']),

  ads: defineTable({
    userId: v.id('users'),
    productId: v.id('_storage'),
    productUrl: v.string(),
    description: v.optional(v.string()),
    avatar: v.optional(v.string()),
    aspectRatio: v.optional(aspectRatioValidator),
    adImageStorageId: v.optional(v.id('_storage')),
    adImageUrl: v.optional(v.string()),
    adVideoStorageId: v.optional(v.id('_storage')),
    adVideoUrl: v.optional(v.string()),
  }).index('by_userId', ['userId']),

  suggestions: defineTable({
    userId: v.id('users'),
    fullName: v.string(),
    email: v.string(),
    subject: v.string(),
    content: v.string(),
    createdAt: v.number(),
  }).index('by_userId', ['userId'])
    .index('by_createdAt', ['createdAt']),

  promptVariations: defineTable({
    category: v.string(), // e.g., "randomAiStory", "scaryStay", etc.
    prompt: v.string(), // prompt variations
  }).index("by_category", ["category"]),
  orders: defineTable({
    userId: v.id('users'),
    orderId: v.string(),
  }).index('by_orderId', ['orderId']),

  videos: defineTable({
    userId: v.id('users'),

    prompt: v.string(),
    title: v.optional(v.string()),
    style: styleValidator,
    music: musicValidator,
    voice: voiceValidator,
    durationInSecs: v.number(), // Total video length in seconds
    aspectRatio: aspectRatioValidator,

    videoUrl: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),

    characters: v.array(characterSchema),
    scenes: v.array(sceneSchema),

    captionStyle: v.optional(captionStyleSchema),

    // Error handling
    error: v.optional(v.object({
      message: v.string(),
      step: v.string(),
      timestamp: v.number(),
    })),

    // Generation settings
    numberOfImagesPerPrompt: v.number(), // How many variations to generate
    generateMultipleAngles: v.boolean(), // Whether to create extra angles

    // Rendering settings
    renderId: v.optional(v.string()),
    bucketName: v.optional(v.string()),

    // Usage tracking
    creditsUsed: v.optional(v.number()),
    imagesGenerated: v.optional(v.number()),
    videosGenerated: v.optional(v.number()),
  })
    .index('by_userId', ['userId'])
})
