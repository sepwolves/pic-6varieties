'use client';
import React, { useState } from 'react';
import UploadZone from '../components/UploadZone';
import ResultCard from '../components/ResultCard';
import { PHOTO_STYLES } from '../constants';
import { GeneratedImage } from '../types';
import { generatePortrait } from '../services/geminiService';

export default function Page() {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [results, setResults] = useState<GeneratedImage[]>(
    PHOTO_STYLES.map(style => ({
      id: style.id,
      styleId: style.id,
      imageUrl: null,
      isLoading: false,
      error: null
    }))
  );

  const handleImageSelect = async (base64: string) => {
    setSourceImage(base64);
    setResults(prevResults => prevResults.map(r => ({
      ...r,
      imageUrl: null,
      error: null,
      isLoading: true
    })));
    PHOTO_STYLES.forEach(style => {
      generateSingleStyle(base64, style.id, style.prompt);
    });
  };

  const generateSingleStyle = async (base64: string, styleId: string, prompt: string) => {
    try {
      const generatedImageUrl = await generatePortrait(base64, prompt);
      setResults(prev => prev.map(item => {
        if (item.styleId === styleId) {
          return { ...item, imageUrl: generatedImageUrl, isLoading: false };
        }
        return item;
      }));
    } catch (err: any) {
      setResults(prev => prev.map(item => {
        if (item.styleId === styleId) {
          return { ...item, error: err.message || 'Error', isLoading: false };
        }
        return item;
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 selection:bg-purple-500 selection:text-white">
      <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-lg shadow-lg shadow-purple-500/20"></div>
              <span className="font-bold text-xl tracking-tight text-white">AI Portrait Studio</span>
            </div>
            <div className="text-sm text-gray-500 hidden sm:block">Powered by Gemini</div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400 mb-6 tracking-tight">Professional Studio Photography</h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload a single portrait to generate 6 distinct professional styles.
            <br className="hidden md:block" />
            From corporate headshots to high-fashion editorials and fine art.
          </p>
          <div className="flex flex-col md:flex-row gap-8 items-start justify-center">
            {sourceImage && (
              <div className="w-full md:w-48 shrink-0 mx-auto md:mx-0">
                <div className="aspect-[3/4] rounded-xl overflow-hidden border-2 border-gray-700 relative group shadow-2xl">
                  <img src={sourceImage} alt="Source" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-mono text-white tracking-widest uppercase">Original</span>
                  </div>
                </div>
              </div>
            )}
            <div className="flex-grow w-full">
              <UploadZone onImageSelected={handleImageSelect} disabled={results.some(r => r.isLoading)} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {PHOTO_STYLES.map(style => {
            const result = results.find(r => r.styleId === style.id);
            if (!result) return null;
            return <ResultCard key={style.id} styleConfig={style} result={result} />;
          })}
        </div>
        <div className="mt-24 border-t border-gray-900 pt-8 text-center text-gray-600 text-sm">
          <p>Generates images using Google's Gemini 2.5 Flash Image model.</p>
          <p className="mt-2">© {new Date().getFullYear()} AI Portrait Studio</p>
        </div>
      </main>
    </div>
  );
}
