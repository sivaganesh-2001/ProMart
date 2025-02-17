import React, { useState } from "react";

const OTPPage = () => {
  const [otpData, setOtpData] = useState({
    emailOtp: "",
    phoneOtp: "",
  });
  const [error, setError] = useState("");

  const handleOtpChange = (e) => {
    setOtpData({
      ...otpData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();

    // OTP Validation
    if (!otpData.emailOtp || !otpData.phoneOtp) {
      setError("Please enter both OTPs.");
      return;
    }

    // Proceed with OTP verification logic here...
    alert("OTP Verified Successfully");
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-semibold text-center mb-4">OTP Verification</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <form onSubmit={handleOtpSubmit} className="max-w-lg mx-auto space-y-4">
        <div>
          <label className="block">Enter OTP sent to your Email:</label>
          <input
            type="text"
            name="emailOtp"
            value={otpData.emailOtp}
            onChange={handleOtpChange}
            className="w-full border p-2 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block">Enter OTP sent to your Phone:</label>
          <input
            type="text"
            name="phoneOtp"
            value={otpData.phoneOtp}
            onChange={handleOtpChange}
            className="w-full border p-2 rounded-md"
            required
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white p-3 rounded-md w-full">
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default OTPPage;
