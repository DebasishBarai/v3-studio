import { query } from "./_generated/server";

const client = new ElevenLabsClient({
  environment: "https://api.elevenlabs.io/",
});

// to be run by admin only
export const getVoicesFromElevenLabs = query({
  args: {},
  handler: async (ctx) => {
    const response = await client.voices.getAll({});

  }
})
