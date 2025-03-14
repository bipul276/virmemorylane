import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1 = Enter email, 2 = Enter OTP, 3 = Reset password
  const navigate = useNavigate();

  // Step 1: Send OTP
  const sendOTP = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      alert(res.data.message);
      setStep(2);
    } catch (error) {
      alert(error.response?.data?.message || "Error sending OTP");
    }
  };

  // Step 2: Verify OTP & Reset Password
  const resetPassword = async () => {
    if (!otp || !newPassword) {
      alert("Please enter OTP and new password.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      alert(res.data.message);
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Forgot Password</h2>

      {step === 1 && (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={sendOTP} className="w-full bg-blue-600 text-white py-2 mt-4 rounded-lg">
            Send OTP
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            onChange={(e) => setOtp(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full px-4 py-2 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={resetPassword} className="w-full bg-green-600 text-white py-2 mt-4 rounded-lg">
            Reset Password
          </button>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
