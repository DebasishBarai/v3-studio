import { action } from "./_generated/server";
import { v } from "convex/values";
import { Resend } from "resend";
import { api, internal } from "./_generated/api";

const resend = new Resend(process.env.RESEND_API_KEY);

// Simple action to send to ALL users - trigger from dashboard
export const sendToAllUsers = action({
  args: {
    subject: v.string(),
    message: v.string(),
    fromName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const users = await ctx.runQuery(internal.admin.getAllUsers);

    const results = {
      total: 0,
      sent: 0,
      failed: 0,
      details: [] as any[],
    };

    for (const user of users) {
      if (user.email) {
        results.total++;

        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333;">${args.subject}</h2>
            <div style="color: #666; line-height: 1.6;">
              ${args.message}
            </div>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">
              Sent from V3 Studio
            </p>
          </div>
        `;

        try {
          const { data, error } = await resend.emails.send({
            from: `${args.fromName || "V3 Studio"} <no-reply@notify.v3-studio.com>`,
            to: user.email,
            subject: args.subject,
            html: html,
          });

          if (error) {
            results.failed++;
            results.details.push({
              email: user.email,
              status: "failed",
              error: error.message
            });
          } else {
            results.sent++;
            results.details.push({
              email: user.email,
              status: "sent",
              id: data?.id
            });
          }

          // Rate limit protection
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          results.failed++;
          results.details.push({
            email: user.email,
            status: "failed",
            error: String(error)
          });
        }
      }
    }

    return results;
  },
});

// Send to a specific email - for testing
export const sendTestEmail = action({
  args: {
    toEmail: v.string(),
    subject: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">${args.subject}</h2>
        <div style="color: #666; line-height: 1.6;">
          ${args.message}
        </div>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #999; font-size: 12px;">
          Test email from V3 Studio
        </p>
      </div>
    `;

    try {
      const { data, error } = await resend.emails.send({
        from: "V3 Studio <no-reply@notify.v3-studio.com>",
        to: args.toEmail,
        subject: args.subject,
        html: html,
      });

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        message: `Email sent to ${args.toEmail}`,
        id: data?.id
      };
    } catch (error) {
      return {
        success: false,
        error: String(error)
      };
    }
  },
});

// Get user count - helpful to check before sending
export const getUserCount = action({
  args: {},
  handler: async (ctx): Promise<{
    totalUsers: number;
    usersWithEmail: number;
    emails: (string | null | undefined)[];
  }> => {
    const users = await ctx.runQuery(internal.admin.getAllUsers);
    const usersWithEmail = users.filter(u => u.email);

    return {
      totalUsers: users.length,
      usersWithEmail: usersWithEmail.length,
      emails: usersWithEmail.map(u => u.email),
    };
  },
});
