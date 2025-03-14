import React, { useState, useEffect } from "react";
import axios from "axios";

// Set API Base URL Dynamically
const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : `http://${window.location.hostname}:5000`;

const Register = ({ onClose }) => {
  const [step, setStep] = useState(1); // 1 = Enter details, 2 = Verify OTP
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const [sendingOTP, setSendingOTP] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  /** Handle OTP Sending */
  const sendOTP = async () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      alert("Please fill in all fields before sending OTP.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setSendingOTP(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/send-otp`, {
        email: formData.email,
      });
      setOtpSent(true);
      setSendingOTP(false);
      setResendTimer(30); // Start 30-second countdown
    } catch (error) {
      setSendingOTP(false);
      alert(error.response?.data?.message || "Error sending OTP");
    }
  };

  /** Handle Registration */
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!formData.otp) {
      alert("Please enter the OTP.");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        otp: formData.otp,
      });
      alert("Registration successful!");
      if (onClose) onClose();
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  /** Countdown Timer Effect */
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Register</h2>

      <form className="w-full relative" onSubmit={otpSent ? handleRegisterSubmit : (e) => e.preventDefault()}>
        {/* USERNAME */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            required
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
        </div>

        {/* EMAIL */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm your password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            required
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />
        </div>

        {/* OTP SECTION - Shows only after OTP is sent */}
        {otpSent && (
          <>
            <p className="text-green-600 text-sm mb-2">✅ OTP Sent!</p>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">OTP</label>
              <input
                type="text"
                placeholder="Enter OTP"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                required
                onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
              />
            </div>
          </>
        )}

        {/* BUTTONS */}
        {!otpSent ? (
          <button
            type="button"
            onClick={sendOTP}
            disabled={sendingOTP}
            className={`w-full text-white py-2 rounded-lg transition duration-300 ${
              sendingOTP ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {sendingOTP ? "Sending OTP..." : "Send OTP"}
          </button>
        ) : (
          <>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 mt-4 rounded-lg hover:bg-green-700 transition duration-300"
            >
              Register
            </button>
            <button
              type="button"
              onClick={sendOTP}
              disabled={resendTimer > 0}
              className="w-full bg-gray-600 text-white py-2 mt-2 rounded-lg"
            >
              {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default Register;
