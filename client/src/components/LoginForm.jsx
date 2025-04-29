import { useState, useEffect } from "react";
import useLogin from "../hooks/UseLogin";
import { Button } from "@material-tailwind/react";

const LoginForm = ({ userType }) => {
  const { login, loading } = useLogin();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    code: "",
    remember: false,
    userType: userType,
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      userType: userType,
    }));
  }, [userType]); 

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await login(formData);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your.email@example.com"
          required
          className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          required
          className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
        />
      </div>

      {formData.userType === "admin" && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Security Code</label>
          <input
            type="password"
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="Enter your Security Code"
            required
            className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
          />
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember"
            name="remember"
            type="checkbox"
            checked={formData.remember}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
            Remember me
          </label>
        </div>
        <a href="#" className="text-sm text-blue-600 hover:underline">
          Forgot password?
        </a>
      </div>

      {loading ? (
        <Button
          type="button"
          className="w-full py-2 px-4 text-white font-medium rounded-md bg-blue-600 hover:bg-blue-700 focus:ring focus:ring-blue-500"
          disabled
        >
          Loading...
        </Button>
      ) : (
        <Button
          type="submit"
          className={`w-full py-2 px-4 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            formData.userType === "student"
              ? "bg-black hover:bg-gray-900 focus:ring-gray-500"
              : formData.userType === "mentor"
              ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
              : "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500"
          }`}
        >
          Log In
        </Button>
      )}
    </form>
  );
};

export default LoginForm;
