import { GoogleGenAI, Modality } from "@google/genai"

const genai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function generateAdsImageWithNanoBanana({

  base64Image,
  description,
  size,
  base64Avatar = ''
}: {
  base64Image: string;
  description?: string;
  size?: string;
  base64Avatar?: string;
}) {
  // Direct prompts for image generation
  const PROMPT = `Create a vibrant product showcase image featuring the uploaded product
  in the center, surrounded by dynamic splashes of liquid or relevant material that complement the product.
  Use a clean, colorful background to make the product stand out. Include subtle elements related to the product's flavor,
  ingredients, or theme floating around to add context and visual interest. 
  Ensure the product is sharp and in focus, with motion and energy conveyed through the splash effects.`;

  const AVATAR_PROMPT = `Create a professional product showcase image 
  featuring a person naturally holding the product in their hands. Make 
  the product the clear focal point of the scene. 
  Use a clean, colorful background that highlights the product.
  Include subtle floating elements related to the product's flavor, 
  ingredients, or theme for added context, if relevant. Ensure both the person and product are sharp, well-lit, and in focus, 
  conveying a polished and professional look.`;

  try {

    // Create the final prompt with description if provided
    let finalPrompt = base64Avatar !== '' ? AVATAR_PROMPT : PROMPT;
    if (description) {
      finalPrompt += ` Additional context: ${description}`;
    }

    if (size) {
      finalPrompt += ` Resolution: ${size}`;
    }
    const prompt = base64Avatar !== '' ? [
      { text: `${finalPrompt}` },
      {
        inlineData: {
          mimeType: "image/png",
          data: base64Image,
        },
      },
      {
        inlineData: {
          mimeType: "image/png",
          data: base64Avatar,
        },
      },

    ] : [
      { text: `${finalPrompt}` },
      {
        inlineData: {
          mimeType: "image/png",
          data: base64Image,
        },
      },
    ];

    const response = await genai.models.generateContent({
      model: "gemini-2.5-flash-image-preview",
      contents: prompt,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    // Check if response has candidates
    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("No candidates returned in response");
    }

    // Find and return the first (and only) generated image
    for (const part of response.candidates[0].content?.parts || []) {
      if (part.inlineData) {
        return {
          data: part.inlineData.data,
          mimeType: part.inlineData.mimeType,
        };
      }
    }

    throw new Error("No image generated in response");

  } catch (error) {
    console.error('generateAdsImageWithNanoBanana error:', error);
    throw error;
  }
}
