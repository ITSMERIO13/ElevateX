// components/SubNavbar.jsx
import { useState } from 'react';

const SubNavbar = ({ user, onLogin, currentView, setView, currentTeam }) => {
  const [tempName, setTempName] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const handleSubmitName = () => {
    if (tempName.trim()) {
      onLogin(tempName);
      setShowLoginModal(false);
    }
  };
  
  return (
    <nav className="relative top-0 z-30 bg-zinc-900 border-b border-zinc-800 shadow-lg">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">TeamBuilder</span>
        </div>
        
        <div className="flex items-center space-x-6">
          {user.isAuthenticated ? (
            <>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-zinc-300 hidden sm:inline">{user.name}</span>
              </div>
              
              {!currentTeam ? (
                <div className="bg-zinc-800 rounded-lg p-1 flex">
                  <button 
                    onClick={() => setView('create')}
                    className={`px-4 py-2 text-sm rounded-md transition-all ${currentView === 'create' ? 'bg-blue-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'}`}
                  >
                    Create Team
                  </button>
                  <button 
                    onClick={() => setView('join')}
                    className={`px-4 py-2 text-sm rounded-md transition-all ${currentView === 'join' ? 'bg-blue-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'}`}
                  >
                    Join Team
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 bg-zinc-800 rounded-lg px-4 py-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium text-zinc-200">Active Team: {currentTeam.name}</span>
                </div>
              )}
            </>
          ) : (
            <button 
              onClick={() => setShowLoginModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 rounded-xl p-6 max-w-sm w-full border border-zinc-800 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Enter your name</h3>
              <button 
                onClick={() => setShowLoginModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <input
              type="text"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              placeholder="Your name"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmitName()}
              autoFocus
            />
            <div className="flex justify-end space-x-3">
              <button 
                className="px-4 py-2 text-sm text-zinc-400 hover:text-white"
                onClick={() => setShowLoginModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center"
                onClick={handleSubmitName}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default SubNavbar;