import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Github, Code, Check } from 'lucide-react';

// SDG options
const sdgOptions = [
  { id: 1, name: "No Poverty" },
  { id: 2, name: "Zero Hunger" },
  { id: 3, name: "Good Health and Well-being" },
  { id: 4, name: "Quality Education" },
  { id: 5, name: "Gender Equality" },
  { id: 6, name: "Clean Water and Sanitation" },
  { id: 7, name: "Affordable and Clean Energy" },
  { id: 8, name: "Decent Work and Economic Growth" },
  { id: 9, name: "Industry, Innovation and Infrastructure" },
  { id: 10, name: "Reduced Inequality" },
  { id: 11, name: "Sustainable Cities and Communities" },
  { id: 12, name: "Responsible Consumption and Production" },
  { id: 13, name: "Climate Action" },
  { id: 14, name: "Life Below Water" },
  { id: 15, name: "Life on Land" },
  { id: 16, name: "Peace, Justice and Strong Institutions" },
  { id: 17, name: "Partnerships for the Goals" },
];

const AddProject = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [teamInfo, setTeamInfo] = useState(null);
  const [loadingTeam, setLoadingTeam] = useState(true);
  const [selectedSdgs, setSelectedSdgs] = useState([]);
  
  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    githubRepo: '',
  });

  // Fetch team info on load
  useEffect(() => {
    const fetchTeamInfo = async () => {
      try {
        setLoadingTeam(true);
        const response = await axios.get(`http://localhost:5500/api/team/${teamId}`);
        setTeamInfo(response.data);
      } catch (error) {
        console.error('Error fetching team details:', error);
        toast.error('Failed to load team details');
      } finally {
        setLoadingTeam(false);
      }
    };

    fetchTeamInfo();
  }, [teamId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleSdg = (sdgId) => {
    setSelectedSdgs(prev => {
      if (prev.includes(sdgId)) {
        return prev.filter(id => id !== sdgId);
      } else {
        return [...prev, sdgId];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const userInfo = JSON.parse(localStorage.getItem('elex-user') || '{}');
    
    if (!userInfo?.email) {
      toast.error('You must be logged in to create a project');
      return;
    }
    
    if (!projectData.title) {
      toast.error('Project title is required');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5500/api/projects/create', {
        ...projectData,
        sdgs: selectedSdgs,
        teamId,
        email: userInfo.email
      });

      toast.success('Project created successfully!');
      navigate(`/team/${teamId}`);
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error(error.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  if (loadingTeam) {
    return (
      <div className="min-h-screen bg-black text-white p-6 mt-8">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse bg-gray-900 rounded-lg p-8">
            <div className="h-8 bg-gray-800 rounded w-1/3 mb-6"></div>
            <div className="h-4 bg-gray-800 rounded w-2/3 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-800 rounded w-full"></div>
              <div className="h-4 bg-gray-800 rounded w-5/6"></div>
              <div className="h-4 bg-gray-800 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!teamInfo) {
    return (
      <div className="min-h-screen bg-black text-white p-6 mt-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold">Team not found</h2>
          <p className="mt-4 text-gray-400">The team you're looking for doesn't exist or you don't have access.</p>
          <Link to="/createteam" className="mt-6 inline-block bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-lg">
            Return to Teams
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 mt-8">
      <div className="max-w-3xl mx-auto">
        <Link to={`/team/${teamId}`} className="inline-flex items-center text-gray-400 hover:text-white mb-6">
          <ArrowLeft size={18} className="mr-2" />
          <span>Back to team</span>
        </Link>

        <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Add Project for {teamInfo.name}</h1>
            <p className="text-gray-400">Create a new project to showcase your team's work</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Project Title*</label>
                <input
                  type="text"
                  name="title"
                  value={projectData.title}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter project title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description*</label>
                <textarea
                  name="description"
                  value={projectData.description}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 h-32 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  placeholder="Describe your project..."
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Thumbnail URL</label>
                <input
                  type="url"
                  name="thumbnail"
                  value={projectData.thumbnail}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="mt-1 text-xs text-gray-500">Provide a URL to an image that represents your project</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <span className="flex items-center gap-2">
                    <Github size={16} />
                    GitHub Repository
                  </span>
                </label>
                <input
                  type="url"
                  name="githubRepo"
                  value={projectData.githubRepo}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://github.com/username/repo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Sustainable Development Goals</label>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                  {sdgOptions.map((sdg) => (
                    <button
                      type="button"
                      key={sdg.id}
                      onClick={() => toggleSdg(sdg.id)}
                      className={`text-left p-2 rounded-md flex items-center gap-2 transition-colors ${
                        selectedSdgs.includes(sdg.id)
                          ? 'bg-purple-900/50 border border-purple-500'
                          : 'bg-gray-800 border border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <span className={`h-5 w-5 flex items-center justify-center rounded-full text-xs ${
                        selectedSdgs.includes(sdg.id) ? 'bg-purple-600' : 'bg-gray-700'
                      }`}>
                        {selectedSdgs.includes(sdg.id) ? <Check size={12} /> : sdg.id}
                      </span>
                      <span className="text-sm">{sdg.name}</span>
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-gray-500">Select all SDGs that your project addresses</p>
              </div>

              <div className="flex items-center justify-end mt-8 pt-4 border-t border-gray-800">
                <Link
                  to={`/team/${teamId}`}
                  className="mr-4 px-4 py-2 text-gray-400 hover:text-white"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-lg flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Create Project'}
                  {!loading && <Code size={18} />}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProject; 