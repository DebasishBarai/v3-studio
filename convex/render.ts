'use node'

import { v } from "convex/values";
import { internal } from "./_generated/api";
import { action } from "./_generated/server";

import { renderMediaOnLambda } from '@remotion/lambda/client';

export const renderVideo = action({
  args: {
    videoId: v.id('videos'),
  },
  handler: async (ctx, args) => {
    console.log('render video');

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

    //get video
    const video = await ctx.runQuery(internal.video.video.getInternalVideo, {
      id: args.videoId,
      userId: user._id,
    });

    console.log({ video })

    if (!video) {
      throw new Error("Video not found");
    }

    if (video.videoUrl) {
      throw new Error("Video already rendered");
    }

    if (video.renderId) {
      throw new Error("Video rendering in progress");
    }

    // [TODO] Render video

    console.log(`rendering video: ${args.videoId}`)

    const { renderId, bucketName } = await renderMediaOnLambda({
      region: 'ap-south-1',
      functionName: process.env.REMOTION_FUNCTION_NAME || '',
      serveUrl: process.env.REMOTION_SERVE_URL || '',
      composition: 'my-video',
      inputProps: {
        video: video,
        isSubscribed: !!user?.subscriptionProductId,
      },
      codec: 'h264',
      imageFormat: 'jpeg',
      maxRetries: 1,
      framesPerLambda: 20,
      privacy: 'public',
      webhook: {
        url: `${process.env.REMOTION_WEBHOOK_URL}`,
        secret: process.env.REMOTION_WEBHOOK_SECRET || '',
        customData: {
          videoId: args.videoId,
          userId: user._id,
        }
      }
    });

    // update video
    await ctx.runMutation(internal.video.video.updateInternalVideo, {
      id: args.videoId,
      userId: user._id,
      update: {
        renderId: renderId,
        bucketName: bucketName,
      }
    })

    // update credits
    await ctx.runMutation(internal.user.decreaseInternalCredits, {
      subject: identity.subject,
      amount: 5,
    });

  }
})
