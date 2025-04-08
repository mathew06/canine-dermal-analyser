import React from "react";
import { X } from "lucide-react";

const NotDiseasedPopup = ({ onClose }) => {
    return (
      <div className="fixed inset-0 bg-black backdrop-blur-md bg-opacity-70 flex items-center justify-center z-50">
        <div className="bg-dark rounded-lg shadow-xl p-6 max-w-md w-full relative">
          <button 
            onClick={onClose} 
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold text-blue-600 mb-4">Good News!</h2>
            <p className="text-white-700 text-lg mb-4">
              Based on our analysis, your dog does not show signs of skin disease.
            </p>
            <p className="mt-4 text-md text-white-500">
              However, regular vet check-ups are always recommended for your pet's health.
            </p>
          </div>
        </div>
      </div>
    );
  };

export default NotDiseasedPopup