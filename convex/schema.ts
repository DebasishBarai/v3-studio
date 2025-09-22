import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    credits: v.number(),
    subject: v.string(),
  }).index('by_subject', ['subject']),
  ads: defineTable({
    userId: v.id('users'),
    productImage: v.string(),
    description: v.optional(v.string()),
    avatar: v.optional(v.string()),
    resolution: v.optional(v.string()),
    adImageStorageId: v.optional(v.id('_storage')),
    adVideoStorageId: v.optional(v.id('_storage')),
  }).index('by_userId', ['userId'])
});
