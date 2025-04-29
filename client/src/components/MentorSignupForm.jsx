import { useState } from "react";
import useMentorSignup from "../hooks/UseMentor";
import { Button } from "@material-tailwind/react";

const MentorSignupForm = () => {
  const {mentorSignup , loading} = useMentorSignup();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    expertise: [],
    experience: "",
    bio: "",
    agreedToTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, options } = e.target;
    
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "select-multiple") {
      const selectedOptions = Array.from(options)
        .filter(option => option.selected)
        .map(option => option.value);
      setFormData({ ...formData, [name]: selectedOptions });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      await mentorSignup(formData);
      } catch (error) {
        console.error("Error during signup:", error);
      }
    
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <input type="text" name="firstName" placeholder="Enter your first name" required onChange={handleChange} className="w-full p-2 border rounded-md" />
        <input type="text" name="lastName" placeholder="Enter your last name" required onChange={handleChange} className="w-full p-2 border rounded-md" />
      </div>
      <input type="email" name="email" placeholder="your.email@example.com" required onChange={handleChange} className="w-full p-2 border rounded-md" />
      <input type="password" name="password" placeholder="Create a password" required onChange={handleChange} className="w-full p-2 border rounded-md" />
      <input type="password" name="confirmPassword" placeholder="Confirm your password" required onChange={handleChange} className="w-full p-2 border rounded-md" />
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Areas of Expertise <span className="text-red-500">*</span></label>
        <select name="expertise" multiple required onChange={handleChange} className="w-full p-2 border rounded-md">
          <option value="Machine Learning">Machine Learning</option>
          <option value="Blockchain">Blockchain</option>
          <option value="Web Development">Web Development</option>
          <option value="Data Science">Data Science</option>
          <option value="App Development">App Development</option>
          <option value="Other">Other</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">Hold Ctrl (or Cmd) to select multiple</p>
      </div>
      
    
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Experience<span className="text-red-500">*</span></label>
        <input type="number" name="experience" placeholder="Number of years" required onChange={handleChange} className="w-full p-2 border rounded-md" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Short Bio <span className="text-red-500">*</span></label>
        <textarea name="bio" rows="3" required onChange={handleChange} className="w-full p-2 border rounded-md" placeholder="Share a brief description of your background and teaching approach"></textarea>
      </div>
      
      <div className="flex items-center mt-4">
        <input type="checkbox" name="agreedToTerms" required onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
        <label className="ml-2 block text-sm text-gray-700">I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a></label>
      </div>
      {loading && <Button
            type="button"
            className="w-full py-2 px-4 text-white font-medium rounded-md bg-black hover:bg-gray-700 focus:ring focus:ring-blue-500"
            disabled
            >
              Loading...
            </Button>}
      {!loading && <Button type="submit" className="w-full py-2 px-4 bg-black hover:bg-gray-900 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
        Create Mentor Account
      </Button>}
    </form>
  );
};

export default MentorSignupForm;
