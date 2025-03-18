import React, { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode"; // Corrected import
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ onClose }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOTP, setSendingOTP] = useState(false);
  const [resendTimer, setResendTimer] = useState(0); // Countdown timer for resending OTP
  const navigate = useNavigate();

  /** Handle Login */
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData, {
        headers: { "Content-Type": "application/json" },
      });

      const token = res.data.token;
      localStorage.setItem("token", token);
      if (onClose) onClose();

      // Decode token to check admin flag
      const decoded = jwtDecode(token);
      if (decoded.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  /** Handle OTP Sending */
  const sendOTP = async () => {
    setSendingOTP(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", {
        email: formData.email,
      });
      setOtpSent(true);
      setSendingOTP(false);
      setResendTimer(30); // Set a 30-second countdown before resending
    } catch (error) {
      setSendingOTP(false);
      alert(error.response?.data?.message || "Error sending OTP");
    }
  };

  /** Handle Password Reset */
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword) {
      alert("Please enter OTP and new password.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/reset-password", {
        email: formData.email,
        otp,
        newPassword,
      });
      alert(res.data.message);
      setIsForgotPassword(false); // Switch back to login
      setOtpSent(false);
      setOtp("");
      setNewPassword("");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to reset password.");
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
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        {isForgotPassword ? "Forgot Password" : "Login"}
      </h2>

      {!isForgotPassword ? (
        <form onSubmit={handleLoginSubmit} className="w-full relative">
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              required
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="mb-6 relative">
            <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              required
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-600"
            >
              {showPassword ? "👁️" : "🙈"}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Login
          </button>
        </form>
      ) : (
        <form onSubmit={handlePasswordReset} className="w-full relative">
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              required
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

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
              <p className="text-green-600 text-sm mb-2">✅ OTP Sent!</p>
              <input
                type="text"
                placeholder="Enter OTP"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                required
                onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
              />
              <input
                type="password"
                placeholder="Enter new password"
                className="w-full px-4 py-2 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                required
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 mt-4 rounded-lg hover:bg-green-700 transition duration-300"
              >
                Reset Password
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
      )}

      <div className="mt-4">
        <button
          onClick={() => setIsForgotPassword(!isForgotPassword)}
          className="text-sm text-blue-500 hover:underline"
        >
          {isForgotPassword ? "Back to Login" : "Forgot Password?"}
        </button>
      </div>
    </div>
  );
};

export default Login;
