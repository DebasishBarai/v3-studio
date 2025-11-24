'use node'

import { validateWebhookSignature } from '@remotion/lambda/client';
import { internalAction } from './_generated/server';
import { v } from 'convex/values';

export const internalValidateRemotionWebhookSignature = internalAction({
  args: {
    body: v.any(),
    signatureHeader: v.string(),
  },
  handler: async (ctx, args) => {
    console.log({ body: args.body, signatureHeader: args.signatureHeader, secret: process.env.REMOTION_WEBHOOK_SECRET })
    console.log({ bodyType: typeof args.body, signatureHeaderType: typeof args.signatureHeader, secretType: typeof process.env.REMOTION_WEBHOOK_SECRET })
    try {
      validateWebhookSignature({
        body: args.body,
        signatureHeader: args.signatureHeader,
        secret: process.env.REMOTION_WEBHOOK_SECRET!,
      });
      return true
    } catch (error) {
      console.error('Error validating Remotion webhook signature:', error);
      return false;
    }
  }
})
