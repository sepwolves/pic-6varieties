import { GoogleGenAI } from "@google/genai";

// Ensure API key is available
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY is missing in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key-for-build' });

/**
 * Generates an image based on a reference image and a prompt using Gemini Nano Banana.
 */
export const generatePortrait = async (
  base64Image: string,
  prompt: string
): Promise<string> => {
  try {
    // Model: gemini-2.5-flash-image (Nano Banana)
    
    // correctly extract the mime type and the data from the data URL
    const matches = base64Image.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    
    let mimeType = 'image/jpeg';
    let cleanBase64 = base64Image;

    if (matches && matches.length === 3) {
      mimeType = matches[1];
      cleanBase64 = matches[2];
    } else {
      // Fallback: try to strip header if regex didn't match standard format
      cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, '');
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt + " \nImportant: Maintain the exact facial features, expression, and identity of the person in the provided reference image. Generate a high-quality, photorealistic image."
          },
          {
            inlineData: {
              mimeType: mimeType, // Pass the correct detected mime type (e.g., image/png)
              data: cleanBase64
            }
          }
        ]
      },
      // Nano banana config rules:
      // - Do not set responseMimeType
      // - Do not set responseSchema
    });

    // Parse response for image data
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
           return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image data found in response");
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to generate image");
  }
};