/**
 * Generates an image by calling the server-side Next.js API route.
 * This keeps the API Key hidden on the server.
 */
export const generatePortrait = async (
  base64Image: string,
  prompt: string
): Promise<string> => {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        base64Image,
        prompt
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data.imageUrl;
  } catch (error: any) {
    console.error("Generation Error:", error);
    throw new Error(error.message || "Failed to request image generation");
  }
};