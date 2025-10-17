import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

export const addInternalOrder = internalMutation({
  args: {
    userId: v.id('users'),
    orderId: v.string(),
  },
  handler: async (ctx, args) => {

    const order = await ctx.db
      .insert('orders', {
        userId: args.userId,
        orderId: args.orderId,
      })
    return order
  }
})

export const getInternalOrder = internalQuery({
  args: {
    orderId: v.string(),
  },
  handler: async (ctx, args) => {

    const order = await ctx.db
      .query('orders')
      .withIndex('by_orderId', (q) => q.eq('orderId', args.orderId))
      .first();

    return order
  }
})
