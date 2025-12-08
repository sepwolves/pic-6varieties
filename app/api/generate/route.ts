import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const { base64Image, prompt } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Server configuration error: No API Key' }, { status: 500 });
    }
    const ai = new GoogleGenAI({ apiKey });
    const matches = String(base64Image).match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    let mimeType = 'image/jpeg';
    let cleanBase64 = String(base64Image);
    if (matches && matches.length === 3) {
      mimeType = matches[1];
      cleanBase64 = matches[2];
    } else {
      cleanBase64 = String(base64Image).replace(/^data:image\/\w+;base64,/, '');
    }
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt + ' \nImportant: Maintain the exact facial features, expression, and identity of the person in the provided reference image. Generate a high-quality, photorealistic image.' },
            { inlineData: { mimeType, data: cleanBase64 } }
          ]
        }
      ]
    });
    const candidates = (response as any)?.candidates;
    if (candidates?.[0]?.content?.parts) {
      for (const part of candidates[0].content.parts) {
        if ((part as any).inlineData?.data) {
          return NextResponse.json({ imageUrl: `data:image/png;base64,${(part as any).inlineData.data}` });
        }
      }
    }
    return NextResponse.json({ error: 'No image data found' }, { status: 500 });
  } catch (error: any) {
    const status = (error?.status ?? error?.code ?? 500);
    const message = (error?.message ?? 'Generation failed');
    const details = (error?.details ?? error?.error ?? undefined);
    return NextResponse.json({ error: message, status, details }, { status: 500 });
  }
}
