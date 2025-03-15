// src/pages/MemoryDetails.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const MemoryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [memory, setMemory] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMemory = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/memories/${id}`);
        setMemory(res.data);
      } catch (err) {
        console.error("Error fetching memory:", err);
        setError("Could not fetch memory details.");
      }
    };
    fetchMemory();
  }, [id]);

  // Build the absolute image URL
  let imageUrl = "https://via.placeholder.com/600x400?text=No+Image";
  if (memory && memory.mostRelatedImage) {
    // Check if it starts with "uploads/" or "/uploads/"
    if (
      memory.mostRelatedImage.startsWith("uploads/") ||
      memory.mostRelatedImage.startsWith("/uploads/")
    ) {
      // Remove any leading slash and prepend the backend URL
      const fixedPath = memory.mostRelatedImage.replace(/^\/?uploads\//, "uploads/");
      imageUrl = `http://localhost:5000/${fixedPath}`;
    } else {
      imageUrl = memory.mostRelatedImage;
    }
  }

  // Determine if there are details to show
  const hasDetails = memory && (memory.transformationDetails || memory.info);

  if (error) {
    return (
      <div className="pt-20 p-4 text-center text-red-500">{error}</div>
    );
  }
  if (!memory) {
    return (
      <div className="pt-20 p-4 text-center">Loading...</div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-100 p-4">
      {/* Back to Home Button */}
      <div className="mb-4">
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
        >
          &larr; Back to Home
        </button>
      </div>
      {hasDetails ? (
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300">
          <div className="flex flex-col">
            {/* Image section */}
            <div className="w-full h-1/2 md:h-96">
              <img
                src={imageUrl}
                alt="Memory Detail"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Details section */}
            <div className="p-6">
              <h2 className="text-3xl font-bold mb-4">Memory Details</h2>
              <p className="mb-2">
                <span className="font-semibold">Location:</span> {memory.location.lat}, {memory.location.lng}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Date Taken:</span> {new Date(memory.dateTaken).toLocaleDateString()}
              </p>
              {memory.transformationDetails && (
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-1">Transformation Details</h3>
                  <p className="text-gray-700">{memory.transformationDetails}</p>
                </div>
              )}
              {memory.info && (
                <div>
                  <h3 className="text-xl font-semibold mb-1">Additional Information</h3>
                  <p className="text-gray-700">{memory.info}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        // If no details, display image full screen.
        <div className="max-w-5xl mx-auto">
          <img
            src={imageUrl}
            alt="Memory Detail"
            className="w-full h-screen object-cover rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
};

export default MemoryDetails;
