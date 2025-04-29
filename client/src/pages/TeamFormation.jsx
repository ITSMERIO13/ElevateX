import { useState, useEffect, useContext } from 'react';
import { UserPlus, Users, Send, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import ShinyText from '../animations/ShinetText';
import OtherContext from '../context/OtherContext';
import TeamCreation from '../components/TeamCreation';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function TeamManagement() {
  const [selectedOption, setSelectedOption] = useState('create');
  const { fetchAllTeams, teams, loading, error } = useContext(OtherContext);
  const [userTeam, setUserTeam] = useState(null);
  const [loadingUserTeam, setLoadingUserTeam] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllTeams();
    checkUserTeam();
  }, []);

  const checkUserTeam = async () => {
    try {
      setLoadingUserTeam(true);
      const userInfo = JSON.parse(localStorage.getItem('elex-user') || '{}');
      
      if (userInfo?.email) {
        const response = await axios.post('http://localhost:5500/api/team/check', {
          email: userInfo.email
        });
        
        if (response.data.success && response.data.team) {
          setUserTeam(response.data.team);
          navigate(`/team/${response.data.team._id}`);
        }
      }
    } catch (error) {
      console.error('Error checking user team:', error);
    } finally {
      setLoadingUserTeam(false);
    }
  };

  const handleJoinTeam = async (teamCode) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('elex-user') || '{}');
      
      if (!userInfo?.email) {
        toast.error('You must be logged in to join a team');
        return;
      }
      
      const response = await axios.post('http://localhost:5500/api/team/join-code', {
        email: userInfo.email,
        teamCode
      });
      
      if (response.data.team) {
        toast.success('Successfully joined team!');
        navigate(`/team/${response.data.team._id}`);
      }
    } catch (error) {
      console.error('Error joining team:', error);
      toast.error(error.response?.data?.message || 'Failed to join team');
    }
  };

  if (loadingUserTeam) {
    return (
      <div className="min-h-screen bg-black text-white p-6 mt-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 mt-8">
      {/* Top Section */}
      <div className="min-h-[30vh] flex items-center justify-center text-center px-6 bg-black">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="relative"
        >
          <div className="flex flex-col md:text-5xl items-center justify-center text-3xl">
            <p className="custom">Not joined a team?</p>
            <p className="custom">Join one or create your own!</p>
          </div>

          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-500/10 to-transparent animate-shimmer pointer-events-none" />

          <p className="text-neutral-400 text-lg mt-6 flex items-center justify-center gap-2">
            <Users className="text-gray-400" size={22} />
            <ShinyText text="Let's build something epic together." disabled={false} speed={3} className="custom" />
          </p>
        </motion.div>
      </div>

      {/* Form Section */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/4 bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h2 className="text-xl font-semibold mb-6">Options</h2>

          <div className="flex flex-col gap-4">
            <button
              className={`flex items-center p-4 rounded-lg transition-all ${
                selectedOption === 'create'
                  ? 'bg-purple-700 text-white'
                  : 'bg-gray-900 border border-gray-800 hover:border-purple-500'
              }`}
              onClick={() => setSelectedOption('create')}
            >
              <Users className="mr-3" size={20} />
              <span>Create Team</span>
            </button>

            <button
              className={`flex items-center p-4 rounded-lg transition-all ${
                selectedOption === 'join'
                  ? 'bg-purple-700 text-white'
                  : 'bg-gray-900 border border-gray-800 hover:border-purple-500'
              }`}
              onClick={() => setSelectedOption('join')}
            >
              <UserPlus className="mr-3" size={20} />
              <span>Join Team</span>
            </button>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="lg:w-3/4 bg-gray-900 rounded-lg p-6 border border-gray-800">
          {selectedOption === 'create' ? (
            <TeamCreation />
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-6">Join Existing Team</h2>
              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const teamCode = formData.get('teamCode');
                if (teamCode) handleJoinTeam(teamCode);
              }}>
                <div>
                  <label className="block text-sm font-medium mb-2">Team Code</label>
                  <input
                    type="text"
                    name="teamCode"
                    className="w-full bg-black border border-gray-800 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., ABC123"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="bg-purple-700 hover:bg-purple-800 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center transition-colors"
                >
                  Request to Join
                  <Send className="ml-2" size={18} />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Existing Teams Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Available Teams</h2>

        {loading ? (
          <p className="text-gray-400">Loading teams...</p>
        ) : error ? (
          <p className="text-red-500">Error loading teams.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams?.map((team) => (
              <div
                key={team._id}
                className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-purple-500 transition-all"
              >
                <h3 className="text-xl font-medium mb-2">{team.name}</h3>
                <p className="text-gray-400 mb-1">{team.tagline}</p>
                <p className="text-gray-400 mb-4 text-sm">{team.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">{team.members?.length || 0} members</span>
                  <button 
                    onClick={() => handleJoinTeam(team.teamCode)}
                    className="bg-black hover:bg-purple-700 text-white text-sm py-2 px-4 rounded flex items-center transition-colors border border-gray-800"
                  >
                    Request to Join <Send className="ml-2" size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
