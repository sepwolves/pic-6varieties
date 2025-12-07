import React from 'react';
import { StyleConfig, GeneratedImage } from '../types';

interface ResultCardProps {
  styleConfig: StyleConfig;
  result: GeneratedImage;
}

const ResultCard: React.FC<ResultCardProps> = ({ styleConfig, result }) => {
  const handleDownload = () => {
    if (result.imageUrl) {
      const link = document.createElement('a');
      link.href = result.imageUrl;
      link.download = `portrait-${styleConfig.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-xl flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
        <h3 className="font-semibold text-white text-lg truncate" title={styleConfig.title}>
          {styleConfig.title}
        </h3>
        <p className="text-xs text-gray-400 mt-1 truncate">{styleConfig.description}</p>
      </div>

      {/* Image Area */}
      <div className="relative aspect-[3/4] w-full bg-gray-950 group">
        {result.imageUrl ? (
          <>
            <img 
              src={result.imageUrl} 
              alt={styleConfig.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
               <button 
                onClick={handleDownload}
                className="bg-white text-black px-6 py-2 rounded-full font-medium transform hover:scale-105 transition-transform flex items-center gap-2"
               >
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                 Download
               </button>
            </div>
          </>
        ) : result.isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3">
             <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
             <p className="text-xs text-purple-400 animate-pulse">Generating...</p>
          </div>
        ) : result.error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <svg className="w-8 h-8 text-red-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <p className="text-sm text-red-400">Failed to generate</p>
            <p className="text-xs text-gray-500 mt-1">{result.error}</p>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-700">
            <span className="text-sm">Waiting for upload...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultCard;
