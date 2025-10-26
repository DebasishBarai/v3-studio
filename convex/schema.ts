import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const voiceValidator = v.union(
  v.object({ name: v.literal('Alloy'), gender: v.literal('Female') }),
  v.object({ name: v.literal('Nova'), gender: v.literal('Female') }),
  v.object({ name: v.literal('Onyx'), gender: v.literal('Male') }),
  v.object({ name: v.literal('Sage'), gender: v.literal('Female') }),
  v.object({ name: v.literal('Shimmer'), gender: v.literal('Female') }),
  v.object({ name: v.literal('Verse'), gender: v.literal('Male') }),
  v.object({ name: v.literal('Ballad'), gender: v.literal('Male') }),
  v.object({ name: v.literal('Coral'), gender: v.literal('Female') }),
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
  v.literal('Else - Paris'),
  v.literal('Für Elise'),
  v.literal('Prelude in E minor (Op. 28 n°4)'),
  v.literal('Eureka'),
  v.literal('Tension In The Air'),
  v.literal('Winter'),
  v.literal('Bladerunner 2049'),
  v.literal('Snowfall'),
  v.literal('Another love'),
  v.literal('String Arpeggios'),
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

export const angleSchema = v.object({
  index: v.number(),
  angleVideoPrompt: v.string(),
  angleVideoUrl: v.optional(v.string()),
})

export const sceneSchema = v.object({
  index: v.number(),
  imagePrompt: v.string(),
  imageUrl: v.optional(v.string()),
  videoUrl: v.optional(v.string()),

  angles: v.optional(v.array(angleSchema)),
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
    resolution: v.optional(v.string()),
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

    // Error handling
    error: v.optional(v.object({
      message: v.string(),
      step: v.string(),
      timestamp: v.number(),
    })),

    // Generation settings
    numberOfImagesPerPrompt: v.number(), // How many variations to generate
    generateMultipleAngles: v.boolean(), // Whether to create extra angles

    // Usage tracking
    creditsUsed: v.optional(v.number()),
    imagesGenerated: v.optional(v.number()),
    videosGenerated: v.optional(v.number()),
  })
})
