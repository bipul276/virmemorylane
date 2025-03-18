import React, { useState, useEffect, useRef } from 'react';
import {jwtDecode} from 'jwt-decode'; // Corrected import
import { Link } from 'react-router-dom';

const Navbar = ({ onAuthClick, setLocation }) => {
  const [latInput, setLatInput] = useState("");
  const [lngInput, setLngInput] = useState("");
  const [user, setUser] = useState(null);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const logoutRef = useRef(null);

  // On mount, check for token and decode it.
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      setUser(null);
    }
  }, []);

  // Close the logout dropdown if a click happens outside.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (logoutRef.current && !logoutRef.current.contains(event.target)) {
        setLogoutOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    const lat = parseFloat(latInput);
    const lng = parseFloat(lngInput);
    if (
      isNaN(lat) ||
      isNaN(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      alert("Enter valid latitude (-90 to 90) and longitude (-180 to 180) values.");
      return;
    }
    setLocation({ lat, lng });
  };

  const handleUseMyLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
      },
      () => alert("Could not access location")
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    // Optionally, redirect to home
  };

  return (
    <nav className="flex flex-wrap justify-between items-center p-5 bg-white shadow-md fixed top-0 w-full z-50">
      <div className="flex items-center space-x-6">
        <h1 className="text-xl font-bold text-orange-500">Virtual Memory Lane</h1>
        <ul className="hidden md:flex space-x-6">
          <li>
            <Link to="/" className="hover:text-orange-500">Home</Link>
          </li>
          {user && (
            <>
              <li>
                <Link to="/profile" className="hover:text-orange-500">Profile</Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-orange-500">Favorites</Link>
              </li>
              <li>
                <Link to="/upload-memory" className="hover:text-orange-500">Upload Memory</Link>
              </li>
            </>
          )}
        </ul>
      </div>
      {/* Location search area */}
      <div className="flex items-center space-x-3">
        <form onSubmit={handleManualSubmit} className="flex items-center">
          <input
            type="text"
            placeholder="Latitude"
            value={latInput}
            onChange={(e) => setLatInput(e.target.value)}
            className="border p-2 rounded-l-md focus:outline-none w-24"
          />
          <input
            type="text"
            placeholder="Longitude"
            value={lngInput}
            onChange={(e) => setLngInput(e.target.value)}
            className="border p-2 focus:outline-none w-24"
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-3 py-2 rounded-r-md hover:bg-green-600 transition"
          >
            Search
          </button>
        </form>
        <button
          onClick={handleUseMyLocation}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Use My Location
        </button>
      </div>
      {/* Auth area */}
      <div>
        {user ? (
          <div className="relative" ref={logoutRef}>
            <span
              className="text-gray-700 cursor-pointer"
              onClick={() => setLogoutOpen(!logoutOpen)}
            >
              Welcome, {user.username}
            </span>
            {logoutOpen && (
              <div className="absolute right-0 mt-1 bg-white border rounded shadow">
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => onAuthClick("login")}
            className="border px-4 py-2 rounded text-orange-500 border-orange-500 hover:bg-orange-500 hover:text-white transition"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
