// src/pages/Profile.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode"; // default import

const Profile = () => {
  const [profile, setProfile] = useState({ username: "", email: "" });
  const [editing, setEditing] = useState(false);
  const [memories, setMemories] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch profile info from token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setProfile({ username: decoded.username, email: decoded.email });
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  // Fetch user memories (uploaded photos)
  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/memories/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched user memories:", res.data);
        setMemories(res.data);
      } catch (error) {
        console.error("Error fetching user memories:", error);
      }
    };
    fetchMemories();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    // TODO: Call an API to update the profile on the backend.
    alert("Profile updated successfully!");
    setEditing(false);
  };

  // Helper function: convert backslashes to forward slashes
  const fixImagePath = (filePath) => {
    if (!filePath) return "";
    return filePath.replace(/\\/g, "/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <img
            src="https://www.gravatar.com/avatar?d=mp&s=100"
            alt="avatar"
            className="w-24 h-24 rounded-full shadow-md"
          />
          <h2 className="mt-4 text-2xl font-bold text-gray-800">My Profile</h2>
        </div>
        <div className="mb-8">
          {editing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium">Username</label>
                <input
                  type="text"
                  name="username"
                  value={profile.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
              >
                Save Changes
              </button>
            </form>
          ) : (
            <div>
              <p className="text-gray-800">
                <span className="font-semibold">Username:</span> {profile.username}
              </p>
              <p className="mt-2 text-gray-800">
                <span className="font-semibold">Email:</span> {profile.email}
              </p>
              <button
                onClick={() => setEditing(true)}
                className="mt-6 w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
        <hr className="mb-8" />
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Your Uploaded Memories</h3>
          {memories.length === 0 ? (
            <p className="text-gray-700">No memories uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {memories.map((memory) => (
                <div key={memory._id} className="border p-4 rounded shadow">
                  <img
                    src={`http://localhost:5000/${fixImagePath(memory.mostRelatedImage)}`}
                    alt="Memory"
                    className="w-full h-auto object-cover"
                  />
                  <p className="mt-2 text-gray-800">
                    <span className="font-semibold">Location:</span> {memory.location.lat}, {memory.location.lng}
                  </p>
                  <p className="text-gray-800">
                    <span className="font-semibold">Date Taken:</span> {new Date(memory.dateTaken).toLocaleDateString()}
                  </p>
                  {/* Optionally display details if needed */}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
