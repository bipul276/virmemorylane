import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; // Corrected import
import axios from "axios";

const ImageViewer = ({ memory }) => {
  const [favMessage, setFavMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.userId) setIsLoggedIn(true);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  if (!memory)
    return <p className="text-center text-gray-600">No image to display.</p>;

  return (
    <div className="text-center relative">
      <Link to={`/memory/${memory._id}`}>
        <img
          src={
            memory.mostRelatedImage.startsWith("uploads/")
              ? `http://localhost:5000/${memory.mostRelatedImage}`
              : memory.mostRelatedImage
          }
          alt="Historical"
          className="mx-auto max-w-full h-auto border-2 border-gray-300 rounded-lg shadow-lg cursor-pointer transition-transform hover:scale-105"
        />
      </Link>
      {isLoggedIn && (
        <button
          onClick={async () => {
            const token = localStorage.getItem("token");
            if (!token) {
              alert("You need to log in to add favorites.");
              return;
            }
            try {
              const favoriteData = {
                location: `${memory.location.lat}, ${memory.location.lng}`,
                imageUrl: memory.mostRelatedImage,
              };
              await axios.post("http://localhost:5000/api/favorites", favoriteData, {
                headers: { Authorization: `Bearer ${token}` },
              });
              setFavMessage("Added to favorites!");
            } catch (err) {
              console.error(err);
              setFavMessage("Error adding to favorites.");
            }
          }}
          className="absolute top-2 right-2 bg-white p-2 rounded-full shadow hover:bg-gray-200 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-red-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
                2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09
                C13.09 3.81 14.76 3 16.5 3
                19.58 3 22 5.42 22 8.5
                c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
      )}
      {favMessage && <p className="mt-2 text-green-600">{favMessage}</p>}
    </div>
  );
};

export default ImageViewer;
