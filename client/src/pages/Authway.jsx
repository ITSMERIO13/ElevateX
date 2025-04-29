import React, { useState } from 'react';
import StudentSignupForm from '../components/StudentSignupForm';
import MentorSignupForm from '../components/MentorSignupForm';
import LoginForm from '../components/LoginForm';

const AuthTabs = ({ activeTab, setActiveTab, tabs }) => {
  return (
    <div className="flex border-b mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === tab.id
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

const UserTypeSelector = ({ userType, setUserType, tabs }) => {
    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">I am a:</label>
        <div className="grid grid-cols-3 gap-2">
          {['student', 'mentor', ...(tabs !== 'signup' ? ['admin'] : [])].map((type) => (    
            <button
              key={type}
              type="button"
              className={`py-2 px-4 text-sm font-medium rounded-md ${
                userType === type
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => {setUserType(type);localStorage.setItem('login-type', type);}}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>
    );
  };
  



// Main authentication component
const AuthComponent = () => {
  const [authMode, setAuthMode] = useState('signup');
  const [userType, setUserType] = useState('student');
  
  const authTabs = [
    { id: 'signup', label: 'Sign Up' },
    { id: 'login', label: 'Log In' }
  ];
  
  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        {authMode === 'signup' ? 'Create your account' : 'Welcome back'}
      </h2>
      
      <AuthTabs 
        activeTab={authMode} 
        setActiveTab={setAuthMode} 
        tabs={authTabs} 
      />
      
      <UserTypeSelector 
        userType={userType} 
        setUserType={setUserType} 
        tabs = {authMode}
      />
      
      {authMode === 'signup' ? (
        <>
          {userType === 'student' && <StudentSignupForm />}
          {userType === 'mentor' && <MentorSignupForm />}
    
        </>
      ) : (
        <LoginForm userType={userType} />
      )}
      
      <div className="mt-6 text-center text-sm">
        {authMode === 'signup' ? (
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              className="text-blue-600 hover:underline font-medium"
              onClick={() => setAuthMode('login')}
            >
              Log in
            </button>
          </p>
        ) : (
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              className="text-blue-600 hover:underline font-medium"
              onClick={() => setAuthMode('signup')}
            >
              Sign up
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthComponent;