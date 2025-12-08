export const generatePortrait = async (
  base64Image: string,
  prompt: string
): Promise<string> => {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ base64Image, prompt })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed');
  }
  const data = await res.json();
  return data.imageUrl as string;
};
