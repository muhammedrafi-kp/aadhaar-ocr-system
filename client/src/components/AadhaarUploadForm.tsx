import React, { useState } from 'react';
import ImageUploader from './ImageUploader';
import { Upload } from 'lucide-react';
import axios from 'axios';

interface AadhaarImages {
  front: File | null;
  back: File | null;
}

interface OcrResult {
  aadhaarNumber: string;
  name: string;
  dob: string;
  gender: string;
  address: string;
  pincode: string;
}

interface AadhaarUploadFormProps {
  onOcrComplete: (result: OcrResult) => void;
}

const AadhaarUploadForm: React.FC<AadhaarUploadFormProps> = ({ onOcrComplete }) => {
  const [aadhaarImages, setAadhaarImages] = useState<AadhaarImages>({
    front: null,
    back: null,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleImageChange = (side: 'front' | 'back', file: File | null) => {
    setAadhaarImages(prev => ({
      ...prev,
      [side]: file
    }));
    
    // Reset status when new images are selected
    setUploadStatus('idle');
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate images
    if (!aadhaarImages.front || !aadhaarImages.back) {
        console.log("aadhaarImages:",aadhaarImages.front,aadhaarImages.back);
      setUploadStatus('error');
      setErrorMessage('Please upload both front and back images of your Aadhaar card.');
      return;
    }

    console.log("aadhaarImages:",aadhaarImages);
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('front', aadhaarImages.front);
      formData.append('back', aadhaarImages.back);

      const response = await axios.post('http://localhost:3000/api/v1/aadhaar/extract', formData);

      console.log("response:",response);

      if(response.data.success){
        onOcrComplete(response.data.aadhaarData);
      }else{
        setUploadStatus('error');
        setErrorMessage(response.data.message);
    }
      
      // onOcrComplete(mockOcrResult);
      setUploadStatus('success');
    } catch (error:any) {
      setUploadStatus('error');
      setErrorMessage(`${error.response.data.message}, Please upload a clearer front and back image for better accuracy.`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-4 sm:p-8 transition-all duration-300 hover:shadow-xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
            <span className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-indigo-100 text-indigo-600 mr-2 text-xs sm:text-sm">1</span>
            Front Side
          </h2>
          <ImageUploader
            image={aadhaarImages.front}
            onChange={(file) => handleImageChange('front', file)}
            disabled={isUploading}
            placeholderText="Drop your Aadhaar front side here"
          />
          {!aadhaarImages.front && (
            <p className="text-xs sm:text-sm text-slate-500 italic">
              "Upload a clear photo of your Aadhaar card's front side"
            </p>
          )}
        </div>
        
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
            <span className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-indigo-100 text-indigo-600 mr-2 text-xs sm:text-sm">2</span>
            Back Side
          </h2>
          <ImageUploader
            image={aadhaarImages.back}
            onChange={(file) => handleImageChange('back', file)}
            disabled={isUploading}
            placeholderText="Drop your Aadhaar back side here"
          />
          {!aadhaarImages.back && (
            <p className="text-xs sm:text-sm text-slate-500 italic">
              "Upload a clear photo of your Aadhaar card's back side"
            </p>
          )}
        </div>
      </div>
      
      {uploadStatus === 'error' && (
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center text-red-600 text-sm sm:text-base">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
            </svg>
            {errorMessage || 'Something went wrong. Please try again.'}
          </div>
        </div>
      )}
      
      {uploadStatus === 'success' && (
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center text-green-600 text-sm sm:text-base">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            Great! Your images are being processed. We'll extract the information shortly.
          </div>
        </div>
      )}
      
      <div className="mt-6 sm:mt-8 flex justify-center">
        <button
          type="submit"
          disabled={isUploading || (!aadhaarImages.front && !aadhaarImages.back)}
          className={`
            w-full sm:w-auto flex items-center justify-center px-4 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium text-white text-sm sm:text-base
            transition-all duration-300 transform
            ${isUploading || (!aadhaarImages.front && !aadhaarImages.back)
              ? 'bg-indigo-300 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 hover:shadow-lg'}
          `}
        >
          {isUploading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing your card...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Start Processing
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default AadhaarUploadForm;