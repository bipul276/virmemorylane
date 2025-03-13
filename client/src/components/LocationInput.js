import React, { useState } from "react";

const LocationInput = ({ setLocation }) => {
  const [manualLocation, setManualLocation] = useState("");

  const handleGeolocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => setLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
      () => alert("Could not access location")
    );
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    const [lat, lng] = manualLocation.split(",").map(Number);
    if (!isNaN(lat) && !isNaN(lng)) {
      setLocation({ lat, lng });
    } else {
      alert("Enter valid latitude, longitude");
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <button onClick={handleGeolocation} className="bg-blue-500 text-white px-4 py-2 rounded">
        Use My Location
      </button>
      <form onSubmit={handleManualSubmit} className="mt-4 flex">
        <input
          type="text"
          placeholder="Enter lat, lng"
          value={manualLocation}
          onChange={(e) => setManualLocation(e.target.value)}
          className="border p-2 flex-1 rounded"
        />
        <button type="submit" className="ml-2 bg-green-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

export default LocationInput;
