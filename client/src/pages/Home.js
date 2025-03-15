// src/pages/Home.js
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ImageViewer from "../components/ImageViewer";
import Modal from "../components/Modal";
import Login from "../components/Login";
import Register from "../components/Register";

const Home = () => {
  const [location, setLocation] = useState(null);
  const [years, setYears] = useState("all");
  const [memories, setMemories] = useState([]);  // should be an array
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [showFilter, setShowFilter] = useState(false);

  const fetchMemories = async () => {
    if (!location) return alert("Select a location first");
    try {
      const response = await fetch(
        `/api/memories?lat=${location.lat}&lng=${location.lng}&years=${years}`
      );
      if (!response.ok) throw new Error("Failed to fetch memory data");
      const data = await response.json();
      console.log("Fetched memories:", data);
      // Ensure data is an array:
      setMemories(Array.isArray(data) ? data : [data]);
    } catch (error) {
      alert(error.message);
    }
  };

  // Auto-fetch memories when location or years changes.
  useEffect(() => {
    if (location) {
      fetchMemories();
    }
  }, [location, years]);

  const handleAuthClick = (mode) => {
    setAuthMode(mode);
    setIsModalOpen(true);
  };

  return (
    <div className="relative">
      <Navbar onAuthClick={handleAuthClick} setLocation={setLocation} />
      <Hero />
      {/* Filter button in top right corner (below navbar) */}
      <div className="absolute right-6 top-24 z-40">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md shadow"
        >
          Filter
        </button>
        {showFilter && (
          <div className="mt-2 bg-white border border-gray-300 rounded shadow p-2">
            <select
              value={years}
              onChange={(e) => setYears(e.target.value)}
              className="border border-gray-300 rounded p-2"
            >
              <option value="all">All</option>
              <option value="10">10 Years</option>
              <option value="20">20 Years</option>
            </select>
          </div>
        )}
      </div>
      {/* Main content container: render each memory */}
      <div id="explore-section" className="container mx-auto p-6 pt-32">
        {memories.length === 0 ? (
          <p className="text-center text-gray-600">No memories found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {memories.map((memory) => (
              <ImageViewer key={memory._id} memory={memory} />
            ))}
          </div>
        )}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {authMode === "login" ? (
          <>
            <Login onClose={() => setIsModalOpen(false)} />
            <p className="mt-4 text-center">
              Don't have an account?{" "}
              <span
                onClick={() => setAuthMode("register")}
                className="text-indigo-600 font-semibold hover:underline cursor-pointer"
              >
                Register
              </span>
            </p>
          </>
        ) : (
          <>
            <Register onClose={() => setIsModalOpen(false)} />
            <p className="mt-4 text-center">
              Already have an account?{" "}
              <span
                onClick={() => setAuthMode("login")}
                className="text-indigo-600 font-semibold hover:underline cursor-pointer"
              >
                Login
              </span>
            </p>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Home;
