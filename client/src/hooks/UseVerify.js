import { useState } from 'react';
import toast from 'react-hot-toast';

const useVerify = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const backend_url = 'http://localhost:5500';
  // const backend_url = 'https://elevatex.onrender.com'
  const verifyOTP = async (otp) => {
    const email = localStorage.getItem('elex-email');
    
    if (!email) {
      toast.error('Email not found in local storage');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${backend_url}/api/auth/student/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (data.status) {
        toast.success(data.message);
        localStorage.removeItem('elex-email');
        localStorage.setItem('elex-user', JSON.stringify(data.student));
        localStorage.setItem('userType', data.userType);
        setTimeout(() => {
          window.location.href = '/';
          }, 3500);
        // window.location.href = '/';
        return true;
      } else {
        toast.error(data.error || 'OTP verification failed');
        return false;
      }
    } catch (error) {
      console.error("Verification Error:", error);
      toast.error('An error occurred during verification');
      setError(error);
      return false;
    } finally {
      setLoading(false);
    }
  };
  const verifyOTPMentor = async (otp) => {
    const email = localStorage.getItem('elex-email');
    
    if (!email) {
      toast.error('Email not found in local storage');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${backend_url}/api/auth/mentor/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (data.status) {
        toast.success(data.message);
        localStorage.removeItem('elex-email');
        localStorage.setItem('elex-user', JSON.stringify(data.mentor));
        localStorage.setItem('userType', data.userType);
        setTimeout(() => {
          window.location.href = '/';
          }, 3500);
        // window.location.href = '/';
        return true;
      } else {
        toast.error(data.error || 'OTP verification failed');
        return false;
      }
    } catch (error) {
      console.error("Verification Error:", error);
      toast.error('An error occurred during verification');
      setError(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { verifyOTP, loading, error , verifyOTPMentor };
};

export default useVerify;
