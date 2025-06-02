import React, { useState } from 'react';
import AadhaarUploadForm from '../components/AadhaarUploadForm';
import { Plus } from 'lucide-react';
import ResultField from '../components/ResultField';

interface OcrResult {
  aadhaarNumber: string;
  name: string;
  dob: string;
  gender: string;
  address: string;
  pincode: string;
}

const HomePage: React.FC = () => {
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);
  const [isExtracted, setIsExtracted] = useState(false);

  const handleOcrComplete = (result: OcrResult) => {
    setOcrResult(result);
    setIsExtracted(true);
  };

  const handleReset = () => {
    setOcrResult(null);
    setIsExtracted(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-6 sm:py-12">
        <header className="text-center mb-8 sm:mb-16">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-indigo-900 mb-4">
            Aadhaar OCR
          </h1>
          <div className="space-y-2 max-w-2xl mx-auto px-2">
            <p className="text-sm md:text-lg text-slate-600">
              Upload your Aadhaar card to instantly extract information. Fast and secure.
            </p>
          </div>
          
          <div className="mt-6 sm:mt-8 flex flex-wrap gap-2 sm:gap-4 justify-center text-xs sm:text-sm">
            <div className="flex items-center bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-sm">
              <span className="text-indigo-600">✨</span>
              <span className="ml-2">Instant Processing</span>
            </div>
            <div className="flex items-center bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-sm">
              <span className="text-indigo-600">🔒</span>
              <span className="ml-2">100% Secure</span>
            </div>
            <div className="flex items-center bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-sm">
              <span className="text-indigo-600">🎯</span>
              <span className="ml-2">High Accuracy</span>
            </div>
          </div>
        </header>
        
        <main className="max-w-4xl mx-auto">
          {!isExtracted ? (
            <div className="transition-all duration-300">
              <AadhaarUploadForm onOcrComplete={handleOcrComplete} />
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-800">Extracted Information</h2>
                <button
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 px-2 lg:px-4 lg:py-2 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                  Upload New Card
                </button>
              </div>
              <div className="space-y-2">
                <ResultField label="Aadhaar Number" value={ocrResult?.aadhaarNumber || ''} />
                <ResultField label="Name" value={ocrResult?.name || ''} />
                <ResultField label="Date of Birth" value={ocrResult?.dob || ''} />
                <ResultField label="Gender" value={ocrResult?.gender || ''} />
                <ResultField label="Address" value={ocrResult?.address || ''} />
                <ResultField label="Pincode" value={ocrResult?.pincode || ''} />
              </div>
            </div>
          )}
        </main>
        
        <footer className="mt-12 sm:mt-20 text-center space-y-4">
          <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-sm">
            <p className="text-sm sm:text-base text-slate-600">
              Your privacy matters. All processing is done locally and we never store your Aadhaar images.
            </p>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">© {new Date().getFullYear()} Aadhaar OCR. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;