import  { useState } from 'react'
import toast from 'react-hot-toast'

const useLogin = () => {
    const [loading, setLoading] = useState(false)
    const backend_url = 'http://localhost:5500'

    const login = async ({email,password,code,remember,userType}) => {
        if(userType === 'admin'){
            
            const success = handleInputErrors({email,password})
            if(!success) return
            setLoading(true)
            try {
                const response = await fetch(`${backend_url}/api/auth/admin/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
    
                    body: JSON.stringify({email,password,code}),
                    credentials: "include" 
                })
                const data = await response.json()
                if(data.error){
                    toast.error(data.error)
                    throw new Error(data.error);
                }else if(data.Error){
                    if(data.Error.includes('users.findOne()')){
                        throw new Error('Server Timeout')
                    }
                    throw new Error(data.Error);
                }
                localStorage.setItem('elex-user',JSON.stringify(data.admin))
                localStorage.setItem('userType', 'admin')
    
                toast.success("Login Successfully Done")
                setTimeout(() => {
                    window.location.href = '/admin-dashboard'
                }
                , 3000)
            } catch (error) {
                toast.error(error.message)
                throw new Error(error)
            }finally{
                setLoading(false)
            }

        }
        if(userType === 'mentor'){

            const success = handleInputErrors({email,password})
            if(!success) return
            setLoading(true)
            try {
                const response = await fetch(`${backend_url}/api/auth/mentor/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
    
                    body: JSON.stringify({email,password}),
                    credentials: "include" 
                })
                const data = await response.json()
                if(data.error){
                    toast.error(data.error)
                    throw new Error(data.error);
                }else if(data.Error){
                    if(data.Error.includes('users.findOne()')){
                        throw new Error('Server Timeout')
                    }
                    throw new Error(data.Error);
                }
                localStorage.setItem('elex-user',JSON.stringify(data.mentor))
                localStorage.setItem('userType',data.userType)
    
                toast.success("Login Successfully Done")
                setTimeout(() => {
                    window.location.href = '/mentor-dashboard'
                }
                , 3000)
            } catch (error) {
                toast.error(error.message)
                throw new Error(error)
            }finally{
                setLoading(false)
            }

        }
        if(userType === 'student'){

            const success = handleInputErrors({email,password})
            if(!success) return
            setLoading(true)
            try {
                const response = await fetch(`${backend_url}/api/auth/student/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
    
                    body: JSON.stringify({email,password}),
                    credentials: "include" 
                })
                const data = await response.json()
                if(data.error){
                    toast.error(data.error)
                    throw new Error(data.error);
                }else if(data.Error){
                    if(data.Error.includes('users.findOne()')){
                        throw new Error('Server Timeout')
                    }
                    throw new Error(data.Error);
                }
                localStorage.setItem('elex-user',JSON.stringify(data.student))
                localStorage.setItem('userType',data.userType)
    
                toast.success("Login Successfully Done")
                setTimeout(() => {
                    window.location.href = '/'
                }
                , 3000)
            } catch (error) {
                toast.error(error.message)
                throw new Error(error)
            }finally{
                setLoading(false)
            }

        }
        
       
    }
    return { login, loading }
}

export default useLogin

function handleInputErrors({ email, password }) {
    // console.log(username , password);
    
    if (!email || !password ) {
        toast.error('Please fill all the fields');
        return false;
    } else if (password.length < 3) {
        toast.error('Invalid password or email');
        return false;
    }else if (password.length < 8) {
        toast.error('Invalid password or email');
        return false;
    } else {
        return true;
    }
}
