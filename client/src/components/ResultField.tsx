import React from 'react';
import { Clipboard } from 'lucide-react';

const ResultField: React.FC<{ label: string; value: string }> = ({ label, value }) => {

    const handleCopyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="flex">
                <div className="flex-1 p-2 bg-gray-50 rounded-l-lg border border-r-0 border-gray-200 break-words min-h-[40px]">
                    <span className="text-sm sm:text-base">{value || 'Not detected'}</span>
                </div>
                <button
                    onClick={() => handleCopyToClipboard(value)}
                    className="px-3 bg-white border border-gray-200 rounded-r-lg hover:bg-gray-50 flex items-center justify-center"
                    title="Copy to clipboard"
                >
                    <Clipboard className="h-4 w-4 text-gray-500" />
                    <span className="ml-2 text-sm text-gray-500 sm:hidden">Copy</span>
                </button>
            </div>
        </div>
    );
}

export default ResultField;