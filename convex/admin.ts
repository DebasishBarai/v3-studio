import { v } from "convex/values";
import { action, internalQuery, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";


// Internal mutation to get users with missing emails
export const getAllUsers = internalQuery({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db
      .query('users')
      .collect();

    return users;
  },
});

// Internal mutation to get users with missing emails
export const getUsersWithMissingEmails = internalMutation({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db
      .query('users')
      .collect();

    // Filter users where email is null, undefined, or empty string
    const usersWithMissingEmails = users.filter(user =>
      !user.email || user.email.trim() === ''
    );

    return usersWithMissingEmails.map(user => ({
      _id: user._id,
      subject: user.subject,
    }));
  }
});

// Internal mutation to update a user's email
export const updateUserEmail = internalMutation({
  args: {
    userId: v.id('users'),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      email: args.email,
    });
  }
});

// Action to backfill emails from Clerk for users missing email data
export const backfillUserEmailsFromClerk = action({
  args: {},
  handler: async (ctx) => {
    // Get all users with missing emails
    const usersWithMissingEmails = await ctx.runMutation(
      internal.admin.getUsersWithMissingEmails,
    );

    let updatedCount = 0;
    const errors: Array<{ subject: string; error: string }> = [];

    console.log(`Found ${usersWithMissingEmails.length} users with missing emails`);

    for (const user of usersWithMissingEmails) {
      try {
        // Clerk user IDs are stored in the 'subject' field
        const clerkUserId = user.subject;

        // Fetch user data from Clerk's Backend API
        const clerkResponse = await fetch(
          `https://api.clerk.com/v1/users/${clerkUserId}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!clerkResponse.ok) {
          throw new Error(`Failed to fetch Clerk user: ${clerkResponse.statusText}`);
        }

        const clerkUser = await clerkResponse.json();

        // Clerk stores email in email_addresses array
        const primaryEmail = clerkUser.email_addresses?.find(
          (email: any) => email.id === clerkUser.primary_email_address_id
        )?.email_address;

        if (primaryEmail) {
          // Update the user's email
          await ctx.runMutation(internal.admin.updateUserEmail, {
            userId: user._id,
            email: primaryEmail,
          });

          updatedCount++;
          console.log(`Updated email for user ${user.subject}: ${primaryEmail}`);
        } else {
          console.log(`No primary email found in Clerk for user ${user.subject}`);
        }

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push({
          subject: user.subject,
          error: errorMessage,
        });
        console.error(`Error updating user ${user.subject}:`, errorMessage);
      }
    }

    return {
      totalUsersChecked: usersWithMissingEmails.length,
      updatedCount,
      errors,
      success: errors.length === 0,
    };
  }
});
