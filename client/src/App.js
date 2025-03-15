// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';
import Login from './components/Login';
import Register from './components/Register';
import AdminPanel from './pages/AdminPanel';
import MemoryUpload from './components/MemoryUpload';
import MemoryDetails from './pages/MemoryDetails';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/upload-memory" element={<MemoryUpload />} />
        <Route path="/memory/:id" element={<MemoryDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
