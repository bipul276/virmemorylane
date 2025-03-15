// src/pages/AdminPanel.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [memories, setMemories] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    // Verify admin status
    const verifyAdmin = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/verify-admin", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.data.isAdmin) {
          navigate("/");
        }
      } catch (error) {
        navigate("/login");
      }
    };

    // Fetch all users (excluding passwords)
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Error fetching users");
      }
    };

    // Fetch all memories
    const fetchMemories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/memories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMemories(res.data);
      } catch (err) {
        console.error("Error fetching memories:", err);
        setError("Error fetching memories");
      }
    };

    verifyAdmin();
    fetchUsers();
    fetchMemories();
  }, [navigate, token]);

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("User deleted successfully");
        const updated = await axios.get("http://localhost:5000/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(updated.data);
      } catch (err) {
        console.error("Error deleting user:", err);
        setError("Error deleting user");
      }
    }
  };

  const handleDeleteMemory = async (memoryId) => {
    if (window.confirm("Are you sure you want to delete this memory?")) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/memories/${memoryId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("Memory deleted successfully");
        const updated = await axios.get("http://localhost:5000/api/admin/memories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMemories(updated.data);
      } catch (err) {
        console.error("Error deleting memory:", err);
        setError("Error deleting memory");
      }
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={() => navigate("/")}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        &larr; Back to Home
      </button>
      <h2 className="text-3xl font-bold mb-4">Admin Panel</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {message && <p className="text-green-600 mb-4">{message}</p>}

      <section className="mb-8">
        <h3 className="text-2xl font-semibold mb-2">Users</h3>
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {users.map((user) => (
              <div
                key={user._id}
                className="border p-4 rounded shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{user.username}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="text-2xl font-semibold mb-2">Memories</h3>
        {memories.length === 0 ? (
          <p>No memories found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {memories.map((memory) => (
              <div key={memory._id} className="border p-4 rounded shadow">
                <img
                  src={
                    memory.mostRelatedImage.startsWith("uploads/")
                      ? `http://localhost:5000/${memory.mostRelatedImage.replace(/\\/g, "/")}`
                      : memory.mostRelatedImage
                  }
                  alt="Memory"
                  className="w-full h-auto object-cover"
                />
                <p className="mt-2 text-gray-800">
                  <span className="font-semibold">Location:</span> {memory.location.lat}, {memory.location.lng}
                </p>
                <p className="text-gray-800">
                  <span className="font-semibold">Date Taken:</span> {new Date(memory.dateTaken).toLocaleDateString()}
                </p>
                <button
                  onClick={() => handleDeleteMemory(memory._id)}
                  className="mt-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminPanel;
