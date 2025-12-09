import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Initialize Gemini SDK with server-side API Key
// process.env.API_KEY is available in Netlify environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server configuration error: API_KEY is missing." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { base64Image, prompt } = body;

    if (!base64Image || !prompt) {
      return NextResponse.json(
        { error: "Missing image or prompt." },
        { status: 400 }
      );
    }

    // --- Image Processing Logic (Moved from Client) ---
    // Correctly extract the mime type and the data from the data URL
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
    // --------------------------------------------------

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt + " \nImportant: Maintain the exact facial features, expression, and identity of the person in the provided reference image. Generate a high-quality, photorealistic image."
          },
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64
            }
          }
        ]
      },
    });

    // Parse response for image data
    let generatedImageBase64 = null;
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
           generatedImageBase64 = `data:image/png;base64,${part.inlineData.data}`;
           break;
        }
      }
    }

    if (!generatedImageBase64) {
      throw new Error("No image data found in Gemini response");
    }

    return NextResponse.json({ imageUrl: generatedImageBase64 });

  } catch (error: any) {
    console.error("Gemini API Error (Server):", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate image." },
      { status: 500 }
    );
  }
}