import { useState } from "react";
import { Button, Card, Typography, Input } from "@material-tailwind/react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AdminSetup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    setupCode: ""
  });
  const [loading, setLoading] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.password || !formData.setupCode) {
      toast.error("All fields are required");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch("http://localhost:5500/api/auth/admin/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          setupCode: formData.setupCode
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to create admin account");
      }
      
      toast.success("Admin account created successfully!");
      setSetupComplete(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/auth");
      }, 3000);
      
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="p-8 w-full max-w-md">
        <Typography variant="h4" className="mb-6 text-center">
          One-Time Admin Setup
        </Typography>
        
        {setupComplete ? (
          <div className="text-center">
            <Typography className="text-green-500 mb-4">
              Admin account created successfully!
            </Typography>
            <Typography>
              Redirecting to login page...
            </Typography>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Typography variant="small" className="mb-2 font-medium">
                Full Name
              </Typography>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                className="w-full"
              />
            </div>
            
            <div>
              <Typography variant="small" className="mb-2 font-medium">
                Email Address
              </Typography>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full"
              />
            </div>
            
            <div>
              <Typography variant="small" className="mb-2 font-medium">
                Password
              </Typography>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
                className="w-full"
              />
            </div>
            
            <div>
              <Typography variant="small" className="mb-2 font-medium">
                Confirm Password
              </Typography>
              <Input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                className="w-full"
              />
            </div>
            
            <div>
              <Typography variant="small" className="mb-2 font-medium">
                Setup Code
              </Typography>
              <Input
                type="password"
                name="setupCode"
                value={formData.setupCode}
                onChange={handleChange}
                placeholder="Enter setup code"
                required
                className="w-full"
              />
              <Typography variant="small" className="mt-1 text-gray-500">
                This is a one-time setup code provided to the system administrator.
              </Typography>
            </div>
            
            <div className="pt-2">
              <Button
                type="submit"
                className="w-full bg-purple-600"
                disabled={loading}
              >
                {loading ? "Setting Up..." : "Create Admin Account"}
              </Button>
              
              <Typography variant="small" className="mt-4 text-center text-gray-600">
                Note: This setup can only be completed once. After an admin account
                is created, this page will no longer be functional.
              </Typography>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};

export default AdminSetup; 