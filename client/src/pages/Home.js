import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ImageViewer from "../components/ImageViewer";
import Modal from "../components/Modal";
import Login from "../components/Login";
import Register from "../components/Register";

const Home = () => {
  const [location, setLocation] = useState(null);
  const [years, setYears] = useState("all"); // default value
  const [memory, setMemory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [showFilter, setShowFilter] = useState(false);

  const fetchMemory = async () => {
    if (!location) return alert("Select a location first");
    try {
      const response = await fetch(
        `/api/memories?lat=${location.lat}&lng=${location.lng}&years=${years}`
      );
      if (!response.ok) throw new Error("Failed to fetch memory data");
      const data = await response.json();
      setMemory(data);
    } catch (error) {
      alert(error.message);
    }
  };

  // Automatically fetch memory when location or years change.
  useEffect(() => {
    if (location) {
      fetchMemory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, years]);

  const handleAuthClick = (mode) => {
    setAuthMode(mode);
    setIsModalOpen(true);
  };

  return (
    <div className="relative">
      <Navbar
        onAuthClick={handleAuthClick}
        setLocation={setLocation}
        fetchMemory={fetchMemory}  // Optional: if you want to trigger fetch manually as well
      />
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
      {/* Main content container with id for scrolling */}
      <div id="explore-section" className="container mx-auto p-6 pt-32">
        <ImageViewer memory={memory} />
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {authMode === "login" ? (
          <>
            <Login />
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
            <Register />
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
