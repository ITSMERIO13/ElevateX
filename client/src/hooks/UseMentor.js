import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'; 

const useMentorSignup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
 const backend_url = 'http://localhost:5500'
  const mentorSignup = async ({ firstName, lastName, email, password, confirmPassword, expertise, experience, bio, agreedToTerms }) => {
    const success = handleInputErrors({ firstName, lastName, email, password, confirmPassword, expertise, experience, bio, agreedToTerms });
    if (!success) return false;

    setLoading(true);

    try {
      const response = await fetch(`${backend_url}/api/auth/mentor/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
          expertise,
          experience,
          bio,
          agreedToTerms,
        }),
      });

      const data = await response.json();
      console.log(data.email);
      
      if (data.error) {
        throw new Error(data.error);
      }
      if (data.success) {
        toast.success(data.message);
        localStorage.setItem('elex-email', data.email);
        setTimeout(() => {
          navigate('/otpmentor');
        }, 2500);
        return true;
      } else {
        toast.error(data.error);
        return false;
      }

    } catch (error) {
      toast.error(error.message);
      throw new Error(error);
    } finally {
      setLoading(false);
    }
  };

  return { mentorSignup, loading };
};

export default useMentorSignup;

function handleInputErrors({ firstName, lastName, email, password, confirmPassword, expertise, experience, bio, agreedToTerms }) {
  if (!firstName || !lastName || !email || !password || !confirmPassword || !expertise || !experience || !bio || !agreedToTerms) {
    toast.error('Please fill all the fields');
    return false;
  } else if (password !== confirmPassword) {
    toast.error('Passwords do not match');
    return false;
  } else if (password.length < 8) {
    toast.error('Password should be at least 8 characters long');
    return false;
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])/.test(password)) {
    toast.error('Password must contain at least one uppercase letter, one lowercase letter, and one special character');
    return false;
  }else if(experience < 0){
    toast.error('Experience cannot be negative');
  }   else {
    return true;
  }
}
