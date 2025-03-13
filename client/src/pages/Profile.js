import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const Profile = () => {
  const [profile, setProfile] = useState({
    username: "",
    email: ""
  });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setProfile({
          username: decoded.username,
          email: decoded.email
        });
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="flex flex-col items-center">
          <img
            src="https://www.gravatar.com/avatar?d=mp&s=100"
            alt="avatar"
            className="w-24 h-24 rounded-full shadow-md"
          />
          <h2 className="mt-4 text-2xl font-bold text-gray-800">My Profile</h2>
        </div>
        <div className="mt-6">
          {editing ? (
            <form onSubmit={handleSave}>
              <div className="mb-4">
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
              <div className="mb-4">
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
      </div>
    </div>
  );
};

export default Profile;
