// components/TeamCreation.jsx
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const TeamCreation = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [teamData, setTeamData] = useState({
    name: '',
    tagline: '',
    description: ''
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!teamData.name.trim()) {
      toast.error('Team name is required');
      return;
    }
    
    setLoading(true);
    try {
      const userInfo = JSON.parse(localStorage.getItem('elex-user'));
      if (!userInfo || !userInfo.email) {
        toast.error('You must be logged in to create a team');
        return;
      }

      const response = await axios.post('http://localhost:5500/api/team/create', {
        name: teamData.name,
        tagline: teamData.tagline,
        description: teamData.description,
        email: userInfo.email
      });

      if (response.data.team) {
        toast.success('Team created successfully!');
        // Navigate to team details page
        navigate(`/team/${response.data.team._id}`);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to create team');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Create a New Team</h2>
        <p className="text-zinc-400">Start collaborating with your colleagues by creating a new team</p>
      </div>
      
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-zinc-300">Team Name*</label>
          <input 
            type="text" 
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-black text-white"
            placeholder="Enter team name"
            value={teamData.name}
            onChange={(e) => setTeamData({...teamData, name: e.target.value})}
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-zinc-300">Tagline</label>
          <input 
            type="text" 
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-black text-white"
            placeholder="A short catchy tagline for your team"
            value={teamData.tagline}
            onChange={(e) => setTeamData({...teamData, tagline: e.target.value})}
          />
        </div>
        
        <div className="mb-8">
          <label className="block text-sm font-medium mb-2 text-zinc-300">Description</label>
          <textarea 
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 h-32 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-black text-white resize-none"
            placeholder="What is this team working on?"
            value={teamData.description}
            onChange={(e) => setTeamData({...teamData, description: e.target.value})}
          />
          <p className="mt-2 text-xs text-zinc-500">Provide details about the project and team's objectives</p>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-xs text-zinc-500">* Required fields</p>
          <button 
            type="submit"
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Team'}
            {!loading && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TeamCreation;