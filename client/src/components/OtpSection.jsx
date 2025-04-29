import React, { useRef, useState, useEffect } from 'react';
import { Button } from "@material-tailwind/react";
import useVerify from '../hooks/UseVerify';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const OTPInput = ({type}) => {
  // console.log(type);
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const { verifyOTP, loading ,verifyOTPMentor } = useVerify();  
  // const {verifyOTPMentor} = useVerify();
  const navigate = useNavigate();  // Initialize useNavigate hook

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(0, 1); // Take only the first digit
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    if (/^\d{6}$/.test(pastedData)) {
      const otpArray = pastedData.split('');
      setOtp(otpArray);
      inputRefs.current[5].focus();
    }
  };

  const handleSubmit = async () => {
    
    const otpEntered = otp.join('');
    if (otpEntered.length !== 6) {
        toast.error('Please enter a valid 6-digit OTP');
      return;
      }
      if(type === 'student'){
        const success = await verifyOTP(otpEntered);
        if (success) {
          navigate('/');
        }
      }else{
        const success = await verifyOTPMentor(otpEntered);
        if (success) {
          navigate('/mentorlanding');
        }
      }
  };

  return (
    <div className="flex items-center justify-center min-h-[500px]">
      <div className="flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Enter Verification Code</h2>

        <div className="flex gap-3 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={index === 0 ? handlePaste : null}
              ref={(ref) => { inputRefs.current[index] = ref }}
              className="w-12 h-14 text-center text-xl font-medium bg-gray-50 border border-gray-200 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              autoFocus={index === 0}
            />
          ))}
        </div>

        <p className="text-sm text-gray-500">Didn't receive code? <button className="text-blue-600 hover:underline">Resend</button></p>
        <Button
          className="mt-6 px-6 py-3 bg-black text-white rounded-lg shadow-md focus:outline-none focus:ring-opacity-50 transition-all font-medium"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Verifying...' : 'Verify'}
        </Button>
      </div>
    </div>
  );
};

export default OTPInput;
