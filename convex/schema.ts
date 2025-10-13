import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

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
});
