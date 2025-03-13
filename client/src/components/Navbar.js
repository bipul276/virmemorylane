import React, { useState } from 'react';

const Navbar = ({ onAuthClick, setLocation, fetchMemory }) => {
  const [latInput, setLatInput] = useState("");
  const [lngInput, setLngInput] = useState("");

  const handleManualSubmit = (e) => {
    e.preventDefault();
    const lat = parseFloat(latInput);
    const lng = parseFloat(lngInput);
    if (!isNaN(lat) && !isNaN(lng)) {
      setLocation({ lat, lng });
    } else {
      alert("Enter valid latitude and longitude");
    }
  };

  const handleUseMyLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
      },
      () => alert("Could not access location")
    );
  };

  return (
    <nav className="flex flex-wrap justify-between items-center p-5 bg-white shadow-md fixed top-0 w-full z-50">
      <div className="flex items-center space-x-6">
        <h1 className="text-xl font-bold text-orange-500">Virtual Memory Lane</h1>
        <ul className="hidden md:flex space-x-6">
          <li><a href="/" className="hover:text-orange-500">Home</a></li>
          <li><a href="/profile" className="hover:text-orange-500">Profile</a></li>
          <li><a href="/favorites" className="hover:text-orange-500">Favorites</a></li>
        </ul>
      </div>
      {/* Location search area with separate inputs */}
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
          <button type="submit" className="bg-green-500 text-white px-3 py-2 rounded-r-md hover:bg-green-600 transition">
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
      {/* Auth button */}
      <div>
        <button
          onClick={() => onAuthClick("login")}
          className="border px-4 py-2 rounded text-orange-500 border-orange-500 hover:bg-orange-500 hover:text-white transition"
        >
          Login
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
