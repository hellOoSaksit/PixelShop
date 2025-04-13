import { useEffect } from 'react';

interface SuccessPopupProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function SuccessPopup({ message, onClose, duration = 3000 }: SuccessPopupProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
        <div className="flex items-center justify-center mb-4">
          <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-gray-200 text-center">{message}</p>
      </div>
    </div>
  );
} 