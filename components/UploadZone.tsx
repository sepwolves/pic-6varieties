import React, { useCallback } from 'react';

interface UploadZoneProps {
  onImageSelected: (base64: string) => void;
  disabled?: boolean;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onImageSelected, disabled }) => {
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        onImageSelected(result);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageSelected]);

  return (
    <div className="w-full max-w-2xl mx-auto mb-10">
      <label 
        className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-300
        ${disabled 
          ? 'border-gray-700 bg-gray-900 cursor-not-allowed opacity-50' 
          : 'border-purple-500 bg-gray-900/50 hover:bg-gray-800 hover:border-purple-400'}`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg className="w-10 h-10 mb-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
          <p className="mb-2 text-sm text-gray-300"><span className="font-semibold text-white">Click to upload</span> or drag and drop</p>
          <p className="text-xs text-gray-400">Portrait photo (JPG, PNG)</p>
        </div>
        <input 
          type="file" 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange} 
          disabled={disabled}
        />
      </label>
    </div>
  );
};

export default UploadZone;
