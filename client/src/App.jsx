import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import AnimatedNavbar from './components/Navbar';
import BasicFooter from './components/Footer';
import AuthComponent from './pages/Authway';
import NotFound from './pages/NotFound';
import ProjectList from './pages/ProjectList';
import ProjectDetails from './pages/ProjectDetails';
import OTPInput from './components/OtpSection';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import MentorLanding from './pages/MentorLanding';
import TeamFormation from './pages/TeamFormation';
import TeamForm from './pages/TeamForm';
import TeamDetails from './pages/TeamDetails';
import AddProject from './pages/AddProject';
import Landing from './pages/LandingPage';
import AdminSetup from './pages/AdminSetup';
import AdminDashboard from './pages/AdminDashboard';
import MentorDashboard from './pages/MentorDashboard';
import MentorTeamView from './pages/MentorTeamView';
import MentorResourceManager from './pages/MentorResourceManager';
import StudentTeamResources from './pages/StudentTeamResources';
import ProjectNews from './pages/ProjectNews';
import About from './pages/About';
// import ResumeBuilder from './pages/ResumeBuilder';
// import InterView from './pages/Interview';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('elex-user');
    setIsLoggedIn(!!user);
    setIsLoading(false);
  }, []);

  const ProtectedRoute = ({ children }) => {
    if (isLoading) {
      return <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>;
    }
    
    if (!isLoggedIn) {
      return <Navigate to="/auth" />;
    }
    
    return children;
  };

  const AuthRoute = ({ children }) => {
    if (isLoading) {
      return <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>;
    }
    
    if (isLoggedIn) {
      return <Navigate to="/" />;
    }
    
    return children;
  };

  return (
    <Router>
      <Toaster />
      <div className="flex flex-col min-h-screen">
        <AnimatedNavbar />
        <main className="flex-grow my-10">
          <Routes>
            <Route path="/auth" element={<AuthRoute><AuthComponent /></AuthRoute>} />
            <Route path="/admin-setup" element={<AuthRoute><AdminSetup /></AuthRoute>} />
            <Route path="/otp" element={<OTPInput type={'student'}/>} />
            <Route path="/otpmentor" element={<OTPInput type={'mentor'}/>} />
            <Route path="/" element={<ProtectedRoute><Landing /></ProtectedRoute>} />
            <Route path="/about" element={<About />} />
            <Route path="/mentorlanding" element={<ProtectedRoute><MentorLanding /></ProtectedRoute>} />
            <Route path="/mentor-dashboard" element={<ProtectedRoute><MentorDashboard /></ProtectedRoute>} />
            <Route path="/mentor/team/:teamId" element={<ProtectedRoute><MentorTeamView /></ProtectedRoute>} />
            <Route path="/mentor/resources" element={<ProtectedRoute><MentorResourceManager /></ProtectedRoute>} />
            <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/createteam" element={<ProtectedRoute><TeamFormation /></ProtectedRoute>} />
            <Route path="/teamform" element={<ProtectedRoute><TeamForm /></ProtectedRoute>} />
            {/* <Route path="/resume" element={<ProtectedRoute><ResumeBuilder/></ProtectedRoute>} /> */}
            {/* <Route path="/interview" element={<ProtectedRoute><InterView/></ProtectedRoute>} /> */}
            <Route path="/team/:teamId" element={<ProtectedRoute><TeamDetails /></ProtectedRoute>} />
            <Route path="/team/:teamId/resources" element={<ProtectedRoute><StudentTeamResources /></ProtectedRoute>} />
            <Route path="/team/:teamId/news" element={<ProtectedRoute><ProjectNews /></ProtectedRoute>} />
            <Route path="/add-project/:teamId" element={<ProtectedRoute><AddProject /></ProtectedRoute>} />
            <Route path="/viewproject" element={<ProtectedRoute><ProjectList /></ProtectedRoute>} />
            <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <BasicFooter />
      </div>
    </Router>
  );
}

export default App;
