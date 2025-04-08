import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NotDiseasedPopup from "../components/notDiseasedPopUp";

const Upload = () => {
  const [image, setImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [isImageProcessed, setIsImageProcessed] = useState(false);
  const [showNotDiseasedPopup, setShowNotDiseasedPopup] = useState(false);
  const [answers, setAnswers] = useState({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
    q6: "",
  });

  const navigate = useNavigate();

  // Handle initial image file selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  // Handle image upload and validation
  const handleImageUpload = async (event) => {
    event.preventDefault();
    
    if (!image) {
      alert("Please select an image first.");
      return;
    }

    // Create FormData to send image file
    const formData = new FormData();
    formData.append('image', image);

    try {
      // Send image to Flask backend for processing
      const response = await fetch("http://localhost:5000/api/validate-image", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      console.log(data)
      // Check if image processing was successful
      if (data.result === true) {
        // Assuming the backend sends back a base64 encoded processed image
        setProcessedImage(data.processed_image);
        setIsImageProcessed(true);
      } else {
        // Handle invalid or unprocessable image
        // alert("Image could not be processed. Please try a different image.");
        setProcessedImage(data.processed_image);
        setIsImageProcessed(false);
        setShowNotDiseasedPopup(true);
      }
    } catch (error) {
      console.error("Error processing image:", error);
      alert("Error processing image. Please try again.");
    }
  };

  // Handle change for survey questions
  const handleChange = (event) => {
    const { name, value } = event.target;
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [name]: value,
    }));
  };

  // Handle final survey submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Create FormData for submission
    const formData = new FormData();
    formData.append('image', image);
    
    // Append each answer
    Object.keys(answers).forEach(key => {
      formData.append(key, answers[key]);
    });

    try {
      // Send data to Flask backend
      const response = await fetch("http://localhost:5000/api/survey", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      
      // Navigate to results page
      navigate("/results", { state: data });
    } catch (error) {
      console.error("Error submitting survey:", error);
      alert("Error submitting survey. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center mt-6 lg:mt-20">
      <h1 className="bg-gradient-to-r from-blue-500 to-blue-600 text-transparent bg-clip-text text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide">
        Canine Dermal Analyser
      </h1>
      <p className="mt-4 text-lg text-center text-white-500 max-w-4xl">
        Upload an image of your dog's skin lesion for assessment
      </p>

      {/* Image Upload Form - Only shown if no image is processed */}
      {!isImageProcessed && (
        <div className="mt-10 max-w-3xl w-full p-6">
          <form onSubmit={handleImageUpload} className="space-y-6 bg-dark rounded-lg shadow-lg border border-neutral-200 p-6">
            <div>
              <label className="block text-sm font-medium text-white-700">
                Upload Dog Skin Lesion Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 block w-full text-sm text-white-700 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-800 hover:text-gray-200 text-white py-3 px-6 rounded-md"
              >
                Process Image
              </button>
            </div>
          </form>
        </div>
      )}

      {showNotDiseasedPopup && (
        <NotDiseasedPopup 
          onClose={() => setShowNotDiseasedPopup(false)} 
        />
      )}

      {/* Processed Image Display - Only shown when image is processed */}
      {isImageProcessed && (
        <div className="mt-10 max-w-3xl w-full p-6">
          <div className="space-y-6 bg-dark rounded-lg shadow-lg border border-neutral-200 p-6">
            <h2 className="text-xl font-bold text-center text-white-700">
              Uploaded Image Analysis
            </h2>
            <div className="flex justify-center">
              <img 
                src={`data:image/jpeg;base64,${processedImage}`} 
                alt="Processed Skin Lesion" 
                className="max-w-full rounded-lg shadow-lg"
              />
            </div>

            {/* Survey Form */}
            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-6"
            >
              {[
                {
                  question: "Does your dog experience extreme itchiness, especially around the ears, chest, belly, or hind legs?",
                  name: "q1",
                },
                {
                  question: "Do you notice circular or ring-like areas of hair loss on your dog's skin?",
                  name: "q2",
                },
                {
                  question: "Do you see thick yellow crusts or oily, greasy skin in the affected area?",
                  name: "q3",
                },
                {
                  question: "Does your dog have rough, brittle claws or changes in the appearance of its coat?",
                  name: "q4",
                },
                {
                  question: "Does the affected region seem to be smelling musty or odd to you?",
                  name: "q5",
                },
                {
                  question: "Are there any lesions that resemble a red ring in general?",
                  name: "q6",
                },
              ].map(({ question, name }) => (
                <div key={name} className="mb-6">
                  <p className="text-sm font-medium text-white-700">{question}</p>
                  <div className="flex flex-col space-y-2">
                    {["1", "0.5", "0"].map((value) => (
                      <label key={value} className="inline-flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name={name}
                          value={value}
                          checked={answers[name] === value}
                          onChange={handleChange}
                          required
                          className="form-radio h-4 w-4 text-blue-500 cursor-pointer"
                        />
                        <span className="ml-2">
                          {value === "1" ? "A Lot" : value === "0.5" ? "A Little" : "Not at all"}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex justify-center space-x-6">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-800 hover:text-gray-200 text-white py-3 px-6 rounded-md"
                >
                  Submit Survey
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;