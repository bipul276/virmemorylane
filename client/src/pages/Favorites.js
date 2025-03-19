// src/pages/Favorites.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You need to log in to view favorites.");
          return;
        }
        const res = await axios.get(`${API_BASE_URL}/api/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(res.data);
      } catch (err) {
        console.error("Error fetching favorites:", err);
        setError("Could not fetch favorites.");
      }
    };
    fetchFavorites();
  }, []);

  const handleDeleteFavorite = async (fav) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You need to log in to delete favorites.");
        return;
      }
      await axios.delete(`${API_BASE_URL}/api/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          location: fav.location,
          imageUrl: fav.imageUrl
        }
      });
      setFavorites(prev => prev.filter(item => !(item.location === fav.location && item.imageUrl === fav.imageUrl)));
    } catch (err) {
      console.error("Error deleting favorite:", err);
      setError("Could not delete favorite.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4">Favorites</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {favorites.length === 0 ? (
        <p>No favorites yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {favorites.map((fav, idx) => (
            <div key={idx} className="border p-4 rounded shadow flex flex-col items-center">
              <p className="font-semibold text-center">{fav.location}</p>
              <img
                src={
                  fav.imageUrl.startsWith("uploads/")
                    ? `${API_BASE_URL}/${fav.imageUrl}`
                    : fav.imageUrl
                }
                alt="Favorite"
                className="mt-2 w-full h-auto object-cover"
              />
              <button
                onClick={() => handleDeleteFavorite(fav)}
                className="mt-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
