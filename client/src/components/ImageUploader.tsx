import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  image: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
  placeholderText?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  image,
  onChange,
  disabled = false,
  placeholderText = 'Upload Image'
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    processFile(file);
  };
  
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) e.dataTransfer.dropEffect = 'copy';
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (disabled) return;
    
    const file = e.dataTransfer.files?.[0] || null;
    processFile(file);
  };
  
  const processFile = (file: File | null) => {
    // Clear old preview URL to avoid memory leaks
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    
    if (file) {
      // Validate if it's an image
      if (!file.type.match('image.*')) {
        alert('Please upload an image file');
        return;
      }
      
      // Create preview
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
    
    onChange(file);
  };
  
  const handleClearImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
    onChange(null);
  };
  
  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={disabled}
      />
      
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-3 sm:p-4 transition-all duration-200
          min-h-[160px] sm:min-h-[200px] flex flex-col items-center justify-center cursor-pointer
          ${disabled ? 'bg-gray-100 border-gray-300 cursor-not-allowed' : 
            isDragging ? 'border-indigo-500 bg-indigo-50' : 
            previewUrl ? 'border-green-300 bg-white' : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 bg-white'}
        `}
      >
        {previewUrl ? (
          <div className="w-full h-full flex flex-col items-center">
            <div className="relative w-full overflow-hidden rounded-md" style={{ maxHeight: '140px', minHeight: '120px' }}>
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="mx-auto object-contain h-full w-auto"
              />
            </div>
            <p className="mt-2 text-xs sm:text-sm text-gray-500 truncate max-w-full">
              {image?.name}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-2 sm:mb-3 rounded-full bg-indigo-50 p-2 sm:p-3">
              <ImageIcon className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-500" />
            </div>
            <p className="text-sm sm:text-base font-medium text-gray-700">{placeholderText}</p>
            <p className="mt-1 text-xs sm:text-sm text-gray-500">Click or drag and drop</p>
            <p className="mt-1 text-xs text-gray-400">JPG, PNG, GIF up to 5MB</p>
          </>
        )}
      </div>
      
      {previewUrl && !disabled && (
        <button
          type="button"
          onClick={handleClearImage}
          className="absolute top-2 right-2 rounded-full bg-white p-1 shadow hover:bg-red-50 transition-colors group"
        >
          <X className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 group-hover:text-red-500" />
        </button>
      )}
    </div>
  );
};

export default ImageUploader;