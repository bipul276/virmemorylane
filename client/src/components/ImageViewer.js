// src/components/ImageViewer.js
import React, { useState } from "react";
import axios from "axios";

const ImageViewer = ({ memory }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [favMessage, setFavMessage] = useState("");

  if (!memory)
    return <p className="text-center text-gray-600">Please fetch an image.</p>;

  const handleAddFavorite = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to log in to add favorites.");
      return;
    }
    try {
      const favoriteData = {
        // Format the location as a string, e.g., "37.7749, -122.4194"
        location: `${memory.location.lat}, ${memory.location.lng}`,
        imageUrl: memory.mostRelatedImage,
      };
      await axios.post("http://localhost:5000/api/favorites", favoriteData, {
        headers: { Authorization: token },
      });
      setFavMessage("Added to favorites!");
    } catch (err) {
      console.error(err);
      setFavMessage("Error adding to favorites.");
    }
  };

  return (
    <div className="mt-8 text-center relative">
      <h3 className="text-2xl font-semibold mb-4">Historical Image</h3>
      <div className="relative inline-block">
        <img
          src={memory.mostRelatedImage}
          alt="Historical"
          className="mx-auto border-2 border-gray-300 rounded-lg shadow-lg cursor-pointer transition-transform hover:scale-105"
          onClick={() => setShowDetails(!showDetails)}
        />
        {/* Favorite icon */}
        <button
          onClick={handleAddFavorite}
          className="absolute top-2 right-2 bg-white p-2 rounded-full shadow hover:bg-gray-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-red-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
      </div>
      {favMessage && <p className="mt-2 text-green-600">{favMessage}</p>}
      {showDetails && (
        <div className="mt-6 text-left max-w-2xl mx-auto bg-white p-4 rounded shadow">
          <h4 className="text-xl font-medium mt-2">Transformation Details</h4>
          <p className="text-gray-700">{memory.transformationDetails}</p>
          <h4 className="text-xl font-medium mt-4">Additional Information</h4>
          <p className="text-gray-700">{memory.info}</p>
        </div>
      )}
    </div>
  );
};

export default ImageViewer;
