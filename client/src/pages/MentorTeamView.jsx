import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Users, GitCommit, GitPullRequestArrow, 
  Bug, Star, GitFork, Code, BookOpen, Calendar, 
  Github, BarChart3, RefreshCw, User
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';

const MentorTeamView = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [githubStats, setGithubStats] = useState(null);
  const [loadingGithub, setLoadingGithub] = useState(false);
  const [mentor, setMentor] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const mentorData = JSON.parse(localStorage.getItem("elex-user"));
    if (!mentorData) {
      toast.error("Please login first");
      navigate('/auth');
      return;
    }
    setMentor(mentorData);
    
    fetchTeamDetails();
  }, [teamId]);

  const fetchTeamDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5500/api/team/${teamId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch team details');
      }
      const data = await response.json();
      
      console.log('Team data received:', {
        teamName: data.name,
        owner: data.owner ? data.owner._id : 'No owner',
        membersCount: data.members ? data.members.length : 0,
        members: data.members ? data.members.map(m => ({ 
          id: m._id, 
          name: `${m.firstName} ${m.lastName}`,
          isOwner: data.owner && m._id === data.owner._id
        })) : []
      });
      
      setTeam(data);
      
      // After getting team details, fetch GitHub stats if there's a repo
      if (data.project?.githubRepo) {
        fetchGithubStats();
      }
    } catch (error) {
      console.error('Error fetching team details:', error);
      toast.error(error.message || 'Failed to load team details');
    } finally {
      setLoading(false);
    }
  };

  const fetchGithubStats = async () => {
    try {
      setLoadingGithub(true);
      const response = await fetch(
        `http://localhost:5500/api/auth/mentor/team-github-stats/${teamId}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch GitHub stats');
      }
      const data = await response.json();
      
      // Check if we got fallback stats instead of real GitHub stats
      if (!data.stats && data.fallbackStats) {
        toast.error('Using fallback GitHub statistics - some data may be limited');
        setGithubStats({
          ...data,
          stats: data.fallbackStats
        });
      } else {
        setGithubStats(data);
      }
    } catch (error) {
      console.error('Error fetching GitHub stats:', error);
      toast.error('Failed to load GitHub statistics');
      
      // Generate mock data if the API fails (for development purposes)
      if (team?.project?.githubRepo) {
        setGithubStats({
          repositoryUrl: team.project.githubRepo,
          stats: {
            name: team.project.githubRepo.split('/').pop(),
            fullName: team.project.githubRepo.replace('https://github.com/', ''),
            stars: Math.floor(Math.random() * 100),
            forks: Math.floor(Math.random() * 25),
            openIssuesCount: Math.floor(Math.random() * 10),
            language: ['JavaScript', 'Python', 'Java', 'TypeScript'][Math.floor(Math.random() * 4)],
            updatedAt: new Date().toISOString()
          }
        });
      }
    } finally {
      setLoadingGithub(false);
    }
  };

  const refreshGithubStats = () => {
    if (team?.project?.githubRepo) {
      fetchGithubStats();
    } else {
      toast.error('No GitHub repository linked to this project');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 w-32 bg-gray-800 rounded-md animate-pulse mb-8"></div>
          <div className="h-12 w-64 bg-gray-800 rounded-md animate-pulse mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-gray-800 rounded-lg h-64 animate-pulse mb-8"></div>
              <div className="bg-gray-800 rounded-lg h-96 animate-pulse"></div>
            </div>
            <div>
              <div className="bg-gray-800 rounded-lg h-64 animate-pulse mb-8"></div>
              <div className="bg-gray-800 rounded-lg h-40 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto text-center py-16">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-12 max-w-lg mx-auto">
            <div className="w-16 h-16 bg-red-900/30 rounded-full mx-auto flex items-center justify-center mb-6">
              <Users className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Team Not Found</h2>
            <p className="text-gray-300 mb-8">
              The team you're looking for doesn't exist or you may not have access to view it.
            </p>
            <Link to="/mentor-dashboard" className="inline-flex items-center px-5 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-medium">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <Link 
          to="/mentor-dashboard" 
          className="inline-flex items-center text-indigo-400 hover:text-indigo-300 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Mentor Dashboard
        </Link>

        {/* Team Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{team.name}</h1>
            {team.tagline && (
              <p className="text-gray-300 italic">{team.tagline}</p>
            )}
          </div>
          <div className="mt-4 md:mt-0 bg-gray-800/50 border border-gray-700 px-3 py-1 rounded text-sm text-gray-300">
            Team Code: <span className="font-mono font-medium text-indigo-300">{team.teamCode}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700 mb-8">
          <div className="flex space-x-6">
            <button
              className={`py-3 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`py-3 border-b-2 font-medium text-sm ${
                activeTab === 'repository'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('repository')}
            >
              Repository
            </button>
            <button
              className={`py-3 border-b-2 font-medium text-sm ${
                activeTab === 'members'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('members')}
            >
              Team Members
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <div>
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-indigo-400" />
                    Team Description
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    {team.description || "This team hasn't added a description yet."}
                  </p>
                </div>

                {/* Project Information */}
                {team.project ? (
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-white flex items-center">
                        <Code className="h-5 w-5 mr-2 text-indigo-400" />
                        Project: {team.project.title}
                      </h2>
                      <Link
                        to={`/project/${team.project._id}`}
                        className="text-sm text-indigo-400 hover:text-indigo-300"
                      >
                        View Project
                      </Link>
                    </div>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      {team.project.description}
                    </p>

                    {/* GitHub Repository */}
                    {team.project.githubRepo && (
                      <div className="border-t border-gray-700 pt-6 mt-6">
                        <a
                          href={team.project.githubRepo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mb-4 flex items-center gap-3 px-4 py-3 bg-gray-700 hover:bg-indigo-600 transition-colors duration-300 rounded-md text-center justify-center"
                        >
                          <Github size={20} />
                          <span>View GitHub Repository</span>
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center">
                    <Code className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No Project Added</h3>
                    <p className="text-gray-400">
                      This team hasn't created a project yet.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'repository' && (
              <div>
                {team.project?.githubRepo ? (
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-white flex items-center">
                        <Github className="h-5 w-5 mr-2 text-indigo-400" />
                        GitHub Repository
                      </h2>
                      <button 
                        onClick={refreshGithubStats}
                        className="p-2 text-gray-400 hover:text-indigo-400 rounded-full hover:bg-gray-700"
                        disabled={loadingGithub}
                      >
                        <RefreshCw className={`h-4 w-4 ${loadingGithub ? 'animate-spin' : ''}`} />
                      </button>
                    </div>

                    {/* Show error message when using fallback stats */}
                    {githubStats?.error && (
                      <div className="mb-6 p-3 bg-red-900/30 border border-red-800 rounded-md">
                        <p className="text-red-300 text-sm">
                          <span className="font-medium">GitHub API Error:</span> Using limited stats. 
                          Some GitHub features may be unavailable.
                        </p>
                      </div>
                    )}

                    {loadingGithub ? (
                      <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-gray-700 rounded w-3/4"></div>
                        <div className="h-24 bg-gray-700 rounded"></div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="h-12 bg-gray-700 rounded"></div>
                          <div className="h-12 bg-gray-700 rounded"></div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <a
                          href={team.project.githubRepo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mb-6 flex items-center text-white hover:text-indigo-300"
                        >
                          <span className="font-mono font-medium break-all">
                            {githubStats?.stats?.fullName || team.project.githubRepo.replace('https://github.com/', '')}
                          </span>
                          <ArrowLeft className="h-4 w-4 ml-2 rotate-225" />
                        </a>

                        {githubStats && (
                          <>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                              <div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center justify-center">
                                <div className="flex items-center text-gray-300 mb-1">
                                  <Star className="h-4 w-4 mr-1 text-yellow-400" />
                                  <span className="text-xs">Stars</span>
                                </div>
                                <span className="text-2xl font-bold text-white">
                                  {githubStats.stats.stars || 0}
                                </span>
                              </div>
                              <div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center justify-center">
                                <div className="flex items-center text-gray-300 mb-1">
                                  <GitFork className="h-4 w-4 mr-1 text-blue-400" />
                                  <span className="text-xs">Forks</span>
                                </div>
                                <span className="text-2xl font-bold text-white">
                                  {githubStats.stats.forks || 0}
                                </span>
                              </div>
                              <div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center justify-center">
                                <div className="flex items-center text-gray-300 mb-1">
                                  <Bug className="h-4 w-4 mr-1 text-red-400" />
                                  <span className="text-xs">Issues</span>
                                </div>
                                <span className="text-2xl font-bold text-white">
                                  {githubStats.stats.openIssuesCount || 0}
                                </span>
                              </div>
                              <div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center justify-center">
                                <div className="flex items-center text-gray-300 mb-1">
                                  <Code className="h-4 w-4 mr-1 text-green-400" />
                                  <span className="text-xs">Language</span>
                                </div>
                                <span className="text-lg font-bold text-white truncate w-full text-center">
                                  {githubStats.stats.language || 'Unknown'}
                                </span>
                              </div>
                            </div>

                            <div className="flex justify-between items-center text-sm text-gray-400 border-t border-gray-700 pt-4">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                Last updated: {
                                  githubStats.stats.updatedAt 
                                    ? format(parseISO(githubStats.stats.updatedAt), 'MMM d, yyyy')
                                    : 'Unknown'
                                }
                              </div>
                              <div>
                                <span className="bg-gray-700 px-2 py-1 rounded text-xs">
                                  {githubStats.stats.name}
                                </span>
                              </div>
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
                    <Github className="h-16 w-16 mx-auto text-gray-500 mb-4" />
                    <h3 className="text-xl font-medium text-white mb-3">No Repository Linked</h3>
                    <p className="text-gray-400 mb-6 max-w-md mx-auto">
                      This team hasn't linked a GitHub repository to their project yet.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'members' && (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-indigo-400" />
                  Team Members ({team.members ? team.members.length : 0})
                </h2>

                <div className="space-y-6">
                  {/* Team Owner */}
                  <div className="flex items-start space-x-4 pb-4 border-b border-gray-700">
                    <div className="flex-shrink-0">
                      <img 
                        src={team.owner.profilePic} 
                        alt={`${team.owner.firstName} ${team.owner.lastName}`}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-1">
                        <h3 className="text-md font-medium text-white truncate">
                          {team.owner.firstName} {team.owner.lastName}
                        </h3>
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-900 text-indigo-300">
                          Owner
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 truncate">{team.owner.email}</p>
                    </div>
                  </div>

                  {/* Team Members */}
                  {team.members && team.members.length > 0 ? (
                    <div className="space-y-4">
                      {team.members.map(member => {
                        // Skip the owner if they're already in the members array
                        if (member._id === team.owner._id) return null;
                        
                        return (
                          <div key={member._id} className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              <img 
                                src={member.profilePic} 
                                alt={`${member.firstName} ${member.lastName}`}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-md font-medium text-white truncate">
                                {member.firstName} {member.lastName}
                              </h3>
                              <p className="text-sm text-gray-400 truncate">{member.email}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-400">No other members in this team yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            {/* Mentor Information */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-indigo-400" />
                Assigned Mentor
              </h2>
              
              <div className="flex items-center space-x-4">
                <img 
                  src={mentor?.profilePic} 
                  alt={`${mentor?.firstName} ${mentor?.lastName}`}
                  className="h-14 w-14 rounded-full object-cover border-2 border-indigo-500"
                />
                <div>
                  <h3 className="text-md font-medium text-white">
                    {mentor?.firstName} {mentor?.lastName}
                  </h3>
                  <p className="text-sm text-gray-400">{mentor?.email}</p>
                </div>
              </div>

              {mentor?.expertise && mentor.expertise.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-2">Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {mentor.expertise.map((skill, index) => (
                      <span 
                        key={index}
                        className="bg-gray-700 text-sm px-2 py-1 rounded text-gray-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Quick Stats */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-indigo-400" />
                Team Stats
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Team Members:</span>
                  <span className="font-medium text-white">{
                    team.members ? team.members.length : 0
                  }</span>
                </div>
                
                {githubStats && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">GitHub Collaborators:</span>
                      <span className="font-medium text-white">
                        {githubStats.stats.collaborators || 'N/A'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Commits:</span>
                      <span className="font-medium text-white">
                        {githubStats.stats.totalCommits || 'N/A'}
                      </span>
                    </div>
                  </>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Created:</span>
                  <span className="font-medium text-white">
                    {new Date(team.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Last Activity:</span>
                  <span className="font-medium text-white">
                    {new Date(team.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                
                {team.project && (
                  <>
                    <div className="border-t border-gray-700 my-4"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Project:</span>
                      <span className="font-medium text-white">{team.project.title}</span>
                    </div>
                    
                    {githubStats && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Repository:</span>
                          <span className="font-medium text-white">{githubStats.stats.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Language:</span>
                          <span className="font-medium text-white">{githubStats.stats.language || 'N/A'}</span>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorTeamView;