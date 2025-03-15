// src/components/MemoryUpload.js
import React, { useState } from 'react';
import axios from 'axios';

const MemoryUpload = () => {
  const [formData, setFormData] = useState({
    lat: "",
    lng: "",
    dateTaken: "",
    transformationDetails: "",
    info: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewSrc(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewSrc(null);
    }
  };

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            lat: position.coords.latitude.toFixed(6),
            lng: position.coords.longitude.toFixed(6)
          });
        },
        (error) => {
          console.error("Error fetching location:", error);
          setMessage("Unable to retrieve your location.");
        }
      );
    } else {
      setMessage("Geolocation is not supported by your browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.lat || !formData.lng || !formData.dateTaken || !imageFile) {
      setMessage("Please fill in all required fields.");
      return;
    }
    const data = new FormData();
    data.append("lat", formData.lat);
    data.append("lng", formData.lng);
    data.append("dateTaken", formData.dateTaken);
    data.append("transformationDetails", formData.transformationDetails);
    data.append("info", formData.info);
    data.append("image", imageFile);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/memories", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });
      setMessage("Memory uploaded successfully!");
      setFormData({
        lat: "",
        lng: "",
        dateTaken: "",
        transformationDetails: "",
        info: ""
      });
      setImageFile(null);
      setPreviewSrc(null);
    } catch (error) {
      console.error("Error uploading memory:", error);
      setMessage(error.response?.data?.message || "Error uploading memory");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-300 p-6">
      <div className="w-full max-w-4xl bg-white bg-opacity-90 rounded-xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Share Your Memory
        </h2>
        {message && (
          <div className="mb-4 p-3 text-center bg-gray-200 text-gray-700 rounded">
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Latitude</label>
              <input
                type="text"
                name="lat"
                value={formData.lat}
                onChange={handleChange}
                placeholder="e.g., 37.7749"
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Longitude</label>
              <input
                type="text"
                name="lng"
                value={formData.lng}
                onChange={handleChange}
                placeholder="e.g., -122.4194"
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleUseMyLocation}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition"
          >
            Use My Location
          </button>
          <div>
            <label className="block text-gray-700 mb-1">Date Taken</label>
            <input
              type="date"
              name="dateTaken"
              value={formData.dateTaken}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Upload Image</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none"
              required
            />
            {previewSrc && (
              <img
                src={previewSrc}
                alt="Preview"
                className="mt-4 rounded-lg shadow-md w-full object-cover"
              />
            )}
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Transformation Details</label>
            <textarea
              name="transformationDetails"
              value={formData.transformationDetails}
              onChange={handleChange}
              placeholder="Describe the transformation..."
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Additional Info</label>
            <textarea
              name="info"
              value={formData.info}
              onChange={handleChange}
              placeholder="Any extra information..."
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-xl font-medium transition">
            Share Memory
          </button>
        </form>
      </div>
    </div>
  );
};

export default MemoryUpload;
