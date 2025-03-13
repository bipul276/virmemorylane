// src/pages/Admin.js
import React, { useState } from "react";
import axios from "axios";

const Admin = () => {
  const [formData, setFormData] = useState({
    lat: "",
    lng: "",
    years: "",
    mostRelatedImage: "",
    transformationDetails: "",
    info: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate required fields
    if (!formData.lat || !formData.lng || !formData.years || !formData.mostRelatedImage) {
      setMessage("Please fill in all required fields");
      return;
    }
    try {
      const res = await axios.post("http://localhost:5000/api/admin/memories", {
        lat: Number(formData.lat),
        lng: Number(formData.lng),
        years: formData.years,
        mostRelatedImage: formData.mostRelatedImage,
        transformationDetails: formData.transformationDetails,
        info: formData.info,
      });
      setMessage("Memory added successfully");
      // Optionally clear form
      setFormData({
        lat: "",
        lng: "",
        years: "",
        mostRelatedImage: "",
        transformationDetails: "",
        info: "",
      });
    } catch (error) {
      setMessage(error.response?.data?.message || "Error adding memory");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Admin Panel - Add Memory</h2>
        {message && <p className="mb-4 text-center text-green-600">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Latitude*</label>
            <input
              type="text"
              name="lat"
              value={formData.lat}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter latitude"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Longitude*</label>
            <input
              type="text"
              name="lng"
              value={formData.lng}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter longitude"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Years*</label>
            <select
              name="years"
              value={formData.years}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select time range</option>
              <option value="all">All Time</option>
              <option value="10">10 Years</option>
              <option value="20">20 Years</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Image URL*</label>
            <input
              type="text"
              name="mostRelatedImage"
              value={formData.mostRelatedImage}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter image URL"
              required
            />
            <small className="text-gray-500">Provide a direct URL link to the image.</small>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Transformation Details</label>
            <textarea
              name="transformationDetails"
              value={formData.transformationDetails}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter transformation details"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Additional Info</label>
            <textarea
              name="info"
              value={formData.info}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter additional info"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          >
            Add Memory
          </button>
        </form>
      </div>
    </div>
  );
};

export default Admin;
