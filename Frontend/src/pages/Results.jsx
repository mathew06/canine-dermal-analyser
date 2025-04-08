import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import img from '../../../Backend/segmented_image.jpg'

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract data from location state
  const { 
    answer = '',
    model_prediction = {},
    output_image = '', 
    rw = 0, 
    ma = 0 
  } = location.state || {};

  // Handle back to home
  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center mt-10 px-4">
      <div className="w-full max-w-2xl bg-dark border border-neutral-200 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl mb-6 text-center bg-gradient-to-r from-blue-500 to-blue-600 text-transparent bg-clip-text">
          Diagnosis Result Analysis
        </h1>

        {/* Diagnosis Result */}
        <div className="mb-6">
          <h2 className="text-xl mb-4">Diagnosis</h2>
          <div className="bg-neutral-800 p-4 rounded-lg">
            <p className="text-lg">
              Condition: {answer}
            </p>
          </div>
        </div>

        {/* Model Prediction */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Model Prediction</h2>
          <div className="bg-neutral-800 p-4 rounded-lg">
            {Object.entries(model_prediction).map(([condition, confidence]) => (
              <p key={condition} className="text-lg">
                <strong>{condition}:</strong> {(confidence * 100).toFixed(2)}% Confidence
              </p>
            ))}
          </div>
        </div>

        {/* Weighted Scores */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Condition Scores</h2>
          <div className="bg-neutral-800 p-4 rounded-lg">
            <p className="text-lg">
              <strong>Ringworm Score:</strong> {rw.toFixed(2)}
            </p>
            <p className="text-lg">
              <strong>Mange Score:</strong> {ma.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Output Image */}
        {output_image && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Segmented Skin Lesion</h2>
            <div className="flex justify-center">
              <img 
                src={img}
                alt="Processed Skin Lesion" 
                className="max-w-full rounded-lg shadow-lg"
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <button
            onClick={handleBackToHome}
            className="bg-blue-600 hover:bg-blue-800 hover:text-gray-200 text-white py-3 px-6 rounded-md"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;