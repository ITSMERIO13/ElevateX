import React, { useState, useEffect, useRef } from 'react';
import useLogout from '../hooks/UseLogout';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


const MinimalistNavbarWithProfile = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [profilePic, setProfilePic] = useState('/vite.svg');
  const [records, setRecords] = useState([]);
  const dropdownRef = useRef(null);
  const [hasElexCred, setHasElexCred] = useState(false);
  const [isLogin,setLogin] = useState(false)
  const [userType, setUserType] = useState(null);
  const location = useLocation();

  const isPathActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };
  




  useEffect(() => {
    const authCred = localStorage.getItem("elex-user");
    if (authCred) {
      try {
        const parsedCred = JSON.parse(authCred);
        if (parsedCred?.profilePic) {
          setProfilePic(parsedCred.profilePic);
          setRecords(parsedCred);
          setLogin(true);
        }
      } catch (error) {
        console.error("Error parsing auth-cred:", error);
      }
    } else {
      setLogin(false);
    }
  }, []);
  

  const {logout} = useLogout();

  const handleLogout = async() => {
    await logout();
    setProfileDropdownOpen(false);
  }
  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    
    setUserType(storedUserType);
  }, []);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setHasElexCred(localStorage.getItem("elex-user") !== null);
  }, []);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  

  const navigationItems = [
    { id: 'home', label: 'Home',link: '/' ,type:'all'},
    { id: 'about', label: 'About', link: '/about',type:'all' },
    { id: 'getstarted', label: 'My Team',link: '/createteam',type:'Student' },
    { id: 'dashboard', label: 'Dashboard',link: '/mentor-dashboard',type:'Mentor' },
    { id: 'admin', label: 'Admin Dashboard',link: '/admin-dashboard',type:'admin' },
    { id: 'view', label: 'View Projects',link: '/viewproject',type:'all' },
    { id: 'resume', label: 'Resume Builder',link: '/resume',type:'Student' },
    { id: 'interview', label: 'Mock Interview',link: '/interview',type:'Student' },
    { id: 'contact', label: 'Contact',link: '/contact',type:'all' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-sm py-3' : 'bg-white/0 py-5'
    }`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className={`font-light text-xl tracking-tight transition-colors duration-300 ${
              isScrolled ? 'text-gray-900' : 'text-white'
            }`}>
              <span>Elevate</span>
              <span className="font-medium text-xl">X</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
          {isLogin &&
  navigationItems
    .filter((item) => item.type === 'all' || item.type === userType)
    .map((item) => {
      const isActive = isPathActive(item.link);
      return (
        <Link
          key={item.id}
          to={item.link}
          className="relative group"
        >
          <span className={`text-sm transition-colors duration-300 ${
            isScrolled
              ? isActive ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
              : isActive ? 'text-white' : 'text-white/80 hover:text-white'
          }`}>
            {item.label}
          </span>
          <span className={`absolute -bottom-1 left-0 w-full h-px transform transition-all duration-200 ease-out ${
            isActive
              ? 'scale-x-100 opacity-100'
              : 'scale-x-0 opacity-0 group-hover:opacity-100 group-hover:scale-x-100'
          } ${isScrolled ? 'bg-gray-900' : 'bg-white'}`}></span>
        </Link>
      );
    })
}



          </div>
          
          {/* Right Side - Profile and Contact Button */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className={`w-8 h-8 rounded-full overflow-hidden ring-2 transition-all duration-300 ${
                  isScrolled 
                    ? profileDropdownOpen ? 'ring-gray-900' : 'ring-gray-300 hover:ring-gray-400' 
                    : profileDropdownOpen ? 'ring-white' : 'ring-white/50 hover:ring-white/80'
                }`}
                aria-label="Open profile menu"
              >
                <img 
                  src={profilePic}
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </button>
              
  {isLogin && <div className={`absolute right-0 mt-2 w-48 py-2 bg-white rounded-sm shadow-md transition-all duration-200 origin-top-right ${
                profileDropdownOpen 
                  ? 'transform scale-100 opacity-100' 
                  : 'transform scale-95 opacity-0 pointer-events-none'
              }`}>
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{records.firstName} {records.lastName}</p>
                  <p className="text-xs text-gray-500 truncate">{records.email}</p>
                </div>
                
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150">
                  Help
                </button>
                
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150">
                  Account Settings
                </button>
                
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors duration-150" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </div>}
              
            </div>
          </div>
          
          <div className="md:hidden flex items-center space-x-3">
            <button 
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className={`w-8 h-8 rounded-full overflow-hidden ring-2 ${
                isScrolled 
                  ? profileDropdownOpen ? 'ring-gray-900' : 'ring-gray-300' 
                  : profileDropdownOpen ? 'ring-white' : 'ring-white/70'
              }`}
              aria-label="Open profile menu"
            >
              <img 
                src={profilePic}
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </button>
          
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 focus:outline-none"
              aria-label="Toggle menu"
            >
              <div className="w-6 flex flex-col space-y-1.5">
                <span className={`block h-px transition-all duration-300 ease-out ${
                  menuOpen
                    ? 'w-6 translate-y-1.5 rotate-45 bg-gray-900'
                    : isScrolled ? 'w-6 bg-gray-900' : 'w-6 bg-white'
                }`}></span>
                
                <span className={`block h-px transition-all duration-300 ease-out ${
                  menuOpen
                    ? 'w-6 opacity-0'
                    : isScrolled ? 'w-4 bg-gray-900' : 'w-4 bg-white'
                }`}></span>
                
                <span className={`block h-px transition-all duration-300 ease-out ${
                  menuOpen
                    ? 'w-6 -translate-y-1.5 -rotate-45 bg-gray-900'
                    : isScrolled ? 'w-3 bg-gray-900' : 'w-3 bg-white'
                }`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`absolute w-full top-full left-0 right-0 bg-white transition-all duration-300 ${
        menuOpen 
          ? 'opacity-100 translate-y-0 shadow-sm' 
          : 'opacity-0 -translate-y-2 pointer-events-none'
      }`}>
        <div className="max-w-6xl mx-auto px-6 py-4 space-y-2">
          {/* Profile Info - Mobile */}
          {isLogin &&
          <div className="md:hidden border-b border-gray-100 pb-4 mb-2">
            <p className="text-sm font-medium text-gray-900">{records.firstName} {records.lastName}</p>
            <p className="text-xs text-gray-500 truncate">{records.email}</p>
          </div>
          }

          {isLogin &&
  navigationItems
    .filter((item) => item.type === 'all' || item.type === userType)
    .map((item) => {
      const isActive = isPathActive(item.link);
      return (
        <Link
          key={item.id}
          to={item.link}
          onClick={() => setMenuOpen(false)}
          className={`block w-full text-left py-2 text-sm transition-colors duration-200 ${
            isActive ? 'text-gray-900 font-medium' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {item.label}
        </Link>
      );
    })
}


          
          {/* Help & Logout in Mobile Menu */}
     {isLogin && <div className="md:hidden pt-2 mt-2 border-t border-gray-100">
            <button className="block w-full text-left py-2 text-sm text-gray-600 hover:text-gray-900">
              Help
            </button>
            <button className="block w-full text-left py-2 text-sm text-gray-600 hover:text-gray-900">
              Account Settings
            </button>
            <button className="block w-full text-left py-2 text-sm text-red-600 hover:text-red-700" onClick={handleLogout}>
              Logout
            </button>
          </div>}
          
         {!isLogin && <button className="w-full mt-4 py-2 text-sm font-medium bg-gray-900 text-white transition-colors duration-200 hover:bg-gray-800">
            Contact
          </button>}
        </div>
      </div>
      {!isScrolled && (
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-gray-900 to-gray-800" />
      )}
    </nav>
  );
};

export default MinimalistNavbarWithProfile;