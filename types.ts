export interface StyleConfig {
  id: string;
  title: string;
  description: string;
  prompt: string;
}

export interface GeneratedImage {
  id: string;
  styleId: string;
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

export type GenerationStatus = 'idle' | 'processing' | 'completed';
