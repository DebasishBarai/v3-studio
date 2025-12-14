import { v } from "convex/values";
import { internal } from "../_generated/api";
import { action } from "../_generated/server";
import { workflow } from "..";

export const autoGenerateVideo = action({
  args: {
    videoId: v.id('videos'),
  },
  handler: async (ctx, args): Promise<any> => {
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

    // Get video
    const video = await ctx.runQuery(internal.video.video.getInternalVideo, {
      id: args.videoId,
      userId: user._id,
    });

    if (!video) {
      throw new Error("Video not found");
    }

    // calculate the total credits required
    let totalRequiredCredits = 0

    totalRequiredCredits += video.characters.reduce((sum: number, character: any) => {
      return !character.imageUrl ? sum + 5 : sum;
    }, 0);

    totalRequiredCredits += video.scenes.reduce((sum: number, scene: any) => {
      if (!scene.imageUrl) sum += 5;
      if (!scene.videoUrl) sum += 10;
      if (!scene.audioUrl) sum += 5;
      return sum;
    }, 0)

    if (user.credits < totalRequiredCredits) {
      throw new Error("Insufficient credits");
    }

    if (totalRequiredCredits === 0) {
      console.log('No credits required, All good!')
      return
    }

    try {
      // set autoGenerate to true
      await ctx.runMutation(internal.video.video.updateInternalVideo, {
        id: args.videoId,
        userId: user._id,
        update: {
          autoGenerate: true,
        },
      });

      console.log('triggering workflow')
      // 🚀 START WORKFLOW HERE
      const workflowId = await workflow.start(
        ctx,
        internal.video.autoGenerateWorkflow.autoGenerateVideoWorkflow,
        {
          videoId: args.videoId,
          userId: user._id,
        })

      console.log('workflowId:', workflowId)
      return workflowId

    } catch (error) {
      console.error(error);
      throw error;
    }
  }
})
