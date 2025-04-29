import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Users, Plus, Copy, ClipboardCheck, Code, LogOut, 
  Trash2, AlertTriangle, Shield, Settings, PenTool, ArrowRight, X, BookOpen, Github
} from 'lucide-react';
import OtherContext from '../context/OtherContext';
import { motion } from 'framer-motion';

const TeamDetails = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const { loading: globalLoading } = useContext(OtherContext);
  const [userInfo, setUserInfo] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [editTeamData, setEditTeamData] = useState({
    name: '',
    tagline: '',
    description: ''
  });

  useEffect(() => {
    const userInfoFromStorage = JSON.parse(localStorage.getItem('elex-user') || '{}');
    setUserInfo(userInfoFromStorage);
    fetchTeamDetails();
  }, [teamId]);

  useEffect(() => {
    if (team) {
      setEditTeamData({
        name: team.name || '',
        tagline: team.tagline || '',
        description: team.description || ''
      });
    }
  }, [team]);

  const fetchTeamDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5500/api/team/${teamId}`);
      setTeam(response.data);
    } catch (error) {
      console.error('Error fetching team details:', error);
      toast.error('Failed to load team details');
    } finally {
      setLoading(false);
    }
  };

  const copyTeamCode = () => {
    if (team?.teamCode) {
      navigator.clipboard.writeText(team.teamCode);
      setCopied(true);
      toast.success('Team code copied to clipboard!');
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleLeaveTeam = async () => {
    if (!userInfo?.email) {
      toast.error('You must be logged in to leave a team');
      return;
    }

    try {
      setActionLoading(true);
      const response = await axios.post('http://localhost:5500/api/team/leave', {
        email: userInfo.email,
        teamId
      });

      toast.success('You have left the team');
      navigate('/createteam');
    } catch (error) {
      console.error('Error leaving team:', error);
      toast.error(error.response?.data?.message || 'Failed to leave team');
    } finally {
      setActionLoading(false);
      setShowLeaveConfirm(false);
    }
  };

  const handleDeleteTeam = async () => {
    if (!userInfo?.email) {
      toast.error('You must be logged in to delete a team');
      return;
    }

    try {
      setActionLoading(true);
      const response = await axios.delete('http://localhost:5500/api/team/delete', {
        data: {
          email: userInfo.email,
          teamId
        }
      });

      toast.success('Team deleted successfully');
      navigate('/createteam');
    } catch (error) {
      console.error('Error deleting team:', error);
      toast.error(error.response?.data?.message || 'Failed to delete team');
    } finally {
      setActionLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleEditTeam = async (e) => {
    e.preventDefault();
    
    if (!userInfo?.email) {
      toast.error('You must be logged in to edit the team');
      return;
    }

    if (!editTeamData.name.trim()) {
      toast.error('Team name is required');
      return;
    }

    try {
      setActionLoading(true);
      const response = await axios.post('http://localhost:5500/api/team/edit', {
        teamId,
        name: editTeamData.name,
        tagline: editTeamData.tagline,
        description: editTeamData.description
      });

      toast.success('Team details updated successfully');
      setShowSettingsModal(false);
      
      // Update local team data
      setTeam(prev => ({
        ...prev,
        name: editTeamData.name,
        tagline: editTeamData.tagline,
        description: editTeamData.description
      }));
      
    } catch (error) {
      console.error('Error updating team:', error);
      toast.error(error.response?.data?.message || 'Failed to update team');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading || globalLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-6 pt-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-gray-800 animate-pulse"></div>
            <div className="h-6 bg-gray-800 animate-pulse rounded w-1/4"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3">
              <div className="bg-gray-900 animate-pulse rounded-lg p-8 h-64"></div>
            </div>
            <div className="md:col-span-1">
              <div className="bg-gray-900 animate-pulse rounded-lg p-8 h-64"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-black text-white p-6 pt-24">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gray-900 rounded-lg p-12 border border-gray-800">
              <div className="w-16 h-16 bg-gray-800 rounded-full mx-auto flex items-center justify-center mb-6">
                <AlertTriangle size={28} className="text-amber-400" />
              </div>
              <h2 className="text-2xl font-semibold">Team not found</h2>
              <p className="mt-4 text-gray-400">The team you're looking for doesn't exist or you don't have access.</p>
              <Link to="/createteam" className="mt-6 inline-block bg-purple-700 hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:-translate-y-1">
                Return to Teams
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const isOwner = userInfo?.email === team?.owner?.email;
  const hasProject = !!team.project;
  const isMember = team.members?.some(member => member.email === userInfo?.email);

  // Calculate team member metrics
  const ownerCount = team.members?.filter(member => member._id === team?.owner?._id).length || 0;
  const memberCount = (team.members?.length || 0) - ownerCount;

  // Get initial for team avatar
  const teamInitial = team.name?.charAt(0).toUpperCase() || 'T';

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-20">
      <div className="max-w-6xl mx-auto">
        {/* Header section with team info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-900 rounded-xl flex items-center justify-center text-2xl font-bold text-white">
              {teamInitial}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{team.name}</h1>
              {team.tagline && <p className="text-gray-400 italic mt-1">{team.tagline}</p>}
            </div>
          </div>
          
          {/* Team actions bar */}
          <div className="flex flex-wrap gap-3 mb-6">
            {isOwner && (
              <>
                <button 
                  onClick={() => setShowSettingsModal(true)}
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-lg transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-purple-700/20"
                >
                  <Settings size={16} />
                  <span>Team Settings</span>
                </button>
              </>
            )}
            
            {isOwner ? (
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-red-900/20 hover:bg-red-900/40 text-white rounded-lg transition-all duration-300 flex items-center gap-2 border border-red-900/40 hover:border-red-900"
              >
                <Trash2 size={16} />
                <span>Delete Team</span>
              </button>
            ) : isMember && (
              <button 
                onClick={() => setShowLeaveConfirm(true)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all duration-300 flex items-center gap-2 border border-gray-700 hover:border-red-900/50"
              >
                <LogOut size={16} />
                <span>Leave Team</span>
              </button>
            )}
            
            {/* Team code for owners */}
            {isOwner && (
              <div className="px-4 py-2 bg-gray-900 text-white rounded-lg flex items-center gap-2 border border-gray-800 ml-auto">
                <Code size={16} className="text-purple-400" />
                <span className="font-mono text-sm text-gray-400">Code:</span>
                <span className="font-mono text-sm text-purple-400 font-bold">{team.teamCode}</span>
                <button 
                  onClick={copyTeamCode}
                  className="ml-1 p-1 hover:bg-gray-800 rounded-md transition-colors"
                >
                  {copied ? <ClipboardCheck size={16} className="text-green-500" /> : <Copy size={16} className="text-gray-400 hover:text-white" />}
                </button>
              </div>
            )}
          </div>
          
          {/* Navigation tabs */}
          <div className="flex border-b border-gray-800 mb-6">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                activeTab === 'overview' 
                  ? 'text-white' 
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Overview
              {activeTab === 'overview' && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"
                />
              )}
            </button>
            <button 
              onClick={() => setActiveTab('members')}
              className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                activeTab === 'members' 
                  ? 'text-white' 
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Members
              {activeTab === 'members' && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"
                />
              )}
            </button>
            {/* Resources Tab - Only visible if the team has a project */}
            {hasProject && (
              <Link 
                to={`/team/${teamId}/resources`}
                className="px-4 py-3 text-sm font-medium transition-colors relative text-gray-400 hover:text-gray-300 flex items-center"
              >
                <BookOpen className="h-4 w-4 mr-1.5" />
                Resources
              </Link>
            )}
          </div>
        </motion.div>
        
        {/* Content based on active tab */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Main content area */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="md:col-span-3"
          >
            {activeTab === 'overview' && (
              <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 shadow-xl">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Shield size={18} className="text-purple-400" />
                  <span>About This Team</span>
                </h2>
                
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed">{team.description || "No team description provided."}</p>
                </div>
                
                {/* Team stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="text-gray-400 text-sm mb-1">Members</div>
                    <div className="text-2xl font-bold">{team.members?.length || 0}</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="text-gray-400 text-sm mb-1">Projects</div>
                    <div className="text-2xl font-bold">{team.project ? 1 : 0}</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="text-gray-400 text-sm mb-1">Created</div>
                    <div className="text-lg font-medium">
                      {new Date(team.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
                
                {/* Team Project Preview */}
                {hasProject && (
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <PenTool size={18} className="text-purple-400" />
                      <span>Current Project</span>
                    </h3>
                    
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-all group">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-medium">{team.project.title}</h4>
                          <p className="text-gray-400 mt-2 line-clamp-2">{team.project.description}</p>
                        </div>
                        <Link 
                          to={`/projects/${team.project._id}`}
                          className="px-3 py-1 bg-gray-700 hover:bg-purple-700 text-sm rounded-md transition-colors flex items-center gap-1"
                        >
                          <span>Details</span>
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                      
                      {/* GitHub repo if available */}
                      {team.project.githubRepo && (
                        <div className="mt-4 pt-4 border-t border-gray-700">
                          <a 
                            href={team.project.githubRepo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
                          >
                            <Github size={14} />
                            <span className="text-ellipsis overflow-hidden">{team.project.githubRepo}</span>
                            <ArrowRight size={12} className="ml-auto" />
                          </a>
                        </div>
                      )}
                      
                      {/* Resources Button */}
                      <div className="mt-4 pt-4 border-t border-gray-700 flex justify-end">
                        <Link
                          to={`/team/${teamId}/resources`}
                          className="px-4 py-2 bg-indigo-900/50 hover:bg-indigo-700 text-white rounded flex items-center gap-2 text-sm border border-indigo-700/50 hover:border-indigo-600 transition-all"
                        >
                          <BookOpen size={16} />
                          <span>View Learning Resources</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Create project CTA for owner */}
                {isOwner && !hasProject && (
                  <div className="mt-8 bg-gradient-to-r from-purple-900/30 to-purple-600/20 rounded-lg p-6 border border-purple-900/30">
                    <div className="flex items-center gap-4">
                      <div className="bg-purple-700/30 rounded-full p-3">
                        <Plus size={24} className="text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">Create Your First Project</h3>
                        <p className="text-gray-400 mt-1">Get started by adding a project for your team to collaborate on.</p>
                      </div>
                    </div>
                    <button className="mt-4 w-full md:w-auto bg-purple-700 hover:bg-purple-600 text-white py-2 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-700/30">
                      Create Project
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'members' && (
              <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Users size={18} className="text-purple-400" />
                    <span>Team Members</span>
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {team.members?.map((member) => {
                    // Determine display name
                    let displayName = 'Team Member';
                    if (member.firstName && member.lastName) {
                      displayName = `${member.firstName} ${member.lastName}`;
                    } else if (member.name) {
                      displayName = member.name;
                    } else if (member.firstName) {
                      displayName = member.firstName;
                    } else if (member.lastName) {
                      displayName = member.lastName;
                    }
                    
  
                    const initial = (member.firstName?.charAt(0) || 
                                    member.name?.charAt(0) || 
                                    member.email?.charAt(0) || '?').toUpperCase();
                    
                    return (
                      <div key={member._id} className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-purple-500 transition-all group">
                        <div className="flex items-center gap-3">
                          {member.profilePic ? (
                            <img 
                              src={member.profilePic} 
                              alt={displayName}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center text-sm font-medium group-hover:bg-purple-900/30 transition-colors">
                              {initial}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium truncate">{displayName}</p>
                              {team.owner?._id === member._id && (
                                <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-0.5 rounded-full">Owner</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-400 truncate">{member.email}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
          
          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="md:col-span-1"
          >
            {/* Team Stats Card */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-xl mb-6">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Team Stats</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Members</span>
                  <span className="font-semibold">{team.members?.length || 0}</span>
                </div>
                <div className="h-px bg-gray-800"></div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Owner</span>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span className="font-semibold">{ownerCount}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Team Actions Card */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-xl">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                {isOwner && (
                  <>
                    <button 
                      onClick={() => setShowSettingsModal(true)}
                      className="w-full py-2 px-3 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors flex items-center gap-2 border border-gray-700 hover:border-purple-500"
                    >
                      <Settings size={16} className="text-gray-400" />
                      <span>Team Settings</span>
                    </button>
                  </>
                )}
                
                {isOwner ? (
                  <button 
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full py-2 px-3 bg-red-900/20 hover:bg-red-900/30 text-white text-sm rounded-lg transition-colors flex items-center gap-2 border border-red-900/30 hover:border-red-500"
                  >
                    <Trash2 size={16} className="text-red-400" />
                    <span>Delete Team</span>
                  </button>
                ) : isMember && (
                  <button 
                    onClick={() => setShowLeaveConfirm(true)}
                    className="w-full py-2 px-3 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors flex items-center gap-2 border border-gray-700 hover:border-red-500"
                  >
                    <LogOut size={16} className="text-gray-400" />
                    <span>Leave Team</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Team Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-gray-900 rounded-xl p-6 max-w-md w-full border border-gray-800 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Settings size={20} className="text-purple-400" />
                <span>Team Settings</span>
              </h3>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="p-1 hover:bg-gray-800 rounded-md transition-colors"
              >
                <X size={20} className="text-gray-400 hover:text-white" />
              </button>
            </div>
            
            <form onSubmit={handleEditTeam}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Team Name*</label>
                  <input 
                    type="text" 
                    value={editTeamData.name}
                    onChange={(e) => setEditTeamData({...editTeamData, name: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    placeholder="Enter team name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Tagline</label>
                  <input 
                    type="text" 
                    value={editTeamData.tagline}
                    onChange={(e) => setEditTeamData({...editTeamData, tagline: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    placeholder="A short catchy tagline for your team"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Description</label>
                  <textarea 
                    value={editTeamData.description}
                    onChange={(e) => setEditTeamData({...editTeamData, description: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 h-32 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white resize-none"
                    placeholder="Tell us about your team's mission and goals"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-800">
                <button 
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2 bg-gray-800 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-600 rounded-lg text-white transition-colors"
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Leave Team Confirmation Modal */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-gray-900 rounded-xl p-6 max-w-md w-full border border-gray-800 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-4 text-amber-400">
              <AlertTriangle size={24} />
              <h3 className="text-xl font-medium">Leave Team?</h3>
            </div>
            <p className="text-gray-300 mb-2">
              Are you sure you want to leave <span className="font-semibold text-white">{team.name}</span>?
            </p>
            <p className="text-gray-400 mb-6 text-sm">
              You'll lose access to the team's projects and resources.
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setShowLeaveConfirm(false)} 
                className="px-4 py-2 bg-gray-800 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button 
                onClick={handleLeaveTeam} 
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white flex items-center gap-2 transition-colors"
                disabled={actionLoading}
              >
                {actionLoading ? 'Processing...' : 'Leave Team'}
                {!actionLoading && <LogOut size={16} />}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Team Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-gray-900 rounded-xl p-6 max-w-md w-full border border-gray-800 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-4 text-red-500">
              <AlertTriangle size={24} />
              <h3 className="text-xl font-medium">Delete Team?</h3>
            </div>
            <p className="text-gray-300 mb-2">
              Are you sure you want to delete <span className="font-semibold text-white">{team.name}</span>?
            </p>
            <p className="text-gray-400 mb-2 text-sm">
              This action cannot be undone.
            </p>
            <p className="text-gray-500 mb-6 text-sm">
              All team members will be removed, and any associated projects will be unlinked.
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setShowDeleteConfirm(false)} 
                className="px-4 py-2 bg-gray-800 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteTeam} 
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white flex items-center gap-2 transition-colors"
                disabled={actionLoading}
              >
                {actionLoading ? 'Processing...' : 'Delete Team'}
                {!actionLoading && <Trash2 size={16} />}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TeamDetails;