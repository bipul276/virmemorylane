const otpStore = new Map();

// Store OTP for a user (expires in 5 minutes)
const setOTP = (identifier, otp) => {
  otpStore.set(identifier, { otp, expires: Date.now() + 300000 }); // 5 minutes expiry
};

// Verify OTP and remove it if valid
const verifyOTP = (identifier, otp) => {
  const record = otpStore.get(identifier);
  if (!record || record.otp !== otp || record.expires < Date.now()) {
    return false;
  }
  otpStore.delete(identifier);
  return true;
};

module.exports = { setOTP, verifyOTP };
