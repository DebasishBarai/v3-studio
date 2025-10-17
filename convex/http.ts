import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/polar/events",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      console.log("Received event", body);

      if (body.type === "order.paid") {
        const { data } = body

        const { id, paid, billing_reason, product, customer } = data

        if (!paid) {
          return new Response("Webhook Received", { status: 200 });
        }

        const subject = customer.external_id

        // get the user
        const user = await ctx.runQuery(internal.user.getInternalUser, {
          subject: subject,
        });

        if (!user) {
          throw new Error("User not found");
        }

        const order = await ctx.runQuery(internal.order.getInternalOrder, {
          orderId: id,
        });

        if (order) {
          throw new Error("Order already exists");
        }

        if (billing_reason === "purchase") {
          // add credits to the user
          if (product.id === process.env.NEXT_PUBLIC_CREDITS_50_PRODUCT_ID || product.id === process.env.NEXT_PUBLIC_CREDITS_100_PRODUCT_ID || product.id === process.env.NEXT_PUBLIC_CREDITS_150_PRODUCT_ID || product.id === process.env.NEXT_PUBLIC_CREDITS_250_PRODUCT_ID) {
            const credits = getCredits(product.id)
            await ctx.runMutation(internal.user.increaseInternalCredits, {
              subject: subject,
              amount: credits,
            });

            await ctx.runMutation(internal.order.addInternalOrder, {
              userId: user._id,
              orderId: id,
            })

            return new Response("Webhook processed", { status: 200 });
          }

        }

        // [TODO] billing_reason === "subscription_create" || "subscription_cycle" || "subscription_update" logic
        if (billing_reason === "subscription_create" || billing_reason === "subscription_cycle") {
          if (product.id === process.env.NEXT_PUBLIC_STARTER_PLAN_PRODUCT_ID || process.env.NEXT_PUBLIC_CREATOR_PLAN_PRODUCT_ID || process.env.NEXT_PUBLIC_PRO_PLAN_PRODUCT_ID) {
            const credits = getCredits(product.id)
            await ctx.runMutation(internal.user.updateInternalUser, {
              subject: subject,
              update: {
                credits: user.credits + credits,
                subscriptionProductId: product.id,
              }
            })

            await ctx.runMutation(internal.order.addInternalOrder, {
              userId: user._id,
              orderId: id,
            })

            return new Response("Webhook processed", { status: 200 });
          }
        }

        if (billing_reason === "subscription_update") {
          if (product.id === process.env.NEXT_PUBLIC_STARTER_PLAN_PRODUCT_ID || process.env.NEXT_PUBLIC_CREATOR_PLAN_PRODUCT_ID || process.env.NEXT_PUBLIC_PRO_PLAN_PRODUCT_ID) {
            const oldSubscriptionProductId = user.subscriptionProductId

            if (!oldSubscriptionProductId) {
              throw new Error("Old subscription product not found");
            }

            const oldSubscriptionCredits = getCredits(oldSubscriptionProductId)

            const newSubscriptionCredits = getCredits(product.id)

            const credits = Math.max(0, user.credits + newSubscriptionCredits - oldSubscriptionCredits)

            await ctx.runMutation(internal.user.updateInternalUser, {
              subject: subject,
              update: {
                credits: credits,
                subscriptionProductId: product.id,
              }
            })

            await ctx.runMutation(internal.order.addInternalOrder, {
              userId: user._id,
              orderId: id,
            })
          }

          return new Response("Webhook processed", { status: 200 });

        }

      }

      return new Response("Webhook Received", { status: 200 });
    } catch (error) {
      return new Response("Error occurred", { status: 500 })
    }
  }),
});

const getCredits = (productId: string) => {
  if (productId === process.env.NEXT_PUBLIC_CREDITS_50_PRODUCT_ID) {
    return 50;
  }

  if (productId === process.env.NEXT_PUBLIC_CREDITS_100_PRODUCT_ID) {
    return 120;
  }

  if (productId === process.env.NEXT_PUBLIC_CREDITS_150_PRODUCT_ID) {
    return 200;
  }

  if (productId === process.env.NEXT_PUBLIC_CREDITS_250_PRODUCT_ID) {
    return 350;
  }

  if (productId === process.env.NEXT_PUBLIC_STARTER_PLAN_PRODUCT_ID) {
    return 400;
  }

  if (productId === process.env.NEXT_PUBLIC_CREATOR_PLAN_PRODUCT_ID) {
    return 1200;
  }

  if (productId === process.env.NEXT_PUBLIC_PRO_PLAN_PRODUCT_ID) {
    return 2400;
  }

  return 0;
}

export default http;
