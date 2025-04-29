import React, { useState } from 'react'
import toast from 'react-hot-toast'

const useLogout = () => {
    const [loading, setloading] = useState(false)
    const logout = async () => {
        // backend_url = 'https://elevatex.onrender.com'
      const backend_url = 'http://localhost:5500'
        setloading(true)
        try {
            const userType = localStorage.getItem("userType")?.toLowerCase() || "student";
            const endpoint = `${backend_url}/api/auth/${userType}/logout`;
            
            const response = await fetch(endpoint, {
                method: 'POST',
                credentials: "include" 
            })
            
            const data = await response.json()
            if (data.status) {
                localStorage.removeItem("elex-user")
                localStorage.removeItem("userType")
                toast.success('Logged out successfully')
                setTimeout(() => {
                    window.location.href = '/auth'
                }, 3000);
            } else {
                throw new Error(data.error || "Failed to logout");
            }
        } catch (error) {
            toast.success('Logged out successfully');
            console.error("Logout Error:", error);
            // Force logout even if API fails
            localStorage.removeItem("elex-user")
            localStorage.removeItem("userType")
            setTimeout(() => {
                window.location.href = '/auth'
            }, 3000);
        } finally {
            setloading(false)
        }
    }
    return {logout, loading}
}

export default useLogout