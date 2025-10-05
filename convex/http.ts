import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { Webhook } from "svix";
import type { WebhookEvent } from "@clerk/nextjs/server"

function ensureEnvironmentVariable(name: string): string {
  const value = process.env[name];
  if (value === undefined) {
    throw new Error(`missing environment variable ${name}`);
  }
  return value;
}

const webhookSecret = ensureEnvironmentVariable("CLERK_WEBHOOK_SECRET");

const handleClerkWebhook = httpAction(async (ctx, request) => {

  const payload = await request.text();

  const svix_id = request.headers.get("svix-id");
  const svix_timestamp = request.headers.get("svix-timestamp");
  const svix_signature = request.headers.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }


  const wh = new Webhook(webhookSecret);

  try {

    const event = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;

    if (!event) {
      console.log("invalid webhook");
      return new Response("Error occured", {
        status: 400,
      });
    }

    console.log({ event });

    const user = await ctx.runQuery(internal.user.getInternalUser, {
      // @ts-expect-error clerk webhooks return event.data.payer.user_id as string for subscriptionItems
      subject: event.data.payer.user_id as string,
    })

    if (!user) {
      console.log("user not found")
      return new Response("User not found", {
        status: 400,
      });
    }

    console.log({ user });

    switch (event.type) {
      case "subscriptionItem.active": {
        const plan = event.data.plan.slug as string

        let creditsToAdd = 0;
        switch (plan) {
          case "starter_pack":
            creditsToAdd = 400;
            break;
          case "creator_pack":
            creditsToAdd = 1200;
            break;
          case "pro_pack":
            creditsToAdd = 2400;
            break;
          default:
            console.log(`Unknown plan: ${plan}`);
            return new Response(null, { status: 200 });
        }

        // Add credits to user account
        await ctx.runMutation(internal.user.addInternalCredits, {
          subject: user.subject,
          credits: creditsToAdd,
        });

        console.log(`Added ${creditsToAdd} credits to user ${user._id} for plan ${plan}`);
        break;
      }
      default: {
        console.log("ignored Clerk webhook event", event.type);
      }
    }
    return new Response(null, {
      status: 200,
    });
  } catch (error) {
    console.log("error verifying webhook");
    console.error(error);
    return new Response("Error occured", {
      status: 400,
    });
  }
});

const http = httpRouter();
http.route({
  path: "/clerk-subscription-webhook",
  method: "POST",
  handler: handleClerkWebhook,
});

export default http;
